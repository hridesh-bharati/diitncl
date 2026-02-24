import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";

// Lazy Components
const Team = lazy(() => import("../../Team"));

// --- CONFIG & DATA ---
const EST_YEAR = "2007";
const THEME = { primary: "#0a2885", secondary: "#157ed2", success: "#10B981" };

const IMPACT_STATS = [
  { value: 1500, suffix: "+", label: "Students", icon: "bi-people-fill", color: THEME.primary, bg: "rgba(10, 40, 133, 0.08)" },
  { value: 95, suffix: "%", label: "Placement", icon: "bi-graph-up-arrow", color: THEME.success, bg: "rgba(16, 185, 129, 0.08)" },
  { value: 30, suffix: "+", label: "Courses", icon: "bi-pc-display", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.08)" },
  { value: 24, suffix: "/7", label: "Lab Access", icon: "bi-clock-fill", color: "#EC4899", bg: "rgba(236, 72, 153, 0.08)" }
];

const CERT_DATA = [
  { title: "Drishtee Society", img: "images/thumbnails/Certificate3.png", desc: "ISO 9001 : 2008" },
  { title: "NIELIT", img: "images/thumbnails/Certificate2.png", desc: "Govt. of India Accredited" },
  { title: "Society Reg.", img: "images/thumbnails/Certificate1.png", desc: "Reg No 72/2013" },
  { title: "Algol Trust", img: "images/thumbnails/Certificate4.png", desc: "University Partner" },
];

// --- REUSABLE SUB-COMPONENTS ---

const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center mb-5">
    <h2 className="fw-bold" style={{ color: THEME.primary }}>{title}</h2>
    <hr className="mx-auto border-2 border-primary" style={{ width: '50px' }} />
    <p className="text-muted small">{subtitle}</p>
  </div>
);

const CounterBox = ({ value, suffix, label, icon, color }) => (
  <div className="col text-center">
    <div className="p-3 rounded-4 bg-white shadow-sm h-100 border-bottom border-3" style={{ borderColor: color }}>
      <i className={`bi ${icon} fs-3 mb-2 d-block`} style={{ color }}></i>
      <h3 className="fw-bold mb-0">{value}{suffix}</h3>
      <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '10px' }}>{label}</small>
    </div>
  </div>
);

// --- MAIN COMPONENTS ---

const Certificate = () => {
  const [modal, setModal] = useState({ show: false, img: "" });
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <SectionHeader title="Our Accreditations" subtitle="Verified & Government Recognized Certifications" />
        <div className="row g-3">
          {CERT_DATA.map((c, i) => (
            <div key={i} className="col-md-6 col-lg-3" onClick={() => setModal({ show: true, img: c.img })}>
              <div className="d-flex align-items-center p-3 rounded-4 shadow-sm bg-white hover-top cursor-pointer">
                <img src={c.img} alt={c.title} width="50" className="rounded me-3 shadow-sm" />
                <div className="overflow-hidden">
                  <div className="fw-bold text-truncate" style={{ fontSize: '14px' }}>{c.title}</div>
                  <small className="text-muted d-block text-truncate">{c.desc}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal show={modal.show} onHide={() => setModal({ show: false, img: "" })} centered>
        <Modal.Body className="p-0 border-0 shadow-lg"><img src={modal.img} alt="Cert" className="w-100 rounded" /></Modal.Body>
      </Modal>
    </section>
  );
};

const About = () => {
  const [counts, setCounts] = useState(IMPACT_STATS.map(() => 0));

  useEffect(() => {
    IMPACT_STATS.forEach((stat, i) => {
      let start = 0;
      const end = stat.value;
      if (start === end) return;
      let timer = setInterval(() => {
        start += Math.ceil(end / 50);
        if (start >= end) {
          setCounts(prev => { const nc = [...prev]; nc[i] = end; return nc; });
          clearInterval(timer);
        } else {
          setCounts(prev => { const nc = [...prev]; nc[i] = start; return nc; });
        }
      }, 40);
    });
  }, []);

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="container py-5 mt-md-4">
        <div className="row g-5 align-items-center">
          <div className="col-lg-7">
            <span className="badge bg-primary rounded-pill px-3 py-2 mb-3 shadow-sm">📍 Nichlaul, Maharajganj</span>
            <h1 className="display-4 fw-bold mb-3" style={{ color: THEME.primary }}>Drishtee Computer Institute</h1>
            <p className="lead text-secondary mb-4">Empowering Rural India through Digital Literacy Since {EST_YEAR}</p>
            <div className="text-muted mb-4" style={{ textAlign: 'justify', lineHeight: '1.8' }}>
              Welcome to Eastern UP's premier IT hub. We bridge the digital divide with the philosophy of <em>"Shining India through Skilled India"</em>. Our student-centric approach ensures you don't just get a certificate, but a career.
            </div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <Link
                to="/new-admission"
                className="btn btn-primary rounded-pill px-4 py-2 shadow-sm"
              >
                Apply Now
              </Link>

              <Link
                to="/contact-us"
                className="btn btn-outline-primary rounded-pill px-4 py-2"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="col-lg-5 position-relative">
            <img src="/images/vender/homepic.webp" alt="Campus" className="img-fluid rounded-5 shadow-lg border" />
            <div className="position-absolute bottom-0 start-0 m-3 p-3 bg-white rounded-4 shadow-sm border ">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-patch-check-fill text-success fs-4"></i>
                <small className="fw-bold">NIELIT ACCREDITED<br /><span className="text-muted">DIIT0124</span></small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Counters Strip */}
      <div className="bg-light py-5 border-top">
        <div className="container">
          <div className="row row-cols-2 row-cols-md-4 g-4">
            {IMPACT_STATS.map((s, i) => (
              <CounterBox key={i} {...s} value={counts[i]} />
            ))}
          </div>
        </div>
      </div>

      {/* Philosophy */}
      <section className="container py-5">
        <div className="row g-5 align-items-center">
          <div className="col-md-6 order-2 order-md-1"><img src="/images/vender/office.jpg" alt="Office" className="img-fluid rounded-4 shadow" /></div>
          <div className="col-md-6 order-1 order-md-2">
            <h2 className="fw-bold mb-4" style={{ color: THEME.primary }}>Our Excellence</h2>
            <p className="text-muted">Our teaching methodology combines theoretical knowledge with extensive practical exposure. We operate on three pillars:</p>
            <div className="row g-3">
              {["Quality Education", "Affordability", "Placement Success"].map((item, i) => (
                <div key={i} className="col-12 d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success fs-5"></i>
                  <span className="fw-semibold text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accreditation Section */}
      <Certificate />

      {/* CTA */}
      <section className="container py-5">
        <div className="p-5 rounded-5 text-white text-center shadow-lg" style={{ background: `linear-gradient(45deg, ${THEME.primary}, ${THEME.secondary})` }}>
          <h2 className="fw-bold mb-3">Begin Your IT Career Journey</h2>
          <p className="opacity-75 mb-4">Visit our campus today for a free career counseling session.</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/contact" className="btn btn-warning btn-lg rounded-pill px-5 fw-bold text-dark shadow">Enquire Now</Link>
            <Link to="/OurCourses" className="btn btn-outline-light btn-lg rounded-pill px-4">Browse Courses</Link>
          </div>
        </div>
      </section>
      {/* Lazy Sections */}
      <Suspense fallback={<div className="text-center p-5 spinner-border text-primary" />}>
        <Team />
      </Suspense>

      <style>{`
        .hover-top:hover { transform: translateY(-5px); transition: 0.3s; }
        .cursor-pointer { cursor: pointer; }
        .transition { transition: 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default memo(About);