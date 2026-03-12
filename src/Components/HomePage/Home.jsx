import React, { useEffect, useState, Suspense, lazy, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

// Immediate Load (Above the fold)
import Features from "./Features";
import NoticeBoard from "../HelperCmp/FeaturesUpdate/NoticeBoard";
import TimeTable from "../HelperCmp/FeaturesUpdate/TimeTable";

// Lazy Load (Below the fold - Performance Boost)
const TopCourseList = lazy(() => import("./TopCourseList"));
const CardSlider = lazy(() => import("./Cardslider"));
const Team = lazy(() => import("./Team"));
const Testimonials = lazy(() => import("./Testimonial"));
const HomeOffers = lazy(() => import("./pages/offers/HomeOffers"));
const Footer = lazy(() => import("../Footer/Footer"));
import ScrollUp from "../HelperCmp/Scroller/ScrollUp"
const SLIDES = [
  {
    id: 1,
    image: "/images/vender/pc-hero-1.avif", 
    mobileImage: "/images/vender/mobile-hero-1.avif",
    title: "DRISHTEE",
    highlight: "COMPUTER CENTRE",
    description: "Leading the digital revolution in Nichlaul since 2007. Join India's most trusted ISO 9001:2015 Certified IT Skill Hub.",
    btnText: "Start Learning",
    btnLink: "/courses",
    stats: "2500+ Students Success"
  },
  {
    id: 2,
    image: "/images/vender/hero5.avif",
    mobileImage: "/images/vender/mobile-hero-2.avif",
    title: "UPGRADE AT",
    highlight: "DRISHTEE CENTRE",
    description: "Master Modern Skills like Web Development, Graphic Design, and IT Management with expert mentorship.",
    btnText: "Explore Courses",
    btnLink: "/courses",
    stats: "Government Recognized"
  }
];

const PORTAL_ITEMS = [
  { id: 1, label: "Verify", icon: "bi-shield-check", link: "/Download-Certificate", bg: "#1a73e8", tag: "ID_Card/Cert" },
  { id: 2, label: "Results", icon: "bi-bar-chart-line", link: "/Download-Certificate", bg: "#34a853", tag: "Exam 2026" },
  { id: 3, label: "Notes", icon: "bi-file-earmark-pdf", link: "/Library", bg: "#f9ab00", tag: "E-Books" },
  { id: 4, label: "Jobs", icon: "bi-person-workspace", link: "/", bg: "#ea4335", tag: "Placements" },
  { id: 5, label: "LMS", icon: "bi-cpu-fill", link: "/login-as-member", bg: "#9334e8", tag: "E-Learning" },
  { id: 6, label: "App", icon: "bi-phone-vibrate", link: "/", bg: "#4285f4", tag: "Android" }
];

function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="modern-home">
      {/* 1. HERO SECTION - HIGH PRIORITY */}
      <section className="hero-viewport">
        <div className="hero-slider">
          {SLIDES.map((slide, index) => (
            <div key={slide.id} className={`hero-slide ${index === activeSlide ? 'active' : ''}`}>
              <picture className="hero-media">
                <source media="(max-width:768px)" srcSet={slide.mobileImage} />
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="hero-img-fill" 
                  fetchpriority={index === 0 ? "high" : "low"}
                  loading={index === 0 ? "eager" : "lazy"} 
                />
              </picture>
              <div className="hero-overlay"></div>
              <div className="hero-container">
                <div className="hero-badge-row d-none d-lg-flex mb-3">
                  <span className="badge stats-label text-white">
                    <i className="bi bi-patch-check-fill"></i> {slide.stats}
                  </span>
                </div>
                <h1 className="hero-title">
                  <span className="fw-light">{slide.title}</span>
                  <span className="fw-bold-gradient">{slide.highlight}</span>
                </h1>
                <p className="hero-desc">{slide.description}</p>
                <div className="hero-actions">
                  <Link to={slide.btnLink} className="btn-prime btn-lg">{slide.btnText} <i className="bi bi-arrow-right"></i></Link>
                  <Link to="/contact-us" className="btn-glass btn-lg">Contact Us</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="slider-indicators pb-5">
          {SLIDES.map((_, index) => (
            <button 
              key={index} 
              className={`indicator-dot ${index === activeSlide ? 'active' : ''}`} 
              onClick={() => setActiveSlide(index)} 
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. QUICK ACTION PORTAL */}
      <section className="portal-overlap">
        <div className="container">
          <div className="portal-glass-card shadow-lg">
            <div className="portal-header d-flex justify-content-between align-items-center mb-4">
              <h2 className="portal-title m-0">Student <span>Actions</span></h2>
              <Link to="/courses" className="btn-link nav-link fw-bold text-primary">Explore All</Link>
            </div>
            <div className="portal-grid">
              {PORTAL_ITEMS.map(item => (
                <Link key={item.id} to={item.link} className="portal-item border-0">
                  <div className="icon-circle shadow-sm" style={{ backgroundColor: item.bg }}>
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <div className="portal-info">
                    <span className="info-name">{item.label}</span>
                    <span className="info-tag d-none d-md-block" style={{ color: item.bg }}>{item.tag}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION - WITH AVIF IMAGE */}
      <section className="container py-5 mt-5">
        <div className="row align-items-center g-4">
          <div className="col-lg-6 order-lg-2">
            <div className="about-img-wrapper rounded-4 overflow-hidden shadow-sm">
              <img src="images/vender/homepic.webp" alt="Drishtee Education" className="img-fluid w-100" loading="lazy" width="600" height="400" />
            </div>
          </div>
          <div className="col-lg-6 order-lg-1">
            <span className="badge rounded-pill bg-primary-subtle text-primary text-uppercase px-3 py-2 fw-bold mb-3">About Drishtee</span>
            <h2 className="fw-bold display-6 text-primary mb-3">A Legacy of Quality Technical Education</h2>
            <p className="text-secondary mb-4">
              Founded in 2007, <strong>Drishtee Computer Centre</strong> has been at the forefront of the digital revolution in Nichlaul. Join India's most trusted IT Skill Hub, ISO 9001:2015 Certified.
            </p>
            <div className="row g-2 mb-4">
              {["Modern IT Labs", "Job Portal Access", "Free Soft Skills", "Strong Alumni Network"].map((feat, index) => (
                <div className="col-6" key={index}>
                  <div className="d-flex align-items-center p-2 rounded-3 bg-white border shadow-sm hover-scale transition-all">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    <span className="fw-bold text-dark small">{feat}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/about" className="btn btn-primary btn-lg px-5 py-3 rounded-3 fw-bold shadow">Learn More</Link>
          </div>
        </div>
      </section>

      {/* WRAP BELOW-FOLD CONTENT IN SUSPENSE */}
      <Suspense fallback={<div className="p-5 text-center text-muted">Loading Awesome Content...</div>}>
        <Features />
        <TopCourseList />
        <CardSlider />

        {/* 6. LEADERSHIP */}
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
                  <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 hover-scale transition-all">
                    <div className="row align-items-center g-0">
                      <div className="col-sm-4 text-center position-relative">
                        <img src={leader.img} alt={leader.name} className="img-fluid rounded-circle border border-3 shadow-sm" style={{ width: '90px', height: '90px', objectFit: 'cover' }} loading="lazy" />
                        <span className="position-absolute top-0 start-50 translate-middle badge bg-primary rounded-pill">{leader.badge}</span>
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

        <section className="container py-5">
          <h2 className="fw-bolder display-6 mb-4 border-start border-primary border-4 ps-3">World-Class Facilities</h2>
          <div className="row g-3">
            {[
              { title: "High-Tech IT Lab", desc: "Fully equipped IT lab with latest systems.", img: "/images/vender/lab.jpg" },
              { title: "Digital Library", desc: "Access to thousands of e-books and resources.", img: "/images/vender/librarypic2.jpg" },
              { title: "Smart Classrooms", desc: "Interactive smart boards and projectors.", img: "/images/vender/std1.jpg" }
            ].map((item, index) => (
              <div key={index} className="col-md-4">
                <div className="rounded-4 overflow-hidden position-relative shadow-sm hover-scale transition-all" style={{ height: '240px' }}>
                  <img src={item.img} alt={item.title} className="w-100 h-100 object-fit-cover" loading="lazy" />
                  <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-dark bg-opacity-60 backdrop-blur-sm">
                    <h5 className="text-white fw-bold mb-1">{item.title}</h5>
                    <p className="text-white small mb-0 opacity-75">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <HomeOffers />

        <section className="container py-5">
          <div className="row g-4">
            <div className="col-md-6"><NoticeBoard /></div>
            <div className="col-md-6"><TimeTable /></div>
          </div>
        </section>

        <Testimonials />
        <Team />
        <ScrollUp />
        <Footer />
      </Suspense>
    </div>
  );
}

export default Home;