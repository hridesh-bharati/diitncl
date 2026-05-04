// src/AdminComponents/Students/Exams/admin/pages/AdminCompletedExams.jsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
  const filterExamId = new URLSearchParams(search).get("examId");

  const studentCacheRef = useRef({});
  const examCacheRef = useRef({});

  const normId = (id) => id?.toLowerCase().trim();
  const getTime = (t) => t?.toMillis() || 0;

  useEffect(() => {
    const q = query(
      collection(db, "studentExams"),
      where("status", "==", "Completed")
    );

    const unsubscribe = onSnapshot(q, async (snap) => {
      const studentCache = studentCacheRef.current;
      const examCache = examCacheRef.current;

      const enriched = await Promise.all(
        snap.docs.map(async (d) => {
          const data = { id: d.id, ...d.data() };
          const sKey = normId(data.studentId);
          const eKey = data.examId;

          if (!studentCache[sKey]) {
            studentCache[sKey] = getDoc(doc(db, "admissions", sKey)).then((s) => s.data() || {});
          }
          if (!examCache[eKey]) {
            examCache[eKey] = getDoc(doc(db, "exams", eKey)).then((s) => s.data() || { totalMarks: 70 });
          }

          const [student, exam] = await Promise.all([studentCache[sKey], examCache[eKey]]);
          return { ...data, student, exam };
        })
      );

      const grouped = {};
      enriched.forEach((item) => {
        const key = item.student?.regNo || item.studentId || "UNKNOWN";
        (grouped[key] ||= []).push(item);
      });

      const final = Object.values(grouped)
        .flatMap((arr) =>
          arr
            .sort((a, b) => getTime(a.completedAt) - getTime(b.completedAt))
            .map((item, i) => ({ ...item, uiAttempt: i + 1 }))
        )
        .sort((a, b) => getTime(b.completedAt) - getTime(a.completedAt));

      setCompleted(final);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = useCallback((t) => t?.toDate().toISOString().split('T')[0], []);

  const list = useMemo(() =>
    completed
      .filter(i =>
        (!filterDate || formatDate(i.completedAt) === filterDate) &&
        (!filterExamId || i.examId === filterExamId)
      )
      .map(i => {
        const total = (Number(i.score) || 0) + (Number(i.attendanceMarks) || 0) + (Number(i.notesMarks) || 0);
        const grand = (Number(i.exam?.totalMarks) || 70) + 30;
        return { ...i, total, grand, pct: ((total / (grand || 1)) * 100).toFixed(1) };
      }),
    [completed, filterDate, filterExamId, formatDate]
  );

  const handleDelete = async (id) => {
    if (window.confirm("Delete this result?")) {
      try {
        await deleteDoc(doc(db, "studentExams", id));
        toast.success("Result deleted");
      } catch (e) {
        toast.error("Error deleting");
      }
    }
  };

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-primary" /></div>;

  return (
    <div className="container-fluid p-2 bg-light min-vh-100">
      {/* Header with Search and Clear Options */}
      <div className="d-flex justify-content-between align-items-center bg-white p-2 border mb-3 shadow-sm rounded">
        <div>
          <h6 className="m-0 fw-bold small text-uppercase">
            {filterExamId ? "Filtered Results" : "All Results"} ({list.length})
          </h6>
          {filterExamId && (
            <small 
              className="text-primary fw-bold" 
              style={{ cursor: 'pointer', fontSize: '10px' }}
              onClick={() => navigate('/admin/exams/completed')}
            >
              Show All Exams
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

      <div className="row g-2 mb-5 pb-5">
        {list.length > 0 ? (
          list.map(item => (
            <div key={item.id} className="col-12 col-md-6 col-lg-4">
              <div className={`card border-0 shadow-sm rounded-0 h-100 border-start border-4 ${item.isAdminViewed ? 'border-secondary opacity-75' : 'border-primary'}`}>
                <div className="card-body p-2">
                  <div className="d-flex justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2 overflow-hidden">
                      <img src={item.student?.photoUrl || `https://ui-avatars.com/api/?name=${item.student?.name}`} className="rounded border" width="35" height="35" alt="s" />
                      <div className="text-truncate">
                        <div className="d-flex align-items-center gap-1">
                          <div className="fw-bold small text-uppercase text-truncate" style={{ fontSize: '11px' }}>{item.student?.name}</div>
                          <span className={`badge ${item.uiAttempt > 1 ? 'bg-warning text-dark' : 'bg-info'}`} style={{ fontSize: '7px' }}>
                            {item.uiAttempt > 1 ? `RE-EXAM (${item.uiAttempt})` : '1st ATTEMPT'}
                          </span>
                        </div>
                        <div className="text-muted" style={{ fontSize: '9px' }}>REG: {item.student?.regNo}</div>
                      </div>
                    </div>
                    <div className="text-end">
                      <span className={`badge rounded-0 ${Number(item.pct) >= 40 ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '10px' }}>{item.total}/{item.grand}</span>
                      <div className="fw-bold text-muted small mt-1" style={{ fontSize: '9px' }}>{item.pct}%</div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center bg-light p-2 border-top rounded">
                    <div className="text-truncate me-1">
                        <div className="fw-bold text-primary text-truncate small" style={{ fontSize: '10px' }}>{item.exam?.title || 'No Title'}</div>
                        <div className="text-muted fw-bold" style={{ fontSize: '8px' }}>E:{item.score || 0} A:{item.attendanceMarks || 0} N:{item.notesMarks || 0}</div>
                    </div>
                    <div className="d-flex gap-1">
                      <button 
                        className={`btn btn-sm border p-1 px-2 ${item.isAdminViewed ? 'btn-success text-white' : 'btn-white text-muted'}`}
                        onClick={() => updateDoc(doc(db, "studentExams", item.id), { isAdminViewed: !item.isAdminViewed })}
                      >
                        <i className={`bi ${item.isAdminViewed ? 'bi-check-circle-fill' : 'bi-check-circle'}`} />
                      </button>
                      <button className="btn btn-sm btn-white border p-1 px-2 text-primary" onClick={() => navigate(`../result/${item.id}`)}><i className="bi bi-eye" /></button>
                      <button className="btn btn-sm btn-white border p-1 px-2 text-danger" onClick={() => handleDelete(item.id)}><i className="bi bi-trash" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Empty State / No Results Found */
          <div className="col-12 text-center py-5 bg-white border border-dashed rounded mt-2">
            <i className="bi bi-search fs-1 text-muted d-block mb-2"></i>
            <h6 className="fw-bold text-muted text-uppercase mb-1">No Results Found</h6>
            <p className="small text-secondary mb-3">Try changing the date or clearing filters.</p>
            {(filterDate || filterExamId) && (
              <button 
                className="btn btn-outline-primary btn-sm rounded-pill px-3" 
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