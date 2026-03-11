// src/Home/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

// Components
import TopCourseList from "./TopCourseList";
import Footer from "../Footer/Footer";
import CardSlider from "./Cardslider";
import Team from "./Team";
import Testimonials from "./Testimonial";
import HomeOffers from "./pages/offers/HomeOffers";
import Features from "./Features";
import NoticeBoard from "../HelperCmp/FeaturesUpdate/NoticeBoard";
import TimeTable from "../HelperCmp/FeaturesUpdate/TimeTable";

const SLIDES = [
  {
    id: 1,
    image: "/images/vender/pc-hero-1.png",
    mobileImage: "/images/vender/mobile-hero-1.png",
    badge: "🎓 WELCOME TO DRISHTEE",
    description: "Nichlaul's premier institute for professional computer education and career excellence.",
    btnText: "Start Learning",
    btnLink: "/courses",
    stats: "2500+ Students Success"
  },
  {
    id: 2,
    image: "/images/vender/hero5.png",
    mobileImage: "/images/vender/mobile-hero-2.png",
    badge: "🚀 100% JOB READY",
    description: "Get industry-recognized certifications in Web, Graphic Design, and IT Management.",
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

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="modern-home">

      {/* 1. HERO SECTION & SLIDER */}
      <section className="hero-viewport">
        <div className="hero-slider">
          {SLIDES.map((slide, index) => (
            <div key={slide.id} className={`hero-slide ${index === activeSlide ? 'active' : ''}`}>
              <picture className="hero-media">
                <source media="(max-width:768px)" srcSet={slide.mobileImage} />
                <img src={slide.image} alt="Hero Slide" className="hero-img-fill" />
              </picture>
              <div className="hero-overlay"></div>
              <div className="hero-container">

                {/* Hero Badge & Stats */}
                <div className="hero-badge-row d-none d-lg-flex justify-content-between align-items-center">
                  <span className="badge-premium">{slide.badge}</span>
                  <span className="badge stats-label text-white">
                    <i className="bi bi-patch-check-fill"></i> {slide.stats}
                  </span>
                </div>

                {/* Updated Hero Title */}
                <h1 className="hero-title text-center text-lg-start">
                  <span className="fw-bold-gradient hero-main-title">DRISHTEE</span>
                  <span className="fw-light hero-subtitle">COMPUTER CENTER</span>
                </h1>

                {/* Hero Description */}
                <p className="hero-desc">{slide.description}</p>

                {/* Hero Buttons */}
                <div className="hero-actions">
                  <Link to={slide.btnLink} className="btn-prime btn-lg">{slide.btnText} <i className="bi bi-arrow-right"></i></Link>
                  <Link to="/contact" className="btn-glass btn-lg">Contact Us</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Indicators */}
        <div className="slider-indicators pb-5">
          {SLIDES.map((_, index) => (
            <button key={index} className={`indicator-dot ${index === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(index)} />
          ))}
        </div>
      </section>

      {/* 2. QUICK ACTION PORTAL */}
      <section className="portal-overlap">
        <div className="container">
          <div className="portal-glass-card">
            <div className="portal-header d-flex justify-content-between align-items-center">
              <h2 className="portal-title">Student <span>Actions</span></h2>
              <Link to="/all-services" className="btn-link nav-link">Explore All</Link>
            </div>
            <div className="portal-grid">
              {PORTAL_ITEMS.map(item => (
                <Link key={item.id} to={item.link} className="portal-item">
                  <div className="icon-circle" style={{ backgroundColor: item.bg }}>
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <div className="portal-info">
                    <span className="info-name">{item.label}</span>
                    <span className="info-tag" style={{ color: item.bg }}>{item.tag}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section className="container py-5 mt-5">
        <div className="row align-items-center g-4">
          <div className="col-lg-6 order-lg-2">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <img src="images/vender/homepic.webp" alt="Drishtee Education" className="img-fluid w-100" loading="lazy" />
            </div>
          </div>
          <div className="col-lg-6 order-lg-1">
            <span className="badge rounded-pill bg-primary-subtle text-primary text-uppercase px-3 py-2 fw-bold mb-3">About Drishtee</span>
            <h2 className="fw-bold display-6 text-primary mb-3">A Legacy of Quality Technical Education</h2>
            <p className="text-secondary">
              Founded in 2007, <strong>Drishtee Computer Centre</strong> has been at the forefront of the digital revolution in Nichlaul. 
              Join India's most trusted IT Skill Hub, ISO 9001:2015 Certified.
            </p>
            <div className="row g-2 mb-4">
              {["Modern IT Labs", "Job Portal Access", "Free Soft Skills", "Strong Alumni Network"].map((feat, index) => (
                <div className="col-6" key={index}>
                  <div className="d-flex align-items-center p-2 rounded-3 bg-white border shadow-sm hover-scale">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    <span className="fw-bold text-dark small">{feat}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/about" className="btn btn-primary btn-lg px-5 py-3 rounded-3 fw-bold">Learn More</Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURES */}
      <Features />

      {/* 5. TOP COURSES & SLIDER */}
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
                <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 hover-scale">
                  <div className="row align-items-center g-0">
                    <div className="col-sm-4 text-center position-relative">
                      <img src={leader.img} alt={leader.name} className="img-fluid rounded-circle border border-3 shadow-sm" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                      <span className="position-absolute top-0 start-50 translate-middle badge bg-primary">{leader.badge}</span>
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

      {/* 7. FACILITIES */}
      <section className="container py-5">
        <h2 className="fw-bolder display-6 mb-4 border-start border-primary border-4 ps-3">World-Class Facilities</h2>
        <div className="row g-3">
          {[
            { title: "High-Tech IT Lab", desc: "Fully equipped IT lab with latest systems.", img: "/images/vender/lab.jpg" },
            { title: "Digital Library", desc: "Access to thousands of e-books and resources.", img: "/images/vender/librarypic2.jpg" },
            { title: "Smart Classrooms", desc: "Interactive smart boards and projectors.", img: "/images/vender/std1.jpg" }
          ].map((item, index) => (
            <div key={index} className="col-md-4">
              <div className="rounded-4 overflow-hidden position-relative shadow-sm hover-scale" style={{ height: '250px' }}>
                <img src={item.img} alt={item.title} className="w-100 h-100 object-fit-cover" loading="lazy" />
                <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-dark bg-opacity-50 text-start">
                  <h5 className="text-white fw-bold mb-1">{item.title}</h5>
                  <p className="text-white small mb-0">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. OFFERS */}
      <HomeOffers />

      {/* 9. UPDATES */}
      <section className="container py-5">
        <div className="row">
          <div className="col-md-6 my-3"><NoticeBoard /></div>
          <div className="col-md-6 my-3"><TimeTable /></div>
        </div>
      </section>

      {/* 10. TESTIMONIALS & TEAM */}
      <Testimonials />
      <Team />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default Home;