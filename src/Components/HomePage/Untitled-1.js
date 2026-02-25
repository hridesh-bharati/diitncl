import { Link } from "react-router-dom";
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
import HomeOffers from "./pages/offers/HomeOffers";
import Features from "./Features"

function Home() {
    return (
        <div className="hybrid-app-shell animate__animated animate__fadeIn">
            {/* --- 1. HERO SECTION --- */}
            <section className="hybrid-hero mt-1  mt-lg-0 pt-lg-0 rounded-1">
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
                                {/* Typing Animation Target */}
                                <span className="text-warning typing-text"></span>
                            </h1>
                            <p className="text-white mb-4 pe-lg-5">
                                Join Drishtee India's most trusted IT Skill Hub. ISO 9001:2015 Certified excellence in education since 2007.
                            </p>
                            <div className="d-flex gap-3 mb-5 flex-nowrap">
                                <Link to="/new-admission" className="btn btn-warning fw-bold rounded-3 flex-fill py-3 shadow-sm text-center"> Get Started </Link>
                                <Link to="/login" className="btn btn-white bg-white fw-semibold rounded-3 flex-fill py-3">E-Student Portal</Link>
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
                            <Link key={i} to={item.link} className="portal-item text-decoration-none text-center">
                                <div className="portal-icon-wrapper" style={{ '--icon-bg': item.bg }}>
                                    <i className={`bi ${item.icon}`}></i>
                                </div>
                                <span className="fw-bold small text-dark">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- 3. ABOUT SECTION --- */}
            <div className="container py-4">
                <div className="row align-items-center g-4">
                    <div className="col-lg-6 order-lg-2">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                            <img src="images/vender/stds1.webp" alt="Drishtee Education" className="img-fluid w-100 object-fit-cover" style={{ minHeight: '300px' }} loading="lazy" />
                        </div>
                    </div>
                    <div className="col-lg-6 order-lg-1">
                        <div className="p-2">
                            <div className="text-center text-lg-start mb-3">
                                <span className="badge rounded-pill bg-primary-subtle text-primary text-uppercase px-3 py-2 fw-bold" style={{ fontSize: '0.75rem' }}>About Drishtee</span>
                            </div>
                            <h2 className="fw-bold display-6 text-primary mb-3 text-start text-lg-start" style={{ lineHeight: '1.2' }}>A Legacy of Quality <br className="d-none d-lg-block" /> Technical Education</h2>
                            <p className="text-secondary fs-6 text-start text-lg-start mb-4">Founded in 2007, <strong>Drishtee Computer Centre</strong> has been at the forefront of the digital revolution.</p>

                            <div className="bg-light p-3 rounded-3 mb-4 border-start border-primary border-4 shadow-sm">
                                <p className="text-muted mb-0 small"><i className="bi bi-patch-check-fill text-primary me-2"></i>ISO 9001:2015 certified. Practical knowledge over theory. Industry-designed curriculum.</p>
                            </div>

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
                            <div className="d-grid d-lg-block">
                                <Link to="/about" className="btn btn-primary btn-lg px-5 py-3 rounded-3 fw-bold shadow-sm">Learn More</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Features />
            
            {/* --- 4. LEADERSHIP --- */}
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="text-center mb-5">
                        <h6 className="text-primary fw-bold text-uppercase small">Institutional Leadership</h6>
                        <h2 className="display-6 fw-bold text-dark">The Minds Behind Drishtee</h2>
                        <div className="mx-auto bg-warning mt-2" style={{ width: '60px', height: '4px', borderRadius: '10px' }}></div>
                    </div>

                    <div className="row g-4 justify-content-center">
                        {[
                            {
                                name: "Ajay Tiwari",
                                role: "Managing Director",
                                img: "/images/team/team1.avif",
                                badge: "MD",
                                quote: "Our mission is to democratize high-end IT education."
                            },
                            {
                                name: "Santosh Singh",
                                role: "Academic Director",
                                img: "/images/team/team2.avif",
                                badge: "AD",
                                quote: "We bridge the gap between classroom and industry."
                            }
                        ].map((leader, index) => (
                            <div className="col-lg-5 col-md-6" key={index}>
                                <div className="card h-100 border-0 shadow-sm rounded-4 p-3 bg-white">
                                    <div className="row align-items-center g-0">
                                        <div className="col-sm-4 text-center">
                                            <div className="position-relative d-inline-block">
                                                <img
                                                    src={leader.img}
                                                    alt={leader.name}
                                                    className="img-fluid rounded-circle border border-3 border-light shadow-sm"
                                                    style={{ width: '110px', height: '110px', objectFit: 'cover' }}
                                                    loading="lazy"
                                                />
                                                <span className="position-absolute bottom-0 end-0 badge rounded-pill bg-warning text-dark fw-bold border border-white shadow-sm" style={{ fontSize: '10px' }}>
                                                    {leader.badge}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-sm-8 p-3 text-center text-sm-start">
                                            <h5 className="fw-bold mb-0 text-dark">{leader.name}</h5>
                                            <p className="text-primary small fw-semibold mb-2">{leader.role}</p>
                                            <p className="text-muted fst-italic mb-0" style={{ fontSize: '0.85rem' }}>
                                                <i className="bi bi-quote me-1"></i>{leader.quote}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 5. FACILITIES --- */}
            <section className="container py-5">
                <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary me-3" style={{ width: '5px', height: '35px', borderRadius: '10px' }}></div>
                    <h2 className="fw-bolder display-6 m-0">World-Class Facilities</h2>
                </div>

                <div className="row g-3">
                    {[
                        { title: "High-Tech IT Lab", img: "/images/vender/lab.jpg" },
                        { title: "Digital Library", img: "/images/vender/librarypic2.jpg" },
                        { title: "Smart Classrooms", img: "/images/vender/std1.jpg" }
                    ].map((item, index) => (
                        <div key={index} className="col-md-4">
                            <div className="rounded-4 overflow-hidden position-relative shadow-sm" style={{ height: '250px' }}>
                                <img src={item.img} alt={item.title} className="w-100 h-100 object-fit-cover transition-all" loading="lazy" />
                                <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                                    <h5 className="text-white fw-bold mb-0">{item.title}</h5>
                                </div>
                            </div>
                        </div>
                    ))}
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

            {/* --- 7. COURSES & OFFERS --- */}
            <section className="container py-100">
                <h2 className="display-6 fw-bolder text-center mb-2 text-primary">Job-Oriented Programs</h2>
                <TopCourseList />
                <div className="mt-5"><CardSlider /></div>
            </section>

            <HomeOffers />
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