// import React, { useState, useEffect, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { db, auth } from "../../firebase/firebase";
// import { 
//   doc, getDoc, collection, query, where, 
//   getDocs, updateDoc, onSnapshot, serverTimestamp 
// } from "firebase/firestore";
// import { useExam } from "../../AdminComponents/Students/Exams/context/ExamProvider";

// // Code Editor Imports
// import Editor from 'react-simple-code-editor';
// import { highlight, languages } from 'prismjs/components/prism-core';
// import 'prismjs/components/prism-clike';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/components/prism-c';
// import 'prismjs/components/prism-cpp';
// import 'prismjs/themes/prism-tomorrow.css';

// export default function StudentExamPage() {
//   const { examId } = useParams();
//   const { submitExam } = useExam();
//   const navigate = useNavigate();

//   const [exam, setExam] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [ans, setAns] = useState({}); // For MCQ answers
//   const [codeAns, setCodeAns] = useState({}); // For programming answers
//   const [index, setIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [examStarted, setExamStarted] = useState(false);
//   const [dbStatus, setDbStatus] = useState("");
//   const [admissionId, setAdmissionId] = useState(null);

//   // 1. Fetch Initial Data
//   useEffect(() => {
//     const fetchInitialInfo = async () => {
//       const currentUser = auth.currentUser;
//       if (!currentUser?.email || !examId) return;

//       try {
//         const userEmail = currentUser.email.toLowerCase().trim();
//         setAdmissionId(userEmail);

//         const eDoc = await getDoc(doc(db, "exams", examId));
//         if (eDoc.exists()) {
//           const examData = eDoc.data();
//           setExam(examData);
//           setTimeLeft(examData.duration * 3600);
//         }

//         const qSnap = await getDocs(query(collection(db, "examQuestions"), where("examId", "==", examId)));
//         const fetchedQuestions = qSnap.docs.map(d => ({ id: d.id, ...d.data() }));
//         setQuestions(fetchedQuestions);
        
//         // Initialize code answers with starter code if available
//         const initialCodeAnswers = {};
//         fetchedQuestions.forEach(q => {
//           if (q.type === 'programming' && q.sampleCode) {
//             initialCodeAnswers[q.id] = q.sampleCode;
//           } else if (q.type === 'programming') {
//             initialCodeAnswers[q.id] = '';
//           }
//         });
//         setCodeAns(initialCodeAnswers);
        
//       } catch (err) {
//         console.error("Fetch Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInitialInfo();
//   }, [examId]);

//   // 2. Real-time Status Monitor
//   useEffect(() => {
//     if (!admissionId || !examId) return;
//     const permitPath = `${admissionId}_${examId}`;

//     const unsubStatus = onSnapshot(doc(db, "studentExams", permitPath), (snap) => {
//       if (snap.exists()) {
//         const data = snap.data();
//         setDbStatus(data.status);
//         if (data.status === "Ongoing") setExamStarted(true);
//         if (data.status === "Completed") {
//           navigate(`/student/exams/finish/${permitPath}`, { replace: true });
//         }
//       } else if (!loading) {
//         navigate("/student/exams", { replace: true });
//       }
//     });

//     return () => unsubStatus();
//   }, [admissionId, examId, loading, navigate]);

//   // 3. Check if current question is answered
//   const isCurrentQuestionAnswered = useCallback(() => {
//     const currentQ = questions[index];
//     if (!currentQ) return false;
    
//     if (currentQ.type === 'mcq') {
//       return !!ans[currentQ.id];
//     } else {
//       // For programming: check if code is not empty and not just whitespace
//       const code = codeAns[currentQ.id];
//       return code && code.trim().length > 0;
//     }
//   }, [questions, index, ans, codeAns]);

//   // 4. Submission Logic
//   const handleFinalSubmit = useCallback(async (isAuto = false) => {
//     if (!isAuto && !window.confirm("Confirm Submit?")) return;
    
//     try {
//       // Combine MCQ answers and code answers
//       const allAnswers = {
//         ...ans,
//         ...Object.keys(codeAns).reduce((acc, qId) => {
//           acc[qId] = { code: codeAns[qId], language: questions.find(q => q.id === qId)?.language };
//           return acc;
//         }, {})
//       };
      
//       const res = await submitExam(admissionId, examId, allAnswers, questions);
//       if (res.success) {
//         navigate(`/student/exams/finish/${admissionId}_${examId}`, { replace: true });
//       }
//     } catch (err) {
//       console.error("Submission error:", err);
//     }
//   }, [admissionId, examId, ans, codeAns, questions, navigate, submitExam]);

//   // 5. Timer & Anti-Cheat
//   useEffect(() => {
//     if (!examStarted) return;

//     const handleVisibilityChange = () => { 
//       if (document.hidden) {
//         handleFinalSubmit(true); 
//       }
//     };
//     document.addEventListener("visibilitychange", handleVisibilityChange);
    
//     let timer;
//     if (timeLeft > 0) {
//       timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
//     } else {
//       handleFinalSubmit(true);
//     }

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//       if (timer) clearInterval(timer);
//     };
//   }, [examStarted, timeLeft, handleFinalSubmit]);

//   const startNow = async () => {
//     try {
//       await updateDoc(doc(db, "studentExams", `${admissionId}_${examId}`), {
//         status: "Ongoing",
//         startedAt: serverTimestamp()
//       });
//     } catch (err) {
//       alert("Error starting exam.");
//     }
//   };

//   // Syntax highlighting helper
//   const getHighlightFn = (lang) => {
//     if (lang === 'javascript') return (code) => highlight(code, languages.js);
//     if (lang === 'c') return (code) => highlight(code, languages.c);
//     if (lang === 'cpp') return (code) => highlight(code, languages.cpp);
//     return (code) => code;
//   };

//   if (loading) return (
//     <div className="vh-100 d-flex justify-content-center align-items-center">
//       <div className="spinner-border text-primary" />
//     </div>
//   );

//   if (examStarted) {
//     const currentQ = questions[index];
//     const isAnswered = isCurrentQuestionAnswered();

//     return (
//       <div className="bg-light min-vh-100">
//         <div className="bg-white border-bottom p-3 sticky-top d-flex justify-content-between align-items-center shadow-sm">
//           <span className="fw-bold small text-uppercase">
//             Q. {index + 1} / {questions.length}
//             {currentQ?.type === 'programming' && (
//               <span className="ms-2 badge bg-warning text-dark rounded-0">
//                 <i className="bi bi-code-slash me-1"></i>PROGRAMMING
//               </span>
//             )}
//           </span>
//           <div className={`fw-bold px-3 py-1 rounded-pill ${timeLeft < 300 ? 'bg-danger text-white' : 'bg-dark text-white'}`}>
//             <i className="bi bi-clock me-2"></i>
//             {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
//           </div>
//         </div>

//         <div className="container py-4" style={{ maxWidth: '900px' }}>
//           <div className="card border-0 shadow-sm rounded-0 mb-3">
//             <div className="card-body p-4">
//               <h5 className="fw-bold mb-4">{currentQ?.question}</h5>
              
//               {/* MCQ Question Type */}
//               {currentQ?.type === 'mcq' && (
//                 <div className="row g-3">
//                   {['A', 'B', 'C', 'D'].map(opt => (
//                     <div key={opt} className="col-12">
//                       <button
//                         className={`btn w-100 text-start p-3 rounded-0 border-2 transition-all ${
//                           ans[currentQ.id] === opt ? 'btn-primary border-primary' : 'btn-outline-light text-dark'
//                         }`}
//                         onClick={() => setAns({ ...ans, [currentQ.id]: opt })}
//                       >
//                         <span className="me-3 fw-bold">{opt}.</span> {currentQ?.[`option${opt}`]}
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Programming Question Type */}
//               {currentQ?.type === 'programming' && (
//                 <div>
//                   <div className="mb-3 bg-light p-3 border-start border-warning border-4">
//                     <div className="d-flex justify-content-between align-items-center mb-2">
//                       <span className="badge bg-dark rounded-0">
//                         <i className="bi bi-code-slash me-1"></i>
//                         {currentQ.language?.toUpperCase()} ENVIRONMENT
//                       </span>
//                       <small className="text-muted">
//                         Marks: {currentQ.marks}
//                       </small>
//                     </div>
//                     <p className="small text-muted mb-0">
//                       <i className="bi bi-info-circle me-1"></i>
//                       Write your solution below. Your code will be evaluated for correctness.
//                     </p>
//                   </div>

//                   <div className="mb-3">
//                     <label className="fw-bold small text-muted text-uppercase mb-2">
//                       Your Solution:
//                     </label>
//                     <div className="border rounded-0 overflow-hidden" style={{ borderColor: '#dee2e6' }}>
//                       <Editor
//                         value={codeAns[currentQ.id] || ''}
//                         onValueChange={(code) => setCodeAns({ ...codeAns, [currentQ.id]: code })}
//                         highlight={getHighlightFn(currentQ.language || 'javascript')}
//                         padding={15}
//                         style={{
//                           fontFamily: '"Fira Code", "Fira Mono", monospace',
//                           fontSize: 14,
//                           minHeight: '300px',
//                           background: '#f8f9fa'
//                         }}
//                       />
//                     </div>
//                     <small className="text-muted mt-2 d-block">
//                       <i className="bi bi-keyboard me-1"></i>
//                       Write your code solution here. Make sure to follow the problem requirements.
//                     </small>
//                   </div>

//                   {/* Option to test/run code - optional */}
//                   {false && (
//                     <button className="btn btn-outline-secondary btn-sm rounded-0 mb-3">
//                       <i className="bi bi-play-fill me-1"></i> Test Code
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="d-flex justify-content-between gap-3">
//             <button 
//               className="btn btn-outline-dark px-4 py-2 rounded-0 fw-bold border-2" 
//               disabled={index === 0} 
//               onClick={() => setIndex(index - 1)}
//             >
//               <i className="bi bi-arrow-left me-2"></i> PREV
//             </button>
//             {index === questions.length - 1 ? (
//               <button 
//                 className="btn btn-success px-5 py-2 rounded-0 fw-bold" 
//                 disabled={!isAnswered} 
//                 onClick={() => handleFinalSubmit()}
//               >
//                 FINISH EXAM <i className="bi bi-check-lg ms-2"></i>
//               </button>
//             ) : (
//               <button 
//                 className="btn btn-primary px-5 py-2 rounded-0 fw-bold" 
//                 disabled={!isAnswered} 
//                 onClick={() => setIndex(index + 1)}
//               >
//                 NEXT <i className="bi bi-arrow-right ms-2"></i>
//               </button>
//             )}
//           </div>
          
//           {/* Question Navigation Overview */}
//           <div className="mt-4 pt-3 border-top">
//             <div className="d-flex flex-wrap gap-2 justify-content-center">
//               {questions.map((q, idx) => {
//                 const isAnswered = q.type === 'mcq' 
//                   ? !!ans[q.id] 
//                   : (codeAns[q.id] && codeAns[q.id].trim().length > 0);
//                 return (
//                   <button
//                     key={idx}
//                     className={`btn btn-sm rounded-0 px-3 ${
//                       idx === index 
//                         ? 'btn-primary' 
//                         : isAnswered 
//                           ? 'btn-success' 
//                           : 'btn-outline-secondary'
//                     }`}
//                     onClick={() => setIndex(idx)}
//                   >
//                     {idx + 1}
//                     {q.type === 'programming' && (
//                       <i className="bi bi-code-slash ms-1 small"></i>
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
//             <p className="text-center small text-muted mt-2">
//               <span className="text-success">■</span> Answered | 
//               <span className="text-primary ms-2">■</span> Current | 
//               <span className="text-secondary ms-2">■</span> Unanswered
//               {questions.some(q => q.type === 'programming') && (
//                 <span className="ms-2">
//                   <i className="bi bi-code-slash ms-1"></i> = Programming Question
//                 </span>
//               )}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid bg-light vh-100 d-flex align-items-center justify-content-center p-3">
//       <div className="col-md-5 col-12 bg-white border-top border-primary border-4 shadow-sm p-4 text-center rounded-0">
//         <i className="bi bi-shield-lock-fill text-primary display-4 mb-3"></i>
//         <h4 className="fw-bold text-dark text-uppercase mb-1">{exam?.title}</h4>
//         <p className="text-muted small">Course: {exam?.course}</p>
        
//         <div className="bg-light p-3 text-start my-4 border-start border-primary border-4">
//           <h6 className="fw-bold small text-uppercase mb-2 text-primary">Rules:</h6>
//           <ul className="small mb-0 ps-3 text-muted">
//             <li>Answer current question to unlock <strong>NEXT</strong>.</li>
//             <li>Programming questions require code solution.</li>
//             <li>Tab switching will result in <strong>auto-submission</strong>.</li>
//             <li>Timer will auto-submit when it hits zero.</li>
//           </ul>
//         </div>

//         <div className="bg-warning bg-opacity-10 p-3 mb-3 text-start border-start border-warning border-4">
//           <small className="text-warning fw-bold">
//             <i className="bi bi-info-circle-fill me-1"></i> EXAM INCLUDES:
//           </small>
//           <div className="small mt-1">
//             {questions.some(q => q.type === 'mcq') && (
//               <span className="badge bg-primary rounded-0 me-2">MCQ</span>
//             )}
//             {questions.some(q => q.type === 'programming') && (
//               <span className="badge bg-warning text-dark rounded-0">PROGRAMMING</span>
//             )}
//           </div>
//         </div>

//         <button
//           className={`btn w-100 py-3 rounded-0 fw-bold ${dbStatus === "Pending" ? 'btn-primary' : 'btn-secondary disabled'}`}
//           onClick={startNow}
//           disabled={questions.length === 0 || dbStatus !== "Pending"}
//         >
//           {dbStatus === "Pending" ? "START EXAMINATION" : "EXAM RESTRICTED"}
//         </button>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/firebase";
import { 
  doc, getDoc, collection, query, where, 
  getDocs, updateDoc, onSnapshot, serverTimestamp 
} from "firebase/firestore";
import { useExam } from "../../AdminComponents/Students/Exams/context/ExamProvider";

// Code Editor Imports
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme for editor

export default function StudentExamPage() {
  const { examId } = useParams();
  const { submitExam } = useExam();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [ans, setAns] = useState({});
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [examStarted, setExamStarted] = useState(false);
  const [dbStatus, setDbStatus] = useState("");
  const [admissionId, setAdmissionId] = useState(null);

  // 1. Fetch Initial Data
  useEffect(() => {
    const fetchInitialInfo = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser?.email || !examId) return;

      try {
        const userEmail = currentUser.email.toLowerCase().trim();
        setAdmissionId(userEmail);

        const eDoc = await getDoc(doc(db, "exams", examId));
        if (eDoc.exists()) {
          const examData = eDoc.data();
          setExam(examData);
          setTimeLeft(examData.duration * 3600);
        }

        const qSnap = await getDocs(query(collection(db, "examQuestions"), where("examId", "==", examId)));
        const fetchedQs = qSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setQuestions(fetchedQs);

        // Programming questions ke liye starter code initialize karna
        const initialAnswers = {};
        fetchedQs.forEach(q => {
          if (q.type === 'programming' && q.sampleCode) {
            initialAnswers[q.id] = q.sampleCode;
          }
        });
        setAns(initialAnswers);

      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialInfo();
  }, [examId]);

  // 2. Real-time Status Monitor
  useEffect(() => {
    if (!admissionId || !examId) return;
    const permitPath = `${admissionId}_${examId}`;

    const unsubStatus = onSnapshot(doc(db, "studentExams", permitPath), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setDbStatus(data.status);
        if (data.status === "Ongoing") setExamStarted(true);
        if (data.status === "Completed") {
          navigate(`/student/exams/finish/${permitPath}`, { replace: true });
        }
      } else if (!loading) {
        navigate("/student/exams", { replace: true });
      }
    });

    return () => unsubStatus();
  }, [admissionId, examId, loading, navigate]);

  // 3. Submission Logic
  const handleFinalSubmit = useCallback(async (isAuto = false) => {
    if (!isAuto && !window.confirm("Confirm Submit?")) return;
    
    try {
      const res = await submitExam(admissionId, examId, ans, questions);
      if (res.success) {
        navigate(`/student/exams/finish/${admissionId}_${examId}`, { replace: true });
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  }, [admissionId, examId, ans, questions, navigate, submitExam]);

  // 4. Timer & Anti-Cheat
  useEffect(() => {
    if (!examStarted) return;

    const handleVisibilityChange = () => { 
      if (document.hidden) {
        handleFinalSubmit(true); 
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else {
      handleFinalSubmit(true);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timer) clearInterval(timer);
    };
  }, [examStarted, timeLeft, handleFinalSubmit]);

  const startNow = async () => {
    try {
      await updateDoc(doc(db, "studentExams", `${admissionId}_${examId}`), {
        status: "Ongoing",
        startedAt: serverTimestamp()
      });
    } catch (err) {
      alert("Error starting exam.");
    }
  };

  // Helper for highlighting
  const getHighlightFn = (lang) => {
    if (lang === 'c') return (code) => highlight(code, languages.c);
    if (lang === 'cpp') return (code) => highlight(code, languages.cpp);
    return (code) => highlight(code, languages.js);
  };

  if (loading) return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="spinner-border text-primary" />
    </div>
  );

  if (examStarted) {
    const q = questions[index];
    // Check if answered: MCQ ke liye value, Programming ke liye check ki khali na ho
    const isAnswered = q?.type === 'mcq' ? !!ans[q?.id] : (ans[q?.id]?.trim().length > 0);

    return (
      <div className="bg-light min-vh-100">
        {/* Header */}
        <div className="bg-white border-bottom p-3 sticky-top d-flex justify-content-between align-items-center shadow-sm">
          <span className="fw-bold small text-uppercase">Q. {index + 1} / {questions.length}</span>
          <div className={`fw-bold px-3 py-1 rounded-pill ${timeLeft < 300 ? 'bg-danger text-white' : 'bg-dark text-white'}`}>
            <i className="bi bi-clock me-2"></i>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>

        <div className="container py-4" style={{ maxWidth: q?.type === 'programming' ? '950px' : '750px' }}>
          <div className="card border-0 shadow-sm rounded-0 mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                 <span className={`badge rounded-0 ${q?.type === 'programming' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                    {q?.type === 'programming' ? 'PRACTICAL' : 'MCQ'} | {q?.marks} Marks
                 </span>
              </div>
              <h5 className="fw-bold mb-4">{q?.question}</h5>

              {/* --- MCQ RENDERING --- */}
              {q?.type === 'mcq' ? (
                <div className="row g-3">
                  {['A', 'B', 'C', 'D'].map(opt => (
                    <div key={opt} className="col-12">
                      <button
                        className={`btn w-100 text-start p-3 rounded-0 border-2 transition-all ${
                          ans[q?.id] === opt ? 'btn-primary border-primary' : 'btn-outline-light text-dark'
                        }`}
                        onClick={() => setAns({ ...ans, [q.id]: opt })}
                      >
                        <span className="me-3 fw-bold">{opt}.</span> {q?.[`option${opt}`]}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                /* --- PROGRAMMING RENDERING --- */
                <div className="border rounded-0 overflow-hidden shadow-sm">
                  <div className="bg-dark text-white px-3 py-2 small d-flex justify-content-between align-items-center">
                    <span><i className="bi bi-code-square me-2 text-warning"></i> Language: <b>{q?.language?.toUpperCase()}</b></span>
                    <span className="badge bg-secondary">Editor Mode</span>
                  </div>
                  <Editor
                    value={ans[q?.id] || ""}
                    onValueChange={code => setAns({ ...ans, [q.id]: code })}
                    highlight={getHighlightFn(q?.language)}
                    padding={15}
                    className="font-monospace"
                    style={{
                      fontFamily: '"Fira code", "Fira Mono", monospace',
                      fontSize: 14,
                      minHeight: '350px',
                      backgroundColor: '#1d1f21', // Prism Tomorrow Background
                      color: '#c5c8c6',
                      outline: 'none'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between gap-3 mb-5">
            <button className="btn btn-outline-dark px-4 py-2 rounded-0 fw-bold border-2" disabled={index === 0} onClick={() => setIndex(index - 1)}>
              <i className="bi bi-chevron-left me-2"></i> PREV
            </button>
            {index === questions.length - 1 ? (
              <button className="btn btn-success px-5 py-2 rounded-0 fw-bold" onClick={() => handleFinalSubmit()}>
                FINISH EXAM <i className="bi bi-check-circle ms-2"></i>
              </button>
            ) : (
              <button className="btn btn-primary px-5 py-2 rounded-0 fw-bold" onClick={() => setIndex(index + 1)}>
                NEXT <i className="bi bi-chevron-right ms-2"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Welcome Screen (Rules)
  return (
    <div className="container-fluid bg-light vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="col-md-5 col-12 bg-white border-top border-primary border-4 shadow-sm p-4 text-center rounded-0">
        <i className="bi bi-shield-lock-fill text-primary display-4 mb-3"></i>
        <h4 className="fw-bold text-dark text-uppercase mb-1">{exam?.title}</h4>
        <p className="text-muted small font-monospace">Course: {exam?.course}</p>
        
        <div className="bg-light p-3 text-start my-4 border-start border-primary border-4">
          <h6 className="fw-bold small text-uppercase mb-2 text-primary">Examination Rules:</h6>
          <ul className="small mb-0 ps-3 text-muted">
            <li>For <strong>Practical Questions</strong>, use the editor provided.</li>
            <li>Tab switching or minimizing will result in <strong>auto-submission</strong>.</li>
            <li>Timer is fixed. Ensure you submit before it expires.</li>
            <li>Your code is saved as you type.</li>
          </ul>
        </div>

        <button
          className={`btn w-100 py-3 rounded-0 fw-bold ${dbStatus === "Pending" ? 'btn-primary' : 'btn-secondary disabled'}`}
          onClick={startNow}
          disabled={questions.length === 0 || dbStatus !== "Pending"}
        >
          {dbStatus === "Pending" ? "START EXAMINATION" : "EXAM RESTRICTED"}
        </button>
      </div>
    </div>
  );
}