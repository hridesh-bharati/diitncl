import React from "react";
import { Link } from "react-router-dom";

const addressData = {
  address1: "Paragpur Road Near Sunshine School Nichlaul, Maharajganj.",
  phoneNumbers: [
    { name: "Ajay Tiwari", number: "9918151032", role: "Owner" },
    { name: "Hridesh Bharati", number: "7267995307", role: "Support" },
  ],
  links: [
    { n: "Our Story", p: "/About" }, { n: "Courses", p: "/courses" },
    { n: "Centers", p: "/branch/thoothibari" }, { n: "Careers", p: "/" },
    { n: "Verify ID", p: "/Download-Certificate" }, { n: "Support", p: "/Contact-us" }
  ],
  socials: [
    { i: "youtube", b: "bg-danger" }, { i: "whatsapp", b: "bg-success" },
    { i: "facebook", b: "bg-primary" }, { i: "instagram", b: "bg-danger" }
  ]
};

export default function Footer() {
  return (
    <footer className="bg-white pt-5 mt-5">
      {/* Top SVG Wave */}
      <div className="w-100 overflow-hidden" style={{ height: "80px", marginBottom: "-1px" }}>
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-100 h-100">
          <path fill="#00378a" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3L1440,192L1440,0L0,0Z"></path>
        </svg>
      </div>

      <div className="container py-5">
        <div className="row g-4">

          {/* 1. BRAND - Meta Style Shadow */}
          <div className="col-lg-4">
            <div className="p-4 rounded-4 shadow-sm border-0 bg-white h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <img src="images/icon/ccc.jpg" alt="DIIT" className="rounded-circle shadow-sm" style={{ width: 48, height: 48 }} />
                <h3 className="fw-bold h5 mb-0 text-dark">DIIT Institute</h3>
              </div>
              <p className="text-muted small lh-base">Crafting digital careers since 2007. We build professionals for the global tech ecosystem.</p>
              <div className="d-flex gap-2 mt-3">
                {addressData.socials.map((s, i) => (
                  <a key={i} href="#" className={`btn ${s.b} text-white rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm`} style={{ width: 32, height: 32 }}>
                    <i className={`bi bi-${s.i} small`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* 2. QUICK LINKS - Grid Layout */}
          <div className="col-lg-4 col-md-6">
            <div className="p-4 rounded-4 shadow-sm border-0 bg-light h-100">
              <h6 className="fw-bold text-uppercase small mb-4 text-primary">Platform</h6>
              <div className="row g-3">
                {addressData.links.map((link, i) => (
                  <div key={i} className="col-6">
                    <Link to={link.p} className="text-decoration-none text-dark small opacity-75 hover-opacity-100">{link.n}</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. CONTACT - Pill Style */}
          <div className="col-lg-4 col-md-6">
            <div className="p-4 rounded-4 shadow-sm border-0 bg-white h-100">
              <h6 className="fw-bold text-uppercase small mb-4 text-primary">Helpline</h6>
              <div className="vstack gap-2">
                {addressData.phoneNumbers.map((contact, idx) => (
                  <a href={`tel:${contact.number}`} key={idx} className="d-flex align-items-center p-2 rounded-pill bg-light text-decoration-none shadow-sm px-3">
                    <i className="bi bi-telephone-fill text-primary me-3 small"></i>
                    <div>
                      <small className="d-block text-muted fw-bold" style={{ fontSize: '9px' }}>{contact.name}</small>
                      <span className="text-dark fw-bold small">+91 {contact.number}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR - No Border, Just Spacing */}
        <div className="mt-5 pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center text-center gap-3">
          <p className="small text-muted mb-0">© 2026 <b>DIIT Center</b>. ISO Certified 9001:2015</p>
          <div className="small bg-white shadow-sm px-4 py-2 rounded-pill text-muted">
            Developed by <span className="text-primary fw-bold">Hridesh Bharati</span>
          </div>
        </div>
      </div>

      {/* Bottom SVG Wave */}
      <div className="w-100 overflow-hidden" style={{ height: "80px", marginTop: "-1px" }}>
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-100 h-100">
          <path fill="#00378a" d="M0,96L48,122.7C96,149,192,203,288,218.7C384,235,480,213,576,192C672,171,768,149,864,138.7C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L0,320Z" />
        </svg>
      </div>
    </footer>
  );
}