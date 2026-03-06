import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

import TopCourseList from "./TopCourseList";
import Footer from "../Footer/Footer";
import CardSlider from "./Cardslider";
import Team from "./Team";
import Testimonials from "./Testimonial";
import HomeOffers from "./pages/offers/HomeOffers";
import Features from "./Features";
import ScrollUp from "../HelperCmp/Scroller/ScrollUp";

function Home() {
  // Image paths ko .webp mein rakhein fast loading ke liye
  const slides = [
    "/images/vender/hero.png",
    "/images/vender/hero1.png",
    "/images/vender/drishtee-hero3.png", 
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const slider = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds interval for smooth reading
    return () => clearInterval(slider);
  }, [slides.length]);

  const portalItems = [
    { label: "Verify ID", icon: "bi-shield-check", link: "/Download-Certificate", bg: "#4F46E5" },
    { label: "Results", icon: "bi-bar-chart-line", link: "/Download-Certificate", bg: "#0891B2" },
    { label: "Study Material", icon: "bi-file-earmark-pdf", link: "/Library", bg: "#E11D48" },
    { label: "Placements", icon: "bi-person-workspace", link: "/", bg: "#F59E0B" },
    { label: "LMS Login", icon: "bi-cpu-fill", link: "/login-as-member", bg: "#7C3AED" },
    { label: "App Link", icon: "bi-phone-vibrate", link: "/", bg: "#10B981" }
  ];

  return (
    <div className="hybrid-app-shell">
      {/* HERO SLIDER SECTION */}
      <section className="hero-slider">
        <div className="slider-wrapper">
          {slides.map((img, index) => (
            <div
              key={index}
              className={`hero-slide ${index === current ? "active" : ""}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

        <div className="hero-overlay-content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8 text-center">
                <div className="hero-btn-group">
                  <Link to="/new-admission" className="btn btn-admission">
                    Admission Open
                  </Link>
                  <Link to="/login" className="btn btn-portal">
                    Student Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTAL HUB GRID */}
      <div className="container portal-container">
        <div className="portal-hub-card">
          <div className="portal-grid">
            {portalItems.map((item, i) => (
              <Link key={i} to={item.link} className="portal-item">
                <div className="portal-icon-wrapper" style={{ '--icon-bg': item.bg }}>
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <span className="portal-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* OTHER SECTIONS */}
      <Features />
      <TopCourseList />
      <CardSlider />
      <HomeOffers />
      <Testimonials />
      <Team />
      <ScrollUp />
      <Footer />
    </div>
  );
}

export default Home;