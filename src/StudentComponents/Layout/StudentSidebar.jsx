import React, { useEffect, useRef, memo } from "react";
import { NavLink } from "react-router-dom";
import { auth } from "../../firebase/firebase";

const MENU_ITEMS = [
  { to: "/student/dashboard", icon: "bi-grid-fill", label: "Dashboard", color: "#0866ff" },
  { to: "/student/exams", icon: "bi-file-earmark-medical-fill", label: "Main Exams", color: "#f3425f" },
  { to: "/student/practice-tests", icon: "bi-journal-check", label: "Practice Test", color: "#2abba7" },
  { to: "/student/profile", icon: "bi-person-badge-fill", label: "My Profile", color: "#1877f2" },
  { to: "/student/certificate", icon: "bi-award-fill", label: "Certificates", color: "#f7b928" },
  { to: "/student/account", icon: "bi-shield-lock-fill", label: "Privacy & Security", color: "#607d8b" },
];

const StudentSidebar = ({ open, setOpen }) => {
  const offcanvasRef = useRef(null);
  const bsOffcanvasInstance = useRef(null);

  useEffect(() => {
    const element = offcanvasRef.current;
    if (!element) return;

    // CDN script load hui hai ya nahi use safely check karne ke liye logic
    const bootstrapObj = window.bootstrap;
    if (!bootstrapObj || !bootstrapObj.Offcanvas) {
      console.warn("⚠️ Bootstrap CDN JS is missing or not loaded yet.");
      return;
    }

    // Har render par instance create hone se rokne ke liye single mutable reference hook use kiya
    if (!bsOffcanvasInstance.current) {
      bsOffcanvasInstance.current = bootstrapObj.Offcanvas.getOrCreateInstance(element);
    }

    // Toggle mechanism handles easily
    if (open) {
      bsOffcanvasInstance.current.show();
    } else {
      bsOffcanvasInstance.current.hide();
    }

    const handleClose = () => setOpen(false);
    element.addEventListener("hidden.bs.offcanvas", handleClose);

    return () => {
      element.removeEventListener("hidden.bs.offcanvas", handleClose);
    };
  }, [open, setOpen]);

  const SidebarContent = ({ isMobile }) => (
    <div className="d-flex flex-column vh-100 bg-white shadow-sm">
      <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
        <h2 className="h5 fw-bold mb-0 text-primary">Menu</h2>
        {isMobile && (
          <button
            type="button"
            className="btn-close"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          ></button>
        )}
      </div>

      <nav className="flex-grow-1 p-2 overflow-auto" aria-label="Student portal navigation">
        <div className="d-flex flex-column gap-1">
          {MENU_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `d-flex align-items-center p-3 rounded-3 text-decoration-none transition-all 
                ${isActive ? "bg-primary-subtle text-primary fw-bold" : "text-dark hover-bg-light"}`
              }
              onClick={() => isMobile && setOpen(false)}
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor: `${item.color}15`,
                  color: item.color
                }}
                aria-hidden="true"
              >
                <i className={`bi ${item.icon} fs-5`}></i>
              </div>
              <span className="ms-3">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-3 border-top">
        <button
          type="button"
          className="btn btn-light w-100 d-flex align-items-center p-2 rounded-3 border-0 text-danger fw-bold"
          onClick={() => auth.signOut()}
        >
          <div className="bg-danger-subtle rounded-circle p-2 me-3" aria-hidden="true">
            <i className="bi bi-box-arrow-right"></i>
          </div>
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="d-none d-lg-block border-end bg-white" style={{ width: "300px" }}>
        <SidebarContent isMobile={false} />
      </aside>

      {/* Mobile Drawer */}
      <div
        className="offcanvas offcanvas-start border-0"
        ref={offcanvasRef}
        tabIndex="-1"
        style={{ width: "100%" }}
        aria-modal="true"
        role="dialog"
      >
        <SidebarContent isMobile={true} />
      </div>
    </>
  );
};

export default memo(StudentSidebar);