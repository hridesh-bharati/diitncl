
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./Layout/AdminLayout";
import Dashboard from "./Dashboard/Dashboard";
import StudentList from "./Students/StudentList";
import StudentProfile from "./Students/StudentProfile";
import AdminProfile from "./Profile/AdminProfile";
import StudentCertificate from "./Certificate/StudentCertificate";
import AdminGalleryUpload from "./Gallery/GalleryUpload";
import AdminList from "./Profile/AdminList";
import AdmissionList from "./Admissions/AdmitedStudent";
import Contacts from "./Queries/Contacts";
import AllPics from "./Gallery/AllPics";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="admitted-student-list" element={<AdmissionList />} />
        <Route path="students" element={<StudentList />} />
        <Route path="students/:id" element={<StudentProfile />} />
        <Route path="students/:id/certificate" element={<StudentCertificate />} />
        <Route path="gallery" element={<AdminGalleryUpload />} />
        <Route path="all-images" element={<AllPics />} />
        
        <Route path="profile" element={<AdminProfile />} />
        <Route path="clients-contacts" element={<Contacts />} />
        <Route path="clients-contacts/:id" element={<Contacts />} />
        <Route path="admin-list" element={<AdminList />} />

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
