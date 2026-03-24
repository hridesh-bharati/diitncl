import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ total: 0, today: 0, queries: 0 });

  useEffect(() => {
    const todayStr = new Date().toDateString();
    const unsubStudents = onSnapshot(collection(db, "admissions"), (snap) => {
      const todayCount = snap.docs.filter(doc => doc.data()?.createdAt?.toDate?.().toDateString() === todayStr).length;
      setCounts(prev => ({ ...prev, total: snap.size, today: todayCount }));
    });
    const unsubQueries = onSnapshot(collection(db, "studentQueries"), (snap) => {
      setCounts(prev => ({ ...prev, queries: snap.size }));
    });
    return () => { unsubStudents(); unsubQueries(); };
  }, []);

  const navItems = [
    { icon: "bi-house-door-fill", count: 0, bg: "bg-secondary", link: "/admin" },
    { icon: "bi-journal-check", count: 0, bg: "bg-secondary", link: "/admin/exams" },
    { icon: "bi-people-fill", count: counts.total, bg: "bg-primary", link: "/admin/admitted-student-list" },
    { icon: "bi-chat-left-dots-fill", count: counts.queries, bg: "bg-danger", link: "/admin/clients-contacts" },
    { icon: "bi-lightning-charge-fill", count: counts.today, bg: "bg-success", link: "/admin/students" }
  ];

  return (
    <div className="d-flex" style={{ width: "100%", overflowX: "hidden" }}>
      <AdminSidebar open={open} setOpen={setOpen} />

      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          background: "#f8f9fa",
          width: "100%",
          overflowX: "hidden"
        }}
      >
        <header
          className="bg-white border-bottom px-3 pt-1 d-flex align-items-center shadow-sm"
        >
          {/* Sidebar Toggle */}
          <button
            className="btn border-0 p-0 text-secondary"
            onClick={() => setOpen(true)}
          >
            <i className="bi bi-list fs-2"></i>
          </button>

          {/* Nav Icons */}
          <div className="d-flex align-items-center flex-grow-1 px-3 justify-content-between justify-content-md-end gap-md-5">
            {navItems.map((item, idx) => (
              <div
                key={idx}
                className="position-relative p-2"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(item.link)}
              >
                <i className={`bi ${item.icon} text-secondary fs-4`}></i>

                {item.count > 0 && (
                  <span
                    className="position-absolute top-0 mt-2 start-100 translate-middle badge rounded-pill bg-danger border border-white"
                    style={{ fontSize: "9px" }}
                  >
                    {item.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </header>

        <main
          className="flex-grow-1"
          style={{
            overflowX: "hidden",
            width: "100%"
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
