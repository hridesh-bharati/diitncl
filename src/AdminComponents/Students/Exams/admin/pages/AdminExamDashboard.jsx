// src/AdminComponents/Students/Exams/admin/pages/AdminExamDashboard.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useExam } from "../../context/ExamProvider";
import { db } from "../../../../../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import BackButton from "../../../../../Components/HelperCmp/BackButton/BackButton";

export default function AdminExamDashboard() {
  const navigate = useNavigate();
  const { exams, loading, toggleExamLive, deleteExam } = useExam();

  // Stats state
  const [studentStats, setStudentStats] = useState({ ongoing: 0, ready: 0, totalRecords: 0 });

  useEffect(() => {
    // 1. Pehle Live Exam ki IDs nikal lo
    const liveExamIds = exams.filter(e => e.isLive).map(e => e.id);

    // 2. studentExams collection ko real-time listen karo
    const q = collection(db, "studentExams");
    const unsubscribe = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => d.data());

      setStudentStats({
        // Testing: Jo bache paper hall ke andar hain (Ongoing)
        ongoing: docs.filter(s => s.status === "Ongoing" && liveExamIds.includes(s.examId)).length,

        // 🔥 Ready: Sirf wo jinko Permit (Pending) kiya hai AUR paper Live hai
        ready: docs.filter(s => s.status === "Pending" && liveExamIds.includes(s.examId)).length,

        // 🔥 Students: On + Off dono ka length (Total records in studentExams)
        totalRecords: docs.length
      });
    });

    return () => unsubscribe();
  }, [exams]); // Exams change hone par stats update honge

  const cards = useMemo(() => [
    { label: 'Testing', v: studentStats.ongoing, c: '#ffc107', dark: true },
    { label: 'Live Course', v: exams.filter(e => e.isLive).length, c: '#dc3545' },
    { label: 'Ready for exam', v: studentStats.ready, c: '#198754' },
    { label: 'Total Students', v: studentStats.totalRecords, c: '#212529' }
  ], [exams, studentStats]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
      <div className="spinner-border text-primary border-4" role="status"></div>
    </div>
  );

  return (
    <div className="container-fluid p-0 bg-light pb-5">
      <div className="d-flex justify-content-between align-items-center p-2 p-md-3 bg-white border-bottom sticky-top shadow-sm">
        <div className="d-flex align-items-center gap-2">
          <BackButton className="border-0"/>
          <h6 className="fw-bold mb-0 text-dark">
            <i className="bi bi-shield-lock-fill me-1 text-primary"></i>Exam Console
          </h6>
        </div>

        <button className="btn btn-primary btn-sm rounded-0 fw-bold" onClick={() => navigate("new")} >
          <i className="bi bi-plus"></i> New Exam
        </button>
      </div>

      <div className="row g-0">
        {cards.map((s, i) => (
          <div key={i} className="col-3">
            <div className="text-center py-3 border-end border-bottom" style={{ backgroundColor: s.c, color: s.dark ? '#000' : '#fff' }}>
              <div className="fw-bold h3 mb-0" style={{ fontWeight: '900' }}>{s.v}</div>
              <div style={{ fontSize: '9px', fontWeight: '800' }} className="text-uppercase">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-2 mt-2">
        <div className="row g-3">
          {exams.length > 0 ? exams.map(e => (
            <div key={e.id} className="col-12 col-md-6">
              <div className="card border-0 shadow-sm h-100 rounded-0 overflow-hidden">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center overflow-hidden me-2">
                      <div className="bg-primary bg-opacity-10 p-2 me-2">
                        <i className="bi bi-journal-check text-primary fs-5"></i>
                      </div>
                      <div className="overflow-hidden">
                        <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ maxWidth: '180px' }}>{e.title}</h6>
                        <span
                          className="text-danger small fw-bold cursor-pointer"
                          style={{ fontSize: '10px' }}
                          onClick={() => deleteExam(e.id)}
                        >
                          DELETE PERMANENTLY
                        </span>
                      </div>
                    </div>
                    <span className="badge bg-dark rounded-0 border-0 small px-2 py-1 uppercase" style={{ fontSize: '10px' }}>
                      {e.course}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center border-top pt-3">
                    <div className="small text-muted fw-bold uppercase" style={{ fontSize: '10px' }}>
                      <i className="bi bi-clock-history me-1 text-primary"></i>{e.startTime} | {e.duration} Hrs
                    </div>

                    <div
                      className={`small fw-bold cursor-pointer py-1 px-3 border rounded-pill transition-all ${e.isLive ? 'text-danger border-danger bg-danger bg-opacity-10' : 'text-secondary border-secondary bg-light'}`}
                      onClick={() => toggleExamLive(e.id, e.isLive)}
                    >
                      {e.isLive ? (
                        <span className="d-inline-flex align-items-center gap-1">
                          <span
                            className="spinner-grow spinner-grow-sm"
                            style={{ width: "8px", height: "8px" }}
                          ></span>
                          <span>LIVE NOW</span>
                        </span>
                      ) : (
                        <><i className="bi bi-power me-1"></i> GO LIVE</>
                      )}
                    </div>
                  </div>
                </div>

                <div className="d-flex bg-white border-top">
                  <button className="btn btn-white flex-fill rounded-0 border-end py-2 shadow-none" onClick={() => navigate(`${e.id}/questions`)}>
                    <i className="bi bi-pencil-square text-primary h5 mb-1 d-block"></i>
                    <span className="text-muted fw-bold" style={{ fontSize: '9px', textTransform: 'uppercase' }}>Questions</span>
                  </button>
                  <button className="btn btn-white flex-fill rounded-0 border-end py-2 shadow-none" onClick={() => navigate(`${e.id}/assign`)}>
                    <i className="bi bi-person-check-fill text-dark h5 mb-1 d-block"></i>
                    <span className="text-muted fw-bold" style={{ fontSize: '9px', textTransform: 'uppercase' }}>Permit</span>
                  </button>
                  {/* Filtered Results Button */}
                  <button 
                    className="btn btn-white flex-fill rounded-0 py-2 shadow-none" 
                    onClick={() => navigate(`completed?examId=${e.id}`)}
                  >
                    <i className="bi bi-clipboard-data text-success h5 mb-1 d-block"></i>
                    <span className="text-muted fw-bold" style={{ fontSize: '9px', textTransform: 'uppercase' }}>Results</span>
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-12 text-center py-5">
              <p className="text-muted fw-bold uppercase small">No Exam Papers Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}