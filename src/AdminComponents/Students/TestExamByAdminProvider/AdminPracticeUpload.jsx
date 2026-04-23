// AdminComponents\Students\TestExamByAdminProvider\AdminPracticeUpload.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../firebase/firebase";
import { collection, addDoc, deleteDoc, doc, getDocs, serverTimestamp, query, orderBy } from "firebase/firestore";
import { toast } from "react-toastify";
import BackButton from "../../../Components/HelperCmp/BackButton/BackButton";

export default function AdminPracticeUpload() {
  const [tests, setTests] = useState([]);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  const loadTests = async () => {
    const q = query(collection(db, "practiceTests"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setTests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { loadTests(); }, []);

  const createTest = async (e) => {
    e.preventDefault();
    if (!title || !duration) return toast.error("Fill all fields");
    setLoading(true);
    try {
      await addDoc(collection(db, "practiceTests"), {
        title, duration: Number(duration), totalQuestions: 0, createdAt: serverTimestamp()
      });
      setTitle(""); setDuration(""); loadTests();
      toast.success("Created");
    } catch { toast.error("Failed"); } finally { setLoading(false); }
  };

  return (
    <div className="container py-3 bg-light min-vh-100">
      {/* Header with Back Button */}
      <div className="d-flex align-items-center justify-content-between gap-2 mb-3 bg-white p-2">
        <BackButton />
        <h4 className="fw-bold mb-0">Manage Practice Tests</h4>
      </div>

      {/* Quick Create Form */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 ">
        <div className="card-body p-3">
          <form onSubmit={createTest} className="row g-2 align-items-end">
            <div className="col-md-6">
              <input className="form-control rounded-3 shadow-none" placeholder="Paper Title" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="col-md-3">
              <input type="number" className="form-control rounded-3 shadow-none" placeholder="Duration(in minute)" value={duration} onChange={e => setDuration(e.target.value)} />
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary w-100 fw-bold rounded-3 shadow-sm" disabled={loading}>
                {loading ? "..." : "Create Paper"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Grid: PC me 2-2 (col-md-6), Mobile me 1 (col-12) */}
      <div className="row g-3 mb-4 pb-5 mb-lg-0 pb-lg-0">
        {tests.map((test) => (
          <div className="col-12 col-md-6" key={test.id}>
            <div className="card h-100 border-0 shadow-sm rounded-4">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-bold text-dark mb-0 text-truncate" style={{ maxWidth: '80%' }}>{test.title}</h5>
                  <button onClick={async () => { if (window.confirm("Delete?")) { await deleteDoc(doc(db, "practiceTests", test.id)); loadTests(); } }} className="btn btn-sm text-danger p-0">
                    <i className="bi bi-trash3"></i>
                  </button>
                </div>

                <p className="text-muted small mb-3">
                  ⏱ {test.duration} Min | 📝 {test.totalQuestions || 0} Questions
                </p>

                <div className="d-flex gap-2">
                  <Link to={`/admin/practice-tests/assign/${test.id}`} className="btn btn-dark btn-sm rounded-pill flex-grow-1 py-2 fw-bold">
                    Assign
                  </Link>
                  <Link to={`/admin/practice-tests/questions?testId=${test.id}`} className="btn btn-outline-primary btn-sm rounded-pill flex-grow-1 py-2 fw-bold">
                    Questions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}