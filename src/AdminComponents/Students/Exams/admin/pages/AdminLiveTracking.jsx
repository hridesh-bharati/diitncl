import React, { useState, useEffect } from "react";
import { db } from "../../../../../firebase/firebase";
import { collection, query, where, onSnapshot, getDoc, doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function AdminLiveTracking() {
  const [liveStudents, setLiveStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);
  // Status 'Ongoing' ka realtime listener
  const q = query(collection(db, "studentExams"), where("status", "==", "Ongoing"));

  const unsubscribe = onSnapshot(q, async (snap) => {
    if (snap.empty) {
      setLiveStudents([]);
      setLoading(false);
      return;
    }

    try {
      const promises = snap.docs.map(async (examDoc) => {
        const data = examDoc.data();
        if (!data.examId || !data.studentId) return null;

        // Parallel fetch for speed
        const [examSnap, studentSnap] = await Promise.all([
          getDoc(doc(db, "exams", data.examId)),
          getDoc(doc(db, "admissions", data.studentId.toLowerCase().trim()))
        ]);

        // Sirf unhe dikhao jinka Exam LIVE hai aur Admission record valid hai
        if (!examSnap.exists() || !examSnap.data().isLive || !studentSnap.exists()) {
          return null;
        }

        return {
          id: examDoc.id,
          ...data,
          studentInfo: studentSnap.data(),
          examName: examSnap.data().title
        };
      });

      const results = await Promise.all(promises);
      setLiveStudents(results.filter(r => r !== null));
    } catch (err) {
      console.error("Tracking error:", err);
    } finally {
      setLoading(false);
    }
  });

  return () => unsubscribe();
}, []);

  const handleTerminate = async (id, name) => {
    if (window.confirm(`FORCE TERMINATE: Are you sure you want to kick ${name} out?`)) {
      try {
        await deleteDoc(doc(db, "studentExams", id));
        toast.success(`${name}'s session terminated.`);
      } catch (err) {
        toast.error("Failed to terminate session.");
      }
    }
  };

  const filtered = liveStudents.filter(s =>
    s.studentInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentInfo?.regNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-white">
      <div className="spinner-border text-danger border-4" />
    </div>
  );

  return (
    <div className="container-fluid py-4 bg-light text-dark min-vh-100">
      {/* HEADER BAR */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 bg-white p-3 border shadow-sm">
        <div>
          <h5 className="fw-bold mb-0 text-uppercase">📡 Live Exam Monitor</h5>
          <p className="text-muted small mb-0">Tracking active students in <b>LIVE</b> exams</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <input
            type="text"
            className="form-control form-control-sm rounded-0 border-2 shadow-none"
            placeholder="Search name or Reg..."
            style={{ width: '220px' }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="badge bg-danger rounded-0 p-2 d-flex align-items-center gap-2">
            <span className="spinner-grow spinner-grow-sm"></span>
            {liveStudents.length} ACTIVE
          </div>
        </div>
      </div>

      {/* MONITOR GRID */}
      <div className="row g-3">
        {filtered.length > 0 ? filtered.map((s) => (
          <div key={s.id} className="col-md-6 col-lg-4 col-xl-3">
            <div className="card border-0 shadow-sm rounded-0 h-100 position-relative">
              
              <button
                className="btn btn-sm btn-light border position-absolute top-0 end-0 m-2 rounded-0 shadow-sm"
                onClick={() => handleTerminate(s.id, s.studentInfo?.name)}
                style={{ zIndex: 10 }}
              >
                <i className="bi bi-trash3-fill text-danger"></i>
              </button>

              <div className="bg-danger py-1"></div>

              <div className="card-body p-3">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <img
                    src={s.studentInfo?.photoUrl || `https://ui-avatars.com/api/?name=${s.studentInfo?.name}&background=random`}
                    alt="" 
                    className="border"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                  <div className="overflow-hidden">
                    <h6 className="fw-bold mb-0 text-truncate text-uppercase small">{s.studentInfo?.name}</h6>
                    <div className="text-danger fw-bold" style={{ fontSize: '10px' }}>{s.studentInfo?.regNo}</div>
                    <div className="text-muted text-uppercase" style={{ fontSize: '9px' }}>{s.studentInfo?.course}</div>
                  </div>
                </div>

                <div className="bg-light p-2 mb-3 border-start border-danger border-3">
                  <div className="small text-muted fw-bold" style={{ fontSize: '9px' }}>EXAM PAPER:</div>
                  <div className="small fw-bold text-truncate">{s.examName}</div>
                </div>

                <div className="row g-0 border-top pt-2">
                  <div className="col-6 border-end">
                    <div className="small text-muted fw-bold" style={{ fontSize: '9px' }}>STARTED AT</div>
                    <div className="small fw-bold">
                      {s.startedAt?.toDate ? s.startedAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
                    </div>
                  </div>
                  <div className="col-6 ps-2 text-end">
                    <div className="small text-muted fw-bold" style={{ fontSize: '9px' }}>STATUS</div>
                    <div className="small fw-bold text-success animate__animated animate__flash animate__infinite">● ONLINE</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="progress rounded-0" style={{ height: "4px" }}>
                    <div className="progress-bar progress-bar-striped progress-bar-animated bg-danger" style={{ width: "100%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-12 text-center py-5">
            <div className="bg-white border p-5 shadow-sm">
              <i className="bi bi-broadcast display-4 text-muted opacity-25"></i>
              <h6 className="mt-3 text-muted fw-bold text-uppercase">No Active Exam Sessions</h6>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}