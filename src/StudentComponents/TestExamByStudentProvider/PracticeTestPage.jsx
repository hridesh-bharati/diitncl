// StudentComponents\TestExamByStudentProvider\PracticeTestPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function PracticeTestPage() {
  const [userEmail, setUserEmail] = useState("");
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUserEmail(u.email.toLowerCase());
      else setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!userEmail) return;
    const q = query(collection(db, "practiceAssigned"), where("studentId", "==", userEmail));
    const unsub = onSnapshot(q, async (snap) => {
      setLoading(true);
      try {
        const list = await Promise.all(
          snap.docs.map(async (d) => {
            const tId = d.data().testId;
            if (!tId) return null;
            const resultRef = doc(db, "practiceResults", `${userEmail}_${tId}`);
            const resultSnap = await getDoc(resultRef);
            const completed = resultSnap.exists() && resultSnap.data().status === "Completed";
            const tDoc = await getDoc(doc(db, "practiceTests", tId));

            if (!tDoc.exists()) {
              return completed ? { id: tId, title: resultSnap.data().testTitle || "Test", duration: "-", completed: true } : null;
            }
            return { id: tId, ...tDoc.data(), completed };
          })
        );
        setTests(list.filter(Boolean));
      } finally { setLoading(false); }
    });
    return () => unsub();
  }, [userEmail]);

  const courses = useMemo(() => [...new Set(tests.map((t) => t.title))].filter(Boolean), [tests]);

  const filtered = useMemo(() => {
    return tests.filter((t) => {
      const s = search.toLowerCase();
      const matchSearch = t.title?.toLowerCase().includes(s);
      const matchCourse = !course || t.title === course;
      const matchStatus = status === "all" || (status === "completed" && t.completed) || (status === "pending" && !t.completed);
      return matchSearch && matchCourse && matchStatus;
    });
  }, [tests, search, course, status]);

  if (loading) return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="spinner-border text-primary border-4" />
    </div>
  );

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* --- Sticky Header & Filters (Mobile App Style - Inline) --- */}
      <div className="bg-white shadow-sm sticky-top p-3 mb-3 border-bottom rounded-bottom-4">

        {/* Top Row: Title and Search Inline */}
        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
          <h5 className="fw-bold text-dark mb-0 text-nowrap">My Practice</h5>

          {/* Search Bar - Flexible width */}
          <div className="input-group input-group-sm border rounded-pill overflow-hidden bg-light px-2 flex-grow-1" style={{ maxWidth: '200px' }}>
            <span className="input-group-text bg-transparent border-0 text-muted pe-1">
              <i className="bi bi-search" style={{ fontSize: '0.8rem' }}></i>
            </span>
            <input
              className="form-control bg-transparent border-0 shadow-none py-1"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Bottom Row: Filters */}
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm rounded-pill border-light bg-light fw-medium"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            style={{ fontSize: '0.75rem' }}
          >
            <option value="">All Subjects</option>
            {courses.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            className="form-select form-select-sm rounded-pill border-light bg-light fw-medium"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ fontSize: '0.75rem', maxWidth: '100px' }}
          >
            <option value="all">Status</option>
            <option value="completed">Done</option>
            <option value="pending">Due</option>
          </select>
        </div>
      </div>
      {/* --- Main Content (Scrollable) --- */}
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="small text-muted fw-bold">Results: {filtered.length} Tests</span>
        </div>

        <div className="row g-3">
          {filtered.length ? (
            filtered.map((t) => (
              <div className="col-12 col-md-6 col-lg-4" key={t.id}>
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center gap-3">
                      {/* Icon Box */}
                      <div className={`rounded-4 d-flex align-items-center justify-content-center ${t.completed ? 'bg-success-subtle' : 'bg-primary-subtle'}`} style={{ width: '50px', height: '50px' }}>
                        <i className={`bi ${t.completed ? 'bi-check-circle-fill text-success' : 'bi-journal-text text-primary'} fs-4`}></i>
                      </div>

                      {/* Text Info */}
                      <div className="flex-grow-1 overflow-hidden">
                        <h6 className="fw-bold mb-0 text-truncate">{t.title}</h6>
                        <div className="d-flex gap-2 align-items-center mt-1">
                          <span className="badge bg-light text-muted border fw-normal">
                            <i className="bi bi-clock me-1"></i>{t.duration} m
                          </span>
                          {t.completed && <span className="badge bg-success-subtle text-success border-success-subtle fw-bold">COMPLETED</span>}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      className={`btn w-100 mt-3 rounded-pill py-2 fw-bold shadow-sm border-0 ${t.completed ? "btn-dark" : "btn-primary"
                        }`}
                      onClick={() => navigate(t.completed ? `/student/practice-tests/results/${t.id}` : `/student/practice-tests/attempt/${t.id}`)}
                    >
                      {t.completed ? "Review Result" : "Take Test"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center mt-5">
              <div className="display-1 text-light"><i className="bi bi-clipboard2-x"></i></div>
              <p className="text-muted mt-2">No tests found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}