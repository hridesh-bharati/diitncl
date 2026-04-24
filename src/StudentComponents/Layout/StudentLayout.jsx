import React, { useEffect, useState, useMemo } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import { getDoc, collection, query, where, doc, onSnapshot } from "firebase/firestore";
import StudentSidebar from "./StudentSidebar";

export default function StudentLayout() {
  const [open, setOpen] = useState(false);
  const [studentData, setStudentData] = useState({ name: "Student", pic: null });
  const [testCount, setTestCount] = useState(0);
  const location = useLocation();

  // Optimized Data Fetching (DRY)
  useEffect(() => {
    let unsubProfile, unsubAssigned;
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (!user?.email) return;
      const email = user.email.trim().toLowerCase();

      unsubProfile = onSnapshot(doc(db, "admissions", email), (snap) => {
        if (snap.exists()) setStudentData({ name: snap.data().name || "Student", pic: snap.data().photoUrl });
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
    { to: "/", icon: "bi-house", activeIcon: "bi-house-fill", label: "Home" },
    { to: "/student/dashboard", icon: "bi-grid", activeIcon: "bi-grid-fill", label: "Dashboard" },
    { to: "/student/practice-tests", icon: "bi-mortarboard", activeIcon: "bi-mortarboard-fill", label: "Tests", count: testCount },
    { to: "/student/account", icon: "bi-gear", activeIcon: "bi-gear-fill", label: "Settings" }
  ], [testCount]);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="d-flex vh-100 overflow-hidden bg-light">
      <StudentSidebar open={open} setOpen={setOpen} />

      <div className="d-flex flex-column flex-grow-1 min-vw-0">
        <header className="bg-white border-bottom sticky-top px-2 px-md-4 d-flex align-items-center justify-content-between" style={{ height: "65px" }}>
          
          {/* Logo - Hidden on very small screens to save space */}
          <div className="d-flex align-items-center d-none d-sm-block" style={{ flex: "1 1 0px" }}>
            <span className="fw-bold text-primary fs-5">DRISHTEE</span>
          </div>

          {/* Navigation - Responsive Gap & Size */}
          <nav className="d-flex align-items-center justify-content-center gap-1 gap-md-4" style={{ flex: "2 1 0px" }}>
            {navLinks.map((item) => {
              const active = isActive(item.to);
              return (
                <Link key={item.to} to={item.to} className={`d-flex flex-column align-items-center text-decoration-none  transition-all ${active ? "text-primary" : "text-secondary"}`} style={{ minWidth: "50px" }}>
                  <div className="position-relative">
                    <i className={`bi ${active ? item.activeIcon : item.icon}`} style={{ fontSize: "1.3rem" }}></i>
                    {item.count > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mt-1 border border-white">
                        {item.count}
                      </span>
                    )}
                  </div>
                  <span className="fw-bold d-md-block" style={{ fontSize: "0.6rem" }}>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Profile - Slimmer on Mobile */}
          <div className="d-flex align-items-center justify-content-end" style={{ flex: "1 1 0px" }}>
            <div className="d-flex align-items-center gap-2 p-1 rounded-pill border bg-light shadow-sm" onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
              <img src={studentData.pic || `https://ui-avatars.com/api/?name=${studentData.name}`} className="rounded-circle" style={{ width: 32, height: 32, objectFit: "cover" }} alt="p" />
              <i className="bi bi-list d-lg-none pe-1"></i> {/* Menu icon for mobile */}
              <span className="fw-semibold small d-none d-lg-inline text-dark pe-2">{studentData.name.split(" ")[0]}</span>
            </div>
          </div>
        </header>

        <main className="flex-grow-1 overflow-auto p-0 p-md-4">
          <Outlet />
        </main>
      </div>
    
    </div>
  );
}