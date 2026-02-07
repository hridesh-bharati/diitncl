import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Grid1x2Fill,
  PeopleFill,
  Check2Circle,
  Images,
  ShieldLockFill,
  PersonCircle,
  XLg,
} from "react-bootstrap-icons";
import "./AdminSidebar.css";

export default function AdminSidebar({ open, setOpen }) {
  const location = useLocation();

  // Mobile par click karte hi sidebar band ho jaye
  const handleNavClick = () => {
    if (window.innerWidth < 992) setOpen(false);
  };

  return (
    <>
      {/* FB Style Glass Backdrop */}
      {open && <div className="fb-sidebar-backdrop" onClick={() => setOpen(false)} />}

      <aside className={`jio-sidebar ${open ? "is-open" : "is-collapsed"}`}>
        <div className="sidebar-flex-wrapper">
          
          {/* Header: Jio Style */}
          <div className="sidebar-header-jio">
            <div className="brand-logo-jio">
              <div className="gradient-box">D</div>
              <div className="brand-name-stack">
                <span className="brand-title">Drishtee</span>
                <span className="brand-status">Online Admin</span>
              </div>
            </div>
            <button className="fb-close-btn d-lg-none" onClick={() => setOpen(false)}>
              <XLg size={18} />
            </button>
          </div>

          {/* Navigation: Meta Style Grouping */}
          <div className="sidebar-scrollable-content">
            <div className="nav-group-meta">
              <label className="group-label">FAVORITES</label>
              <NavLink to="/admin" end className="meta-nav-link" onClick={handleNavClick}>
                <Grid1x2Fill className="nav-icon" />
                <span>Dashboard</span>
              </NavLink>
            </div>

            <div className="nav-group-meta">
              <label className="group-label">STUDENT HUB</label>
              <NavLink to="/admin/admitted-student-list" className="meta-nav-link" onClick={handleNavClick}>
                <Check2Circle className="nav-icon" />
                <span>Admitted List</span>
              </NavLink>
              <NavLink to="/admin/students" className="meta-nav-link" onClick={handleNavClick}>
                <PeopleFill className="nav-icon" />
                <span>Status Manager</span>
              </NavLink>
            </div>

            <div className="nav-group-meta">
              <label className="group-label">RESOURCES</label>
              <NavLink to="/admin/gallery" className="meta-nav-link" onClick={handleNavClick}>
                <Images className="nav-icon" />
                <span>Gallery</span>
              </NavLink>
              <NavLink to="/admin/admin-list" className="meta-nav-link" onClick={handleNavClick}>
                <ShieldLockFill className="nav-icon" />
                <span>Admin Settings</span>
              </NavLink>
            </div>
          </div>

          {/* Footer: FB Style Profile */}
          <div className="sidebar-footer-fb">
            <NavLink to="/admin/profile" className="profile-card-fb" onClick={handleNavClick}>
              <div className="avatar-wrapper">
                <PersonCircle size={32} className="text-primary" />
                <div className="online-status"></div>
              </div>
              <div className="profile-info">
                <span className="profile-name">Admin Account</span>
                <span className="profile-link">Manage Profile</span>
              </div>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}