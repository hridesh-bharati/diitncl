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
        const shuffled = qSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
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
    <div className="d-flex flex-column">
      {/* --- 📱 Compact Top Bar --- */}
      <div className="p-2 m-1 mb-0 bg-white">
        <div className="d-flex justify-content-between align-items-center small fw-bold mb-2">
          <span className="text-muted text-uppercase">{testInfo?.title}</span>
          {timeLeft !== null && (
            <span className={timeLeft < 60 ? 'text-danger' : 'text-dark'}>
              ⏱️ {formatTime(timeLeft)}
            </span>
          )}
        </div>
        <div className="progress" style={{ height: '4px' }}>
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* --- 📝 Question Area --- */}
      <div className="p-4 flex-grow-1 bg-white m-1">
        <div className="small text-primary fw-bold mb-1">QUESTION {currentIndex + 1}</div>
        <h5 className="fw-bold mb-4">{currentQ.question}</h5>

        <div className="d-flex flex-column gap-2">
          {currentQ.options.map((opt, i) => (
            <div
              key={i}
              onClick={() => setAnswers({ ...answers, [currentQ.id]: i })}
              className={`p-2 rounded-2 border transition-all cursor-pointer  d-flex align-items-center ${answers[currentQ.id] === i ? 'border-primary bg-primary-subtle' : 'border-light-subtle'
                }`}
            >
              <div className={`me-3 small d-flex align-items-center justify-content-center rounded-circle border ${answers[currentQ.id] === i ? 'bg-primary text-white' : 'text-muted'
                }`} style={{ width: '24px', height: '24px' }}>
                {String.fromCharCode(65 + i)}
              </div>
              <span className="fw-medium">{opt}</span>
            </div>
          ))}
        </div>
        {/* --- 🎮 Action Buttons --- */}
        <div className="p-2 m-2 d-flex gap-2 bg-light">
          <button
            className="btn btn-secondary border-0 flex-grow-1 py-2 fw-bold"
            onClick={() => setCurrentIndex(c => c - 1)}
            disabled={currentIndex === 0}
          >
            Back
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              className="btn btn-success flex-grow-1 py-2 fw-bold"
              onClick={() => { if (window.confirm("Submit?")) autoSubmitTest("Manual") }}
            >
              Finish
            </button>
          ) : (
            <button
              className="btn btn-primary flex-grow-1 py-2 fw-bold"
              onClick={() => setCurrentIndex(c => c + 1)}
            >
              Next
            </button>
          )}
        </div>
      </div>

    </div>
  );
}