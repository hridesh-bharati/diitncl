import React, { Suspense, lazy, memo } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

// Static Components
import Features from "./Features";
import NoticeBoard from "../HelperCmp/FeaturesUpdate/NoticeBoard";
import TimeTable from "../HelperCmp/FeaturesUpdate/TimeTable";
import ScrollUp from "../HelperCmp/Scroller/ScrollUp";

// Lazy Components
const TopCourseList = lazy(() => import("./TopCourseList"));
const CardSlider = lazy(() => import("./Cardslider"));
const Team = lazy(() => import("./Team"));
const Testimonials = lazy(() => import("./Testimonial"));
const HomeOffers = lazy(() => import("./pages/offers/HomeOffers"));
const Footer = lazy(() => import("../Footer/Footer"))

const PORTAL_ITEMS = [
  { id: 1, label: "Verify", icon: "bi-shield-check", link: "/Download-Certificate", bg: "bg-primary" },
  { id: 2, label: "Results", icon: "bi-bar-chart-line", link: "/Download-Certificate", bg: "bg-success" },
  { id: 3, label: "Notes", icon: "bi-file-earmark-pdf", link: "/Library", bg: "bg-warning" },
  { id: 4, label: "Jobs", icon: "bi-person-workspace", link: "/", bg: "bg-info" },
  { id: 5, label: "LMS", icon: "bi-cpu-fill", link: "/login", bg: "bg-danger" },
  { id: 6, label: "App", icon: "bi-phone-vibrate", link: "/", bg: "bg-dark" }
];

const PortalItem = memo(({ item }) => (
  <Link to={item.link} className="col text-center text-decoration-none portal-item">
    <div className={`portal-icon mx-auto d-flex align-items-center justify-content-center shadow-sm rounded-4 ${item.bg}`}>
      <i className={`bi ${item.icon} text-white`}></i>
    </div>
    <span className="fw-bold d-block mt-2 small text-dark">{item.label}</span>
  </Link>
));

function Home() {
  return (
    <div className="home-wrapper bg-primary-subtle min-vh-100">
      <div className="home-feed container-lg py-3 px-2">

        {/* ================= HERO SECTION ================= */}
        <div className="hero-card position-relative rounded-4 overflow-hidden mb-4 shadow-sm bg-dark">
          <img src="/images/vender/hero.webp" alt="Drishtee" className="w-100 object-fit-cover hero-img opacity-75" />
          <div className="hero-content position-absolute p-3 p-md-5 w-100 text-white">
            <div className="pulse-badge badge rounded-pill bg-danger mb-2 py-2 px-3 d-inline-flex align-items-center shadow-sm">
              <span className="pulse-dot me-2"></span> Admissions 2026
            </div>
            <h1 className="hero-title fw-bolder m-0 display-4">Drishtee <br /> Computer Centre</h1>
            <Link to="/courses" className="btn btn-primary rounded-pill px-4 py-2 shadow-sm mt-3 fw-bold">Explore Courses</Link>
          </div>
        </div>

        {/* ================= STUDENT PORTAL ================= */}
        <div className="card border-0 rounded-4 shadow-sm p-3 mb-4 bg-white">
          <h6 className="fw-bold mb-3 border-start border-primary border-4 ps-2">Student Portal</h6>
          <div className="row row-cols-3 row-cols-md-6 g-3">
            {PORTAL_ITEMS.map(item => (
              <PortalItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* ================= TRUST STATS ================= */}
        <div className="card border-0 rounded-4 shadow-sm p-3 mb-4 bg-white">
          <div className="row g-2 text-center">
            <div className="col-6 col-md-3 border-end border-light">
              <h4 className="fw-bold text-primary mb-0">17+</h4>
              <p className="text-muted extra-small mb-0">Years Exp.</p>
            </div>
            <div className="col-6 col-md-3 border-end-md border-light">
              <h4 className="fw-bold text-success mb-0">5000+</h4>
              <p className="text-muted extra-small mb-0">Students</p>
            </div>
            <div className="col-6 col-md-3 border-end border-light">
              <h4 className="fw-bold text-warning mb-0">ISO</h4>
              <p className="text-muted extra-small mb-0">Certified</p>
            </div>
            <div className="col-6 col-md-3">
              <h4 className="fw-bold text-info mb-0">100%</h4>
              <p className="text-muted extra-small mb-0">Practical</p>
            </div>
          </div>
        </div>

        {/* ================= MAIN FEED ================= */}
        <Suspense fallback={<div className="text-center p-5"><div className="spinner-border text-primary"></div></div>}>

          <div className="mb-4 rounded-4 overflow-hidden shadow-sm bg-white p-2">
            <Features />
          </div>

          <div className="mb-4 w-100">
            <TopCourseList />
          </div>

          {/* ADMISSION CTA */}
          <div className="card border-0 rounded-4 shadow-sm mb-4 overflow-hidden bg-primary text-white">
            <div className="card-body p-4 d-md-flex align-items-center justify-content-between text-center text-md-start">
              <div>
                <h5 className="fw-bold mb-1">Join New Batch Today!</h5>
                <p className="small mb-0 opacity-75">Admission open for Tally, ADCA & Web Design.</p>
              </div>
              <Link to="/courses"><button className="btn btn-light rounded-pill px-4 fw-bold text-primary mt-3 mt-md-0 shadow">Apply Now</button>
              </Link>
            </div>
          </div>

          <div className="mb-4"><CardSlider /></div>
          <div className="mb-4"><HomeOffers /></div>

          {/* NOTICE & TIMETABLE */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6">
              <NoticeBoard />
            </div>
            <div className="col-12 col-md-6">
              <TimeTable />

            </div>
          </div>

          <div className="mb-4"><Testimonials /></div>
          <div className="mb-4"><Team /></div>


          <ScrollUp />
        </Suspense>

      </div>
      <Footer />
    </div>
  );
}

export default memo(Home);