import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import GlobleSearchBox from "../GlobleSearch/GlobleSearchBox";
import RouteLinks from "../GlobleSearch/RouteLinks";
import LoginForm from "./LoginForm";
import "./Header.css";
import { Button } from "react-bootstrap";
import { ChatDots } from "react-bootstrap-icons";

export default function Header() {
  const { user, student, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState("student");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Optimization: Scroll listener with passive option for performance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        if (!scrolled) setScrolled(true);
      } else {
        if (scrolled) setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Performance: Memoize user data to prevent unnecessary recalculations
  const userData = useMemo(() => ({
    name: student?.name || user?.displayName || "Guest Student",
    photo: student?.photoUrl || user?.photoURL || "/images/icon/default-avatar.png",
    email: user?.email || "Academic Portal"
  }), [student, user]);

  return (
    <>
      {/* --- PC NAVBAR (SEO: Using proper nav tag) --- */}
      <nav className={`pc-nav d-none d-lg-flex ${scrolled ? "pc-sticky" : ""}`} aria-label="Main Navigation">
        <div className="pc-content">
          <Link to="/" className="pc-logo-box">
            <img src="/images/icon/logo.png" alt="Drishtee Computer Center - Best IT Training Center" />
          </Link>

          <div className="pc-menu">
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
            <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link>

            <div className="dropdown pc-dropdown">
              <Link
                to="/courses"
                className={`dropdown-toggle ${location.pathname.startsWith("/courses") ? "active" : ""}`}
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
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

            <Link to="/library" className={location.pathname === "/library" ? "active" : ""}>Library</Link>
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

            <Link to="/gallery" className={location.pathname === "/gallery" ? "active" : ""}>Gallery</Link>
            <Link to="/contact-us" className={location.pathname === "/contact-us" ? "active" : ""}>Contact</Link>
          </div>

          <div className="pc-right d-flex align-items-center">
            <GlobleSearchBox routes={RouteLinks} placeholder="Search anything..." />

            {!user ? (
              <button className="pc-btn-log ms-3" onClick={() => setShowLoginModal(true)}>Login</button>
            ) : (
              <div className="pc-profile-dropdown dropdown ms-3">
                <img
                  src={userData.photo}
                  className="pc-profile-pic rounded-circle shadow-sm"
                  alt="Profile Dashboard"
                  data-bs-toggle="dropdown"
                  style={{ width: 40, height: 40, objectFit: "cover", cursor: "pointer" }}
                />
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0">
                  <li><Link className="dropdown-item" to={isAdmin ? "/admin" : "/student"}>Dashboard</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            )}
            
            {/* Action Buttons */}
            <button className="icon-btn-circle bg-danger ms-3" onClick={() => navigate("/branch/nichlaul/location")} title="Our Location">
              <i className="bi bi-geo-alt-fill"></i>
            </button>
            {user && (
              <Button variant="primary" className="rounded-pill d-flex align-items-center gap-2 ms-2 px-3" onClick={() => navigate("/chat")}>
                <ChatDots /> <span>IM</span>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* --- MOBILE TOP BAR (SEO: Structured data) --- */}
      <header className="app-top-bar d-lg-none">
        <div className="app-top-content">
          <div className="app-brand me-1" onClick={() => navigate("/")} style={{cursor: 'pointer'}}>
            <img src="/images/icon/icon.webp" className="app-logo-mini" alt="Drishtee Icon" />
            <div className="app-brand-text">
              <h1 className="m-0">DRISHTEE</h1>
              <span>ISO 9001:2015 Certified</span>
            </div>
          </div>
          <div className="app-top-actions d-flex gap-2">
            <button className="icon-btn-circle" onClick={() => setIsSearchActive(true)} aria-label="Open Search">
              <i className="bi bi-search"></i>
            </button>
            <button className="icon-btn-circle" onClick={() => navigate("/branch/nichlaul/location")} aria-label="Location">
              <i className="bi bi-geo-alt-fill"></i>
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBILE DRAWER (Performance: Render content only if visible/logic-heavy elements are limited) --- */}
      <div className={`app-drawer ${isMenuOpen ? "active" : ""}`} aria-hidden={!isMenuOpen}>
        <div className="drawer-overlay" onClick={() => setIsMenuOpen(false)}></div>
        <div className="drawer-content">
          <div className="drawer-handle"></div>

          <Link to={isAdmin ? "/admin" : "/student"} onClick={() => setIsMenuOpen(false)} className="text-decoration-none">
            <div className="drawer-user-card shadow-sm">
              <div className="d-flex align-items-center gap-3">
                <div className="user-avatar-lg">
                  <img src={userData.photo} alt={userData.name} className="rounded-circle" width="65" height="65" />
                </div>
                <div>
                  <h3 className="mb-0 fs-5 fw-bold">{userData.name}</h3>
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
                { type: 'chat', to: "/chat", icon: <ChatDots className="fs-2 text-info mb-2" />, label: "Group Chat" }
              ].map((item, idx) => (
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
              <Link to="/courses" className="drawer-item" onClick={() => setIsMenuOpen(false)}><i className="bi bi-mortarboard-fill"></i> Explore Courses</Link>
              <Link to="/gallery" className="drawer-item" onClick={() => setIsMenuOpen(false)}><i className="bi bi-images"></i> Campus Gallery</Link>
              <Link to="/new-admission" className="drawer-item" onClick={() => setIsMenuOpen(false)}><i className="bi bi-person-plus"></i> New Admission</Link>
            </div>

            <div className="social-footer-mobile d-flex justify-content-center gap-3 mt-4">
              {['facebook', 'youtube', 'instagram'].map(platform => (
                <a key={platform} href={`#${platform}`} className={`soc-link rounded-4 rounded-4${platform.slice(0,2)}`} aria-label={platform}>
                  <i className={`bi bi-${platform} text-white`}></i>
                </a>
              ))}
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
      <nav className="app-tab-bar d-lg-none" aria-label="Mobile Bottom Nav">
        <Link to="/" className={`tab-item ${location.pathname === "/" ? "active" : ""}`}>
          <div className="icon-wrapper"><i className={location.pathname === "/" ? "bi bi-house-door-fill" : "bi bi-house-door"}></i></div>
          <span>Home</span>
        </Link>
        <Link to="/courses" className={`tab-item ${location.pathname.startsWith("/courses") ? "active" : ""}`}>
          <div className="icon-wrapper"><i className="bi bi-mortarboard"></i></div>
          <span>Courses</span>
        </Link>
        <div className="tab-fab-wrapper">
          <Link to="/gallery" className="tab-fab" aria-label="Gallery"><i className="bi bi-camera-fill"></i></Link>
        </div>
        <Link to="/library" className={`tab-item ${location.pathname === "/library" ? "active" : ""}`}>
          <div className="icon-wrapper"><i className="bi bi-book"></i></div>
          <span>Library</span>
        </Link>
        <button onClick={() => setIsMenuOpen(true)} className={`tab-item border-0 bg-transparent ${isMenuOpen ? "active" : ""}`}>
          <div className="nav-profile-frame"><img src={userData.photo} alt="Account" /></div>
          <span>Account</span>
        </button>
      </nav>

      {/* --- MODALS (SEO: Rendered at end of body) --- */}
      {showLoginModal && (
        <div className="app-modal-container active">
          <div className="app-modal-blur" onClick={() => setShowLoginModal(false)}></div>
          <div className="app-modal-card">
            <div className="modal-top-line"></div>
            <div className="p-4">
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