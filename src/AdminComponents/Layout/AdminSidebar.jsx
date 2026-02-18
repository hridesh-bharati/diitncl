import React from "react";
import { NavLink } from "react-router-dom";
import {
  Grid1x2Fill,
  PeopleFill,
  Check2Circle,
  Images,
  ShieldLockFill,
  PersonCircle,
  XLg,
  ChatLeftText,
<<<<<<< HEAD
  Tag,
  List,
} from "react-bootstrap-icons"; // Added Tag & List for offers
=======
} from "react-bootstrap-icons";
>>>>>>> 2d3ad1377860588c75becbdcae6c9eb0d009857d
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
            <XLg size={18} />
          </button>
        </div>

        {/* Menu */}
        <div className="sidebar-menu">
          <NavLink to="/admin" end className="menu-link">
            <Grid1x2Fill /> Dashboard
          </NavLink>

          <NavLink to="/admin/admitted-student-list" className="menu-link">
            <Check2Circle /> Admitted
          </NavLink>

          <NavLink to="/admin/students" className="menu-link">
            <PeopleFill /> Students
          </NavLink>

          <NavLink to="/admin/gallery" className="menu-link">
            <Images /> Upload
          </NavLink>

          <NavLink to="/admin/all-images" className="menu-link">
            <Images /> Gallery
          </NavLink>

<<<<<<< HEAD
          <NavLink to="/admin/new-offers" className="menu-link">
            <Tag /> Offer
          </NavLink>

          <NavLink to="/admin/delete-offers" className="menu-link">
            <List /> All Offers
          </NavLink>
=======
>>>>>>> 2d3ad1377860588c75becbdcae6c9eb0d009857d

          <NavLink to="/admin/clients-contacts" className="menu-link">
            <ChatLeftText /> Contacts
          </NavLink>

          <NavLink to="/admin/admin-list" className="menu-link">
            <ShieldLockFill /> Admins List
          </NavLink>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <NavLink to="/admin/profile" className="profile-link">
            <PersonCircle size={28} />
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
