import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import GlobleSearchBox from "../GlobleSearch/GlobleSearchBox";
import RouteLinks from "../GlobleSearch/RouteLinks";
import LoginForm from "./LoginForm";
import "./Header.css";
import LanguageTranslator from "../LanguageTranslator/LanguageTranslator";

export default function Header() {
  const { user, student, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState("student");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "text-primary fw-bold" : "text-secondary");

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
      <nav className={`navbar navbar-expand-lg fixed-top bg-white border-bottom p-0 d-none d-lg-block ${scrolled ? "shadow-sm" : ""}`}
        style={{ height: scrolled ? "75px" : "90px", transition: "0.3s" }}>
        <div className="container-fluid px-4 h-100 d-flex align-items-center justify-content-between">
          <Link to="/" className="navbar-brand">
            <img src="/images/icon/logo.png" alt="Logo" height={scrolled ? "40" : "45"} />
          </Link>

          <div className="d-flex align-items-center gap-4">
            <Link to="/" className={`nav-link px-2 ${isActive("/")}`}>Home</Link>
            <Link to="/about" className={`nav-link px-2 ${isActive("/about")}`}>About</Link>
            <div className="dropdown">
              <Link to="/courses" className={`nav-link dropdown-toggle px-2 ${location.pathname.startsWith("/courses") ? "text-primary fw-bold" : ""}`} data-bs-toggle="dropdown">
                Courses
              </Link>
              <ul className="dropdown-menu shadow-lg border-0 mt-2">
                {courseLinks.map((link) => (
                  <li key={link.to}><Link className="dropdown-item py-2" to={link.to}>{link.label}</Link></li>
                ))}
              </ul>
            </div>
            <Link to="/library" className={`nav-link px-2 ${isActive("/library")}`}>Library</Link>
            <div className="dropdown">
              <button className="btn dropdown-toggle fw-semibold text-secondary border-0 p-0" data-bs-toggle="dropdown">Student Zone</button>
              <ul className="dropdown-menu shadow-lg border-0 mt-2">
                <li><Link className="dropdown-item py-2" to="/new-admission">New Admission</Link></li>
                <li><Link className="dropdown-item py-2" to="/download-certificate">Download Certificate</Link></li>
              </ul>
            </div>
            <Link to="/gallery" className={`nav-link px-2 ${isActive("/gallery")}`}>Gallery</Link>
            <Link to="/contact-us" className={`nav-link px-2 ${isActive("/contact-us")}`}>Contact</Link>
          </div>

          <div className="d-flex align-items-center gap-3">
            <GlobleSearchBox routes={RouteLinks} placeholder="Search..." />
            {!user ? (
              <button className="btn btn-primary px-4 rounded-4 fw-bold shadow-sm" onClick={() => setShowLoginModal(true)}>Login</button>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-primary rounded-pill px-3 shadow-sm" onClick={() => navigate("/chat")}>IM</button>
                <div className="dropdown">
                  <img src={userData.photo} className="rounded-circle border border-2 cursor-pointer" width="42" height="42" data-bs-toggle="dropdown" alt="Profile" />
                  <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0">
                    <li><Link className="dropdown-item py-2" to={userData.dashboard}>Dashboard</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger py-2" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>
              </div>
            )}
            <button className="btn btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center" onClick={() => navigate("/branch/nichlaul/location")} title="Our Location" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-geo-alt-fill"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE TOP BAR --- */}
      <header className="d-lg-none bg-primary p-3 sticky-top shadow">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
            <img src="/images/icon/icon.webp" className="bg-white p-1 rounded-3 shadow-sm" height="42" width="42" alt="Logo" />
            <div className="text-white">
              <h1 className="m-0 fs-5 fw-bold" style={{ letterSpacing: '1px' }}>DRISHTEE</h1>
              <small style={{ fontSize: '10px', opacity: 0.9 }}>ISO 9001:2015 Certified</small>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-light btn-sm rounded-circle shadow-sm" onClick={() => setIsSearchActive(true)} style={{ width: '40px', height: '40px' }}><i className="bi bi-search"></i></button>
            <button className="btn btn-light btn-sm rounded-circle shadow-sm" onClick={() => navigate("/branch/nichlaul/location")} style={{ width: '40px', height: '40px' }}><i className="bi bi-geo-alt-fill"></i></button>
          </div>
        </div>
      </header>

      {/* --- MOBILE BOTTOM TAB BAR --- */}
      <nav className="fixed-bottom bg-white border-top d-lg-none d-flex justify-content-around align-items-center shadow-lg" style={{ height: "70px", zIndex: 1000 }}>
        <Link to="/" className={`text-center text-decoration-none d-flex flex-column align-items-center ${location.pathname === '/' ? 'text-primary' : 'text-secondary'}`}>
          <i className={`bi bi-house-door${location.pathname === '/' ? '-fill' : ''} fs-4`}></i>
          <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Home</span>
        </Link>
        
        <Link to="/courses" className={`text-center text-decoration-none d-flex flex-column align-items-center ${location.pathname.startsWith('/courses') ? 'text-primary' : 'text-secondary'}`}>
          <i className={`bi bi-mortarboard${location.pathname.startsWith('/courses') ? '-fill' : ''} fs-4`}></i>
          <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Courses</span>
        </Link>
        
        {/* CENTER CAMERA BUTTON */}
        <div className="position-relative" style={{ width: '75px', height: '70px' }}>
          <Link to="/gallery" 
            className="btn btn-primary rounded-circle position-absolute start-50 translate-middle-x d-flex align-items-center justify-content-center custom-camera-btn" 
            style={{ 
              width: '68px', 
              height: '68px', 
              top: '-22px'
            }}>
            <i className="bi bi-camera-fill fs-3 text-white"></i>
          </Link>
        </div>

        <Link to="/library" className={`text-center text-decoration-none d-flex flex-column align-items-center ${location.pathname.startsWith('/library') ? 'text-primary' : 'text-secondary'}`}>
          <i className={`bi bi-book${location.pathname.startsWith('/library') ? '-fill' : ''} fs-4`}></i>
          <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Library</span>
        </Link>

        <button onClick={() => setIsMenuOpen(true)} className="btn border-0 d-flex flex-column align-items-center p-0 shadow-none">
          <div className={`rounded-circle border border-2 ${isMenuOpen ? 'border-primary' : 'border-light'} overflow-hidden shadow-sm`} style={{ width: '32px', height: '32px' }}>
            <img src={userData.photo} className="w-100 h-100 object-fit-cover" alt="User" />
          </div>
          <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 'bold' }}>Account</span>
        </button>
      </nav>

      {/* --- MOBILE DRAWER (OFFCANVAS) --- */}
      <div className={`offcanvas offcanvas-bottom rounded-top-5 border-0 ${isMenuOpen ? "show" : ""}`}
        style={{ height: "75vh", visibility: isMenuOpen ? "visible" : "hidden", zIndex: 20001, transition: '0.4s ease-in-out' }}>
        <div className="offcanvas-header justify-content-center pt-3">
          <div className="bg-secondary opacity-25 rounded-pill" style={{ width: "50px", height: "5px" }}></div>
        </div>
        <div className="offcanvas-body p-4 pt-0">
          <Link to={userData.dashboard} onClick={() => setIsMenuOpen(false)} className="text-decoration-none">
            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4 mb-4 shadow-sm border border-white">
              <img src={userData.photo} className="rounded-circle border border-3 border-white shadow-sm" width="65" height="65" />
              <div>
                <h5 className="m-0 fw-bold text-dark">{userData.name}</h5>
                <span className="text-muted small">Go to Dashboard <i className="bi bi-arrow-right"></i></span>
              </div>
            </div>
          </Link>

          {/* Grid Menu */}
          <div className="row g-3 mb-4 text-center">
            <div className="col-4">
              <Link to="/download-certificate" onClick={() => setIsMenuOpen(false)} className="text-decoration-none">
                <div className="p-3 rounded-4 shadow-sm h-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: "#fff9e6" }}>
                  <i className="bi bi-patch-check-fill fs-2 text-warning mb-1"></i>
                  <span className="small fw-bold text-secondary">Verify</span>
                </div>
              </Link>
            </div>
            <div className="col-4">
              <Link to="/chat" onClick={() => setIsMenuOpen(false)} className="text-decoration-none">
                <div className="p-3 rounded-4 shadow-sm h-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: "#e6fcf5" }}>
                  <i className="bi bi-chat-dots-fill fs-2 text-success mb-1"></i>
                  <span className="small fw-bold text-secondary">Chat</span>
                </div>
              </Link>
            </div>
            <div className="col-4">
              <div className="p-3 rounded-4 shadow-sm h-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: "#eef2ff" }}>
                <LanguageTranslator />
                <span className="small fw-bold text-secondary mt-1">Translate</span>
              </div>
            </div>
          </div>

        <div className="ios-menu">

  <div className="ios-menu-section">
    <div className="ios-menu-title">About</div>

    <Link to="/about" className="ios-menu-item" onClick={() => setIsMenuOpen(false)}>
      <div className="ios-icon"><i className="bi bi-info-circle"></i></div>
      <span>About Us</span>
      <i className="bi bi-chevron-right ms-auto"></i>
    </Link>

    <Link to="/branch/thoothibari" className="ios-menu-item" onClick={() => setIsMenuOpen(false)}>
      <div className="ios-icon"><i className="bi bi-building"></i></div>
      <span>About Branch</span>
      <i className="bi bi-chevron-right ms-auto"></i>
    </Link>
  </div>


  <div className="ios-menu-section">
    <div className="ios-menu-title">Courses</div>

    <Link to="/courses" className="ios-menu-item" onClick={() => setIsMenuOpen(false)}>
      <div className="ios-icon"><i className="bi bi-mortarboard"></i></div>
      <span>Our Courses</span>
      <i className="bi bi-chevron-right ms-auto"></i>
    </Link>
  </div>


  <div className="ios-menu-section">
    <div className="ios-menu-title">Student Zone</div>

    <Link to="/new-admission" className="ios-menu-item" onClick={() => setIsMenuOpen(false)}>
      <div className="ios-icon"><i className="bi bi-person-plus"></i></div>
      <span>New Admission</span>
      <i className="bi bi-chevron-right ms-auto"></i>
    </Link>

    <Link to="/download-certificate" className="ios-menu-item" onClick={() => setIsMenuOpen(false)}>
      <div className="ios-icon"><i className="bi bi-award"></i></div>
      <span>Certificate</span>
      <i className="bi bi-chevron-right ms-auto"></i>
    </Link>

    <Link to="/library" className="ios-menu-item" onClick={() => setIsMenuOpen(false)}>
      <div className="ios-icon"><i className="bi bi-journal-bookmark"></i></div>
      <span>Library</span>
      <i className="bi bi-chevron-right ms-auto"></i>
    </Link>
  </div>


  <div className="ios-menu-section">
    <div className="ios-menu-title">Media</div>

    <Link to="/gallery" className="ios-menu-item" onClick={() => setIsMenuOpen(false)}>
      <div className="ios-icon"><i className="bi bi-images"></i></div>
      <span>Gallery</span>
      <i className="bi bi-chevron-right ms-auto"></i>
    </Link>
  </div>

</div>
          <div className="pb-5">
            {user ? (
              <button onClick={handleLogout} className="btn btn-outline-danger w-100 py-3 rounded-4 fw-bold border-2">Sign Out</button>
            ) : (
              <button onClick={() => { setShowLoginModal(true); setIsMenuOpen(false); }} className="btn btn-primary w-100 py-3 rounded-4 fw-bold shadow">Login</button>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && <div className="modal-backdrop fade show" style={{ zIndex: 20000 }} onClick={() => setIsMenuOpen(false)}></div>}

      {/* --- LOGIN MODAL --- */}
      {showLoginModal && (
        <div className="modal show d-block" onClick={() => setShowLoginModal(false)}>
          <div className="modal-dialog modal-dialog-centered modal-sm p-3" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-content border-0 rounded-5 p-4 shadow-lg">
              <div className="modal-header border-0 pb-0 d-flex justify-content-between">
                <h4 className="fw-bold m-0 text-dark">Login</h4>
                <button type="button" className="btn-close" onClick={() => setShowLoginModal(false)}></button>
              </div>
              <div className="modal-body pt-4">
                <div className="btn-group w-100 mb-4 bg-light p-1 rounded-4 shadow-sm border">
                  <button className={`btn rounded-4 fw-bold border-0 ${loginType === 'student' ? 'btn-white shadow-sm text-primary' : 'text-muted'}`} onClick={() => setLoginType('student')}>Student</button>
                  <button className={`btn rounded-4 fw-bold border-0 ${loginType === 'admin' ? 'btn-white shadow-sm text-primary' : 'text-muted'}`} onClick={() => setLoginType('admin')}>Admin</button>
                </div>
                <LoginForm isAdminView={loginType === "admin"} onSuccess={() => setShowLoginModal(false)} isModal={true} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH OVERLAY */}
      {isSearchActive && (
        <div className="position-fixed inset-0 bg-white h-100 w-100" style={{ zIndex: 40000, padding: '20px' }}>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-light rounded-circle" onClick={() => setIsSearchActive(false)}><i className="bi bi-arrow-left fs-4"></i></button>
            <div className="flex-grow-1">
              <GlobleSearchBox routes={RouteLinks} autoFocus onSelect={() => setIsSearchActive(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}