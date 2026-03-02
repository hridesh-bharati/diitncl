import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// --- Lazy Loading All Heavy/External Components ---
const Team = lazy(() => import("../../Team"));
const Footer = lazy(() => import("../../../../Components/Footer/Footer"));
const ScrollUp = lazy(() => import("../../../HelperCmp/Scroller/ScrollUp"));

const THEME = {
  googleBlue: "#1a73e8", paytmBlue: "#00baf2",
  darkText: "#202124", deepBlue: "#002e6e"
};

const STATS = [
  { val: 1500, sfx: "+", lbl: "Students", icon: "bi-people", c: THEME.googleBlue },
  { val: 95, sfx: "%", lbl: "Success Rate", icon: "bi-award", c: "#10b981" },
  { val: 30, sfx: "+", lbl: "Programs", icon: "bi-laptop", c: "#f59e0b" },
  { val: 24, sfx: "/7", lbl: "Support", icon: "bi-headset", c: "#ec4899" }
];

const PHILOSOPHY = [
  { t: "Practical Learning", d: "More time on labs than books.", c: THEME.googleBlue },
  { t: "Certified Faculty", d: "Industry experts with 10+ years exp.", c: "#34a853" },
  { t: "Placement Cell", d: "Dedicated team for your career growth.", c: "#fbbc04" }
];

// Reusable Loader
const SectionLoader = () => <div className="text-center p-5"><div className="spinner-border text-primary spinner-border-sm"></div></div>;

const CounterBox = ({ value, suffix, label, icon, color }) => (
  <div className="col">
    <div className="h-100 p-4 rounded-4 border-0 shadow-sm transition hover-lift bg-white text-center">
      <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
        style={{ width: '60px', height: '60px', backgroundColor: `${color}15` }}>
        <i className={`bi ${icon} fs-3`} style={{ color }}></i>
      </div>
      <h2 className="fw-bold mb-1 mt-2" style={{ color: THEME.darkText }}>{value}{suffix}</h2>
      <p className="text-muted small fw-medium mb-0">{label}</p>
    </div>
  </div>
);

const About = () => {
  const [counts, setCounts] = useState(STATS.map(() => 0));

  useEffect(() => {
    STATS.forEach((s, i) => {
      let start = 0;
      const timer = setInterval(() => {
        start += Math.ceil(s.val / 30);
        if (start >= s.val) {
          setCounts(p => { const n = [...p]; n[i] = s.val; return n; });
          clearInterval(timer);
        } else {
          setCounts(p => { const n = [...p]; n[i] = start; return n; });
        }
      }, 50);
    });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white position-relative" style={{ fontFamily: "'Google Sans', Roboto, sans-serif" }}>

      {/* Hero Section */}
      <div className="position-absolute top-0 end-0 translate-middle-y opacity-25 d-none d-lg-block"
        style={{ width: '400px', height: '400px', background: `radial-gradient(circle, ${THEME.googleBlue} 0%, transparent 70%)` }}></div>

      <section className="container py-5 position-relative">
        <div className="row g-5 align-items-center pt-lg-5">
          <div className="col-lg-6">
            <span className="badge rounded-pill bg-light text-primary px-3 py-2 border mb-3">
              <i className="bi bi-shield-check me-1"></i> ISO 9001:2008 Certified
            </span>
            <h1 className="display-3 fw-bold mb-4" style={{ color: THEME.darkText, letterSpacing: '-1px' }}>
              We build the <span style={{ color: THEME.googleBlue }}>future</span> of digital India.
            </h1>
            <p className="fs-5 text-secondary mb-5">Drishtee Computer Institute is bridging the digital divide since 2007. Trusted by 15,000+ students.</p>
            <div className="d-flex gap-3">
              <Link to="/new-admission" className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm fw-bold border-0" style={{ backgroundColor: THEME.googleBlue }}>Apply Now</Link>
              <Link to="/contact-us" className="btn btn-outline-dark btn-lg rounded-pill px-4 fw-bold">Learn More</Link>
            </div>
          </div>

          <div className="col-lg-6 text-center">
            <div className="position-relative p-4 d-inline-block">
              <div className="floating-img shadow-lg rounded-5 overflow-hidden border">
                <img src="/images/vender/homepic.webp" alt="Campus" className="img-fluid" style={{ maxHeight: '450px' }} />
              </div>
              <div className="position-absolute top-0 start-0 translate-middle-x mt-5 d-none d-md-block shadow-lg p-3 bg-white rounded-4 border animate-float glass-card">
                <div className="d-flex align-items-center gap-3 text-start">
                  <div className="bg-success rounded-circle p-2 text-white"><i className="bi bi-check-lg"></i></div>
                  <div className="fw-bold small">NIELIT Accredited<div className="text-muted fw-normal">DIIT0124</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 my-5 bg-light">
        <div className="container">
          <div className="row row-cols-2 row-cols-lg-4 g-4">
            {STATS.map((s, i) => (
              <CounterBox key={i} value={counts[i]} suffix={s.sfx} label={s.lbl} icon={s.icon} color={s.c} />
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="container py-5">
        <div className="row g-5 align-items-center">
          <div className="col-md-6 text-center">
            <img src="/images/vender/office.jpg" alt="Office" className="img-fluid rounded-5 shadow-sm border p-2 bg-light" />
          </div>
          <div className="col-md-6 ps-lg-5">
            <h6 className="text-primary fw-bold text-uppercase mb-2">Our Philosophy</h6>
            <h2 className="fw-bold mb-4 display-6">Quality Education for Everyone.</h2>
            {PHILOSOPHY.map((item, i) => (
              <div key={i} className="d-flex gap-3 mb-4">
                <i className="bi bi-check-circle-fill fs-5" style={{ color: item.c }}></i>
                <div><h5 className="fw-bold mb-1">{item.t}</h5><p className="text-muted small mb-0">{item.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blue CTA Section */}
      <section className="container py-5 mb-5">
        <div className="rounded-5 p-5 text-center shadow-lg position-relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${THEME.deepBlue} 0%, ${THEME.paytmBlue} 100%)` }}>
          <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
            style={{ background: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
          <div className="position-relative z-1 text-white">
            <h2 className="display-5 fw-bold mb-4">Ready to start your journey?</h2>
            <p className="opacity-75 mb-5 fs-5 mx-auto" style={{ maxWidth: '600px' }}>Join the most advanced computer institute in Nichlaul.</p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/contact" className="btn btn-light btn-lg rounded-pill px-5 fw-bold text-primary shadow">Enquire Now</Link>
              <Link to="/courses" className="btn btn-outline-light btn-lg rounded-pill px-5 fw-bold border-2">View Courses</Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- ALL LAZY COMPONENTS IN ONE SUSPENSE BATCH --- */}
      <Suspense fallback={<SectionLoader />}>
        <section className="py-5 bg-white">
          <Team />
        </section>
        <ScrollUp />
        <Footer />
      </Suspense>

      <style>{`
        .hover-lift:hover { transform: translateY(-10px); transition: 0.3s ease; }
        .hover-lift, .floating-img { transition: 0.3s ease; }
        .glass-card { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); z-index: 10; }
        .animate-float { animation: float 3s infinite ease-in-out; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .btn-lg { padding: 0.8rem 2.5rem; font-size: 1rem; }
      `}</style>
    </div>
  );
};

export default memo(About);