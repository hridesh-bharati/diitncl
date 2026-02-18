import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Typed from "typed.js";
import "./Home.css";

// Components
import TopCourseList from "./TopCourseList";
import Footer from "../Footer/Footer";
import QueryForm from "./pages/QueryFrom";
import NoticeBoard from "../HelperCmp/FeaturesUpdate/NoticeBoard";
import TimeTable from "../HelperCmp/FeaturesUpdate/TimeTable";
import CardSlider from "./Cardslider";
import Team from "./Team";
import Testimonials from "./Testimonial";
<<<<<<< HEAD
import HomeOffers from "./pages/offers/HomeOffers";
=======
>>>>>>> 2d3ad1377860588c75becbdcae6c9eb0d009857d

function Home() {
    const typedElement = useRef(null);  
    const typedInstance = useRef(null); 

    useEffect(() => {

        typedInstance.current = new Typed(typedElement.current, {
           strings: [
          "Full Stack Training",
          "MERN Stack Course",
          "AI & Automation",
          "Modern Web Skills",
          "Job-Oriented Programs"
        ] ,
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: "|"
        });

        return () => {
            typedInstance.current?.destroy();
        };
    }, []);


    return (
        <div className="hybrid-app-shell animate__animated animate__fadeIn">
            {/* --- 1. PREMIUM HERO SECTION --- */}
            <section className="hybrid-hero mt-2 pt-2 rounded-1">
                <div className="hero-visual-layer"></div>
                <div className="hero-overlay-gradient"></div>

                <div className="container position-relative z-3">
                    <div className="row align-items-center min-vh-80">
                        <div className="col-lg-8 animate__animated animate__fadeInLeft">
                            <div className="status-badge">
                                <span className="pulse-icon"></span> Session 2026-27 Admissions Live
                            </div>
                            <h1 className="display-4 fw-bolder text-white mt-3">
                                Shape Your Future in <br />
                                <span className="text-warning" ref={typedElement}></span>
                            </h1>
                            <p className="text-white mb-4 pe-lg-5">
                                Join Drishtee India's most trusted IT Skill Hub. ISO 9001:2015 Certified excellence in education since 2007.
                            </p>
                            <div className="d-flex gap-3 mb-5 flex-nowrap">
                                <Link
                                    to="/new-admission"
                                    className="btn btn-warning fw-bold rounded-3 flex-fill py-3 shadow-sm text-center"
                                > Get Started
                                </Link>

                                <Link
                                    to="/login-as-member"
                                    className="btn btn-white bg-white fw-semibold rounded-3 flex-fill py-3" >E-Student Portal
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* --- 2. QUICK PORTAL HUB --- */}
            <div className="container mt-minus-70">
                <div className="portal-hub-card shadow shadow-md border-0">
                    <div className="portal-grid">
                        {[
                            { label: "Verify ID", icon: "bi-shield-check", link: "/Download-Certificate", bg: "#4F46E5" },
                            { label: "Results", icon: "bi-bar-chart-line", link: "/Download-Certificate", bg: "#0891B2" },
                            { label: "Study Material", icon: "bi-file-earmark-pdf", link: "/Library", bg: "#E11D48" },
                            { label: "Placements", icon: "bi-person-workspace", link: "/", bg: "#F59E0B" },
                            { label: "LMS Login", icon: "bi-cpu-fill", link: "/login-as-member", bg: "#7C3AED" },
                            { label: "App Link", icon: "bi-phone-vibrate", link: "/", bg: "#10B981" }
                        ].map((item, i) => (
                            <Link key={i} to={item.link} className="portal-item text-decoration-none">
                                <div className="portal-icon-wrapper" style={{ '--icon-bg': item.bg }}>
                                    <i className={`bi ${item.icon}`}></i>
                                </div>
                                <span className="fw-bold small text-dark">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container py-4">
                <div className="row align-items-center g-4">

                    <div className="col-lg-6 order-lg-2">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                            <img
                                src="images/vender/stds1.webp"
                                alt="Drishtee Education"
                                className="img-fluid w-100 object-fit-cover"
                                style={{ minHeight: '300px' }}
                            />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="col-lg-6 order-lg-1">
                        <div className="p-2">
                            <div className="text-center text-lg-start mb-3">
                                <span className="badge rounded-pill bg-primary-subtle text-primary text-uppercase px-3 py-2 fw-bold" style={{ fontSize: '0.75rem' }}>
                                    About Drishtee
                                </span>
                            </div>

                            <h2 className="fw-bold display-6 text-primary mb-3 text-start text-lg-start" style={{ lineHeight: '1.2' }}>
                                A Legacy of Quality <br className="d-none d-lg-block" /> Technical Education
                            </h2>

                            <p className="text-secondary fs-6 text-start text-lg-start mb-4">
                                Founded in 2007, <strong>Drishtee Computer Centre</strong> has been at the forefront of the digital revolution.
                            </p>

                            {/* Info Box */}
                            <div className="bg-light p-3 rounded-3 mb-4 border-start border-primary border-4 shadow-sm">
                                <p className="text-muted mb-0 small">
                                    <i className="bi bi-patch-check-fill text-primary me-2"></i>
                                    ISO 9001:2015 certified. Practical knowledge over theory. Industry-designed curriculum for <strong>job-ready</strong> students.
                                </p>
                            </div>

                            {/* Features Grid - 2 columns on mobile, 2 columns on PC */}
                            <div className="row g-2 mb-4">
                                {["Modern IT Labs", "Job Portal Access", "Free Soft Skills", "Strong Alumni Network"].map((feat, index) => (
                                    <div className="col-6" key={index}>
                                        <div className="d-flex align-items-center p-2 rounded-3 bg-white border border-light shadow-sm h-100">
                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            <span className="fw-bold text-dark" style={{ fontSize: '0.8rem' }}>{feat}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* App-style Action Button */}
                            <div className="d-grid d-lg-block">
                                <button className="btn btn-primary btn-lg px-5 py-3 rounded-3 fw-bold shadow-sm">
                                    <Link to="/About" className="nav-link">Learn More</Link>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- 4. LEADERSHIP --- */}
            <section className="py-100" style={{ backgroundColor: "#f8fafc" }}>
                <div className="container">
                    <div className="text-center mb-5">
                        <h6 className="text-primary fw-bold text-uppercase">Institutional Leadership</h6>
                        <h2 className="display-5 fw-bolder text-dark">The Minds Behind Drishtee</h2>
                        <div className="mx-auto bg-warning mt-2" style={{ width: '60px', height: '4px', borderRadius: '10px' }}></div>
                    </div>
                    <div className="row g-4 justify-content-center">
                        <div className="col-lg-5">
                            <div className="visionary-card-light">
                                <div className="visionary-image-wrapper">
                                    <img src="/images/team/team1.png" alt="Ajay Tiwari" loading="lazy" />
                                    <div className="visionary-badge-gold">MD</div>
                                </div>
                                <div className="visionary-content-light">
                                    <h3 className="fw-bolder text-dark mb-1">Ajay Tiwari</h3>
                                    <p className="text-primary fw-bold small mb-3">Managing Director</p>
                                    <p className="text-muted fst-italic">"Our mission is to democratize high-end IT education."</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="visionary-card-light">
                                <div className="visionary-image-wrapper">
                                    <img src="/images/team/team2.png" alt="Santosh Singh" loading="lazy" />
                                    <div className="visionary-badge-gold">AD</div>
                                </div>
                                <div className="visionary-content-light">
                                    <h3 className="fw-bolder text-dark mb-1">Santosh Singh</h3>
                                    <p className="text-primary fw-bold small mb-3">Academic Director</p>
                                    <p className="text-muted fst-italic">"We bridge the gap between classroom and industry."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 5. FACILITIES --- */}
            <section className="container py-100">
                <h2 className="fw-bolder display-6 mb-4">World-Class Facilities</h2>
                <div className="facility-grid">
                    <div className="facility-item" style={{ backgroundImage: "url('/images/vender/lab.jpg')" }}>
                        <div className="item-label">High-Tech IT Lab</div>
                    </div>
                    <div className="facility-item" style={{ backgroundImage: "url('/images/vender/librarypic2.jpg')" }}>
                        <div className="item-label">Digital Library</div>
                    </div>
                    <div className="facility-item" style={{ backgroundImage: "url('/images/vender/std1.jpg')" }}>
                        <div className="item-label">Smart Classrooms</div>
                    </div>
                </div>
            </section>

            {/* --- 6. DASHBOARD --- */}
            <section className="bg-light py-5">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="dashboard-widget p-3 bg-white rounded shadow-sm">
                                <h4 className="fw-bolder mb-3"><i className="bi bi-broadcast text-danger me-2"></i>Campus Notice Board</h4>
                                <NoticeBoard />
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="dashboard-widget p-3 bg-white rounded shadow-sm">
                                <h4 className="fw-bolder mb-3"><i className="bi bi-clock-history text-primary me-2"></i>Batch Schedules</h4>
                                <TimeTable />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

<<<<<<< HEAD

=======
>>>>>>> 2d3ad1377860588c75becbdcae6c9eb0d009857d
            {/* --- 7. COURSES --- */}
            <section className="container py-100">
                <h2 className="display-6 fw-bolder text-center mb-2 text-primary">Job-Oriented Programs</h2>
                <TopCourseList />
                <div className="mt-5"><CardSlider /></div>
            </section>
<<<<<<< HEAD
                    <HomeOffers />
=======
>>>>>>> 2d3ad1377860588c75becbdcae6c9eb0d009857d

            <Testimonials />
            <Team />

            {/* --- 8. CTA --- */}
            <section className="container-fluid mb-5">
                <div className="conversion-card rounded-4 overflow-hidden shadow-lg">
                    <div className="row g-0">
                        <div className="col-lg-4 p-5 bg-primary text-white">
                            <h2 className="display-6 fw-bolder mb-4">Start Your Tech Journey</h2>
                            <p className="opacity-75 mb-4">Connect with counselors for best career path.</p>
                            <div className="d-flex gap-4">
                                <div><h3 className="fw-bolder mb-0">12k+</h3><small>Graduates</small></div>
                                <div><h3 className="fw-bolder mb-0">98%</h3><small>Placement</small></div>
                            </div>
                        </div>
                        <div className="col-lg-8 bg-white p-4">
                            <QueryForm />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Home;
