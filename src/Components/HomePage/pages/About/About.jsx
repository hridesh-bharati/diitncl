import React, { Suspense, lazy, memo, useEffect } from "react";
import { Link } from "react-router-dom";
import ScrollUp from "../../../HelperCmp/Scroller/ScrollUp";

const Team = lazy(() => import("../../Team"));
const Footer = lazy(() => import("../../../../Components/Footer/Footer"));

const STATS_DATA = [
  { val: 1600, lbl: "Active Students", icon: "bi-people-fill", color: "primary", bg: "primary-subtle" },
  { val: 95, lbl: "Placement Rate", icon: "bi-graph-up-arrow", color: "success", bg: "success-subtle", suffix: "%" },
  { val: 30, lbl: "Certifications", icon: "bi-patch-check-fill", color: "warning", bg: "warning-subtle" },
  { val: 18, lbl: "Years Legacy", icon: "bi-rocket-takeoff-fill", color: "danger", bg: "danger-subtle" }
];

const MILESTONES = [
  { year: '2007', title: 'Foundation', desc: 'Started with 2 systems and a vision to digitize Nichlaul.' },
  { year: '2015', title: 'ISO Certified', desc: 'Achieved international quality standards in vocational training.' },
  { year: '2024', title: 'AI & Cloud Era', desc: 'Launched Data Science & React Dev for modern industry demands.' }
];

const INFRA_ITEMS = [
  { label: "Advanced Computer Lab", icon: "bi-cpu", color: "primary", badge: "Online", bCls: "success" },
  { label: "Digital Library Access", icon: "bi-book", color: "danger", badge: "Available", bCls: "primary" },
  { label: "Fiber Optic Connectivity", icon: "bi-wifi", color: "success", badge: "High Speed", bCls: "warning" }
];

const About = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-white text-dark overflow-hidden" style={{ fontFamily: "'Google Sans', sans-serif" }}>
      
      {/* 1. HERO SECTION - Using Bootstrap Flex & Grid */}
      <section className="container py-5 mt-lg-4">
        <div className="row align-items-center g-5">
          <div className="col-lg-7 text-center text-lg-start">
            <div className="d-inline-flex align-items-center gap-2 rounded-pill px-3 py-1 mb-4 shadow-sm border bg-white">
              <span className="badge rounded-circle bg-primary p-1"><i className="bi bi-stars"></i></span>
              <small className="fw-bold text-dark">Drishtee Institute of IT</small>
            </div>
            <h1 className="display-3 fw-bold mb-4 tracking-tight">
              Accelerating digital skills for <span className="text-primary bg-gradient">everyone.</span>
            </h1>
            <p className="lead text-muted mb-5 pe-lg-5">
              DIIT provides the infrastructure and expertise to help students build careers in the modern IT landscape. Since 2007, we've been Nichlaul's tech hub.
            </p>
            <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
              <Link to="/courses" className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-lg transition-transform">View Programs <i className="bi bi-arrow-right ms-2"></i></Link>
              <Link to="/contact-us" className="btn btn-outline-dark btn-lg px-5 py-3 rounded-pill">Contact Support</Link>
            </div>
          </div>
          <div className="col-lg-5 position-relative">
            <div className="position-absolute top-50 start-50 translate-middle bg-primary opacity-10 blur-50 rounded-circle" style={{width: '400px', height: '400px', filter: 'blur(80px)'}}></div>
            <div className="p-2 border rounded-5 bg-white shadow-lg position-relative z-1">
              <img src="/images/vender/homepic.webp" alt="DIIT Campus" className="img-fluid rounded-4" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS - Pure Bootstrap Utilities */}
      <section className="container py-5">
        <div className="row g-4 text-center">
          {STATS_DATA.map((s, i) => (
            <div key={i} className="col-md-3">
              <div className="p-4 rounded-4 border bg-white h-100 transition-all shadow-sm-hover">
                <div className={`d-inline-flex align-items-center justify-content-center rounded-circle mb-3 bg-${s.bg}`} style={{ width: '64px', height: '64px' }}>
                  <i className={`bi ${s.icon} fs-3 text-${s.color}`}></i>
                </div>
                <h2 className="fw-bold mb-1 display-5">{s.val}{s.suffix || "+"}</h2>
                <p className="text-muted fw-medium small">{s.lbl}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MISSION & INFRA */}
      <section className="container py-5">
        <div className="row g-5">
          <div className="col-md-6">
            <h6 className="text-primary fw-bold text-uppercase mb-2 ls-1">Our Mission</h6>
            <h3 className="display-6 fw-bold mb-4">Empowering with Technology</h3>
            <p className="text-secondary fs-5 lh-lg mb-4">
              We focus on hands-on technical training, industry standard certifications, and career readiness for the digital era.
            </p>
            <div className="vstack gap-3">
              {['ISO 9001:2015 Quality', 'NIELIT Accredited', 'Govt. Approved'].map((text, i) => (
                <div key={i} className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light border-start border-4 border-primary shadow-sm">
                  <i className="bi bi-patch-check-fill text-success fs-5"></i>
                  <span className="fw-bold text-dark">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-6">
            <div className="border rounded-5 p-4 p-lg-5 bg-light-subtle shadow-sm h-100">
              <h4 className="h6 fw-bold text-uppercase mb-4 text-primary">Infrastructure</h4>
              <div className="vstack gap-3">
                {INFRA_ITEMS.map((item, i) => (
                  <div key={i} className="bg-white p-3 border rounded-4 d-flex justify-content-between align-items-center shadow-sm">
                    <div className="d-flex align-items-center gap-3">
                      <i className={`bi ${item.icon} fs-4 text-${item.color}`}></i>
                      <span className="fw-bold small">{item.label}</span>
                    </div>
                    <span className={`badge bg-${item.bCls}-subtle text-${item.bCls} rounded-pill px-3`}>{item.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TECH STACK - Dark Mode UI */}
      <section className="container py-5">
        <div className="row g-0 border rounded-5 overflow-hidden shadow">
          <div className="col-md-6 p-5 text-white bg-primary bg-gradient">
            <h3 className="fw-bold mb-4">Mastering Tech Stack</h3>
            <p className="opacity-75 mb-5 fs-5">Get hands-on experience with tools like Python, React, and Firebase.</p>
            <div className="d-flex flex-wrap gap-2">
              {['Python', 'React.js', 'Firebase', 'C/C++'].map(tag => (
                <span key={tag} className="badge border border-white border-opacity-25 px-4 py-2 rounded-pill fw-normal" style={{backgroundColor: 'rgba(255,255,255,0.1)'}}>{tag}</span>
              ))}
            </div>
          </div>
          <div className="col-md-6 bg-dark p-4">
             <div className="d-flex gap-2 mb-3">
                <div className="p-1 bg-danger rounded-circle"></div><div className="p-1 bg-warning rounded-circle"></div><div className="p-1 bg-success rounded-circle"></div>
             </div>
             <pre className="text-light m-0 font-monospace small px-2">
                <code>
                  <span className="text-info">// DIIT Logic</span><br/>
                  <span className="text-primary">const</span> DIIT = {'{'} status: <span className="text-success">'Industry_Ready'</span> {'}'};<br/>
                  console.log(<span className="text-success">"Skill Up!"</span>);
                </code>
             </pre>
          </div>
        </div>
      </section>

      {/* 5. TIMELINE */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <h6 className="text-primary fw-bold text-uppercase">Evolution</h6>
          <h3 className="fw-bold">Our Journey</h3>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-8 border-start border-2 ms-4 ms-lg-0 ps-4 position-relative">
            {MILESTONES.map((m, i) => (
              <div key={i} className="mb-5 position-relative">
                <div className="position-absolute bg-primary rounded-circle border border-4 border-white shadow-sm" style={{width: '20px', height: '20px', left: '-35px', top: '5px'}}></div>
                <div className="fw-bold text-primary">{m.year}</div>
                <h5 className="fw-bold">{m.title}</h5>
                <p className="text-muted small">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="container py-5 mb-5">
        <div className="rounded-5 p-5 text-center text-white bg-primary bg-gradient position-relative overflow-hidden shadow-lg">
          <h2 className="display-4 fw-bold mb-3 position-relative z-1">Build your future</h2>
          <p className="lead mb-4 position-relative z-1">Join 1500+ successful students today.</p>
          <div className="d-flex justify-content-center gap-3 position-relative z-1">
             <Link to="/contact" className="btn btn-light btn-lg rounded-pill px-5 py-3 fw-bold text-primary">Enroll Now</Link>
          </div>
          <i className="bi bi-rocket-takeoff position-absolute bottom-0 end-0 opacity-10" style={{fontSize: '12rem'}}></i>
        </div>
      </section>

      <Suspense fallback={<div className="text-center p-5"><div className="spinner-border text-primary"></div></div>}>
        <Team />
        <Footer />
        <ScrollUp />
      </Suspense>

      <style>{`
        .transition-all { transition: 0.3s ease; }
        .shadow-sm-hover:hover { transform: translateY(-5px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
        .ls-1 { letter-spacing: 1px; }
        @media (max-width: 768px) { .display-3 { font-size: 2.2rem; } }
      `}</style>
    </div>
  );
};

export default memo(About);