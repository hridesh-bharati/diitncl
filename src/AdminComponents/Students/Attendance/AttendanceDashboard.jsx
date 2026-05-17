import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import AdmissionProvider from "../../Admissions/AdmissionProvider";

// staticCourses डेटाबेस इम्पोर्ट
import { staticCourses } from "../../../Components/HomePage/pages/Course/courseData";

const getISODate = (date = new Date()) => date.toISOString().split("T")[0];

const generateWeeklyMap = () => {
  const map = {};
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    map[getISODate(d)] = { total: 0, present: 0 };
  }
  return map;
};

// रियल कोर्स के महीनों के आधार पर कुल दिन कैलकुलेट करने का ग्लोबल फंक्शन
const getCourseTotalDays = (courseName) => {
  if (!courseName) return 450;
  const found = staticCourses.find(
    (c) => c.name?.toUpperCase().trim() === courseName.toUpperCase().trim()
  );
  if (!found) {
    const fallbackDurations = { "ADCA": 450, "DCA": 180, "CCC": 90, "N/A": 365 };
    return fallbackDurations[courseName.toUpperCase().trim()] || 450;
  }
  const durationMonths = parseInt(found.duration) || 12;
  return durationMonths * 30; // 1 महीना = 30 दिन के अनुपात में
};

export default function AttendanceDashboard() {
  const [branch, setBranch] = useState("DIIT124");
  const [weekly, setWeekly] = useState([]);
  const [monthlyReport, setMonthlyReport] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, avg: 0, pending: 0 });
  const [attendanceDocs, setAttendanceDocs] = useState([]);
  const [manualStatsMap, setManualStatsMap] = useState({});

  const today = useMemo(() => getISODate(), []);

  useEffect(() => {
    const attendanceQuery = query(collection(db, "attendance"), where("branch", "==", branch));
    const unsubAttendance = onSnapshot(attendanceQuery, (snap) => {
      setAttendanceDocs(snap.docs.map((d) => d.data()));
    });

    getDocs(collection(db, "manual_attendance_stats")).then((manualSnap) => {
      const mStats = {};
      manualSnap.forEach((docSnap) => {
        mStats[docSnap.id] = docSnap.data();
      });
      setManualStatsMap(mStats);
    });

    return () => unsubAttendance();
  }, [branch]);

  // ✅ सुधार: पहले Percentage से सॉर्ट करें, अगर Percentage बराबर हो तो जिसका PRESENT ज्यादा है वो ऊपर रहेगा
  const getSortedPerformers = (isLow = false) => {
    return [...monthlyReport]
      .sort((a, b) => {
        const percentA = parseFloat(a.percentage) || 0;
        const percentB = parseFloat(b.percentage) || 0;
        
        if (isLow) {
          if (percentA !== percentB) return percentA - percentB;
          return (a.present || 0) - (b.present || 0); // कम प्रेज़ेंट वाला पहले
        } else {
          if (percentA !== percentB) return percentB - percentA;
          return (b.present || 0) - (a.present || 0); // ज़्यादा प्रेज़ेंट वाला ऊपर 🏆
        }
      })
      .slice(0, 5);
  };

  const cards = [
    { title: "Today's Mark", icon: "bi-pencil-square", link: "/admin/students/attendance/mark", value: `${stats.present}/${stats.total}`, gradient: "linear-gradient(135deg,#4f46e5,#6366f1)" },
    { title: "Weekly Avg", icon: "bi-bar-chart-line", link: "/admin/students/attendance/analytics", value: `${stats.avg}%`, gradient: "linear-gradient(135deg,#059669,#10b981)" },
    { title: "Students", icon: "bi-people-fill", link: "/admin/students/attendance/summary", value: stats.total, gradient: "linear-gradient(135deg,#0891b2,#06b6d4)" },
  ];

  return (
    <AdmissionProvider>
      {({ admissions = [] }) => {
        React.useEffect(() => {
          const activeStudents = admissions.filter((s) => {
            return (s.branch === branch || s.centerCode === branch) && !["canceled", "pending"].includes(s.status?.toLowerCase());
          });

          const studentsMap = {};
          activeStudents.forEach(s => { studentsMap[s.id] = s; });

          const weeklyMap = generateWeeklyMap();
          let todayPresent = 0;
          let todayMarked = 0;
          let allRecords = {};
          let globalPresentDays = 0;
          let globalTotalDays = 0;

          // सभी एक्टिव स्टूडेंट्स का बेस स्ट्रक्चर रियल कोर्स ड्यूरेशन के साथ तैयार करें
          activeStudents.forEach((s) => {
            const dynamicTotalDays = getCourseTotalDays(s.course);
            
            if (manualStatsMap[s.id]) {
              const m = manualStatsMap[s.id];
              allRecords[s.id] = {
                id: s.id,
                name: s.name,
                photoUrl: s.photoUrl || "",
                present: (m.present || 0) + ((m.half || 0) * 0.5),
                total: dynamicTotalDays
              };
            } else {
              allRecords[s.id] = { 
                id: s.id, 
                name: s.name, 
                photoUrl: s.photoUrl || "", 
                present: 0, 
                total: dynamicTotalDays // ✅ फिक्स: यहाँ शुरू से ही रियल कुल दिन (उदा. 360) असाइन होंगे, 0 या 1 नहीं!
              };
            }
          });

          attendanceDocs.forEach((docData) => {
            const dateKey = docData.date;
            const records = docData.records || [];
            if (docData.status === "Holiday") return;

            records.forEach((r) => {
              if (!studentsMap[r.id]) return;

              const statusLower = r.status ? r.status.toLowerCase() : "";
              const weight = statusLower === "present" ? 1 : statusLower === "half" ? 0.5 : 0;

              if (weeklyMap[dateKey]) {
                weeklyMap[dateKey].total++;
                weeklyMap[dateKey].present += weight;
              }

              if (dateKey === today) {
                todayMarked++;
                todayPresent += weight;
              }

              // यदि मैन्युअल एंट्री नहीं है, तो सिर्फ उपस्थिति (Present) डेज बढ़ाएं
              if (!manualStatsMap[r.id]) {
                allRecords[r.id].present += weight;
              }
            });
          });

          Object.values(allRecords).forEach((item) => {
            globalPresentDays += item.present;
            globalTotalDays += item.total;
          });

          const formattedWeeklyArray = Object.keys(weeklyMap)
            .reverse()
            .map((date) => {
              const { total, present } = weeklyMap[date];
              return {
                day: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
                val: total ? Math.round((present / total) * 100) : 0,
              };
            });

          setWeekly(formattedWeeklyArray);

          // फाइनल रिपोर्ट फ़ॉर्मेटिंग
          const monthlyData = Object.values(allRecords).map((s) => {
            const rawPercentage = s.total ? (s.present / s.total) * 100 : 0;
            return {
              ...s,
              percentage: Math.min(Math.round(rawPercentage), 100).toFixed(1)
            };
          });
          setMonthlyReport(monthlyData);

          const overallAvg = globalTotalDays ? (globalPresentDays / globalTotalDays) * 100 : 0;

          setStats({
            total: activeStudents.length,
            present: todayPresent,
            pending: Math.max(0, activeStudents.length - todayMarked),
            avg: overallAvg.toFixed(1),
          });

        }, [admissions, attendanceDocs, manualStatsMap, branch, today]);

        return (
          <div className="container-fluid py-2 px-2 px-md-4">
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-3 mt-md-2">
              <div>
                <h4 className="fw-bold mb-0 text-dark" style={{fontSize: "clamp(18px, 2vw, 24px)"}}>Attendance Dashboard</h4>
                <small className="text-muted d-none d-sm-inline" style={{fontSize: "12px"}}>Real-time student analysis</small>
              </div>
              <div className="btn-group btn-group-sm rounded-pill overflow-hidden shadow-sm border">
                {["DIIT124", "DIIT125"].map((b) => (
                  <button key={b} onClick={() => setBranch(b)} className={`btn px-3 px-md-4 fw-bold ${branch === b ? "btn-dark" : "btn-light text-dark"}`} style={{fontSize: "13px"}}>
                    {b === "DIIT124" ? "Main Branch" : "East Branch"}
                  </button>
                ))}
              </div>
            </div>

            {/* TOP CARDS */}
            <div className="row g-2 g-md-3 mb-3 mb-md-4">
              {cards.map((c, i) => (
                <div className="col-4" key={i}>
                  <Link to={c.link} className="text-decoration-none">
                    <div className="card border-0 shadow-sm text-white text-center position-relative overflow-hidden" style={{ borderRadius: "16px", background: c.gradient }}>
                      <div className="card-body p-2 p-md-3 position-relative" style={{zIndex: 2}}>
                        <i className={`bi ${c.icon} d-block mb-1`} style={{fontSize: "clamp(16px, 2.5vw, 22px)", opacity: 0.9}} />
                        <div className="text-uppercase fw-semibold mb-md-1" style={{ fontSize: "clamp(9px, 1.2vw, 11px)", letterSpacing: "0.5px", opacity: 0.85 }}>{c.title}</div>
                        <div className="fw-bold" style={{fontSize: "clamp(15px, 2.8vw, 22px)"}}>{c.value}</div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* ROW 1: WEEKLY REPORT & QUICK SUMMARY */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-lg-6">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-3 p-md-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fw-bold text-dark" style={{fontSize: "clamp(14px, 1.8vw, 16px)"}}>Weekly Report</span>
                      <span className="badge bg-success-subtle text-success rounded-pill px-2.5 py-1.5" style={{fontSize: "11px"}}>{stats.avg}% Avg</span>
                    </div>
                    <div className="row g-1">
                      {weekly.map((d, i) => (
                        <div className="col" key={i}>
                          <div className="p-1.5 bg-light text-center rounded-3">
                            <div className="text-muted mb-1 fw-medium" style={{fontSize: "10px"}}>{d.day}</div>
                            <div className="progress rounded-pill bg-secondary-subtle" style={{ height: "6px" }}>
                              <div className={`progress-bar ${d.val >= 75 ? "bg-success" : d.val >= 50 ? "bg-warning" : "bg-danger"}`} style={{ width: `${d.val}%` }} />
                            </div>
                            <div className="fw-bold mt-1" style={{fontSize: "11px"}}>{d.val}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-6">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-3 p-md-4 d-flex flex-column justify-content-center gap-2.5">
                    <span className="fw-bold text-dark d-block mb-1" style={{fontSize: "clamp(14px, 1.8vw, 16px)"}}>Quick Summary</span>
                    <div className="d-flex justify-content-between align-items-center p-2.5 rounded-3" style={{ background: "#fff7ed" }}>
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-clock-history text-warning fs-5" />
                        <span className="fw-bold text-dark-emphasis" style={{fontSize: "13px"}}>Pending Marks</span>
                      </div>
                      <span className="fw-bold text-warning fs-5">{stats.pending}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center p-2.5 rounded-3" style={{ background: "#eff6ff" }}>
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-building text-primary fs-5" />
                        <span className="fw-bold text-dark-emphasis" style={{fontSize: "13px"}}>Active Branch</span>
                      </div>
                      <span className="fw-bold text-primary" style={{fontSize: "14px"}}>{branch === "DIIT124" ? "Main Office" : "East Wing"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: STUDENTS DATA LISTS */}
            <div className="row g-3">
              {/* 🏆 TOP PERFORMERS */}
              <div className="col-12 col-lg-6">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-3 p-md-4">
                    <span className="fw-bold text-dark d-block mb-3" style={{fontSize: "clamp(14px, 1.8vw, 16px)"}}>🏆 Top Performers</span>
                    {getSortedPerformers(false).length > 0 ? (
                      <div className="d-flex flex-column gap-2">
                        {getSortedPerformers(false).map((student, idx) => (
                          <div key={idx} className="d-flex justify-content-between align-items-center p-2 rounded-3 bg-light-subtle border-bottom">
                            <div className="d-flex align-items-center gap-3">
                              <span className="fw-bold text-warning" style={{ width: "20px", fontSize: "14px" }}>#{idx + 1}</span>
                              <Link to="/admin/students/attendance/summary" state={{ targetedStudentId: student.id, studentName: student.name }}>
                                <img src={student.photoUrl || `https://ui-avatars.com/api/?name=${student.name}`} className="rounded-circle border" style={{ width: "36px", height: "36px", objectFit: "cover" }} alt="" />
                              </Link>
                              <Link to="/admin/students/attendance/summary" state={{ targetedStudentId: student.id, studentName: student.name }} className="text-decoration-none text-dark fw-bold" style={{fontSize: "clamp(12px, 1.5vw, 14px)"}}>
                                {student.name}
                              </Link>
                            </div>
                            <span className="badge bg-success rounded-pill px-2.5 py-1.5" style={{fontSize: "11px"}}>{student.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted small py-3">No data</div>
                    )}
                  </div>
                </div>
              </div>

              {/* ⚠️ NEED IMPROVEMENT */}
              <div className="col-12 col-lg-6">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-3 p-md-4">
                    <span className="fw-bold text-dark d-block mb-2" style={{fontSize: "clamp(14px, 1.8vw, 16px)"}}>⚠️ Need Improvement</span>
                    {getSortedPerformers(true).length > 0 ? (
                      <div className="table-responsive m-0">
                        <table className="table table-sm table-borderless align-middle m-0" style={{fontSize: "clamp(12px, 1.5vw, 14px)"}}>
                          <tbody>
                            {getSortedPerformers(true).map((student, idx) => (
                              <tr key={idx} className="border-bottom">
                                <td className="text-muted py-2" style={{width: "25px"}}>{idx + 1}</td>
                                <td style={{width: "45px"}} className="py-2">
                                  <Link to="/admin/students/attendance/summary" state={{ targetedStudentId: student.id, studentName: student.name }}>
                                    <img src={student.photoUrl || `https://ui-avatars.com/api/?name=${student.name}`} className="rounded-circle border" style={{ width: "32px", height: "32px", objectFit: "cover" }} alt="" />
                                  </Link>
                                </td>
                                <td className="fw-semibold py-2">
                                  <Link to="/admin/students/attendance/summary" state={{ targetedStudentId: student.id, studentName: student.name }} className="text-decoration-none text-dark">{student.name}</Link>
                                </td>
                                <td className="text-end fw-bold text-danger py-2">{student.percentage}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center text-muted small py-3">No data</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        );
      }}
    </AdmissionProvider>
  );
}