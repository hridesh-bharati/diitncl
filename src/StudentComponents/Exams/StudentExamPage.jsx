import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/firebase";
import { 
  doc, getDoc, collection, query, where, 
  getDocs, updateDoc, onSnapshot, serverTimestamp 
} from "firebase/firestore";
import { useExam } from "../../AdminComponents/Students/Exams/context/ExamProvider";

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
        setQuestions(qSnap.docs.map(d => ({ id: d.id, ...d.data() })));
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

  if (loading) return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="spinner-border text-primary" />
    </div>
  );

  if (examStarted) {
    const q = questions[index];
    const isAnswered = !!ans[q?.id];

    return (
      <div className="bg-light min-vh-100">
        <div className="bg-white border-bottom p-3 sticky-top d-flex justify-content-between align-items-center shadow-sm">
          <span className="fw-bold small text-uppercase">Q. {index + 1} / {questions.length}</span>
          <div className={`fw-bold px-3 py-1 rounded-pill ${timeLeft < 300 ? 'bg-danger text-white' : 'bg-dark text-white'}`}>
            <i className="bi bi-clock me-2"></i>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>

        <div className="container py-4" style={{ maxWidth: '750px' }}>
          <div className="card border-0 shadow-sm rounded-0 mb-3">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">{q?.question}</h5>
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
            </div>
          </div>

          <div className="d-flex justify-content-between gap-3">
            <button className="btn btn-outline-dark px-4 py-2 rounded-0 fw-bold border-2" disabled={index === 0} onClick={() => setIndex(index - 1)}>
              PREV
            </button>
            {index === questions.length - 1 ? (
              <button className="btn btn-success px-5 py-2 rounded-0 fw-bold" disabled={!isAnswered} onClick={() => handleFinalSubmit()}>
                FINISH EXAM
              </button>
            ) : (
              <button className="btn btn-primary px-5 py-2 rounded-0 fw-bold" disabled={!isAnswered} onClick={() => setIndex(index + 1)}>
                NEXT <i className="bi bi-arrow-right ms-2"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="col-md-5 col-12 bg-white border-top border-primary border-4 shadow-sm p-4 text-center rounded-0">
        <i className="bi bi-shield-lock-fill text-primary display-4 mb-3"></i>
        <h4 className="fw-bold text-dark text-uppercase mb-1">{exam?.title}</h4>
        <p className="text-muted small">Course: {exam?.course}</p>
        
        <div className="bg-light p-3 text-start my-4 border-start border-primary border-4">
          <h6 className="fw-bold small text-uppercase mb-2 text-primary">Rules:</h6>
          <ul className="small mb-0 ps-3 text-muted">
            <li>Answer current question to unlock <strong>NEXT</strong>.</li>
            <li>Tab switching will result in <strong>auto-submission</strong>.</li>
            <li>Timer will auto-submit when it hits zero.</li>
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