// src/AdminComponents/Students/Exams/students/pages/StudentExamList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../../../firebase/firebase";
import { useAuth } from "../../../../../contexts/AuthContext"; // Ensure path is correct
import { collection, query, where, getDocs } from "firebase/firestore";

export default function StudentExamList() {
  const [myExams, setMyExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    const fetchMyExams = async () => {
      try {
        // Fetch exams assigned to this specific student
        const q = query(
          collection(db, "studentExams"),
          where("studentId", "==", currentUser.uid)
        );
        const snap = await getDocs(q);
        setMyExams(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyExams();
  }, [currentUser]);

  if (loading) return <div className="text-center p-5"><div className="spinner-grow text-primary" /></div>;

  return (
    <div className="container-fluid py-4">
      <h4 className="fw-bold mb-4">📝 Available Examinations</h4>
      <div className="row g-3">
        {myExams.length > 0 ? myExams.map((exam) => (
          <div key={exam.id} className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="badge bg-light text-dark border">Exam ID: {exam.examId.slice(0, 6)}</span>
                  <span className={`badge ${exam.status === 'Completed' ? 'bg-success' : 'bg-primary'}`}>
                    {exam.status}
                  </span>
                </div>
                <h5 className="fw-bold mb-3">Computer Theory Test</h5>
                <p className="text-muted small mb-4">Please ensure you have a stable internet connection before starting.</p>

                {exam.status === "Pending" ? (
                  <button className="btn btn-primary w-100 rounded-pill py-2" onClick={() => navigate(`../student-exam/${exam.examId}`)}>
                    Start Examination
                  </button>
                ) : exam.status === "Completed" ? (
                  <button className="btn btn-outline-success w-100 rounded-pill py-2" onClick={() => navigate(`result/${exam.id}`)}>
                    View Result
                  </button>
                ) : (
                  <button className="btn btn-warning w-100 rounded-pill py-2" disabled>Resume Exam</button>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-5">
            <i className="bi bi-emoji-smile fs-1 text-muted"></i>
            <h5 className="mt-3 text-muted">No exams assigned to you yet.</h5>
          </div>
        )}
      </div>
    </div>
  );
}