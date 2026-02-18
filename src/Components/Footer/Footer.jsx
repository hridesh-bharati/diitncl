import React from "react";
import { Link } from "react-router-dom";

const addressData = {
  address1: "Paragpur Road Near Sunshine School Nichlaul, Maharajganj.",
  phoneNumbers: [
    { name: "Mr. Ajay Tiwari", number: "9918151032", role: "Owner of DIIT" },
    { name: "Hridesh Bharati", number: "7267995307", role: "Management/Support" },
    { name: "Santosh Singh", number: "7398889347", role: "Academic" },
    { name: "Manjesh Vishwakarma", number: "9621444858", role: "Tech" },
  ],
};

export default function Footer() {
  return (
    <footer className="diit-modern-footer mt-3">
      {/* Wave Shape Divider */}
      <div className="footer-wave">
        <svg viewBox="0 0 1440 320"><path fill="#015f9eff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>
      </div>

      <div className="container">
        <div className="row g-4 mb-5">

          {/* 1. BRAND ARC */}
          <div className="col-lg-4">
            <div className="brand-card-glass">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="brand-logo-glow">
                  <img src="images/icon/ccc.jpg" alt="DIIT" />
                </div>
                <h3 className="brand-name-gradient">DIIT Institute</h3>
              </div>
              <p className="brand-text-modern">
                Crafting digital careers since 2007. We don't just teach code, we build professionals for the global tech ecosystem.
              </p>
              <div className="certification-tag">
                <i className="bi bi-patch-check-fill text-primary"></i>
                <span>ISO 9001:2015 Certified Center</span>
              </div>
            </div>
          </div>

          {/* 2. SMART NAV & SOCIAL */}
          <div className="col-lg-4">
            <div className="nav-card-glass">
              <h5 className="footer-subheading">Platform</h5>
              <div className="footer-nav-grid">
                <Link to="/About">Our Story</Link>
                <Link to="/OurCourses">Courses</Link>
                <Link to="/Branch">Centers</Link>
                <Link to="/">Careers</Link>
                <Link to="/Download-Certificate">Verify ID</Link>
                <Link to="/Contact-us">Support</Link>
              </div>

              <div className="social-connect-box mt-4">
                <span className="small fw-bold text-muted mb-3 d-block">COMMUNITY</span>
                <div className="social-icon-row">
                  <a href="#" className="s-icon yt"><i className="bi bi-youtube"></i></a>
                  <a href="#" className="s-icon wa"><i className="bi bi-whatsapp"></i></a>
                  <a href="#" className="s-icon fb"><i className="bi bi-facebook"></i></a>
                  <a href="#" className="s-icon ig"><i className="bi bi-instagram"></i></a>
                </div>
              </div>
            </div>
          </div>

          {/* 3. SUPPORT HUB */}
          <div className="col-lg-4">
            <div className="support-card-glass">
              <h5 className="footer-subheading">24/7 Helpline</h5>
              <div className="contact-pill-stack">
                {addressData.phoneNumbers.slice(0, 2).map((contact, idx) => (
                  <a href={`tel:${contact.number}`} key={idx} className="contact-pill-item">
                    <div className="p-icon"><i className="bi bi-headset"></i></div>
                    <div className="p-info">
                      <span className="p-role">{contact.role}</span>
                      <span className="p-num">+91 {contact.number}</span>
                    </div>
                  </a>
                ))}
              </div>
              <div className="address-glass mt-3">
                <i className="bi bi-geo-alt-fill me-2"></i>
                {addressData.address1}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="footer-bottom-glass mx-0 px-0">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="copy-text">© 2026 <b>Drishtee Computer Center</b>. Built with ❤️ for Students.</p>
            </div>
            <div className="col-md-6 text-md-end">
            <div className="creator-badge">
  <span className="me-2">Design and Developed by : </span>
  <span className="creator-name">
    <a 
      href="https://github.com/hridesh-bharati"
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      Hridesh Bharati
    </a>
  </span>
</div>
              {/* ================= BOTTOM SVG ================= */}

            </div>
          </div>
        </div>




      </div>

      <style>{`
        .diit-modern-footer {
          background: #fdfdff;
          position: relative;
          padding-bottom: 30px;
          font-family: 'Outfit', sans-serif;
          overflow: hidden;
        }

        /* Glass Cards */
        .brand-card-glass, .nav-card-glass, .support-card-glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 30px;
          padding: 30px;
          height: 100%;
          box-shadow: 0 15px 35px rgba(0,0,0,0.03);
          transition: 0.4s ease;
        }
        .brand-card-glass:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(37, 99, 235, 0.08); }

        .brand-logo-glow {
          width: 50px;
          height: 50px;
          border-radius: 14px;
        }
        .brand-logo-glow img { width: 100%; height: 100%; border-radius: 11px; object-fit: cover; }

        .brand-name-gradient {
          font-weight: 900;
          background: linear-gradient(to right, #1e293b, #2563eb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-text-modern { font-size: 14px; color: #64748b; line-height: 1.6; }

        .footer-subheading {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #2563eb;
          font-weight: 800;
          margin-bottom: 25px;
        }

        .footer-nav-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .footer-nav-grid a {
          text-decoration: none;
          color: #475569;
          font-size: 14px;
          font-weight: 500;
          transition: 0.3s;
        }
        .footer-nav-grid a:hover { color: #2563eb; transform: translateX(5px); }

        /* Support Pills */
        .contact-pill-stack { display: flex; flex-direction: column; gap: 12px; }
        .contact-pill-item {
          display: flex;
          align-items: center;
          gap: 15px;
          background: #ffffff;
          padding: 10px 18px;
          border-radius: 18px;
          text-decoration: none;
          border: 1px solid #f1f5f9;
          transition: 0.3s;
        }
        .contact-pill-item:hover { background: #f8fafc; border-color: #2563eb; }
        .p-icon { font-size: 20px; color: #7c3aed; }
        .p-role { display: block; font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase; }
        .p-num { font-size: 14px; color: #0f172a; font-weight: 700; }

        .social-icon-row { display: flex; gap: 12px; }
        .s-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 18px;
          text-decoration: none;
          transition: 0.3s;
        }
        .yt { background: #ff0000; box-shadow: 0 5px 15px rgba(255,0,0,0.2); }
        .wa { background: #22c55e; box-shadow: 0 5px 15px rgba(34,197,94,0.2); }
        .fb { background: #3b82f6; box-shadow: 0 5px 15px rgba(59,130,246,0.2); }
        .ig { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); box-shadow: 0 5px 15px rgba(220,39,67,0.2); }
        .s-icon:hover { transform: scale(1.1) rotate(5deg); }

        .address-glass { font-size: 12px; color: #64748b; background: #f8fafc; padding: 12px; border-radius: 15px; }

        .footer-bottom-glass {
          margin-top: 50px;
          padding-top: 25px;
          border-top: 1px solid #f1f5f9;
        }
        .copy-text { font-size: 13px; color: #94a3b8; }
        .creator-badge {
          display: inline-flex;
          background: #f8fafc;
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 12px;
          color: #64748b;
          border: 1px solid #f1f5f9;
        }
        .creator-name { font-weight: 800; color: #2563eb; margin-left: 5px; }

        .certification-tag {
          margin-top: 20px;
          font-size: 11px;
          font-weight: 700;
          color: #2563eb;
          background: #eff6ff;
          padding: 6px 15px;
          border-radius: 50px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        @media (max-width: 992px) {
          .brand-card-glass, .nav-card-glass, .support-card-glass { text-align: center; }
          .footer-nav-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; }
          .social-icon-row { justify-content: center; }
          .contact-pill-item { text-align: left; }
        }
      `}</style>

      <div className="mb-3 pb-3 mb-lg-0 pb-lg-0">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="#015f9eff"
            d="M0,96L48,122.7C96,149,192,203,288,218.7C384,235,480,213,576,192C672,171,768,149,864,138.7C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L0,320Z"
          />
        </svg>
      </div>
    </footer>
  );
}
