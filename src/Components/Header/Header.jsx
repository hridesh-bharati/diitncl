import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoginForm from "./LoginForm";
import { authListener, logoutUser, getUserRole } from "../../firebase/auth";

import GlobleSearchBox from "../GlobleSearch/GlobleSearchBox";
import RouteLinks from "../GlobleSearch/RouteLinks";
import HeaderProgressBar from "./HeaderProgressBar";

export default function Header() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // detect current dashboard
  const isOnAdminDashboard = location.pathname.startsWith("/admin/dashboard");
  const isOnStudentDashboard = location.pathname.startsWith("/student/dashboard");

  // 🔐 Auth listener
  useEffect(() => {
    const unsubscribe = authListener(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const r = await getUserRole(currentUser.uid);
        setRole(r);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setRole(null);
    navigate("/");
  };

  const closeOffcanvas = () => {
    document.getElementById("loginOffcanvasCloseBtn")?.click();
  };

  if (loading) return null;

  const courses = [
    { path: "/OurCourses", name: "All Computer Course" },
    { path: "/Certificate", name: "Computer Certificate" },
    { path: "/ComputerLanguage", name: "Computer Language" },
    { path: "/Designing", name: "Graphics Design" },
    { path: "/WebDev", name: "Web Development" },
    { path: "/CRepairing", name: "Computer Repairing" },
    { path: "/Nielet", name: "NIELIT Courses" },
    { path: "/Banking", name: "Banking Course" },
  ];

  const studentZoneItems = [
    // { path: "/admin/admissions", name: "New Admission" },
    { path: "/Download-Certificate", name: "Download Certificate" },
  ];

  return (
    <>
      <nav
        className="navbar navbar-expand-lg fixed-top py-0 my-0 d-flex justify-content-center align-items-center"
        id="TopNavBar"
      >
        <div className="container-fluid fw-medium text-uppercase" id="ToperNav">
          <Link className="navbar-brand p-0" to="/">
            <img src="images/icon/logo.png" width={30} alt="DIIT" />
          </Link>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav w-100 ms-auto d-flex justify-content-around align-items-center MobileNav">
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><Link to="/About" className="nav-link">About</Link></li>

              <li className="nav-item dropdown">
                <Link className="nav-link" to="/OurCourses" data-bs-toggle="dropdown">
                  Courses
                </Link>
                <ul className="dropdown-menu">
                  {courses.map((c, i) => (
                    <li key={i}>
                      <Link className="dropdown-item" to={c.path}>{c.name}</Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li><Link to="/Library" className="nav-link">Library</Link></li>
              <li><Link to="/Branch" className="nav-link">Branch</Link></li>
              <li><Link to="/Gallery" className="nav-link">Gallery</Link></li>

              <li className="nav-item dropdown">
                <Link className="nav-link" to="/StudentZone" data-bs-toggle="dropdown">
                  Student Zone
                </Link>
                <ul className="dropdown-menu">
                  {studentZoneItems.map((s, i) => (
                    <li key={i}>
                      <Link className="dropdown-item" to={s.path}>{s.name}</Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li><Link to="/Contact-us" className="nav-link">Contact</Link></li>

              <li style={{ minWidth: 200 }}>
                <GlobleSearchBox routes={RouteLinks} />
              </li>
            </ul>
          </div>

          {/* ===== RIGHT SIDE ===== */}
          <div className="d-flex align-items-center">
            {!user ? (
              <>
                <button
                  className="btn btn-sm text-white mx-1"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#loginSideBar"
                  onClick={() => setIsAdminView(false)}
                >
                  Student
                </button>

                <button
                  className="btn btn-sm text-white mx-1"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#loginSideBar"
                  onClick={() => setIsAdminView(true)}
                >
                  Admin
                </button>
              </>
            ) : (
              <>
                {role === "admin" && !isOnAdminDashboard && (
                  <button
                    className="btn btn-sm btn-warning mx-1"
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Dashboard
                  </button>
                )}

                {role === "student" && !isOnStudentDashboard && (
                  <button
                    className="btn btn-sm btn-warning mx-1"
                    onClick={() => navigate("/student/dashboard")}
                  >
                    Dashboard
                  </button>
                )}

                <button
                  className="btn btn-sm btn-danger mx-1"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="bi bi-three-dots-vertical text-light"></span>
            </button>
          </div>

          <HeaderProgressBar />
        </div>
      </nav>

      {/* ===== OFFCANVAS LOGIN ===== */}
      <div className="offcanvas offcanvas-end shadow mt-4" id="loginSideBar">
        <div className="offcanvas-header">
          <h5>{isAdminView ? "Admin Login" : "Student Login"}</h5>
          <button
            id="loginOffcanvasCloseBtn"
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
          />
        </div>

        <div className="offcanvas-body p-0">
          <LoginForm
            isAdminView={isAdminView}
            onSuccess={closeOffcanvas}
            hideSignup={isAdminView}
          />
        </div>
      </div>
    </>
  );
}
