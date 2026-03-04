import React, { useState, useEffect } from "react";
import {
  collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc, deleteDoc
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import AdmissionProvider from "../../Admissions/AdmissionProvider";
import { Link } from "react-router-dom";

export default function AttendanceMark() {
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("DIIT124");
  const [isTodayHoliday, setIsTodayHoliday] = useState(false);
  const [isMarked, setIsMarked] = useState(false);
  const [unmarkedList, setUnmarkedList] = useState([]);

  const todayDate = new Date().toISOString().split("T")[0];
  const isSunday = new Date().getDay() === 0;

  const checkTodayStatus = async () => {
    const q = query(collection(db, "attendance"), where("date", "==", todayDate), where("branch", "==", selectedBranch));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const data = snap.docs[0].data();
      setIsTodayHoliday(data.status === "Holiday");
      setIsMarked(data.status === "Open");
      if (data.status !== "Holiday" && data.records) {
        const todayRecords = {};
        data.records.forEach(r => todayRecords[r.id] = r.status);
        setAttendance(todayRecords);
      }
    } else {
      setIsTodayHoliday(false);
      setIsMarked(false);
      setAttendance({});
    }
  };

  useEffect(() => { checkTodayStatus(); }, [selectedBranch, todayDate]);

  const handleSubmit = async (filteredStudents, isManualHoliday = false) => {
    if (isSunday && !isManualHoliday) return alert("Sunday not allowed!");

    if (!isManualHoliday) {
      const unmarked = filteredStudents.filter(s => !attendance[s.id]);
      if (unmarked.length > 0) { setUnmarkedList(unmarked); return; }
    }

    setLoading(true);
    try {
      const q = query(collection(db, "attendance"), where("date", "==", todayDate), where("branch", "==", selectedBranch));
      const snap = await getDocs(q);
      const records = isManualHoliday ? [] : filteredStudents.map(s => ({ id: s.id, name: s.name, status: attendance[s.id] }));

      if (!snap.empty) {
        await updateDoc(doc(db, "attendance", snap.docs[0].id), { status: isManualHoliday ? "Holiday" : "Open", records });
      } else {
        await addDoc(collection(db, "attendance"), {
          date: todayDate, branch: selectedBranch,
          branchName: selectedBranch === "DIIT124" ? "Main Branch" : "East Branch",
          status: isManualHoliday ? "Holiday" : "Open", records, createdAt: serverTimestamp()
        });
      }

      if (!isManualHoliday) setIsMarked(true);
      await checkTodayStatus();
    } catch (err) { alert("Error: " + err.message); } finally { setLoading(false); }
  };

  const handleUnlock = () => { if (window.confirm("Unlock to edit?")) setIsMarked(false); };
  const handleReopen = async () => {
    if (!window.confirm("Reopen institute?")) return;
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "attendance"), where("date", "==", todayDate), where("branch", "==", selectedBranch)));
      if (!snap.empty) { await deleteDoc(doc(db, "attendance", snap.docs[0].id)); setIsTodayHoliday(false); setIsMarked(false); setAttendance({}); }
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };

  return (
    <AdmissionProvider>
      {({ admissions = [], loading: dataLoading }) => {
        const filteredStudents = admissions.filter(s =>
          (s.branch === selectedBranch || s.centerCode === selectedBranch) &&
          s.status !== "canceled" && s.status !== "pending" && !s.issueDate
        );

        return (
          <div className="container pt-1 mb-5 pb-5" >

            {/* MODAL */}
            {unmarkedList.length > 0 && (
              <div className="modal d-block" style={{ background: "rgba(0,0,0,0.6)" }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content border-0 rounded-4">
                    <div className="modal-header bg-danger text-white py-2">
                      <h6 className="mb-0 fw-bold">Pending: {unmarkedList.length}</h6>
                      <button className="btn-close btn-close-white" onClick={() => setUnmarkedList([])}></button>
                    </div>
                    <div className="modal-body py-2 small" style={{ maxHeight: "200px", overflow: "auto" }}>
                      {unmarkedList.map((s, i) => <div key={s.id}>{i + 1}. {s.name}</div>)}
                    </div>
                    <div className="modal-footer border-0 p-2">
                      <button className="btn btn-secondary btn-sm w-100 rounded-pill" onClick={() => setUnmarkedList([])}>OK</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HEADER */}
            <div className="card shadow-sm border-0 rounded-4 p-3 mb-3 bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold mb-0 text-dark">Daily Attendance</h6>
                  <div className="d-flex gap-2 mt-1">
                    <span className="badge bg-light text-dark border small">{todayDate}</span>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle small">
                      Total: {filteredStudents.length}
                    </span>
                  </div>
                </div>

                {!isSunday && (
                  <button
                    className={`btn btn-sm rounded-pill fw-bold px-3 shadow-sm ${isTodayHoliday ? "btn-success" : "btn-outline-danger"}`}
                    onClick={isTodayHoliday ? handleReopen : () => handleSubmit(filteredStudents, true)}
                    disabled={loading}
                  >
                    {loading ? "..." : isTodayHoliday ? "REOPEN" : "HOLIDAY"}
                  </button>
                )}
              </div>
            </div>

            {/* BRANCH */}
            <div className="btn-group w-100 bg-light rounded-pill p-1 mb-3">
              {[{ id: "DIIT124", label: "Main" }, { id: "DIIT125", label: "East" }].map(b => (
                <button key={b.id} className={`btn btn-sm rounded-pill fw-bold py-2 ${selectedBranch === b.id ? "btn-primary shadow" : "btn-light text-muted"}`}
                  onClick={() => setSelectedBranch(b.id)}>{b.label}</button>
              ))}
            </div>

            {isSunday ? (
              <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-light"><h5>Sunday Closed</h5></div>
            ) : isMarked ? (
              /* SUCCESS CARD */
              <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white border-top border-5 border-success">
                <span className="display-4 text-success mb-2">✓</span>
                <h5 className="fw-bold">Attendance Done</h5>
                <p className="text-muted small mb-3">{filteredStudents.length} students marked</p>
                <button className="btn btn-outline-primary btn-sm rounded-pill fw-bold px-4" onClick={handleUnlock}>
                  UNLOCK
                </button>
              </div>
            ) : (
              /* TABLE */
              <>
                <div className={`table-responsive bg-white rounded-4 shadow-sm border ${isTodayHoliday ? "opacity-50" : ""}`}>
                  <table className="table table-sm table-hover align-middle mb-0 text-nowrap">
                    <thead className="bg-light text-secondary small text-center">
                      <tr><th className="ps-3">#</th><th>PIC</th><th className="text-start">NAME</th>
                        <th className="text-primary">P</th>
                        <th className="text-danger">A</th>
                        <th className="text-warning">H</th></tr>
                    </thead>
                    <tbody>
                      {dataLoading ? <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr> :
                        filteredStudents.map((s, idx) => (
                          <tr key={s.id}>
                            <td className="ps-3 small fw-bold">{idx + 1}</td>
                            <td>
                              <Link to={`/admin/students/${s.id}`}>
                                <img src={s.photoUrl || `https://ui-avatars.com/api/?name=${s.name}`} className="rounded-circle border" style={{ width: "32px", height: "32px" }} alt="" />
                              </Link>
                            </td>
                            <td><span className="small fw-bold">{s.name}</span><br /><span className="text-muted" style={{ fontSize: "10px" }}>{s.course}</span></td>
                            {["Present", "Absent", "Half"].map(status => (
                              <td key={status} className="text-center">
                                <input type="radio"
                                  className={`form-check-input border-2 shadow-none ${attendance[s.id] === "Present" && status === "Present" ? "bg-primary border-primary" :
                                    attendance[s.id] === "Absent" && status === "Absent" ? "bg-danger border-danger" :
                                      attendance[s.id] === "Half" && status === "Half" ? "bg-warning border-warning" : ""
                                    }`}
                                  style={{
                                    cursor: "pointer",
                                    width: "1.2rem",
                                    height: "1.2rem"
                                  }}
                                  name={s.id}
                                  checked={attendance[s.id] === status} disabled={isTodayHoliday}
                                  onChange={() => setAttendance({ ...attendance, [s.id]: status })} />
                              </td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {!isTodayHoliday && (
                  <button className="btn btn-dark w-100 rounded-pill mt-3 fw-bold py-2" onClick={() => handleSubmit(filteredStudents)} disabled={loading}>
                    {loading ? "SAVING..." : "SAVE"}
                  </button>
                )}
              </>
            )}
          </div>
        );
      }}
    </AdmissionProvider>
  );
}