// src/StudentComponents/Exams/StudentExamPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/firebase";
import { doc, getDoc, collection, query, where, getDocs, updateDoc, onSnapshot } from "firebase/firestore";
import { useExam } from "../../AdminComponents/Students/Exams/context/ExamProvider";

export default function StudentExamPage() {
  const { examId } = useParams();
  const { submitExam } = useExam();
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [ans, setAns] = useState({});
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [examStarted, setExamStarted] = useState(false);
  const [dbStatus, setDbStatus] = useState("");
  const [admissionId, setAdmissionId] = useState(null);

  // Memoized Submit function to use in listeners
  const handleFinalSubmit = useCallback(async (isAuto = false) => {
    if (!isAuto && !window.confirm("Are you sure you want to submit the exam?")) return;
    try {
      // admissionId and examId are available from outer scope
      const res = await submitExam(admissionId, examId, ans, questions);
      if (res.success) navigate(`/student/exams/finish/${admissionId}_${examId}`, { replace: true });
    } catch (err) { console.error("Submission error:", err); }
  }, [admissionId, examId, ans, questions, navigate, submitExam]);
// 1. Initial Load Fix
useEffect(() => {
  const fetchInitialInfo = async () => {
    if (!user?.email || !examId) return;
    try {
      const userEmail = user.email.toLowerCase().trim();
      setAdmissionId(userEmail); // Email is our ID now

      // Get Exam Data
      const eDoc = await getDoc(doc(db, "exams", examId));
      if (eDoc.exists()) {
        setExam(eDoc.data());
        setTimeLeft(eDoc.data().duration * 3600);
      }

      // Get Questions
      const qSnap = await getDocs(query(collection(db, "examQuestions"), where("examId", "==", examId)));
      setQuestions(qSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  fetchInitialInfo();
}, [examId, user]);

// 3. Real-time Status Listener Fix
useEffect(() => {
  if (!user?.email || !examId) return;
  const userEmail = user.email.toLowerCase().trim();
  
  const unsubStatus = onSnapshot(doc(db, "studentExams", `${userEmail}_${examId}`), (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      setDbStatus(data.status);
      if (data.status === "Ongoing") setExamStarted(true);
      if (data.status === "Completed") navigate(`/student/exams/finish/${userEmail}_${examId}`);
    }
  });
  return () => unsubStatus();
}, [examId, user, navigate]);

  // 2. Tab Switch Detection (Anti-Cheat)
  useEffect(() => {
    if (!examStarted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // alert("CRITICAL: Tab switching is not allowed. Your exam is being auto-submitted.");
        handleFinalSubmit(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [examStarted, handleFinalSubmit]);

  // 3. Real-time Status Listener
  useEffect(() => {
    if (!admissionId || !examId) return;
    const unsubStatus = onSnapshot(doc(db, "studentExams", `${admissionId}_${examId}`), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setDbStatus(data.status);
        if (data.status === "Ongoing") setExamStarted(true);
      } else {
        if (!loading) navigate("/student/exams", { replace: true });
      }
    });
    return () => unsubStatus();
  }, [admissionId, examId, loading, navigate]);

  // 4. Timer
  useEffect(() => {
    if (examStarted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (examStarted && timeLeft === 0) {
      handleFinalSubmit(true);
    }
  }, [examStarted, timeLeft, handleFinalSubmit]);

  const startNow = async () => {
    try {
      await updateDoc(doc(db, "studentExams", `${admissionId}_${examId}`), {
        status: "Ongoing",
        startedAt: new Date()
      });
    } catch (err) { alert("Access Locked!"); }
  };

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center bg-white">SYNCING...</div>;

  if (examStarted) {
    const q = questions[index];
    const isAnswered = !!ans[q?.id]; // Current question answered hai ya nahi

    return (
      <div className="bg-light ">
        <div className="bg-white border-bottom p-2 p-md-3 sticky-top d-flex justify-content-between align-items-center shadow-sm">
          <span className="fw-bold small">Q. {index + 1}/{questions.length}</span>
          <div className={`fw-bold px-2 py-1 small rounded ${timeLeft < 300 ? 'bg-danger text-white' : 'bg-dark text-white'}`}>
            <i className="bi bi-clock me-1"></i>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>

        <div className="container-fluid py-3" style={{ maxWidth: '800px' }}>
          <div className="bg-white border p-3 p-md-4 shadow-sm mb-3">
            <h6 className="fw-bold mb-4" style={{ lineHeight: '1.5' }}>{q?.question}</h6>
            <div className="row g-2">
              {['A', 'B', 'C', 'D'].map(opt => (
                <div key={opt} className="col-12">
                  <button
                    className={`btn w-100 text-start p-3 rounded-0 border transition-all ${ans[q?.id] === opt ? 'btn-primary border-primary' : 'btn-light border-light text-dark'}`}
                    onClick={() => setAns({ ...ans, [q.id]: opt })}
                  >
                    <span className="me-2 fw-bold">{opt}.</span> {q?.[`option${opt}`]}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-between gap-2">
            <button className="btn btn-outline-dark flex-fill py-2 fw-bold rounded-0" disabled={index === 0} onClick={() => setIndex(index - 1)}>BACK</button>

            {index === questions.length - 1 ? (
              <button
                className="btn btn-success flex-fill py-2 fw-bold rounded-0"
                disabled={!isAnswered}
                onClick={() => handleFinalSubmit()}
              >
                FINISH
              </button>
            ) : (
              <button
                className={`btn flex-fill py-2 fw-bold rounded-0 ${isAnswered ? 'btn-primary' : 'btn-secondary opacity-50'}`}
                disabled={!isAnswered}
                onClick={() => setIndex(index + 1)}
              >
                NEXT <i className="bi bi-arrow-right ms-1"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light d-flex align-items-center justify-content-center p-2">
      <div className="col-md-6 col-12 bg-white border shadow-sm p-4 text-center">
        <i className="bi bi-shield-check text-primary display-5 mb-2"></i>
        <h5 className="fw-bold text-dark text-uppercase">{exam?.title}</h5>

        <div className="bg-light p-3 text-start my-4 border-start border-primary border-4">
          <h6 className="fw-bold small text-uppercase mb-2">Instructions:</h6>
          <ul className="small mb-0 ps-3 text-muted">
            <li>Choose an option to unlock the <b>NEXT</b> button.</li>
            <li>Do NOT switch tabs or minimize window (Auto-Submit active).</li>
            <li>Exam will end automatically when timer hits 00:00.</li>
          </ul>
        </div>

        <button
          className={`btn w-100 py-3 rounded-0 fw-bold ${dbStatus === "Pending" ? 'btn-success' : 'btn-secondary disabled'}`}
          onClick={startNow}
          disabled={questions.length === 0 || dbStatus !== "Pending"}
        >
          {dbStatus === "Pending" ? "START EXAM NOW" : "WAITING FOR ADMIN"}
        </button>
      </div>
    </div>
  );
}