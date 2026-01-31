import { Routes, Route, Navigate } from "react-router-dom";

import StudentLayout from "./Layout/StudentLayout";
import Dashboard from "./Dashboard/Dashboard";
import Profile from "./Dashboard/Profile";

export default function StudentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StudentLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
