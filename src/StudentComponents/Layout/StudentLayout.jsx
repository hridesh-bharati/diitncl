// src\StudentComponents\Layout\StudentLayout.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import { getDoc, collection, query, where, doc, onSnapshot } from "firebase/firestore";
import StudentSidebar from "./StudentSidebar";

export default function StudentLayout() {
  const [open, setOpen] = useState(false);
  const [studentData, setStudentData] = useState({ name: "Student", pic: null });
  const [testCount, setTestCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Data Fetching
  useEffect(() => {
    let unsubProfile, unsubAssigned;
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (!user?.email) return;
      const email = user.email.trim().toLowerCase();

      unsubProfile = onSnapshot(doc(db, "admissions", email), (snap) => {
        if (snap.exists()) {
          setStudentData({
            name: snap.data().name || "Student",
            pic: snap.data().photoUrl || null
          });
        }
      });

      unsubAssigned = onSnapshot(query(collection(db, "practiceAssigned"), where("studentId", "==", email)), async (snap) => {
        let completed = 0;
        const checks = snap.docs.map(async (d) => {
          const resSnap = await getDoc(doc(db, "practiceResults", `${email}_${d.data().testId}`));
          if (resSnap.exists() && resSnap.data().status === "Completed") completed++;
        });
        await Promise.all(checks);
        setTestCount(completed);
      });
    });

    return () => { unsubAuth(); unsubProfile?.(); unsubAssigned?.(); };
  }, []);

  const navLinks = useMemo(() => [
    { to: "/student/dashboard", icon: "bi-grid", activeIcon: "bi-grid-fill", label: "Dashboard" },
    { to: "/student/practice-tests", icon: "bi-journal-text", activeIcon: "bi-journal-check", label: "Tests", count: testCount },
    { to: "/", icon: "bi-house", activeIcon: "bi-house-fill", label: "Home" },
  ], [testCount]);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="d-flex bg-light" style={{ height: "100vh" }}>
      <StudentSidebar open={open} setOpen={setOpen} />

      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* HEADER */}
        <header className="bg-white border-bottom px-3 d-flex align-items-center justify-content-between sticky-top" style={{ height: "62px" }}>

          {/* LEFT: Mobile Menu & Brand */}
          <div className="d-flex align-items-center gap-2" style={{ flex: 1 }}>
            <button className="btn border-0 d-lg-none p-0" onClick={() => setOpen(true)}>
              <i className="bi bi-list fs-3"></i>
            </button>
            <div className="d-none d-sm-flex align-items-center">
              <div className="bg-primary rounded-3 d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: 38, height: 38, fontSize: "14px" }}>
                D
              </div>
              <div className="ms-2 lh-sm">
                <div className="fw-bold text-dark" style={{ fontSize: "14px" }}>DRISHTEE</div>
                <small className="text-muted" style={{ fontSize: "11px" }}>Student Panel</small>
              </div>
            </div>
          </div>

          {/* CENTER: Navigation Pill */}
          <nav className="d-flex bg-light rounded-pill p-1 gap-1 border">
            {navLinks.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-decoration-none px-3 py-2 rounded-pill d-flex align-items-center gap-2 small fw-semibold ${
                    active ? "bg-primary text-white shadow-sm" : "text-secondary"
                  }`}
                >
                  <div className="position-relative d-inline-flex align-items-center">
                    <i className={`bi ${active ? item.activeIcon : item.icon}`} style={{ fontSize: "16px" }}></i>

                    {/* BADGE */}
                    {item.count > 0 && (
                      <span
                        className={`position-absolute top-0 start-100 translate-middle badge rounded-pill border ${
                          active ? "bg-white text-primary border-primary" : "bg-danger text-white border-white"
                        }`}
                        style={{
                          fontSize: "9px",
                          padding: "2px 5px",
                          transform: "translate(-20%, -30%)"
                        }}
                      >
                        {item.count}
                      </span>
                    )}
                  </div>
                  <span className="d-none d-md-inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Profile Info */}
          <div
            className="d-flex align-items-center justify-content-end gap-2"
            style={{ flex: 1, cursor: "pointer" }}
            onClick={() => navigate("/student/profile")}
          >
            <div className="text-end d-none d-md-block lh-sm">
              <div className="fw-semibold text-dark text-truncate" style={{ fontSize: "13px", maxWidth: "120px" }}>
                {studentData.name}
              </div>
              <small className="text-muted" style={{ fontSize: "11px" }}>Student</small>
            </div>
            <img
              src={studentData.pic || `https://ui-avatars.com/api/?background=0D6EFD&color=fff&name=${studentData.name}`}
              alt="profile"
              className="rounded-circle border"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
          </div>

        </header>

        {/* PAGE CONTENT */}
        <main className="flex-grow-1 overflow-auto p-0 p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}