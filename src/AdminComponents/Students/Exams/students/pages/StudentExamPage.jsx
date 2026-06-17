import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useParams } from "react-router-dom";

export default function StudentExamPage() {
  const { examId } = useParams();

  const [user, setUser] = useState(null);
  const [studentEmail, setStudentEmail] = useState("");
  const [examStarted, setExamStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  // 🔹 Auth check aur Initial Data Verification
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setLoading(false);
        return;
      }
      
      setUser(u);
      const email = u.email.toLowerCase().trim();
      setStudentEmail(email);

      try {
        // 🔥 FIX: Konsa document check karna hai use uniformly email based rakha hai
        const studentExamRef = doc(db, "studentExams", `${email}_${examId}`);
        const snap = await getDoc(studentExamRef);

        if (snap.exists()) {
          setExamStarted(true);
          // Agar exam already chal raha hai, toh seedhe questions load karo
          await loadQuestions();
        }
      } catch (error) {
        console.error("Error fetching exam status:", error);
      } finally {
        setLoading(false);
      }
    });
    
    return () => unsub();
  }, [examId]);

  // 🔹 Load Questions from Firestore
  const loadQuestions = async () => {
    try {
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
    } catch (error) {
      console.error("Error loading questions:", error);
    }
  };

  // 🔹 Start Exam
  const startExam = async () => {
    if (!studentEmail) return;
    setLoading(true);

    try {
      // 🔥 FIX: Yahan user.uid ki jagah studentEmail use kiya hai taaki docId consistently match kare
      const studentExamRef = doc(db, "studentExams", `${studentEmail}_${examId}`);

      await setDoc(studentExamRef, {
        studentId: studentEmail, // Consistent with admin side assignment
        examId: examId,
        status: "Ongoing",
        startedAt: serverTimestamp() // Realtime accurate server timestamp
      });

      setExamStarted(true);
      await loadQuestions();
    } catch (error) {
      console.error("Error starting exam:", error);
      alert("Exam start karne mein dikkat aayi. Kripya dobara koshish karein.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Select Answer
  const selectAnswer = (qid, option) => {
    setAnswers(prev => ({
      ...prev,
      [qid]: option
    }));
  };

  // 🔴 Loading state screen
  if (loading) {
    return (
      <div style={{ padding: 40, display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h2>Loading Exam Portal...</h2>
      </div>
    );
  }

  // 🔴 Exam ready screen (Not started yet)
  if (!examStarted) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Exam Ready</h2>
        <p>Kripya niche diye gaye button par click karke apna exam shuru karein.</p>
        <button 
          onClick={startExam}
          style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px" }}
        >
          Start Exam
        </button>
      </div>
    );
  }

  // 🔴 Backup check: If questions failed to load from DB
  if (questions.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Questions not loaded</h2>
        <p>Is exam ke liye koi questions nahi mile. Kripya administrator se sampark karein.</p>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div style={{ padding: 40, maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <span><strong>Student:</strong> {studentEmail}</span>
        <h2>Question {currentQ + 1} / {questions.length}</h2>
      </div>

      <hr />

      <h3 style={{ margin: "20px 0" }}>{q?.question}</h3>

      <div>
        {/* SAFE: Added optional chaining '?.' to options so it never crashes if options array is missing */}
        {q?.options?.map((opt, i) => (
          <div key={i} style={{ margin: "12px 0", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer", width: "100%" }}>
              <input
                type="radio"
                name={`answer_${q.id}`}
                style={{ marginRight: "10px", transform: "scale(1.2)" }}
                checked={answers[q.id] === opt}
                onChange={() => selectAnswer(q.id, opt)}
              />
              {opt}
            </label>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between" }}>
        <button
          disabled={currentQ === 0}
          onClick={() => setCurrentQ(currentQ - 1)}
          style={{ padding: "8px 16px", cursor: currentQ === 0 ? "not-allowed" : "pointer" }}
        >
          Previous
        </button>

        <button
          disabled={currentQ === questions.length - 1}
          onClick={() => setCurrentQ(currentQ + 1)}
          style={{ padding: "8px 16px", cursor: currentQ === questions.length - 1 ? "not-allowed" : "pointer" }}
        >
          Next
        </button>
      </div>
    </div>
  );
}