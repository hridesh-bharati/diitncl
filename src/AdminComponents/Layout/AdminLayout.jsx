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
    { icon: "bi-house-fill", label: "Home", count: 0, link: "/" },
    { icon: "bi-speedometer2", label: "Dashboard", count: 0, link: "/admin" },
    { icon: "bi-calendar-check-fill", label: "New Adm", count: counts.today, link: "/admin/students" },
    { icon: "bi-people-fill", label: "Students", count: counts.total, link: "/admin/admitted-student-list" },
    { icon: "bi-file-text-fill", label: "Main Exams", count: counts.exams, link: "/admin/exams" },
    { icon: "bi-journal-text", label: "Test Paper", count: 0, link: "/admin/practice-tests" },
    { icon: "bi-chat-dots-fill", label: "Queries", count: counts.queries, link: "/admin/clients-contacts" },
    { icon: "bi-clipboard-check", label: "Attendance", count: 0, link: "/admin/students/attendance" },
  ];

  return (
    <div className="d-flex vh-100 overflow-hidden bg-primary-subtle">
      <AdminSidebar open={open} setOpen={setOpen} />

      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Header Height control ki hai py-1 se */}
        <header className="bg-white d-flex align-items-center sticky-top shadow-sm px-2 py-1" style={{ zIndex: 1050, minHeight: "60px" }}>

          <nav className="d-flex align-items-center flex-grow-1 overflow-auto no-scrollbar" style={{ scrollbarWidth: 'none' }}>
            <div className="d-flex gap-2 gap-md-4 w-100 justify-content-start justify-content-md-center align-items-center">
              {navItems.map((item) => {
                const isActive = location.pathname === item.link;
                return (
                  <div
                    key={item.link}
                    onClick={() => navigate(item.link)}
                    className={`flex-shrink-0 px-2 py-1 rounded-3 transition-all ${isActive ? 'bg-primary bg-opacity-10 border-bottom border-primary border-3' : ''}`}
                    style={{ cursor: "pointer", transition: "0.3s" }}
                  >
                    {/* gap-1 (Mobile) aur gap-md-2 (Desktop) use kiya hai */}
                    <div className="d-flex flex-column flex-md-row align-items-center gap-1 gap-md-2">
                      <div className="position-relative d-flex align-items-center">
                        <i className={`bi ${item.icon} ${isActive ? 'text-primary' : 'text-dark'}`} style={{ fontSize: "1.1rem" }}></i>

                        {item.count > 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white border-1"
                            style={{ fontSize: "0.55rem", padding: "2px 4px" }}>
                            {item.count > 99 ? "99+" : item.count}
                          </span>
                        )}
                      </div>

                      <span className={`fw-bold text-dark ${isActive ? 'opacity-100' : 'opacity-75'}`} style={{ fontSize: "0.7rem" }}>
                        {item.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </nav>

          <div className="ps-2 border-start">
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