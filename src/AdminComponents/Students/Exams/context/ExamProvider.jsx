// src/AdminComponents/Students/Exams/context/ExamProvider.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { staticCourses } from "../../../../Components/HomePage/pages/Course/courseData";

import { db } from "../../../../firebase/firebase";
import {
    collection, doc, addDoc, updateDoc, getDocs, query, where,
    orderBy, onSnapshot, writeBatch, serverTimestamp, deleteDoc
} from "firebase/firestore";

const ExamContext = createContext();
export const useExam = () => useContext(ExamContext);

const COMPUTER_COURSES = staticCourses.map(c => c.name);

export const ExamProvider = ({ children }) => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Realtime Listener for Exams
    useEffect(() => {
        const q = query(collection(db, "exams"), orderBy("createdAt", "desc"));
        return onSnapshot(q, (snap) => {
            setExams(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });
    }, []);

    // 2. Create Exam Info
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
        } catch (err) { return null; }
    };

    // 3. Add/Update Questions (Batch Logic)
    const addQuestions = async (examId, questions) => {
        try {
            const batch = writeBatch(db);
            const oldQs = await getDocs(query(collection(db, "examQuestions"), where("examId", "==", examId)));
            oldQs.forEach(d => batch.delete(d.ref));

            questions.forEach(q => {
                const qRef = doc(collection(db, "examQuestions"));
                batch.set(qRef, { ...q, examId });
            });

            batch.update(doc(db, "exams", examId), { status: "Ready", totalQuestions: questions.length });
            await batch.commit();
            return true;
        } catch (err) { return false; }
    };

    // 4. Assign Exam
    const assignToStudents = async (examId, studentIds) => {
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
        } catch (err) { return false; }
    };

    // 5. Submit Exam
    const submitExam = async (studentAdmissionId, examId, answers, questions) => {
        try {
            const studentExamRef = doc(db, "studentExams", `${studentAdmissionId}_${examId}`);
            let score = 0;
            questions.forEach(q => {
                if (answers[q.id] === q.correctAnswer) {
                    score += Number(q.marks || 1);
                }
            });

            await updateDoc(studentExamRef, {
                status: "Completed",
                answers: answers,
                score: score,
                completedAt: new Date()
            });

            return { success: true, score: score };
        } catch (error) {
            console.error("Submission Error:", error);
            return { success: false, error: error.message };
        }
    };

    // 6. 🔥 DELETE EXAM LOGIC (Paper + Questions Cleanup)
    const deleteExam = async (examId) => {
        if (!window.confirm("PERMANENT DELETE: Are you sure? This will delete the exam and all related questions!")) return;
        try {
            const batch = writeBatch(db);

            // Delete all questions linked to this exam
            const qSnap = await getDocs(query(collection(db, "examQuestions"), where("examId", "==", examId)));
            qSnap.docs.forEach(d => batch.delete(d.ref));

            // Delete the main exam document
            batch.delete(doc(db, "exams", examId));

            await batch.commit();
            return true;
        } catch (err) {
            console.error("Delete Error:", err);
            return false;
        }
    };

    const toggleExamLive = async (id, state) => await updateDoc(doc(db, "exams", id), { isLive: !state });

    return (
        <ExamContext.Provider value={{
            exams, courses: COMPUTER_COURSES, loading,
            createExam, addQuestions, assignToStudents, submitExam, toggleExamLive, deleteExam
        }}>
            {children}
        </ExamContext.Provider>
    );
};