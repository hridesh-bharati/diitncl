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
import 'prismjs/themes/prism-tomorrow.css';

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
        const fetchedQuestions = qSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setQuestions(fetchedQuestions);

        const initialAnswers = {};
        fetchedQuestions.forEach(q => {
          if (q.type === 'programming') {
            initialAnswers[q.id] = { code: q.sampleCode || '', language: q.language, type: 'programming' };
          }
        });
        setAns(initialAnswers);

      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchInitialInfo();
  }, [examId]);

  useEffect(() => {
    if (!admissionId || !examId) return;
    const unsubStatus = onSnapshot(doc(db, "studentExams", `${admissionId}_${examId}`), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setDbStatus(data.status);
        if (data.status === "Ongoing") setExamStarted(true);
        if (data.status === "Completed") navigate(`/student/exams/finish/${admissionId}_${examId}`, { replace: true });
      }
    });
    return () => unsubStatus();
  }, [admissionId, examId, navigate]);

  const handleFinalSubmit = useCallback(async (isAuto = false) => {
    if (!isAuto && !window.confirm("Submit Exam?")) return;
    try {
      const res = await submitExam(admissionId, examId, ans, questions);
      if (res.success) navigate(`/student/exams/finish/${admissionId}_${examId}`, { replace: true });
    } catch (err) { console.error(err); }
  }, [admissionId, examId, ans, questions, navigate, submitExam]);

  // 🔥 UPDATED: Timer + Tab Switch + Window Blur (Auto-Submit Logic)
  useEffect(() => {
    if (!examStarted) return;

    // 1. Tab Change ya Minimize hone par auto-submit
    const handleAntiCheat = () => { 
      if (document.hidden) {
        handleFinalSubmit(true); 
      }
    };

    // 2. Dusri window par click karne par auto-submit
    const handleBlur = () => {
        handleFinalSubmit(true);
    };

    document.addEventListener("visibilitychange", handleAntiCheat);
    window.addEventListener("blur", handleBlur);

    // 3. Timer zero hone par auto-submit
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleAntiCheat);
      window.removeEventListener("blur", handleBlur);
      clearInterval(timer);
    };
  }, [examStarted, handleFinalSubmit]);

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-primary" /></div>;

  if (examStarted) {
    const q = questions[index];
    const isAnswered = q?.type === 'mcq' ? !!ans[q?.id] : (ans[q?.id]?.code?.trim().length > 0);

    return (
      <div className="bg-light min-vh-100">
        <div className="bg-dark text-white px-3 py-2 sticky-top d-flex justify-content-between align-items-center">
          <span className="fw-semibold small">QUESTION {index + 1} / {questions.length}</span>
          <div className="badge bg-danger px-3 py-2">
            <i className="bi bi-alarm me-1"></i>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>

        <div className="container py-3" style={{ maxWidth: "850px" }}>
          <div className="card border-0 shadow-sm rounded-0 mb-3">
            <div className="card-body p-3 p-md-4">
              <h6 className="fw-bold mb-3 lh-base">{q?.question}</h6>
              {q?.type === "mcq" ? (
                <div className="d-grid gap-2">
                  {["A", "B", "C", "D"].map((opt) => (
                    <button key={opt} className={`btn text-start rounded-0 border ${ans[q.id] === opt ? "btn-primary" : "btn-light border-secondary"}`} onClick={() => setAns({ ...ans, [q.id]: opt })}>
                      <span className="fw-semibold me-2">{opt}.</span> {q[`option${opt}`]}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="border rounded-0">
                  <div className="bg-light px-2 py-1 border-bottom small text-muted fw-semibold"><i className="bi bi-code-slash me-1"></i>{q.language}</div>
                  <Editor
                    value={ans[q.id]?.code || ""}
                    onValueChange={(code) => setAns({ ...ans, [q.id]: { ...ans[q.id], code } })}
                    highlight={(code) => highlight(code, languages[q.language] || languages.js)}
                    padding={12}
                    style={{ fontFamily: "monospace", fontSize: 13, minHeight: "300px", background: "#fff" }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-secondary rounded-0 px-4" disabled={index === 0} onClick={() => setIndex(index - 1)}>Prev</button>
            <button className={`btn rounded-0 px-4 ${index === questions.length - 1 ? "btn-success" : "btn-primary"}`} disabled={!isAnswered} onClick={() => index === questions.length - 1 ? handleFinalSubmit() : setIndex(index + 1)}>
              {index === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-2 d-flex align-items-center justify-content-center">
      <div className="card shadow-sm px-5 py-4 text-center border-0 rounded-0">
        <h3 className="fw-bold">{exam?.title}</h3>
        <p className="text-muted">Total Questions: {questions.length}</p>
        <div className="bg-light p-3 text-start my-4 border-start border-primary border-4">
          <h6 className="fw-bold small text-uppercase mb-2 text-primary">Rules:</h6>
          <ul className="small mb-0 ps-3 text-muted">
            <li>Answer current question to unlock <strong>NEXT</strong>.</li>
            <li>Programming questions require code solution.</li>
            <li>Tab switching will result in <strong>auto-submission</strong>.</li>
            <li>Timer will auto-submit when it hits zero.</li>
          </ul>
        </div>
        <button className="btn btn-primary w-100 py-3 fw-bold rounded-0" onClick={() => updateDoc(doc(db, "studentExams", `${admissionId}_${examId}`), { status: "Ongoing", startedAt: serverTimestamp() })}>
          START EXAMINATION
        </button>
      </div>
    </div>
  );
}