import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../../../../../firebase/firebase";
import { collection, query, where, onSnapshot, getDoc, doc, deleteDoc } from "firebase/firestore";
export default function AdminCompletedExams() {
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const navigate = useNavigate();
  const { search } = useLocation();
  const filterExamId = new URLSearchParams(search).get("examId");

  // 🔥 top pe likho (component ke andar, useEffect ke bahar)
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

          // ✅ student cache
          if (!studentCache[sKey]) {
            studentCache[sKey] = getDoc(doc(db, "admissions", sKey))
              .then((s) => s.data() || {});
          }

          // ✅ exam cache
          if (!examCache[eKey]) {
            examCache[eKey] = getDoc(doc(db, "exams", eKey))
              .then((s) => s.data() || {});
          }

          const [student, exam] = await Promise.all([
            studentCache[sKey],
            examCache[eKey],
          ]);

          return { ...data, student, exam };
        })
      );

      // ✅ grouping
      const grouped = {};
      enriched.forEach((item) => {
        const key = item.student?.regNo || "UNKNOWN";
        (grouped[key] ||= []).push(item);
      });

      // ✅ attempts + sorting
      const final = Object.values(grouped)
        .flatMap((arr) =>
          arr
            .sort((a, b) => getTime(a.completedAt) - getTime(b.completedAt))
            .map((item, i) => ({
              ...item,
              uiAttempt: i + 1,
            }))
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
        const total =
          (Number(i.score) || 0) +
          (Number(i.attendanceMarks) || 0) +
          (Number(i.notesMarks) || 0);

        const grand = (Number(i.exam?.totalMarks) || 70) + 30;

        return {
          ...i,
          total,
          grand,
          pct: ((total / (grand || 1)) * 100).toFixed(1)
        };
      }),
    [completed, filterDate, filterExamId, formatDate]
  );

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-primary" /></div>;

  return (
    <div className="container-fluid p-2 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center bg-white p-2 border mb-3 shadow-sm rounded">
        <h6 className="m-0 fw-bold small text-uppercase">Results ({list.length})</h6>
        <input type="date" className="form-control form-control-sm shadow-none" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{ width: '130px', fontSize: '11px' }} />
      </div>

      <div className="row g-2 mb-5 pb-5">
        {list.map(item => (
          <div key={item.id} className="col-12 col-md-6 col-lg-4">
            <div className={`card border-0 shadow-sm rounded-0 h-100 border-start border-4 ${item.isAdminViewed ? 'border-secondary' : 'border-primary'}`}>
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
                    <span className={`badge rounded-0 ${item.pct >= 40 ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '10px' }}>{item.total}/{item.grand}</span>
                    <div className="fw-bold text-muted small mt-1" style={{ fontSize: '9px' }}>{item.pct}%</div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center bg-light p-2 border-top rounded">
                  <div className="fw-bold text-primary text-truncate small" style={{ fontSize: '11px' }}>{item.exam?.title || 'No Title'}</div>
                  <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-white border p-1 px-2 text-primary" onClick={() => navigate(`../result/${item.id}`)}><i className="bi bi-eye" /></button>
                    <button className="btn btn-sm btn-white border p-1 px-2 text-danger" onClick={() => window.confirm('Delete?') && deleteDoc(doc(db, "studentExams", item.id))}><i className="bi bi-trash" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}