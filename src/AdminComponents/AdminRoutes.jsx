<<<<<<< HEAD
=======

>>>>>>> 2d3ad1377860588c75becbdcae6c9eb0d009857d
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
<<<<<<< HEAD
import CreateOffer from "./Offers/CreateOffer";
import DeleteOffer from "./Offers/DeleteOffer";
=======
>>>>>>> 2d3ad1377860588c75becbdcae6c9eb0d009857d

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
<<<<<<< HEAD
        <Route path="new-offers" element={<CreateOffer />} />
        <Route path="delete-offers" element={<DeleteOffer />} />
=======
        
>>>>>>> 2d3ad1377860588c75becbdcae6c9eb0d009857d
        <Route path="profile" element={<AdminProfile />} />
        <Route path="clients-contacts" element={<Contacts />} />
        <Route path="clients-contacts/:id" element={<Contacts />} />
        <Route path="admin-list" element={<AdminList />} />

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
