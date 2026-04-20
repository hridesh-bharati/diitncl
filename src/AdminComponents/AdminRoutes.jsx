// src/AdminComponents/AdminRoutes.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import AdminLayout from "./Layout/AdminLayout";

// Standard Admin Components
import Dashboard from "./Dashboard/Dashboard";
import VisitorCount from "./Dashboard/VisitorCount";
import StudentList from "./Students/StudentList";
import StudentProfile from "./Students/StudentProfile";
import StudentCertificate from "./Certificate/StudentCertificate";
import FeePage from "./Students/Fees/FeePage";
import AdmissionList from "./Admissions/AdmitedStudent";
import AttendanceDashboard from "./Students/Attendance/AttendanceDashboard";
import AttendanceMark from "./Students/Attendance/AttendanceMark";
import AttendanceSummary from "./Students/Attendance/AttendanceSummary";
import AttendanceAnalytics from "./Students/Attendance/AttendanceAnalytics";
import CreateOffer from "./Offers/CreateOffer";
import DeleteOffer from "./Offers/DeleteOffer";
import AdminProfile from "./Profile/AdminProfile";
import AdminList from "./Profile/AdminList";
import Contacts from "./Queries/Contacts";

// 🔥 ADMIN EXAM IMPORTS
import { ExamProvider } from "./Students/Exams/context/ExamProvider";
import AdminExamDashboard from "./Students/Exams/admin/pages/AdminExamDashboard";
import AdminCreateExam from "./Students/Exams/admin/pages/AdminCreateExam";
import AdminAddQuestions from "./Students/Exams/admin/pages/AdminAddQuestions";
import AdminAssignExam from "./Students/Exams/admin/pages/AdminAssignExam";
import AdminLiveTracking from "./Students/Exams/admin/pages/AdminLiveTracking";
import AdminCompletedExams from "./Students/Exams/admin/pages/AdminCompletedExams";
import AdminExamResultView from "./Students/Exams/admin/pages/AdminExamResultView";
import AdminExamDetail from "./Students/Exams/admin/pages/AdminExamDetail.jsx";


// Practice Test Imports
import AdminPracticeUpload from "./Students/TestExamByAdminProvider/AdminPracticeUpload.jsx";
import AdminPracticeResults from "./Students/TestExamByAdminProvider/AdminPracticeResults.jsx";
import AdminPracticeLive from "./Students/TestExamByAdminProvider/AdminPracticeLive.jsx";
import AdminPracticeAssign from "./Students/TestExamByAdminProvider/AdminPracticeAssign.jsx";
import AdminPracticeQuestionsManage from "./Students/TestExamByAdminProvider/AdminPracticeQuestionsManage.jsx";
import StudentTestRecords from "./Students/TestExamByAdminProvider/StudentTestRecords.jsx";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="admitted-student-list" element={<AdmissionList />} />
        <Route path="students" element={<StudentList />} />
        <Route path="students/:id" element={<StudentProfile />} />
        <Route path="students/:id/certificate" element={<StudentCertificate />} />
        <Route path="students/:id/fees" element={<FeePage />} />
        <Route path="students/:id/test-records" element={<StudentTestRecords />} />
        
        {/* Attendance Group */}
        <Route path="students/attendance">
          <Route index element={<AttendanceDashboard />} />
          <Route path="mark" element={<AttendanceMark />} />
          <Route path="summary" element={<AttendanceSummary />} />
          <Route path="analytics" element={<AttendanceAnalytics />} />
        </Route>

        {/* <Route path="gallery" element={<AdminGalleryUpload />} />
        <Route path="all-images" element={<AllPics />} /> */}
        <Route path="new-offers" element={<CreateOffer />} />
        <Route path="delete-offers" element={<DeleteOffer />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="admin-list" element={<AdminList />} />
        <Route path="clients-contacts" element={<Contacts />} />
        <Route path="clients-contacts/:id" element={<Contacts />} />
        <Route path="visiters-list" element={<VisitorCount />} />

        {/* --- 🔥 ADMIN EXAM MANAGEMENT --- */}
        <Route path="exams" element={<ExamProvider><Outlet /></ExamProvider>}>
          <Route index element={<AdminExamDashboard />} />
          <Route path="new" element={<AdminCreateExam />} />
          <Route path="live-tracking" element={<AdminLiveTracking />} />
          <Route path="completed" element={<AdminCompletedExams />} />
          <Route path="result/:studentExamId" element={<AdminExamResultView />} />

          <Route path=":examId">
            <Route index element={<AdminExamDetail />} />
            <Route path="questions" element={<AdminAddQuestions />} />
            <Route path="assign" element={<AdminAssignExam />} />
          </Route>
        </Route>


        <Route path="practice-tests">
          <Route index element={<AdminPracticeUpload />} />
          <Route path="questions" element={<AdminPracticeQuestionsManage />} />
          <Route path="results" element={<AdminPracticeResults />} />
          <Route path="live" element={<AdminPracticeLive />} />
          <Route path="assign/:testId" element={<AdminPracticeAssign />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}