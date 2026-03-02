import React from "react";
import { Link } from "react-router-dom";
import useTypingEffect from "../../hooks/useTypingEffect";
import "./Home.css";

// Components
import TopCourseList from "./TopCourseList";
import Footer from "../Footer/Footer";
import QuickSupport from "./pages/About/QuickSupport";
import NoticeBoard from "../HelperCmp/FeaturesUpdate/NoticeBoard";
import TimeTable from "../HelperCmp/FeaturesUpdate/TimeTable";
import CardSlider from "./Cardslider";
import Team from "./Team";
import Testimonials from "./Testimonial";
import HomeOffers from "./pages/offers/HomeOffers";
import Features from "./Features";
import ScrollUp from "../HelperCmp/Scroller/ScrollUp";

function Home() {
    const typingWords = ["Full Stack Training", "MERN Stack Course", "AI & Automation", "Modern Web Skills", "Job-Oriented Programs"];
    const typingText = useTypingEffect(typingWords, 80, 50, 1500);

    return (
        <div className="hybrid-app-shell animate__animated animate__fadeIn">
            {/* 1. HERO SECTION */}
            <section className="hybrid-hero">
                <div className="hero-visual-layer"></div>
                <div className="hero-overlay-gradient"></div>
                <div className="container position-relative z-3">
                    <div className="row align-items-center min-vh-75">
                        <div className="col-lg-8 animate__animated animate__fadeInLeft">
                            <div className="status-badge">
                                <span className="pulse-icon"></span> Session 2026-27 Admissions Live
                            </div>
                            <h1 className="display-4 fw-bolder text-white mt-3">
                                Shape Your Future in <br />
                                <span className="text-warning typing-cursor">{typingText}</span>
                            </h1>
                            <p className="text-white mb-4 pe-lg-5 opacity-75">
                                Join Drishtee India's most trusted IT Skill Hub. ISO 9001:2015 Certified excellence since 2007.
                            </p>
                            <div className="d-flex gap-3 mb-5">
                                <Link to="/new-admission" className="btn btn-warning fw-bold rounded-3 flex-fill py-3 shadow-sm text-center"> Get Started </Link>
                                <Link to="/login" className="btn btn-white bg-white fw-semibold rounded-3 flex-fill py-3 text-center">E-Student Portal</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. QUICK PORTAL HUB */}
            <div className="container mt-minus-70 ">
                <div className="portal-hub-card shadow-lg border-0 mt-2">
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
                                <div className="portal-icon-wrapper" style={{ '--icon-bg': item.bg, color: item.bg }}>
                                    <i className={`bi ${item.icon}`}></i>
                                </div>
                                <span className="fw-bold small text-dark">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. ABOUT SECTION */}
            <div className="container py-5 mt-4">
                <div className="row align-items-center g-4">
                    <div className="col-lg-6 order-lg-2">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                            <img src="images/vender/homepic.webp" alt="Drishtee Education" className="img-fluid w-100 "  loading="lazy" />
                        </div>
                    </div>
                    <div className="col-lg-6 order-lg-1">
                        <span className="badge rounded-pill bg-primary-subtle text-primary text-uppercase px-3 py-2 fw-bold mb-3">About Drishtee</span>
                        <h2 className="fw-bold display-6 text-primary mb-3">A Legacy of Quality Technical Education</h2>
                        <p className="text-secondary">Founded in 2007, <strong>Drishtee Computer Centre</strong> has been at the forefront of the digital revolution.</p>
                        <div className="row g-2 mb-4">
                            {["Modern IT Labs", "Job Portal Access", "Free Soft Skills", "Strong Alumni Network"].map((feat, index) => (
                                <div className="col-6" key={index}>
                                    <div className="d-flex align-items-center p-2 rounded-3 bg-white border shadow-sm">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        <span className="fw-bold text-dark small">{feat}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link to="/about" className="btn btn-primary btn-lg px-5 py-3 rounded-3 fw-bold">Learn More</Link>
                    </div>
                </div>
            </div>

            <Features />

            {/* 4. LEADERSHIP */}
            <section className="py-5 bg-light">
                <div className="container text-center mb-5">
                    <h6 className="text-primary fw-bold text-uppercase small">Institutional Leadership</h6>
                    <h2 className="display-6 fw-bold text-dark">The Minds Behind Drishtee</h2>
                    <div className="row g-4 justify-content-center mt-4">
                        {[
                            { name: "Ajay Tiwari", role: "Managing Director", img: "/images/team/team1.avif", badge: "MD", quote: "Our mission is to democratize high-end IT education." },
                            { name: "Santosh Singh", role: "Academic Director", img: "/images/team/team2.avif", badge: "AD", quote: "We bridge the gap between classroom and industry." }
                        ].map((leader, index) => (
                            <div className="col-lg-5 col-md-6" key={index}>
                                <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                                    <div className="row align-items-center g-0">
                                        <div className="col-sm-4 text-center">
                                            <img src={leader.img} alt={leader.name} className="img-fluid rounded-circle border border-3 shadow-sm" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                        </div>
                                        <div className="col-sm-8 p-3 text-start">
                                            <h5 className="fw-bold mb-0 text-dark">{leader.name}</h5>
                                            <p className="text-primary small fw-semibold mb-2">{leader.role}</p>
                                            <p className="text-muted fst-italic mb-0 small"><i className="bi bi-quote me-1"></i>{leader.quote}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. FACILITIES */}
            <section className="container py-5">
                <h2 className="fw-bolder display-6 mb-4 border-start border-primary border-4 ps-3">World-Class Facilities</h2>
                <div className="row g-3">
                    {[
                        { title: "High-Tech IT Lab", img: "/images/vender/lab.jpg" },
                        { title: "Digital Library", img: "/images/vender/librarypic2.jpg" },
                        { title: "Smart Classrooms", img: "/images/vender/std1.jpg" }
                    ].map((item, index) => (
                        <div key={index} className="col-md-4">
                            <div className="rounded-4 overflow-hidden position-relative shadow-sm" style={{ height: '250px' }}>
                                <img src={item.img} alt={item.title} className="w-100 h-100 object-fit-cover" loading="lazy" />
                                <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-dark bg-opacity-50">
                                    <h5 className="text-white fw-bold mb-0">{item.title}</h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6. DASHBOARD */}
            <section className="bg-light-subtle py-5 border-top border-bottom">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="bg-white p-4 rounded shadow-sm h-100"><NoticeBoard /></div>
                        </div>
                        <div className="col-lg-4">
                            <div className="bg-white p-4 rounded shadow-sm h-100"><TimeTable /></div>
                        </div>
                    </div>
                </div>
            </section>

            <TopCourseList />
            <CardSlider />
            <HomeOffers />
            <Testimonials />
            <Team />

            {/* 7. ANDROID STYLE CONVERSION CARD */}
            <section className="container my-5">
                <div className="row g-0 shadow-lg rounded-4 overflow-hidden border">
                    <div className="col-lg-4 p-5 bg-primary text-white d-flex flex-column justify-content-center">
                        <h2 className="fw-bolder mb-3">Start Your Tech Journey</h2>
                        <p className="opacity-90 mb-4 leading-relaxed">
                            Confused about your career? Get a <b>Free Career Counseling</b> session with our industry experts.
                            We help you choose the right tech stack that matches your skills and market demand.
                        </p>
                        <div className="d-flex gap-4 mt-auto pt-4 border-top border-white-25">
                            <div><h4 className="fw-bold mb-0">12k+</h4><small className="opacity-75">Graduates</small></div>
                            <div><h4 className="fw-bold mb-0">98%</h4><small className="opacity-75">Placement</small></div>
                        </div>
                    </div>
                    <div className="col-lg-8 p-4 p-md-5 bg-white">
                        <div className="mb-4">
                            <h4 className="fw-bold text-dark">Quick Enquiry</h4>
                            <p className="text-muted small">Fill out the form below to get a call back.</p>
                        </div>
                        <QuickSupport />
                    </div>
                </div>
            </section>
            <ScrollUp />
            <Footer />
        </div>
    );
}

export default Home;