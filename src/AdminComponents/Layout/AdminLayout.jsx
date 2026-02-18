import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { List } from "react-bootstrap-icons";
import AdminSidebar from "./AdminSidebar";
import "./AdminLayout.css";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-layout">
      <AdminSidebar open={open} setOpen={setOpen} />

      <div className="admin-main">
        <div className="admin-topbar">
          <button className="icon-btn btn" onClick={() => setOpen(true)}>
            <List size={24} />
          </button>
          <h6 className="mb-0 ms-2">Drishtee Admin Panel</h6>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
