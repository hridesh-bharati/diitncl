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
    <footer className="border-top border-3 border-warning">

      {/* Top Strip */}
      <div className="bg-primary text-white py-2">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2 small fw-bold">
            <i className="bi bi-patch-check-fill text-warning"></i>
            OFFICIAL PORTAL OF DIIT CENTER
          </div>

          <div className="d-flex gap-3">
            <a href="https://wa.me/919918151032" className="text-white">
              <i className="bi bi-whatsapp"></i>
            </a>
            <a href="#" className="text-white">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="text-white">
              <i className="bi bi-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="bg-white py-5">
        <div className="container">
          <div className="row g-4">

            {/* Left */}
            <div className="col-lg-5">
              <div className="d-flex align-items-center gap-3 mb-3">
                <img src={footerData.brand.logo} width={70} alt="logo" />
                <div className="border-start ps-3">
                  <h5 className="fw-bold mb-0">{footerData.brand.name}</h5>
                  <small className="text-warning fw-bold">
                    {footerData.brand.cert}
                  </small>
                </div>
              </div>

              <p className="text-muted small">
                {footerData.brand.tagline}. Dedicated to empowering youth with
                technical skills since 2007. Recognized for excellence in computer
                education in Nichlaul.
              </p>
            </div>

            {/* Right */}
            <div className="col-lg-7">

              {/* Links */}
              <div className="mb-4">
                <h6 className="fw-bold border-bottom pb-2">USEFUL LINKS</h6>
                <div className="row row-cols-2">
                  {footerData.links.map((link, i) => (
                    <div key={i} className="col mb-2">
                      <Link to={link.path} className="text-decoration-none text-dark small">
                        <i className="bi bi-chevron-right me-1"></i>
                        {link.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Helpline */}
              <div className="border-top pt-3">
                <h6 className="fw-bold small text-muted mb-3">
                  SUPPORT HELPLINE
                </h6>

                <div className="row">
                  {footerData.helpline.map((c, i) => (
                    <div key={i} className="col-md-6 mb-2">
                      <div className="bg-light p-2 rounded border">
                        <small className="text-muted d-block">
                          {c.name}
                        </small>

                        <a
                          href={`tel:${c.num}`}
                          className="text-decoration-none fw-bold text-dark"
                        >
                          <i className="bi bi-telephone-fill me-2"></i>
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

      {/* Bottom */}
      <div className="bg-light border-top py-3">
        <div className="container d-md-flex justify-content-between text-center text-md-start">
          <p className="mb-2 mb-md-0 small text-muted">
            © {currentYear} <strong>DIIT CENTER</strong>. All Rights Reserved.
          </p>

          <div className="small">
            Designed by <strong>HRIDESH BHARATI</strong>
          </div>
        </div>
      </div>

      {/* Version */}
      <div className="bg-dark text-white text-center small py-1">
        Website Version: {__APP_VERSION__} • Updated:{" "}
        {new Date().toLocaleDateString("en-GB")}
      </div>
    </footer>
  );
}