import React, { Suspense, lazy, memo, useEffect } from "react";
import { Link } from "react-router-dom";
import ScrollUp from "../../../HelperCmp/Scroller/ScrollUp"
// --- LAZY COMPONENTS ---
const Team = lazy(() => import("../../Team"));
const Footer = lazy(() => import("../../../../Components/Footer/Footer"));

// --- CONSTANTS & DATA ---
const GOOGLE_COLORS = {
  blue: "#1a73e8",
  red: "#ea4335",
  yellow: "#f9ab00",
  green: "#34a853",
  bg: "#ffffff",
  border: "#dadce0"
};

const STATS_DATA = [
  { val: 1600, lbl: "Active Students", icon: "bi-people-fill", color: GOOGLE_COLORS.blue, bg: "#e8f0fe" },
  { val: 95, lbl: "Placement Rate", icon: "bi-graph-up-arrow", color: GOOGLE_COLORS.green, bg: "#e6f4ea", suffix: "%" },
  { val: 30, lbl: "Certifications", icon: "bi-patch-check-fill", color: GOOGLE_COLORS.yellow, bg: "#fef7e0" },
  { val: 18, lbl: "Years Legacy", icon: "bi-rocket-takeoff-fill", color: GOOGLE_COLORS.red, bg: "#fce8e6" }
];

const MILESTONES = [
  { year: '2007', title: 'Foundation', desc: 'Started with 2 systems and a vision to digitize Nichlaul. DIIT was born with the intent to bridge the digital divide.' },
  { year: '2015', title: 'ISO Certification & Growth', desc: 'Achieved international quality standards. Expanded the curriculum to include advanced vocational training.' },
  { year: '2024', title: 'AI & Cloud Era', desc: 'Launched advanced courses in Data Science, React Development, and Cloud Computing to meet modern demands.' }
];

const INFRA_ITEMS = [
  { label: "Advanced Computer Lab", icon: "bi-cpu", color: "primary", badge: "Online", badgeClass: "success" },
  { label: "Digital Library Access", icon: "bi-book", color: "danger", badge: "Available", badgeClass: "primary" },
  { label: "Fiber Optic Connectivity", icon: "bi-wifi", color: "success", badge: "High Speed", badgeClass: "warning" }
];

// --- REUSABLE SUB-COMPONENTS (DRY) ---
const SectionHeader = ({ title, subtitle, centered = false }) => (
  <div className={`mb-5 ${centered ? 'text-center' : ''}`}>
    {subtitle && <h6 className="text-primary fw-bold text-uppercase mb-2" style={{ letterSpacing: '1px' }}>{subtitle}</h6>}
    <h3 className="display-6 fw-bold">{title}</h3>
  </div>
);

const SectionLoader = () => (
  <div className="text-center p-5 mt-5">
    <div className="spinner-grow text-primary" role="status"></div>
  </div>
);

// --- MAIN COMPONENT ---
const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-production-ready" style={{ backgroundColor: GOOGLE_COLORS.bg, color: "#202124", fontFamily: "'Google Sans', sans-serif", overflowX: 'hidden' }}>
      
      {/* 1. TOP NAVIGATION INFO */}
      <div className="border-bottom py-2 px-4 d-none d-md-flex justify-content-between align-items-center bg-light">
        <small className="text-muted fw-medium"> Drishtee Institute of Information Technology &gt; About the Institute &gt; Institutional Overview</small>
        <small className="text-primary fw-bold">Verification ID: DIIT124</small>
      </div>

      {/* 2. HERO SECTION */}
      <section className="container py-5 mt-lg-4">
        <div className="row align-items-center g-5">
          <div className="col-lg-7 text-center text-lg-start animate-fade-in">
            <div className="d-inline-flex align-items-center gap-2 rounded-pill px-3 py-1 mb-4 shadow-sm border bg-white">
              <span className="badge rounded-circle p-1" style={{ background: GOOGLE_COLORS.blue }}><i className="bi bi-stars text-white"></i></span>
              <small className="fw-bold text-dark">Drishtee Institute of Information Technology</small>
            </div>
            <h1 className="display-3 fw-bold mb-4" style={{ letterSpacing: "-1.5px", lineHeight: '1.1' }}>
              Accelerating digital skills for <span className="gradient-text">everyone.</span>
            </h1>
            <p className="lead text-muted mb-5 pe-lg-5" style={{ fontSize: "1.25rem", lineHeight: "1.6" }}>
              DIIT provides the infrastructure and expertise to help students build, deploy, and scale their careers in the modern IT landscape. Since 2007, we've been at the forefront of technical excellence in Nichlaul.
            </p>
            <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
              <Link to="/courses" className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-blue hover-up">View All Programs <i className="bi bi-arrow-right ms-2"></i></Link>
              <Link to="/contact-us" className="btn btn-outline-dark btn-lg px-5 py-3 rounded-pill hover-up">Contact Support</Link>
            </div>
          </div>
          <div className="col-lg-5 position-relative">
            <div className="hero-blob"></div>
            <div className="p-2 border rounded-5 bg-white shadow-lg position-relative" style={{ zIndex: 1 }}>
              <img src="/images/vender/homepic.webp" alt="DIIT Campus" className="img-fluid rounded-4 shadow-sm" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. STATS GRID */}
      <section className="container py-5">
        <div className="row g-4">
          {STATS_DATA.map((s, i) => (
            <div key={i} className="col-md-3">
              <div className="p-4 rounded-4 border shadow-hover bg-white h-100 text-center transition-all">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '64px', height: '64px', backgroundColor: s.bg }}>
                  <i className={`bi ${s.icon} fs-3`} style={{ color: s.color }}></i>
                </div>
                <h2 className="fw-bold mb-1" style={{ fontSize: "2.5rem" }}>{s.val}{s.suffix || "+"}</h2>
                <p className="text-muted fw-medium mb-2">{s.lbl}</p>
                <div className="progress mx-auto" style={{ height: "4px", width: "60%", backgroundColor: "#f1f3f4" }}>
                  <div className="progress-bar" style={{ backgroundColor: s.color, width: "85%" }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MISSION & INFRASTRUCTURE */}
      <section className="container py-5">
        <div className="row g-5">
          <div className="col-md-6">
            <SectionHeader title="Our mission" />
            <p className="text-secondary mb-4 fs-5" style={{ lineHeight: "1.8" }}>
              To provide a high-performance learning environment that empowers students to solve real-world problems. We focus on hands-on technical training, industry standard certifications, and career readiness.
            </p>
            <div className="d-grid gap-3 mt-4">
              {['ISO 9001:2015 Certified Quality', 'NIELIT Accredited Center', 'Government Approved Curriculum'].map((text, i) => (
                <div key={i} className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light border-start border-4 border-primary shadow-sm hover-side">
                  <i className="bi bi-patch-check-fill text-success fs-5"></i>
                  <span className="fw-bold text-dark">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-6">
            <div className="border rounded-5 p-5 h-100 shadow-sm bg-light-soft">
              <h4 className="h6 fw-bold text-uppercase mb-4 text-primary" style={{ letterSpacing: "2px" }}>Infrastructure Ecosystem</h4>
              <div className="d-grid gap-3">
                {INFRA_ITEMS.map((item, i) => (
                  <div key={i} className="bg-white p-4 border rounded-4 d-flex justify-content-between align-items-center shadow-sm logo-hover">
                    <div className="d-flex align-items-center gap-3">
                      <i className={`bi ${item.icon} fs-4 text-${item.color}`}></i>
                      <span className="fw-bold">{item.label}</span>
                    </div>
                    <span className={`badge bg-${item.badgeClass}-subtle text-${item.badgeClass} border-0 px-3 py-2 rounded-pill`}>{item.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TECH STACK (CODE VIEW) */}
      <section className="container py-5">
        <div className="row g-0 border rounded-5 overflow-hidden shadow-2xl">
          <div className="col-md-6 p-5 text-white" style={{ background: `linear-gradient(135deg, ${GOOGLE_COLORS.blue} 0%, #0d47a1 100%)` }}>
            <SectionHeader title="Mastering the Tech Stack" />
            <p className="opacity-75 mb-5 fs-5">We don't just teach software; we teach the logic behind the technology. From C to Cloud, get hands-on experience with modern tools.</p>
            <div className="d-flex flex-wrap gap-2">
              {['Python', 'React.js', 'Firebase', 'C/C++', 'O-Level', 'Full Stack'].map(tag => (
                <span key={tag} className="badge border border-white border-opacity-50 fw-normal px-4 py-2 rounded-pill" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>{tag}</span>
              ))}
            </div>
          </div>
          <div className="col-md-6 bg-black p-4 position-relative">
             <div className="d-flex gap-2 mb-3">
                <div className="code-dot bg-danger"></div>
                <div className="code-dot bg-warning"></div>
                <div className="code-dot bg-success"></div>
             </div>
             <pre className="m-0 code-snippet">
               <code>
                 <span style={{color: '#c678dd'}}>// DIIT Curriculum 2026</span><br/>
                 <span style={{color: GOOGLE_COLORS.blue}}>class</span> <span style={{color: GOOGLE_COLORS.yellow}}>StudentProfile</span> {'{'}<br/>
                 &nbsp;&nbsp;name = <span style={{color: GOOGLE_COLORS.green}}>"Future Innovator"</span>;<br/>
                 &nbsp;&nbsp;skills = [<span style={{color: GOOGLE_COLORS.green}}>"Logic"</span>, <span style={{color: GOOGLE_COLORS.green}}>"Code"</span>];<br/>
                 &nbsp;&nbsp;status = <span style={{color: GOOGLE_COLORS.green}}>"Industry Ready"</span>;<br/>
                 &nbsp;&nbsp;goal = <span style={{color: GOOGLE_COLORS.green}}>"Digital Excellence"</span>;<br/>
                 {'}'}<br/>
                 <br/>
                 <span style={{color: '#56b6c2'}}>console</span>.<span style={{color: '#61afef'}}>log</span>(<span style={{color: GOOGLE_COLORS.green}}>"Learning Never Stops..."</span>);
               </code>
             </pre>
          </div>
        </div>
      </section>

      {/* 6. TIMELINE */}
      <section className="container py-5 mt-4">
        <SectionHeader title="Our technical journey" subtitle="Evolution" centered />
        <div className="row justify-content-center">
          <div className="col-lg-8 position-relative">
            <div className="border-start position-absolute h-100 timeline-line"></div>
            {MILESTONES.map((m, i) => (
              <div key={i} className="mb-5 ms-5 position-relative animate-slide-in">
                <div className="timeline-dot shadow-sm"></div>
                <div className="fw-bold text-primary mb-1" style={{ fontSize: '1.2rem' }}>{m.year}</div>
                <h5 className="fw-bold h5 text-dark">{m.title}</h5>
                <p className="text-muted fs-6 mb-0 pe-lg-5">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PLACEMENT GRID */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-md-5">
              <SectionHeader title="Bridge to Industry" />
              <p className="text-secondary fs-5 pe-lg-4">Our graduates are building careers in India's leading tech hubs, from local administration to global IT giants.</p>
              <div className="bg-white border rounded-4 p-4 d-flex align-items-center gap-4 shadow-sm mt-4 hover-up">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3"><i className="bi bi-briefcase-fill text-primary fs-3"></i></div>
                <div><div className="fw-bold fs-5">Placement Cell</div><div className="text-muted small">Dedicated support for resumes & portfolios.</div></div>
              </div>
            </div>
            <div className="col-md-7">
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                {['TCS', 'Wipro', 'HCL', 'Govt. Offices', 'Banking Sector', 'Web Studios', 'Digital Marketing', 'Software Houses'].map((tag, i) => (
                  <span key={i} className="px-4 py-3 bg-white border rounded-4 shadow-sm fw-bold text-muted logo-hover transition-all">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CAMPUS GRID */}
      <section className="container py-5 mt-4">
        <SectionHeader title="Designed for Focus" centered />
        <div className="row g-3">
          <div className="col-md-8">
            <div className="img-container shadow-sm" style={{ height: '400px' }}>
              <img src="/images/vender/lab.jpg" className="w-100 h-100 object-fit-cover transition-all" alt="IT Lab" />
              <div className="img-overlay"><h5 className="mb-0">Advanced Programming Lab</h5></div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-grid gap-3 h-100">
              <div className="img-container shadow-sm" style={{ height: '192px' }}>
                <img src="/images/library/library.webp" className="w-100 h-100 object-fit-cover" alt="Library" />
              </div>
              <div className="img-container shadow-sm" style={{ height: '192px' }}>
                <img src="/images/vender/std1.jpg" className="w-100 h-100 object-fit-cover" alt="Class" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="container py-5 mb-5">
        <div className="cta-box shadow-blue">
           <div className="position-relative" style={{ zIndex: 1 }}>
              <h2 className="display-4 fw-bold mb-3">Ready to build your digital future?</h2>
              <p className="lead opacity-75 mb-4 fs-4">Join 1500+ successful students and start your journey today.</p>
              <div className="d-flex justify-content-center gap-3">
                 <Link to="/contact" className="btn btn-light btn-lg rounded-pill px-5 py-3 fw-bold text-primary shadow-sm hover-up">Enroll Now</Link>
                 <Link to="/courses" className="btn btn-outline-light btn-lg rounded-pill px-5 py-3 hover-up">Explore Catalog</Link>
              </div>
           </div>
           <i className="bi bi-rocket-takeoff cta-icon"></i>
        </div>
      </section>

      {/* LAZY FOOTER & TEAM */}
      <Suspense fallback={<SectionLoader />}>
        <Team />
        <Footer />
        <ScrollUp/>
      </Suspense>

      <style>{`
        .gradient-text {
          background: linear-gradient(90deg, ${GOOGLE_COLORS.blue}, ${GOOGLE_COLORS.red});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .shadow-blue { box-shadow: 0 20px 40px rgba(26, 115, 232, 0.3); }
        .shadow-hover:hover { 
          transform: translateY(-10px); 
          box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
          border-color: ${GOOGLE_COLORS.blue} !important;
        }
        .transition-all { transition: all 0.4s ease-in-out; }
        .logo-hover:hover { color: ${GOOGLE_COLORS.blue} !important; border-color: ${GOOGLE_COLORS.blue} !important; transform: scale(1.05); }
        .hover-up:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .hover-side:hover { transform: translateX(10px); background: #fff !important; }
        .hero-blob {
          position: absolute; top: 50%; start: 50%; transform: translate(-50%, -50%);
          width: 400px; height: 400px; background: ${GOOGLE_COLORS.blue};
          filter: blur(80px); opacity: 0.15; z-index: 0;
        }
        .bg-light-soft { backgroundColor: "#f8f9fa"; }
        .code-dot { width: 10px; height: 10px; border-radius: 50%; }
        .code-snippet { font-family: 'Fira Code', monospace; color: #d1d1d1; fontSize: 14px; line-height: 1.8; }
        .timeline-line { left: 15px; border-color: ${GOOGLE_COLORS.border}; }
        .timeline-dot { 
          position: absolute; width: 20px; height: 20px; left: -45px; top: 5px;
          border-radius: 50%; background: #fff; border: 4px solid ${GOOGLE_COLORS.blue};
        }
        .img-container { border-radius: 2rem; overflow: hidden; border: 1px solid #eee; position: relative; }
        .img-overlay {
          position: absolute; bottom: 0; start: 0; padding: 1.5rem; color: #fff; width: 100%;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
        }
        .cta-box {
          border-radius: 3rem; padding: 5rem 2rem; text-align: center; color: #fff;
          background: linear-gradient(45deg, ${GOOGLE_COLORS.blue}, #673ab7);
          position: relative; overflow: hidden;
        }
        .cta-icon { position: absolute; top: 0; end: 0; padding: 2rem; opacity: 0.1; font-size: 15rem; }
        @media (max-width: 768px) {
          .display-3 { font-size: 2.5rem; }
          .timeline-line { display: none; }
          .timeline-dot { display: none; }
        }
      `}</style>
    </div>
  );
};

export default memo(About);