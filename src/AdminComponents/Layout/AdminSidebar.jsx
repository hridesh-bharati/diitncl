import React from "react";
import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

export default function AdminSidebar({ open, setOpen }) {
  const closeSidebar = () => setOpen(false);

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={closeSidebar} />}

      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">D</div>
            <div>
              <div className="brand-title">Drishtee</div>
              <div className="brand-sub">Admin Panel</div>
            </div>
          </div>

          <button className="close-btn" onClick={closeSidebar}>
            {/* XLg Icon replacement */}
            <i className="bi bi-x-lg" style={{ fontSize: "18px" }}></i>
          </button>
        </div>

        {/* Menu */}
        <div className="sidebar-menu">
          <NavLink to="/admin" end className="menu-link">
            <i className="bi bi-grid-1x2-fill"></i> Dashboard
          </NavLink>

          <NavLink to="/admin/admitted-student-list" className="menu-link">
            <i className="bi bi-check2-circle"></i> Admitted
          </NavLink>

          <NavLink to="/admin/students" className="menu-link">
            <i className="bi bi-people-fill"></i> New Admissions
          </NavLink>

          <NavLink to="/admin/gallery" className="menu-link">
            <i className="bi bi-images"></i> Upload
          </NavLink>

          <NavLink to="/admin/all-images" className="menu-link">
            <i className="bi bi-images"></i> Gallery
          </NavLink>

          <NavLink to="/admin/new-offers" className="menu-link">
            <i className="bi bi-tag"></i> Offer
          </NavLink>

          <NavLink to="/admin/delete-offers" className="menu-link">
            <i className="bi bi-list"></i> All Offers
          </NavLink>

          <NavLink to="/admin/clients-contacts" className="menu-link">
            <i className="bi bi-chat-left-text"></i> Contacts
          </NavLink>

          <NavLink to="/admin/admin-list" className="menu-link">
            <i className="bi bi-shield-lock-fill"></i> Admins List
          </NavLink>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <NavLink to="/admin/profile" className="profile-link">
            {/* PersonCircle replacement */}
            <i className="bi bi-person-circle" style={{ fontSize: "28px" }}></i>
            <div>
              <div className="profile-name">Admin Account</div>
              <div className="profile-sub">Manage Profile</div>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
}