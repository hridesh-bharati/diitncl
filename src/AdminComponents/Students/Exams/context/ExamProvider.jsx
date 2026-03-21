// src/AdminComponents/Students/Exams/context/ExamProvider.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { staticCourses } from "../../../../Components/HomePage/pages/Course/courseData";

import { db } from "../../../../firebase/firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  deleteDoc
} from "firebase/firestore";

const ExamContext = createContext();
export const useExam = () => useContext(ExamContext);

const COMPUTER_COURSES = staticCourses?.map(c => c.name) || [];

export const ExamProvider = ({ children }) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Realtime Listener for Exams
  useEffect(() => {
    const q = query(collection(db, "exams"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setExams(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("Exam listener error:", err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // 2️⃣ Create Exam
  const createExam = async (data) => {
    try {
      const ref = await addDoc(collection(db, "exams"), {
        ...data,
        status: "Draft",
        isLive: false,
        resultsPublished: false,
        createdAt: serverTimestamp()
      });
      return ref.id;
    } catch (err) {
      console.error("Create Exam Error:", err);
      return null;
    }
  };

  // 3️⃣ Add/Update Questions
  const addQuestions = async (examId, questions) => {
    if (!questions || !questions.length) {
      console.warn("addQuestions called with empty questions array");
      return false;
    }

    try {
      const batch = writeBatch(db);

      // Delete old questions
      const oldQs = await getDocs(query(collection(db, "examQuestions"), where("examId", "==", examId)));
      oldQs.forEach(d => batch.delete(d.ref));

      // Add new questions
      questions.forEach(q => {
        const qRef = doc(collection(db, "examQuestions"));
        batch.set(qRef, { ...q, examId });
      });

      // Update exam status
      batch.update(doc(db, "exams", examId), { status: "Ready", totalQuestions: questions.length });

      await batch.commit();
      return true;
    } catch (err) {
      console.error("Add Questions Error:", err);
      return false;
    }
  };

  // 4️⃣ Assign Exam to Students
  const assignToStudents = async (examId, studentIds) => {
    if (!studentIds || !studentIds.length) {
      console.warn("assignToStudents called with empty studentIds array");
      return false;
    }

    try {
      const batch = writeBatch(db);
      studentIds.forEach(studentId => {
        const docId = `${studentId}_${examId}`;
        const ref = doc(db, "studentExams", docId);
        batch.set(ref, {
          studentId,
          examId,
          status: "Pending",
          score: 0,
          assignedAt: serverTimestamp()
        });
      });

      await batch.commit();
      return true;
    } catch (err) {
      console.error("Assign Exam Error:", err);
      return false;
    }
  };

  // 5️⃣ Submit Exam
  const submitExam = async (studentAdmissionId, examId, answers, questions) => {
    try {
      const studentExamRef = doc(db, "studentExams", `${studentAdmissionId}_${examId}`);
      let score = 0;

      questions.forEach(q => {
        if (answers[q.id] != null && answers[q.id] === q.correctAnswer) {
          score += parseFloat(q.marks || 1);
        }
      });

      await updateDoc(studentExamRef, {
        status: "Completed",
        answers: answers,
        score: score,
        completedAt: serverTimestamp()
      });

      return { success: true, score };
    } catch (err) {
      console.error("Submit Exam Error:", err);
      return { success: false, error: err.message };
    }
  };

  // 6️⃣ Delete Exam + Questions
  const deleteExam = async (examId) => {
    if (!window.confirm("PERMANENT DELETE: Are you sure? This will delete the exam and all related questions!")) return false;

    try {
      const batch = writeBatch(db);

      const qSnap = await getDocs(query(collection(db, "examQuestions"), where("examId", "==", examId)));
      qSnap.docs.forEach(d => batch.delete(d.ref));

      batch.delete(doc(db, "exams", examId));

      await batch.commit();
      return true;
    } catch (err) {
      console.error("Delete Exam Error:", err);
      return false;
    }
  };

  // 7️⃣ Toggle Exam Live
  const toggleExamLive = async (id, currentState) => {
    try {
      await updateDoc(doc(db, "exams", id), { isLive: !currentState });
      return true;
    } catch (err) {
      console.error("Toggle Exam Live Error:", err);
      return false;
    }
  };

  return (
    <ExamContext.Provider
      value={{
        exams,
        courses: COMPUTER_COURSES,
        loading,
        createExam,
        addQuestions,
        assignToStudents,
        submitExam,
        toggleExamLive,
        deleteExam
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};