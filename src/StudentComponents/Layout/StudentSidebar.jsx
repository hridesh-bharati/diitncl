import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

export default function StudentSidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const offcanvasRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { to: "/student/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
    { to: "/student/profile", icon: "bi-person-circle", label: "My Profile" },
    { to: "/student/account", icon: "bi-gear", label: "Account" },
    { to: "/student/certificate", icon: "bi-award", label: "Certificate" },
  ];

  useEffect(() => {
    const element = offcanvasRef.current;
    if (!element) return;

    const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(element);
    if (open) bsOffcanvas.show();
    else bsOffcanvas.hide();

    const handleClose = () => setOpen(false);
    element.addEventListener("hidden.bs.offcanvas", handleClose);

    return () => element.removeEventListener("hidden.bs.offcanvas", handleClose);
  }, [open, setOpen]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const NavLinks = ({ isMobile = false }) => (
    <>
      {menuItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""} ${!isMobile && collapsed ? "justify-content-center" : ""}`
          }
          onClick={() => isMobile && setOpen(false)}
        >
          <i className={`bi ${item.icon}`} style={{ fontSize: "22px" }}></i>
          {(!collapsed || isMobile) && <span>{item.label}</span>}
        </NavLink>
      ))}
    </>
  );

  return (
    <>
      <div className={`d-none d-lg-flex flex-column vh-100 border-end p-3 desktop-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          {!collapsed && <h5 className="sidebar-brand mb-0 text-primary fw-bold">LMS Portal</h5>}
          <button className="btn btn-sm btn-light border" onClick={() => setCollapsed(!collapsed)}>
            <i className="bi bi-list" style={{ fontSize: "20px" }}></i>
          </button>
        </div>

        <nav className="flex-grow-1">
          <NavLinks />
        </nav>

        <div className="mt-auto pt-3 border-top">
          <button className={`logout-btn btn btn-danger w-100 ${collapsed ? "justify-content-center" : ""}`} onClick={handleLogout}>
            <i className="bi bi-box-arrow-right" style={{ fontSize: "22px" }}></i>
            {!collapsed && <span className="ms-2">Logout</span>}
          </button>
        </div>
      </div>

      <div className="offcanvas offcanvas-start d-lg-none mobile-sidebar" ref={offcanvasRef} tabIndex="-1">
        <div className="offcanvas-header border-bottom">
          <h5 className="fw-bold text-primary mb-0">LMS Portal</h5>
          <button type="button" className="btn-close" onClick={() => setOpen(false)} aria-label="Close"></button>
        </div>
        <div className="offcanvas-body d-flex flex-column p-3">
          <nav className="flex-grow-1">
            <NavLinks isMobile={true} />
          </nav>
          <div className="mt-auto border-top pt-3">
            <button className="btn btn-danger w-100 border-0" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right" style={{ fontSize: "22px" }}></i>
              <span>Logout Account</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}