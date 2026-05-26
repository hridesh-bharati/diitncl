import React, { Suspense, lazy, memo, useEffect } from "react";
import { Link } from "react-router-dom";
import useScrollAnimation from "../../../../hooks/useScrollAnimation"; // पाथ अपने अनुसार एडजस्ट करें

const Team = lazy(() => import("../../Team"));
const Footer = lazy(() => import("../../../../Components/Footer/Footer"));

// Unified Data Objects
const HIGHLIGHTS = [
  { stat: "15K+", label: "Certified Students", icon: "bi-people", bg: "primary" },
  { stat: "98%", label: "Placement Rate", icon: "bi-graph-up", bg: "success" },
  { stat: "50+", label: "Expert Faculty", icon: "bi-person-badge", bg: "info" },
  { stat: "20+", label: "Tech Courses", icon: "bi-book", bg: "danger" },
  { stat: "19+", label: "Years Excellence", icon: "bi-calendar-check", bg: "dark" },
  { stat: "200+", label: "Hiring Partners", icon: "bi-building", bg: "warning" },
];

const VALUES = [
  { title: "Our Vision", text: "To create a digitally empowered nation where every individual has access to industry-grade technical and computer education.", icon: "bi-eye-fill", color: "primary", bg: "linear-gradient(135deg,#eef4ff,#dbeafe)" },
  { title: "Our Mission", text: "To bridge the digital divide by providing affordable, high-quality IT training, software skills, and government-recognized certifications.", icon: "bi-bullseye", color: "success", bg: "linear-gradient(135deg,#ecfff3,#d1fae5)" },
  { title: "Our Philosophy", text: "Student First, Always. We prioritize hands-on practice, logical problem solving, and absolute professional ethics.", icon: "bi-heart-fill", color: "danger", bg: "linear-gradient(135deg,#fff1f2,#ffe4e6)" },
];

const ACCREDITATIONS = [
  { title: "ISO 9001:2015 Certified", desc: "Internationally recognized quality management standards for technical education.", icon: "bi-shield-check" },
  { title: "Govt. Registered", desc: "Registered under the Ministry of Corporate Affairs / relevant government educational bodies.", icon: "bi-file-earmark-text" },
  { title: "Global Curriculum", desc: "Course structures aligned with tech giants like Microsoft, NIELIT, and industry requirements.", icon: "bi-globe" }
];

const FAQS = [
  { q: "क्या कोर्स पूरा होने के बाद सर्टिफिकेट सर्टिफिकेट वैलिड होगा?", a: "हाँ, हमारे सभी कोर्सेज Government Recognized और ISO Certified हैं, जो सरकारी और प्राइवेट दोनों नौकरियों के लिए 100% मान्य हैं।" },
  { q: "क्या यहाँ पर प्रैक्टिकल क्लासेस रोज़ होती हैं?", a: "हाँ, Drishtee में 1:1 कंप्यूटर रेशियो है, यानी हर स्टूडेंट को अभ्यास के लिए अलग कंप्यूटर मिलता है और रोज़ प्रैक्टिकल क्लासेस होती हैं।" },
  { q: "क्या वर्किंग प्रोफेशनल्स के लिए वीकेंड बैच उपलब्ध हैं?", a: "बिल्कुल, हम कॉलेज स्टूडेंट्स और वर्किंग प्रोफेशनल्स के लिए अर्ली मॉर्निंग, लेट इवनिंग और संडे स्पेशल बैचेस प्रदान करते हैं।" }
];

const About = () => {
  // स्क्रॉल एनिमेशन हुक को एक्टिवेट किया
  useScrollAnimation();

  useEffect(() => { 
    window.scrollTo(0, 0); 
    // Dynamic SEO Metadata Injection
    document.title = "About Us | Drishtee Computer Center - Best IT Training Institute";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Learn about Drishtee Computer Center. Empowering 15000+ students since 2007 with certified computer courses, programming, accounting, and 100% placement support.");
  }, []);

  // Reusable Card Component
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
    <main className="bg-primary-subtle overflow-hidden">
      
      {/* 1. HERO SECTION (SEO Friendly H1 & Semantic Structure) */}
      <section className="py-5 text-white shadow-sm position-relative" style={{ background: "linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)" }}>
        <div className="container py-lg-4 position-relative z-1">
          <div className="row align-items-center g-4">
            <div className="col-lg-7 text-center text-lg-start slide-in-left">
              <div className="d-flex align-items-center gap-3 mb-3 justify-content-center justify-content-lg-start">
                <div className="bg-white rounded-circle p-2 shadow" style={{ width: "60px", height: "60px" }}>
                  <img src="/images/icon/logo.png" alt="Drishtee Computer Center Logo" className="w-100 h-100 object-fit-contain" />
                </div>
                <div>
                  <h2 className="mb-0 fw-bold fs-5">Drishtee Computer Center</h2>
                  <p className="mb-0 opacity-75 small">An ISO 9001:2015 Certified Institute (Est. 2007)</p>
                </div>
              </div>
              <h1 className="display-4 fw-bolder mb-3">Your Vision, Our <span className="text-warning">Mission</span> For Digital Excellence</h1>
              <p className="lead opacity-90 mb-4 fs-5">Transforming aspirations into careers with premium, job-oriented computer education and global certifications.</p>
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-2">
                <Link to="/new-admission" className="btn btn-warning px-4 py-2 rounded-pill fw-bold shadow hover-scale">Apply For Admission</Link>
                <Link to="/" className="btn btn-outline-light px-4 py-2 rounded-pill fw-bold">Download Prospectus</Link>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block zoom-in">
              <div className="bg-white rounded-4 p-2 shadow-lg">
                <img src="/images/vender/homepic.webp" alt="Drishtee Computer Center Advanced IT Lab" className="img-fluid rounded-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BANNER */}
      <section className="container mt-n4 position-relative z-3 fade-up">
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

      {/* 3. GOVT RECOGNITION & ACCREDITATION (NEW - Computer Center Essentials) */}
      <section className="container mt-5 fade-up">
        <div className="bg-white p-4 rounded-4 shadow-sm border border-warning border-opacity-25">
          <div className="row g-4 align-items-center text-center text-md-start">
            <div className="col-md-3">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill mb-2 small fw-bold">Trust & Credibility</span>
              <h4 className="fw-bold text-dark">Our Official Recognitions</h4>
            </div>
            <div className="col-md-9">
              <div className="row g-3">
                {ACCREDITATIONS.map((item, i) => (
                  <div key={i} className="col-md-4">
                    <div className="d-flex align-items-center gap-2">
                      <i className={`bi ${item.icon} text-success fs-3`}></i>
                      <div>
                        <h6 className="fw-bold mb-0 small">{item.title}</h6>
                        <p className="mb-0 text-muted" style={{ fontSize: '0.7rem' }}>{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WELCOME & WHY CHOOSE */}
      <section className="container bg-white py-5 mt-5 rounded-4 shadow-sm fade-up">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6 text-center text-lg-start slide-in-left">
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-2 small">Welcome to Drishtee</span>
            <h2 className="fw-bold mb-3">India's Leading Computer Training <span className="text-primary">Institute</span></h2>
            <p className="text-muted small px-2 px-lg-0">Bridging the critical gap between university theory and core tech industry requirements. We specialize in turning absolute beginners into proficient IT professionals.</p>
            <div className="position-relative mt-3 px-2">
              <img src="/images/vender/std1.jpg" alt="Students practicing in Drishtee Lab" className="img-fluid rounded-4 shadow-sm" />
              <div className="position-absolute bottom-0 end-0 bg-white rounded-3 p-2 shadow m-2" style={{ maxWidth: "150px" }}>
                <p className="small fst-italic mb-0" style={{ fontSize: '0.7rem' }}>"Best decision for my computer career"</p>
                <small className="text-muted" style={{ fontSize: '0.6rem' }}>- Hridesh Bharati</small>
              </div>
            </div>
          </div>
          <div className="col-lg-6 slide-in-right">
            <div className="card border-0 bg-light p-3 rounded-4">
              <h5 className="fw-bold mb-3">Why Choose Drishtee for Computer Learning?</h5>
              <div className="vstack gap-1">
                <FeatureItem color="primary" icon="bi-laptop" title="Advanced Infrastructure" desc="1:1 Lab facility with high-speed internet and updated hardware." />
                <FeatureItem color="success" icon="bi-journal-code" title="Industry-Relevant Curriculum" desc="Courses designed on Software, Web Dev, Python, Accounting (Tally Prime) & AI." />
                <FeatureItem color="info" icon="bi-patch-check" title="100% Job & Placement Support" desc="Dedicated placement cell with interview preparation and resume building." />
                <FeatureItem color="warning" icon="bi-clock" title="Flexible Batch Timings" desc="Special early morning, evening, and weekend batches for working professionals." />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VISION & MISSION */}
      <section className="container py-5 fade-up">
        <div className="row g-3">
          {VALUES.map((item, idx) => (
            <div key={idx} className="col-md-4 zoom-in">
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

      {/* 6. DIRECTOR'S MESSAGE */}
      <section className="container pb-5 fade-up">
        <div className="card border-0 shadow rounded-4 overflow-hidden">
          <div className="row g-0">
            <div className="col-md-4 py-4 text-center text-white d-flex flex-column justify-content-center slide-in-left" style={{ background: "linear-gradient(135deg, #1a2980, #26d0ce)" }}>
              <img src="/images/team/team1.avif" alt="Mr. Ajay Tiwari - Founder & Director" className="rounded-circle border border-3 border-white mx-auto mb-2" style={{ width: "100px", height: "100px", objectFit: 'cover' }} />
              <h6 className="fw-bold mb-0">Mr. Ajay Tiwari</h6>
              <small className="opacity-75">Founder & Director</small>
            </div>
            <div className="col-md-8 p-4 slide-in-right">
              <i className="bi bi-quote fs-2 text-primary opacity-25"></i>
              <p className="fst-italic small">"Computer literacy is no longer an optional skill—it is an absolute necessity for global survival. When we founded Drishtee in 2007, our goal was simple: affordable, premium quality, and employment-driven education. More than 15,000 successful alumni later, we stand firm on that commitment to building a digitally advanced India."</p>
              <div className="row g-2 text-center mt-3 pt-3 border-top">
                <div className="col-4 border-end"><h6 className="fw-bold mb-0 text-primary">19+</h6><small className="text-muted" style={{ fontSize: '0.6rem' }}>Years of Legacy</small></div>
                <div className="col-4 border-end"><h6 className="fw-bold mb-0 text-primary">15K+</h6><small className="text-muted" style={{ fontSize: '0.6rem' }}>Alumni Network</small></div>
                <div className="col-4"><h6 className="fw-bold mb-0 text-primary">50+</h6><small className="text-muted" style={{ fontSize: '0.6rem' }}>Industry Mentors</small></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS (NEW - Boosts SEO with Q&A structured keywords) */}
      <section className="container pb-5 fade-up">
        <div className="bg-white p-4 rounded-4 shadow-sm">
          <h3 className="fw-bold text-center mb-4">Frequently Asked Questions <span className="text-primary">(FAQ)</span></h3>
          <div className="row g-3">
            {FAQS.map((faq, index) => (
              <div key={index} className="col-md-6 zoom-in">
                <div className="p-3 bg-light rounded-3 h-100">
                  <h6 className="fw-bold text-dark mb-2"><i className="bi bi-question-circle-fill text-primary me-2"></i>{faq.q}</h6>
                  <p className="text-muted mb-0 small" style={{ lineHeight: '1.4' }}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION */}
      <section className="container mb-5 zoom-in">
        <div className="rounded-5 p-4 text-center text-white shadow-lg" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
          <h3 className="fw-bold mb-2">Ready to Launch Your IT Career?</h3>
          <p className="small mb-4 opacity-90">Join Drishtee Computer Center today. Book a free career counseling demo class session.</p>
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
    </main>
  );
};

export default memo(About);