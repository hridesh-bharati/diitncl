import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

export default function AttendanceDashboard() {
  const [selectedBranch, setSelectedBranch] = useState("DIIT124");
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    averageAttendance: 0,
    pendingMarks: 0,
  });

  const [weeklyData, setWeeklyData] = useState([]);
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    // 1. Total Students Sync (Filtered by Branch)
    const unsubStudents = onSnapshot(collection(db, "students"), (snap) => {
      const branchStudents = snap.docs.filter(doc => {
        const d = doc.data();
        return (d.branch === selectedBranch || d.centerCode === selectedBranch) && 
               d.status !== "canceled" && d.status !== "pending";
      });
      setStats((prev) => ({ ...prev, totalStudents: branchStudents.length }));
    });

    // 2. Today's Attendance Sync (Matches AttendanceMark structure)
    const todayQuery = query(
      collection(db, "attendance"), 
      where("date", "==", today),
      where("branch", "==", selectedBranch)
    );

    const unsubAttendance = onSnapshot(todayQuery, (snap) => {
      let present = 0;
      let markedCount = 0;

      snap.forEach((doc) => {
        const data = doc.data();
        if (data.status === "Open" && data.records) {
          data.records.forEach(r => {
            markedCount++;
            if (r.status === "Present") present++;
          });
        }
      });

      setStats((prev) => ({
        ...prev,
        presentToday: present,
        pendingMarks: Math.max(0, prev.totalStudents - markedCount),
      }));
    });

    // 3. Weekly Data Sync (Last 7 Days)
    const unsubWeekly = onSnapshot(
      query(collection(db, "attendance"), where("branch", "==", selectedBranch)), 
      (snap) => {
        const last7 = {};
        const now = new Date();

        for (let i = 0; i < 7; i++) {
          const d = new Date();
          d.setDate(now.getDate() - i);
          const key = d.toISOString().split("T")[0];
          last7[key] = { total: 0, present: 0 };
        }

        snap.forEach((doc) => {
          const data = doc.data();
          if (last7[data.date] && data.records) {
            data.records.forEach(r => {
              last7[data.date].total++;
              if (r.status === "Present") last7[data.date].present++;
            });
          }
        });

        const chartData = Object.keys(last7).reverse().map((date) => {
          const { total, present } = last7[date];
          return {
            day: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
            percentage: total ? Math.round((present / total) * 100) : 0,
          };
        });

        setWeeklyData(chartData);
        
        const validDays = chartData.filter(d => d.percentage > 0);
        const avg = validDays.length 
          ? (validDays.reduce((sum, d) => sum + d.percentage, 0) / validDays.length)
          : 0;

        setStats((prev) => ({ ...prev, averageAttendance: avg.toFixed(1) }));
      }
    );

    return () => {
      unsubStudents();
      unsubAttendance();
      unsubWeekly();
    };
  }, [selectedBranch, today]);

  const quickActions = [
    {
      to: "/admin/students/attendance/mark",
      title: "Mark Attendance",
      emoji: "📝",
      color: "#0d6efd",
      bgColor: "#e3f2fd",
      val: `${stats.presentToday}/${stats.totalStudents}`,
    },
    {
      to: "/admin/students/attendance/summary",
      title: "Summary",
      emoji: "📊",
      color: "#198754",
      bgColor: "#e8f5e9",
      val: `${stats.averageAttendance}%`,
    },
    {
      to: "/admin/students/attendance/analytics",
      title: "Analytics",
      emoji: "📈",
      color: "#ffc107",
      bgColor: "#fff3e0",
      val: "Live",
    },
  ];

  return (
    <div className="container py-4" style={{ maxWidth: "1100px" }}>
      
      {/* HEADER & BRANCH SWITCHER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h4 className="fw-bold mb-1">📋 Drishtee Live Dashboard</h4>
          <span className="badge bg-light text-dark border">{today}</span>
        </div>

        <div className="btn-group bg-white p-1 rounded-pill shadow-sm border">
          <button 
            className={`btn btn-sm rounded-pill px-4 fw-bold ${selectedBranch === "DIIT124" ? "btn-primary" : "btn-light"}`}
            onClick={() => setSelectedBranch("DIIT124")}
          >Main</button>
          <button 
            className={`btn btn-sm rounded-pill px-4 fw-bold ${selectedBranch === "DIIT125" ? "btn-primary" : "btn-light"}`}
            onClick={() => setSelectedBranch("DIIT125")}
          >East</button>
        </div>
      </div>

      {/* TOP STATS CARDS */}
      <div className="row g-3 mb-4">
        {quickActions.map((item, i) => (
          <div key={i} className="col-md-4">
            <Link to={item.to} className="text-decoration-none">
              <div className="card border-0 shadow-sm p-4 rounded-4 hover-lift h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="p-3 rounded-3" style={{ background: item.bgColor, fontSize: "24px" }}>
                    {item.emoji}
                  </div>
                  <div className="text-end">
                    <h4 className="fw-bold mb-0" style={{ color: item.color }}>{item.val}</h4>
                    <small className="text-muted">{item.title}</small>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* CHART SECTION */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
            <div className="d-flex justify-content-between mb-4">
              <h6 className="fw-bold m-0">📊 Weekly Trend ({selectedBranch === "DIIT124" ? "Main" : "East"})</h6>
              <span className="text-success small">Real-time</span>
            </div>
            
            <div className="d-flex align-items-end gap-3" style={{ height: "200px" }}>
              {weeklyData.map((d, i) => (
                <div key={i} className="text-center flex-grow-1">
                  <div 
                    className="bg-primary rounded-top position-relative"
                    style={{ 
                      height: `${d.percentage}%`, 
                      minHeight: "4px",
                      transition: "height 0.6s ease",
                      background: "linear-gradient(180deg, #0d6efd 0%, #0b5ed7 100%)"
                    }}
                  >
                    {d.percentage > 0 && (
                      <span className="position-absolute top-0 start-50 translate-middle-x pt-1 text-white fw-bold" style={{ fontSize: "10px" }}>
                        {d.percentage}%
                      </span>
                    )}
                  </div>
                  <div className="mt-2 small fw-bold text-muted" style={{ fontSize: "11px" }}>{d.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STATUS SECTION */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-dark text-white h-100">
            <h6 className="fw-bold mb-4">🔔 System Alerts</h6>
            
            <div className="mb-4">
              <small className="text-secondary d-block mb-1">Unmarked Students</small>
              <h3 className={stats.pendingMarks > 0 ? "text-warning fw-bold" : "text-success fw-bold"}>
                {stats.pendingMarks}
              </h3>
              <p className="small text-secondary">
                {stats.pendingMarks > 0 ? "Some batches are still pending." : "All students marked for today!"}
              </p>
            </div>

            <div className="pt-3 border-top border-secondary">
              <div className="d-flex justify-content-between small mb-2">
                <span>Database Sync</span>
                <span className="text-success">Active</span>
              </div>
              <div className="d-flex justify-content-between small">
                <span>Branch ID</span>
                <span className="text-info">{selectedBranch}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-5 text-center">
        <p className="small text-muted mb-0">Powered by Drishtee ERP System</p>
        <div className="d-flex justify-content-center gap-2 mt-2">
          <div className="spinner-grow spinner-grow-sm text-primary" role="status" />
          <span className="small text-primary fw-bold">Live Stream Syncing...</span>
        </div>
      </div>

      <style>{`
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(0,0,0,0.12) !important; }
        .card { border: 1px solid rgba(0,0,0,0.05); }
      `}</style>
    </div>
  );
}