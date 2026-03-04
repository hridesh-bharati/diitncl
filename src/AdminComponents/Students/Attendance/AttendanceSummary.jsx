import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import AdmissionProvider from "../../Admissions/AdmissionProvider";
import { Link } from "react-router-dom";

export default function AttendanceSummary() {
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("DIIT124");
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);
  const [tempStats, setTempStats] = useState({});

  const courseDurations = { "ADCA": 450, "DCA": 180, "CCC": 90, "N/A": 365 };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Daily Attendance Records
      const q = query(collection(db, "attendance"), where("branch", "==", selectedBranch));
      const snap = await getDocs(q);
      const stats = {};

      snap.docs.forEach(docSnap => {
        const day = docSnap.data();
        if (day.records) {
          day.records.forEach(r => {
            if (!stats[r.id]) stats[r.id] = { present: 0, absent: 0, half: 0 };
            const status = r.status?.toLowerCase();
            if (status === "present") stats[r.id].present++;
            else if (status === "absent") stats[r.id].absent++;
            else if (status === "half") stats[r.id].half++;
          });
        }
      });

      // 2. Fetch Manual Overrides (Your new collection)
      const manualSnap = await getDocs(collection(db, "manual_attendance_stats"));
      manualSnap.forEach(docSnap => {
        if (stats[docSnap.id]) {
          // Replace with manual data if it exists
          stats[docSnap.id] = docSnap.data();
        } else {
          stats[docSnap.id] = docSnap.data();
        }
      });

      setAttendanceData(stats);
    } catch (err) {
      alert("Error fetching: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, [selectedBranch]);

  const startEdit = (id, currentStats) => {
    setEditId(id);
    setTempStats({ ...currentStats });
  };

  // --- SAVE TO FIREBASE LOGIC ---
  const saveEdit = async (id) => {
    try {
      // Manual stats collection mein save karna (as per your rule)
      const docRef = doc(db, "manual_attendance_stats", id);
      await setDoc(docRef, tempStats);
      
      // Local state update
      setAttendanceData({ ...attendanceData, [id]: tempStats });
      setEditId(null);
      alert("Saved to Cloud Successfully! ✅");
    } catch (err) {
      alert("Permission Denied or Error: " + err.message);
    }
  };

  const getGradient = (p) => {
    if (p >= 75) return "linear-gradient(90deg, #10b981, #34d399)";
    if (p >= 50) return "linear-gradient(90deg, #f59e0b, #fbbf24)";
    return "linear-gradient(90deg, #ef4444, #f87171)";
  };

  return (
    <AdmissionProvider>
      {({ admissions = [] }) => {
        const branchStudents = admissions.filter(s => 
          (s.branch === selectedBranch || s.centerCode === selectedBranch) &&
          s.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
          <div className="container mb-5 pb-5 py-3" style={{ maxWidth: "500px" }}>
            {/* Header & Search */}
            <div className="card border-0 shadow-sm rounded-4 p-2 mb-3 bg-white">
              <div className="btn-group w-100 mb-2">
                {["DIIT124", "DIIT125"].map(b => (
                  <button key={b} className={`btn btn-sm rounded-pill fw-bold ${selectedBranch === b ? "btn-primary shadow" : "btn-light"}`}
                    onClick={() => setSelectedBranch(b)}>{b === "DIIT124" ? "Main" : "East"}</button>
                ))}
              </div>
              <input type="text" className="form-control form-control-sm rounded-pill border-0 bg-light px-3" 
                placeholder="🔍 Search student..." onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            {loading ? <div className="text-center py-5">Syncing with Firebase...</div> :
              branchStudents.map(s => {
                const isEditing = editId === s.id;
                const stats = isEditing ? tempStats : (attendanceData[s.id] || { present: 0, absent: 0, half: 0 });
                const totalDays = courseDurations[s.course] || 450;
                const attended = stats.present + (stats.half * 0.5);
                const percentage = Math.min(Math.round((attended / totalDays) * 100), 100);

                return (
                  <div key={s.id} className="card border-0 shadow-sm rounded-4 mb-3 p-3 bg-white">
                    <div className="d-flex align-items-center gap-3">
                      <Link to={`/admin/students/${s.id}`}>
                        <img src={s.photoUrl || `https://ui-avatars.com/api/?name=${s.name}`} 
                          className="rounded-circle border" width="55" height="55" style={{objectFit: 'cover'}} />
                      </Link>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <h6 className="fw-bold mb-0">{s.name}</h6>
                          <button 
                            className={`btn btn-sm py-0 fw-bold ${isEditing ? 'text-success' : 'text-primary'}`}
                            onClick={() => isEditing ? saveEdit(s.id) : startEdit(s.id, stats)}
                          >
                            {isEditing ? "SAVE CLOUD" : "EDIT"}
                          </button>
                        </div>
                        <div className="text-muted small">{s.regNo} | {s.course}</div>
                      </div>
                    </div>

                    <div className="mt-3 bg-light p-2 rounded-3">
                      <div className="progress rounded-pill" style={{height:'8px'}}>
                        <div className="progress-bar" style={{ width: `${percentage}%`, background: getGradient(percentage) }}></div>
                      </div>
                    </div>

                    <div className="row g-2 mt-2 text-center">
                      {["present", "absent", "half"].map((key) => (
                        <div key={key} className="col-4">
                          <div className="bg-white border rounded py-1">
                            {isEditing ? (
                              <input type="number" className="form-control form-control-sm text-center border-0 p-0 fw-bold"
                                value={tempStats[key]}
                                onChange={(e) => setTempStats({...tempStats, [key]: parseInt(e.target.value) || 0})}
                              />
                            ) : (
                              <div className="fw-bold">{stats[key]}</div>
                            )}
                            <div className="text-muted small" style={{fontSize:'8px'}}>{key.toUpperCase()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            }
          </div>
        );
      }}
    </AdmissionProvider>
  );
}