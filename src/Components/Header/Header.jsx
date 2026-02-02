import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authListener, logoutUser, getUserRole } from "../../firebase/auth";
import GlobleSearchBox from "../GlobleSearch/GlobleSearchBox";
import RouteLinks from "../GlobleSearch/RouteLinks";
import LoginForm from "./LoginForm";
import "./Header.css";

export default function Header() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginSheet, setShowLoginSheet] = useState(false);
  const [loginType, setLoginType] = useState("student");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [notifications] = useState(3);
  const [isNavVisible, setIsNavVisible] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const drawerRef = useRef(null);
  const searchRef = useRef(null);
  const lastScrollY = useRef(0);

  // Hide/show bottom nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsNavVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsNavVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (drawerRef.current && !drawerRef.current.contains(event.target) &&
        event.target.classList.contains('drawer-overlay')) {
        setIsMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target) &&
        isSearchExpanded && !event.target.closest('.search-input-wrapper')) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isSearchExpanded]);

  // Set active tab based on route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActiveTab("home");
    else if (path === "/About") setActiveTab("about");
    else if (path === "/OurCourses") setActiveTab("courses");
    else if (path.includes("dashboard")) setActiveTab("profile");
    else if (path === "/Contact-us") setActiveTab("contact");
  }, [location]);

  // Auth listener
  useEffect(() => {
    const unsubscribe = authListener(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRole = await getUserRole(currentUser.uid);
        setRole(userRole);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    setShowUserDropdown(false);
    setIsMenuOpen(false);
    navigate("/", { replace: true });
  }, [navigate]);

  const toggleLogin = (type) => {
    setLoginType(type);
    setShowLoginSheet(true);
  };

  const handleSearchSelect = () => {
    setIsSearchExpanded(false);
    setSearchQuery("");
  };

  const handleTabClick = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
  };



const brandNames = [
  "Drishtee Computer Center",
  "Empowering Digital Skills",
  "Enroll Today"
];


  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = brandNames[wordIndex];
    let timeout;

    if (!isDeleting && charIndex < currentWord.length) {
      // typing
      timeout = setTimeout(() => {
        setText(currentWord.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 100);
    }
    else if (isDeleting && charIndex > 0) {
      // deleting
      timeout = setTimeout(() => {
        setText(currentWord.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, 80);
    }
    else if (!isDeleting && charIndex === currentWord.length) {
      // pause after typing
      timeout = setTimeout(() => setIsDeleting(true), 900);
    }
    else if (isDeleting && charIndex === 0) {
      // move to next word
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % brandNames.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex]);


  if (loading) return <div className="skeleton-header"></div>;
  return (
    <>
      {/* DESKTOP NAVBAR */}
      <nav className={`navbar-desktop d-none d-lg-flex ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <img src="/images/icon/logo.png" alt="DIIT" />
            <span className="brand-text">DIIT</span>
          </Link>

          <ul className="nav-links">
            <li><Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link></li>
            <li><Link to="/About" className={location.pathname === "/About" ? "active" : ""}>About</Link></li>
            <li><Link to="/Branch" className={location.pathname === "/Branch" ? "active" : ""}>Branch</Link></li>
            <li><Link to="/OurCourses" className={location.pathname === "/OurCourses" ? "active" : ""}>Courses</Link></li>
            <li><Link to="/Library" className={location.pathname === "/Library" ? "active" : ""}>Library</Link></li>
            <li><Link to="/Gallery" className={location.pathname === "/Gallery" ? "active" : ""}>Gallery</Link></li>
          </ul>

          <div className="navbar-right d-flex align-items-center gap-3">
            <div className="desktop-search-wrapper">
              <GlobleSearchBox
                routes={RouteLinks}
                onSelect={handleSearchSelect}
                onChange={(val) => setSearchQuery(val)}
                value={searchQuery}
                autoClose={true}
              />
            </div>

            {!user ? (
              <div className="d-flex gap-2">
                <button className="btn-login admin" onClick={() => toggleLogin("admin")}>
                  <i className="bi bi-shield-lock me-1"></i> Admin
                </button>
                <button className="btn-login" onClick={() => toggleLogin("student")}>
                  <i className="bi bi-person-circle me-1"></i> Student Login
                </button>
              </div>
            ) : (
              <div className="user-nav-wrapper position-relative" ref={dropdownRef}>
                <div
                  className="user-avatar-wrapper d-flex align-items-center gap-2"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={user.photoURL || "/images/icon/default-avatar.png"}
                    className="nav-avatar"
                    alt="User"
                  />
                  <i className={`bi bi-chevron-down text-muted ${showUserDropdown ? 'rotate-180' : ''}`}></i>
                </div>

                {showUserDropdown && (
                  <div className="user-dropdown-card shadow-lg">
                    <div className="dropdown-header p-3 border-bottom">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <img
                          src={user.photoURL || "/images/icon/default-avatar.png"}
                          className="dropdown-avatar"
                          alt="User"
                        />
                        <div>
                          <h6 className="mb-0 fw-bold">{user.displayName || "User"}</h6>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </div>
                      <div className="role-badge">
                        {role === 'admin' ? 'Administrator' : 'Student'}
                      </div>
                    </div>

                    <div className="dropdown-body">
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          navigate(role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
                          setShowUserDropdown(false);
                        }}
                      >
                        <i className="bi bi-speedometer2 me-2"></i> Dashboard
                      </button>

                      <button
                        className="dropdown-item"
                        onClick={() => {
                          navigate('/profile');
                          setShowUserDropdown(false);
                        }}
                      >
                        <i className="bi bi-person me-2"></i> Profile
                      </button>

                      <button
                        className="dropdown-item"
                        onClick={() => {
                          navigate('/settings');
                          setShowUserDropdown(false);
                        }}
                      >
                        <i className="bi bi-gear me-2"></i> Settings
                      </button>

                      <div className="dropdown-divider"></div>

                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE HEADER - TOP BAR */}
      <header className={`mobile-header d-lg-none ${scrolled ? "scrolled" : ""} ${isSearchExpanded ? "search-active" : ""}`}>
        {!isSearchExpanded ? (
          <>

            <img src="/images/icon/logo.png" className="mobile-logo" alt="Brand" />
            <span className="mobile-title typing small">
              {text}
              <span className="cursor">|</span>
            </span>



            <div className="mobile-header-right" ref={searchRef}>
              {/* Search Button */}
              <button
                className="icon-btn search-btn"
                onClick={handleSearchClick}
                aria-label="Search"
              >
                <i className="bi bi-search"></i>
              </button>

              {/* Admin Login Button */}
              {!user && (
                <button
                  className="btn-admin-login"
                  onClick={() => toggleLogin("admin")}
                  aria-label="Admin Login"
                >
                  <i className="bi bi-shield-lock me-1"></i> Admin
                </button>
              )}

              {/* User Avatar - when logged in */}
              {user && (
                <div className="position-relative" ref={dropdownRef}>
                  <div className="avatar-notification-wrapper">
                    <img
                      src={user.photoURL || "/images/icon/default-avatar.png"}
                      className="mobile-avatar"
                      alt="User"
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                    />
                    {notifications > 0 && (
                      <span className="notification-dot"></span>
                    )}
                  </div>

                  {showUserDropdown && (
                    <div className="mobile-dropdown-menu">
                      <div className="dropdown-arrow"></div>
                      <div className="dropdown-user-info">
                        <img
                          src={user.photoURL || "/images/icon/default-avatar.png"}
                          alt="User"
                        />
                        <div>
                          <strong>{user.displayName || "User"}</strong>
                          <small>{user.email}</small>
                        </div>
                      </div>
                      <div className="dropdown-items">
                        <button onClick={() => {
                          navigate(role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
                          setShowUserDropdown(false);
                        }}>
                          <i className="bi bi-grid-fill me-2"></i> Dashboard
                        </button>
                        <button onClick={() => { navigate('/notifications'); setShowUserDropdown(false); }}>
                          <i className="bi bi-bell me-2"></i> Notifications
                          {notifications > 0 && <span className="notification-count">{notifications}</span>}
                        </button>
                        <button onClick={() => { navigate('/settings'); setShowUserDropdown(false); }}>
                          <i className="bi bi-gear me-2"></i> Settings
                        </button>
                        <button onClick={handleLogout} className="logout-btn">
                          <i className="bi bi-power me-2"></i> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="mobile-search-container">
            <button
              className="icon-btn back-btn"
              onClick={() => setIsSearchExpanded(false)}
              aria-label="Back"
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            <div className="search-input-wrapper">
              <GlobleSearchBox
                routes={RouteLinks}
                onSelect={handleSearchSelect}
                onChange={(val) => setSearchQuery(val)}
                value={searchQuery}
                autoFocus={true}
                variant="mobile"
              />
            </div>
            <button
              className="cancel-search"
              onClick={() => setIsSearchExpanded(false)}
              aria-label="Cancel"
            >
              Cancel
            </button>
          </div>
        )}
      </header>

      {/* MOBILE BOTTOM NAVIGATION - Enhanced Colorful Design */}
      <nav className={`mobile-bottom-nav d-lg-none ${isNavVisible ? 'visible' : 'hidden'} ${notifications > 0 ? 'has-notifications' : ''}`}>
        {/* Home - Blue */}
        <button
          onClick={() => handleTabClick("home", "/")}
          className={`nav-tab ${activeTab === "home" ? "active" : ""}`}
          aria-label="Home"
        >
          <div className="tab-icon">
            <i className="bi bi-house-door"></i>
          </div>
          <span className="tab-label">Home</span>
        </button>

        {/* About - Purple */}
        <button
          onClick={() => handleTabClick("about", "/About")}
          className={`nav-tab ${activeTab === "about" ? "active" : ""}`}
          aria-label="About"
        >
          <div className="tab-icon">
            <i className="bi bi-info-circle"></i>
          </div>
          <span className="tab-label">About</span>
        </button>

        {/* Contact - Teal (थोड़ा ऊपर side) */}
        <button
          onClick={() => handleTabClick("contact", "/Contact-us")}
          className={`nav-tab contact-tab ${activeTab === "contact" ? "active" : ""}`}
          aria-label="Contact"
        >
          <div className="tab-icon">
            <i className="bi bi-telephone"></i>
          </div>
          <span className="tab-label">Contact</span>
        </button>

        {/* Login/Profile - Green */}
        <button
          onClick={() => {
            if (user) {
              handleTabClick("profile", "/profile");
            } else {
              toggleLogin("student");
            }
          }}
          className={`nav-tab login-tab ${activeTab === "profile" ? "active" : ""} ${notifications > 0 ? 'has-notifications' : ''}`}
          aria-label={user ? "Profile" : "Login"}
        >
          <div className="tab-icon">
            {user ? (
              <img
                src={user.photoURL || "/images/icon/default-avatar.png"}
                className="profile-avatar"
                alt="Profile"
              />
            ) : (
              <i className="bi bi-person-circle"></i>
            )}
          </div>
          <span className="tab-label">{user ? "Profile" : "Login"}</span>
        </button>

        {/* Menu - Orange */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className={`nav-tab menu-tab ${isMenuOpen ? "active" : ""}`}
          aria-label="Menu"
        >
          <div className="tab-icon">
            <i className="bi bi-list"></i>
          </div>
          <span className="tab-label">Menu</span>
        </button>
      </nav>

      {/* SIDE DRAWER - 50% WIDTH */}
      <div className={`side-drawer ${isMenuOpen ? "open" : ""}`} ref={drawerRef}>
        <div className="drawer-overlay" onClick={() => setIsMenuOpen(false)}></div>
        <div className="drawer-container">
          <div className="drawer-header">
            <div className="drawer-brand">
              <img src="/images/icon/logo.png" alt="DIIT" />
              <div>
                <h3>DIIT Education</h3>
                <p>Learn Anytime, Anywhere</p>
              </div>
            </div>

            {user ? (
              <div className="drawer-user">
                <img
                  src={user.photoURL || "/images/icon/default-avatar.png"}
                  alt="User"
                />
                <div>
                  <h4>{user.displayName || "Student"}</h4>
                  <p>{user.email}</p>
                  <span className="user-role">{role === 'admin' ? 'Admin' : 'Student'}</span>
                </div>
              </div>
            ) : (
              <div className="drawer-login">
                <p>Login to access all features</p>
                <div className="drawer-login-buttons">
                  <button className="btn-admin-sm" onClick={() => toggleLogin("admin")}>
                    <i className="bi bi-shield-lock"></i> Admin
                  </button>
                  <button className="btn-student-sm" onClick={() => toggleLogin("student")}>
                    <i className="bi bi-person"></i> Student
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="drawer-body">
            <div className="drawer-section">
              <h6>MAIN MENU</h6>
              <Link to="/" className="drawer-item" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-house"></i>
                <span>Home</span>
              </Link>
              <Link to="/About" className="drawer-item" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-info-circle"></i>
                <span>About Us</span>
              </Link>
              <Link to="/OurCourses" className="drawer-item" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-book"></i>
                <span>All Courses</span>
              </Link>
              <Link to="/Library" className="drawer-item" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-bookmark-star"></i>
                <span>Library</span>
              </Link>
              <Link to="/Gallery" className="drawer-item" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-images"></i>
                <span>Gallery</span>
              </Link>
            </div>

            {user && (
              <div className="drawer-section">
                <h6>MY ACCOUNT</h6>
                <Link to={role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="drawer-item" onClick={() => setIsMenuOpen(false)}>
                  <i className="bi bi-speedometer2"></i>
                  <span>Dashboard</span>
                </Link>
                <Link to="/my-courses" className="drawer-item" onClick={() => setIsMenuOpen(false)}>
                  <i className="bi bi-journal-check"></i>
                  <span>My Courses</span>
                </Link>
                <Link to="/assignments" className="drawer-item" onClick={() => setIsMenuOpen(false)}>
                  <i className="bi bi-clipboard-check"></i>
                  <span>Assignments</span>
                </Link>
                <Link to="/certificates" className="drawer-item" onClick={() => setIsMenuOpen(false)}>
                  <i className="bi bi-award"></i>
                  <span>Certificates</span>
                </Link>
              </div>
            )}

            <div className="drawer-section">
              <h6>SUPPORT</h6>
              <Link to="/Contact-us" className="drawer-item" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-telephone"></i>
                <span>Contact Us</span>
              </Link>
              <Link to="/faq" className="drawer-item" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-question-circle"></i>
                <span>FAQ</span>
              </Link>
              <Link to="/help" className="drawer-item" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-headset"></i>
                <span>Help Center</span>
              </Link>
              {user && (
                <Link to="/settings" className="drawer-item" onClick={() => setIsMenuOpen(false)}>
                  <i className="bi bi-gear"></i>
                  <span>Settings</span>
                </Link>
              )}
            </div>

            {user && (
              <div className="drawer-section">
                <button
                  className="drawer-item logout"
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          <div className="drawer-footer">
            <div className="social-links">
              <a href="#" className="social-icon"><i className="bi bi-facebook"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-twitter"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-instagram"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-linkedin"></i></a>
            </div>
            <div className="app-version">
              <p>© {new Date().getFullYear()} DIIT Education</p>
            </div>
          </div>
        </div>
      </div>

      {/* LOGIN BOTTOM SHEET */}
      {showLoginSheet && (
        <div className="login-bottom-sheet">
          <div className="sheet-overlay" onClick={() => setShowLoginSheet(false)}></div>
          <div className="sheet-container">
            <div className="sheet-handle"></div>
            <div className="sheet-header">
              <h4>{loginType === "admin" ? "Admin Login" : "Student Login"}</h4>
              <button className="close-sheet" onClick={() => setShowLoginSheet(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="sheet-content">
              <LoginForm
                isAdminView={loginType === "admin"}
                onSuccess={() => setShowLoginSheet(false)}
                hideSignup={loginType === "admin"}
                variant="mobile"
              />
            </div>
            <div className="sheet-footer">
              <p>By continuing, you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a></p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}