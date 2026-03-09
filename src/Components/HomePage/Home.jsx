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

const SLIDES = [
  {
    id: 1,
    image: "/images/vender/pc-hero-1.png",
    mobileImage: "/images/vender/mobile-hero-1.png",
    badge: "🎓 WELCOME TO DRISHTEE",
    title: "Empowering Your",
    highlight: "Digital Future",
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
    title: "Master High-In-Demand",
    highlight: "Modern Skills",
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
      {/* HERO SECTION */}
      <section className="hero-viewport">
        <div className="hero-slider">
          {SLIDES.map((slide, index) => (
            <div key={slide.id} className={`hero-slide ${index === activeSlide ? 'active' : ''}`}>
              <picture className="hero-media">
                <source media="(max-width:768px)" srcSet={slide.mobileImage} />
                <img src={slide.image} alt={slide.title} className="hero-img-fill" />
              </picture>
              
              <div className="hero-overlay"></div>
              
              <div className="hero-container">
                <div className="hero-badge-row d-none d-lg-block">
                  <span className="badge-premium">{slide.badge}</span>
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
                  <Link to={slide.btnLink} className="btn-prime">
                    {slide.btnText} <i className="bi bi-arrow-right"></i>
                  </Link>
                  <Link to="/contact" className="btn-glass">
                    Contact Us
                  </Link>
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
            />
          ))}
        </div>
      </section>

      {/* FLOATING PORTAL */}
      <section className="portal-overlap">
        <div className="container">
          <div className="portal-glass-card">
            <div className="portal-header">
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

      <Features />
      <TopCourseList />
      <CardSlider />
      <HomeOffers />
      <Testimonials />
      <Team />
      <Footer />
    </div>
  );
}

export default Home;