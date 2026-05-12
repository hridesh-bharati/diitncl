import React, { Suspense, lazy, memo } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

// Components
import AdComponent from "./AdComponent";
import Features from "./Features";
import ScrollUp from "../HelperCmp/Scroller/ScrollUp";
import HomeGallery from "./pages/HomeGallery";

// Lazy Components
const TopCourseList = lazy(() => import("./TopCourseList"));
const CardSlider = lazy(() => import("./Cardslider"));
const Team = lazy(() => import("./Team"));
const Testimonials = lazy(() => import("./Testimonial"));
const HomeOffers = lazy(() => import("./pages/offers/HomeOffers"));
const Footer = lazy(() => import("../Footer/Footer"));
const NoticeBoard = lazy(() => import("../HelperCmp/FeaturesUpdate/NoticeBoard"));
const TimeTable = lazy(() => import("../HelperCmp/FeaturesUpdate/TimeTable"));
const RecentStudents = lazy(() => import("./pages/RecentStudents/RecentStudents"));

const PORTALS = [
  { n: "Test", i: "bi-shield-check", l: "/student/practice-tests", g: "linear-gradient(135deg, #667eea, #764ba2)" },
  { n: "Exam", i: "bi-person-workspace", l: "/student/exams", g: "linear-gradient(135deg, #00c6ff, #0072ff)" },
  { n: "Results", i: "bi-bar-chart-line", l: "/Download-Certificate", g: "linear-gradient(135deg, #11998e, #38ef7d)" },
  { n: "Notes", i: "bi-file-earmark-pdf", l: "/notes-download", g: "linear-gradient(135deg, #f093fb, #f5576c)" },
  { n: "LMS", i: "bi-cpu-fill", l: "/login", g: "linear-gradient(135deg, #ff0844, #ffb199)" },
  { n: "App", i: "bi-phone-vibrate", l: "/base.apk", g: "linear-gradient(135deg, #373b44, #4286f4)", d: true }
];

const SLIDES = [
  { img: "/images/vender/hero1.webp", b: "Admissions Open 2026", bc: "bg-danger", t: <>DRISHTEE <br /> COMPUTER CENTER</>, p: "high" },
  { img: "/images/vender/hero2.webp", b: "Expert Training", bc: "bg-warning text-dark", t: <>BUILD YOUR <br /> DIGITAL FUTURE</>, p: "low" }
];

const STATS = [
  { v: "19+", l: "YEARS EXP.", c: "#0d6efd" },
  { v: "5000+", l: "STUDENTS", c: "#198754" },
  { v: "ISO", l: "CERTIFIED", c: "#ffc107" },
  { v: "100%", l: "PRACTICAL", c: "#0dcaf0" }
];

const PortalItem = memo(({ it }) => {
  const content = (
    <div className="portal-item-container">
      <div className="portal-icon-box shadow-sm text-white rounded-4 border border-white border-2 d-flex justify-content-center align-items-center" style={{ background: it.g }}>
        <i className={`bi ${it.i}`}></i>
      </div>
      <span className="portal-label-text">{it.n}</span>
    </div>
  );
  return (
    <div className="col text-center">
      {it.d ? <a href={it.l} download className="text-decoration-none">{content}</a> : <Link to={it.l} className="text-decoration-none">{content}</Link>}
    </div>
  );
});

function Home() {
  return (
    <div className="bg-primary-subtle min-vh-100">
      <div className="container-fluid p-2 p-lg-0">

        {/* HERO SECTION */}
        <div id="homeHero" className="carousel slide carousel-fade shadow-sm mb-3" data-bs-ride="carousel">
          {/* <div className="carousel-inner bg-dark rounded-4 rounded-lg-0 overflow-hidden"> */}
          <div className="carousel-inner bg-dark rounded-4 overflow-hidden hero-carousel-wrap">
            {SLIDES.map((s, i) => (
              <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`} data-bs-interval="5000">
                <img src={s.img} className="d-block w-100 opacity-75 hero-img-adjust" alt="hero" fetchpriority={s.p} />
                <div className="carousel-caption d-flex align-items-center start-0 end-0 bottom-0 top-0 text-start p-4 hero-overlay">
                  <div className="container p-0">
                    <span className={`badge ${s.bc} rounded-pill mb-2 animate-fade shadow-sm`}>{s.b}</span>
                    <h1 className="fw-bolder display-5 text-white hero-text-clean animate-top">{s.t}</h1>
                    <Link to="/courses" className="btn btn-primary rounded-pill fw-bold mt-2 px-4 shadow">Explore</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="position-absolute end-0 top-50 translate-middle-y z-3 pe-2 d-flex flex-column gap-2">
            <button className="btn btn-sm btn-outline-light rounded-circle text-light" data-bs-target="#homeHero" data-bs-slide="prev" style={{ background: 'rgba(0,0,0,0.3)' }}><i className="bi bi-chevron-left"></i></button>
            <button className="btn btn-sm btn-outline-light rounded-circle text-light" data-bs-target="#homeHero" data-bs-slide="next" style={{ background: 'rgba(0,0,0,0.3)' }}><i className="bi bi-chevron-right"></i></button>
          </div>
        </div>

        {/* STUDENT PORTAL */}
        <div className="card border-0 rounded-4 shadow-sm p-3 mb-3 bg-white mx-1">
          <h6 className="fw-bold mb-3 border-start border-primary border-4 ps-2 text-uppercase" style={{ fontSize: '0.85rem' }}>Student Portal</h6>
          <div className="row row-cols-3 row-cols-md-6 g-3">
            {PORTALS.map((p, i) => <PortalItem key={i} it={p} />)}
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="card border-0 rounded-4 shadow-sm p-3 mb-3 bg-white mx-1">
          <div className="row g-0 text-center">
            {STATS.map((s, i) => (
              <div key={i} className={`col-3 ${i !== 3 ? 'border-end' : ''} border-light-subtle`}>
                <h6 className="fw-bolder mb-0" style={{ color: s.c }}>{s.v}</h6>
                <div className="text-muted fw-bold mt-1" style={{ fontSize: '9px' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <AdComponent />

        <Suspense fallback={<div className="text-center p-5 text-muted">Loading...</div>}>
          <div className="mb-4 rounded-4 overflow-hidden shadow-sm bg-white p-2 mx-1"><Features /></div>
          <RecentStudents />
          <div className="mb-4"><TopCourseList /></div>
          <div className="mb-4"><HomeGallery /></div>

          {/* ADMISSION CTA */}
          <div className="card border-0 rounded-4 shadow-sm mb-4 bg-primary text-white mx-1">
            <div className="card-body p-4 d-md-flex align-items-center justify-content-between text-center text-md-start">
              <div>
                <h5 className="fw-bold mb-1">Join New Batch Today!</h5>
                <p className="small mb-0 opacity-75">Admission open for Tally, ADCA & Web Design.</p>
              </div>
              <Link to="/courses" className="btn btn-light rounded-pill px-4 fw-bold text-primary mt-3 mt-md-0 shadow">Apply Now</Link>
            </div>
          </div>

          <div className="mb-4"><CardSlider /></div>
          <div className="mb-4"><HomeOffers /></div>

          <div className="row g-3 mb-4 mx-0">
            <div className="col-12 col-md-6"><NoticeBoard /></div>
            <div className="col-12 col-md-6"><TimeTable /></div>
          </div>

          <div className="mb-4"><Testimonials /></div>
          <div className="mb-4"><Team /></div>
        </Suspense>

      </div>
      <Footer />
      <ScrollUp />
    </div>
  );
}

export default memo(Home);