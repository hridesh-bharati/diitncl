// src/AdminComponents/AdminRoutes.jsx

import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./Layout/AdminLayout";

// Dashboard
import Dashboard from "./Dashboard/Dashboard";
import VisitorCount from "./Dashboard/VisitorCount";

// Students
import StudentList from "./Students/StudentList";
import StudentProfile from "./Students/StudentProfile";
import StudentCertificate from "./Certificate/StudentCertificate";
import FeePage from "./Students/Fees/FeePage"
// Admissions
import AdmissionList from "./Admissions/AdmitedStudent";

// Attendance
import AttendanceDashboard from "./Students/Attendance/AttendanceDashboard";
import AttendanceMark from "./Students/Attendance/AttendanceMark";
import AttendanceSummary from "./Students/Attendance/AttendanceSummary";
import AttendanceAnalytics from "./Students/Attendance/AttendanceAnalytics";

// Gallery
import AdminGalleryUpload from "./Gallery/GalleryUpload";
import AllPics from "./Gallery/AllPics";

// Offers
import CreateOffer from "./Offers/CreateOffer";
import DeleteOffer from "./Offers/DeleteOffer";

// Profile
import AdminProfile from "./Profile/AdminProfile";
import AdminList from "./Profile/AdminList";

// Queries
import Contacts from "./Queries/Contacts";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>

        {/* Dashboard */}
        <Route index element={<Dashboard />} />

        {/* Admissions */}
        <Route path="admitted-student-list" element={<AdmissionList />} />

        {/* Students */}
        <Route path="students" element={<StudentList />} />
        <Route path="students/:id" element={<StudentProfile />} />
        <Route path="students/:id/certificate" element={<StudentCertificate />} />
        <Route path="students/:id/fees" element={<FeePage />} />
        {/* Attendance */}
        <Route path="students/attendance" element={<AttendanceDashboard />} />
        <Route path="students/attendance/mark" element={<AttendanceMark />} />
        <Route path="students/attendance/summary" element={<AttendanceSummary />} />
        <Route path="students/attendance/analytics" element={<AttendanceAnalytics />} />

        {/* Gallery */}
        <Route path="gallery" element={<AdminGalleryUpload />} />
        <Route path="all-images" element={<AllPics />} />

        {/* Offers */}
        <Route path="new-offers" element={<CreateOffer />} />
        <Route path="delete-offers" element={<DeleteOffer />} />

        {/* Profile */}
        <Route path="profile" element={<AdminProfile />} />
        <Route path="admin-list" element={<AdminList />} />

        {/* Contacts */}
        <Route path="clients-contacts" element={<Contacts />} />
        <Route path="clients-contacts/:id" element={<Contacts />} />

        {/* Visitors */}
        <Route path="visiters-list" element={<VisitorCount />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="" replace />} />

      </Route>
    </Routes>
  );
}