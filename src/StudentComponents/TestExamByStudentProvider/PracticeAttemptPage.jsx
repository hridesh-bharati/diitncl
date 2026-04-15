import React, { useEffect, useState, useCallback } from "react";
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

  // --- 🔥 Function to Handle Submit (Common for Manual & Auto) ---
  const autoSubmitTest = useCallback(async (reason = "Manual") => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const currentQuestions = questions; // Local copy to avoid closure issues
      let score = 0;
      const details = currentQuestions.map(q => {
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
        totalQuestions: currentQuestions.length, 
        status: "Completed",
        percentage: currentQuestions.length > 0 ? ((score / currentQuestions.length) * 100).toFixed(2) : 0,
        submittedAt: serverTimestamp(), 
        fullDetails: details,
        submitReason: reason // To track if student cheated or submitted manually
      }, { merge: true });

      if (reason === "Cheating") {
        toast.error("Tab Switching Detected! Test Submitted Automatically.");
      } else {
        toast.success("Submitted successfully!");
      }
      navigate("/student/practice-tests/results", { replace: true });
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  }, [answers, questions, testId, navigate, isSubmitting]);

  useEffect(() => {
    let unsubAssign = null;
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) return navigate("/login");
      try {
        const email = user.email.toLowerCase().trim();
        const resultRef = doc(db, "practiceResults", `${email}_${testId}`);
        const assignRef = doc(db, "practiceAssigned", `${email}_${testId}`);

        // --- 🔒 1. LOCK CHECK (Prevent Re-attempt) ---
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
        setTestInfo(tDoc.data());

        const realName = sSnap.exists() ? sSnap.data().name : (user.displayName || email.split('@')[0]);

        await setDoc(resultRef, {
          testId, testTitle: tDoc.data()?.title || "Practice",
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

  // --- 🕵️‍♂️ 2. TAB SWITCH DETECTION (Cheating Protection) ---
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
          <h6 className="fw-bold mb-0 text-truncate me-2">{testInfo?.title}</h6>
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
                  <button className="btn btn-success border-0 shadow rounded-4 flex-grow-1 py-3 fw-bold" onClick={() => { if(window.confirm("Submit final paper?")) autoSubmitTest("Manual") }}>Finish Test</button>
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