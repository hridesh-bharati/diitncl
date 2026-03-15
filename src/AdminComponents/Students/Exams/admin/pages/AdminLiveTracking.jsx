// src/AdminComponents/Students/Exams/admin/pages/AdminLiveTracking.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../../../../firebase/firebase";
import { collection, query, where, onSnapshot, getDoc, doc, deleteDoc } from "firebase/firestore";

export default function AdminLiveTracking() {
  const [liveStudents, setLiveStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Listen for ALL 'Ongoing' exams
    const q = query(collection(db, "studentExams"), where("status", "==", "Ongoing"));

    const unsubscribe = onSnapshot(q, async (snap) => {
      if (snap.empty) {
        setLiveStudents([]);
        setLoading(false);
        return;
      }

      const promises = snap.docs.map(async (examDoc) => {
        const data = examDoc.data();
        
        // 🔥 Critical Logic: Pehle Exam check karo ki wo LIVE hai ya nahi
        const examSnap = await getDoc(doc(db, "exams", data.examId));
        if (!examSnap.exists() || !examSnap.data().isLive) return null; // Agar Exam Offline hai toh return null

        const studentSnap = await getDoc(doc(db, "admissions", data.studentId));
        if (!studentSnap.exists()) return null;

        return {
          id: examDoc.id,
          ...data,
          studentInfo: studentSnap.data(),
          examName: examSnap.data().title
        };
      });

      const results = await Promise.all(promises);
      // Filter out nulls (Offline exams wale students hat jayenge)
      setLiveStudents(results.filter(r => r !== null));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleTerminate = async (id, name) => {
    if (window.confirm(`FORCE TERMINATE: Are you sure you want to kick ${name} out?`)) {
      try {
        await deleteDoc(doc(db, "studentExams", id));
      } catch (err) { alert("Error deleting."); }
    }
  };

  const filtered = liveStudents.filter(s =>
    s.studentInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-white">
      <div className="spinner-border text-danger border-4" />
    </div>
  );

  return (
    <div className="container-fluid py-4 bg-light min-vh-100 text-dark">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 bg-white p-3 border shadow-sm sticky-top">
        <div>
          <h5 className="fw-bold mb-0 text-uppercase">📡 Live Exam Monitor</h5>
          <p className="text-muted small mb-0">Showing students only in <b>LIVE</b> exam papers</p>
        </div>

        <div className="d-flex align-items-center gap-3">
          <input
            type="text"
            className="form-control form-control-sm rounded-0 border-2 shadow-none"
            placeholder="Search student..."
            style={{ width: '200px' }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="badge bg-danger rounded-0 p-2 pe-3 d-flex align-items-center gap-2">
            <span className="spinner-grow spinner-grow-sm"></span>
            {liveStudents.length} ACTIVE
          </div>
        </div>
      </div>

      <div className="row g-3 mt-2">
        {filtered.length > 0 ? filtered.map((s) => (
          <div key={s.id} className="col-md-6 col-lg-4 col-xl-3">
            <div className="card border-0 shadow-sm rounded-0 h-100 overflow-hidden position-relative">
              {/* DELETE/TERMINATE */}
              <button
                className="btn btn-sm btn-light border shadow-sm position-absolute top-0 end-0 m-3 rounded-0 opacity-75 hover-opacity-100"
                onClick={() => handleTerminate(s.id, s.studentInfo?.name)}
                style={{ zIndex: 10 }}
              >
                <i className="bi bi-trash3-fill text-danger"></i>
              </button>

              <div className="bg-danger py-1"></div>

              <div className="card-body p-3">
                <div className="d-flex align-items-start gap-3 mb-3">
                  <img
                    src={s.studentInfo?.photoUrl || `https://ui-avatars.com/api/?name=${s.studentInfo?.name}&background=random`}
                    alt="" className="rounded-0 border shadow-sm bg-white"
                    style={{ width: "55px", height: "55px", objectFit: "cover" }}
                  />
                  <div className="overflow-hidden">
                    <h6 className="fw-bold mb-0 text-truncate text-uppercase small">{s.studentInfo?.name}</h6>
                    <div className="text-danger fw-bold" style={{ fontSize: '9px' }}>REG: {s.studentInfo?.regNo}</div>
                    <div className="badge bg-light text-dark border rounded-0 mt-1 uppercase" style={{ fontSize: '8px' }}>{s.studentInfo?.course}</div>
                  </div>
                </div>

                <div className="bg-light p-2 mb-3 border-start border-danger border-3">
                  <div className="small text-muted text-uppercase fw-bold" style={{ fontSize: '8px' }}>Exam Paper:</div>
                  <div className="small fw-bold text-truncate">{s.examName}</div>
                </div>

                <div className="row g-0 border-top pt-2">
                  <div className="col-6 border-end">
                    <div className="small text-muted fw-bold uppercase" style={{ fontSize: '8px' }}>Start Time</div>
                    <div className="small fw-bold">{s.startedAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <div className="col-6 ps-2 text-end">
                    <div className="small text-muted fw-bold uppercase" style={{ fontSize: '8px' }}>Status</div>
                    <div className="small fw-bold text-success">● ONLINE</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="progress rounded-0" style={{ height: "4px" }}>
                    <div className="progress-bar progress-bar-striped progress-bar-animated bg-danger" style={{ width: "100%" }}></div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                     <span className="badge bg-danger-subtle text-danger small px-2 rounded-0 fw-bold" style={{ fontSize: '9px' }}>ONGOING</span>
                     <span className="small text-muted fw-bold text-uppercase" style={{ fontSize: '8px' }}>Live Pulse...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-12 text-center py-5">
            <div className="card border-0 shadow-sm rounded-0 p-5 bg-white">
              <i className="bi bi-broadcast fs-1 text-muted opacity-25"></i>
              <h5 className="mt-3 text-muted fw-bold uppercase small">No active sessions found for Live Exams</h5>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}