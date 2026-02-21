import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import GlobleSearchBox from "../GlobleSearch/GlobleSearchBox";
import RouteLinks from "../GlobleSearch/RouteLinks";
import LoginForm from "./LoginForm";
import "./Header.css";
import { Button } from "react-bootstrap";
import { ChatDots } from "react-bootstrap-icons";

export default function Header() {
  const { user, student, role, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState("student");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  // Get display name and photo
  const displayName = student?.name || user?.displayName || "Guest Student";
  const photoUrl = student?.photoUrl || user?.photoURL || "/images/icon/default-avatar.png";
  const userEmail = user?.email || "Academic Portal";

  return (
    <>
      {/* --- PC NAVBAR --- */}
      <nav className={`pc-nav small d-none d-lg-flex ${scrolled ? "pc-sticky" : ""}`}>
        <div className="pc-content">

          <Link to="/" className="pc-logo-box">
            <img src="/images/icon/logo.png" alt="Drishtee Computer Center Logo" />
          </Link>

          <div className="pc-menu">

            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>

            <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>
              About
            </Link>

            {/* COURSES */}
            <div className="dropdown pc-dropdown">
              <Link
                to="/courses"
                className={`dropdown-toggle ${location.pathname.startsWith("/courses") ? "active" : ""}`}
                role="button"
                data-bs-toggle="dropdown"
              >
                Courses
              </Link>

              <ul className="dropdown-menu shadow-lg border-0">
                <li><Link className="dropdown-item" to="/courses">All Courses</Link></li>
                <li><Link className="dropdown-item" to="/certificate">Computer Certificate</Link></li>
                <li><Link className="dropdown-item" to="/courses/computer-language">Computer Language</Link></li>
                <li><Link className="dropdown-item" to="/courses/designing">Graphics Design</Link></li>
                <li><Link className="dropdown-item" to="/courses/web-development">Web Development</Link></li>
                <li><Link className="dropdown-item" to="/courses/nielit">NIELIT Courses</Link></li>
                <li><Link className="dropdown-item" to="/courses/banking">Banking Course</Link></li>
              </ul>
            </div>

            <Link to="/library" className={location.pathname === "/library" ? "active" : ""}>
              Library
            </Link>

            <Link
              to="/branch/thoothibari"
              className={location.pathname.startsWith("/branch") ? "active" : ""}
            >
              Branch
            </Link>

            {/* STUDENT ZONE */}
            <div className="dropdown pc-dropdown">
              <Link
                to="#"
                className="dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
              >
                Student Zone
              </Link>

              <ul className="dropdown-menu shadow-lg border-0">
                <li><Link className="dropdown-item" to="/new-admission">New Admission</Link></li>
                <li><Link className="dropdown-item" to="/download-certificate">Download Certificate</Link></li>
              </ul>
            </div>

            <Link to="/gallery" className={location.pathname === "/gallery" ? "active" : ""}>
              Gallery
            </Link>

            <Link to="/contact-us" className={location.pathname === "/contact-us" ? "active" : ""}>
              Contact
            </Link>
          </div>

          <div className="pc-right d-flex">
            <GlobleSearchBox routes={RouteLinks} placeholder="Search anything..." />

            {!user ? (
              <button className="pc-btn-log ms-3" onClick={() => setShowLoginModal(true)}>
                Login
              </button>
            ) : (
              <div className="pc-profile-dropdown dropdown ms-3">
                <img
                  src={photoUrl}
                  className="pc-profile-pic rounded-circle shadow-sm"
                  alt="profile"
                  id="pcProfileDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ width: 40, height: 40, objectFit: "cover", cursor: "pointer" }}
                />
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0">
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center"
                      to={isAdmin ? "/admin" : "/student"}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* LOCATION BUTTON */}
          <button
            className="icon-btn-circle bg-danger"
            onClick={() => navigate("/branch/nichlaul/location")}
          >
            <i className="bi bi-geo-alt-fill"></i>
          </button>

          {/* CHAT BUTTON */}
          {user && (
            <Button
              variant="primary"
              className="rounded-pill d-flex align-items-center gap-2 mx-1 btn-lg"
              onClick={() => navigate("/chat")}
            >
              <ChatDots /> IM
            </Button>
          )}

        </div>
      </nav>

      {/* --- MOBILE TOP BAR --- */}
      <header className="app-top-bar d-lg-none">
        <div className="app-top-content">
          <div className="app-brand me-1" onClick={() => navigate("/")}>
            <img src="/images/icon/icon.webp" className="app-logo-mini" alt="Logo" />
            <div className="app-brand-text">
              <h1 className="m-0">DRISHTEE</h1>
              <span>ISO 9001:2015 Certified</span>
            </div>
          </div>
          <div className="app-top-actions d-flex">
            <button className="icon-btn-circle me-2" onClick={() => setIsSearchActive(true)}>
              <i className="bi bi-search"></i>
            </button>
            <button className="icon-btn-circle" onClick={() => navigate("/branch/nichlaul/location")}>
              <i className="bi bi-geo-alt-fill"></i>
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBILE DRAWER --- */}
      <div className={`app-drawer ${isMenuOpen ? "active" : ""}`}>
        <div className="drawer-overlay" onClick={() => setIsMenuOpen(false)}></div>
        <div className="drawer-content">
          <div className="drawer-handle"></div>

          {/* User Profile Card */}
          <Link
            to={isAdmin ? "/admin" : "/student"}
            onClick={() => setIsMenuOpen(false)}
            className="text-decoration-none"
          >
            <div className="drawer-user-card shadow-sm">
              <div className="d-flex align-items-center gap-3">
                <div className="user-avatar-lg">
                  <img src={photoUrl} alt="user" className="rounded-circle" />
                </div>
                <div>
                  <h3 className="mb-0 fs-5 fw-bold">{displayName}</h3>
                  <span className="text-muted">
                    Dashboard <i className="bi bi-arrow-right"></i>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <div className="drawer-body px-1">
            {/* Quick Action Grid */}
            <div className="row g-3 mb-4 text-center">
              <div className="col-4">
                <Link to="/download-certificate" onClick={() => setIsMenuOpen(false)} className="text-decoration-none">
                  <div className="card border-0 shadow-sm rounded-4 py-3 h-100">
                    <i className="bi bi-patch-check-fill fs-2 text-info mb-2"></i>
                    <span className="fw-semibold text-secondary small">Verify</span>
                  </div>
                </Link>
              </div>
              <div className="col-4">
                <Link to="/library" onClick={() => setIsMenuOpen(false)} className="text-decoration-none">
                  <div className="card border-0 shadow-sm rounded-4 py-3 h-100">
                    <i className="bi bi-book-half fs-2 text-warning mb-2"></i>
                    <span className="fw-semibold text-secondary small">Library</span>
                  </div>
                </Link>
              </div>

              {user ? <>
                <div className="col-4">
                  <div
                    className="card border-0 shadow-sm rounded-4 py-3 d-flex flex-column align-items-center justify-content-center h-100"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/chat")}
                  >
                    <ChatDots className="fs-2 text-info mb-2" />
                    <span className="fw-semibold text-secondary small">Group Chat</span>
                  </div>
                </div>
              </> : <>
                <div className="col-4">
                  <a href="https://wa.me/919918151032" className="text-decoration-none">
                    <div className="card border-0 shadow-sm rounded-4 py-3 h-100">
                      <i className="bi bi-whatsapp fs-2 text-success mb-2"></i>
                      <span className="fw-semibold text-secondary small">Support</span>
                    </div>
                  </a>
                </div>
              </>}
            </div>

            {/* Nav Sections */}
            <div className="drawer-section">
              <label>Academic Hub</label>
              <Link to="/courses" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-mortarboard-fill"></i> <span>Explore Courses</span>
              </Link>
              <Link to="/gallery" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-images"></i> <span>Campus Gallery</span>
              </Link>
              <Link to="/new-admission" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-person-plus"></i> <span>New Admission</span>
              </Link>
            </div>

            <div className="drawer-section mt-3">
              <label>Information</label>
              <Link to="/about" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-info-circle"></i> <span>About Center</span>
              </Link>

              <Link to="/branch/thoothibari" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-geo-alt"></i> <span>Our Branches</span>
              </Link>
              <Link to="/contact-us" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-envelope"></i> <span>Contact Us</span>
              </Link>
            </div>

            {/* Social Media */}
            <div className="social-footer-mobile d-flex justify-content-center gap-4 mt-4 py-2">
              <a href="#" className="soc-link rounded pt-3 rounded-4fb"><i className="bi btn text-white bi-facebook"></i></a>
              <a href="#" className="soc-link rounded pt-3 rounded-4yt"><i className="bi btn text-white bi-youtube"></i></a>
              <a href="#" className="soc-link rounded pt-3 rounded-4ig"><i className="bi btn text-white bi-instagram"></i></a>
            </div>

            {/* Footer Actions */}
            <div className="drawer-footer my-4">
              {user ? (
                <div className="d-grid gap-2">
                  <button onClick={handleLogout} className="btn btn-outline-danger py-3 rounded-4 border-2 fw-bold">
                    Sign Out
                  </button>
                </div>
              ) : (
                <button onClick={() => { setShowLoginModal(true); setIsMenuOpen(false); }} className="btn btn-primary w-100 py-3 rounded-4 shadow-sm">
                  Login to Account
                </button>
              )}
              <p className="text-center text-muted mt-3 small">© 2026 Drishtee Computer Center • v2.4.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE BOTTOM TAB BAR --- */}
      <nav className="app-tab-bar d-lg-none">

        <Link to="/" className={`tab-item ${location.pathname === "/" ? "active" : ""}`}>
          <div className="icon-wrapper">
            <i className={location.pathname === "/" ? "bi bi-house-door-fill" : "bi bi-house-door"}></i>
          </div>
          <span>Home</span>
        </Link>

        <Link
          to="/courses"
          className={`tab-item ${location.pathname.startsWith("/courses") ? "active" : ""}`}
        >
          <div className="icon-wrapper">
            <i className={location.pathname.startsWith("/courses") ? "bi bi-mortarboard-fill" : "bi bi-mortarboard"}></i>
          </div>
          <span>Courses</span>
        </Link>

        <div className="tab-fab-wrapper">
          <Link to="/gallery" className="tab-fab">
            <i className="bi bi-camera-fill"></i>
          </Link>
        </div>

        <Link
          to="/library"
          className={`tab-item ${location.pathname === "/library" ? "active" : ""}`}
        >
          <div className="icon-wrapper">
            <i className={location.pathname === "/library" ? "bi bi-book-half" : "bi bi-book"}></i>
          </div>
          <span>Library</span>
        </Link>

        <button
          onClick={() => setIsMenuOpen(true)}
          className={`tab-item border-0 bg-transparent ${isMenuOpen ? "active" : ""}`}
        >
          <div className="nav-profile-frame">
            <img src={photoUrl} alt="profile" />
          </div>
          <span>Account</span>
        </button>

      </nav>
      {/* --- LOGIN MODAL --- */}
      {showLoginModal && (
        <div className="app-modal-container active">
          <div className="app-modal-blur" onClick={() => setShowLoginModal(false)}></div>
          <div className="app-modal-card p-0 p-lg-3">
            <div className="modal-top-line"></div>
            <div className="modal-header border-0">
              <h2 className="fw-bold fs-4 p-3">Welcome Back</h2>
              <button className="btn-close px-5" onClick={() => setShowLoginModal(false)}></button>
            </div>
            <div className="app-role-tabs mb-4">
              <button className={loginType === "student" ? "active" : ""} onClick={() => setLoginType("student")}>
                Student
              </button>
              <button className={loginType === "admin" ? "active" : ""} onClick={() => setLoginType("admin")}>
                Admin
              </button>
            </div>
            <LoginForm
              isAdminView={loginType === "admin"}
              onSuccess={() => setShowLoginModal(false)}
            />
          </div>
        </div>
      )}

      {/* --- SEARCH OVERLAY --- */}
      {isSearchActive && (
        <div className="app-search-overlay">
          <div className="search-header">
            <i className="bi bi-arrow-left fs-3" onClick={() => setIsSearchActive(false)}></i>
            <div className="flex-grow-1">
              <GlobleSearchBox routes={RouteLinks} autoFocus onSelect={() => setIsSearchActive(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}