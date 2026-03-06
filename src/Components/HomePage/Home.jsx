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

function Home() {
  const slides = [
    "/images/vender/main3.webp",
    "/images/vender/main2.webp",
    "/images/vender/main6.webp",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const slider = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slider);
  }, [slides.length]);

  const portalItems = [
    { label: "Verify ID", icon: "bi-shield-check", link: "/Download-Certificate", bg: "#4F46E5" },
    { label: "Results", icon: "bi-bar-chart-line", link: "/Download-Certificate", bg: "#0891B2" },
    { label: "Material", icon: "bi-file-earmark-pdf", link: "/Library", bg: "#E11D48" },
    { label: "Job", icon: "bi-person-workspace", link: "/", bg: "#F59E0B" },
    { label: "LMS", icon: "bi-cpu-fill", link: "/login-as-member", bg: "#7C3AED" },
    { label: "App", icon: "bi-phone-vibrate", link: "/", bg: "#10B981" }
  ];

  return (
    <div className="hybrid-app-shell bg-light">
      {/* HERO SECTION */}
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
            <div className="d-flex gap-2 gap-md-3 justify-content-center">
              <Link to="/new-admission" className="btn btn-warning custom-btn shadow fw-bold">
                Admission
              </Link>
              <Link to="/login" className="btn btn-light custom-btn shadow fw-bold">
                Student Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PORTAL HUB */}
      <div className="container portal-container">
        <div className="bg-white rounded-4 shadow-sm p-4 p-md-4">
          <div className="row g-2 g-md-3 row-cols-3 row-cols-md-6 text-center">
            {portalItems.map((item, i) => (
              <div key={i} className="col p-2">
                <Link to={item.link} className="text-decoration-none d-flex flex-column align-items-center portal-hover">
                  <div className="portal-icon-wrapper shadow-sm mb-2" style={{ backgroundColor: item.bg }}>
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <span className="small fw-bold text-dark" style={{ fontSize: '0.75rem' }}>{item.label}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ABOUT SECTION - REFACTORED */}
      <section className="py-5 mt-md-4">
        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-lg-6">
              <h6 className="text-warning fw-bold mb-2">ABOUT OUR INSTITUTE</h6>
              <h2 className="fw-bold mb-3 display-6">Drishtee Computer Center</h2>
              <p className="text-muted lead fs-6">
                Drishtee Computer Center is a modern computer training institute focused on providing practical computer education and digital skills.
              </p>
              <p className="text-muted d-none d-md-block">
                We offer various professional courses like Web Development, DCA, ADCA, Tally, and Programming with 100% practical training in real-world scenarios.
              </p>
              
              {/* STATS */}
              <div className="row g-2 text-center my-4 py-3 border-top border-bottom">
                {[
                  { count: "500+", label: "Students", color: "primary" },
                  { count: "20+", label: "Courses", color: "success" },
                  { count: "5+", label: "Years Exp.", color: "danger" }
                ].map((item, i) => (
                  <div className="col-4 border-end last-child-border-0" key={i}>
                    <h4 className={`fw-bold mb-0 text-${item.color}`}>{item.count}</h4>
                    <small className="text-muted d-block" style={{fontSize: '11px'}}>{item.label}</small>
                  </div>
                ))}
              </div>

              <div className="text-center text-lg-start mt-4">
                <Link to="/about" className="btn btn-warning px-5 py-2 rounded-pill fw-bold shadow-sm">
                  Read More <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>

            <div className="col-lg-6  order-lg-last">
              <div className="position-relative p-2">
                <img
                  src="/images/vender/homepic.webp"
                  alt="Drishtee Computer Center"
                  className="img-fluid rounded-4 shadow-lg w-100"
                  style={{ objectFit: 'cover', maxHeight: '400px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OTHER COMPONENTS */}
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