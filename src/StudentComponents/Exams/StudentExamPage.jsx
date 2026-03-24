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

  const handleFinalSubmit = useCallback(async (isAuto = false) => {
    if (!isAuto && !window.confirm("Are you sure you want to submit?")) return;
    try {
      const res = await submitExam(admissionId, examId, ans, questions);
      if (res.success) navigate(`/student/exams/finish/${admissionId}_${examId}`, { replace: true });
    } catch (err) { console.error("Submission error:", err); }
  }, [admissionId, examId, ans, questions, navigate, submitExam]);

  // 1. Initial Load: Email ko AdmissionId banana
  useEffect(() => {
    const fetchInitialInfo = async () => {
      if (!user?.email || !examId) return;
      try {
        const userEmail = user.email.toLowerCase().trim();
        setAdmissionId(userEmail); 

        const eDoc = await getDoc(doc(db, "exams", examId));
        if (eDoc.exists()) {
          setExam(eDoc.data());
          setTimeLeft(eDoc.data().duration * 3600);
        }

        const qSnap = await getDocs(query(collection(db, "examQuestions"), where("examId", "==", examId)));
        setQuestions(qSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchInitialInfo();
  }, [examId, user]);

  // 2. Real-time Status Listener (Sirf ek baar, AdmissionId set hone ke baad)
  useEffect(() => {
    if (!admissionId || !examId) return;
    
    // Yahan doc path email-based hai: studentExams/hridesh@gmail.com_VwXi...
    const unsubStatus = onSnapshot(doc(db, "studentExams", `${admissionId}_${examId}`), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setDbStatus(data.status);
        if (data.status === "Ongoing") setExamStarted(true);
        if (data.status === "Completed") navigate(`/student/exams/finish/${admissionId}_${examId}`, { replace: true });
      } else {
        // Agar permit delete ho jaye toh bahar nikal do
        if (!loading) navigate("/student/exams", { replace: true });
      }
    });
    return () => unsubStatus();
  }, [admissionId, examId, loading, navigate]);

  // 3. Anti-Cheat & Timer
  useEffect(() => {
    if (!examStarted) return;
    const handleVisibilityChange = () => { if (document.hidden) handleFinalSubmit(true); };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else {
      handleFinalSubmit(true);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(timer);
    };
  }, [examStarted, timeLeft, handleFinalSubmit]);

  const startNow = async () => {
    try {
      await updateDoc(doc(db, "studentExams", `${admissionId}_${examId}`), {
        status: "Ongoing",
        startedAt: new Date()
      });
    } catch (err) { alert("Access Locked! Check your internet or permit."); }
  };

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center">SYNCING...</div>;

  if (examStarted) {
    const q = questions[index];
    const isAnswered = !!ans[q?.id];

    return (
      <div className="bg-light min-vh-100">
        <div className="bg-white border-bottom p-2 p-md-3 sticky-top d-flex justify-content-between align-items-center shadow-sm">
          <span className="fw-bold small">Q. {index + 1}/{questions.length}</span>
          <div className={`fw-bold px-2 py-1 small rounded ${timeLeft < 300 ? 'bg-danger text-white' : 'bg-dark text-white'}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>

        <div className="container py-3" style={{ maxWidth: '800px' }}>
          <div className="bg-white border p-3 p-md-4 shadow-sm mb-3">
            <h6 className="fw-bold mb-4">{q?.question}</h6>
            <div className="row g-2">
              {['A', 'B', 'C', 'D'].map(opt => (
                <div key={opt} className="col-12">
                  <button
                    className={`btn w-100 text-start p-3 rounded-0 border ${ans[q?.id] === opt ? 'btn-primary' : 'btn-light'}`}
                    onClick={() => setAns({ ...ans, [q.id]: opt })}
                  >
                    <span className="me-2 fw-bold">{opt}.</span> {q?.[`option${opt}`]}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-between gap-2">
            <button className="btn btn-outline-dark flex-fill rounded-0" disabled={index === 0} onClick={() => setIndex(index - 1)}>BACK</button>
            {index === questions.length - 1 ? (
              <button className="btn btn-success flex-fill rounded-0" disabled={!isAnswered} onClick={() => handleFinalSubmit()}>FINISH</button>
            ) : (
              <button className={`btn flex-fill rounded-0 ${isAnswered ? 'btn-primary' : 'btn-secondary'}`} disabled={!isAnswered} onClick={() => setIndex(index + 1)}>NEXT</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light vh-100 d-flex align-items-center justify-content-center p-2">
      <div className="col-md-6 col-12 bg-white border shadow-sm p-4 text-center">
        <i className="bi bi-shield-check text-primary display-5 mb-2"></i>
        <h5 className="fw-bold text-dark text-uppercase">{exam?.title}</h5>
        <div className="bg-light p-3 text-start my-4 border-start border-primary border-4">
          <h6 className="fw-bold small text-uppercase mb-2">Instructions:</h6>
          <ul className="small mb-0 ps-3 text-muted">
            <li>Choose an option to unlock NEXT.</li>
            <li>Do NOT switch tabs (Auto-Submit active).</li>
            <li>Timer based submission.</li>
          </ul>
        </div>
        <button
          className={`btn w-100 py-3 rounded-0 fw-bold ${dbStatus === "Pending" ? 'btn-success' : 'btn-secondary disabled'}`}
          onClick={startNow}
          disabled={questions.length === 0 || dbStatus !== "Pending"}
        >
          {dbStatus === "Pending" ? "START EXAM NOW" : "EXAM ALREADY STARTED/FINISHED"}
        </button>
      </div>
    </div>
  );
}