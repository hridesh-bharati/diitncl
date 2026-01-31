import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { List } from "react-bootstrap-icons";
import StudentSidebar from "./StudentSidebar";
import "./StudentLayout.css";

export default function StudentLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="student-layout mt-4">
      <StudentSidebar open={open} setOpen={setOpen} />

      <div className="student-main">
        {/* Top Bar */}
        <div className="student-topbar">
          <button className="icon-btn" onClick={() => setOpen(true)}>
            <List size={24} />
          </button>
          <h6 className="mb-0 ms-2">Student Dashboard</h6>
        </div>

        {/* Page Content */}
        <div className="student-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
