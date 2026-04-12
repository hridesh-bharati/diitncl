// src/AdminComponents/Students/Exams/admin/pages/AdminCompletedExams.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../../../../../firebase/firebase";
import { collection, query, where, onSnapshot, getDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function AdminCompletedExams() {
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const navigate = useNavigate();

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const filterExamId = queryParams.get("examId");

  useEffect(() => {
    const q = query(collection(db, "studentExams"), where("status", "==", "Completed"));

    const unsubscribe = onSnapshot(q, async (snap) => {
      const res = await Promise.all(snap.docs.map(async (d) => {
        const data = d.data();
        const [sS, eS] = await Promise.all([
          getDoc(doc(db, "admissions", data.studentId.toLowerCase().trim())),
          getDoc(doc(db, "exams", data.examId))
        ]);
        return {
          id: d.id,
          ...data,
          student: sS.data() || {},
          exam: eS.data() || { totalMarks: 70 }
        };
      }));
      setCompleted(res.sort((a, b) => b.completedAt?.toMillis() - a.completedAt?.toMillis()));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteResult = async (item) => {
    if (!window.confirm('Delete this result? Student status will be reset to Accepted.')) return;

    try {
      const cleanEmail = item.studentId.toLowerCase().trim();

      // 1. Exam record delete karein
      await deleteDoc(doc(db, "studentExams", item.id));

      // 2. Admissions collection reset karein (Yahi se certificate lock hoga)
      const studentRef = doc(db, "admissions", cleanEmail);
      await updateDoc(studentRef, {
        status: "accepted", // Wapas accepted state mein bhejne ke liye
        percentage: null,   // Purana data saaf
        issueDate: null,
        admissionDate: null
      });

      toast.success("Exam record deleted and student status reset.");
    } catch (err) {
      console.error("Reset Error:", err);
      toast.error("Failed to reset student status.");
    }
  };

  const list = useMemo(() => {
    return completed.filter(i => {
      const matchDate = !filterDate || i.completedAt?.toDate().toISOString().split('T')[0] === filterDate;
      const matchExam = !filterExamId || i.examId === filterExamId;
      return matchDate && matchExam;
    })
      .map(i => {
        const total = Number(i.score || 0) + Number(i.attendanceMarks || 0) + Number(i.notesMarks || 0);
        const grand = (Number(i.exam?.totalMarks) || 70) + 30;
        return { ...i, total, grand, pct: ((total / (grand || 1)) * 100).toFixed(1) };
      });
  }, [completed, filterDate, filterExamId]);

  if (loading) return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="spinner-border text-primary border-3" />
    </div>
  );

  return (
    <div className="container-fluid p-2 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center bg-white p-2 border mb-3 shadow-sm rounded">
        <div>
          <h6 className="m-0 fw-bold small uppercase">
            {filterExamId ? "Filtered Results" : "Synced Results"} ({list.length})
          </h6>
          {filterExamId && (
            <small
              className="text-primary fw-bold"
              style={{ cursor: 'pointer', fontSize: '9px' }}
              onClick={() => navigate('/admin/exams/completed')}
            >
              Show All Results
            </small>
          )}
        </div>
        <input
          type="date"
          className="form-control form-control-sm shadow-none"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          style={{ width: '130px', fontSize: '11px' }}
        />
      </div>

      <div className="row g-2">
        {list.length > 0 ? (
          list.map(item => (
            <div key={item.id} className="col-12 col-md-6 col-lg-4">
              <div className={`card border-0 shadow-sm rounded-0 h-100 ${item.isAdminViewed ? 'opacity-75 border-start border-4 border-secondary' : 'border-start border-4 border-primary'}`}>
                <div className="card-body p-2">
                  <div className="d-flex justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2 overflow-hidden">
                      <img
                        src={item.student?.photoUrl || `https://ui-avatars.com/api/?name=${item.student?.name}`}
                        className="rounded border"
                        width="35"
                        height="35"
                        alt="student"
                      />
                      <div className="text-truncate">
                        <div className={`fw-bold small text-uppercase text-truncate ${item.isAdminViewed ? 'text-decoration-line-through' : ''}`} style={{ fontSize: '11px' }}>
                          {item.student?.name}
                        </div>
                        <div className="text-muted" style={{ fontSize: '9px' }}>REG: {item.student?.regNo}</div>
                      </div>
                    </div>
                    <div className="text-end">
                      <span className={`badge rounded-0 ${Number(item.pct) >= 40 ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '10px' }}>
                        {item.total}/{item.grand}
                      </span>
                      <div className="fw-bold text-muted small mt-1" style={{ fontSize: '9px' }}>{item.pct}%</div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center bg-light p-2 border-top rounded">
                    <div className="small text-truncate me-1" style={{ maxWidth: '150px' }}>
                      <div className="fw-bold text-primary text-truncate" style={{ fontSize: '11px' }}>{item.exam?.title}</div>
                      <div className="text-muted fw-bold" style={{ fontSize: '8px' }}>E:{item.score || 0} | A:{item.attendanceMarks || 0} | N:{item.notesMarks || 0}</div>
                    </div>
                    <div className="d-flex gap-1">
                      <button
                        className={`btn btn-sm border p-1 px-2 ${item.isAdminViewed ? 'btn-success text-white' : 'btn-white text-muted'}`}
                        onClick={() => updateDoc(doc(db, "studentExams", item.id), { isAdminViewed: !item.isAdminViewed })}
                      >
                        <i className={`bi ${item.isAdminViewed ? 'bi-check-circle-fill' : 'bi-check-circle'}`} />
                      </button>
                      <button
                        className="btn btn-sm btn-white border p-1 px-2 text-primary"
                        onClick={() => navigate(`../result/${item.id}`)}
                      >
                        <i className="bi bi-eye" />
                      </button>
                      <button
                        className="btn btn-sm btn-white border p-1 px-2 text-danger"
                        onClick={() => handleDeleteResult(item)}
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5 bg-white border border-dashed rounded mt-2">
            <i className="bi bi-clipboard-x fs-1 text-muted d-block mb-2"></i>
            <h6 className="fw-bold text-muted text-uppercase mb-1">No Results Found</h6>
            <p className="small text-secondary mb-0">
              {filterDate || filterExamId
                ? "Try changing the date or clearing the filters."
                : "No students have completed the exam yet."}
            </p>
            {(filterDate || filterExamId) && (
              <button
                className="btn btn-link btn-sm fw-bold mt-2 text-decoration-none"
                onClick={() => { setFilterDate(""); navigate('/admin/exams/completed'); }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}