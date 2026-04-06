import React from "react";
import { Link } from "react-router-dom";

const footerData = {
  brand: {
    name: "DRISHTEE COMPUTER CENTRE",
    logo: "images/icon/icon-192.png",
    cert: "ISO 9001:2015 Certified Institute",
    tagline: "An Initiative for Digital Literacy & Vocational Excellence"
  },
  links: [
    { name: "Home", path: "/" },
    { name: "About Center", path: "/about" },
    { name: "Our Courses", path: "/courses" },
    { name: "Verify Certificate", path: "/download-certificate" },
    { name: "Student Support", path: "/contact-us" },
    { name: "Privacy Policy", path: "/privacy-policy" }
  ],
  helpline: [
    { name: "Administrative Office", num: "9918151032" },
    { name: "Technical Support", num: "7267995307" }
  ]
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-gov border-top border-4 border-orange">

      {/* Top Bar: Official Branding Strip */}
      <div className="gov-top-strip py-2">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2 text-white">
            <i className="bi bi-patch-check-fill text-warning"></i>
            <span className="fw-bold small tracking-wider">OFFICIAL PORTAL OF DIIT CENTER</span>
          </div>
          <div className="social-links d-flex gap-3">
            <a href="https://wa.me/919918151032" className="text-white hover-scale"><i className="bi bi-whatsapp"></i></a>
            <a href="#" className="text-white hover-scale"><i className="bi bi-facebook"></i></a>
            <a href="#" className="text-white hover-scale"><i className="bi bi-youtube"></i></a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-white py-5">
        <div className="container">
          <div className="row g-4">

            {/* Left Column: Branding Section */}
            <div className="col-12 col-lg-5">
              <div className="d-flex gap-3 mb-3 align-items-center">
                <img src={footerData.brand.logo} alt="Logo" className="img-fluid" width={70} />
                <div className="border-start border-2 ps-3 border-primary">
                  <h5 className="fw-bold m-0 text-navy">{footerData.brand.name}</h5>
                  <p className="text-orange small fw-bold mb-0">{footerData.brand.cert}</p>
                </div>
              </div>
              <p className="text-muted small leading-relaxed">
                {footerData.brand.tagline}. Dedicated to empowering youth with technical skills since 2007.
                Recognized for excellence in computer education in Nichlaul.
              </p>
            </div>

            {/* Right Column: Links and Numbers Section */}
            <div className="col-12 col-lg-7">

              {/* 1. Useful Links in 2 Columns */}
              <div className="mb-4">
                <h6 className="gov-heading mb-3">USEFUL LINKS</h6>
                <div className="row row-cols-2 g-2">
                  {footerData.links.map((link, i) => (
                    <div key={i} className="col">
                      <Link to={link.path} className="gov-link-item">
                        <i className="bi bi-chevron-right me-1"></i> {link.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Support Helpline Section (Below Links) */}
              <div className="pt-3 border-top">
                <h6 className="gov-heading-sm mb-3 text-muted">SUPPORT HELPLINE</h6>
                <div className="row g-3">
                  {footerData.helpline.map((c, i) => (
                    <div key={i} className="col-md-6">
                      <div className="contact-card p-2 rounded">
                        <small className="text-uppercase fw-bold text-muted d-block mb-1" style={{ fontSize: '9px' }}>{c.name}</small>
                        <a href={`tel:${c.num}`} className="text-decoration-none text-navy fw-bold d-flex align-items-center">
                          <div className="icon-circle-sm me-2">
                            <i className="bi bi-telephone-fill"></i>
                          </div>
                          +91 {c.num}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="gov-bottom-bar py-3 border-top bg-light">
        <div className="container">
          <div className="row align-items-center text-center text-md-start">
            <div className="col-md-6">
              <p className="mb-0 text-muted small">
                &copy; {currentYear} <strong>DIIT CENTER</strong>. All Rights Reserved.
                <span className="d-block d-md-inline ms-md-2 border-md-start ps-md-2">Managed by <b>DRISHTEE NICHLAUL </b></span>
              </p>
            </div>
            <div className="col-md-6 text-md-end mt-3 mt-md-0">
              <div className="dev-credit d-inline-flex align-items-center px-3 py-1 bg-white border rounded-pill">
                <span className="text-muted extra-small me-2">Designed by:</span>
                <span className="fw-bold text-navy extra-small">HRIDESH BHARATI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version Strip */}
      <div className="bg-navy text-white text-center pt-1 pb-4 pb-lg-0 extra-small opacity-75">
        Website Version: {__APP_VERSION__} • Updated: {new Date().toLocaleDateString('en-GB')}
      </div>

      <style>{`
        :root {
          --navy: #002e5b;
          --orange: #f48120;
          --gov-blue: #0056b3;
        }
        .text-navy { color: var(--navy); }
        .bg-navy { background-color: var(--navy); }
        .text-orange { color: var(--orange); }
        .border-orange { border-color: var(--orange) !important; }
        .gov-top-strip { background: linear-gradient(90deg, #002e5b 0%, #0056b3 100%); }
        
        // .gov-logo-img { width: 55px; height: 55px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); }
        
        .gov-heading {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--navy);
          position: relative;
          padding-bottom: 8px;
        }
        .gov-heading::after {
          content: "";
          position: absolute;
          bottom: 0; left: 0;
          width: 35px; height: 3px;
          background: var(--orange);
        }

        .gov-heading-sm { font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; }

        .gov-link-item {
          color: #555;
          font-size: 13px;
          text-decoration: none;
          display: block;
          transition: 0.2s;
        }
        .gov-link-item:hover { color: var(--gov-blue); padding-left: 4px; }

        .contact-card {
          background: #f8f9fa;
          border-left: 3px solid var(--gov-blue);
          transition: 0.3s;
        }
        .contact-card:hover { background: #eef2f7; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        
        .icon-circle-sm {
          width: 24px; height: 24px;
          background: var(--gov-blue);
          color: white;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px;
        }

        .extra-small { font-size: 10px; }
        .tracking-wider { letter-spacing: 1px; }
        .hover-scale:hover { transform: scale(1.15); transition: 0.2s; }

        @media (max-width: 768px) {
          footer { margin-bottom: 60px !important; }
        }
      `}</style>
    </footer>
  );
}