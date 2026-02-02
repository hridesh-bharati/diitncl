import React from "react";
import { NavLink } from "react-router-dom";
import {
  Speedometer2,
  PeopleFill,
  ClipboardCheckFill,
  PersonCircle,
  X,
  Images,
} from "react-bootstrap-icons";
import "./AdminSidebar.css";

export default function AdminSidebar({ open, setOpen }) {
  const handleNavClick = () => setOpen(false);

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={handleNavClick} />}

      <div className={`admin-sidebar mt-3 ${open ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <h6 className="mb-0">Drishtee Admin</h6>
          <button className="icon-btn" onClick={handleNavClick}>
            <X size={22} />
          </button>
        </div>

        <NavLink to="/admin" end className="sidebar-item" onClick={handleNavClick}>
          <Speedometer2 />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/admissions" className="sidebar-item" onClick={handleNavClick}>
          <ClipboardCheckFill />
          <span>Admissions</span>
        </NavLink>

        <NavLink to="/admin/students" className="sidebar-item" onClick={handleNavClick}>
          <PeopleFill />
          <span>Students</span>
        </NavLink>

        <NavLink to="/admin/gallery" className="sidebar-item" onClick={handleNavClick}>
          <Images />
          <span>Gallery</span>
        </NavLink>

        <NavLink to="/admin/profile" className="sidebar-item" onClick={handleNavClick}>
          <PersonCircle />
          <span>Admin Profile</span>
        </NavLink>
      </div>
    </>
  );
}
