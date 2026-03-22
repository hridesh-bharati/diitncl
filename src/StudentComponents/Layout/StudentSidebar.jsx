// src/StudentComponents/Layout/StudentSidebar.jsx
import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function StudentSidebar({ open, setOpen }) {
  const offcanvasRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);

  // Menu items kept exactly as before
  const menuItems = [
    { to: "/student/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
    { to: "/student/exams", icon: "bi-journal-check", label: "Examinations" }, 
    { to: "/student/profile", icon: "bi-person-circle", label: "My Profile" },
    { to: "/student/certificate", icon: "bi-award", label: "Certificates" },
    { to: "/student/account", icon: "bi-gear", label: "Settings" },
  ];

  // Bootstrap Offcanvas instance management
  useEffect(() => {
    const element = offcanvasRef.current;
    if (!element) return;
    const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(element);
    open ? bsOffcanvas.show() : bsOffcanvas.hide();
    
    const handleClose = () => setOpen(false);
    element.addEventListener("hidden.bs.offcanvas", handleClose);
    return () => element.removeEventListener("hidden.bs.offcanvas", handleClose);
  }, [open, setOpen]);

  // Reusable NavLinks component for Desktop & Mobile
  const NavLinks = ({ isMobile = false }) => (
    <div className="d-flex flex-column gap-1">
      {menuItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => 
            `sidebar-item text-decoration-none d-flex align-items-center p-3 rounded-3 transition-all ${
              isActive ? "bg-primary text-white shadow-sm active" : "text-dark hover-bg-light"
            } ${!isMobile && collapsed ? "justify-content-center" : ""}`
          }
          onClick={() => isMobile && setOpen(false)}
        >
          <i className={`bi ${item.icon} fs-5`}></i>
          {(!collapsed || isMobile) && <span className="ms-3 fw-medium">{item.label}</span>}
        </NavLink>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - No Encoding needed here */}
      <div 
        className={`d-none d-lg-flex flex-column vh-100 border-end bg-white shadow-sm desktop-sidebar ${collapsed ? "collapsed" : ""}`} 
        style={{ width: collapsed ? '80px' : '280px', transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 1 }}
      >
        <div className="p-3 d-flex justify-content-between align-items-center border-bottom" style={{ height: '70px' }}>
          {!collapsed && <h5 className="fw-bold mb-0 text-primary animate__animated animate__fadeIn">DRISHTEE LMS</h5>}
          <button className="btn btn-light btn-sm rounded-circle border-0" onClick={() => setCollapsed(!collapsed)}>
            <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-list'} fs-5`}></i>
          </button>
        </div>
        
        <nav className="flex-grow-1 p-3 mt-2 overflow-auto custom-scrollbar">
          <NavLinks />
        </nav>

        <div className="p-3 border-top">
          <button 
            className={`btn btn-outline-danger w-100 border-0 d-flex align-items-center ${collapsed ? 'justify-content-center' : ''}`} 
            onClick={() => auth.signOut()}
          >
            <i className="bi bi-box-arrow-right fs-5"></i> 
            {!collapsed && <span className="ms-3 fw-bold">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Offcanvas */}
      <div 
        className="offcanvas offcanvas-start border-0" 
        ref={offcanvasRef} 
        tabIndex="-1" 
        style={{ width: '280px', zIndex: 1055 }}
      >
        <div className="offcanvas-header border-bottom bg-primary text-white py-4">
          <div>
            <h6 className="fw-bold mb-0 text-uppercase">Student Portal</h6>
            <small className="opacity-75">Drishtee Computer Centre</small>
          </div>
          <button type="button" className="btn-close btn-close-white shadow-none" onClick={() => setOpen(false)}></button>
        </div>
        <div className="offcanvas-body p-3 bg-light">
          <NavLinks isMobile={true} />
          <div className="mt-5 p-2 border-top pt-4 text-center">
            <button className="btn btn-danger w-100 rounded-pill py-2 shadow-sm fw-bold" onClick={() => auth.signOut()}>
              <i className="bi bi-power me-2"></i> Logout Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}