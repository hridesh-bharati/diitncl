import { useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Typed from "typed.js";

// Components
import TopCourseList from "./TopCourseList";
import Testimonial from "./Testimonial";
import Footer from "../Footer/Footer";
import QueryForm from "./pages/QueryFrom";
import NoticeBoard from "../HelperCmp/FeaturesUpdate/NoticeBoard";
import TimeTable from "../HelperCmp/FeaturesUpdate/TimeTable";
import CardSlider from "./Cardslider";

function Home() {
    const typedHero = useRef(null);

    useEffect(() => {
        if (typedHero.current) {
            const typed = new Typed(typedHero.current, {
                strings: ["Software Engineering", "Professional Accounting", "Graphic Designing", "Digital Literacy"],
                typeSpeed: 50,
                backSpeed: 30,
                loop: true
            });
            return () => typed.destroy();
        }
    }, []);

    return (
        <div className="hybrid-app-shell">

            {/* --- 1. PREMIUM HERO SECTION --- */}
            <section className="hybrid-hero mt-4 pt-3 rounded-1">
                <div className="hero-visual-layer"></div>
                <div className="hero-overlay-gradient"></div>

                <div className="container position-relative z-3">
                    <div className="row align-items-center min-vh-80">
                        <div className="col-lg-8 animate__animated animate__fadeInLeft">
                            <div className="status-badge">
                                <span className="pulse-icon"></span> Session 2026-27 Admissions Live
                            </div>
                            <h1 className="display-4 fw-black text-white mt-3">
                                Shape Your Future in <br />
                                <span className="text-warning small" ref={typedHero}></span>
                            </h1>
                            <p className="text-white-50 mb-4 pe-lg-5">
                                Join Drishtee India's most trusted IT Skill Hub. ISO 9001:2015 Certified excellence in education since 2007.
                            </p>
                            <div className="d-flex flex-wrap gap-3">
                                <Link to="/AdmissionForm" className="btn-main-gold">Get Started Today</Link>
                                <Link to="/Student-Portal" className="btn-main-glass">
                                    <i className="bi bi-person-badge me-2"></i>E-Student Portal
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 2. PORTAL HUB DASHBOARD --- */}
            <div className="container mt-minus-70">
                <div className="portal-hub-card shadow-lg border-0">
                    <div className="portal-grid">
                        {[
                            { label: "Verify ID", icon: "bi-shield-check", link: "/Verify-Certificate", bg: "#4F46E5" },
                            { label: "Results", icon: "bi-bar-chart-line", link: "/Student-Result", bg: "#0891B2" },
                            { label: "Study Material", icon: "bi-file-earmark-pdf", link: "/Library", bg: "#E11D48" },
                            { label: "Placements", icon: "bi-person-workspace", link: "/Placement", bg: "#F59E0B" },
                            { label: "LMS Login", icon: "bi-cpu-fill", link: "/login", bg: "#7C3AED" },
                            { label: "App Link", icon: "bi-phone-vibrate", link: "/download", bg: "#10B981" }
                        ].map((item, i) => (
                            <Link key={i} to={item.link} className="portal-item">
                                <div className="portal-icon-wrapper" style={{ '--icon-bg': item.bg }}>
                                    <i className={`bi ${item.icon}`}></i>
                                </div>
                                <span className="fw-bold small">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- ABOUT DRISHTEE : BOOTSTRAP ONLY --- */}
            <section className="container py-5 my-5">
                <div className="row align-items-center g-5">

                    {/* IMAGE SIDE */}
                    <div className="col-lg-6 position-relative">
                        <img
                            src="/images/mainSlider/slider1.webp"
                            alt="Drishtee Campus"
                            className="img-fluid rounded-4 shadow-lg w-100"
                        />

                        {/* EXPERIENCE BADGE */}
                        <div
                            className="position-absolute top-0 start-25 translate-middle bg-primary text-white text-center px-4 py-3 rounded-4 shadow"
                            style={{ left: "15%", top: "15%" }}
                        >
                            <h2 className="fw-bold mb-0">15+</h2>
                            <small className="text-uppercase fw-semibold">
                                Years of Excellence
                            </small>
                        </div>
                    </div>

                    {/* CONTENT SIDE */}
                    <div className="col-lg-6">
                        <span className="badge bg-primary-subtle text-primary text-uppercase fw-semibold mb-3">
                            About Drishtee
                        </span>

                        <h2 className="fw-bold display-6 mb-3">
                            A Legacy of Quality <br /> Technical Education
                        </h2>

                        <p className="text-secondary fs-5">
                            Founded in 2008, Drishtee Computer Centre has been at the forefront of
                            the digital revolution in the region.
                        </p>

                        <p className="text-muted mb-4">
                            As an ISO 9001:2015 certified institution, we focus on practical
                            knowledge over theory. Our industry-designed curriculum ensures every
                            student becomes <strong>job-ready</strong> from day one.
                        </p>

                        {/* FEATURES */}
                        <div className="row gy-3">
                            <div className="col-sm-6">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-check-circle-fill text-success fs-5"></i>
                                    <span className="fw-semibold">Modern IT Labs</span>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-check-circle-fill text-success fs-5"></i>
                                    <span className="fw-semibold">Job Portal Access</span>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-check-circle-fill text-success fs-5"></i>
                                    <span className="fw-semibold">Free Soft Skills</span>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-check-circle-fill text-success fs-5"></i>
                                    <span className="fw-semibold">Strong Alumni Network</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>


            {/* --- 4. THE VISIONARIES (Leadership - Light Theme) --- */}
            <section className="py-100 position-relative" style={{ backgroundColor: "#f8fafc" }}>
                <div className="container position-relative z-3">
                    <div className="text-center mb-5">
                        <h6 className="text-primary fw-bold text-uppercase tracking-widest">Institutional Leadership</h6>
                        <h2 className="display-5 fw-black text-dark">The Minds Behind Drishtee</h2>
                        <div className="mx-auto bg-warning mt-2" style={{ width: '60px', height: '4px', borderRadius: '10px' }}></div>
                    </div>

                    <div className="row g-4 justify-content-center">
                        {/* Ajay Tiwari Card */}
                        <div className="col-lg-5">
                            <div className="visionary-card-light">
                                <div className="visionary-image-wrapper">
                                    <img src="/images/team/team1.png" alt="Ajay Tiwari" />
                                    <div className="visionary-badge-gold">MD</div>
                                </div>
                                <div className="visionary-content-light">
                                    <h3 className="fw-black text-dark mb-1">Ajay Tiwari</h3>
                                    <p className="text-primary fw-bold small mb-3">Managing Director</p>
                                    <p className="text-muted fst-italic">"Our mission is to democratize high-end IT education and make every youth digitally independent."</p>
                                    <div className="social-links-vision mt-3">
                                        <i className="bi bi-linkedin me-2"></i>
                                        <i className="bi bi-envelope-fill"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Santosh Singh Card */}
                        <div className="col-lg-5">
                            <div className="visionary-card-light">
                                <div className="visionary-image-wrapper">
                                    <img src="/images/team/team2.png" alt="Santosh Singh Chauhan" />
                                    <div className="visionary-badge-gold">AD</div>
                                </div>
                                <div className="visionary-content-light">
                                    <h3 className="fw-black text-dark mb-1">Santosh Singh</h3>
                                    <p className="text-primary fw-bold small mb-3">Academic Director</p>
                                    <p className="text-muted fst-italic">"Quality education is about methodology. We bridge the gap between classroom and industry."</p>
                                    <div className="social-links-vision mt-3">
                                        <i className="bi bi-linkedin me-2"></i>
                                        <i className="bi bi-twitter-x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 5. INFRASTRUCTURE & FACILITIES --- */}
            <section className="container py-100">
                <div className="row align-items-center mb-5">
                    <div className="col-md-6">
                        <h2 className="fw-black display-6">World-Class Facilities</h2>
                        <div className="accent-bar-gold"></div>
                    </div>
                </div>
                <div className="facility-grid">
                    <div className="facility-item" style={{ backgroundImage: "url('/images/vender/lab.jpg')" }}>
                        <div className="item-label">High-Tech IT Lab</div>
                    </div>
                    <div className="facility-item" style={{ backgroundImage: "url('/images/vender/librarypic2.jpg')" }}>
                        <div className="item-label">Digital Library</div>
                    </div>
                    <div className="facility-item" style={{ backgroundImage: "url('/images/vender/classroom.jpg')" }}>
                        <div className="item-label">Smart Classrooms</div>
                    </div>
                </div>
            </section>

            {/* --- 6. CAMPUS DASHBOARD --- */}
            <section className="bg-light py-100">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="dashboard-widget p-2 h-100">
                                <h4 className="fw-black mb-4 text-dark"><i className="bi bi-broadcast text-danger me-2"></i>Campus Notice Board</h4>
                                <NoticeBoard />
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="dashboard-widget p-2 h-100 bg-white">
                                <h4 className="fw-black mb-4 text-dark"><i className="bi bi-clock-history text-primary me-2"></i>Batch Schedules</h4>
                                <TimeTable />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 7. COURSES & SLIDERS --- */}
            <section className="container py-100">
                <h2 className="display-6 fw-black text-center mb-2 text-primary">Job-Oriented Programs</h2>
                <TopCourseList />
                <div className="mt-5"><CardSlider /></div>
            </section>

            {/* --- 8. CTA SECTION --- */}
            <section className="container pb-100">
                <div className="conversion-card overflow-hidden">
                    <div className="row g-0">
                        <div className="col-lg-7 p-5 bg-gradient-blue text-white">
                            <h2 className="display-5 fw-black mb-4">Start Your Tech <br />Journey Today</h2>
                            <p className="opacity-75 mb-5">Connect with our counselors to find the best career path for you.</p>
                            <div className="d-flex gap-5">
                                <div><h3 className="fw-black mb-0">12k+</h3><small className="text-warning">Graduates</small></div>
                                <div><h3 className="fw-black mb-0">98%</h3><small className="text-warning">Placement</small></div>
                            </div>
                        </div>
                        <div className="col-lg-5 p-5 bg-white shadow">
                            <h4 className="fw-bold mb-4 text-dark">Enquire Now</h4>
                            <QueryForm />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            <style>{`
                
                :root { --p-blue: #061b5c; --a-gold: #f59e0b; }
                .hybrid-app-shell { overflow-x: hidden; color: #334155; }
                .fw-black { font-weight: 900; }
                .py-100 { padding: 90px 0; }
                .accent-bar-gold { width: 70px; height: 5px; background: var(--a-gold); border-radius: 10px; margin-top: 10px; }

                /* HERO */
                .hybrid-hero { position: relative; overflow: hidden; background: var(--p-blue); }
                .hero-visual-layer { position: absolute; inset: 0; background: url('images/mainSlider/slider1.webp') center/cover; opacity: 0.25; }
                .hero-overlay-gradient { position: absolute; inset: 0; background: linear-gradient(115deg, var(--p-blue) 45%, transparent 100%); }
                .status-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); padding: 8px 16px; border-radius: 50px; color: #fff; font-size: 13px; font-weight: 600; }
                .pulse-icon { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: pulse 1.8s infinite; }

                /* BUTTONS */
                .btn-main-gold { background: var(--a-gold); color: #000; padding: 16px 35px; border-radius: 12px; font-weight: 800; text-decoration: none; display: inline-block; transition: 0.3s; }
                .btn-main-glass { background: rgba(255,255,255,0.1); color: #fff; padding: 16px 35px; border-radius: 12px; font-weight: 600; text-decoration: none; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(10px); display: inline-block; }

                /* PORTAL GRID */
                .mt-minus-70 { margin-top: -70px; position: relative; z-index: 50; }
                .portal-hub-card { background: white; border-radius: 35px; padding: 40px; }
                .portal-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 15px; }
                .portal-item { text-decoration: none; color: #1e293b; text-align: center; }
                .portal-icon-wrapper { width: 60px; height: 60px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; background: #f1f5f9; color: var(--icon-bg); margin: 0 auto 12px; transition: 0.3s; }
                .portal-item:hover .portal-icon-wrapper { background: var(--icon-bg); color: white; transform: translateY(-5px); box-shadow: 0 10px 20px -5px var(--icon-bg); }

                /* VISIONARY LIGHT CARDS */
                .visionary-card-light {
                    background: #ffffff;
                    border-radius: 40px;
                    padding: 30px;
                    box-shadow: 0 15px 45px rgba(0,0,0,0.05);
                    display: flex;
                    align-items: center;
                    gap: 25px;
                    height: 100%;
                    border: 1px solid #edf2f7;
                    transition: 0.4s;
                }
                .visionary-card-light:hover { transform: translateY(-10px); border-color: var(--a-gold); }
                .visionary-image-wrapper { position: relative; flex-shrink: 0; }
                .visionary-image-wrapper img { width: 100px; height: auto; object-fit: cover; border-radius: 25px; }
                .visionary-badge-gold { position: absolute; top: -10px; left: -10px; background: var(--a-gold); color: #fff; padding: 4px 12px; border-radius: 10px; font-weight: 900; font-size: 11px; }

                /* FACILITY GRID */
                .facility-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: 300px; gap: 20px; }
                .facility-item { border-radius: 25px; background-size: cover; background-position: center; position: relative; overflow: hidden; }
                .item-label { position: absolute; bottom: 0; width: 100%; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); color: white; padding: 20px; font-weight: 700; }

                .dashboard-widget { background: #fff; border-radius: 25px; border: 1px solid #e2e8f0; }
                .conversion-card { border-radius: 35px; box-shadow: 0 30px 60px rgba(0,0,0,0.15); }
                .bg-gradient-blue { background: linear-gradient(135deg, var(--p-blue) 0%, #1e40af 100%); }

                @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); } 70% { box-shadow: 0 0 0 12px rgba(34, 197, 94, 0); } 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }
                @media (max-width: 992px) {
                    .portal-grid { grid-template-columns: repeat(3, 1fr); }
                    .visionary-card-light { flex-direction: column; text-align: center; }
                    .visionary-image-wrapper img { width: 100%; height: 220px; }
                    .facility-grid { grid-template-columns: 1fr; }
                }    
                    @media (max-width: 1200px) { 
    .facility-grid { grid-template-columns: repeat(2, 1fr); } /* 2 per row on tablet */
}
@media (max-width: 768px) {
    .facility-grid { grid-template-columns: 1fr; } /* 1 per row on mobile */
    .facility-item { aspect-ratio: auto; height: 220px; } /* fix height for mobile */
    .item-label { padding: 15px; font-size: 0.9rem; }
}
            `}</style>
        </div>
    );
}

export default Home;