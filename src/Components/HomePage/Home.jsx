import React, { Suspense, lazy, memo } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

// Core Layout component (Immediately required for LCP)
import AdComponent from "./AdComponent";

// Smart Lazy Loading for ALL sections below the fold
const HomeAbout = lazy(() => import("./pages/HomeAbout"));
const Features = lazy(() => import("./Features"));
const StatsSection = lazy(() => import("./StatsSection"));
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

// Clean HTML5 Skeleton Loader for smooth structural transitions
const SectionPlaceholder = () => (
  <div className="container py-4 text-center placeholder-glow" aria-hidden="true">
    <div className="placeholder col-8 rounded mb-3" style={{ height: "30px" }}></div>
    <div className="placeholder col-5 rounded" style={{ height: "15px" }}></div>
  </div>
);

const PortalItem = memo(({ it }) => {
  const isDownload = it.d;
  const Tag = isDownload ? "a" : Link;
  const linkProps = isDownload ? { href: it.l, download: true } : { to: it.l };

  return (
    <div className="col text-center">
      <Tag {...linkProps} className="text-decoration-none d-block text-dark transition-hover">
        <div className="portal-icon-box shadow-sm text-white rounded-4 border border-white border-2 d-inline-flex justify-content-center align-items-center mb-2" style={{ background: it.g, width: "60px", height: "60px" }}>
          <i className={`bi ${it.i} fs-4`} aria-hidden="true"></i>
        </div>
        <span className="d-block small fw-semibold text-secondary">{it.n}</span>
      </Tag>
    </div>
  );
});

PortalItem.displayName = "PortalItem";

function Home() {
  return (
    <main className="bg-primary-subtle min-vh-100">
      
      {/* ================= HERO/LCP SECTION (SEO & Speed Optimized) ================= */}
      <section id="homeHero" className="carousel slide carousel-fade shadow-sm" data-bs-ride="carousel">
        <div className="carousel-inner bg-dark hero-carousel-wrap">

          {/* Slide 1: Primary LCP Asset (Highest Priority) */}
          <div className="carousel-item active" data-bs-interval="5000">
            <img 
              src="/images/vender/hero1.webp" 
              className="d-block w-100 opacity-75 hero-img-adjust" 
              alt="Drishtee Computer Center - Admissions Open 2026" 
              fetchPriority="high" 
              decoding="async" 
            />
            <div className="carousel-caption d-flex align-items-center start-0 end-0 bottom-0 top-0 p-4 hero-overlay">
              <header className="container p-0 text-start">
                <span className="badge bg-danger rounded-pill mb-2 animate-fade shadow-sm">Admissions Open 2026</span>
                <h1 className="fw-bolder display-5 text-white hero-text-clean animate-top m-0">DRISHTEE <br /> COMPUTER CENTER</h1>
                <Link to="/courses" className="btn btn-primary rounded-pill fw-bold mt-3 px-4 shadow">Explore Courses</Link>
              </header>
            </div>
          </div>

          {/* Slide 2: Secondary Asset (Lazy Pre-rendered) */}
          <div className="carousel-item" data-bs-interval="5000">
            <img 
              src="/images/vender/hero2.webp" 
              className="d-block w-100 opacity-75 hero-img-adjust" 
              alt="Build Your Digital Future with Expert Computer Training" 
              loading="lazy" 
              decoding="async" 
            />
            <div className="carousel-caption d-flex align-items-center start-0 end-0 bottom-0 top-0 p-4 hero-overlay">
              <div className="container p-0 text-start">
                <span className="badge bg-warning text-dark rounded-pill mb-2 animate-fade shadow-sm">Expert Training</span>
                <p className="h1 fw-bolder display-5 text-white hero-text-clean animate-top m-0">BUILD YOUR <br /> DIGITAL FUTURE</p>
                <Link to="/courses" className="btn btn-primary rounded-pill fw-bold mt-3 px-4 shadow">Explore Courses</Link>
              </div>
            </div>
          </div>

        </div>

        {/* Accessible Navigation Controls */}
        <div className="position-absolute end-0 top-50 translate-middle-y z-3 pe-2 d-flex flex-column gap-2">
          <button type="button" className="btn btn-sm btn-outline-light rounded-circle text-light bg-black bg-opacity-25" data-bs-target="#homeHero" data-bs-slide="prev" aria-label="Previous Slide">
            <i className="bi bi-chevron-left" aria-hidden="true"></i>
          </button>
          <button type="button" className="btn btn-sm btn-outline-light rounded-circle text-light bg-black bg-opacity-25" data-bs-target="#homeHero" data-bs-slide="next" aria-label="Next Slide">
            <i className="bi bi-chevron-right" aria-hidden="true"></i>
          </button>
        </div>
      </section>

      {/* ================= STUDENT PORTAL NAVIGATION ================= */}
      <nav className="border-bottom p-3 bg-white" aria-label="Student Portal Links">
        <div className="container-fluid">
          <h2 className="h6 fw-bold mb-3 border-start border-primary border-4 ps-2 text-uppercase" style={{ fontSize: '0.85rem' }}>
            Student Portal
          </h2>
          <div className="row row-cols-3 row-cols-md-6 g-3">
            {PORTALS.map((p, i) => <PortalItem key={i} it={p} />)}
          </div>
        </div>
      </nav>

      {/* ================= DEFERRED CONTENT (Everything Below Portal is Lazy Loaded) ================= */}
      <Suspense fallback={<SectionPlaceholder />}>
        <StatsSection />
        <HomeAbout />
        <Features />
        <RecentStudents />
        
        <section className="container-fluid my-4 px-2">
          <TopCourseList />
        </section>

        {/* CTA Conversion Banner */}
        <article className="card border-0 shadow-sm mb-4 mx-2">
          <div className="card-body p-4 d-md-flex align-items-center justify-content-between text-center text-md-start">
            <div>
              <h3 className="h5 fw-bold mb-1">Join New Batch Today!</h3>
              <p className="small mb-0 text-muted">Admission open for Tally Prime, ADCA & Professional Web Design.</p>
            </div>
            <Link to="/courses" className="btn btn-primary rounded-pill px-4 fw-bold mt-3 mt-md-0 shadow">Apply Now</Link>
          </div>
        </article>

        <section className="mb-4"><CardSlider /></section>
        <section className="mb-4"><HomeOffers /></section>

        {/* Notice & Updates Grid */}
        <section className="container-fluid px-2 mb-4">
          <div className="row g-3 mx-0">
            <aside className="col-12 col-md-6 p-0 pe-md-2"><NoticeBoard /></aside>
            <aside className="col-12 col-md-6 p-0 ps-md-2"><TimeTable /></aside>
          </div>
        </section>

        <section className="mb-4" id="testimonials"><Testimonials /></section>
        <AdComponent />
        <section className="mb-4" id="team"><Team /></section>
        <Footer />
      </Suspense>

    </main>
  );
}

export default memo(Home);