import React from "react";
import { Link } from "react-router-dom";

const addressData = {
  address1: "Paragpur Road Near Sunshine School Nichlaul, Maharajganj.",
  phoneNumbers: [
    { name: "Mr. Ajay Tiwari", number: "9918151032", role: "Owner" },
    { name: "Hridesh Bharati", number: "7267995307", role: "Support" },
  ],
};

export default function Footer() {
  return (
    <footer className="diit-modern-footer mt-3">
      {/* Top Wave */}
      <div className="footer-wave">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#015f9eff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>

      <div className="container position-relative mt-4" style={{ zIndex: 2 }}>
        <div className="row g-4 mb-4">

          {/* 1. BRAND ARC */}
          <div className="col-lg-4 col-md-12">
            <div className="brand-card-glass">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="brand-logo-glow">
                  <img src="images/icon/ccc.jpg" alt="DIIT" />
                </div>
                <h3 className="brand-name-gradient h5 mb-0">DIIT Institute</h3>
              </div>
              <p className="brand-text-modern small">
                Crafting digital careers since 2007. We build professionals for the global tech ecosystem.
              </p>
              <div className="certification-tag">
                <i className="bi bi-patch-check-fill text-primary"></i>
                <span>ISO 9001:2015 Certified</span>
              </div>
            </div>
          </div>

          {/* 2. SMART NAV & SOCIAL */}
          <div className="col-lg-4 col-md-6">
            <div className="nav-card-glass">
              <h5 className="footer-subheading">Platform</h5>

              {/* Saare 6 Links yahan hain */}
              <div className="footer-nav-grid mb-4">
                <Link to="/About">Our Story</Link>
                <Link to="/OurCourses">Courses</Link>
                <Link to="/Branch">Centers</Link>
                <Link to="/">Careers</Link>
                <Link to="/Download-Certificate">Verify ID</Link>
                <Link to="/Contact-us">Support</Link>
              </div>

              <div className="social-connect-box">
                <span className="small fw-bold text-muted mb-3 d-block" style={{ fontSize: '10px', letterSpacing: '1px' }}>COMMUNITY</span>
                <div className="social-icon-row">
                  <a href="#" className="s-icon yt"><i className="bi bi-youtube"></i></a>
                  <a href="#" className="s-icon wa"><i className="bi bi-whatsapp"></i></a>
                  <a href="#" className="s-icon fb"><i className="bi bi-facebook"></i></a>
                  <a href="#" className="s-icon ig"><i className="bi bi-instagram"></i></a>
                </div>
              </div>
            </div>
          </div>

          {/* 3. SUPPORT HUB - Clean & Direct */}
          <div className="col-lg-4 col-md-6">
            <div className="support-card-glass">
              <h5 className="footer-subheading">Helpline</h5>
              <div className="contact-pill-stack">
                {addressData.phoneNumbers.map((contact, idx) => (
                  <a href={`tel:${contact.number}`} key={idx} className="contact-pill-item shadow-sm">
                    <div className="p-icon"><i className="bi bi-telephone-fill"></i></div>
                    <div className="p-info">
                      <span className="p-role">{contact.name} ({contact.role})</span>
                      <span className="p-num">+91 {contact.number}</span>
                    </div>
                  </a>
                ))}
              </div>
              <div className="address-glass mt-3 small">
                <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                {addressData.address1}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="footer-bottom-glass py-3">
          <div className="row align-items-center text-center text-md-start">
            <div className="col-md-6">
              <p className="copy-text mb-md-0">© 2026 <b>DIIT Center</b>. Built with ❤️</p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="creator-badge">
                <span>Design & Developed by: </span>
                <a href="https://github.com/hridesh-bharati" className="creator-name text-decoration-none">Hridesh Bharati</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="mt-4">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '80px', width: '100%', display: 'block' }}>
          <path fill="#015f9eff" d="M0,96L48,122.7C96,149,192,203,288,218.7C384,235,480,213,576,192C672,171,768,149,864,138.7C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L0,320Z" />
        </svg>
      </div>

      <style>{`
        .diit-modern-footer { background: #fdfdff; position: relative; font-family: 'Outfit', sans-serif; overflow: hidden; }
        .footer-wave { height: 120px; margin-bottom: -50px; }
        .footer-wave svg { width: 100%; height: 100%; }

        .brand-card-glass, .nav-card-glass, .support-card-glass {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid #eee;
          border-radius: 24px;
          padding: 24px;
          height: 100%;
          transition: 0.3s;
        }
        .brand-card-glass:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }

        .brand-logo-glow img { width: 45px; height: 45px; border-radius: 10px; object-fit: cover; }
        .brand-name-gradient { font-weight: 800; background: linear-gradient(to right, #1e293b, #2563eb); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .brand-text-modern { color: #64748b; line-height: 1.5; }

        .footer-subheading { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #2563eb; font-weight: 800; margin-bottom: 20px; }
        .footer-nav-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .footer-nav-grid a { text-decoration: none; color: #475569; font-size: 13px; font-weight: 500; transition: 0.2s; }
        .footer-nav-grid a:hover { color: #2563eb; padding-left: 4px; }

        .contact-pill-stack { display: flex; flex-direction: column; gap: 10px; }
        .contact-pill-item { display: flex; align-items: center; gap: 12px; background: #fff; padding: 10px 15px; border-radius: 15px; text-decoration: none; border: 1px solid #f0f0f0; transition: 0.2s; }
        .contact-pill-item:hover { border-color: #2563eb; background: #f8fbff; }
        .p-icon { color: #2563eb; font-size: 16px; }
        .p-role { display: block; font-size: 9px; color: #94a3b8; font-weight: 700; text-transform: uppercase; }
        .p-num { font-size: 13px; color: #1e293b; font-weight: 700; }

        .social-icon-row { display: flex; gap: 10px; }
        .s-icon { width: 35px; height: 35px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px; text-decoration: none; transition: 0.3s; }
        .yt { background: #ff0000; } .wa { background: #22c55e; } .fb { background: #3b82f6; } .ig { background: #e4405f; }
        .s-icon:hover { transform: scale(1.1); }

        .address-glass { background: #f8fafc; padding: 10px; border-radius: 12px; color: #64748b; font-size: 11px; }
        .footer-bottom-glass { border-top: 1px solid #eee; margin-top: 30px; }
        .copy-text { font-size: 12px; color: #94a3b8; }
        .creator-badge { background: #f1f5f9; padding: 5px 15px; border-radius: 50px; font-size: 11px; color: #64748b; }
        .creator-name { font-weight: 700; color: #2563eb; }
        .certification-tag { margin-top: 15px; font-size: 10px; font-weight: 700; color: #2563eb; background: #eff6ff; padding: 5px 12px; border-radius: 50px; display: inline-flex; align-items: center; gap: 5px; }

        @media (max-width: 768px) {
          .footer-wave { height: 80px; }
          .brand-card-glass, .nav-card-glass, .support-card-glass { text-align: center; margin-bottom: 10px; }
          .footer-nav-grid, .social-icon-row { justify-content: center; }
          .contact-pill-item { text-align: left; }
        }
      `}</style>
    </footer>
  );
}