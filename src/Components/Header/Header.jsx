import { useState, useRef, useEffect, useMemo, useTransition, lazy, Suspense } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import GlobleSearchBox from "../GlobleSearch/GlobleSearchBox";
import RouteLinks from "../GlobleSearch/RouteLinks";
import DefaultAvatar from "../../Components/HelperCmp/DefaultAvatar/DefaultAvatar";
import "./Header.css";
import useDashboardData from "../../hooks/useAdminCounts";

const LanguageTranslator = lazy(() => import("../LanguageTranslator/LanguageTranslator"));

export default function Header() {
  const { user, student, isAdmin, logout, photoURL, displayName } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showApps, setShowApps] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [loadTranslator, setLoadTranslator] = useState(false);

  const profileRef = useRef(null);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleClearAll = (e) => {
    e.stopPropagation();
    const allIds = notifications.map(n => n.id);
    const updated = [...new Set([...clearedIds, ...allIds])];
    setClearedIds(updated);
    localStorage.setItem("clearedNotifs", JSON.stringify(updated));
  };

  const activeNotifications = useMemo(() => {
    return notifications.filter(n => !clearedIds.includes(n.id));
  }, [notifications, clearedIds]);

  const totalCount = activeNotifications.length;

  const handleDeleteSingle = (id, e) => {
    e.stopPropagation();
    const updated = [...clearedIds, id];
    setClearedIds(updated);
    localStorage.setItem("clearedNotifs", JSON.stringify(updated));
  };

  const menuSections = [
    {
      title: "Admission Portal",
      items: [
        { to: "/new-admission", label: "New Admission", icon: "bi-person-plus-fill", color: "linear-gradient(135deg, #0D6EFD, #0a58ca)" },
        { to: "/download-certificate", label: "Verify Certificate", icon: "bi-patch-check-fill", color: "linear-gradient(135deg, #34C759, #11998e)" },
      ],
    },
    {
      title: "About",
      items: [
        { to: "/about", label: "About Institute", icon: "bi-info-circle-fill", color: "linear-gradient(135deg, #5856D6, #7F7FD5)" },
        { to: "/about-branch", label: "About Branch", icon: "bi-diagram-3-fill", color: "linear-gradient(135deg, #FF2D55, #FF6A88)" },
      ],
    },
    {
      title: "Academics",
      dynamic: true,
    },
    {
      title: "Support",
      items: [
        { to: "/contact-us", label: "Contact Us", icon: "bi-envelope-fill", color: "linear-gradient(135deg, #34C759, #30D158)" },
      ],
    },
  ];

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
                    <button className="btn border-0 bg-transparent p-2 position-relative" data-bs-toggle="dropdown" aria-expanded="false">
                      <i className={`bi ${totalCount > 0 ? "bi-bell-fill text-secondary" : "bi-bell text-secondary"} fs-5`}></i>
                      {totalCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{ fontSize: "9px", marginTop: "8px", marginLeft: "-5px" }}>
                          {totalCount}
                        </span>
                      )}
                    </button>

                    <div className="dropdown-menu dropdown-menu-end shadow-lg border-0 p-0 notification-panel">
                      <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-2 align-items-center">
                          <strong>Notifications</strong>
                          {totalCount > 0 && <span className="badge bg-primary rounded-pill">{totalCount}</span>}
                        </div>
                        {totalCount > 0 && (
                          <button className="btn btn-sm text-danger border-0 p-0" onClick={handleClearAll}>CLEAR</button>
                        )}
                      </div>

                      <div style={{ maxHeight: "300px", overflowY: "auto", width: "320px" }}>
                        {activeNotifications.length > 0 ? (
                          activeNotifications.map((n) => (
                            <div key={n.id} className="dropdown-item p-3 border-bottom text-start position-relative" onClick={() => navigate(n.link)} style={{ cursor: "pointer" }}>
                              <button className="btn btn-sm text-danger position-absolute top-0 end-0 m-2" style={{ fontSize: "10px", lineHeight: "1" }} onClick={(e) => handleDeleteSingle(n.id, e)}>
                                <i className="bi bi-trash"></i>
                              </button>
                              <div className="d-flex gap-3">
                                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: `${n.color}15`, color: n.color }}>
                                  <i className={`bi ${n.icon}`}></i>
                                </div>
                                <div style={{ paddingRight: "25px" }}>
                                  <div className="fw-bold" style={{ fontSize: "13px" }}>{n.title}</div>
                                  <small className="text-muted" style={{ fontSize: "9px", lineHeight: "1.2" }}>{n.desc}</small>
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
                    <Link to="/login" className="google-signin-btn btn btn-primary btn-sm">Login</Link>
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
        style={{
          height: "85vh",
          visibility: isMenuOpen ? "visible" : "hidden",
          zIndex: 900000,
          transition: 'transform 0.4s cubic-bezier(0.1, 0.7, 0.1, 1)',
          backgroundColor: '#f8f9fa'
        }}>

        {/* Drag Handle (Mobile UX) */}
        <div className="offcanvas-header justify-content-center pt-3 pb-0" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-dark opacity-10 rounded-pill" style={{ width: "40px", height: "5px" }}></div>
        </div>

        <div className="offcanvas-body p-4 pt-0 custom-scrollbar">
          <h2 className="fw-bolder text-dark mb-4 mt-2" style={{ letterSpacing: '-0.5px' }}>Account</h2>

          {/* Profile Section - Minimalist */}
          <Link to={userData.dashboard} onClick={() => setIsMenuOpen(false)} className="text-decoration-none">
            {/* Profile Section - FIXED */}
            <div className="d-flex align-items-center gap-3 p-2 mb-4">

              {/* Avatar */}
              <div
                className="overflow-hidden rounded-circle bg-white shadow-sm"
                style={{ width: 64, height: 64, border: "1px solid #e5e7eb" }}
              >
                {user && userData.photo ? (
                  <img
                    src={userData.photo}
                    className="w-100 h-100 object-fit-cover"
                    alt="Profile"
                  />
                ) : (
                  <DefaultAvatar />
                )}
              </div>

              {/* User Info */}
              <div className="flex-grow-1">

                {user ? (
                  <>
                    <Link
                      to={userData.dashboard}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-decoration-none"
                    >
                      <h5 className="m-0 fw-bold text-dark">
                        {userData.name || "User"}
                      </h5>

                      <span className="text-muted small">
                        View Dashboard
                      </span>
                    </Link>
                  </>
                ) : (
                  <>
                    <h5 className="m-0 fw-bold text-dark">
                      Guest User
                    </h5>

                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="btn btn-sm p-0 fw-bold shadow-none"
                      style={{ color: "#0A84FF", fontSize: "13px" }}
                    >
                      Login to continue <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </>
                )}

              </div>

              {/* Arrow only for logged user */}
              {user && <i className="bi bi-chevron-right text-muted small"></i>}

            </div>
          </Link>

          {/* Quick Action Tiles - Clean Transparent Style */}
          <div className="d-flex gap-3 mb-4">
            {[
              { to: "/photo-editor", icon: "bi-camera-fill", label: "Photo Resize", color: "text-warning" },
              { to: "/chat", icon: "bi-chat-dots-fill", label: "Community", color: "text-success" },
            ].map((action, index) => (
              <Link key={index} to={action.to} onClick={() => setIsMenuOpen(false)} className="text-decoration-none flex-fill">
                <div className="bg-white rounded-4 text-center py-3 border-0 shadow-none active-scale" style={{ minHeight: "80px" }}>
                  <i className={`bi ${action.icon} ${action.color} fs-4`}></i>
                  <div style={{ fontSize: "12px" }} className="fw-bold mt-1 text-dark">{action.label}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* iOS Style List Group */}
          <div className="ios-menu">
            {menuSections.map((section, sIndex) => (
              <div key={sIndex} className="mb-4">
                <div className="small text-uppercase fw-bold text-muted px-2 mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  {section.title}
                </div>
                <div className="bg-white rounded-4 overflow-hidden">
                  {section.dynamic ? (
                    courseLinks.map((link, index) => (
                      <Link key={link.to} to={link.to} className="text-decoration-none" onClick={() => setIsMenuOpen(false)}>
                        <div className={`d-flex align-items-center justify-content-between p-3 active-list-item ${index !== courseLinks.length - 1 ? 'border-bottom border-light' : ''}`}>
                          <div className="d-flex align-items-center gap-3">
                            <div className="ios-icon" style={{ background: link.color, width: '32px', height: '32px', borderRadius: '8px', display: 'grid', placeItems: 'center', color: '#fff' }}>
                              <i className={`bi ${link.icon}`}></i>
                            </div>
                            <span className="text-dark fw-medium">{link.label}</span>
                          </div>
                          <i className="bi bi-chevron-right text-muted small"></i>
                        </div>
                      </Link>
                    ))
                  ) : (
                    section.items?.map((item, index) => (
                      <Link key={item.to} to={item.to} className="text-decoration-none" onClick={() => setIsMenuOpen(false)}>
                        <div className={`d-flex align-items-center justify-content-between p-3 active-list-item ${index !== section.items.length - 1 ? 'border-bottom border-light' : ''}`}>
                          <div className="d-flex align-items-center gap-3">
                            <div className="ios-icon" style={{ background: item.color, width: '32px', height: '32px', borderRadius: '8px', display: 'grid', placeItems: 'center', color: '#fff' }}>
                              <i className={`bi ${item.icon}`}></i>
                            </div>
                            <span className="text-dark fw-medium">{item.label}</span>
                          </div>
                          <i className="bi bi-chevron-right text-muted small"></i>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            ))}

            {/* Settings Section */}
            <div className="mb-4">
              <div className="small text-uppercase fw-bold text-muted px-2 mb-2" style={{ fontSize: '0.7rem' }}>App Settings</div>
              <div className="bg-white rounded-4 overflow-hidden">
                <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-light">
                  <div className="d-flex align-items-center gap-3">
                    <div className="ios-icon" style={{ background: 'linear-gradient(135deg, #FF9500, #FFCC00)', width: '32px', height: '32px', borderRadius: '8px', display: 'grid', placeItems: 'center', color: '#fff' }}>
                      <i className="bi bi-translate"></i>
                    </div>
                    <span className="text-dark fw-medium">Language</span>
                  </div>
                  {!loadTranslator ? (
                    <button className="btn btn-light btn-sm rounded-pill px-3 fw-bold border-0" onClick={() => setLoadTranslator(true)}>Change</button>
                  ) : (
                    <Suspense fallback={<small>...</small>}><LanguageTranslator /></Suspense>
                  )}
                </div>
                <div className="d-flex align-items-center justify-content-between p-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="ios-icon" style={{ background: 'linear-gradient(135deg, #555, #000)', width: '32px', height: '32px', borderRadius: '8px', display: 'grid', placeItems: 'center', color: '#fff' }}>
                      <i className="bi bi-moon-stars-fill"></i>
                    </div>
                    <span className="text-dark fw-medium">Dark Mode</span>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input shadow-none" type="checkbox" role="switch" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Out - Native Look */}
          <div className="mt-2 pb-4">
            {user && (
              <button onClick={handleLogout} className="btn btn-white w-100 py-3 rounded-4 fw-bold text-danger border-0 mb-3 shadow-none">
                Sign Out
              </button>
            )}
            <div className="w-100 text-center text-muted small opacity-50">Version {__APP_VERSION__}</div>
          </div>
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
          {isAdmin && totalCount > 0 && (
            <span className="position-absolute bg-danger border border-white rounded-circle pulse-dot" style={{ width: '10px', height: '10px', top: '0', right: '12px' }}></span>
          )}
          <span className="nav-text-color mobile-nav-label">Account</span>
        </button>
      </nav>
    </>
  );
}