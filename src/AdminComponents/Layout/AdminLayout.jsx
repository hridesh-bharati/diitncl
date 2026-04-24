import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import useAdminCounts from "../../hooks/useAdminCounts";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { counts } = useAdminCounts();

  const navItems = [
    { icon: "bi-house-fill", label: "Home", count: 0, link: "/", color: "#4e73df" },
    { icon: "bi-speedometer2", label: "Dashboard", count: 0, link: "/admin", color: "#1cc88a" },
    { icon: "bi-calendar-check-fill", label: "New Adm", count: counts.today, link: "/admin/students", color: "#f6c23e" },
    { icon: "bi-people-fill", label: "Students", count: counts.total, link: "/admin/admitted-student-list", color: "#e74a3b" },
    { icon: "bi-file-text-fill", label: "Main Exams", count: counts.exams, link: "/admin/exams", color: "#36b9cc" },
    { icon: "bi-journal-text", label: "Test Paper", count: 0, link: "/admin/practice-tests", color: "#fd7e14" },
    { icon: "bi-chat-dots-fill", label: "Queries", count: counts.queries, link: "/admin/clients-contacts", color: "#6f42c1" },
    { icon: "bi-clipboard-check", label: "Attendance", count: 0, link: "/admin/students/attendance", color: "#20c997" },
  ];

  return (
    <div className="d-flex vh-100 overflow-hidden bg-primary-subtle">
      <AdminSidebar open={open} setOpen={setOpen} />

      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <header className="bg-white d-flex align-items-center justify-content-between sticky-top px-0 shadow-sm" style={{ zIndex: 1050, minHeight: "65px" }}>

          <nav className="d-flex align-items-center flex-grow-1 overflow-auto no-scrollbar py-1" style={{ scrollbarWidth: 'none' }}>
            {/* Mobile: gap-1 aur justify-content-start (jaisa pehle tha)
      PC (md): gap-md-5 aur justify-content-md-center (beech mein zyada space)
  */}
            <div className="d-flex gap-1 gap-md-5 px-2 w-100 justify-content-start justify-content-md-center">
              {navItems.map((item) => {
                const isActive = location.pathname === item.link;
                return (
                  <div key={item.link} onClick={() => navigate(item.link)} className="flex-shrink-0" style={{ cursor: "pointer" }}>
                    <div
                      className="d-flex flex-column flex-md-row align-items-center px-2 py-0 m-0 rounded-2 transition-all"
                      style={{
                        backgroundColor: isActive ? `${item.color}30` : "transparent",
                        borderBottom: `2.5px solid ${isActive ? item.color : 'transparent'}`
                      }}
                    >
                      <div className="position-relative mt-2 p-0">
                        <i className={`bi ${item.icon} fs-5`} style={{ color: isActive ? item.color : "#6c757d" }}></i>

                        {item.count > 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white border-2">
                            {item.count > 99 ? "99+" : item.count}
                          </span>
                        )}
                      </div>

                      <span className="ms-md-2 fw-bold text-center pt-lg-2" style={{ fontSize: "clamp(0.58rem, 1.1vw, 0.85rem)", color: isActive ? "#2d3436" : "#6c757d" }}>
                        {item.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </nav>

          <div className="ps-1 border-start">
            <button className="btn btn-light btn-sm rounded-circle shadow-sm" onClick={() => setOpen(true)}>
              <i className="bi bi-list fs-5"></i>
            </button>
          </div>
        </header>

        <main className="flex-grow-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}