import React, { useEffect, useState, useMemo } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import {getDoc , collection, query, where, doc, onSnapshot } from "firebase/firestore";
import StudentSidebar from "./StudentSidebar";

export default function StudentLayout() {
  const [open, setOpen] = useState(false);
  const [studentData, setStudentData] = useState({ name: "Student", pic: null });
  const location = useLocation();
  const [testCount, setTestCount] = useState(0);
const [stats, setStats] = useState({
  completed: 0,
  pending: 0,
});
  // DRY Navigation Config
  const navLinks = useMemo(() => [
    {
      to: "/",
      icon: "bi-house",
      activeIcon: "bi-house-fill",
      label: "Home",
      count: 0
    },
    {
      to: "/student/dashboard",
      icon: "bi-grid",
      activeIcon: "bi-grid-fill",
      label: "Dashboard",
      count: 0
    },
    {
      to: "/student/practice-tests",
      icon: "bi-mortarboard",
      activeIcon: "bi-mortarboard-fill",
      label: "Tests",
      count: testCount
    },
    {
      to: "/student/account",
      icon: "bi-gear",
      activeIcon: "bi-gear-fill",
      label: "Settings",
      count: 0
    }
  ], [testCount]);
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user?.email) return;

      return onSnapshot(
        doc(db, "admissions", user.email.trim().toLowerCase()),
        (snap) => {
          if (snap.exists()) {
            const { name, photoUrl } = snap.data();
            setStudentData({ name: name || "Student", pic: photoUrl });
          }
        }
      );
    });

    return unsubscribeAuth;
  }, []);

useEffect(() => {
  const unsub = auth.onAuthStateChanged((user) => {
    if (!user?.email) return;

    const email = user.email.toLowerCase();

    const unsubAssigned = onSnapshot(
      query(collection(db, "practiceAssigned"), where("studentId", "==", email)),
      async (snap) => {

        let completed = 0;

        const checks = snap.docs.map(async (d) => {
          const tId = d.data().testId;
          if (!tId) return;

          const resultRef = doc(db, "practiceResults", `${email}_${tId}`);
          const resultSnap = await getDoc(resultRef);

          if (resultSnap.exists() && resultSnap.data().status === "Completed") {
            completed++;
          }
        });

        await Promise.all(checks);

        setTestCount(completed); // ✅ EXACT SAME AS PAGE
      }
    );

    return unsubAssigned;
  });

  return unsub;
}, []);


  const toggleSidebar = () => setOpen((prev) => !prev);
  const isActive = (path) => location.pathname === path;

  return (
    <div className="d-flex vh-100 overflow-hidden bg-light">
      <StudentSidebar open={open} setOpen={setOpen} />

      <div className="d-flex flex-column flex-grow-1 min-vw-0">

        {/* HEADER */}
        <header className="bg-white border-bottom sticky-top px-2 px-md-4 d-flex align-items-center justify-content-between" style={{ height: "65px" }}>

          {/* LEFT */}
          <div className="d-flex align-items-center">
            <button onClick={toggleSidebar} className="btn btn-light rounded-circle d-lg-none me-2">
              <i className="bi bi-list fs-4"></i>
            </button>

            <Link to="/" className="text-decoration-none d-none d-md-block">
              <span className="fw-bold text-primary fs-4">DRISHTEE</span>
            </Link>
          </div>

          {/* CENTER NAV */}
          <nav className="d-flex align-items-center justify-content-center flex-grow-1 gap-2 gap-md-4">
            {navLinks.map((item) => {
              const active = isActive(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  className={`d-flex flex-column align-items-center justify-content-center px-2 py-1 text-decoration-none position-relative
          ${active ? "text-primary" : "text-secondary"}
        `}
                >
                  <div className="position-relative">
                    <i className={`bi ${active ? item.activeIcon : item.icon} fs-4`}></i>

                    {/* COUNT BADGE */}
                    {item.count > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: "10px" }}
                      >
                        {item.count}
                      </span>
                    )}
                  </div>

                  {/* LABEL */}
                  <span className="small fw-semibold mt-1 d-none d-md-block">
                    {item.label}
                  </span>

                  {/* ACTIVE LINE */}
                  {active && (
                    <div className="w-100 mt-1" style={{ height: "3px", background: "#0d6efd", borderRadius: "10px" }}></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT PROFILE */}
          <div className="d-flex align-items-center">
            <div
              className="d-flex align-items-center gap-2 px-lg-2 py-lg-1 rounded-pill border bg-white shadow-sm"
              role="button"
              onClick={toggleSidebar}
            >
              <img
                src={
                  studentData.pic ||
                  `https://ui-avatars.com/api/?name=${studentData.name}&background=4361ee&color=fff`
                }
                alt="profile"
                className="rounded-circle"
                style={{ width: 34, height: 34, objectFit: "cover" }}
              />
              <span className="fw-semibold small d-none d-lg-inline text-dark">
                {studentData.name.split(" ")[0]}
              </span>
            </div>
          </div>

        </header>

        {/* MAIN */}
        <main className="flex-grow-1 overflow-auto">
          <div className="container-fluid p-0 m-0">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}