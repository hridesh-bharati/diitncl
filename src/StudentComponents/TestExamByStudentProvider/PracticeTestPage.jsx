// src\StudentComponents\TestExamByStudentProvider\PracticeTestPage.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Add this

export default function PracticeTestPage() {
  const [userEmail, setUserEmail] = useState("");
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUserEmail(user.email.toLowerCase().trim());
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
        if (snap.empty) { setTests([]); return; }

        const listPromises = snap.docs.map(async (d) => {
          const tId = d.data().testId;
          if (tId === "testId") return null;

          const tDoc = await getDoc(doc(db, "practiceTests", tId));
          return tDoc.exists() ? { id: tDoc.id, ...tDoc.data() } : null;
        });

        const resolved = await Promise.all(listPromises);
        setTests(resolved.filter(t => t !== null));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    });
    return () => unsub();
  }, [userEmail]);

  if (loading) return <div className="text-center p-5 mt-5"><div className="spinner-border text-primary" /></div>;

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">Practice Hub <span className="badge bg-primary rounded-pill fs-6">{tests.length}</span></h3>
      <div className="row g-4">
        {tests.map((test) => (
          <div className="col-md-4" key={test.id}>
            <div className="card h-100 shadow-sm border-0 rounded-4 p-3 text-center">
              <div className="bg-primary-subtle text-primary rounded-circle d-inline-flex p-3 mb-3 mx-auto" style={{ width: 'fit-content' }}>
                <i className="bi bi-journal-text fs-3"></i>
              </div>
              <h5 className="fw-bold">{test.title}</h5>
              <p className="small text-muted mb-4">⏱ {test.duration} Minutes</p>

              {/* Functional Button */}
              <button
                className="btn btn-primary w-100 rounded-pill py-2 fw-bold"
                onClick={() => navigate(`/student/practice-tests/attempt/${test.id}`)}
              >
                Start Test
              </button>
            </div>
          </div>
        ))}
      </div>
      {tests.length === 0 && <div className="text-center py-5 text-muted">No tests assigned to {userEmail}</div>}
    </div>
  );
}