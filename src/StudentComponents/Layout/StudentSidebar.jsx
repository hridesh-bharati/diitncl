// src/StudentComponents/Layout/StudentSidebar.jsx
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function StudentSidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const offcanvasRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { to: "/student/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
    { to: "/student/exams", icon: "bi-journal-check", label: "Examinations" }, 
    { to: "/student/profile", icon: "bi-person-circle", label: "My Profile" },
    { to: "/student/certificate", icon: "bi-award", label: "Certificates" },
    { to: "/student/account", icon: "bi-gear", label: "Settings" },
  ];

  useEffect(() => {
    const element = offcanvasRef.current;
    if (!element) return;
    const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(element);
    open ? bsOffcanvas.show() : bsOffcanvas.hide();
    const handleClose = () => setOpen(false);
    element.addEventListener("hidden.bs.offcanvas", handleClose);
    return () => element.removeEventListener("hidden.bs.offcanvas", handleClose);
  }, [open, setOpen]);

  const NavLinks = ({ isMobile = false }) => (
    <>
      {menuItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""} ${!isMobile && collapsed ? "justify-content-center" : ""}`}
          onClick={() => isMobile && setOpen(false)}
        >
          <i className={`bi ${item.icon}`} style={{ fontSize: "20px" }}></i>
          {(!collapsed || isMobile) && <span className="ms-3">{item.label}</span>}
        </NavLink>
      ))}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`d-none d-lg-flex flex-column vh-100 border-end bg-white desktop-sidebar ${collapsed ? "collapsed" : ""}`} style={{ width: collapsed ? '80px' : '260px', transition: '0.3s' }}>
        <div className="p-3 d-flex justify-content-between align-items-center border-bottom">
          {!collapsed && <h6 className="fw-bold mb-0 text-primary">DRISHTEE LMS</h6>}
          <button className="btn btn-sm" onClick={() => setCollapsed(!collapsed)}><i className="bi bi-list fs-5"></i></button>
        </div>
        <nav className="flex-grow-1 p-2 mt-2"><NavLinks /></nav>
        <div className="p-3 border-top">
          <button className="btn btn-danger w-100 rounded-0 py-2" onClick={() => auth.signOut()}>
            <i className="bi bi-box-arrow-right"></i> {!collapsed && "Logout"}
          </button>
        </div>
      </div>

      {/* Mobile Offcanvas */}
      <div className="offcanvas offcanvas-start border-0" ref={offcanvasRef} tabIndex="-1" style={{ width: '280px' }}>
        <div className="offcanvas-header border-bottom bg-primary text-white">
          <h6 className="fw-bold mb-0">STUDENT PORTAL</h6>
          <button type="button" className="btn-close btn-close-white" onClick={() => setOpen(false)}></button>
        </div>
        <div className="offcanvas-body p-2 bg-light">
          <NavLinks isMobile={true} />
          <div className="mt-4 p-2 border-top">
            <button className="btn btn-danger w-100 rounded-0 py-2" onClick={() => auth.signOut()}>Logout Account</button>
          </div>
        </div>
      </div>
    </>
  );
}