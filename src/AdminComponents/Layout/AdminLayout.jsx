// src/AdminComponents/Layout/AdminLayout.jsx

import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import useAdminCounts from "../../hooks/useAdminCounts";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { counts } = useAdminCounts();

  // Navigation items
  const navItems = [
    { icon: "bi-house-fill", label: "Dashboard", count: 0, link: "/admin" },
    { icon: "bi-journal-bookmark-fill", label: "Notes", count: counts.notes || 0, link: "/admin/notes/upload" },
    { icon: "bi-file-text-fill", label: "Exams", count: counts.exams, link: "/admin/exams" },
    { icon: "bi-people-fill", label: "Students", count: counts.total, link: "/admin/admitted-student-list" },
    { icon: "bi-chat-dots-fill", label: "Queries", count: counts.queries, link: "/admin/clients-contacts" },
    { icon: "bi-calendar-check-fill", label: "Today", count: counts.today, link: "/admin/students" },
    { icon: "bi-plus-circle-fill", label: "Create Post", count: 0, link: "/admin/gallery" },
  ];

  return (
    <div className="d-flex vh-100 overflow-hidden bg-light">
      <AdminSidebar open={open} setOpen={setOpen} />

      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Header */}
        <header
          className="bg-white border-bottom d-flex align-items-center justify-content-between sticky-top p-2 shadow-sm"
          style={{ zIndex: 1050, minHeight: "60px" }}
        >
          {/* Nav items */}
          <div className="d-flex align-items-center flex-grow-1 overflow-auto p-0 pt-1" style={{ scrollbarWidth: 'none' }}>
            <div className="d-flex gap-1 gap-md-5">
              {navItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0"
                  onClick={() => navigate(item.link)}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className={`position-relative d-flex align-items-center px-3 py-1 rounded-pill ${location.pathname === item.link
                        ? "bg-secondary-subtle text-dark shadow-sm"
                        : "text-secondary"
                      }`}
                  >
                    <div className="position-relative">
                      <i className={`bi ${item.icon} fs-5`}></i>
                      {item.count > 0 && (
                        <span
                          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light"
                          style={{ fontSize: "0.6rem" }}
                        >
                          {item.count > 99 ? "99+" : item.count}
                        </span>
                      )}
                    </div>
                    <span className="d-none d-md-block ms-2 small fw-bold">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar toggle */}
          <div className="ps-1 border-start">
            <button className="btn btn-light rounded-circle" onClick={() => setOpen(true)}>
              <i className="bi bi-list fs-5"></i>
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow-1 overflow-auto">
          <div className="container-fluid p-0 m-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}