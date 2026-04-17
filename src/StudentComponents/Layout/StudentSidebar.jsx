import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function StudentSidebar({ open, setOpen }) {
  const offcanvasRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { to: "/student/dashboard", icon: "bi-grid-fill", label: "Dashboard", color: "#4CAF50" },
    { to: "/student/exams", icon: "bi-file-earmark-text-fill", label: "Main Exams", color: "#F44336" },
    { to: "/student/practice-tests", icon: "bi-ui-checks-grid", label: "Practice Test", color: "#673AB7" },
    { to: "/student/profile", icon: "bi-person-circle", label: "My Profile", color: "#2196F3" },
    { to: "/student/certificate", icon: "bi-award-fill", label: "Certificates", color: "#FF9800" },
    { to: "/student/account", icon: "bi-gear-fill", label: "Settings", color: "#607D8B" },
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

  const SidebarContent = ({ isMobile }) => {
    const showLabel = !collapsed || isMobile;

    return (
      <div className="d-flex flex-column vh-100 bg-white">
        {/* Sidebar Header */}
        <div className={`p-3 d-flex align-items-center justify-content-between ${isMobile ? 'bg-primary text-white py-4 shadow-sm' : 'border-bottom'}`} style={{ minHeight: "70px" }}>
          {showLabel && (
            <div className="animate__animated animate__fadeIn">
              <h6 className="fw-bold mb-0">{isMobile ? "STUDENT PORTAL" : "DRISHTEE LMS"}</h6>
              {isMobile && <small className="opacity-75">Online Learning System</small>}
            </div>
          )}
          <button
            className={`btn btn-sm border-0 ${isMobile ? 'btn-close btn-close-white' : 'btn-light rounded-circle shadow-sm'}`}
            onClick={() => isMobile ? setOpen(false) : setCollapsed(!collapsed)}
          >
            {!isMobile && <i className={`bi bi-chevron-${collapsed ? 'right' : 'left'}`}></i>}
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-grow-1 p-3 overflow-auto custom-scrollbar">
          <div className="d-flex flex-column gap-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `d-flex align-items-center p-3 rounded-3 text-decoration-none transition-all 
                  ${isActive ? "bg-primary text-white shadow-sm" : "text-dark hover-bg-light"} 
                  ${!showLabel ? "justify-content-center px-0" : ""}`
                }
                onClick={() => isMobile && setOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <i
                      className={`bi ${item.icon} fs-5`}
                      style={{ 
                        color: isActive ? "white" : item.color,
                        minWidth: "25px",
                        textAlign: "center"
                      }}
                    ></i>
                    {showLabel && <span className="ms-3 fw-medium text-nowrap">{item.label}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-top bg-light">
          <button
            className={`btn w-100 d-flex align-items-center border-0 shadow-sm ${isMobile ? 'btn-danger rounded-pill py-2' : 'btn-outline-danger'} ${!showLabel ? "justify-content-center px-0" : ""}`}
            onClick={() => auth.signOut()}
          >
            <i className="bi bi-box-arrow-right fs-5"></i>
            {showLabel && <span className="ms-3 fw-bold">Logout</span>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <aside
        className="d-none d-lg-block border-end bg-white shadow-sm position-sticky top-0 vh-100"
        style={{ width: collapsed ? "80px" : "280px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", zIndex: 1050 }}
      >
        <SidebarContent isMobile={false} />
      </aside>

      <div className="offcanvas offcanvas-start border-0 shadow" ref={offcanvasRef} tabIndex="-1" 
       style={{
          width: window.innerWidth < 576 ? "100%" : "300px"
        }}>
        <SidebarContent isMobile={true} />
      </div>
    </>
  );
}