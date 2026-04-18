import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { toast } from "react-toastify";

export default function PracticeAttemptPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [testInfo, setTestInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- ⏱️ Timer States ---
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  // --- 🔥 Function to Handle Submit ---
  const autoSubmitTest = useCallback(async (reason = "Manual") => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current); // Stop timer on submit

    try {
      let score = 0;
      const details = questions.map(q => {
        const isCorrect = answers[q.id] === q.correct;
        if (isCorrect) score++;
        return { 
          question: q.question, 
          options: q.options, 
          correctOption: q.correct, 
          selectedOption: answers[q.id] ?? null, 
          isCorrect 
        };
      });

      const email = auth.currentUser.email.toLowerCase();
      await setDoc(doc(db, "practiceResults", `${email}_${testId}`), {
        score, 
        totalQuestions: questions.length, 
        status: "Completed",
        percentage: questions.length > 0 ? ((score / questions.length) * 100).toFixed(2) : 0,
        submittedAt: serverTimestamp(), 
        fullDetails: details,
        submitReason: reason 
      }, { merge: true });

      if (reason === "Cheating") {
        toast.error("Tab Switching Detected! Test Submitted.");
      } else if (reason === "Timeout") {
        toast.warning("Time is up! Test submitted automatically.");
      } else {
        toast.success("Submitted successfully!");
      }
      navigate("/student/practice-tests/results", { replace: true });
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  }, [answers, questions, testId, navigate, isSubmitting]);

  // --- ⏲️ Timer Logic ---
  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      autoSubmitTest("Timeout");
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft, autoSubmitTest]);

  // Helper to format seconds to MM:SS
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0 
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let unsubAssign = null;
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) return navigate("/login");
      try {
        const email = user.email.toLowerCase().trim();
        const resultRef = doc(db, "practiceResults", `${email}_${testId}`);
        const assignRef = doc(db, "practiceAssigned", `${email}_${testId}`);

        const rSnap = await getDoc(resultRef);
        if (rSnap.exists() && rSnap.data().status === "Completed") {
          toast.warning("You have already completed this test!");
          return navigate("/student/practice-tests/results", { replace: true });
        }

        unsubAssign = onSnapshot(assignRef, (snap) => {
          if (!snap.exists() && !isSubmitting) {
            toast.error("Access Revoked!");
            navigate("/student/practice-tests", { replace: true });
          }
        });

        const [tDoc, sSnap] = await Promise.all([
          getDoc(doc(db, "practiceTests", testId)),
          getDoc(doc(db, "admissions", email))
        ]);

        if (!tDoc.exists()) throw new Error("Test not found");
        const data = tDoc.data();
        setTestInfo(data);
        
        // Initialize Timer (Assuming duration is in minutes)
        if (data.duration) {
            setTimeLeft(data.duration * 60);
        }

        const realName = sSnap.exists() ? sSnap.data().name : (user.displayName || email.split('@')[0]);

        await setDoc(resultRef, {
          testId, testTitle: data?.title || "Practice",
          studentEmail: email, studentName: realName,
          status: "Ongoing", startedAt: serverTimestamp(),
        }, { merge: true });

        const qSnap = await getDocs(query(collection(db, "practiceQuestions"), where("testId", "==", testId)));
        setQuestions(qSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) { 
        console.error(err); 
      } finally { setLoading(false); }
    });

    return () => { 
      unsubAuth(); 
      if (unsubAssign) unsubAssign(); 
    };
  }, [testId, navigate]);

  // --- 🕵️‍♂️ Tab Switch Detection ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !isSubmitting && questions.length > 0) {
        autoSubmitTest("Cheating");
      }
    };
    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () => window.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [autoSubmitTest, isSubmitting, questions]);

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-primary" /></div>;

  const currentQ = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  return (
    <div className="container py-3 bg-light min-vh-100">
      <div className="card border-0 shadow-sm rounded-4 mb-3 overflow-hidden">
        <div className="card-body d-flex justify-content-between align-items-center p-3">
          <div>
            <h6 className="fw-bold mb-0 text-truncate">{testInfo?.title}</h6>
            {/* --- ⏱️ LIVE COUNTER UI --- */}
            {timeLeft !== null && (
                <span className={`badge ${timeLeft < 60 ? 'bg-danger' : 'bg-dark'} mt-1`}>
                   ⏱️ {formatTime(timeLeft)}
                </span>
            )}
          </div>
          <button className="btn btn-sm btn-outline-danger border-0 fw-bold" onClick={() => navigate(-1)}>Exit</button>
        </div>
        <div className="progress rounded-0" style={{ height: '4px' }}>
          <div className="progress-bar bg-primary transition-all" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-6">
          {questions.length > 0 ? (
            <>
              <div className="card mb-3 p-4 shadow-sm border-0 rounded-5">
                <div className="small text-muted mb-2 fw-bold text-uppercase">Question {currentIndex + 1} of {questions.length}</div>
                <h5 className="fw-bold mb-4">{currentQ.question}</h5>
                <div className="d-flex flex-column gap-2">
                  {currentQ.options.map((opt, i) => (
                    <label key={i} className={`form-check p-3 border rounded-4 cursor-pointer transition-all ${answers[currentQ.id] === i ? 'bg-primary-subtle border-primary' : 'bg-white border-light-subtle'}`} style={{cursor:'pointer'}}>
                      <input className="form-check-input" type="radio" name={currentQ.id} checked={answers[currentQ.id] === i} onChange={() => setAnswers({ ...answers, [currentQ.id]: i })} hidden />
                      <div className="d-flex align-items-center">
                        <div className={`rounded-circle border me-3 d-flex align-items-center justify-content-center ${answers[currentQ.id] === i ? 'bg-primary border-primary text-white' : ''}`} style={{width: '24px', height: '24px', fontSize: '12px'}}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="fw-medium">{opt}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="d-flex gap-2 mb-5">
                <button className="btn btn-white border-0 shadow-sm rounded-4 flex-grow-1 py-3 fw-bold" onClick={() => setCurrentIndex(c => c - 1)} disabled={currentIndex === 0}>Previous</button>
                {currentIndex === questions.length - 1 ? (
                  <button className="btn btn-success border-0 shadow rounded-4 flex-grow-1 py-3 fw-bold" disabled={isSubmitting} onClick={() => { if(window.confirm("Submit final paper?")) autoSubmitTest("Manual") }}>
                    {isSubmitting ? "Submitting..." : "Finish Test"}
                  </button>
                ) : (
                  <button className="btn btn-primary border-0 shadow rounded-4 flex-grow-1 py-3 fw-bold" onClick={() => setCurrentIndex(c => c + 1)}>Next</button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center p-5">No questions found.</div>
          )}
        </div>
      </div>
    </div>
  );
}