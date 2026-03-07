import { useState, useRef, lazy, Suspense, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import LoginForm from "./LoginForm";
import LanguageTranslator from "../LanguageTranslator/LanguageTranslator";
import GlobleSearchBox from "../GlobleSearch/GlobleSearchBox";
import RouteLinks from "../GlobleSearch/RouteLinks";
import "./Header.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Home = lazy(() => import("../HomePage/Home"));
const OurCourses = lazy(() => import("../HomePage/pages/Course/OurCourses"));
const Library = lazy(() => import("../HomePage/pages/Library/Library"));
const Gallery = lazy(() => import("../HomePage/pages/Gallery"));

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, student, isAdmin, logout } = useAuth();

  const [activeSection, setActiveSection] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState("student");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const touchStartTime = useRef(0);
  const containerRef = useRef(null);

  const sections = ["home", "courses", "library", "gallery"];
  const sectionComponents = [<Home />, <OurCourses />, <Library />, <Gallery />];

  const isActive = (path) => (location.pathname === path ? "text-primary fw-bold" : "text-secondary");

  const userData = {
    name: student?.name || user?.displayName || "Guest Student",
    photo: student?.photoUrl || user?.photoURL || "/images/icon/default-avatar.png",
    dashboard: isAdmin ? "/admin" : "/student",
  };

  const courseLinks = [
    { to: "/courses", label: "All Courses" },
    { to: "/certificate", label: "Computer Certificate" },
    { to: "/courses/computer-language", label: "Computer Language" },
    { to: "/courses/designing", label: "Graphics Design" },
    { to: "/courses/web-development", label: "Web Development" },
    { to: "/courses/nielit", label: "NIELIT Courses" },
    { to: "/courses/banking", label: "Banking Course" },
  ];


  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
    if (containerRef.current) containerRef.current.style.transition = "none";
  };

  const handleTouchMove = (e) => {
    touchCurrentX.current = e.touches[0].clientX;
    const delta = touchCurrentX.current - touchStartX.current;

    // Ignore tiny accidental movements
    if (Math.abs(delta) > 10 && containerRef.current) {
      let percentage = -activeSection * 100 + (delta / window.innerWidth) * 100;

      // Clamp so it doesn't overshoot first/last section
      percentage = Math.max(percentage, -(sections.length - 1) * 100);
      percentage = Math.min(percentage, 0);

      containerRef.current.style.transform = `translateX(${percentage}%)`;
    }
  };

  const handleTouchEnd = () => {
    const delta = touchCurrentX.current - touchStartX.current;
    const deltaTime = Date.now() - touchStartTime.current;
    const velocity = delta / deltaTime;

    let newSection = activeSection;

    // WhatsApp-like thresholds: require enough drag (100px) or fast swipe
    if ((delta < -100 || velocity < -0.3) && activeSection < sections.length - 1) {
      newSection = activeSection + 1;
    } else if ((delta > 100 || velocity > 0.3) && activeSection > 0) {
      newSection = activeSection - 1;
    }

    setActiveSection(newSection);

    if (containerRef.current) {
      containerRef.current.style.transition = "transform 0.35s cubic-bezier(0.25,1,0.5,1)";
      containerRef.current.style.transform = `translateX(-${newSection * 100}%)`;
    }
  };

  // Keep activeSection in sync with transform
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transition = "none";
      containerRef.current.style.transform = `translateX(-${activeSection * 100}%)`;
    }
  }, [activeSection]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transition = "none";
      containerRef.current.style.transform = `translateX(-${activeSection * 100}%)`;
    }
  }, [activeSection]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* --- PC NAVBAR --- */}
      <nav className="navbar navbar-expand-lg fixed-top bg-white border-bottom p-0 d-none d-lg-block shadow-sm" style={{ height: "85px" }}>
        <div className="container-fluid px-4 h-100 d-flex align-items-center justify-content-between">
          <Link to="/" className="navbar-brand">
            <img src="/images/icon/logo.png" alt="Logo" height="45" />
          </Link>

          <div className="d-flex align-items-center gap-4">
            <Link to="/" className={`nav-link px-2 ${isActive("/")}`}>Home</Link>
            <Link to="/about" className={`nav-link px-2 ${isActive("/about")}`}>About</Link>

            {/* Courses Dropdown PC */}
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

            {/* Student Zone PC */}
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
            {/* Geo Location Link PC */}
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
            <button className="btn btn-light btn-sm rounded-circle shadow-sm" onClick={() => setIsSearchActive(true)} style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-search"></i>
            </button>
            <button className="btn btn-light btn-sm rounded-circle shadow-sm" onClick={() => navigate("/branch/nichlaul/location")} style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-geo-alt-fill"></i>
            </button>
          </div>
        </div>
      </header>

      <div
        className="mobile-swipe-wrapper d-lg-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="mobile-sections-inner" ref={containerRef}>
          {sectionComponents.map((Comp, idx) => (
            <div key={idx} className="mobile-section">
              <Suspense fallback={<div className="loading">Loading...</div>}>{Comp}</Suspense>
            </div>
          ))}
        </div>
      </div>

      {/* --- MOBILE BOTTOM TAB (REDESIGNED) --- */}
      <nav className="fixed-bottom bg-white border-top d-lg-none d-flex justify-content-around align-items-center shadow-lg" style={{ height: "70px", zIndex: 1000 }}>
        <button
          className="btn border-0 d-flex flex-column align-items-center p-0 shadow-none bg-transparent"
          onClick={() => setActiveSection(0)}
        >
          <i className={`bi ${activeSection === 0 ? 'bi-house-door-fill' : 'bi-house-door'} fs-4 ${activeSection === 0 ? 'text-primary' : 'text-secondary'}`}></i>
          <span className={activeSection === 0 ? 'text-primary' : 'text-secondary'} style={{ fontSize: '11px', fontWeight: 'bold' }}>Home</span>
        </button>

        <button
          className="btn border-0 d-flex flex-column align-items-center p-0 shadow-none bg-transparent"
          onClick={() => setActiveSection(1)}
        >
          <i className={`bi ${activeSection === 1 ? 'bi-mortarboard-fill' : 'bi-mortarboard'} fs-4 ${activeSection === 1 ? 'text-primary' : 'text-secondary'}`}></i>
          <span className={activeSection === 1 ? 'text-primary' : 'text-secondary'} style={{ fontSize: '11px', fontWeight: 'bold' }}>Courses</span>
        </button>

        {/* CENTER CAMERA BUTTON */}
        <div className="position-relative" style={{ width: '75px', height: '70px' }}>
          <button
            className="btn btn-primary rounded-circle position-absolute start-50 translate-middle-x d-flex align-items-center justify-content-center custom-camera-btn"
            style={{ width: '68px', height: '68px', top: '-22px' }}
            onClick={() => setActiveSection(3)}
          >
            <i className="bi bi-camera-fill fs-3 text-white"></i>
          </button>
        </div>

        <button
          className="btn border-0 d-flex flex-column align-items-center p-0 shadow-none bg-transparent"
          onClick={() => setActiveSection(2)}
        >
          <i className={`bi ${activeSection === 2 ? 'bi-book-fill' : 'bi-book'} fs-4 ${activeSection === 2 ? 'text-primary' : 'text-secondary'}`}></i>
          <span className={activeSection === 2 ? 'text-primary' : 'text-secondary'} style={{ fontSize: '11px', fontWeight: 'bold' }}>Library</span>
        </button>

        <button
          onClick={() => setIsMenuOpen(true)}
          className="btn border-0 d-flex flex-column align-items-center p-0 shadow-none bg-transparent"
        >
          <div className={`rounded-circle border border-2 ${isMenuOpen ? 'border-primary' : 'border-light'} overflow-hidden shadow-sm`} style={{ width: '32px', height: '32px' }}>
            <img src={userData.photo} className="w-100 h-100 object-fit-cover" alt="User" />
          </div>
          <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 'bold' }}>Account</span>
        </button>
      </nav>

      {/* --- MOBILE DRAWER (REDESIGNED WITH ALL FEATURES) --- */}
      <div className={`offcanvas offcanvas-bottom rounded-top-5 border-0 ${isMenuOpen ? "show" : ""}`}
        style={{ height: "75vh", visibility: isMenuOpen ? "visible" : "hidden", zIndex: 20001, transition: '0.4s ease-in-out' }}>
        <div className="offcanvas-header justify-content-center pt-3">
          <div className="bg-secondary opacity-25 rounded-pill" style={{ width: "50px", height: "5px" }}></div>
        </div>
        <div className="offcanvas-body p-4 pt-0">
          <Link to={userData.dashboard} onClick={() => setIsMenuOpen(false)} className="text-decoration-none">
            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4 mb-4 shadow-sm border border-white">
              <img src={userData.photo} className="rounded-circle border border-3 border-white shadow-sm" width="65" height="65" alt="Profile" />
              <div>
                <h5 className="m-0 fw-bold text-dark">{userData.name}</h5>
                <span className="text-muted small">Go to Dashboard <i className="bi bi-arrow-right"></i></span>
              </div>
            </div>
          </Link>

          {/* Feature Grid */}
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

          {/* Academic Hub Links */}
          <div className="list-group list-group-flush mb-4">
            <label className="text-uppercase small fw-bold text-muted mb-2 px-2">Academic Hub</label>
            <Link to="/courses" className="list-group-item list-group-item-action border-0 py-3 rounded-3 mb-1" onClick={() => setIsMenuOpen(false)}>
              <i className="bi bi-mortarboard-fill me-3 text-primary"></i> Explore Courses
            </Link>
            <Link to="/gallery" className="list-group-item list-group-item-action border-0 py-3 rounded-3 mb-1" onClick={() => setIsMenuOpen(false)}>
              <i className="bi bi-images me-3 text-primary"></i> Campus Gallery
            </Link>
            <Link to="/new-admission" className="list-group-item list-group-item-action border-0 py-3 rounded-3" onClick={() => setIsMenuOpen(false)}>
              <i className="bi bi-person-plus me-3 text-primary"></i> New Admission
            </Link>
          </div>

          {/* Student Zone Links */}
          <div className="list-group list-group-flush mb-4">
            <label className="text-uppercase small fw-bold text-muted mb-2 px-2">Student Zone</label>
            <Link to="/new-admission" className="list-group-item list-group-item-action border-0 py-3 rounded-3 mb-1" onClick={() => setIsMenuOpen(false)}>
              <i className="bi bi-pencil-square me-3 text-primary"></i> New Admission
            </Link>
            <Link to="/download-certificate" className="list-group-item list-group-item-action border-0 py-3 rounded-3" onClick={() => setIsMenuOpen(false)}>
              <i className="bi bi-file-earmark-pdf me-3 text-primary"></i> Download Certificate
            </Link>
          </div>

          {/* Social Links */}
          <div className="d-flex justify-content-center gap-4 py-4 bg-light rounded-4 mb-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary rounded-circle shadow-sm d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
              <i className="bi bi-facebook"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="btn btn-danger rounded-circle shadow-sm d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
              <i className="bi bi-youtube"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn btn-warning text-white rounded-circle shadow-sm d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
              <i className="bi bi-instagram"></i>
            </a>
          </div>

          {/* Location Button in Drawer */}
          <div className="mb-4">
            <button
              onClick={() => { navigate("/branch/nichlaul/location"); setIsMenuOpen(false); }}
              className="btn btn-outline-danger w-100 py-3 rounded-4 fw-bold border-2 d-flex align-items-center justify-content-center gap-2"
            >
              <i className="bi bi-geo-alt-fill"></i> Our Location
            </button>
          </div>

          {/* Login/Logout Section */}
          <div className="pb-5">
            {user ? (
              <button onClick={handleLogout} className="btn btn-outline-danger w-100 py-3 rounded-4 fw-bold border-2">
                Sign Out
              </button>
            ) : (
              <button onClick={() => { setShowLoginModal(true); setIsMenuOpen(false); }} className="btn btn-primary w-100 py-3 rounded-4 fw-bold shadow">
                Login to Account
              </button>
            )}
            <p className="text-center text-muted mt-3 small">© 2026 Drishtee Computer Center • v1.0.2</p>
          </div>
        </div>
      </div>

      {isMenuOpen && <div className="modal-backdrop fade show" style={{ zIndex: 20000 }} onClick={() => setIsMenuOpen(false)}></div>}

      {/* --- LOGIN MODAL (REDESIGNED) --- */}
      {showLoginModal && (
        <div className="modal show d-block" onClick={() => setShowLoginModal(false)} style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-sm p-3" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-content border-0 rounded-5 p-4 shadow-lg overflow-hidden position-relative">
              <div className="bg-primary position-absolute top-0 start-0 w-100" style={{ height: '6px' }}></div>
              <div className="modal-header border-0 pb-0 d-flex justify-content-between align-items-center">
                <h4 className="fw-bold m-0 text-dark">Welcome Back</h4>
                <button type="button" className="btn-close shadow-none" onClick={() => setShowLoginModal(false)}></button>
              </div>
              <div className="modal-body pt-4">
                <div className="btn-group w-100 mb-4 bg-light p-1 rounded-4 shadow-sm border">
                  <button
                    className={`btn rounded-4 fw-bold border-0 py-2 ${loginType === 'student' ? 'btn-white bg-white shadow-sm text-primary' : 'text-muted'}`}
                    onClick={() => setLoginType('student')}
                  >
                    Student
                  </button>
                  <button
                    className={`btn rounded-4 fw-bold border-0 py-2 ${loginType === 'admin' ? 'btn-white bg-white shadow-sm text-primary' : 'text-muted'}`}
                    onClick={() => setLoginType('admin')}
                  >
                    Admin
                  </button>
                </div>
                <LoginForm isAdminView={loginType === "admin"} onSuccess={() => setShowLoginModal(false)} isModal={true} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay with GlobleSearchBox */}
      {isSearchActive && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-white" style={{ zIndex: 40000, padding: '20px' }}>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-light rounded-circle shadow-sm" onClick={() => setIsSearchActive(false)}>
              <i className="bi bi-arrow-left fs-4"></i>
            </button>
            <div className="flex-grow-1">
              <GlobleSearchBox
                routes={RouteLinks}
                placeholder="Search courses, library..."
                autoFocus
                onSelect={() => setIsSearchActive(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}