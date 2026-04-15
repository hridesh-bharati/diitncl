import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

export default function AdminSidebar({ open, setOpen }) {
  const location = useLocation();
  const handleClose = () => setOpen(false);

  const isAttendanceActive = location.pathname.includes("/admin/students/attendance");
  const isExamActive = location.pathname.includes("/admin/exams");

  const isPracticeActive = location.pathname.includes("/admin/practice-tests");

  // Reusable NavRow using Bootstrap Utilities
  const NavRow = ({ item, isAccordion = false, isActive = false, target = "" }) => (
    <div
      className={`d-flex align-items-center p-2 px-3 mx-2 my-1 rounded-3 cursor-pointer transition-all ${isActive ? "bg-primary-subtle text-primary fw-bold" : "text-dark hover-bg-light"}`}
      data-bs-toggle={isAccordion ? "collapse" : ""}
      data-bs-target={target}
      onClick={!isAccordion ? handleClose : undefined}
      style={{ textDecoration: 'none' }}
    >
      <div
        className="d-flex align-items-center justify-content-center rounded-2 me-3 shadow-sm flex-shrink-0"
        style={{ backgroundColor: item.color, width: "32px", height: "32px" }}
      >
        <i className={`bi ${item.icon} text-white fs-6`}></i>
      </div>
      <span className="flex-grow-1 small">{item.label}</span>
      {isAccordion && (
        <i className={`bi bi-chevron-down small transition-icon ${isActive ? 'rotate-180' : ''}`}></i>
      )}
    </div>
  );

  return (
    <>
      {open && <div className="offcanvas-backdrop fade show d-lg-none" onClick={handleClose} style={{ zIndex: 2040 }}></div>}

      <aside className={`offcanvas offcanvas-end border-0 shadow-lg ${open ? "show" : ""}`}
        style={{ visibility: open ? "visible" : "hidden", zIndex: 2050, width: "300px" }}>

        <div className="d-flex flex-column h-100 bg-white shadow">
          {/* Header */}
          <div className="p-4 d-flex align-items-center justify-content-between border-bottom">
            <div>
              <h5 className="fw-bold mb-0 text-dark" style={{ letterSpacing: '-0.5px' }}>Drishtee</h5>
              <div className="text-uppercase text-muted fw-bold" style={{ fontSize: '10px', letterSpacing: '1px' }}>Admin Console</div>
            </div>
            <button type="button" className="btn-close shadow-none" onClick={handleClose}></button>
          </div>

          <div className="overflow-auto custom-scroll flex-grow-1 py-3">

            {/* MANAGEMENT SECTION */}
            <div className="px-4 text-uppercase text-muted fw-bold mb-2" style={{ fontSize: '11px' }}>Management</div>
            <NavLink to="/admin" end className="text-decoration-none">
              {({ isActive }) => <NavRow item={{ label: "Dashboard", icon: "bi-grid-fill", color: "#4CAF50" }} isActive={isActive} />}
            </NavLink>
            <NavLink to="/admin/admitted-student-list" className="text-decoration-none">
              {({ isActive }) => <NavRow item={{ label: "Admitted Students", icon: "bi-person-check-fill", color: "#2196F3" }} isActive={isActive} />}
            </NavLink>
            <NavLink to="/admin/students" className="text-decoration-none">
              {({ isActive }) => <NavRow item={{ label: "New Admissions", icon: "bi-person-plus-fill", color: "#FF9800" }} isActive={isActive} />}
            </NavLink>
            <NavLink to="/admin/clients-contacts" className="text-decoration-none">
              {({ isActive }) => <NavRow item={{ label: "Inbox (Queries)", icon: "bi-chat-left-dots-fill", color: "#9C27B0" }} isActive={isActive} />}
            </NavLink>

            {/* EXAMS ACCORDION */}
            <div className="accordion accordion-flush mt-1" id="examAcc">
              <div className="accordion-item border-0 bg-transparent">
                <NavRow item={{ label: "Examinations", icon: "bi-file-earmark-text-fill", color: "#F44336" }} isAccordion isActive={isExamActive} target="#examCollapse" />
                <div id="examCollapse" className={`collapse ${isExamActive ? "show" : ""}`} data-bs-parent="#examAcc">
                  <div className="ms-5 border-start ps-3 py-1 mt-1 d-flex flex-column gap-1">
                    <NavLink to="/admin/exams" className="sublink-item">Exam Dashboard</NavLink>
                    <NavLink to="/admin/exams/new" className="sublink-item">Launch New Exam</NavLink>
                    <NavLink to="/admin/exams/live-tracking" className="sublink-item">Live Tracking</NavLink>
                    <NavLink to="/admin/exams/completed" className="sublink-item">Reports & Results</NavLink>
                  </div>
                </div>
              </div>
            </div>

            {/* ATTENDANCE ACCORDION */}
            <div className="accordion accordion-flush mt-1" id="attAcc">
              <div className="accordion-item border-0 bg-transparent">
                <NavRow item={{ label: "Attendance", icon: "bi-calendar-check-fill", color: "#009688" }} isAccordion isActive={isAttendanceActive} target="#attCollapse" />
                <div id="attCollapse" className={`collapse ${isAttendanceActive ? "show" : ""}`} data-bs-parent="#attAcc">
                  <div className="ms-5 border-start ps-3 py-1 mt-1 d-flex flex-column gap-1">
                    <NavLink to="/admin/students/attendance" className="sublink-item">Daily Overview</NavLink>
                    <NavLink to="/admin/students/attendance/mark" className="sublink-item">Mark Attendance</NavLink>
                    <NavLink to="/admin/students/attendance/summary" className="sublink-item">Monthly Summary</NavLink>
                  </div>
                </div>
              </div>
            </div>

            {/* PRACTICE TEST ACCORDION */}
            <div className="accordion accordion-flush mt-1" id="practiceAcc">
              <div className="accordion-item border-0 bg-transparent">
                <NavRow
                  item={{
                    label: "Practice Tests",
                    icon: "bi-ui-checks-grid",
                    color: "#673AB7"
                  }}
                  isAccordion
                  isActive={isPracticeActive}
                  target="#practiceCollapse"
                />

                <div
                  id="practiceCollapse"
                  className={`collapse ${isPracticeActive ? "show" : ""}`}
                  data-bs-parent="#practiceAcc"
                >
                  <div
                    id="practiceCollapse"
                    className={`collapse ${isPracticeActive ? "show" : ""}`}
                    data-bs-parent="#practiceAcc"
                  >
                    <div className="ms-5 border-start ps-3 py-1 mt-1 d-flex flex-column gap-1">
                      {/* 1. Paper List & Management */}
                      <NavLink to="/admin/practice-tests" end className="sublink-item text-decoration-none">
                        <i className="bi bi-file-earmark-plus me-2"></i> Manage Papers
                      </NavLink>

                      {/* 2. Live Status */}
                      <NavLink to="/admin/practice-tests/live" className="sublink-item text-decoration-none">
                        <i className="bi bi-broadcast me-2"></i> Live Monitor
                      </NavLink>

                      {/* 3. Results */}
                      <NavLink to="/admin/practice-tests/results" className="sublink-item text-decoration-none">
                        <i className="bi bi-trophy me-2"></i> View Results
                      </NavLink>
                    </div>
                  </div>

                </div>
              </div>
            </div>


            {/* MARKETING SECTION */}
            <div className="px-4 text-uppercase text-muted fw-bold mt-4 mb-2" style={{ fontSize: '11px' }}>Marketing</div>
            <NavLink to="/admin/gallery" className="text-decoration-none">
              {({ isActive }) => <NavRow item={{ label: "Upload Media", icon: "bi-cloud-upload-fill", color: "#00BCD4" }} isActive={isActive} />}
            </NavLink>
            <NavLink to="/admin/all-images" className="text-decoration-none">
              {({ isActive }) => <NavRow item={{ label: "Gallery", icon: "bi-images", color: "#E91E63" }} isActive={isActive} />}
            </NavLink>
            <NavLink to="/admin/new-offers" className="text-decoration-none">
              {({ isActive }) => <NavRow item={{ label: "Promotions", icon: "bi-megaphone-fill", color: "#FF5722" }} isActive={isActive} />}
            </NavLink>

            {/* SYSTEM SECTION */}
            <div className="px-4 text-uppercase text-muted fw-bold mt-4 mb-2" style={{ fontSize: '11px' }}>System</div>
            <NavLink to="/admin/admin-list" className="text-decoration-none">
              {({ isActive }) => <NavRow item={{ label: "Admin List", icon: "bi-key-fill", color: "#607D8B" }} isActive={isActive} />}
            </NavLink>
            <NavLink to="/admin/visiters-list" className="text-decoration-none">
              {({ isActive }) => <NavRow item={{ label: "Visitor List", icon: "bi-people-fill", color: "#3F51B5" }} isActive={isActive} />}
            </NavLink>

          </div>

          {/* Footer Card */}
          <div className="p-3 border-top bg-light">
            <NavLink to="/admin/profile" className="d-flex align-items-center p-2 bg-white rounded-3 border text-decoration-none shadow-sm shadow-hover">
              <div className="bg-danger text-white rounded-2 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-person-fill fs-5"></i>
              </div>
              <div className="ms-3 flex-grow-1 overflow-hidden">
                <div className="fw-bold text-dark small text-truncate">Admin Account</div>
                <div className="text-muted" style={{ fontSize: '10px' }}>Settings & Privacy</div>
              </div>
              <i className="bi bi-chevron-right text-muted small"></i>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}