import { Routes, Route, Navigate } from "react-router-dom";
import StudentLayout from "./Layout/StudentLayout";
import Dashboard from "./Dashboard/Dashboard";
import Profile from "./Dashboard/Profile";
import Certificate from "./Common/Certificate"
import AccountSection from "./Dashboard/AccountSection";
export default function StudentRoutes() {
  return (
  <Routes>
      <Route path="/" element={<StudentLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="account" element={<AccountSection />} /> {/* added */}
        <Route path="certificate" element={<Certificate />} />
        <Route path="*" element={<Navigate to="/student" replace />} />
      </Route>
    </Routes>
  );
}