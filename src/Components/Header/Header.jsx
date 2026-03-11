import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import GlobleSearchBox from "../GlobleSearch/GlobleSearchBox";
import RouteLinks from "../GlobleSearch/RouteLinks";
import LoginForm from "./LoginForm";
import LanguageTranslator from "../LanguageTranslator/LanguageTranslator";
import "./Header.css";

export default function Header() {
  const { user, student, isAdmin, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showApps, setShowApps] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState("student");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active" : "");

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileMenu(false);
      setIsMenuOpen(false);
      navigate("/");
    } catch (error) { console.error(error); }
  };

  const userData = useMemo(() => ({
    name: student?.name || user?.displayName || "Guest Student",
    email: student?.email || user?.email || "student@drishteeindia.com",
    photo: student?.photoUrl || user?.photoURL || "/images/icon/default-avatar.png",
    dashboard: isAdmin ? "/admin" : "/student"
  }), [student, user, isAdmin]);

  const courseLinks = [
    {
      to: "/courses",
      label: "All Courses",
      desc: "Explore our full catalog of professional programs.",
      icon: "bi-mortarboard",
      color: "linear-gradient(135deg, #34C759, #30D158)"
    },
    {
      to: "/certificate",
      label: "Certificate",
      desc: "Download and verify your earned certifications.",
      icon: "bi-patch-check",
      color: "linear-gradient(135deg, #FF9500, #FFCC00)"
    },
    {
      to: "/courses/computer-language",
      label: "Languages",
      desc: "Master C++, Java, Python and more.",
      icon: "bi-code-slash",
      color: "linear-gradient(135deg, #5856D6, #AF52DE)"
    },
    {
      to: "/courses/designing",
      label: "Graphics",
      desc: "Learn UI/UX, Photoshop, and Creative Design.",
      icon: "bi-brush",
      color: "linear-gradient(135deg, #FF2D55, #FF375F)"
    },
    {
      to: "/courses/web-development",
      label: "Web Dev",
      desc: "Build modern websites with React and Node.",
      icon: "bi-globe",
      color: "linear-gradient(135deg, #007AFF, #00BCD4)"
    },
    {
      to: "/courses/nielit",
      label: "NIELIT",
      desc: "Official CCC, O-Level and Govt. recognized courses.",
      icon: "bi-award",
      color: "linear-gradient(135deg, #FF3B30, #FF453A)"
    },
  ];
  const studentZoneLinks = [
    { to: "/new-admission", label: "New Admission", icon: "bi-pencil-square", color: "linear-gradient(135deg, #007AFF, #054e9e)" },
    { to: "/download-certificate", label: "Verification", icon: "bi-shield-check", color: "linear-gradient(135deg, #34C759, #1a9638)" },
  ];

  return (
    <>
      <header className="google-header-advanced sticky-top shadow-sm bg-white">
        <div className="header-container container-fluid px-3 px-lg-4">
          <div className="header-left d-flex align-items-center w-100">
            <Link to="/" className="logo d-flex align-items-center text-decoration-none">
              <img src="/images/icon/logo.png" alt="Drishtee" height="32" />
            </Link>

            <nav className="nav-links d-none d-lg-flex mx-auto">
              <Link to="/" className={isActive("/")}>Home</Link>
              <Link to="/about" className={isActive("/about")}>About</Link>

              <div className="nav-item-dropdown position-relative pt-2">
                <Link to="/courses" className={location.pathname.startsWith("/courses") ? "active" : ""}>
                  Courses <i className="bi bi-chevron-down small"></i>
                </Link>
                <div className="nav-dropdown-menu modern-grid-menu shadow-lg border-0">
                  <div className="dropdown-grid">
                    <div className="dropdown-grid">
                      {courseLinks.map((link) => (
                        <Link key={link.to} to={link.to} className="grid-item d-flex align-items-start gap-3 p-3">
                          <div className="grid-icon flex-shrink-0" style={{ background: link.color }}>
                            <i className={`bi ${link.icon}`}></i>
                          </div>
                          <div className="d-flex flex-column">
                            <span className="fw-bold text-dark">{link.label}</span>
                            <small className="text-muted" style={{ fontSize: '12px', lineHeight: '1.2' }}>
                              {link.desc}
                            </small>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <Link to="/branch/thoothibari" className={isActive("/branch/thoothibari")}>Branch</Link>

              <Link to="/library" className={isActive("/library")}>Library</Link>
              <div className="nav-item-dropdown position-relative mt-2">
                <span className={`nav-static-link ${location.pathname.includes('admission') ? 'active' : ''}`}>Student Zone <i className="bi bi-chevron-down small"></i></span>
                <div className="nav-dropdown-menu modern-grid-menu shadow-lg border-0" style={{ minWidth: '220px' }}>
                  <div className="dropdown-grid" style={{ gridTemplateColumns: '1fr' }}>
                    {studentZoneLinks.map((link) => (
                      <Link key={link.to} to={link.to} className="grid-item">
                        <div className="grid-icon" style={{ background: link.color }}><i className={`bi ${link.icon}`}></i></div>
                        <span>{link.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link to="/gallery" className={isActive("/gallery")}>Gallery</Link>
              <Link to="/contact-us" className={isActive("/contact-us")}>Contact</Link>

            </nav>
          </div>
          <div className="d-none d-lg-inline">
            <GlobleSearchBox routes={RouteLinks} placeholder="Search courses..." />
          </div>

          <div className="header-right d-flex align-items-center gap-2 gap-md-3">
            <button className="btn btn-light rounded-circle d-sm-none" onClick={() => setIsSearchActive(true)}><i className="bi bi-search"></i></button>
            <div className="apps-dropdown position-relative">
              <button className="google-apps border-0 bg-transparent p-2 rounded-circle" onClick={() => setShowApps(!showApps)}>
                <i className="bi bi-grid-3x3-gap-fill fs-5 text-secondary"></i>
              </button>
              {showApps && (
                <div className="apps-menu shadow-lg border-0 position-absolute end-0 mt-2 bg-white rounded-4 p-3 animate__animated animate__fadeIn">
                  <div className="apps-grid">
                    <Link to="/chat" className="app-item" onClick={() => setShowApps(false)}>
                      <i className="bi bi-chat-dots-fill text-primary"></i><span>Chat</span>
                    </Link>
                    <Link to="/download-certificate" className="app-item" onClick={() => setShowApps(false)}>
                      <i className="bi bi-patch-check-fill text-success"></i><span>Verify</span>
                    </Link>
                    <Link to="/contact-us" className="app-item" onClick={() => setShowApps(false)}>
                      <i className="bi bi-envelope-fill  text-danger"></i><span>Contact</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Login/Profile Section */}
            <div className="d-none d-lg-block">
              {!user ? (
                <button className="google-signin-btn" onClick={() => setShowLoginModal(true)}>Login</button>
              ) : (
                <div className="profile-section" ref={profileRef}>
                  <div className="profile-badge d-flex align-items-center gap-2 cursor-pointer" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                    <img src={userData.photo} alt="profile" className="profile-image border shadow-sm" />
                  </div>
                  {showProfileMenu && (
                    <div className="profile-menu shadow-lg border-0 position-absolute end-0 mt-2 bg-white rounded-4 overflow-hidden animate__animated animate__fadeInUp">
                      <div className="profile-header p-4 text-center bg-light border-bottom">
                        <img src={userData.photo} alt="user" className="rounded-circle mb-2 border border-3 border-white shadow" width="65" height="65" />
                        <h6 className="fw-bold m-0">{userData.name}</h6>
                        <p className="text-muted small m-0 text-truncate">{userData.email}</p>
                      </div>
                      <div className="menu-items p-2">
                        <Link to={userData.dashboard} onClick={() => setShowProfileMenu(false)}><i className="bi bi-person-circle text-primary"></i> Dashboard</Link>
                        <button onClick={handleLogout} className="logout-btn w-100 border-0 bg-transparent text-start"><i className="bi bi-box-arrow-right text-danger"></i> Sign out</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <Link to="/branch/nichlaul/location" className="fs-4 p-0 m-0" onClick={() => setShowApps(false)}>
              <i className="bi bi-geo-alt-fill text-danger"></i>
            </Link>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed-bottom bg-white border-top d-lg-none d-flex justify-content-around align-items-center shadow-lg"
        style={{ height: "68px", zIndex: 1000, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <Link to="/" className={`text-center text-decoration-none d-flex flex-column align-items-center ${location.pathname === '/' ? 'text-primary' : 'text-secondary'}`}>
          <i className={`bi bi-house-door${location.pathname === '/' ? '-fill' : ''} fs-4`}></i>
          <span className="mobile-nav-label">Home</span>
        </Link>
        <Link to="/courses" className={`text-center text-decoration-none d-flex flex-column align-items-center ${location.pathname.startsWith('/courses') ? 'text-primary' : 'text-secondary'}`}>
          <i className={`bi bi-grid${location.pathname.startsWith('/courses') ? '-fill' : ''} fs-4`}></i>
          <span className="mobile-nav-label">Explore</span>
        </Link>
        <div className="position-relative" style={{ width: '60px' }}>
          <Link to="/gallery" className="btn btn-primary rounded-circle position-absolute start-50 translate-middle shadow-lg d-flex align-items-center justify-content-center custom-camera-btn"
            style={{ width: '58px', height: '58px', top: '-10px' }}><i className="bi bi-camera-fill fs-4 text-white"></i></Link>
        </div>
        <Link to="/library" className={`text-center text-decoration-none d-flex flex-column align-items-center ${location.pathname.startsWith('/library') ? 'text-primary' : 'text-secondary'}`}>
          <i className={`bi bi-book${location.pathname.startsWith('/library') ? '-fill' : ''} fs-4`}></i>
          <span className="mobile-nav-label">Library</span>
        </Link>
        <button onClick={() => setIsMenuOpen(true)} className="btn border-0 d-flex flex-column align-items-center p-0 shadow-none">
          <div className={`rounded-circle border border-2 ${isMenuOpen ? 'border-primary' : 'border-light'} overflow-hidden shadow-sm`} style={{ width: '28px', height: '28px' }}>
            <img src={userData.photo} className="w-100 h-100 object-fit-cover" alt="User" />
          </div>
          <span className="text-secondary mobile-nav-label">Account</span>
        </button>
      </nav>

      {/* MOBILE ACCOUNT DRAWER */}
      <div className={`offcanvas offcanvas-bottom rounded-top-5 border-0 bg-light ${isMenuOpen ? "show" : ""}`}
        style={{
          height: "85vh",
          visibility: isMenuOpen ? "visible" : "hidden",
          zIndex: 900000,
          transition: '0.4s cubic-bezier(0.1, 0.7, 0.1, 1)'
        }}>

        <div className="offcanvas-header justify-content-center pt-3">
          <div className="bg-secondary opacity-25 rounded-pill" style={{ width: "40px", height: "5px" }} onClick={() => setIsMenuOpen(false)}></div>
        </div>

        <div className="offcanvas-body p-4 pt-0 custom-scrollbar">
          <h2 className="fw-bolder text-dark mb-3 mt-2">Account</h2>

          {/* PROFILE CARD: White background with Shadow */}
          <Link to={userData.dashboard} onClick={() => setIsMenuOpen(false)} className="text-decoration-none">
            <div className="d-flex align-items-center gap-3 p-3 bg-white rounded-4 mb-4 shadow-sm border border-white">
              <img src={userData.photo} className="rounded-circle border border-3 border-light shadow-sm" width="60" height="60" alt="Profile" />
              <div className="flex-grow-1">
                <h6 className="m-0 fw-bold text-dark fs-5">{userData.name}</h6>
                <span className="text-muted small">Go to dashboard</span>
              </div>
              <i className="bi bi-chevron-right text-muted opacity-50"></i>
            </div>
          </Link>

          <div className="ios-menu">
            {/* SECTION 1: ADMISSIONS (White Card style) */}
            <div className="ios-menu-section bg-white rounded-4 shadow-sm border border-white mb-3">
              <div className="ios-menu-title text-primary px-3 pt-3">Admission Portal</div>
              <Link to="/new-admission" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                <div className="ios-menu-item justify-content-between border-bottom border-light mx-2">
                  <div className="d-flex align-items-center gap-3">
                    <div className="ios-icon" style={{ background: 'linear-gradient(135deg, #0D6EFD, #0a58ca)' }}><i className="bi bi-person-plus-fill"></i></div>
                    <span className="fw-bold">New Admission 2026</span>
                  </div>
                  <i className="bi bi-chevron-right text-muted small"></i>
                </div>
              </Link>
              <Link to="/download-certificate" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                <div className="ios-menu-item justify-content-between mx-2">
                  <div className="d-flex align-items-center gap-3">
                    <div className="ios-icon" style={{ background: 'linear-gradient(135deg, #34C759, #11998e)' }}><i className="bi bi-patch-check-fill"></i></div>
                    <span className="fw-bold">Verify Certificate</span>
                  </div>
                  <i className="bi bi-chevron-right text-muted small"></i>
                </div>
              </Link>
            </div>

            {/* SECTION 2: ACADEMICS (White Card style) */}
            <div className="ios-menu-section bg-white rounded-4 shadow-sm border border-white mb-3">
              <div className="ios-menu-title px-3 pt-3">Academics</div>
              <div className="px-2">
                {courseLinks.map((link, index) => (
                  <Link key={link.to} to={link.to} className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    <div className={`ios-menu-item justify-content-between ${index !== courseLinks.length - 1 ? 'border-bottom border-light' : ''}`}>
                      <div className="d-flex align-items-center gap-3">
                        <div className="ios-icon" style={{ background: link.color }}><i className={`bi ${link.icon}`}></i></div>
                        <span>{link.label}</span>
                      </div>
                      <i className="bi bi-chevron-right text-muted small"></i>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* SECTION 3: INSTITUTE (White Card style) */}
            <div className="ios-menu-section bg-white rounded-4 shadow-sm border border-white mb-3">
              <div className="ios-menu-title px-3 pt-3">Institute Info</div>
              <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                <div className="ios-menu-item justify-content-between border-bottom border-light mx-2">
                  <div className="d-flex align-items-center gap-3">
                    <div className="ios-icon" style={{ background: 'linear-gradient(135deg, #007AFF, #00C7BE)' }}><i className="bi bi-building"></i></div>
                    <span>About Institute</span>
                  </div>
                  <i className="bi bi-chevron-right text-muted small"></i>
                </div>
              </Link>
              <Link to="/branch/thoothibari" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                <div className="ios-menu-item justify-content-between mx-2">
                  <div className="d-flex align-items-center gap-3">
                    <div className="ios-icon" style={{ background: 'linear-gradient(135deg, #5856D6, #AF52DE)' }}><i className="bi bi-diagram-3"></i></div>
                    <span>About Branch</span>
                  </div>
                  <i className="bi bi-chevron-right text-muted small"></i>
                </div>
              </Link>
            </div>

            {/* SECTION 4: SETTINGS (White Card style) */}
            <div className="ios-menu-section bg-white rounded-4 shadow-sm border border-white mt-4">
              <div className="ios-menu-title px-3 pt-3">App Settings</div>
              <div className="ios-menu-item no-hover justify-content-between border-bottom border-light mx-2">
                <div className="d-flex align-items-center gap-3">
                  <div className="ios-icon" style={{ background: 'linear-gradient(135deg, #FF9500, #FFCC00)' }}><i className="bi bi-translate"></i></div>
                  <span>Language</span>
                </div>
                <div className="language-wrapper-drawer"><LanguageTranslator /></div>
              </div>
              <div className="ios-menu-item no-hover justify-content-between mx-2">
                <div className="d-flex align-items-center gap-3">
                  <div className="ios-icon" style={{ background: 'linear-gradient(135deg, #555, #000)' }}><i className="bi bi-moon-stars-fill"></i></div>
                  <span>Dark Mode</span>
                </div>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" role="switch" id="darkModeSwitch" />
                </div>
              </div>
            </div>
          </div>

          {/* AUTH BUTTON */}
          <div className="mt-4 pb-4">
            {user ? (
              <button onClick={handleLogout} className="btn btn-white w-100 py-3 rounded-4 fw-bold text-danger shadow-sm border-0 active-scale">Sign Out</button>
            ) : (
              <button onClick={() => { setShowLoginModal(true); setIsMenuOpen(false); }} className="btn btn-primary w-100 py-3 rounded-4 fw-bold shadow active-scale">Login to Portal</button>
            )}
          </div>
        </div>
      </div>

      {/* --- LOGIN MODAL (ADD THIS BLOCK) --- */}
      {showLoginModal && (
        <div className="modal show d-block" style={{ zIndex: 30000 }} onClick={() => setShowLoginModal(false)}>
          <div className="modal-dialog modal-dialog-centered modal-sm p-3" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-content border-0 rounded-5 p-4 shadow-lg bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0 text-dark">Login</h4>
                <button className="btn-close shadow-none" onClick={() => setShowLoginModal(false)}></button>
              </div>

              <div className="btn-group w-100 mb-4 bg-light p-1 rounded-4">
                <button className={`btn rounded-4 fw-bold border-0 ${loginType === 'student' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                  onClick={() => setLoginType('student')}>Student</button>
                <button className={`btn rounded-4 fw-bold border-0 ${loginType === 'admin' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                  onClick={() => setLoginType('admin')}>Admin</button>
              </div>

              <LoginForm isAdminView={loginType === "admin"} onSuccess={() => setShowLoginModal(false)} isModal={true} />
            </div>
          </div>
        </div>
      )}

      {/* SEARCH OVERLAY */}
      {isSearchActive && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-white p-3" style={{ zIndex: 40000 }}>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-light rounded-circle" onClick={() => setIsSearchActive(false)}><i className="bi bi-arrow-left"></i></button>
            <div className="flex-grow-1"><GlobleSearchBox routes={RouteLinks} autoFocus onSelect={() => setIsSearchActive(false)} /></div>
          </div>
        </div>
      )}

      {(isMenuOpen || showLoginModal) && <div className="modal-backdrop fade show" style={{ zIndex: 20000 }} onClick={() => { setIsMenuOpen(false); setShowLoginModal(false); }}></div>}
    </>
  );
}