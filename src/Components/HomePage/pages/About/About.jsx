import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScrollUp from "../../../HelperCmp/Scroller/ScrollUp";

const Team = lazy(() => import("../../Team"));
const Footer = lazy(() => import("../../../../Components/Footer/Footer"));

// Company Timeline Data
const TIMELINE_DATA = [
  { year: "2007", title: "Foundation", desc: "Drishtee Computer Center established with a vision to empower rural youth with digital skills.", icon: "bi-building", color: "primary" },
  { year: "2012", title: "Expansion", desc: "Opened second branch and introduced advanced diploma programs.", icon: "bi-diagram-3", color: "success" },
  { year: "2018", title: "Digital Innovation Hub", desc: "Launched coding bootcamps and AI/ML certification programs.", icon: "bi-cpu", color: "info" },
  { year: "2024", title: "10,000+ Students", desc: "Celebrated placement of over 10,000 students in top IT companies.", icon: "bi-trophy", color: "warning" }
];

// Core Values
const CORE_VALUES = [
  { title: "Quality Education", desc: "Industry-aligned curriculum with practical hands-on training.", icon: "bi-star-fill", color: "danger" },
  { title: "Affordable Fees", desc: "Quality education at prices accessible to every student.", icon: "bi-wallet2", color: "success" },
  { title: "100% Placement Support", desc: "Dedicated placement cell with tie-ups with 200+ companies.", icon: "bi-briefcase-fill", color: "primary" },
  { title: "Expert Faculty", desc: "Industry professionals with 10+ years of teaching experience.", icon: "bi-person-workspace", color: "info" }
];

// Facilities
const FACILITIES = [
  { name: "Smart Classrooms", icon: "bi-easel", desc: "Projector-equipped digital classrooms" },
  { name: "Modern Lab", icon: "bi-pc-display", desc: "50+ high-end computers with latest software" },
  { name: "Library", icon: "bi-journal-bookmark-fill", desc: "5000+ technical books & e-resources" },
  { name: "Hostel Facility", icon: "bi-building", desc: "Comfortable accommodation for outstation students" },
  { name: "Cafeteria", icon: "bi-cup-straw", desc: "Hygienic food court with healthy options" },
  { name: "Wi-Fi Campus", icon: "bi-wifi", desc: "High-speed internet across campus" }
];

// Key Highlights
const HIGHLIGHTS = [
  { stat: "15,000+", label: "Students Trained", icon: "bi-people", bg: "bg-primary" },
  { stat: "98%", label: "Placement Rate", icon: "bi-graph-up", bg: "bg-success" },
  { stat: "50+", label: "Expert Faculty", icon: "bi-person-badge", bg: "bg-info" },
  { stat: "200+", label: "Partner Companies", icon: "bi-building", bg: "bg-warning" },
  { stat: "25+", label: "Courses", icon: "bi-book", bg: "bg-danger" },
  { stat: "18", label: "Years of Excellence", icon: "bi-calendar-check", bg: "bg-dark" }
];

// Achievement Badges
const ACHIEVEMENTS = [
  { title: "Best Computer Institute", year: "2023", issuer: "Education Excellence Awards", icon: "bi-trophy-fill", color: "gold" },
  { title: "Top Skill Provider", year: "2022", issuer: "NSDC India", icon: "bi-award-fill", color: "silver" },
  { title: "ISO Certified", year: "2020", issuer: "ISO 9001:2015", icon: "bi-patch-check-fill", color: "blue" },
  { title: "Google Partner", year: "2021", issuer: "Google for Education", icon: "bi-google", color: "red" }
];

const About = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [activeTab, setActiveTab] = useState("vision");

  return (
    <div className="bg-light overflow-hidden">
      
      {/* 1. HERO SECTION - Drishtee Branding */}
      <section className="py-5 text-white shadow-lg position-relative" 
               style={{ background: "linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)" }}>
        <div className="container py-lg-5 position-relative z-1">
          <div className="row align-items-center g-5">
            <div className="col-lg-7 text-center text-lg-start">
              <div className="d-flex align-items-center gap-3 mb-4 justify-content-center justify-content-lg-start">
                <div className="bg-white rounded-circle p-2 shadow-lg" style={{ width: "70px", height: "70px" }}>
                  <img src="/images/icon/logo.png" alt="Drishtee Logo" className="w-100 h-100 object-fit-contain" />
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">Drishtee Computer Center</h4>
                  <p className="mb-0 opacity-75 small">Empowering Digital India Since 2007</p>
                </div>
              </div>
              <h1 className="display-3 fw-bolder mb-4 lh-sm">
                Your Vision, Our <span className="text-warning">Mission</span>
              </h1>
              <p className="lead opacity-90 mb-5 fs-4">
                Transforming dreams into reality through quality computer education. 
                Join India's most trusted computer training institute.
              </p>
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
                <Link to="/new-admission" className="btn btn-warning btn-lg px-5 py-3 rounded-pill fw-bold shadow transition-transform hover-scale">
                  Apply Now <i className="bi bi-arrow-right ms-2"></i>
                </Link>
                <Link to="/" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-bold border-2">
                  <i className="bi bi-download me-2"></i>Download Brochure
                </Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="position-relative">
                <div className="bg-white rounded-4 p-2 shadow-lg">
                  <img src="/images/vender/homepic.webp" alt="Drishtee Campus" className="img-fluid rounded-3" />
                </div>
                {/* Floating Badge */}
                <div className="position-absolute top-0 start-100 translate-middle bg-warning rounded-circle p-3 shadow-lg">
                  <i className="bi bi-play-circle-fill fs-1 text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="position-absolute bottom-0 start-0 p-4 opacity-25">
          <i className="bi bi-laptop fs-1"></i>
        </div>
        <div className="position-absolute top-50 end-0 p-5 opacity-10">
          <i className="bi bi-code-square fs-1"></i>
        </div>
      </section>

      {/* 2. KEY STATISTICS BANNER */}
      <section className="container mt-n4 position-relative z-3">
        <div className="row g-3">
          {HIGHLIGHTS.map((item, idx) => (
            <div key={idx} className="col-6 col-md-4 col-lg-2">
              <div className="card border-0 shadow-lg rounded-4 text-center p-3 bg-white transition-all hover-up">
                <div className={`${item.bg} bg-opacity-10 rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center`} 
                     style={{ width: "50px", height: "50px" }}>
                  <i className={`bi ${item.icon} fs-3 ${item.bg.replace('bg-', 'text-')}`}></i>
                </div>
                <h3 className="fw-bold mb-0 fs-4">{item.stat}</h3>
                <small className="text-muted">{item.label}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WELCOME & INTRODUCTION */}
      <section className="container py-5 mt-4">
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-10 text-primary px-4 py-2 rounded-pill mb-3">
            <i className="bi bi-chat-heart me-2"></i>Welcome to Drishtee
          </span>
          <h2 className="display-5 fw-bold">India's Leading <span className="text-primary">Computer Institute</span></h2>
          <div className="mx-auto" style={{ width: "80px", height: "4px", background: "linear-gradient(90deg, #1a2980, #26d0ce)" }}></div>
          <p className="lead text-muted mt-4 mx-auto" style={{ maxWidth: "800px" }}>
            Drishtee Computer Center has been at the forefront of digital education, 
            bridging the gap between academic knowledge and industry requirements.
          </p>
        </div>
        
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <div className="position-relative">
              <img src="/images/vender/std1.jpg" alt="Drishtee Campus" className="img-fluid rounded-4 shadow-lg" />
              <div className="position-absolute bottom-0 end-0 bg-white rounded-3 p-3 shadow-lg m-3" style={{ maxWidth: "200px" }}>
                <i className="bi bi-quote fs-1 text-primary opacity-50"></i>
                <p className="small fst-italic mb-0">"Best decision of my career to join Drishtee"</p>
                <small className="text-muted">- Hridesh Bharati</small>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card border-0 shadow-lg p-4 p-lg-5 rounded-4">
              <h3 className="fw-bold mb-4">Why Choose Drishtee?</h3>
              <div className="vstack gap-3">
                <div className="d-flex gap-3 align-items-start p-2 rounded-3 hover-bg-light">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-check-lg text-primary fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Industry Recognized Curriculum</h6>
                    <p className="small text-muted mb-0">Courses designed with input from 200+ industry partners</p>
                  </div>
                </div>
                <div className="d-flex gap-3 align-items-start p-2 rounded-3 hover-bg-light">
                  <div className="bg-success bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-check-lg text-success fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Live Project Training</h6>
                    <p className="small text-muted mb-0">Work on real-world projects during your course</p>
                  </div>
                </div>
                <div className="d-flex gap-3 align-items-start p-2 rounded-3 hover-bg-light">
                  <div className="bg-info bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-check-lg text-info fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Placement Guarantee*</h6>
                    <p className="small text-muted mb-0">98% placement record with top MNCs and startups</p>
                  </div>
                </div>
                <div className="d-flex gap-3 align-items-start p-2 rounded-3 hover-bg-light">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-check-lg text-warning fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Flexible Learning Options</h6>
                    <p className="small text-muted mb-0">Classroom, Online, and Weekend batches available</p>
                  </div>
                </div>
              </div>
              <hr className="my-4" />
              <div className="row g-3">
                <div className="col-6">
                  <div className="text-center">
                    <i className="bi bi-people-fill text-primary fs-2"></i>
                    <h4 className="fw-bold mb-0">15K+</h4>
                    <small className="text-muted">Happy Students</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center">
                    <i className="bi bi-building text-success fs-2"></i>
                    <h4 className="fw-bold mb-0">200+</h4>
                    <small className="text-muted">Recruiters</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VISION & MISSION TABS */}
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="d-flex border-bottom">
                <button 
                  className={`flex-fill py-3 fw-bold border-0 ${activeTab === "vision" ? "bg-primary text-white" : "bg-white text-dark"}`}
                  onClick={() => setActiveTab("vision")}
                >
                  <i className="bi bi-eye-fill me-2"></i>Our Vision
                </button>
                <button 
                  className={`flex-fill py-3 fw-bold border-0 ${activeTab === "mission" ? "bg-primary text-white" : "bg-white text-dark"}`}
                  onClick={() => setActiveTab("mission")}
                >
                  <i className="bi bi-bullseye me-2"></i>Our Mission
                </button>
                <button 
                  className={`flex-fill py-3 fw-bold border-0 ${activeTab === "philosophy" ? "bg-primary text-white" : "bg-white text-dark"}`}
                  onClick={() => setActiveTab("philosophy")}
                >
                  <i className="bi bi-heart-fill me-2"></i>Our Philosophy
                </button>
              </div>
              <div className="p-4 p-lg-5 bg-gradient" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
                {activeTab === "vision" && (
                  <div className="text-center">
                    <i className="bi bi-eye-fill display-1 text-primary opacity-50 mb-3 d-block"></i>
                    <h3 className="fw-bold mb-4">To create a digitally empowered India</h3>
                    <p className="lead mb-0">
                      We envision a future where every individual has access to quality computer education, 
                      enabling them to contribute meaningfully to the digital economy and society at large.
                    </p>
                  </div>
                )}
                {activeTab === "mission" && (
                  <div className="text-center">
                    <i className="bi bi-bullseye display-1 text-success opacity-50 mb-3 d-block"></i>
                    <h3 className="fw-bold mb-4">Empower, Educate, Elevate</h3>
                    <p className="lead mb-0">
                      To provide industry-relevant computer education through innovative teaching methods, 
                      expert faculty, and state-of-the-art infrastructure, ensuring 100% career success for our students.
                    </p>
                  </div>
                )}
                {activeTab === "philosophy" && (
                  <div className="text-center">
                    <i className="bi bi-heart-fill display-1 text-danger opacity-50 mb-3 d-block"></i>
                    <h3 className="fw-bold mb-4">Student First, Always</h3>
                    <p className="lead mb-0">
                      Every decision we make is driven by what's best for our students. We believe in holistic 
                      development - technical skills, soft skills, and ethical values.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CORE VALUES */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold">Our <span className="text-primary">Core Values</span></h2>
          <p className="text-muted">The principles that guide everything we do</p>
        </div>
        <div className="row g-4">
          {CORE_VALUES.map((value, idx) => (
            <div key={idx} className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-4 transition-all hover-up">
                <div className={`bg-${value.color} bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center`}
                     style={{ width: "70px", height: "70px" }}>
                  <i className={`bi ${value.icon} fs-1 text-${value.color}`}></i>
                </div>
                <h5 className="fw-bold mb-2">{value.title}</h5>
                <p className="small text-muted mb-0">{value.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. JOURNEY TIMELINE */}
      <section className="py-5" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <div className="container">
          <div className="text-center text-white mb-5">
            <h2 className="display-5 fw-bold">Our Glorious <span className="text-warning">Journey</span></h2>
            <p className="opacity-90">18 years of excellence in computer education</p>
          </div>
          <div className="position-relative">
            {/* Timeline Line */}
            <div className="position-absolute start-50 translate-middle-x h-100 bg-white bg-opacity-25" style={{ width: "3px" }}></div>
            <div className="vstack gap-5">
              {TIMELINE_DATA.map((item, idx) => (
                <div key={idx} className={`row align-items-center ${idx % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                  <div className="col-md-5">
                    <div className={`card border-0 shadow-lg rounded-4 p-4 ${idx % 2 === 0 ? 'me-md-3' : 'ms-md-3'}`}>
                      <div className={`badge bg-${item.color} bg-opacity-10 text-${item.color} rounded-pill mb-2 align-self-start`}>
                        <i className={`bi ${item.icon} me-1`}></i> {item.year}
                      </div>
                      <h4 className="fw-bold mb-2">{item.title}</h4>
                      <p className="text-muted mb-0">{item.desc}</p>
                    </div>
                  </div>
                  <div className="col-md-2 text-center">
                    <div className={`bg-${item.color} rounded-circle p-3 mx-auto shadow-lg position-relative z-2`} style={{ width: "50px", height: "50px" }}>
                      <i className={`bi ${item.icon} text-white`}></i>
                    </div>
                  </div>
                  <div className="col-md-5"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. FACILITIES & INFRASTRUCTURE */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold">State-of-the-Art <span className="text-primary">Facilities</span></h2>
          <p className="text-muted">World-class infrastructure for world-class learning</p>
        </div>
        <div className="row g-4">
          {FACILITIES.map((facility, idx) => (
            <div key={idx} className="col-md-6 col-lg-4">
              <div className="d-flex gap-3 p-3 rounded-4 bg-white shadow-sm transition-all hover-up">
                <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                     style={{ width: "55px", height: "55px" }}>
                  <i className={`bi ${facility.icon} fs-3 text-primary`}></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">{facility.name}</h6>
                  <p className="small text-muted mb-0">{facility.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. ACHIEVEMENTS & RECOGNITIONS */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Awards & <span className="text-primary">Recognitions</span></h2>
            <p className="text-muted">Our excellence speaks through these accolades</p>
          </div>
          <div className="row g-4">
            {ACHIEVEMENTS.map((achievement, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm rounded-4 text-center p-4 transition-all hover-up">
                  <div className="mb-3">
                    {achievement.color === "gold" && <i className="bi bi-trophy-fill fs-1 text-warning"></i>}
                    {achievement.color === "silver" && <i className="bi bi-award-fill fs-1 text-secondary"></i>}
                    {achievement.color === "blue" && <i className="bi bi-patch-check-fill fs-1 text-primary"></i>}
                    {achievement.color === "red" && <i className="bi bi-google fs-1 text-danger"></i>}
                  </div>
                  <h6 className="fw-bold mb-1">{achievement.title}</h6>
                  <p className="small text-muted mb-0">{achievement.year}</p>
                  <small className="text-primary">{achievement.issuer}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. LEADERSHIP MESSAGE */}
      <section className="container py-5">
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="row g-0">
            <div className="col-md-4" style={{ background: "linear-gradient(135deg, #1a2980, #26d0ce)" }}>
              <div className="p-4 p-lg-5 text-white text-center h-100 d-flex flex-column justify-content-center">
                <div className="rounded-circle bg-white p-2 mx-auto mb-3" style={{ width: "120px", height: "120px" }}>
                  <img src="/images/team/team1.avif" alt="Director" className="w-100 h-100 rounded-circle object-fit-cover" />
                </div>
                <h4 className="fw-bold mb-1">Mr. Ajay Tiwari</h4>
                <p className="opacity-75 mb-3">Founder & Director</p>
                <div className="d-flex justify-content-center gap-2">
                  <i className="bi bi-linkedin"></i>
                  <i className="bi bi-twitter-x"></i>
                  <i className="bi bi-facebook"></i>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="p-4 p-lg-5">
                <i className="bi bi-quote fs-1 text-primary opacity-25"></i>
                <p className="fs-4 fst-italic mb-4">
                  "When we started Drishtee Computer Center in 2007, our goal was simple - 
                  make quality computer education accessible to every aspiring student in India. 
                  Today, with over 15,000 successful student working at top companies worldwide, 
                  I'm proud to say we've kept that promise."
                </p>
                <p className="mb-0">
                  <strong>Vision for 2025:</strong> To establish 50+ centers across India and 
                  train 1,00,000+ students in emerging technologies like AI, ML, and Cybersecurity.
                </p>
                <hr className="my-4" />
                <div className="row g-3 text-center">
                  <div className="col-4">
                    <div className="border-end">
                      <h5 className="fw-bold text-primary mb-0">18+</h5>
                      <small className="text-muted">Years Experience</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="border-end">
                      <h5 className="fw-bold text-primary mb-0">15K+</h5>
                      <small className="text-muted">student Network</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div>
                      <h5 className="fw-bold text-primary mb-0">50+</h5>
                      <small className="text-muted">Expert Faculty</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CTA BANNER */}
      <section className="py-5">
        <div className="container">
          <div className="rounded-5 p-4 p-lg-5 text-center text-white position-relative overflow-hidden"
               style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            <div className="position-absolute top-0 end-0 p-4 opacity-25">
              <i className="bi bi-code-slash fs-1"></i>
            </div>
            <div className="position-absolute bottom-0 start-0 p-4 opacity-25">
              <i className="bi bi-laptop fs-1"></i>
            </div>
            <div className="position-relative z-1">
              <h2 className="display-5 fw-bold mb-3">Ready to Start Your Journey?</h2>
              <p className="lead mb-4">Join Drishtee Computer Center and transform your career</p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link to="/new-admission" className="btn btn-warning btn-lg px-5 rounded-pill fw-bold">
                  Apply for Admission <i className="bi bi-arrow-right ms-2"></i>
                </Link>
                <Link to="/contact-us" className="btn btn-outline-light btn-lg px-5 rounded-pill fw-bold">
                  <i className="bi bi-telephone me-2"></i>Contact Counselor
                </Link>
              </div>
              <p className="mt-4 mb-0 small opacity-75">
                <i className="bi bi-shield-check me-1"></i> Limited seats available for 2026-27 batch
              </p>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="text-center p-5"><div className="spinner-border text-primary"></div></div>}>
        <Team />
        <Footer />
        <ScrollUp />
      </Suspense>

      <style>{`
        .fw-black { font-weight: 900; }
        .mt-n4 { margin-top: -2rem; }
        .hover-up:hover { transform: translateY(-8px); transition: 0.3s; }
        .hover-scale:hover { transform: scale(1.05); transition: 0.3s; }
        .hover-bg-light:hover { background: rgba(0,0,0,0.03); }
        .object-fit-cover { object-fit: cover; }
        .z-1 { z-index: 1; }
        .z-2 { z-index: 2; }
        .z-3 { z-index: 3; }
        .backdrop-blur { backdrop-filter: blur(10px); }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default memo(About);