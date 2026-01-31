import React from "react";
import { NavLink } from "react-router-dom";
import {
  Speedometer2,
  PersonCircle,
  X,
} from "react-bootstrap-icons";
import "./StudentLayout.css";

export default function StudentSidebar({ open, setOpen }) {
  const close = () => setOpen(false);

  return (
    <>
      {/* Backdrop */}
      {open && <div className="sidebar-backdrop" onClick={close} />}

      <div className={`student-sidebar mt-4 ${open ? "open" : "collapsed"}`}>
        {/* Header */}
        <div className="sidebar-header">
          <h6 className="mb-0">Student Panel</h6>
          <button className="icon-btn" onClick={close}>
            <X size={22} />
          </button>
        </div>

        {/* Links */}
        <NavLink
          to="/student/dashboard"
          end
          className="sidebar-item"
          onClick={close}
        >
          <Speedometer2 />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/student/dashboard/profile"
          className="sidebar-item"
          onClick={close}
        >
          <PersonCircle />
          <span>Profile</span>
        </NavLink>
      </div>
    </>
  );
}
