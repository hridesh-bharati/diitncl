// src/AdminComponents/Students/Exams/students/pages/StudentExamResult.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../../../firebase/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

export default function StudentExamResult() {
  const { studentExamId } = useParams();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        // 1. Fetch the Student Exam Record (Score, Status etc)
        const docRef = doc(db, "studentExams", studentExamId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setExamData(data);

          // 2. Fetch the detailed responses/answers
          const q = query(collection(db, "examResponses"), where("studentExamId", "==", studentExamId));
          const resSnap = await getDocs(q);
          setResponses(resSnap.docs.map(d => d.data()));
        }
      } catch (err) {
        console.error("Error fetching result:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [studentExamId]);

  // Calculate Stats
  const stats = useMemo(() => {
    if (!examData) return null;
    const total = examData.totalMarks || 100;
    const obtained = examData.score || 0;
    const percentage = ((obtained / total) * 100).toFixed(2);
    const isPassed = obtained >= (examData.passingMarks || 33);
    return { percentage, isPassed };
  }, [examData]);

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary" /></div>;

  if (!examData) return <div className="text-center p-5">Result not found.</div>;

  return (
    <div className="container py-4">
      {/* Header / Result Banner */}
      <div className={`card border-0 shadow-sm rounded-4 mb-4 overflow-hidden`}>
        <div className={`p-4 text-center text-white ${stats.isPassed ? 'bg-success' : 'bg-danger'}`}>
          <h2 className="fw-bold mb-1">{stats.isPassed ? '🎊 CONGRATULATIONS!' : '⚠️ BETTER LUCK NEXT TIME'}</h2>
          <p className="mb-0 opacity-75">You have {stats.isPassed ? 'Passed' : 'Failed'} the examination</p>
        </div>
        <div className="card-body p-4">
          <div className="row text-center g-3">
            <div className="col-4 border-end">
              <h6 className="text-muted small text-uppercase">Score</h6>
              <h3 className="fw-bold mb-0">{examData.score} / {examData.totalMarks}</h3>
            </div>
            <div className="col-4 border-end">
              <h6 className="text-muted small text-uppercase">Percentage</h6>
              <h3 className="fw-bold mb-0">{stats.percentage}%</h3>
            </div>
            <div className="col-4">
              <h6 className="text-muted small text-uppercase">Result</h6>
              <h3 className={`fw-bold mb-0 ${stats.isPassed ? 'text-success' : 'text-danger'}`}>
                {stats.isPassed ? 'PASS' : 'FAIL'}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <h5 className="fw-bold mb-3"><i className="bi bi-journal-check me-2"></i>Question Review</h5>
      <div className="row g-3 mb-4">
        {responses.map((res, i) => (
          <div key={i} className="col-12">
            <div className={`card border-0 shadow-sm rounded-3 ${res.isCorrect ? 'border-start border-4 border-success' : 'border-start border-4 border-danger'}`}>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="fw-bold small">Q{i + 1}. {res.questionText || 'Question'}</span>
                  {res.isCorrect ? 
                    <span className="text-success small fw-bold"><i className="bi bi-check-circle-fill"></i> +{res.marks}</span> : 
                    <span className="text-danger small fw-bold"><i className="bi bi-x-circle-fill"></i> 0</span>
                  }
                </div>
                <div className="row g-2 mt-1">
                  <div className="col-md-6">
                    <div className={`p-2 rounded small ${res.isCorrect ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                      Your Answer: <b>{res.selectedOption}</b>
                    </div>
                  </div>
                  {!res.isCorrect && (
                    <div className="col-md-6">
                      <div className="p-2 rounded small bg-success bg-opacity-10 text-success">
                        Correct Answer: <b>{res.correctOption}</b>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-grid">
        <button className="btn btn-primary rounded-pill py-2 fw-bold shadow-sm" onClick={() => navigate("/admin/student-exams")}>
          Back to Exam List
        </button>
      </div>
    </div>
  );
}