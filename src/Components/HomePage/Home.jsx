import React, { Suspense, lazy, memo } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import Features from "./Features";
import NoticeBoard from "../HelperCmp/FeaturesUpdate/NoticeBoard";
import TimeTable from "../HelperCmp/FeaturesUpdate/TimeTable";
import ScrollUp from "../HelperCmp/Scroller/ScrollUp";

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
  <div className="col-4 col-md-2">
    <Link to={item.link} className="text-decoration-none d-block portal-item-wrapper">
      <div className={`portal-icon-box bg-${item.bg}-subtle text-${item.bg}`}>
        <i className={`bi ${item.icon}`}></i>
      </div>
      <h6 className="portal-label">{item.label}</h6>
      <span className={`badge-tag text-${item.bg}`}>{item.tag}</span>
    </Link>
  </div>
));

function Home() {
  useScrollAnimation();

  return (
    <div className="modern-home overflow-hidden">
      {/* HERO SECTION */}
      <section className="hero-viewport d-flex position-relative text-white">
        <img src="/images/vender/hero.webp" alt="Drishtee Computer Centre" className="hero-bg-img" />
        <div className="hero-overlay"></div>

        <div className="container hero-content text-center text-md-start">
          {/* DRISHTEE TITLE: ANIMATES TOP TO BOTTOM */}
          <div className="scroll-animate animate-top">
            <span className="badge bg-light text-dark mb-3 px-3 py-2 d-inline-flex align-items-center">
              <i className="bi bi-patch-check-fill text-primary me-1"></i> 2500+ Students Success
            </span>
            <h1 className="hero-title mb-3">DRISHTEE <br /> COMPUTER CENTRE</h1>
          </div>

          {/* LEADING TEXT & BUTTONS: ANIMATES BOTTOM TO TOP */}
          <div className="scroll-animate animate-bottom">
            <p className="opacity-75 mb-4 fs-6 col-lg-6">
              Leading the digital revolution in Nichlaul since 2007.
              Join India's trusted ISO 9001:2015 IT Skill Hub.
            </p>
            <div className="d-flex justify-content-center justify-content-md-start gap-2 flex-wrap mt-5">
              <Link to="/courses" className="btn btn-primary px-4 fw-semibold shadow-sm">Start Learning</Link>
              <Link to="/contact-us" className="btn btn-light px-4 fw-semibold shadow-sm">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* STUDENT PORTAL SECTION */}
      <section className="container portal-section scroll-animate animate-bottom">
        <div className="portal-card">
          <div className="portal-header">
            <div>
              <h2 className="portal-title">Student <span className="text-primary">Portal</span></h2>
            </div>
            <Link to="/login" className="btn-portal-view d-flex">View<i className="bi bi-arrow-right-short"></i></Link>
          </div>

          <div className="row g-4 justify-content-center">
            {PORTAL_ITEMS.map(item => (
              <PortalItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* OTHER SECTIONS */}
      <Suspense fallback={<div className="text-center py-5">Loading...</div>}>
        <Features />
        <TopCourseList />
        <CardSlider />
        <HomeOffers />
        <div className="container py-5">
          <div className="row g-4">
            <div className="col-lg-6"><NoticeBoard /></div>
            <div className="col-lg-6"><TimeTable /></div>
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