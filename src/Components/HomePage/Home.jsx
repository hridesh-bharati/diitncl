import React, { Suspense, lazy, memo } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

import Features from "./Features";
import NoticeBoard from "../HelperCmp/FeaturesUpdate/NoticeBoard";
import TimeTable from "../HelperCmp/FeaturesUpdate/TimeTable";
import ScrollUp from "../HelperCmp/Scroller/ScrollUp";
import useScrollAnimation from "../../hooks/useScrollAnimation";

const TopCourseList = lazy(() => import("./TopCourseList"));
const CardSlider = lazy(() => import("./Cardslider"));
const Team = lazy(() => import("./Team"));
const Testimonials = lazy(() => import("./Testimonial"));
const HomeOffers = lazy(() => import("./pages/offers/HomeOffers"));
const Footer = lazy(() => import("../Footer/Footer"));

const PORTAL_ITEMS = [
  { id: 1, label: "Verify", icon: "bi-shield-check", link: "/Download-Certificate", bg: "primary", tag: "ID/Cert" },
  { id: 2, label: "Results", icon: "bi-bar-chart-line", link: "/Download-Certificate", bg: "success", tag: "Exam 2026" },
  { id: 3, label: "Notes", icon: "bi-file-earmark-pdf", link: "/Library", bg: "warning", tag: "E-Books" },
  { id: 4, label: "Jobs", icon: "bi-person-workspace", link: "/", bg: "danger", tag: "Placements" },
  { id: 5, label: "LMS", icon: "bi-cpu-fill", link: "/login-as-member", bg: "info", tag: "E-Learning" },
  { id: 6, label: "App", icon: "bi-phone-vibrate", link: "/", bg: "secondary", tag: "Android" }
];

const PortalItem = memo(({ item }) => (
  <div className="text-center">
    <Link to={item.link} className="text-decoration-none d-block py-3 portal-hover">
      <div className={`mx-auto mb-2 p-3 rounded-4 bg-${item.bg} fs-5 text-white d-flex align-items-center justify-content-center portal-btn-icon`}>
        <i className={`bi ${item.icon}`}></i>
      </div>
      <h6 className="fw-bold mb-1">{item.label}</h6>
      <small className={`text-${item.bg}`}>{item.tag}</small>
    </Link>
  </div>
));

function Home() {
  useScrollAnimation();

  return (
    <div className="modern-home">
      
      {/* HERO */}
      <section className="hero-viewport text-white">
        <img src="/images/vender/hero.webp" alt="Drishtee Computer Centre" className="hero-bg-img" />
        <div className="hero-overlay"></div>

        <div className="container hero-content text-center text-md-start">
          
          <span className="badge bg-light text-dark mb-3 px-3 py-2">
            2500+ Students Success
          </span>

          {/* Heading Animation */}
          <div className="leadingText scroll-animate fade-down">
            <h1 className="hero-title mb-3">
              DRISHTEE <br /> COMPUTER CENTRE
            </h1>
            <p className="opacity-75 mb-4 fs-6">
              Leading the digital revolution in Nichlaul since 2007.
              Join India's trusted ISO 9001:2015 IT Skill Hub.
            </p>
          </div>

          {/* Buttons Animation */}
          <div className="d-flex justify-content-center justify-content-md-start gap-2 flex-wrap scroll-animate delay-2">
            <Link to="/courses" className="btn btn-primary px-4 fw-semibold">
              Start Learning
            </Link>
            <Link to="/contact-us" className="btn btn-light px-4 fw-semibold">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* PORTAL */}
      <section className="container portal-section">
        <div className="card shadow rounded-4 border-0">
          <div className="card-body p-4 p-md-5">
            
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h4 fw-bold m-0">
                Student <span className="text-primary">Portal</span>
              </h2>
              <Link to="/login" className="btn btn-sm btn-outline-primary fw-bold">
                View All
              </Link>
            </div>

            {/* Stagger Animation */}
            <div className="row g-3 justify-content-center">
              {PORTAL_ITEMS.map((item, i) => (
                <div
                  key={item.id}
                  className={`col-4 col-md-2 scroll-animate delay-${(i % 5) + 1}`}
                >
                  <PortalItem item={item} />
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <Suspense fallback={<div className="text-center py-5">Loading...</div>}>
        <Features />
        <TopCourseList />
        <CardSlider />
        <HomeOffers />

        <div className="container py-5">
          <div className="row g-4">
            <div className="col-lg-6 scroll-animate fade-left"><NoticeBoard /></div>
            <div className="col-lg-6 scroll-animate fade-right"><TimeTable /></div>
          </div>
        </div>

        <Testimonials />
        <Team />
        <ScrollUp />
        <Footer />
      </Suspense>
    </div>
  );
}

export default memo(Home);