import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import GlobleSearchBox from "../GlobleSearch/GlobleSearchBox";
import RouteLinks from "../GlobleSearch/RouteLinks";
import LoginForm from "./LoginForm";
import "./Header.css";

export default function Header() {
  const { user, student, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState("student");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Helper for active links
  const isActive = (path) => (location.pathname === path ? "active" : "");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const userData = useMemo(() => ({
    name: student?.name || user?.displayName || "Guest Student",
    photo: student?.photoUrl || user?.photoURL || "/images/icon/default-avatar.png",
    dashboard: isAdmin ? "/admin" : "/student"
  }), [student, user, isAdmin]);

  const courseLinks = [
    { to: "/courses", label: "All Courses" },
    { to: "/certificate", label: "Computer Certificate" },
    { to: "/courses/computer-language", label: "Computer Language" },
    { to: "/courses/designing", label: "Graphics Design" },
    { to: "/courses/web-development", label: "Web Development" },
    { to: "/courses/nielit", label: "NIELIT Courses" },
    { to: "/courses/banking", label: "Banking Course" },
  ];

  return (
    <>
      {/* --- PC NAVBAR --- */}
      <nav className={`pc-nav d-none d-lg-flex ${scrolled ? "pc-sticky" : ""}`} aria-label="Main Navigation">
        <div className="pc-content">
          <Link to="/" className="pc-logo-box me-1">
            <img src="/images/icon/logo.png" alt="Drishtee Logo" />
          </Link>

          <div className="pc-menu">
            <Link to="/" className={isActive("/")}>Home</Link>
            <Link to="/about" className={isActive("/about")}>About</Link>

            <div className="dropdown pc-dropdown dropdown-toggle ">
              <Link to="/courses" className={`dropdown-toggle ${location.pathname.startsWith("/courses") ? "active" : ""}`} data-bs-toggle="dropdown">
                Courses
              </Link>
              <ul className="dropdown-menu  shadow-lg border-0">
                {courseLinks.map((link) => (
                  <li key={link.to}><Link className="dropdown-item" to={link.to}>{link.label}</Link></li>
                ))}
              </ul>
            </div>

            <Link to="/library" className={isActive("/library")}>Library</Link>
            <Link to="/branch/thoothibari" className={location.pathname.startsWith("/branch") ? "active" : ""}>Branch</Link>

            <div className="dropdown pc-dropdown">
              <button className="btn dropdown-toggle fw-semibold text-secondary border-0 bg-transparent p-0" data-bs-toggle="dropdown">
                Student Zone
              </button>
              <ul className="dropdown-menu shadow-lg border-0">
                <li><Link className="dropdown-item" to="/new-admission">New Admission</Link></li>
                <li><Link className="dropdown-item" to="/download-certificate">Download Certificate</Link></li>
              </ul>
            </div>

            <Link to="/gallery" className={isActive("/gallery")}>Gallery</Link>
            <Link to="/contact-us" className={isActive("/contact-us")}>Contact</Link>
          </div>

          <div className="pc-right d-flex align-items-center">
            <GlobleSearchBox routes={RouteLinks} placeholder="Search anything..." />

            {!user ? (
              <button className="pc-btn-log " onClick={() => setShowLoginModal(true)}>Login</button>
            ) : (
              <div className="pc-profile-dropdown dropdown ">
                <img src={userData.photo} className="pc-profile-pic" alt="Profile" data-bs-toggle="dropdown" />
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0">
                  <li><Link className="dropdown-item" to={userData.dashboard}>Dashboard</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            )}

            {user && (
              <button
                className="btn btn-primary rounded-pill d-flex align-items-center gap-2"
                onClick={() => navigate("/chat")}
              >
                <span>IM</span>
              </button>
            )}

            <button className="icon-btn-circle text-danger " onClick={() => navigate("/branch/nichlaul/location")} title="Our Location">
              <i className="bi bi-geo-alt-fill"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE TOP BAR --- */}
      <header className="app-top-bar d-lg-none">
        <div className="app-top-content">
          <div className="app-brand me-1" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
            <img src="/images/icon/icon.webp" className="app-logo-mini" alt="Drishtee Icon" />
            <div className="app-brand-text">
              <h1 className="m-0 text-white">DRISHTEE</h1>
              <span>ISO 9001:2015 Certified</span>
            </div>
          </div>
          <div className="app-top-actions d-flex gap-2">
            <button className="icon-btn-circle" onClick={() => setIsSearchActive(true)}><i className="bi bi-search"></i></button>
            <button className="icon-btn-circle" onClick={() => navigate("/branch/nichlaul/location")}><i className="bi bi-geo-alt-fill"></i></button>
          </div>
        </div>
      </header>

      {/* --- MOBILE DRAWER --- */}
      <div className={`app-drawer ${isMenuOpen ? "active" : ""}`}>
        <div className="drawer-overlay" onClick={() => setIsMenuOpen(false)}></div>
        <div className="drawer-content">
          <div className="drawer-handle"></div>

          <Link to={userData.dashboard} onClick={() => setIsMenuOpen(false)} className="text-decoration-none">
            <div className="drawer-user-card shadow-sm">
              <div className="d-flex align-items-center gap-3">
                <img src={userData.photo} alt={userData.name} className="rounded-circle border border-3 border-white shadow-sm" width="65" height="65" />
                <div>
                  <h3 className="mb-0 fs-5 fw-bold text-dark">{userData.name}</h3>
                  <span className="text-muted small">Go to Dashboard <i className="bi bi-arrow-right"></i></span>
                </div>
              </div>
            </div>
          </Link>

          <div className="drawer-body px-1">
            <div className="row g-3 mb-4 text-center">
              {[
                { to: "/download-certificate", icon: "bi-patch-check-fill", label: "Verify", color: "text-info" },
                { to: "/library", icon: "bi-book-half", label: "Library", color: "text-warning" },
                { to: "/chat", icon: "bi-chat-dots-fill", label: "Group Chat", color: "text-info" }].map((item, idx) => (
                  <div className="col-4" key={idx}>
                    <Link to={item.to} onClick={() => setIsMenuOpen(false)} className="text-decoration-none h-100">
                      <div className="card border-0 shadow-sm rounded-4 py-3 h-100">
                        {typeof item.icon === 'string' ? <i className={`bi ${item.icon} fs-2 ${item.color} mb-2`}></i> : item.icon}
                        <span className="fw-semibold text-secondary small">{item.label}</span>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
            <div className="drawer-section">
              <label>Academic Hub</label>
              {[
                { to: "/courses", icon: "bi-mortarboard-fill", label: "Explore Courses" },
                { to: "/gallery", icon: "bi-images", label: "Campus Gallery" },
                { to: "/new-admission", icon: "bi-person-plus", label: "New Admission" }
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="drawer-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className={`bi ${link.icon}`}></i>
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="drawer-section mt-4">
              <label>Information</label>
              {[
                { to: "/about", icon: "bi-info-circle-fill", label: "About Center" },
                { to: "/branch/thoothibari", icon: "bi-geo-alt-fill", label: "Our Branches" },
                { to: "/Contact-us", icon: "bi-envelope-fill", label: "Contact Us" }
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="drawer-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className={`bi ${link.icon}`}></i>
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="social-footer-mobile py-4 rounded-4 mt-3">
              <div className="d-flex justify-content-center gap-4">
                {[
                  { name: "facebook", color: "#1877F2" },
                  { name: "youtube", color: "#FF0000" },
                  { name: "instagram", color: "#E4405F" }
                ].map((p) => (
                  <a key={p.name} href={`#${p.name}`} className="social-icon d-flex align-items-center justify-content-center" style={{ backgroundColor: p.color }}>
                    <i className={`bi bi-${p.name}`}></i>
                  </a>
                ))}
              </div>
            </div>

            <div className="drawer-footer my-4 px-2">
              {user ? (
                <button onClick={handleLogout} className="btn btn-outline-danger w-100 py-3 rounded-4 border-2 fw-bold">Sign Out</button>
              ) : (
                <button onClick={() => { setShowLoginModal(true); setIsMenuOpen(false); }} className="btn btn-primary w-100 py-3 rounded-4">Login to Account</button>
              )}
              <p className="text-center text-muted mt-3 small">© 2026 Drishtee Computer Center • v2.4.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM TAB BAR --- */}
      <nav className="app-tab-bar d-lg-none">
        {[
          { to: "/", icon: "bi-house-door", activeIcon: "bi-house-door-fill", label: "Home" },
          { to: "/courses", icon: "bi-mortarboard", activeIcon: "bi-mortarboard-fill", label: "Courses" },
          { to: "/gallery", isFab: true, icon: "bi-camera-fill" },
          { to: "/library", icon: "bi-book", activeIcon: "bi-book-fill", label: "Library" }
        ].map((tab, i) => (
          tab.isFab ? (
            <div key={i} className="tab-fab-wrapper">
              <Link to={tab.to} className="tab-fab"><i className={tab.icon}></i></Link>
            </div>
          ) : (
            <Link key={i} to={tab.to} className={`tab-item ${location.pathname === tab.to || (tab.to !== "/" && location.pathname.startsWith(tab.to)) ? "active" : ""}`}>
              <div className="icon-wrapper">
                <i className={location.pathname === tab.to ? tab.activeIcon : tab.icon}></i>
              </div>
              <span>{tab.label}</span>
            </Link>
          )
        ))}
        <button onClick={() => setIsMenuOpen(true)} className={`tab-item border-0 bg-transparent ${isMenuOpen ? "active" : ""}`}>
          <div className="nav-profile-frame"><img src={userData.photo} alt="Account" /></div>
          <span>Account</span>
        </button>
      </nav>

      {/* --- MODALS --- */}
      {showLoginModal && (
        <div className="app-modal-container">
          <div className="app-modal-blur" onClick={() => setShowLoginModal(false)}></div>
          <div className="app-modal-card p-4">
            <div className="modal-top-line"></div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="fw-bold fs-4 m-0">Welcome Back</h2>
              <button className="btn-close" onClick={() => setShowLoginModal(false)}></button>
            </div>
            <div className="app-role-tabs mb-4">
              <button className={loginType === "student" ? "active" : ""} onClick={() => setLoginType("student")}>Student</button>
              <button className={loginType === "admin" ? "active" : ""} onClick={() => setLoginType("admin")}>Admin</button>
            </div>
            <LoginForm isAdminView={loginType === "admin"} onSuccess={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}

      {isSearchActive && (
        <div className="app-search-overlay">
          <div className="search-header">
            <button className="border-0 bg-transparent" onClick={() => setIsSearchActive(false)}>
              <i className="bi bi-arrow-left fs-3"></i>
            </button>
            <div className="flex-grow-1">
              <GlobleSearchBox routes={RouteLinks} autoFocus onSelect={() => setIsSearchActive(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}