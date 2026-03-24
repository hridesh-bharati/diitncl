// // src/AdminComponents/Students/Exams/admin/pages/AdminExamResultView.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { db } from "../../../../../firebase/firebase";
// import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

// export default function AdminExamResultView() {
//   const { studentExamId } = useParams();
//   const [result, setResult] = useState(null);
//   const [student, setStudent] = useState(null);
//   const [exam, setExam] = useState(null);
//   const [fullQuestions, setFullQuestions] = useState([]);  
//   const [loading, setLoading] = useState(true);
//   const [expandedCode, setExpandedCode] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFullReport = async () => {
//       try {
//         setLoading(true);
//         // 1. Fetch Student Exam Result
//         const resSnap = await getDoc(doc(db, "studentExams", studentExamId));
        
//         if (resSnap.exists()) {
//           const resData = resSnap.data();
//           setResult(resData);

//           // 2. Fetch Student, Exam Info & ALL Questions for this exam
//           const [sSnap, eSnap, qSnap] = await Promise.all([
//             getDoc(doc(db, "admissions", resData.studentId)),
//             getDoc(doc(db, "exams", resData.examId)),
//             getDocs(query(collection(db, "examQuestions"), where("examId", "==", resData.examId)))
//           ]);

//           if (sSnap.exists()) setStudent(sSnap.data());
//           if (eSnap.exists()) setExam(eSnap.data());
          
//           // Store questions in a list for easy lookup
//           const qList = qSnap.docs.map(d => ({ id: d.id, ...d.data() }));
//           setFullQuestions(qList);
//         }
//       } catch (err) {
//         console.error("Error fetching report:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFullReport();
//   }, [studentExamId]);

//   // Helper to format student answer for display
//   const formatStudentAnswer = (q, studentAns) => {
//     if (q.type === 'mcq') {
//       return studentAns || "N/A";
//     } else if (q.type === 'programming') {
//       if (!studentAns || studentAns === "N/A") return "No code submitted";
//       if (typeof studentAns === 'object' && studentAns.code) {
//         return studentAns.code;
//       }
//       return studentAns;
//     }
//     return "N/A";
//   };

//   // Helper to check if answer is correct for MCQ
//   const isAnswerCorrect = (q, studentAns) => {
//     if (q.type === 'mcq') {
//       return studentAns === q.correctAnswer;
//     }
//     // For programming, you might have auto-grading logic
//     // This could be based on test cases, manual review flag, etc.
//     // For now, we'll show a "Pending Review" status
//     return null; // Not applicable for auto-grading
//   };

//   // Get status display for programming questions
//   const getProgrammingStatus = (q, studentAns) => {
//     if (!studentAns || studentAns === "N/A") return "NOT SUBMITTED";
//     if (studentAns.graded) {
//       return studentAns.graded === 'correct' ? 'CORRECT' : 'INCORRECT';
//     }
//     return "PENDING REVIEW";
//   };

//   // Get status icon
//   const getStatusIcon = (q, studentAns, isCorrect) => {
//     if (q.type === 'mcq') {
//       const skipped = !studentAns || studentAns === "N/A";
//       if (skipped) return <i className="bi bi-dash-circle text-muted" title="Skipped"></i>;
//       if (isCorrect) return <i className="bi bi-check-square-fill text-success" title="Correct"></i>;
//       return <i className="bi bi-x-square-fill text-danger" title="Incorrect"></i>;
//     } else {
//       // Programming questions
//       if (!studentAns || studentAns === "N/A") {
//         return <i className="bi bi-dash-circle text-muted" title="No code submitted"></i>;
//       }
//       if (studentAns.graded) {
//         return studentAns.graded === 'correct' 
//           ? <i className="bi bi-check-square-fill text-success" title="Correct"></i>
//           : <i className="bi bi-x-square-fill text-danger" title="Incorrect"></i>;
//       }
//       return <i className="bi bi-clock-history text-warning" title="Pending Manual Review"></i>;
//     }
//   };

//   if (loading) return (
//     <div className="vh-100 d-flex justify-content-center align-items-center bg-white">
//       <div className="spinner-border text-primary border-4" />
//     </div>
//   );

//   if (!result) return <div className="p-5 text-center">Report not found.</div>;

//   const score = result.score || 0;
//   const totalMarks = exam?.totalMarks || 0;
//   const percentage = ((score / (totalMarks || 1)) * 100).toFixed(1);
  
//   // Calculate statistics
//   const mcqQuestions = fullQuestions.filter(q => q.type === 'mcq');
//   const programmingQuestions = fullQuestions.filter(q => q.type === 'programming');
//   const answeredMcq = mcqQuestions.filter(q => result.answers?.[q.id] && result.answers[q.id] !== "N/A").length;
//   const correctMcq = mcqQuestions.filter(q => result.answers?.[q.id] === q.correctAnswer).length;
//   const submittedProgramming = programmingQuestions.filter(q => {
//     const ans = result.answers?.[q.id];
//     return ans && ans !== "N/A" && (typeof ans === 'object' ? ans.code : ans);
//   }).length;

//   return (
//     <div className="container-fluid py-4 bg-light min-vh-100 text-dark">
//       {/* Header */}
//       <div className="d-flex align-items-center gap-2 mb-4">
//         <button className="btn btn-white border shadow-sm rounded-0" onClick={() => navigate(-1)}>
//           <i className="bi bi-arrow-left"></i>
//         </button>
//         <h5 className="fw-bold mb-0 text-uppercase">Student Assessment Report</h5>
//       </div>

//       <div className="row g-4">
//         {/* LEFT: Profile & Summary */}
//         <div className="col-lg-4">
//           <div className="card border-0 shadow-sm rounded-0 mb-3 text-center p-4 bg-white">
//             <img 
//               src={student?.photoUrl || `https://ui-avatars.com/api/?name=${student?.name}&background=random`} 
//               className="rounded-0 border mx-auto mb-3 shadow-sm"
//               style={{ width: "100px", height: "100px", objectFit: "cover" }}
//               alt="Student"
//             />
//             <h5 className="fw-bold mb-1 text-uppercase text-primary">{student?.name}</h5>
//             <div className="badge bg-light text-dark border rounded-0 mb-2">{student?.course}</div>
//             <p className="text-muted small fw-bold mb-0 uppercase">REG: {student?.regNo}</p>
            
//             <hr className="my-4" />
            
//             <div className="row g-0">
//               <div className="col-6 border-end">
//                 <div className="h4 fw-bold mb-0">{score}/{totalMarks}</div>
//                 <small className="text-muted uppercase fw-bold" style={{ fontSize: '9px' }}>Total Score</small>
//               </div>
//               <div className="col-6">
//                 <div className={`h4 fw-bold mb-0 ${Number(percentage) >= 40 ? 'text-success' : 'text-danger'}`}>
//                   {percentage}%
//                 </div>
//                 <small className="text-muted uppercase fw-bold" style={{ fontSize: '9px' }}>Result Status</small>
//               </div>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="row g-2 mb-3">
//             <div className="col-6">
//               <div className="card border-0 shadow-sm rounded-0 bg-primary text-white p-3 text-center">
//                 <h3 className="fw-bold mb-0">{mcqQuestions.length}</h3>
//                 <small className="opacity-75 text-uppercase">MCQ Questions</small>
//                 <small className="mt-1">{correctMcq}/{mcqQuestions.length} Correct</small>
//               </div>
//             </div>
//             <div className="col-6">
//               <div className="card border-0 shadow-sm rounded-0 bg-warning text-dark p-3 text-center">
//                 <h3 className="fw-bold mb-0">{programmingQuestions.length}</h3>
//                 <small className="opacity-75 text-uppercase">Programming</small>
//                 <small className="mt-1">{submittedProgramming}/{programmingQuestions.length} Submitted</small>
//               </div>
//             </div>
//           </div>

//           <div className="card border-0 shadow-sm rounded-0 bg-dark text-white p-3">
//              <h6 className="fw-bold small text-uppercase mb-3 opacity-75 border-bottom border-secondary pb-2">Exam Metadata</h6>
//              <div className="d-flex justify-content-between mb-2">
//                 <small className="opacity-75 uppercase">Attempted On:</small>
//                 <small className="fw-bold">{result.completedAt?.toDate().toLocaleDateString('en-IN')}</small>
//              </div>
//              <div className="d-flex justify-content-between mb-2">
//                 <small className="opacity-75 uppercase">Exam Title:</small>
//                 <small className="fw-bold text-truncate ms-3">{exam?.title}</small>
//              </div>
//              <div className="d-flex justify-content-between">
//                 <small className="opacity-75 uppercase">Duration:</small>
//                 <small className="fw-bold">{exam?.duration} Hours</small>
//              </div>
//           </div>
//         </div>

//         {/* RIGHT: Detailed Question Breakdown */}
//         <div className="col-lg-8">
//           <div className="card border-0 shadow-sm rounded-0 mb-4 bg-white">
//             <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
//               <h6 className="fw-bold mb-0 text-uppercase">Detailed Answer Sheet</h6>
//               <div>
//                 <span className="badge bg-primary rounded-0 me-2">{fullQuestions.length} Total</span>
//                 <span className="badge bg-success rounded-0 me-2">{correctMcq} MCQ Correct</span>
//                 <span className="badge bg-warning rounded-0">{programmingQuestions.length} Programming</span>
//               </div>
//             </div>
//             <div className="card-body p-0">
//               <div className="table-responsive">
//                 <table className="table table-hover align-middle mb-0">
//                   <thead className="bg-light">
//                     <tr style={{ fontSize: '11px' }}>
//                       <th className="ps-4" width="60">#</th>
//                       <th width="35%">QUESTION</th>
//                       <th width="35%">STUDENT ANSWER</th>
//                       <th className="text-center" width="80">CORRECT</th>
//                       <th className="text-center pe-4" width="80">STATUS</th>
//                      </tr>
//                   </thead>
//                   <tbody>
//                     {fullQuestions.map((q, idx) => {
//                       const studentAns = result.answers?.[q.id];
//                       const isCorrect = isAnswerCorrect(q, studentAns);
//                       const formattedAnswer = formatStudentAnswer(q, studentAns);
//                       const isProgramming = q.type === 'programming';
//                       const programmingStatus = isProgramming ? getProgrammingStatus(q, studentAns) : null;

//                       return (
//                         <tr key={q.id} style={{ fontSize: '13px' }}>
//                           <td className="ps-4 fw-bold text-muted">
//                             {idx + 1}
//                             {isProgramming && (
//                               <i className="bi bi-code-slash ms-1 text-warning" title="Programming Question"></i>
//                             )}
//                           </td>
//                           <td className="py-3">
//                             <div className="fw-bold text-dark mb-1">{q.question}</div>
//                             <div className="text-muted small" style={{fontSize: '11px'}}>
//                               Type: {q.type.toUpperCase()} | Marks: {q.marks || 1}
//                               {isProgramming && q.language && (
//                                 <span className="ms-2">| Language: {q.language.toUpperCase()}</span>
//                               )}
//                             </div>
//                            </td>
//                           <td>
//                             {!isProgramming ? (
//                               <span className={`fw-bold ${isCorrect ? 'text-success' : (!studentAns || studentAns === "N/A") ? 'text-muted' : 'text-danger'}`}>
//                                 {formattedAnswer}
//                               </span>
//                             ) : (
//                               <div>
//                                 {formattedAnswer !== "No code submitted" && formattedAnswer !== "N/A" ? (
//                                   <div>
//                                     <button 
//                                       className="btn btn-sm btn-outline-secondary rounded-0"
//                                       onClick={() => setExpandedCode(expandedCode === q.id ? null : q.id)}
//                                     >
//                                       <i className="bi bi-code-slash me-1"></i>
//                                       {expandedCode === q.id ? 'Hide Code' : 'View Code'}
//                                     </button>
//                                     {expandedCode === q.id && (
//                                       <div className="mt-2">
//                                         <pre className="bg-dark text-light p-2 rounded-0" style={{ fontSize: '11px', maxHeight: '200px', overflow: 'auto' }}>
//                                           <code>{formattedAnswer}</code>
//                                         </pre>
//                                       </div>
//                                     )}
//                                   </div>
//                                 ) : (
//                                   <span className="text-muted fst-italic">{formattedAnswer}</span>
//                                 )}
//                                 {programmingStatus === "PENDING REVIEW" && (
//                                   <div className="mt-1">
//                                     <button className="btn btn-sm btn-warning rounded-0 mt-1">
//                                       <i className="bi bi-pencil-square me-1"></i> Grade Manually
//                                     </button>
//                                   </div>
//                                 )}
//                               </div>
//                             )}
//                            </td>
//                           <td className="text-center fw-bold text-primary">
//                             {!isProgramming ? q.correctAnswer : (
//                               <span className="text-muted">N/A</span>
//                             )}
//                            </td>
//                           <td className="text-center pe-4">
//                             {getStatusIcon(q, studentAns, isCorrect)}
//                             {isProgramming && programmingStatus && (
//                               <div className="small mt-1">
//                                 <span className={`badge ${
//                                   programmingStatus === 'CORRECT' ? 'bg-success' : 
//                                   programmingStatus === 'INCORRECT' ? 'bg-danger' : 
//                                   'bg-warning text-dark'
//                                 } rounded-0`}>
//                                   {programmingStatus}
//                                 </span>
//                               </div>
//                             )}
//                            </td>
//                          </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
          
//           <div className="d-flex justify-content-end gap-2 mb-5">
//              <button className="btn btn-dark rounded-0 fw-bold px-4" onClick={() => window.print()}>
//                <i className="bi bi-printer me-2"></i> PRINT REPORT
//              </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../../../firebase/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
// Code highlight ke liye (Optional but recommended)
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

export default function AdminExamResultView() {
  const { studentExamId } = useParams();
  const [result, setResult] = useState(null);
  const [student, setStudent] = useState(null);
  const [exam, setExam] = useState(null);
  const [fullQuestions, setFullQuestions] = useState([]);  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFullReport = async () => {
      try {
        setLoading(true);
        const resSnap = await getDoc(doc(db, "studentExams", studentExamId));
        
        if (resSnap.exists()) {
          const resData = resSnap.data();
          setResult(resData);

          const [sSnap, eSnap, qSnap] = await Promise.all([
            getDoc(doc(db, "admissions", resData.studentId)),
            getDoc(doc(db, "exams", resData.examId)),
            getDocs(query(collection(db, "examQuestions"), where("examId", "==", resData.examId)))
          ]);

          if (sSnap.exists()) setStudent(sSnap.data());
          if (eSnap.exists()) setExam(eSnap.data());
          
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
      {/* Header Section */}
      <div className="d-flex align-items-center justify-content-between mb-4 no-print">
        <div className="d-flex align-items-center gap-2">
            <button className="btn btn-white border shadow-sm rounded-0" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i>
            </button>
            <h5 className="fw-bold mb-0 text-uppercase">Final Assessment Report</h5>
        </div>
        <button className="btn btn-dark rounded-0 fw-bold px-4 shadow-sm" onClick={() => window.print()}>
            <i className="bi bi-printer me-2"></i> PRINT RESULT
        </button>
      </div>

      <div className="row g-4">
        {/* LEFT: Profile & Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-0 mb-3 text-center p-4 bg-white border-top border-primary border-4">
            <img 
              src={student?.photoUrl || `https://ui-avatars.com/api/?name=${student?.name}&background=random`} 
              className="rounded-0 border mx-auto mb-3 shadow-sm p-1 bg-white"
              style={{ width: "110px", height: "110px", objectFit: "cover" }}
              alt="Student"
            />
            <h5 className="fw-bold mb-1 text-uppercase text-primary">{student?.name}</h5>
            <div className="badge bg-light text-dark border rounded-0 mb-3 px-3 py-2">{student?.course}</div>
            
            <div className="text-start bg-light p-3 rounded-0 small">
                <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted text-uppercase fw-bold" style={{fontSize:'10px'}}>Reg No:</span>
                    <span className="fw-bold">{student?.regNo}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted text-uppercase fw-bold" style={{fontSize:'10px'}}>Exam ID:</span>
                    <span className="fw-bold text-truncate ms-2">{result.examId}</span>
                </div>
            </div>
            
            <hr className="my-4" />
            
            <div className="row g-0">
              <div className="col-6 border-end">
                <div className="h3 fw-bold mb-0">{score}</div>
                <small className="text-muted uppercase fw-bold" style={{ fontSize: '9px' }}>Obtained / {totalMarks}</small>
              </div>
              <div className="col-6">
                <div className={`h3 fw-bold mb-0 ${Number(percentage) >= 40 ? 'text-success' : 'text-danger'}`}>
                  {percentage}%
                </div>
                <small className="text-muted uppercase fw-bold" style={{ fontSize: '9px' }}>Percentage</small>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Detailed Breakdown */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-0 mb-4 bg-white">
            <div className="card-header bg-white border-bottom py-3">
              <h6 className="fw-bold mb-0 text-uppercase text-muted">
                <i className="bi bi-list-check me-2 text-primary"></i>Question Wise Analysis
              </h6>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light text-uppercase" style={{fontSize:'10px'}}>
                    <tr>
                      <th className="ps-4">#</th>
                      <th width="50%">Question & Type</th>
                      <th className="text-center">Student Resp.</th>
                      <th className="text-center">Key</th>
                      <th className="text-center pe-4">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fullQuestions.map((q, idx) => {
                      const studentAns = result.answers?.[q.id] || "N/A";
                      const isProgramming = q.type === 'programming';
                      const isCorrect = !isProgramming && studentAns === q.correctAnswer;
                      const isSkipped = studentAns === "N/A" || studentAns === "";

                      return (
                        <tr key={q.id} style={{ fontSize: '13px' }}>
                          <td className="ps-4 fw-bold text-muted">{idx + 1}</td>
                          <td className="py-3">
                            <div className="fw-bold text-dark mb-1">{q.question}</div>
                            <span className={`badge rounded-0 p-1 px-2 ${isProgramming ? 'bg-warning text-dark' : 'bg-info text-white'}`} style={{fontSize:'9px'}}>
                                {isProgramming ? 'PROGRAMMING' : 'MCQ'} | {q.marks}M
                            </span>
                          </td>
                          
                          <td className="text-center">
                            {isProgramming ? (
                                <button className="btn btn-xs btn-dark rounded-0 py-0 px-2 fw-bold" style={{fontSize:'10px'}} onClick={() => alert(`STUDENT CODE:\n\n${studentAns}`)}>
                                    VIEW CODE
                                </button>
                            ) : (
                                <span className={`fw-bold ${isCorrect ? 'text-success' : isSkipped ? 'text-muted' : 'text-danger'}`}>
                                    {studentAns}
                                </span>
                            )}
                          </td>

                          <td className="text-center fw-bold text-primary">
                            {isProgramming ? 'N/A' : q.correctAnswer}
                          </td>

                          <td className="text-center pe-4">
                            {isProgramming ? (
                                <i className="bi bi-info-circle-fill text-warning" title="Manual Check Required"></i>
                            ) : isSkipped ? (
                              <i className="bi bi-dash-circle text-muted"></i>
                            ) : isCorrect ? (
                              <i className="bi bi-check-circle-fill text-success"></i>
                            ) : (
                              <i className="bi bi-x-circle-fill text-danger"></i>
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
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .card { border: 1px solid #ddd !important; shadow: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}