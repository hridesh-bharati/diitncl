// src\AdminComponents\Students\Attendance\AttendanceSummary.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import AdmissionProvider from "../../Admissions/AdmissionProvider";
import { Link, useLocation } from "react-router-dom";

export default function AttendanceSummary() {
  const location = useLocation();
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("DIIT124");
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);
  const [tempStats, setTempStats] = useState({});

  // URL state management parameters
  const [dashboardTargetId, setDashboardTargetId] = useState(location.state?.targetedStudentId || null);

  const courseDurations = { "ADCA": 450, "DCA": 180, "CCC": 90, "N/A": 365 };

  useEffect(() => {
    if (location.state?.studentName) {
      setSearchTerm(location.state.studentName);
    }
  }, [location.state]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
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

      const manualSnap = await getDocs(collection(db, "manual_attendance_stats"));
      manualSnap.forEach(docSnap => {
        stats[docSnap.id] = docSnap.data();
      });

      setAttendanceData(stats);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, [selectedBranch]);

  const startEdit = (id, currentStats) => {
    setEditId(id);
    setTempStats({ ...currentStats });
  };

  const saveEdit = async (id) => {
    try {
      await setDoc(doc(db, "manual_attendance_stats", id), tempStats);
      setAttendanceData({ ...attendanceData, [id]: tempStats });
      setEditId(null);
      alert("Saved to Cloud Successfully! ✅");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const getGradient = (p) => {
    return p >= 75 ? "linear-gradient(90deg, #10b981, #34d399)" :
      p >= 50 ? "linear-gradient(90deg, #f59e0b, #fbbf24)" :
        "linear-gradient(90deg, #ef4444, #f87171)";
  };

  const clearTargetFilter = () => {
    setDashboardTargetId(null);
    setSearchTerm("");
  };
  return (
    <AdmissionProvider>
      {({ admissions = [] }) => {

        // Filter Students
        const branchStudents = admissions.filter((s) => {
          const matchesBranch =
            s.branch === selectedBranch ||
            s.centerCode === selectedBranch;

          if (dashboardTargetId) {
            return matchesBranch && s.id === dashboardTargetId;
          }

          return (
            matchesBranch &&
            s.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });

        return (
          <div className="container-fluid mb-5 pb-5 py-3">

            {/* Header */}
            <div className="card border-0 shadow-sm rounded-4 p-2 mb-4 bg-white">

              {/* Branch Buttons */}
              <div className="btn-group w-100 mb-2">
                {["DIIT124", "DIIT125"].map((b) => (
                  <button
                    key={b}
                    className={`btn btn-sm rounded-pill fw-bold ${selectedBranch === b
                        ? "btn-primary shadow"
                        : "btn-light"
                      }`}
                    onClick={() => {
                      setSelectedBranch(b);
                      setDashboardTargetId(null);
                    }}
                  >
                    {b === "DIIT124" ? "Main" : "East"}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control form-control-sm rounded-pill border-0 bg-light px-3 pe-5"
                  placeholder="🔍 Search student..."
                  value={searchTerm}
                  disabled={!!dashboardTargetId}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {dashboardTargetId && (
                  <button
                    className="btn btn-sm btn-dark rounded-pill position-absolute end-0 top-50 translate-middle-y me-1 py-0 px-2 small"
                    style={{ fontSize: "11px", zIndex: 10 }}
                    onClick={clearTargetFilter}
                  >
                    Clear ✕
                  </button>
                )}
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="text-center py-5">
                Syncing with DB...
              </div>
            ) : (
              <div className="row g-3">

                {branchStudents.map((s) => {

                  const isEditing = editId === s.id;

                  const stats = isEditing
                    ? tempStats
                    : attendanceData[s.id] || {
                      present: 0,
                      absent: 0,
                      half: 0,
                    };

                  const totalDays =
                    courseDurations[s.course] || 450;

                  const attended =
                    stats.present + stats.half * 0.5;

                  const percentage = Math.min(
                    Math.round((attended / totalDays) * 100),
                    100
                  );

                  return (
                    <div
                      key={s.id}
                      className="col-12 col-sm-6 col-md-4 col-lg-3"
                    >
                      <div
                        className={`card border-0 shadow-sm rounded-4 p-3 bg-white h-100 ${dashboardTargetId
                            ? "border border-2 border-success shadow-lg"
                            : ""
                          }`}
                      >

                        {/* Top */}
                        <div className="d-flex align-items-center gap-3">

                          <Link to={`/admin/students/${s.id}`}>
                            <img
                              src={
                                s.photoUrl ||
                                `https://ui-avatars.com/api/?name=${s.name}`
                              }
                              className="rounded-circle border"
                              width="55"
                              height="55"
                              alt={s.name}
                              style={{ objectFit: "cover" }}
                            />
                          </Link>

                          <div className="flex-grow-1">

                            <div className="d-flex justify-content-between align-items-start">

                              <h6 className="fw-bold mb-0 text-truncate">
                                {s.name}
                              </h6>

                              <button
                                className={`btn btn-sm py-0 fw-bold ${isEditing
                                    ? "text-success"
                                    : "text-primary"
                                  }`}
                                onClick={() =>
                                  isEditing
                                    ? saveEdit(s.id)
                                    : startEdit(s.id, stats)
                                }
                              >
                                {isEditing
                                  ? "SAVE"
                                  : "EDIT"}
                              </button>

                            </div>

                            <div className="text-muted small">
                              {s.regNo} | {s.course}
                            </div>

                          </div>
                        </div>

                        {/* Progress */}
                        <div className="mt-3 bg-light p-2 rounded-3">

                          <div
                            className="progress rounded-pill"
                            style={{ height: "8px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{
                                width: `${percentage}%`,
                                background:
                                  getGradient(percentage),
                              }}
                            ></div>
                          </div>

                          <div className="text-end small fw-bold mt-1">
                            {percentage}%
                          </div>

                        </div>

                        {/* Stats */}
                        <div className="row g-2 mt-2 text-center">

                          {["present", "absent", "half"].map(
                            (key) => (
                              <div
                                key={key}
                                className="col-4"
                              >

                                <div className="bg-white border rounded py-2">

                                  {isEditing ? (
                                    <input
                                      type="number"
                                      className="form-control form-control-sm text-center border-0 p-0 fw-bold"
                                      value={tempStats[key]}
                                      onChange={(e) =>
                                        setTempStats({
                                          ...tempStats,
                                          [key]:
                                            parseInt(
                                              e.target.value
                                            ) || 0,
                                        })
                                      }
                                    />
                                  ) : (
                                    <div className="fw-bold">
                                      {stats[key]}
                                    </div>
                                  )}

                                  <div
                                    className="text-muted small"
                                    style={{
                                      fontSize: "9px",
                                    }}
                                  >
                                    {key.toUpperCase()}
                                  </div>

                                </div>
                              </div>
                            )
                          )}

                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            )}
          </div>
        );
      }}
    </AdmissionProvider>
  );

}