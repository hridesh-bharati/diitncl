import React from "react";
import { Link } from "react-router-dom";

const footerData = {
  brand: {
    name: "DRISHTEE COMPUTER CENTRE",
    cert: "ISO 9001:2015 Certified",
    tagline: "Empowering youth through Digital Literacy & Vocational Excellence."
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
    { label: "Admin Office", num: "9918151032", icon: "bi-building" },
    { label: "Technical Support", num: "7267995307", icon: "bi-headset" }
  ],
  socials: [
    { icon: "bi-whatsapp", url: "https://wa.me/919918151032", color: "#25D366" },
    { icon: "bi-facebook", url: "#", color: "#1877F2" },
    { icon: "bi-youtube", url: "#", color: "#FF0000" },
    { icon: "bi-instagram", url: "#", color: "#E4405F" }
  ]
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white pt-5" style={{ backgroundColor: "#0f172a" }}>
      <div className="pb-5 pb-lg-0 mb-lg-0 pb-l">
        <div className="container">
          <div className="row g-4 pb-5">

            {/* Brand Profile */}
            <div className="col-lg-4 col-md-12">
              <div className="mb-4">
               
                <h4 className="fw-bold mb-1 tracking-tight">{footerData.brand.name}</h4>
                <span className="badge bg-warning text-dark mb-3">{footerData.brand.cert}</span>
                <p className="text-white-50 small pe-lg-5" style={{ lineHeight: "1.7" }}>
                  {footerData.brand.tagline} Join us to bridge the gap between education and employability.
                </p>
              </div>

            </div>

            {/* Quick Navigation */}
            <div className="col-lg-3 col-md-4 col-6">
              <h6 className="text-uppercase fw-bold mb-4 text-warning small tracking-widest">Explore</h6>
              <ul className="list-unstyled">
                {footerData.links.map((link) => (
                  <li key={link.path} className="mb-2">
                    <Link
                      to={link.path}
                      className="text-decoration-none text-white-50 hover-text-white transition-all d-flex align-items-center"
                    >
                      <i className="bi bi-arrow-right-short me-1"></i> {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Section with Glassmorphism */}
            <div className="col-lg-5 col-md-8">
              <h6 className="text-uppercase fw-bold mb-4 text-warning small">Contact Support</h6>
              <div className="row g-3">
                {footerData.helpline.map((item, i) => (
                  <div className="col-sm-6" key={i}>
                    <a href={`tel:${item.num}`} className="text-decoration-none group">
                      <div className="p-3 border border-secondary rounded-3 ">
                        <div className="d-flex align-items-center mb-2">
                          <i className={`bi ${item.icon} text-warning me-2 fs-5`}></i>
                          <span className="small text-white-50 fw-medium">{item.label}</span>
                        </div>
                        <div className="fw-bold text-white tracking-wide">+91 {item.num}</div>
                      </div>
                    </a>
                  </div>
                ))}
                {/* Social Icons */}
                <div className="d-flex gap-2">
                  {footerData.socials.map((soc, idx) => (
                    <a
                      key={idx}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm border rounded-circle border-opacity-10 bg-light">
                      <i
                        className={`bi ${soc.icon}`}
                        style={{
                          color: soc.color,
                          fontSize: '1.2rem'
                        }}
                      ></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Credits */}
          <div className="border-top border-white border-opacity-10 py-4">
            <div className="row align-items-center g-3">
              <div className="col-md-6 text-center text-md-start">
                <p className="mb-0 text-white-50 small">
                  © {currentYear} <span className="text-white fw-semibold">DIIT CENTER</span>.
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
        {/* Modern Version Badge */}
        <div className="py-2 mb-5 mb-lg-0 text-center">
          <span style={{ fontSize: '11px', letterSpacing: '1px',backgroundColor: "#020617" }} className="text-uppercase opacity-50 px-4 py-2 rounded-4 text-white">
            Build v {__APP_VERSION__} • Stable Release
          </span>
        </div>

      </div>
    </footer>
  );
}