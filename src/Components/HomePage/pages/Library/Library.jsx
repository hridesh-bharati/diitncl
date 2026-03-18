import React, { useEffect } from "react";
import CountdownTimer from "./Counter";
import ScrollUp from "../../../HelperCmp/Scroller/ScrollUp";
import QuickSupport from "../About/QuickSupport";
import LibraryFeatures from "./LibraryFeatures";

/* ================= DATA ================= */
const STATS = [
  { icon: "bi-lightning-charge-fill", value: "1 Gbps", label: "Fiber Internet", color: "linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)" }, // Electric Blue
  { icon: "bi-people-fill", value: "150+", label: "Study Seats", color: "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)" }, // Deep Emerald
  { icon: "bi-door-open-fill", value: "24×7", label: "Open Hours", color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }, // Bright Pink/Red
  { icon: "bi-newspaper", value: "Daily", label: "News Paper", color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" }, // Sunset Orange
];

const TESTIMONIALS = [
  { name: "Priya Sharma", role: "UPSC Aspirant", text: "The calm atmosphere helped me stay consistent for long hours." },
  { name: "Rahul Verma", role: "NEET Student", text: "Fast internet and silence make this library perfect." },
  { name: "Anjali Patel", role: "SSC Aspirant", text: "Feels disciplined, clean and motivating every day." },
];

export default function DrishteeLibrary() {
  // Animation Hook (Optimized)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('show');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up, .zoom-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-light overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="position-relative d-flex align-items-center justify-content-center" 
               style={{ minHeight: "500px", height: "80vh" }}>
        <div className="position-absolute top-0 start-0 w-100 h-100">
          <img
            src="/images/library/library.webp"
            alt="Drishtee Library"
            className="w-100 h-100 object-fit-cover"
          />
          <div className="position-absolute top-0 start-0 w-100 h-100" 
               style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.85))" }} />
        </div>

        <div className="container position-relative text-white text-center text-md-start">
          <div className="row">
            <div className="col-lg-8">
              <span className="badge rounded-pill bg-warning text-dark px-3 py-2 mb-3 shadow-sm fade-up">
                <i className="bi bi-clock-fill me-1"></i> OPEN 24 × 7
              </span>
              <h1 className="display-3 fw-bold mb-3 fade-up">Drishtee Digital Library</h1>
              <p className="lead opacity-75 mb-4 fade-up pe-lg-5">
                A modern, silent and secure study space designed for serious aspirants preparing for competitive exams like UPSC, NEET, SSC & Banking.
              </p>
              <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3 fade-up">
                <button className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow">Reserve Seat</button>
                <button className="btn btn-outline-light btn-lg rounded-pill px-5 fw-bold">Visit Today</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS OVERLAP ================= */}
     <section className="container position-relative" style={{ marginTop: "-50px", zIndex: 10 }}>
  <div className="row g-2 g-md-4 justify-content-center px-2">
    {STATS.map((s, i) => (
      <div key={i} className="col-6 col-md-3 zoom-in">
        <div 
          className="rounded-4 p-3 p-md-4 shadow-lg text-center border-0 h-100 transition-hover"
          style={{ 
            background: s.color, 
            color: "white",
            transition: "transform 0.3s ease" 
          }}
        >
          {/* Icon white color mein zyada acha lagega gradient par */}
          <i className={`bi ${s.icon} fs-2 text-white opacity-75 mb-2 d-block`} />
          <h4 className="fw-bold mb-0 text-white">{s.value}</h4>
          <small className="text-white-50 fw-semibold d-block">{s.label}</small>
        </div>
      </div>
    ))}
  </div>
</section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="container py-5 mt-4">
        <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm fade-up">
          <div className="row align-items-center">
            <div className="col-md-1 text-center d-none d-md-block">
               <div className="vr h-100 bg-primary opacity-100" style={{width: '4px'}}></div>
            </div>
            <div className="col-md-11">
              <h2 className="fw-bold text-primary mb-3">About Drishtee Library</h2>
              <p className="text-muted">
                Drishtee Digital Library is built for students who demand discipline, focus and consistency. 
                From early morning to late night, our library provides a calm academic environment where 
                distractions are kept outside and productivity stays inside.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE DRISHTEE (ALL POINTS ADDED) ================= */}
      <section className="container pb-5">
        <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm fade-up">
          <h3 className="fw-bold text-primary mb-4">Why Choose Drishtee?</h3>
          <div className="row g-4">
            <div className="col-md-6">
              <p className="text-muted fs-6 mb-3">
                With ultra-fast <strong>1Gbps internet</strong>, ergonomic seating, uninterrupted power backup 
                and fully air-conditioned halls, Drishtee Library ensures comfort even during long study hours.
              </p>
              <ul className="list-unstyled">
                <li className="mb-2"><i className="bi bi-check2-circle text-success me-2 fw-bold"></i> Silent Study Zones</li>
                <li className="mb-2"><i className="bi bi-check2-circle text-success me-2 fw-bold"></i> Ergonomic Seating</li>
                <li className="mb-2"><i className="bi bi-check2-circle text-success me-2 fw-bold"></i> Uninterrupted Power Backup</li>
              </ul>
            </div>
            <div className="col-md-6">
              <p className="text-muted fs-6 mb-3">
                <strong>Biometric access</strong> guarantees security, while dedicated silent zones help students 
                maintain deep concentration. Clean washrooms, drinking water and free tea add convenience.
              </p>
              <ul className="list-unstyled">
                <li className="mb-2"><i className="bi bi-check2-circle text-success me-2 fw-bold"></i> 24/7 CCTV Monitoring</li>
                <li className="mb-2"><i className="bi bi-check2-circle text-success me-2 fw-bold"></i> RO Drinking Water & Tea</li>
                <li className="mb-2"><i className="bi bi-check2-circle text-success me-2 fw-bold"></i> Daily Newspaper Access</li>
              </ul>
            </div>
          </div>
          <div className="mt-3 p-3 bg-light rounded-4 text-center">
             <p className="text-muted mb-0 fw-bold italic">"Drishtee is not just a library — it is a disciplined ecosystem built to support serious preparation."</p>
          </div>
        </div>
      </section>
      
      {/* FEATURES COMPONENT */}
      <LibraryFeatures />
      
      {/* ================= TESTIMONIALS ================= */}
      <section className="container py-5">
        <h3 className="fw-bold mb-5 text-center fade-up">What Our Students Say</h3>
        <div className="row g-4">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="col-md-4 fade-up" style={{transitionDelay: `${i*150}ms`}}>
              <div className="bg-white rounded-4 p-4 shadow-sm h-100 border-top border-5 border-primary">
                <div className="text-warning mb-3">
                   <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i>
                </div>
                <p className="text-muted mb-4 italic">“{t.text}”</p>
                <div className="d-flex align-items-center">
                   <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '45px', height: '45px'}}>
                      <i className="bi bi-person-fill fs-4"></i>
                   </div>
                   <div>
                     <h6 className="fw-bold mb-0">{t.name}</h6>
                     <small className="text-primary fw-bold">{t.role}</small>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="container py-5 mb-5 fade-up text-center bg-white rounded-5 shadow-lg">
        <h2 className="fw-bold mb-3">Reserve Your Study Seat Now</h2>
        <p className="text-muted mb-4 pe-lg-5 ps-lg-5">Limited seats available to maintain a calm and silent atmosphere. Book your trial today and feel the difference.</p>
        <div className="d-inline-block p-4 border rounded-5 shadow-sm bg-light mb-4">
           <CountdownTimer />
        </div>
        <div className="mt-2">
           <QuickSupport />
        </div>
      </section>

      <ScrollUp />
    </div>
  );
}