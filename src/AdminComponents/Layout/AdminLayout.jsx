import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import AdminSidebar from "./AdminSidebar";
import "./AdminLayout.css";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ total: 0, today: 0, queries: 0 });

  useEffect(() => {
    const todayStr = new Date().toDateString();

    const unsubStudents = onSnapshot(collection(db, "admissions"), (snap) => {
      const todayCount = snap.docs.filter(doc =>
        doc.data().createdAt?.toDate?.().toDateString() === todayStr
      ).length;
      setCounts(prev => ({ ...prev, total: snap.size, today: todayCount }));
    });

    const unsubQueries = onSnapshot(collection(db, "studentQueries"), (snap) => {
      setCounts(prev => ({ ...prev, queries: snap.size }));
    });

    return () => { unsubStudents(); unsubQueries(); };
  }, []);

  const navItems = [
    { icon: "bi-people-fill", count: counts.total, bg: "bg-primary", link: "/admin/admitted-student-list" },
    { icon: "bi-chat-left-text-fill", count: counts.queries, bg: "bg-danger", link: "/admin/clients-contacts" },
    { icon: "bi-lightning-charge-fill", count: counts.today, bg: "bg-success", link: "/admin/students" }
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar open={open} setOpen={setOpen} />

      <div className="admin-main">
        <div className="admin-topbar d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            {/* Sidebar Toggle */}
            <button className="icon-btn btn p-0 border-0 shadow-none" onClick={() => setOpen(true)}>
              <i className="bi bi-list" style={{ fontSize: "24px" }}></i>
            </button>

            {/* Home Button Icon */}
            <button
              className="btn p-0 border-0 shadow-none ms-3 d-flex align-items-center"
              onClick={() => navigate("/admin")} // Change path based on your dashboard route
              style={{ color: "#64748b" }}
              title="Go to Dashboard"
            >
              <i className="bi bi-house-door-fill" style={{ fontSize: "20px" }}></i>
              <h6 className="mb-0 ms-2 fw-bold text-dark"></h6>
            </button>
          </div>

          <div className="topbar-notifications d-flex gap-2">
            {navItems.map((item, idx) => (
              <div key={idx} className="top-notify-icon" onClick={() => navigate(item.link)}>
                <i className={`bi ${item.icon}`}></i>
                {item.count > 0 && <span className={`top-badge ${item.bg}`}>{item.count}</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}