import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useParams } from "react-router-dom";

export default function StudentExamPage() {

  const { examId } = useParams();

  const [user, setUser] = useState(null);
  const [examStarted, setExamStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  // 🔹 Auth check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      setUser(u);

      // 🔥 FIX: Use email instead of u.uid to match the Admin's docId
      const studentEmail = u.email.toLowerCase().trim();
      const studentExamRef = doc(db, "studentExams", `${studentEmail}_${examId}`);
      
      const snap = await getDoc(studentExamRef);

      if (snap.exists()) {
        setExamStarted(true);
        loadQuestions();
      }
      setLoading(false);
    });
    return () => unsub();
  }, [examId]);

  // 🔹 Load Questions
  const loadQuestions = async () => {

    const q = query(
      collection(db, "examQuestions"),
      where("examId", "==", examId)
    );

    const qSnap = await getDocs(q);

    const arr = qSnap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

    setQuestions(arr);
  };

  // 🔹 Start Exam
  const startExam = async () => {

    const studentExamRef = doc(db, "studentExams", `${user.uid}_${examId}`);

    await setDoc(studentExamRef, {
      studentId: user.uid,
      examId: examId,
      status: "Ongoing",
      startedAt: new Date()
    });

    setExamStarted(true);

    await loadQuestions();
  };

  // 🔹 Select Answer
  const selectAnswer = (qid, option) => {

    setAnswers({
      ...answers,
      [qid]: option
    });

  };

  if (loading) return <h2>Loading...</h2>;

  // 🔴 Exam not started
  if (!examStarted) {

    return (
      <div style={{ padding: 40 }}>
        <h2>Exam Ready</h2>
        <button onClick={startExam}>Start Exam</button>
      </div>
    );

  }

  // 🔴 No questions
  if (questions.length === 0) {

    return (
      <div style={{ padding: 40 }}>
        <h2>Questions not loaded</h2>
      </div>
    );

  }

  const q = questions[currentQ];

  return (
    <div style={{ padding: 40 }}>

      <h2>Question {currentQ + 1} / {questions.length}</h2>

      <h3>{q.question}</h3>

      <div>

        {q.options.map((opt, i) => (

          <div key={i} style={{ margin: "10px 0" }}>

            <label>
              <input
                type="radio"
                name="answer"
                checked={answers[q.id] === opt}
                onChange={() => selectAnswer(q.id, opt)}
              />
              {opt}
            </label>

          </div>

        ))}

      </div>

      <div style={{ marginTop: 20 }}>

        <button
          disabled={currentQ === 0}
          onClick={() => setCurrentQ(currentQ - 1)}
        >
          Previous
        </button>

        <button
          disabled={currentQ === questions.length - 1}
          onClick={() => setCurrentQ(currentQ + 1)}
        >
          Next
        </button>

      </div>

    </div>
  );
}