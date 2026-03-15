// src/AdminComponents/Students/Exams/admin/pages/AdminExamResultView.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../../../firebase/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

export default function AdminExamResultView() {
  const { studentExamId } = useParams();
  const [result, setResult] = useState(null);
  const [student, setStudent] = useState(null);
  const [exam, setExam] = useState(null);
  const [fullQuestions, setFullQuestions] = useState([]); // 🔥 To store actual Q data
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFullReport = async () => {
      try {
        setLoading(true);
        // 1. Fetch Student Exam Result
        const resSnap = await getDoc(doc(db, "studentExams", studentExamId));
        
        if (resSnap.exists()) {
          const resData = resSnap.data();
          setResult(resData);

          // 2. Fetch Student, Exam Info & ALL Questions for this exam
          const [sSnap, eSnap, qSnap] = await Promise.all([
            getDoc(doc(db, "admissions", resData.studentId)),
            getDoc(doc(db, "exams", resData.examId)),
            getDocs(query(collection(db, "examQuestions"), where("examId", "==", resData.examId)))
          ]);

          if (sSnap.exists()) setStudent(sSnap.data());
          if (eSnap.exists()) setExam(eSnap.data());
          
          // Store questions in a list for easy lookup
          const qList = qSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          setFullQuestions(qList);
        }
      } catch (err) {
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFullReport();
  }, [studentExamId]);

  if (loading) return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-white">
      <div className="spinner-border text-primary border-4" />
    </div>
  );

  if (!result) return <div className="p-5 text-center">Report not found.</div>;

  const score = result.score || 0;
  const totalMarks = exam?.totalMarks || 0;
  const percentage = ((score / (totalMarks || 1)) * 100).toFixed(1);

  return (
    <div className="container-fluid py-4 bg-light min-vh-100 text-dark">
      {/* Header */}
      <div className="d-flex align-items-center gap-2 mb-4">
        <button className="btn btn-white border shadow-sm rounded-0" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <h5 className="fw-bold mb-0 text-uppercase">Student Assessment Report</h5>
      </div>

      <div className="row g-4">
        {/* LEFT: Profile & Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-0 mb-3 text-center p-4 bg-white">
            <img 
              src={student?.photoUrl || `https://ui-avatars.com/api/?name=${student?.name}&background=random`} 
              className="rounded-0 border mx-auto mb-3 shadow-sm"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
              alt="Student"
            />
            <h5 className="fw-bold mb-1 text-uppercase text-primary">{student?.name}</h5>
            <div className="badge bg-light text-dark border rounded-0 mb-2">{student?.course}</div>
            <p className="text-muted small fw-bold mb-0 uppercase">REG: {student?.regNo}</p>
            
            <hr className="my-4" />
            
            <div className="row g-0">
              <div className="col-6 border-end">
                <div className="h4 fw-bold mb-0">{score}/{totalMarks}</div>
                <small className="text-muted uppercase fw-bold" style={{ fontSize: '9px' }}>Total Score</small>
              </div>
              <div className="col-6">
                <div className={`h4 fw-bold mb-0 ${Number(percentage) >= 40 ? 'text-success' : 'text-danger'}`}>
                  {percentage}%
                </div>
                <small className="text-muted uppercase fw-bold" style={{ fontSize: '9px' }}>Result Status</small>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-0 bg-dark text-white p-3">
             <h6 className="fw-bold small text-uppercase mb-3 opacity-75 border-bottom border-secondary pb-2">Exam Metadata</h6>
             <div className="d-flex justify-content-between mb-2">
                <small className="opacity-75 uppercase">Attempted On:</small>
                <small className="fw-bold">{result.completedAt?.toDate().toLocaleDateString('en-IN')}</small>
             </div>
             <div className="d-flex justify-content-between mb-2">
                <small className="opacity-75 uppercase">Exam Title:</small>
                <small className="fw-bold text-truncate ms-3">{exam?.title}</small>
             </div>
             <div className="d-flex justify-content-between">
                <small className="opacity-75 uppercase">Duration:</small>
                <small className="fw-bold">{exam?.duration} Hours</small>
             </div>
          </div>
        </div>

        {/* RIGHT: Detailed Question Breakdown */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-0 mb-4 bg-white">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-0 text-uppercase">Detailed Answer Sheet</h6>
              <span className="badge bg-primary rounded-0">{fullQuestions.length} Questions Total</span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr style={{ fontSize: '11px' }}>
                      <th className="ps-4" width="60">#</th>
                      <th width="40%">QUESTION STATEMENT</th>
                      <th className="text-center">STUDENT</th>
                      <th className="text-center">CORRECT</th>
                      <th className="text-center pe-4">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fullQuestions.map((q, idx) => {
                      const studentAns = result.answers?.[q.id] || "N/A";
                      const isCorrect = studentAns === q.correctAnswer;
                      const isSkipped = studentAns === "N/A";

                      return (
                        <tr key={q.id} style={{ fontSize: '13px' }}>
                          <td className="ps-4 fw-bold text-muted">{idx + 1}</td>
                          <td className="py-3">
                            <div className="fw-bold text-dark mb-1">{q.question}</div>
                            <div className="text-muted small" style={{fontSize: '11px'}}>Marks: {q.marks || 1}</div>
                          </td>
                          <td className="text-center">
                            <span className={`fw-bold ${isCorrect ? 'text-success' : isSkipped ? 'text-muted' : 'text-danger'}`}>
                              {studentAns}
                            </span>
                          </td>
                          <td className="text-center fw-bold text-primary">
                            {q.correctAnswer}
                          </td>
                          <td className="text-center pe-4">
                            {isSkipped ? (
                              <i className="bi bi-dash-circle text-muted" title="Skipped"></i>
                            ) : isCorrect ? (
                              <i className="bi bi-check-square-fill text-success" title="Correct"></i>
                            ) : (
                              <i className="bi bi-x-square-fill text-danger" title="Incorrect"></i>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="d-flex justify-content-end gap-2 mb-5">
             <button className="btn btn-dark rounded-0 fw-bold px-4" onClick={() => window.print()}>
               <i className="bi bi-printer me-2"></i> PRINT REPORT
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}