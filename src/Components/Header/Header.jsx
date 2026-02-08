import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authListener, logoutUser, getUserRole } from "../../firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import GlobleSearchBox from "../GlobleSearch/GlobleSearchBox";
import RouteLinks from "../GlobleSearch/RouteLinks";
import LoginForm from "./LoginForm";
import "./Header.css";

export default function Header() {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null); // <-- Firestore student data
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState("student");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Sticky navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auth listener + fetch Firestore student profile
  useEffect(() => {
    const unsubscribe = authListener(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRole = await getUserRole(currentUser.uid);
        setRole(userRole);

        // Fetch Firestore student info for mobile header & bottom nav
        const q = query(collection(db, "admissions"), where("email", "==", currentUser.email.toLowerCase()));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setStudent({ id: snap.docs[0].id, ...snap.docs[0].data() });
        } else {
          setStudent(null);
        }

      } else {
        setUser(null);
        setRole(null);
        setStudent(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setIsMenuOpen(false);
    navigate("/");
  };

  if (loading) return null;

  return (
    <>
      {/* --- PC NAVBAR (DESKTOP) --- */}
      <nav className={`pc-nav small d-none d-lg-flex ${scrolled ? "pc-sticky" : ""}`}>
        <div className="pc-content">
          <Link to="/" className="pc-logo-box">
            <img src="/images/icon/logo.png" alt="Logo" />
          </Link>
          <div className="pc-menu">
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
            <Link to="/About" className={location.pathname === "/About" ? "active" : ""}>About</Link>
            <div className="dropdown pc-dropdown">
              <Link to="/OurCourses" className="dropdown-toggle" role="button" data-bs-toggle="dropdown">
                Courses
              </Link>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/OurCourses">All Computer Course</Link></li>
                <li><Link className="dropdown-item" to="/Certificate">Computer Certificate</Link></li>
                <li><Link className="dropdown-item" to="/ComputerLanguage">Computer Language</Link></li>
                <li><Link className="dropdown-item" to="/Designing">Graphics Design</Link></li>
                <li><Link className="dropdown-item" to="/WebDev">Web Development</Link></li>
                <li><Link className="dropdown-item" to="/CRepairing">Computer Repairing</Link></li>
                <li><Link className="dropdown-item" to="/Nielet">NIELIT Courses</Link></li>
                <li><Link className="dropdown-item" to="/Banking">Banking Course</Link></li>
              </ul>
            </div>
            <Link to="/Library" className={location.pathname === "/Library" ? "active" : ""}>Library</Link>
            <Link to="/Branch">Branch</Link>
            <div className="dropdown pc-dropdown">
              <Link to="/Student-Zone" className="dropdown-toggle" role="button" data-bs-toggle="dropdown">
                Student Zone
              </Link>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/new-admission">New Admission</Link></li>
                <li><Link className="dropdown-item" to="/Download-Certificate">Download Certificate</Link></li>
              </ul>
            </div>
            <Link to="/Gallery">Gallery</Link>
            <Link to="/Contact-us" className={location.pathname === "/Contact-us" ? "active" : ""}>Contact</Link>
          </div>
          <div className="pc-right">
            <GlobleSearchBox routes={RouteLinks} placeholder="Search anything..." />
            {!user && (
              <button className="pc-btn-log" onClick={() => setShowLoginModal(true)}>Login</button>
            )}
            {user && (
  <div className="pc-profile-dropdown dropdown">
    <img
      src={student?.photoUrl || user?.photoURL || "/images/icon/default-avatar.png"}
      className="pc-profile-pic rounded-circle"
      alt="profile"
      id="pcProfileDropdown"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      style={{ width: 40, height: 40, objectFit: "cover", cursor: "pointer" }}
    />
    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="pcProfileDropdown">
      <li>
        <Link
          className="dropdown-item d-flex align-items-center"
          to={role === "admin" ? "/admin" : "/student"}
        >
          <i className="bi bi-speedometer2 me-2"></i> Dashboard
        </Link>
      </li>
      <li>
        <button
          className="dropdown-item d-flex align-items-center"
          onClick={handleLogout}
        >
          <i className="bi bi-power me-2"></i> Logout
        </button>
      </li>
    </ul>
  </div>
)}

          </div>
        </div>
      </nav>

      {/* --- MOBILE TOP HEADER (CURVED) --- */}
      <header className="mobile-curved-top d-lg-none">
        <div className="mob-top-inner">
          <div className="d-flex">
            <img src="/images/icon/icon.webp" className="bg-white rounded-3 mob-logo-img" onClick={() => navigate("/")} alt="Logo" />
            <span className="ms-2 small">
              <p className="p-0 m-0 lh-0 text-white fw-bolder fs-6">Drishtee Computer Center</p>
              <p className="p-0 m-0 lh-0 text-white small">ISO 9001:2015 Certified</p>
            </span>
          </div>
          <div className="mob-top-actions d-flex align-items-center">
            <button className="mob-search-trigger" onClick={() => setIsSearchActive(true)}>
              <i className="bi bi-search"></i>
            </button>
            <button className="btn btn-sm fs-4 text-white">
              <i className="bi bi-geo-alt-fill fs-3"></i>
            </button>

            {!user && (
              <button className="btn text-white fs-3 m-0 p-0" onClick={() => setShowLoginModal(true)}>
                <i className="bi bi-person-circle"></i>
              </button>
            )}
            {user && student && (
              <button className="btn p-0" onClick={() => setIsMenuOpen(true)}>
                <img
                  src={student.photoUrl || "/images/icon/default-avatar.png"}
                  alt="Student"
                  className="rounded-circle"
                  style={{ width: 36, height: 36, objectFit: "cover", border: "2px solid white" }}
                />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* --- BLUE THEME SIDEBAR --- */}
      <div className={`blue-sidebar ${isMenuOpen ? "is-open" : ""}`}>
        <div className="sidebar-mask" onClick={() => setIsMenuOpen(false)}></div>
        <div className="sidebar-panel">
          <div className="sidebar-header-blue">
            <i className="bi bi-chevron-left" onClick={() => setIsMenuOpen(false)}></i>
            <span>Account & Menu</span>
          </div>

          <div className="sidebar-user-info">
            <div className="avatar-frame">
              <img src={student?.photoUrl || user?.photoURL || "/images/icon/default-avatar.png"} alt="user" />
            </div>
            <div className="user-text-info">
              <h4>{student?.name || user?.displayName || "Guest User"}</h4>
              <p>{user?.email || "Sign in to access Portal"}</p>
            </div>
          </div>

          <div className="sidebar-links-list">
            <p className="list-label">Academic Services</p>
            <Link to="/OurCourses" onClick={() => setIsMenuOpen(false)}><i className="bi bi-laptop"></i> Computer Courses</Link>
            <Link to="/new-admission" onClick={() => setIsMenuOpen(false)}><i className="bi bi-person-plus"></i> New Admission</Link>
            <Link to="/Verify-Certificate" onClick={() => setIsMenuOpen(false)}><i className="bi bi-patch-check"></i> Verify Certificate</Link>
            <Link to="/Student-Result" onClick={() => setIsMenuOpen(false)}><i className="bi bi-file-earmark-bar-graph"></i> Check Results</Link>

            <p className="list-label">Resources</p>
            <Link to="/Library" onClick={() => setIsMenuOpen(false)}><i className="bi bi-journal-code"></i> E-Notes & Books</Link>
            <Link to="/Gallery" onClick={() => setIsMenuOpen(false)}><i className="bi bi-images"></i> Center Gallery</Link>
            <Link to="/Contact-us" onClick={() => setIsMenuOpen(false)}><i className="bi bi-geo-alt"></i> Locate Center</Link>

            {user && (
              <div className="sidebar-auth-wrapper px-3 mt-4">
                <div className="d-grid gap-2">
                  <Link to="/admin" className="dr-sidebar-action-btn dr-bg-success">
                    <i className="bi bi-speedometer2"></i>
                    <span>Admin Dashboard</span>
                  </Link>
                  <button className="dr-sidebar-action-btn dr-bg-danger" onClick={handleLogout}>
                    <i className="bi bi-power"></i>
                    <span>Sign Out Account</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- BIGGER BOTTOM NAV (INSTA STYLE) --- */}
      <nav className="insta-bottom-nav d-lg-none">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          <i className="bi bi-house-door-fill"></i>
          <span>Home</span>
        </Link>
        <Link to="/About" className={location.pathname === "/About" ? "active" : ""}>
          <i className="bi bi-info-circle-fill"></i>
          <span>About</span>
        </Link>

        <div className="fab-call-container">
          <Link to="/Contact-us" className="fab-call-btn">
            <i className="bi bi-telephone-fill"></i>
          </Link>
        </div>

        <Link to="/Library" className={location.pathname === "/Library" ? "active" : ""}>
          <i className="bi bi-book-half"></i>
          <span>Library</span>
        </Link>

        <button onClick={() => setIsMenuOpen(true)} className={isMenuOpen ? "active" : ""}>
          {student?.photoUrl || user?.photoURL ? (
            <img src={student?.photoUrl || user?.photoURL} className="nav-profile-pic" alt="p" />
          ) : (
            <i className="bi bi-person-circle"></i>
          )}
          <span>Account</span>
        </button>
      </nav>

      {/* --- LOGIN MODAL --- */}
      {showLoginModal && (
        <div className="login-modal-overlay">
          <div className="login-modal-backdrop" onClick={() => setShowLoginModal(false)}></div>
          <div className="login-modal-card">
            <div className="modal-top-bar">
              <h5>Account Login</h5>
              <i className="bi bi-x-circle-fill" onClick={() => setShowLoginModal(false)}></i>
            </div>
            <div className="login-role-tabs">
              <button className={loginType === "student" ? "active" : ""} onClick={() => setLoginType("student")}>Student</button>
              <button className={loginType === "admin" ? "active" : ""} onClick={() => setLoginType("admin")}>Admin</button>
            </div>
            <LoginForm isAdminView={loginType === "admin"} onSuccess={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}

      {/* SEARCH LAYER */}
      {isSearchActive && (
        <div className="search-layer-full">
          <div className="search-bar-top">
            <i className="bi bi-arrow-left" onClick={() => setIsSearchActive(false)}></i>
            <GlobleSearchBox routes={RouteLinks} autoFocus onSelect={() => setIsSearchActive(false)} />
          </div>
        </div>
      )}
    </>
  );
}
