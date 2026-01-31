// src/AdminComponents/AdminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./Layout/AdminLayout";
import Dashboard from "./Dashboard/Dashboard";
import AdmissionForm from "./Admissions/AdmissionForm";
import StudentList from "./Students/StudentList";
import StudentProfile from "./Students/StudentProfile";
import AdminProfile from "./Profile/AdminProfile";
import StudentCertificate from "./Certificate/StudentCertificate"; 

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>

        <Route index element={<Dashboard />} />

        <Route path="admissions" element={<AdmissionForm />} />

        <Route path="students" element={<StudentList />} />
        <Route path="students/:id" element={<StudentProfile />} />
        <Route
          path="students/:id/certificate"
          element={<StudentCertificate />}
        />

        <Route path="profile" element={<AdminProfile />} />

        {/* ✅ Admin fallback */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
