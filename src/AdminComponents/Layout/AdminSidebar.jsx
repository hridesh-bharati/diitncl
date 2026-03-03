import React from "react";
import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

const MENU_ITEMS = [
  { path: "/admin", label: "Dashboard", icon: "bi-grid-1x2-fill", end: true },
  { path: "/admin/admitted-student-list", label: "Admitted", icon: "bi-shield-check" },
  { path: "/admin/students", label: "Admissions", icon: "bi-person-plus-fill" },
  { path: "/admin/gallery", label: "Upload Media", icon: "bi-cloud-arrow-up-fill" },
  { path: "/admin/all-images", label: "Gallery", icon: "bi-images" },
  { path: "/admin/new-offers", label: "Promotions", icon: "bi-megaphone-fill" },
  { path: "/admin/delete-offers", label: "All Offers", icon: "bi-tags-fill" },
  { path: "/admin/clients-contacts", label: "Inbox", icon: "bi-chat-dots-fill" },
  { path: "/admin/admin-list", label: "Admin List", icon: "bi-lock-fill" },
  { path: "/admin/visiters-list", label: "Visitor List", icon: "bi-people-fill" },
];

export default function AdminSidebar({ open, setOpen }) {
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* iOS Backdrop with Blur */}
      {open && <div className="ios-backdrop position-fixed inset-0" onClick={handleClose} />}

      <aside className={`ios-sidebar position-fixed top-0 start-0 vh-100 ${open ? "open" : ""}`}>
        <div className="d-flex flex-column h-100">

          {/* Header */}
          <div className="p-4 pt-5 d-flex align-items-center justify-content-between">
            <div className="lh-sm">
              <span className="d-block h4 fw-bold mb-0 tracking-tight text-dark">Drishtee</span>
              <span className="small text-uppercase fw-bold text-muted opacity-50" style={{ fontSize: '10px', letterSpacing: '1px' }}>
                Admin Console
              </span>
            </div>
            <button className="btn btn-light rounded-circle p-0 py-5 mt-5 d-lg-none shadow-sm"
              style={{ width: '32px', height: '32px' }}
              onClick={handleClose}>
              <i className="bi bi-x"></i>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-grow-1 px-3 overflow-auto custom-scroll">
            <p className="small fw-bold text-muted ps-2 mb-2 opacity-50 text-uppercase" style={{ fontSize: '11px' }}>Main Menu</p>
            {MENU_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className="nav-link ios-link d-flex align-items-center p-2 px-3 mb-1 rounded-3"
                onClick={handleClose}
              >
                <i className={`bi ${item.icon} me-3 fs-5`}></i>
                <span className="flex-grow-1 fw-medium">{item.label}</span>
                <i className="bi bi-chevron-right small opacity-25"></i>
              </NavLink>
            ))}
          </nav>

          {/* Footer Profile */}
          <div className="p-3 border-top border-light-subtle">
            <NavLink to="/admin/profile"
              className="d-flex align-items-center p-2 rounded-4 text-decoration-none ios-profile-card shadow-sm border"
              onClick={handleClose}>
              <div className="fs-2 text-danger me-3 lh-1">
                <i className="bi bi-person-circle"></i>
              </div>
              <div className="lh-sm">
                <strong className="d-block text-dark small fw-bold">Admin Account</strong>
                <span className="text-muted" style={{ fontSize: '11px' }}>Settings & Privacy</span>
              </div>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}