import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Team = lazy(() => import("../../Team"));
const Footer = lazy(() => import("../../../../Components/Footer/Footer"));

// Unified Data Objects
const HIGHLIGHTS = [
  { stat: "15K+", label: "Students", icon: "bi-people", bg: "primary" },
  { stat: "98%", label: "Placement", icon: "bi-graph-up", bg: "success" },
  { stat: "50+", label: "Faculty", icon: "bi-person-badge", bg: "info" },
  { stat: "20+", label: "Courses", icon: "bi-book", bg: "danger" },
  { stat: "19+", label: "Years", icon: "bi-calendar-check", bg: "dark" },
  { stat: "200+", label: "Partners", icon: "bi-building", bg: "warning" },
];

const VALUES = [
  { title: "Our Vision", text: "To create a digitally empowered India where every individual has access to quality computer education.", icon: "bi-eye-fill", color: "primary", bg: "linear-gradient(135deg,#eef4ff,#dbeafe)" },
  { title: "Our Mission", text: "To provide industry-relevant education through innovative methods and state-of-the-art infrastructure.", icon: "bi-bullseye", color: "success", bg: "linear-gradient(135deg,#ecfff3,#d1fae5)" },
  { title: "Our Philosophy", text: "Student First, Always. We believe in holistic development—technical, professional, and ethical growth.", icon: "bi-heart-fill", color: "danger", bg: "linear-gradient(135deg,#fff1f2,#ffe4e6)" },
];

const About = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Reusable Card Component to prevent repetition
  const FeatureItem = ({ icon, title, desc, color }) => (
    <div className="d-flex gap-2 align-items-start p-2 rounded-3 hover-bg-light transition-all">
      <div className={`bg-${color} bg-opacity-10 rounded-circle p-2 flex-shrink-0`}>
        <i className={`bi ${icon} text-${color}`}></i>
      </div>
      <div>
        <h6 className="fw-bold mb-0 small">{title}</h6>
        <p className="small text-muted mb-0" style={{ fontSize: '0.75rem' }}>{desc}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-primary-subtle overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="py-5 text-white shadow-sm position-relative" style={{ background: "linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)" }}>
        <div className="container py-lg-4 position-relative z-1">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div className="d-flex align-items-center gap-3 mb-3 justify-content-center justify-content-lg-start">
                <div className="bg-white rounded-circle p-2 shadow" style={{ width: "60px", height: "60px" }}>
                  <img src="/images/icon/logo.png" alt="Logo" className="w-100 h-100 object-fit-contain" />
                </div>
                <div>
                  <h5 className="mb-0 fw-bold">Drishtee Computer Center</h5>
                  <p className="mb-0 opacity-75 small">Since 2007</p>
                </div>
              </div>
              <h1 className="display-4 fw-bolder mb-3">Your Vision, Our <span className="text-warning">Mission</span></h1>
              <p className="lead opacity-90 mb-4 fs-5">Transforming dreams into reality through quality computer education.</p>
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-2">
                <Link to="/new-admission" className="btn btn-warning px-4 py-2 rounded-pill fw-bold shadow hover-scale">Apply Now</Link>
                <Link to="/" className="btn btn-outline-light px-4 py-2 rounded-pill fw-bold">Brochure</Link>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block">
              <div className="bg-white rounded-4 p-2 shadow-lg"><img src="/images/vender/homepic.webp" alt="Campus" className="img-fluid rounded-3" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BANNER */}
      <section className="container mt-n4 position-relative z-3">
        <div className="row g-2 px-2">
          {HIGHLIGHTS.map((item, idx) => (
            <div key={idx} className="col-4 col-md-2">
              <div className="card border-0 shadow-sm rounded-4 text-center py-3 bg-white hover-up h-100">
                <i className={`bi ${item.icon} fs-4 text-${item.bg} mb-1`}></i>
                <h6 className="fw-bold mb-0">{item.stat}</h6>
                <p className="text-muted mb-0" style={{ fontSize: '0.65rem' }}>{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WELCOME & WHY CHOOSE */}
      <section className="container bg-white py-4 mt-4 rounded-4 shadow-sm">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6 text-center text-lg-start">
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-2 small">Welcome to Drishtee</span>
            <h2 className="fw-bold mb-3">India's Leading <span className="text-primary">Institute</span></h2>
            <p className="text-muted small px-2 px-lg-0">Bridging the gap between academic knowledge and industry requirements.</p>
            <div className="position-relative mt-3 px-2">
              <img src="/images/vender/std1.jpg" alt="Campus" className="img-fluid rounded-4 shadow-sm" />
              <div className="position-absolute bottom-0 end-0 bg-white rounded-3 p-2 shadow m-2" style={{ maxWidth: "150px" }}>
                <p className="small fst-italic mb-0" style={{ fontSize: '0.7rem' }}>"Best decision of my career"</p>
                <small className="text-muted" style={{ fontSize: '0.6rem' }}>- Hridesh Bharati</small>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card border-0 bg-light p-3 rounded-4">
              <h5 className="fw-bold mb-3">Why Choose Us?</h5>
              <div className="vstack gap-1">
                <FeatureItem color="primary" icon="bi-check-lg" title="Industry Curriculum" desc="Designed with 200+ partners" />
                <FeatureItem color="success" icon="bi-check-lg" title="Live Projects" desc="Work on real-world scenarios" />
                <FeatureItem color="info" icon="bi-check-lg" title="Placement Support" desc="98% record with top MNCs" />
                <FeatureItem color="warning" icon="bi-check-lg" title="Flexible Batch" desc="Online & Weekend options" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VISION & MISSION (Single Section) */}
      <section className="container py-5">
        <div className="row g-3">
          {VALUES.map((item, idx) => (
            <div key={idx} className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 h-100 text-center p-4" style={{ background: item.bg }}>
                <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3" 
                     style={{ width: "70px", height: "70px", background: 'rgba(255,255,255,0.5)' }}>
                  <i className={`bi ${item.icon} text-${item.color} fs-2`}></i>
                </div>
                <h5 className={`fw-bold text-${item.color}`}>{item.title}</h5>
                <p className="small text-muted mb-0">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. DIRECTOR MESSAGE */}
      <section className="container pb-5">
        <div className="card border-0 shadow rounded-4 overflow-hidden">
          <div className="row g-0">
            <div className="col-md-4 py-4 text-center text-white d-flex flex-column justify-content-center" style={{ background: "linear-gradient(135deg, #1a2980, #26d0ce)" }}>
              <img src="/images/team/team1.avif" alt="Director" className="rounded-circle border border-3 border-white mx-auto mb-2" style={{ width: "100px", height: "100px", objectFit: 'cover' }} />
              <h6 className="fw-bold mb-0">Mr. Ajay Tiwari</h6>
              <small className="opacity-75">Founder & Director</small>
            </div>
            <div className="col-md-8 p-4">
              <i className="bi bi-quote fs-2 text-primary opacity-25"></i>
              <p className="fst-italic small">"Quality education should be accessible to every aspiring student. Over 15,000 successful students later, we've kept that promise."</p>
              <div className="row g-2 text-center mt-3 pt-3 border-top">
                <div className="col-4 border-end"><h6 className="fw-bold mb-0 text-primary">18+</h6><small className="text-muted" style={{ fontSize: '0.6rem' }}>Years</small></div>
                <div className="col-4 border-end"><h6 className="fw-bold mb-0 text-primary">15K+</h6><small className="text-muted" style={{ fontSize: '0.6rem' }}>Students</small></div>
                <div className="col-4"><h6 className="fw-bold mb-0 text-primary">50+</h6><small className="text-muted" style={{ fontSize: '0.6rem' }}>Faculty</small></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="container mb-5">
        <div className="rounded-5 p-4 text-center text-white shadow-lg" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
          <h3 className="fw-bold mb-2">Ready to Start?</h3>
          <p className="small mb-4 opacity-90">Join Drishtee Computer Center and transform your career</p>
          <div className="d-flex justify-content-center gap-2">
            <Link to="/new-admission" className="btn btn-warning px-4 rounded-pill fw-bold btn-sm">Apply Now</Link>
            <Link to="/contact-us" className="btn btn-outline-light px-4 rounded-pill fw-bold btn-sm">Contact Us</Link>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="text-center p-5"><div className="spinner-border text-primary"></div></div>}>
        <Team />
        <Footer />
      </Suspense>

      <style>{`
        .mt-n4 { margin-top: -1.5rem; }
        .hover-up:hover { transform: translateY(-5px); transition: 0.3s; }
        .hover-scale:hover { transform: scale(1.03); transition: 0.3s; }
        .hover-bg-light:hover { background: rgba(0,0,0,0.02); }
        .transition-all { transition: all 0.3s ease; }
      `}</style>
    </div>
  );
};

export default memo(About);