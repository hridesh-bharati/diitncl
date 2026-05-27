import React, { memo } from "react";
import { Link } from "react-router-dom";

// Data ko component se bahar rakha hai taaki har render par ye recreate na ho (Memory optimization)
const FOOTER_DATA = {
  brand: {
    name: "DRISHTEE COMPUTER CENTRE",
    cert: "ISO 9001:2015 Certified",
    regNo: "Regd. No: IN-UP874921029384V",
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
  address: "Main Road, Near Head Post Office, Gorakhpur, UP - 273001",
};

// Current year ko global scope me calculate kiya taaki re-renders me load na pade
const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="text-white pt-5" style={{ backgroundColor: "#0f172a" }}>
      <div className="pb-5 pb-lg-0 mb-lg-0">
        <div className="container">
          <div className="row g-4 pb-5">

            {/* Brand Profile & Authorisation */}
            <section className="col-lg-4 col-md-12" aria-labelledby="footer-brand-name">
              <div className="mb-4">
                {/* Heading hierarchy sudhari (h2 for screen readers/SEO) */}
                <h2 id="footer-brand-name" className="h4 fw-bold mb-1 tracking-tight">
                  {FOOTER_DATA.brand.name}
                </h2>
                <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
                  <span className="badge bg-warning text-dark">{FOOTER_DATA.brand.cert}</span>
                  <small className="text-white-50 border-start ps-2 border-secondary" style={{ fontSize: '12px' }}>
                    {FOOTER_DATA.brand.regNo}
                  </small>
                </div>
                <p className="text-white-50 small pe-lg-5 mb-3" style={{ lineHeight: "1.7" }}>
                  {FOOTER_DATA.brand.tagline} {FOOTER_DATA.brand.ministry}.
                </p>
                {/* Semantic <address> tag for local SEO */}
                <address className="text-white-50 small d-flex align-items-start mt-2 fst-normal">
                  <i className="bi bi-geo-alt-fill text-warning me-2 mt-1" aria-hidden="true"></i>
                  <span>{FOOTER_DATA.address}</span>
                </address>
              </div>
            </section>

            {/* Quick Navigation */}
            <nav className="col-lg-2 col-md-4 col-6" aria-label="Quick Links">
              <h3 className="h6 text-uppercase fw-bold mb-4 text-warning tracking-widest">Explore</h3>
              <ul className="list-unstyled">
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

            {/* Legal & Authorised Links */}
            <nav className="col-lg-2 col-md-4 col-6" aria-label="Legal Links">
              <h3 className="h6 text-uppercase fw-bold mb-4 text-warning tracking-widest">Legal & FAQ</h3>
              <ul className="list-unstyled">
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

            {/* Support Section & Socials */}
            <section className="col-lg-4 col-md-4 col-12" aria-label="Contact and Socials">
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
            Build v 1.0.0 • Stable Release
          </small>
        </div>

      </div>
    </footer>
  );
};

export default memo(Footer);