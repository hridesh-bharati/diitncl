import { useState, useRef, useEffect, useMemo, useTransition, lazy, Suspense } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import GlobleSearchBox from "../GlobleSearch/GlobleSearchBox";
import RouteLinks from "../GlobleSearch/RouteLinks";
import LoginForm from "./LoginForm";
import DefaultAvatar from "../../Components/HelperCmp/DefaultAvatar/DefaultAvatar";
import "./Header.css";
import useDashboardData from "../../hooks/useAdminCounts";

// ✨ WhatsApp Optimization: Lazy Load
const LanguageTranslator = lazy(() => import("../LanguageTranslator/LanguageTranslator"));

export default function Header() {
  const { user, student, isAdmin, logout, photoURL, displayName } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showApps, setShowApps] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState("student");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [loadTranslator, setLoadTranslator] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { counts } = useDashboardData();
  const [clearedIds, setClearedIds] = useState(() => {
    return JSON.parse(localStorage.getItem("clearedNotifs")) || [];
  });
  const prefetchTranslator = () => {
    import("../LanguageTranslator/LanguageTranslator");
  };

  const getSmallPhoto = (url) => {
    if (!url || !url.includes("cloudinary")) return null;
    return url.replace("/upload/", "/upload/w_120,h_120,c_thumb,g_face,f_auto,q_auto/");
  };

  const userData = useMemo(() => ({
    name: displayName,
    email: student?.email || user?.email || "student@drishteeindia.com",
    photo: getSmallPhoto(photoURL),
    dashboard: isAdmin ? "/admin" : "/student"
  }), [displayName, student?.email, user?.email, photoURL, isAdmin]);

  // Combined Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (location.pathname === "/login") {
      setShowLoginModal(true);
    } else {
      setShowLoginModal(false);
    }
  }, [location.pathname]);

  // 🔥 NOTIFICATION LOGIC: Categorized and Conditional
  const notifications = useMemo(() => {
    if (!isAdmin || !counts) return [];
    const list = [];

    if (counts.today > 0) {
      list.push({
        id: 'adm',
        type: 'ADMISSION',
        title: `${counts.today} New Registration${counts.today > 1 ? 's' : ''}`,
        desc: 'New student enrollments received today.',
        icon: 'bi-person-plus-fill',
        link: '/admin/students',
        color: '#10b981'
      });
    }

    if (counts.queries > 0) {
      list.push({
        id: 'enq',
        type: 'ENQUIRY',
        title: `${counts.queries} Pending Enquiries`,
        desc: 'New support or admission queries from the website.',
        icon: 'bi-chat-left-dots-fill',
        link: '/admin/clients-contacts',
        color: '#f59e0b'
      });
    }

    if (counts.liveExams > 0) {
      list.push({
        id: 'exam_live',
        type: 'EXAM',
        title: 'Exams in Progress',
        desc: `${counts.liveExams} students are currently taking a live test.`,
        icon: 'bi-broadcast',
        link: '/admin/exams/live-tracking',
        color: '#ef4444'
      });
    }

    if (counts.newResults > 0) {
      list.push({
        id: 'practice_res',
        type: 'PRACTICE',
        title: 'Test Results Updated',
        desc: 'New practice test scores have been submitted.',
        icon: 'bi-clipboard-data-fill',
        link: '/admin/practice-tests/results',
        color: '#6366f1'
      });
    }

    return list;
  }, [counts, isAdmin]);

  const totalNotifCount = notifications.length;

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileMenu(false);
      setIsMenuOpen(false);
      navigate("/");
    } catch (error) { console.error("Logout error:", error); }
  };

  const isStudentDashboard = location.pathname.startsWith("/student");
  const isAdminDashboard = location.pathname.startsWith("/admin");

  const courseLinks = useMemo(() => [
    { to: "/courses", label: "All Courses", desc: "Explore our catalog.", icon: "bi-mortarboard", color: "linear-gradient(135deg, #34C759, #30D158)" },
    { to: "/certificate", label: "Certificate", desc: "Verify earned certifications.", icon: "bi-patch-check", color: "linear-gradient(135deg, #FF9500, #FFCC00)" },
    { to: "/courses/computer-language", label: "Languages", desc: "Master C++, Python, etc.", icon: "bi-code-slash", color: "linear-gradient(135deg, #5856D6, #AF52DE)" },
    { to: "/courses/designing", label: "Graphics", desc: "UI/UX & Creative Design.", icon: "bi-brush", color: "linear-gradient(135deg, #FF2D55, #FF375F)" },
    { to: "/courses/web-development", label: "Web Dev", desc: "Build modern websites.", icon: "bi-globe", color: "linear-gradient(135deg, #007AFF, #00BCD4)" },
    { to: "/courses/nielit", label: "NIELIT", desc: "CCC, O-Level Govt. courses.", icon: "bi-award", color: "linear-gradient(135deg, #FF3B30, #FF453A)" },
  ], []);

  const studentZoneLinks = useMemo(() => [
    { to: "/new-admission", label: "New Admission", icon: "bi-pencil-square", color: "linear-gradient(135deg, #007AFF, #054e9e)" },
    { to: "/download-certificate", label: "Verification", icon: "bi-shield-check", color: "linear-gradient(135deg, #34C759, #1a9638)" },
  ], []);

  const toggleMobileMenu = () => startTransition(() => setIsMenuOpen(!isMenuOpen));
  const openLogin = () => {
    startTransition(() => {
      setShowLoginModal(true);
      setIsMenuOpen(false);
    });
  };

  const handleClearAll = (e) => {
    e.stopPropagation();

    const allIds = notifications.map(n => n.id);
    const updated = [...new Set([...clearedIds, ...allIds])];

    setClearedIds(updated);
    localStorage.setItem("clearedNotifs", JSON.stringify(updated));
  };
  // Filtered notifications logic
  const activeNotifications = useMemo(() => {
    return notifications.filter(n => !clearedIds.includes(n.id));
  }, [notifications, clearedIds]);

  const handleDeleteSingle = (id, e) => {
    e.stopPropagation();
    const updated = [...clearedIds, id];
    setClearedIds(updated);
    localStorage.setItem("clearedNotifs", JSON.stringify(updated));
  };

  const totalCount = activeNotifications.length;

  return (
    <>
      {!isStudentDashboard && !isAdminDashboard && (
        <>
          <header className="google-header-advanced sticky-top bg-white">
            <div className="header-container container-fluid px-3 px-lg-4">
              <div className="header-left d-flex align-items-center w-auto">
                <Link to="/" className="logo d-flex align-items-center text-decoration-none me-lg-4">
                  <img src="/images/icon/logo.png" alt="Drishtee" height="32" loading="eager" />
                </Link>

                <nav className="nav-links d-none d-lg-flex mx-auto">
                  <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
                  <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>About</NavLink>

                  <div className="nav-item-dropdown position-relative pt-2">
                    <Link to="/courses" className={location.pathname.startsWith("/courses") ? "active" : ""}>
                      Courses <i className="bi bi-chevron-down small"></i>
                    </Link>
                    <div className="nav-dropdown-menu modern-grid-menu shadow-lg border-0">
                      <div className="dropdown-grid">
                        {courseLinks.map((link) => (
                          <Link key={link.to} to={link.to} className="grid-item d-flex align-items-start gap-3 p-3">
                            <div className="grid-icon flex-shrink-0" style={{ background: link.color }}>
                              <i className={`bi ${link.icon}`}></i>
                            </div>
                            <div className="d-flex flex-column">
                              <span className="fw-bold text-dark">{link.label}</span>
                              <small className="text-muted" style={{ fontSize: '11px', lineHeight: '1.2' }}>{link.desc}</small>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <NavLink to="/branch/thoothibari" className={({ isActive }) => isActive ? "active" : ""}>Branch</NavLink>
                  <NavLink to="/library" className={({ isActive }) => isActive ? "active" : ""}>Library</NavLink>

                  <div className="nav-item-dropdown position-relative mt-2">
                    <span className={`nav-static-link ${location.pathname.includes('admission') ? 'active' : ''}`}>
                      Student Zone <i className="bi bi-chevron-down small"></i>
                    </span>
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

                  <NavLink to="/gallery" className={({ isActive }) => isActive ? "active" : ""}>Gallery</NavLink>
                  <NavLink to="/contact-us" className={({ isActive }) => isActive ? "active" : ""}>Contact</NavLink>
                </nav>
              </div>

              <div className="searchBox w-100" style={{ maxWidth: '280px' }}>
                <GlobleSearchBox routes={RouteLinks} />
              </div>
              <Link to="/branch/nichlaul/location" className="fs-4 p-0 m-0">
                <i className="bi bi-geo-alt-fill text-danger"></i>
              </Link>

              <div className="header-right d-flex align-items-center gap-2 gap-md-3">

                {/* Notification Button */}
                {isAdmin && (
                  <div className="dropdown position-relative">

                    <button
                      className="btn border-0 bg-transparent p-2 position-relative"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i
                        className={`bi ${totalCount > 0
                          ? "bi-bell-fill text-secondary"
                          : "bi-bell text-secondary"
                          } fs-5`}
                      ></i>

                      {totalCount > 0 && (
                        <span
                          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white"
                          style={{ fontSize: "9px", marginTop: "8px", marginLeft: "-5px" }}
                        >
                          {totalCount}
                        </span>
                      )}
                    </button>

                    <div className="dropdown-menu dropdown-menu-end shadow-lg border-0 p-0 notification-panel">

                      {/* Header */}
                      <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-2 align-items-center">
                          <strong>Notifications</strong>
                          {totalCount > 0 && (
                            <span className="badge bg-primary rounded-pill">
                              {totalCount}
                            </span>
                          )}
                        </div>

                        {totalCount > 0 && (
                          <button
                            className="btn btn-sm text-danger border-0 p-0"
                            onClick={handleClearAll}
                          >
                            CLEAR
                          </button>
                        )}
                      </div>

                      {/* Body */}
                      <div style={{ maxHeight: "300px", overflowY: "auto", width: "320px" }}>
                        {activeNotifications.length > 0 ? (
                          activeNotifications.map((n) => (
                            <div
                              key={n.id}
                              className="dropdown-item p-3 border-bottom text-start position-relative"
                              onClick={() => navigate(n.link)}
                              style={{ cursor: "pointer" }}
                            >
                              {/* 🔥 DELETE BUTTON */}
                              <button
                                className="btn btn-sm text-danger position-absolute top-0 end-0 m-2 "
                                style={{ fontSize: "10px", lineHeight: "1" }}
                                onClick={(e) => handleDeleteSingle(n.id, e)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>

                              <div className="d-flex gap-3">
                                <div
                                  className="rounded-circle d-flex align-items-center justify-content-center"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    background: `${n.color}15`,
                                    color: n.color,
                                  }}
                                >
                                  <i className={`bi ${n.icon}`}></i>
                                </div>

                                <div style={{ paddingRight: "25px" }}>
                                  <div className="fw-bold" style={{ fontSize: "13px" }}>
                                    {n.title}
                                  </div>
                                  <small
                                    className="text-muted"
                                    style={{ fontSize: "9px", lineHeight: "1.2" }}
                                  >
                                    {n.desc}
                                  </small>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-muted">
                            <i className="bi bi-bell-slash fs-3"></i>
                            <p className="small mt-2">No notifications</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="apps-dropdown position-relative d-none d-lg-block">
                  <button className="google-apps border-0 bg-transparent p-2 rounded-circle" onClick={() => setShowApps(!showApps)}>
                    <i className="bi bi-grid-3x3-gap-fill fs-5 text-secondary"></i>
                  </button>
                  {showApps && (
                    <div className="apps-menu shadow-lg border-0 position-absolute end-0 mt-2 bg-white rounded-4 p-3">
                      <div className="apps-grid">
                        <Link to="/chat" className="app-item" onClick={() => setShowApps(false)}>
                          <i className="bi bi-chat-dots-fill text-primary"></i><span>Chat</span>
                        </Link>
                        <Link to="/photo-editor" className="app-item" onClick={() => setShowApps(false)}>
                          <i className="bi bi-camera-fill text-info"></i><span>Edit</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <div className="d-none d-lg-block">
                  {!user ? (
                    <button className="google-signin-btn btn btn-primary btn-sm" onClick={openLogin}>Login</button>
                  ) : (
                    <div className="profile-section" ref={profileRef}>
                      <div className="profile-badge d-flex align-items-center gap-2 cursor-pointer" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                        {userData.photo ? <img src={userData.photo} alt="profile" className="profile-image border shadow-sm" /> : <div style={{ width: 35, height: 35 }}><DefaultAvatar /></div>}
                      </div>
                      {showProfileMenu && (
                        <div className="profile-menu shadow-lg border-0 position-absolute end-0 mt-2 bg-white rounded-4 overflow-hidden">
                          <div className="profile-header p-4 text-center bg-light border-bottom">
                            <div className="mx-auto mb-2 overflow-hidden rounded-circle border border-3 border-white shadow" style={{ width: 65, height: 65 }}>
                              {userData.photo ? <img src={userData.photo} alt="user" className="w-100 h-100 object-fit-cover" /> : <DefaultAvatar />}
                            </div>
                            <h6 className="fw-bold m-0">{userData.name}</h6>
                            <p className="text-muted small m-0 text-truncate">{userData.email}</p>
                          </div>
                          <div className="menu-items p-2">
                            <Link to={userData.dashboard} onClick={() => setShowProfileMenu(false)}>
                              <i className="bi bi-person-circle text-primary"></i> Dashboard
                            </Link>
                            <button onClick={handleLogout} className="logout-btn w-100 border-0 bg-transparent text-start">
                              <i className="bi bi-box-arrow-right text-danger"></i> Sign out
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </header>
        </>
      )}

      {/* MOBILE ACCOUNT DRAWER */}
      <div className={`offcanvas offcanvas-bottom rounded-top-5 border-0 bg-light ${isMenuOpen ? "show" : ""}`}
        style={{ height: "85vh", visibility: isMenuOpen ? "visible" : "hidden", zIndex: 900000, transition: 'transform 0.4s cubic-bezier(0.1, 0.7, 0.1, 1)' }}>
        <div className="offcanvas-header justify-content-center pt-3" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-secondary opacity-25 rounded-pill" style={{ width: "40px", height: "5px" }}></div>
        </div>

        <div className="offcanvas-body p-4 pt-0 custom-scrollbar">
          <h2 className="fw-bolder text-dark mb-3 mt-2">Account & Dashboard</h2>
          <Link to={userData.dashboard} onClick={() => setIsMenuOpen(false)}>
            <div className="d-flex align-items-center gap-3 p-3 bg-white rounded-4 mb-4 shadow-sm border border-white">
              <div className="overflow-hidden rounded-circle border border-3 border-light shadow-sm" style={{ width: 60, height: 60 }}>
                {userData.photo ? <img src={userData.photo} className="w-100 h-100 object-fit-cover" alt="Profile" /> : <DefaultAvatar />}
              </div>
              <div className="flex-grow-1">
                <h6 className="m-0 fw-bold text-dark">{userData.name}</h6>
                <span className="text-muted small">Go to dashboard</span>
              </div>
              <i className="bi bi-chevron-right text-muted opacity-50"></i>
            </div>
          </Link>
          {/* 🔥 Quick Actions */}
          <div className="d-flex justify-content-between gap-2 mb-4">
            {[
              { to: userData.dashboard, icon: "bi-speedometer2", label: "Dashboard", color: "text-primary" },
              { to: "/photo-editor", icon: "bi-camera-fill", label: "Edit Photo", color: "text-warning" },
              { to: "/chat", icon: "bi-chat-dots-fill", label: "Chat", color: "text-success" },
            ].map((action, index) => (
              <Link
                key={index}
                to={action.to}
                onClick={() => setIsMenuOpen(false)}
                className="flex-fill text-decoration-none"
              >
                <div className="bg-white rounded-4 shadow-sm text-center py-3 border active-scale">
                  <i className={`bi ${action.icon} ${action.color} fs-5`}></i>
                  <div style={{ fontSize: "11px" }} className="fw-semibold mt-1 text-dark">
                    {action.label}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="ios-menu">
            <div className="ios-menu-section bg-white rounded-4 shadow-sm border border-white mb-3">
              <div className="ios-menu-title text-primary px-3 pt-3">Admission Portal</div>
              <Link to="/new-admission" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                <div className="ios-menu-item justify-content-between border-bottom border-light mx-2">
                  <div className="d-flex align-items-center gap-3">
                    <div className="ios-icon" style={{ background: 'linear-gradient(135deg, #0D6EFD, #0a58ca)' }}><i className="bi bi-person-plus-fill"></i></div>
                    New Admission
                  </div>
                  <i className="bi bi-chevron-right text-muted small"></i>
                </div>
              </Link>
              <Link to="/download-certificate" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                <div className="ios-menu-item justify-content-between mx-2">
                  <div className="d-flex align-items-center gap-3">
                    <div className="ios-icon" style={{ background: 'linear-gradient(135deg, #34C759, #11998e)' }}><i className="bi bi-patch-check-fill"></i></div>
                    Verify Certificate
                  </div>
                  <i className="bi bi-chevron-right text-muted small"></i>
                </div>
              </Link>
            </div>

            <div className="ios-menu-section bg-white rounded-4 shadow-sm border border-white mb-3">
              <div className="ios-menu-title text-primary px-3 pt-3">Academics</div>
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

            <div className="ios-menu-section bg-white rounded-4 shadow-sm border border-white mt-4">
              <div className="ios-menu-title text-primary px-3 pt-3">App Settings</div>
              <div className="ios-menu-item no-hover justify-content-between border-bottom border-light mx-2">
                <div className="d-flex align-items-center gap-3">
                  <div className="ios-icon" style={{ background: 'linear-gradient(135deg, #FF9500, #FFCC00)' }}><i className="bi bi-translate"></i></div>
                  <span>Language</span>
                </div>
                <div className="language-wrapper-drawer">
                  {!loadTranslator ? (
                    <button className="btn btn-light btn-sm rounded-pill px-3 fw-bold border" onMouseEnter={prefetchTranslator} onClick={() => setLoadTranslator(true)}>Change</button>
                  ) : (
                    <Suspense fallback={<small className="text-muted">Loading...</small>}>
                      <LanguageTranslator />
                    </Suspense>
                  )}
                </div>
              </div>
              <div className="ios-menu-item no-hover justify-content-between mx-2">
                <div className="d-flex align-items-center gap-3">
                  <div className="ios-icon" style={{ background: 'linear-gradient(135deg, #555, #000)' }}><i className="bi bi-moon-stars-fill"></i></div>
                  <span>Dark Mode</span>
                </div>
                <div className="form-check form-switch">
                  <input className="form-check-input shadow-none" type="checkbox" role="switch" id="darkModeSwitch" />
                </div>
              </div>
            </div>

            {/* Added Footer Legal Info in Drawer */}
            <div className="ios-menu-section bg-white rounded-4 shadow-sm border border-white mb-3">
              <div className="ios-menu-title text-primary px-3 pt-3">Support</div>
              <Link to="/contact-us" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                <div className="ios-menu-item justify-content-between mx-2">
                  <div className="d-flex align-items-center gap-3">
                    <div className="ios-icon" style={{ background: 'linear-gradient(135deg, #34C759, #30D158)' }}><i className="bi bi-envelope-fill"></i></div>
                    <span>Contact Us</span>
                  </div>
                  <i className="bi bi-chevron-right text-muted small"></i>
                </div>
              </Link>
            </div>
          </div>

          <div className="mt-4 pb-4">
            {user ? (
              <button onClick={handleLogout} className="btn btn-white bg-white w-100 py-3 rounded-4 fw-bold text-danger shadow-sm border-0">Sign Out</button>
            ) : (
              <button onClick={openLogin} className="btn btn-primary w-100 py-3 rounded-4 fw-bold shadow">Login to Portal</button>
            )}
          </div>
          <div className="w-100 text-center"><span>Version: {__APP_VERSION__}</span></div>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed-bottom d-lg-none d-flex justify-content-around align-items-center glass-nav-white" style={{ height: "65px", zIndex: 1000, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <NavLink to="/" className={({ isActive }) => `text-center text-decoration-none d-flex flex-column align-items-center ${isActive ? 'text-primary-active' : 'nav-text-color'}`}>
          <i className="bi bi-house-door fs-5"></i><span className="mobile-nav-label">Home</span>
        </NavLink>
        <NavLink to="/courses" className={({ isActive }) => `text-center text-decoration-none d-flex flex-column align-items-center ${isActive ? 'text-primary-active' : 'nav-text-color'}`}>
          <i className="bi bi-grid fs-5"></i><span className="mobile-nav-label">Course</span>
        </NavLink>
        <div className="position-relative" style={{ width: '60px' }}>
          <Link to="/gallery" className="btn custom-camera-btn-dark rounded-circle position-absolute start-50 translate-middle shadow-lg d-flex align-items-center justify-content-center" style={{ width: '58px', height: '58px', top: '-12px' }}>
            <i className="bi bi-camera-fill fs-4 text-white"></i>
          </Link>
        </div>
        <NavLink to="/library" className={({ isActive }) => `text-center text-decoration-none d-flex flex-column align-items-center ${isActive ? 'text-primary-active' : 'nav-text-color'}`}>
          <i className="bi bi-book fs-5"></i><span className="mobile-nav-label">Library</span>
        </NavLink>
        <button onClick={toggleMobileMenu} className="btn border-0 d-flex flex-column align-items-center p-0 shadow-none position-relative">
          <div className={`rounded-circle border border-2 ${isMenuOpen ? 'border-primary' : 'border-light'} overflow-hidden shadow-sm`} style={{ width: '28px', height: '28px' }}>
            {userData.photo ? <img src={userData.photo} className="w-100 h-100 object-fit-cover" alt="." /> : <DefaultAvatar />}
          </div>
          {/* 🔥 Mobile Notification Dot */}
          {isAdmin && totalNotifCount > 0 && (
            <span className="position-absolute bg-danger border border-white rounded-circle pulse-dot" style={{ width: '10px', height: '10px', top: '0', right: '12px' }}></span>
          )}
          <span className="nav-text-color mobile-nav-label">Account</span>
        </button>
      </nav>

      {/* MODALS */}
      {showLoginModal && (
        <div className="modal show d-block" style={{ zIndex: 30000 }} onClick={() => setShowLoginModal(false)}>
          <div className="modal-dialog modal-dialog-centered modal-sm p-3" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-content border-0 rounded-5 p-4 shadow-lg bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0 text-dark">Login</h4>
                <button className="btn-close shadow-none" onClick={() => setShowLoginModal(false)}></button>
              </div>
              <div className="btn-group w-100 mb-4 bg-light p-1 rounded-4">
                <button className={`btn rounded-4 fw-bold border-0 transition-all ${loginType === 'student' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`} onClick={() => setLoginType('student')}>Student</button>
                <button className={`btn rounded-4 fw-bold border-0 transition-all ${loginType === 'admin' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`} onClick={() => setLoginType('admin')}>Admin</button>
              </div>
              <LoginForm isAdminView={loginType === "admin"} onSuccess={() => setShowLoginModal(false)} isModal={true} />
            </div>
          </div>
        </div>
      )}

      {(isMenuOpen || showLoginModal) && (
        <div className="modal-backdrop fade show" style={{ zIndex: 20000 }} onClick={() => { setIsMenuOpen(false); setShowLoginModal(false); }}></div>
      )}
    </>
  );
}