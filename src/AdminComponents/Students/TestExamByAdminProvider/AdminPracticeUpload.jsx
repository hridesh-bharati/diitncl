import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../firebase/firebase";
import { collection, addDoc, deleteDoc, doc, getDocs, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export default function AdminPracticeUpload() {
  const [tests, setTests] = useState([]);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  const loadTests = async () => {
    const snap = await getDocs(collection(db, "practiceTests"));
    setTests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { loadTests(); }, []);

  const createTest = async (e) => {
    e.preventDefault();
    if (!title || !duration) return toast.error("Fill all fields");
    try {
      setLoading(true);
      await addDoc(collection(db, "practiceTests"), {
        title, duration: Number(duration), totalQuestions: 0, createdAt: serverTimestamp()
      });
      setTitle(""); setDuration(""); loadTests();
      toast.success("Test Created");
    } catch { toast.error("Failed"); } finally { setLoading(false); }
  };

  return (
    <div className="container py-4 bg-light min-vh-100">
      <h3 className="fw-bold mb-4">Manage Practice Tests</h3>
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <form onSubmit={createTest} className="row g-3 align-items-end">
            <div className="col-md-5">
              <input className="form-control rounded-3" placeholder="Test Title" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="col-md-3">
              <input type="number" className="form-control rounded-3" placeholder="Min" value={duration} onChange={e => setDuration(e.target.value)} />
            </div>
            <div className="col-md-4">
              <button className="btn btn-primary w-100 fw-bold rounded-3 shadow-sm" disabled={loading}>Create Paper</button>
            </div>
          </form>
        </div>
      </div>
      <div className="row g-4">
        {tests.map(test => (
          <div className="col-md-6 col-lg-4" key={test.id}>
            <div className="card h-100 border-0 shadow-sm rounded-4">
              <div className="card-body">
                <h5 className="fw-bold">{test.title}</h5>
                <p className="text-muted small mb-3">⏱ {test.duration} Min | 📝 {test.totalQuestions || 0} Questions</p>
                <div className="d-grid gap-2">
                  <div className="d-flex gap-2">
                    <Link to={`/admin/practice-tests/assign/${test.id}`} className="btn btn-outline-primary btn-sm flex-grow-1">Assign</Link>
                    <Link to={`/admin/practice-tests/questions?testId=${test.id}`} className="btn btn-warning btn-sm flex-grow-1">Questions</Link>
                  </div>
                  <button onClick={async () => { if (window.confirm("Delete?")) { await deleteDoc(doc(db, "practiceTests", test.id)); loadTests(); } }} className="btn btn-link text-danger btn-sm text-decoration-none">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}