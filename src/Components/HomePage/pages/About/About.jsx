import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Lazy Loading
const Team = lazy(() => import("../../Team"));
const Footer = lazy(() => import("../../../../Components/Footer/Footer"));
const ScrollUp = lazy(() => import("../../../HelperCmp/Scroller/ScrollUp"));

const THEME = { blue: "#1a73e8", dark: "#202124", bg: "#f8f9fa" };

const STATS = [
  { val: 1500, sfx: "+", lbl: "Students", icon: "bi-people", c: "text-primary" },
  { val: 95, sfx: "%", lbl: "Success Rate", icon: "bi-award", c: "text-success" },
  { val: 30, sfx: "+", lbl: "Programs", icon: "bi-laptop", c: "text-warning" },
  { val: 24, sfx: "/7", lbl: "Support", icon: "bi-headset", c: "text-danger" }
];

const PHILOSOPHY = [
  { t: "Practical Learning", d: "More time on labs than books.", c: "text-primary" },
  { t: "Certified Faculty", d: "Industry experts with 10+ years exp.", c: "text-success" },
  { t: "Placement Cell", d: "Dedicated team for your career growth.", c: "text-warning" }
];

const SectionLoader = () => <div className="text-center p-5"><div className="spinner-border spinner-border-sm text-primary"></div></div>;

const About = () => {
  const [counts, setCounts] = useState(STATS.map(() => 0));

  useEffect(() => {
    window.scrollTo(0, 0);
    const duration = 2000;
    const steps = 40;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setCounts(prev => prev.map((c, i) => {
        if (c < STATS[i].val) {
          return Math.min(Math.ceil(c + STATS[i].val / steps), STATS[i].val);
        }
        return c;
      }));
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white overflow-hidden" style={{ fontFamily: "'Google Sans', sans-serif" }}>
      
      {/* --- HERO SECTION --- */}
      <section className="container py-5 position-relative">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 mb-3 border border-primary border-opacity-25">
              <i className="bi bi-shield-check me-1"></i> ISO 9001:2008 Certified
            </span>
            <h1 className="display-3 fw-bold mb-4" style={{ color: THEME.dark, letterSpacing: '-1px' }}>
              We build the <span className="text-primary">future</span> of digital India.
            </h1>
            <p className="lead text-secondary mb-5">Drishtee Computer Institute is bridging the digital divide since 2007. Trusted by 15,000+ students.</p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/new-admission" className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow-sm">Apply Now</Link>
              <Link to="/contact-us" className="btn btn-outline-dark btn-lg rounded-pill px-4 fw-bold">Learn More</Link>
            </div>
          </div>

          <div className="col-lg-6 text-center position-relative">
            <div className="p-3 d-inline-block position-relative">
              <img src="/images/vender/homepic.webp" alt="Campus" className="img-fluid rounded-5 shadow-lg border animate-float" style={{ maxHeight: '450px' }} />
              {/* Floating Badge */}
              <div className="position-absolute top-0 start-0 translate-middle mt-5 d-none d-md-block">
                <div className="bg-white p-3 rounded-4 shadow-sm border glass-card text-start d-flex align-items-center gap-2">
                  <div className="bg-success rounded-circle p-1 text-white"><i className="bi bi-check-lg small"></i></div>
                  <div className="fw-bold small">NIELIT Accredited<div className="text-muted fw-normal">DIIT0124</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row row-cols-2 row-cols-lg-4 g-3">
            {STATS.map((s, i) => (
              <div className="col" key={i}>
                <div className="h-100 p-4 rounded-4 bg-white shadow-sm text-center border-0 hover-lift">
                  <div className={`d-inline-flex align-items-center justify-content-center rounded-circle mb-3 bg-light ${s.c}`} style={{ width: '50px', height: '50px' }}>
                    <i className={`bi ${s.icon} fs-4`}></i>
                  </div>
                  <h3 className="fw-bold mb-0 text-dark">{counts[i]}{s.sfx}</h3>
                  <small className="text-muted fw-bold">{s.lbl}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PHILOSOPHY --- */}
      <section className="container py-5">
        <div className="row g-5 align-items-center">
          <div className="col-md-6 order-2 order-md-1">
            <img src="/images/vender/office.jpg" alt="Office" className="img-fluid rounded-5 shadow-sm border p-2 bg-light" />
          </div>
          <div className="col-md-6 order-1 order-md-2 ps-lg-5">
            <h6 className="text-primary fw-bold text-uppercase small mb-2">Our Philosophy</h6>
            <h2 className="fw-bold mb-4 h1">Quality Education for Everyone.</h2>
            {PHILOSOPHY.map((item, i) => (
              <div key={i} className="d-flex gap-3 mb-4">
                <i className={`bi bi-check-circle-fill fs-5 ${item.c}`}></i>
                <div><h5 className="fw-bold mb-1 h6">{item.t}</h5><p className="text-muted small mb-0">{item.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="container py-5 mb-5">
        <div className="rounded-5 p-5 text-center shadow-lg bg-primary text-white position-relative overflow-hidden"
             style={{ background: `linear-gradient(135deg, #002e6e 0%, ${THEME.blue} 100%)` }}>
          <div className="position-relative z-index-1">
            <h2 className="display-5 fw-bold mb-3">Ready to start your journey?</h2>
            <p className="opacity-75 mb-4 lead">Join the most advanced computer institute in Nichlaul.</p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/contact" className="btn btn-light btn-lg rounded-pill px-5 fw-bold text-primary shadow">Enquire Now</Link>
              <Link to="/courses" className="btn btn-outline-light btn-lg rounded-pill px-5 fw-bold border-2">View Courses</Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- LAZY BATCH --- */}
      <Suspense fallback={<SectionLoader />}>
        <Team />
        <ScrollUp />
        <Footer />
      </Suspense>

      <style>{`
        .hover-lift:hover { transform: translateY(-8px); transition: 0.3s ease; }
        .animate-float { animation: float 4s infinite ease-in-out; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(5px); }
        .btn-lg { font-size: 0.95rem; }
      `}</style>
    </div>
  );
};

export default memo(About);