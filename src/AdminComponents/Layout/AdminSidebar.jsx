// src/AdminComponents/AdminSidebar.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

export default function AdminSidebar({ open, setOpen }) {
  const location = useLocation();
  const handleClose = () => setOpen(false);

  // Active state checks for accordions
  const isAttendanceActive = location.pathname.includes("/admin/students/attendance");
  const isExamActive = location.pathname.includes("/admin/exams");

  const MAIN_MENU = [
    { path: "/admin", label: "Dashboard", icon: "bi-house-door-fill", end: true },
    { path: "/admin/admitted-student-list", label: "Admitted Students", icon: "bi-shield-check" },
    { path: "/admin/students", label: "New Admissions", icon: "bi-person-plus-fill" },
    { path: "/admin/clients-contacts", label: "Inbox (Queries)", icon: "bi-chat-dots-fill" },
  ];

  const MEDIA_MARKETING = [
    { path: "/admin/gallery", label: "Upload Media", icon: "bi-cloud-arrow-up-fill" },
    { path: "/admin/all-images", label: "Gallery", icon: "bi-images" },
    { path: "/admin/new-offers", label: "Promotions", icon: "bi-megaphone-fill" },
    { path: "/admin/delete-offers", label: "All Offers", icon: "bi-tags-fill" },
  ];

  const SYSTEM_LISTS = [
    { path: "/admin/admin-list", label: "Admin List", icon: "bi-lock-fill" },
    { path: "/admin/visiters-list", label: "Visitor List", icon: "bi-people-fill" },
  ];

  return (
    <>
      {open && <div className="ios-backdrop" onClick={handleClose} />}

      <aside className={`ios-sidebar ${open ? "open" : ""}`}>
        <div className="d-flex flex-column h-100">

          {/* Brand Header */}
          <div className="sidebar-header d-flex align-items-center justify-content-between p-4 pb-3">
            <div>
              <h5 className="fw-bold mb-0 text-dark tracking-tight">Drishtee</h5>
              <span className="sidebar-subtitle opacity-50 fw-bold">Admin Console</span>
            </div>
            <button className="btn p-0 border-0 fs-3 d-lg-none text-muted" onClick={handleClose}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <nav className="flex-grow-1 custom-scroll overflow-auto px-2">

            {/* 1. MAIN MANAGEMENT */}
            <p className="sidebar-label">Management</p>
            {MAIN_MENU.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.end} className={({ isActive }) => `ios-link ${isActive ? "active" : ""}`} onClick={handleClose}>
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </NavLink>
            ))}

            {/* 2. 🔥 EXAMS SECTION (Accordion Style) */}
            <div className="accordion accordion-flush mt-1" id="examAccordion">
              <div className="accordion-item bg-transparent border-0">
                <div
                  className={`ios-link accordion-button shadow-none ${!isExamActive ? "collapsed" : ""}`}
                  data-bs-toggle="collapse"
                  data-bs-target="#examCollapse"
                  style={{ cursor: 'pointer' }}
                >
                  <i className="bi bi-journal-text"></i>
                  <span>Examinations</span>
                </div>

                <div id="examCollapse" className={`accordion-collapse collapse ${isExamActive ? "show" : ""}`} data-bs-parent="#examAccordion">
                  <div className="ps-4 ms-3 border-start py-1">
                    {[
                      { path: "/admin/exams", label: "Dashboard" },
                      { path: "/admin/exams/new", label: "Launch Exam" },
                      { path: "/admin/exams/live-tracking", label: "Live Tracking" },
                      { path: "/admin/exams/completed", label: "Reports & Results" }
                    ].map(sub => (
                      <NavLink key={sub.path} to={sub.path} className={({ isActive }) => `ios-sublink ${isActive ? "active" : ""}`} onClick={handleClose}>
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. ATTENDANCE SECTION */}
            <div className="accordion accordion-flush mt-1" id="studentAccordion">
              <div className="accordion-item bg-transparent border-0">
                <div
                  className={`ios-link accordion-button shadow-none ${!isAttendanceActive ? "collapsed" : ""}`}
                  data-bs-toggle="collapse"
                  data-bs-target="#studentCollapse"
                  style={{ cursor: 'pointer' }}
                >
                  <i className="bi bi-calendar2-check-fill"></i>
                  <span>Attendance</span>
                </div>

                <div id="studentCollapse" className={`accordion-collapse collapse ${isAttendanceActive ? "show" : ""}`} data-bs-parent="#studentAccordion">
                  <div className="ps-4 ms-3 border-start py-1">
                    {[
                      { path: "/admin/students/attendance", label: "Dashboard" },
                      { path: "/admin/students/attendance/mark", label: "Mark Attendance" },
                      { path: "/admin/students/attendance/summary", label: "Summary" },
                      { path: "/admin/students/attendance/analytics", label: "Analytics" }
                    ].map(sub => (
                      <NavLink key={sub.path} to={sub.path} className={({ isActive }) => `ios-sublink ${isActive ? "active" : ""}`} onClick={handleClose}>
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. MEDIA & OFFERS */}
            <p className="sidebar-label mt-3">Marketing</p>
            {MEDIA_MARKETING.map((item) => (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => `ios-link ${isActive ? "active" : ""}`} onClick={handleClose}>
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </NavLink>
            ))}

            {/* 5. SYSTEM LISTS */}
            <p className="sidebar-label mt-3">System</p>
            {SYSTEM_LISTS.map((item) => (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => `ios-link ${isActive ? "active" : ""}`} onClick={handleClose}>
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Profile Footer */}
          <div className="sidebar-footer p-3 mt-auto">
            <NavLink to="/admin/profile" className="profile-card text-decoration-none" onClick={handleClose}>
              <div className="profile-avatar bg-danger text-white">
                <i className="bi bi-person-fill"></i>
              </div>
              <div className="ms-3 overflow-hidden">
                <p className="m-0 fw-bold text-dark small text-truncate">Admin Account</p>
                <p className="m-0 text-muted extra-small">Settings & Privacy</p>
              </div>
              <i className="bi bi-chevron-right ms-auto opacity-25 small"></i>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}