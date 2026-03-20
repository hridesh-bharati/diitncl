import React from "react";
import { Link } from "react-router-dom";

const footerData = {
  brand: {
    name: "DIIT Center",
    logo: "images/icon/icon-192.png",
    desc: "Crafting digital careers since 2007. Building professionals for global tech."
  },
  socials: [
    { icon: "youtube", bg: "bg-danger", link: "#" },
    { icon: "whatsapp", bg: "bg-success", link: "#" },
    { icon: "facebook", bg: "bg-primary", link: "#" },
    { icon: "instagram", bg: "bg-danger", link: "#" }
  ],
  sitemap: [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Courses", path: "/courses" },
    { name: "Centers", path: "/branch/thoothibari" },
    { name: "Verify ID", path: "/download-certificate" },
    { name: "FAQ", path: "/faq" },
    { name: "Support", path: "/contact-us" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms & Conditions", path: "/terms" }
  ],
  contacts: [
    { name: "Ajay Tiwari", number: "9918151032", role: "Owner" },
    { name: "Hridesh Bharati", number: "7267995307", role: "Support" }
  ]
};

export default function Footer() {
  return (
    <footer className="bg-white py-2 pb-lg-0 mb-5 mb-lg-0">
      <div className="w-100 overflow-hidden" style={{ height: 80, marginBottom: -1 }}>
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-100 h-100">
          <path fill="#00378a" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3L1440,192L1440,0L0,0Z"></path>
        </svg>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="p-4 rounded-4 shadow-sm bg-white h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <img src={footerData.brand.logo} alt="DIIT" className="rounded-circle shadow-sm" style={{ width: 48, height: 48 }} />
                <h3 className="fw-bold h5 mb-0 text-dark">{footerData.brand.name}</h3>
              </div>
              <p className="text-muted small lh-base">{footerData.brand.desc}</p>
              <div className="d-flex gap-2 mt-3">
                {footerData.socials.map((s, i) => (
                  <a key={i} href={s.link} className={`btn ${s.bg} text-white rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm`} style={{ width: 32, height: 32 }}>
                    <i className={`bi bi-${s.icon} small`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="p-4 rounded-4 shadow-sm bg-light h-100">
              <h6 className="fw-bold text-uppercase small mb-4 text-primary">Sitemap & Quick Links</h6>
              <div className="row g-2">
                {footerData.sitemap.map((link, i) => (
                  <div key={i} className="col-6">
                    <Link to={link.path} className="text-decoration-none text-dark small opacity-75 hover-opacity-100">{link.name}</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="p-4 rounded-4 shadow-sm bg-white h-100">
              <h6 className="fw-bold text-uppercase small mb-4 text-primary">Helpline</h6>
              <div className="vstack gap-2">
                {footerData.contacts.map((c, i) => (
                  <a key={i} href={`tel:${c.number}`} className="d-flex align-items-center p-2 rounded-pill bg-light text-decoration-none shadow-sm px-3">
                    <i className="bi bi-telephone-fill text-primary me-3 small"></i>
                    <div>
                      <small className="d-block text-muted fw-bold" style={{ fontSize: 9 }}>{c.name}</small>
                      <span className="text-dark fw-bold small">+91 {c.number}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center text-center gap-3">
          <p className="small text-muted mb-0">© 2026 <b>DIIT Center</b>. ISO Certified 9001:2015</p>

          <div className="small bg-white shadow-sm px-4 py-2 rounded-pill text-muted">
            Developed by <span className="text-primary fw-bold">Hridesh Bharati</span>
          </div>

        </div>
      </div>
      <div className="w-100 text-center"><span>Version: {__APP_VERSION__}</span></div>
      <div className="w-100 overflow-hidden" style={{ height: 80, marginTop: -1 }}>
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-100 h-100">
          <path fill="#00378a" d="M0,96L48,122.7C96,149,192,203,288,218.7C384,235,480,213,576,192C672,171,768,149,864,138.7C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L0,320Z" />
        </svg>
      </div>
    </footer>
  );
}