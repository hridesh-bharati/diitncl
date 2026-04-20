// src\StudentComponents\StudentRoutes.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import StudentLayout from "./Layout/StudentLayout";
import Dashboard from "./Dashboard/Dashboard";
import Profile from "./Dashboard/Profile";
import Certificate from "./Common/Certificate";
import AccountSection from "./Dashboard/AccountSection";

// --------Examination--------
import { ExamProvider } from "../AdminComponents/Students/Exams/context/ExamProvider";
import StudentExamList from "./Exams/StudentExamList";
import StudentExamPage from "./Exams/StudentExamPage";
import StudentExamFinalGreet from "./Exams/StudentExamFinalGreet";

// -------- Practice Test --------
import PracticeTestPage from "./TestExamByStudentProvider/PracticeTestPage";
import PracticeMyResults from "./TestExamByStudentProvider/PracticeMyResults";
import PracticeAttemptPage from "./TestExamByStudentProvider/PracticeAttemptPage";

export default function StudentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StudentLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="account" element={<AccountSection />} />
        <Route path="certificate" element={<Certificate />} />

        {/* --- 🔥 Optimized & Wrapped Exams Routes --- */}
        <Route path="exams" element={<ExamProvider><Outlet /></ExamProvider>}>
          <Route index element={<StudentExamList />} />
          <Route path="attempt/:examId" element={<StudentExamPage />} />
          <Route path="finish/:studentExamId" element={<StudentExamFinalGreet />} />
        </Route>

        <Route path="practice-tests">
          <Route index element={<PracticeTestPage />} />
          <Route path="attempt/:testId" element={<PracticeAttemptPage />} />
          <Route path="results" element={<PracticeMyResults />} />
          <Route path="results/:testId" element={<PracticeMyResults />} />
        </Route>


        <Route path="*" element={<Navigate to="/student" replace />} />
      </Route>
    </Routes>
  );
}