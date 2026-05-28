import React, { memo } from "react";
import { Link } from "react-router-dom";

// Data ko component se bahar rakha hai taaki har render par ye recreate na ho (Memory optimization)
const FOOTER_DATA = {
  brand: {
    name: "DRISHTEE COMPUTER CENTRE",
    cert: "ISO 9001:2015 Certified",
    regTitle: "Regd. No: The Indian trust act 1882",
    regNo: "Regd. No: 14/2025",
    darpanID: "Darpan Id: UP/20250878051",
    ministry: "Recognized by Govt. of India",
    tagline: "Empowering youth through Digital Literacy & Vocational Excellence."
  },
  exploreLinks: [
    { name: "Home", path: "/" },
    { name: "About Center", path: "/about" },
    { name: "Our Courses", path: "/courses" },
    { name: "Verify Certificate", path: "/download-certificate" },
    { name: "Student Support", path: "/contact-us" }
  ],
  legalLinks: [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms & Conditions", path: "/terms-conditions" },
    { name: "FAQs", path: "/faqs" },
    { name: "Disclaimer", path: "/disclaimer" },
    { name: "Student Grievance", path: "/contact-us" }
  ],
  helpline: [
    { label: "Admin Office", num: "9918151032", icon: "bi-building" },
    { label: "Technical Support", num: "7267995307", icon: "bi-headset" }
  ],
  address: "Nichlaul near sunshune school, Maharajganj, UP - 273304",
};

// Current year ko global scope me calculate kiya taaki re-renders me load na pade
const CURRENT_YEAR = new Date().getFullYear();

// Build version safe-check taaki compile error na aaye
const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0';

const Footer = () => {
  return (
    <footer className="text-white pt-5" style={{ backgroundColor: "#0f172a" }}>
      <div className="pb-5 pb-lg-0 mb-lg-0">
        <div className="container">
          
          {/* Main Layout Grid */}
          <div className="row g-4 pb-5">

            {/* Column 1: Brand Profile (4 Columns width on desktop) */}
            <section className="col-lg-4 col-md-12" aria-labelledby="footer-brand-name">
              <div className="mb-4">
                <h2 id="footer-brand-name" className="h4 fw-bold mb-2 tracking-tight">
                  {FOOTER_DATA.brand.name}
                </h2>

                <div className="mb-2">
                  <span className="badge bg-warning text-dark fw-semibold">{FOOTER_DATA.brand.cert}</span>
                </div>

                <div className="d-flex flex-column gap-1 mb-3 text-white-50" style={{ fontSize: '13px' }}>
                  <div>
                    <span className="fw-medium text-white-70">{FOOTER_DATA.brand.regNo}</span>
                  </div>
                  <div>
                    <span className="fw-medium text-white-70">{FOOTER_DATA.brand.darpanID}</span>
                  </div>
                  <div className="small opacity-75">
                    ({FOOTER_DATA.brand.regTitle})
                  </div>
                </div>

                <p className="text-white-50 small pe-lg-5 mb-3" style={{ lineHeight: "1.7" }}>
                  {FOOTER_DATA.brand.tagline} {FOOTER_DATA.brand.ministry}.
                </p>

                <address className="text-white-50 small d-flex align-items-start mt-2 fst-normal">
                  <i className="bi bi-geo-alt-fill text-warning me-2 mt-1" aria-hidden="true"></i>
                  <span>{FOOTER_DATA.address}</span>
                </address>
              </div>
            </section>

            {/* Column 2: Center Space (Explore + Legal Links Grid) */}
            {/* Is 4-column block ke andar humne do rows banakar space use kiya hai */}
            <div className="col-lg-4 col-md-12">
              <div className="row g-4">
                
                {/* Row upper part: Explore Links */}
                <nav className="col-6" aria-label="Quick Links">
                  <h3 className="h6 text-uppercase fw-bold mb-4 text-warning tracking-widest">Explore</h3>
                  <ul className="list-unstyled mb-0">
                    {FOOTER_DATA.exploreLinks.map((link) => (
                      <li key={link.path} className="mb-2">
                        <Link
                          to={link.path}
                          className="text-decoration-none text-white-50 hover-text-white transition-all d-flex align-items-center"
                        >
                          <i className="bi bi-arrow-right-short me-1" aria-hidden="true"></i> {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Row upper part: Legal Links */}
                <nav className="col-6" aria-label="Legal Links">
                  <h3 className="h6 text-uppercase fw-bold mb-4 text-warning tracking-widest">Legal & FAQ</h3>
                  <ul className="list-unstyled mb-0">
                    {FOOTER_DATA.legalLinks.map((link) => (
                      <li key={link.path} className="mb-2">
                        <Link
                          to={link.path}
                          className="text-decoration-none text-white-50 hover-text-white transition-all d-flex align-items-center"
                        >
                          <i className="bi bi-shield-check me-2 text-white-20" style={{ fontSize: '12px' }} aria-hidden="true"></i> {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Row Lower Part: NEW ADDED CARD COMPONENT */}
                {/* Jo jagah niche khali padi thi PC me, waha ye card poori width le lega */}
                <section className="col-12 mt-4" aria-label="Important Announcement">
                  <div 
                    className="card border border-secondary border-opacity-40 text-white p-3 rounded-3"
                    style={{ backgroundColor: "#1e293b" }}
                  >
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-bell-fill text-warning fs-6 me-2"></i>
                      <span className="fw-bold text-uppercase tracking-wider text-warning" style={{ fontSize: '12px' }}>
                        Student Notification Portal
                      </span>
                    </div>
                    <p className="text-white-50 mb-2" style={{ fontSize: "12px", lineHeight: "1.5" }}>
                      Naye batches aur internal examinations ke registration start ho chuke hain. Apna assignment online portal par submit karein.
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-20" style={{ fontSize: '10px' }}>
                        Active Notification
                      </span>
                      <Link to="/download-certificate" className="text-warning text-decoration-none small fw-semibold" style={{ fontSize: '12px' }}>
                        Explore Portal <i className="bi bi-chevron-right small"></i>
                      </Link>
                    </div>
                  </div>
                </section>

              </div>
            </div>

            {/* Column 3: Contact Support (4 Columns width on desktop) */}
            <section className="col-lg-4 col-md-12 col-12" aria-label="Contact and Socials">
              <h3 className="h6 text-uppercase fw-bold mb-4 text-warning">Contact Support</h3>
              <div className="row g-3 mb-4">
                {FOOTER_DATA.helpline.map((item) => (
                  <div className="col-12" key={item.num}>
                    <a href={`tel:${item.num}`} className="text-decoration-none group" aria-label={`Call ${item.label} at +91 ${item.num}`}>
                      <div className="p-2 px-3 border border-secondary rounded-3">
                        <div className="d-flex align-items-center">
                          <i className={`bi ${item.icon} text-warning me-3 fs-5`} aria-hidden="true"></i>
                          <div>
                            <span className="d-block small text-white-50 fw-medium" style={{ fontSize: '11px' }}>{item.label}</span>
                            <span className="fw-bold text-white tracking-wide">+91 {item.num}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Bottom Credits */}
          <div className="border-top border-white border-opacity-10 py-4">
            <div className="row align-items-center g-3">
              <div className="col-md-6 text-center text-md-start">
                <p className="mb-0 text-white-50 small">
                  © {CURRENT_YEAR} <span className="text-white fw-semibold">DIIT CENTER</span>. All Rights Reserved.
                </p>
              </div>
              <div className="col-md-6 text-center text-md-end">
                <div className="small text-white-50">
                  Design and Developed by <span className="text-warning fw-bold">HRIDESH BHARATI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Version Badge */}
        <div className="py-2 mb-5 mb-lg-0 text-center">
          <small style={{ fontSize: '11px', letterSpacing: '1px', backgroundColor: "#020617" }} className="text-uppercase opacity-50 px-4 py-2 rounded-4 text-white d-inline-block">
            Build v {APP_VERSION} • Stable Release
          </small>
        </div>

      </div>
    </footer>
  );
};

export default memo(Footer);