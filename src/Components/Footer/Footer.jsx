import React from "react";
import { Link } from "react-router-dom";

const addressData = {
  address1: "Paragpur Road Near Sunshine School Nichlaul, Maharajganj.",
  address2: "Main Market Road, Behind Pakli Mandi Thoothibari, Maharajganj.",
  phoneNumbers: [
    { name: "Mr. Ajay Tiwari", number: "9918151032" },
    { name: "Hridesh Bharati", number: "7267995307" },
    { name: "Santosh Singh Chauhan", number: "7398889347" },
    { name: "Manjesh Vishwakarma", number: "9621444858" },
  ],
};

const quickLinks = [
  { text: "Branch", link: "/branch" },
  { text: "About", link: "/About" },
];

const otherLinks = [
  { text: "Enquiry", link: "/Contact-us" },
  { text: "T.&C.", link: "/Discription" },
];

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="container pt-5 pb-4">
        <div className="row gy-4">

          {/* BRAND SECTION */}
          <div className="col-lg-4 col-md-12">
            <div className="footer-brand mb-4">
              <div className="brand-header">
                  <img src="images/icon/ccc.jpg" className="w-25 img-fluid" alt="DIIT" />
                <div className="brand-text">
                  <p className="brand-subtitle">Drishtee Institute of Information Technology</p>
                </div>
              </div>
              <p className="brand-tagline">
                Empowering students with cutting-edge technical education and practical skills for tomorrow's digital world.
              </p>
            </div>

            <div className="contact-info-box">
              <div className="d-flex align-items-start mb-3">
                <div>
                  <h6 className="contact-title mb-1">Main Campus</h6>
                  <p className="address-text mb-0">{addressData.address1}</p>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK LINKS SECTION */}
          <div className="col-lg-4 col-md-6">
            <div className="links-section">
              <h5 className="section-title">Quick Links</h5>
              <div className="row">
                <div className="col-6">
                  <ul className="nav-links">
                    {quickLinks.map((l, i) => (
                      <li key={i}>
                        <Link to={l.link} className="nav-link">
                          {l.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-6">
                  <ul className="nav-links">
                    {otherLinks.map((l, i) => (
                      <li key={i}>
                        <Link to={l.link} className="nav-link">
                          {l.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="social-section mt-4">
              <h6 className="social-title">Follow Us</h6>
              <div className="social-icons">
                <a href="#" className="social-icon yt" aria-label="YouTube"><i className="bi bi-youtube"></i></a>
                <a href="#" className="social-icon fb" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
                <a href="#" className="social-icon wa" aria-label="WhatsApp"><i className="bi bi-whatsapp"></i></a>
                <a href="#" className="social-icon ig" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
                <a href="#" className="social-icon li" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
              </div>
            </div>
          </div>

          {/* CONTACT SECTION */}
          <div className="col-lg-4 col-md-6">
            <div className="contact-section">
              <h5 className="section-title">Contact Details</h5>
              <div className="contact-details">
                <div className="contact-item mb-4">
                  <h6 className="contact-label">Helpline Numbers</h6>
                  <div className="phone-grid">
                    {addressData.phoneNumbers.slice(0, 2).map((p, i) => (
                      <div key={i} className="phone-card">
                        <a href={`tel:+91${p.number}`} className="phone-number">+91 {p.number}</a>
                        <div className="contact-person">{p.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="contact-item">
                  <h6 className="contact-label">Office Hours</h6>
                  <div className="timing">
                    <div>Monday - Saturday: 7:00 AM - 7:00 PM</div>
                    <div>Sunday: Closed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="copyright-text">
                © 2026 <strong>Drishtee Institute of Information Technology</strong>.
                All Rights Reserved. |
                <Link to="/privacy" className="policy-link ms-2">Privacy Policy</Link> |
                <Link to="/terms" className="policy-link ms-2">Terms of Service</Link>
              </div>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="developer-credit">
                <span className="credit-text">Designed & Developed by</span>
                <span className="developer-name">Hridesh Bharati</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-container {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          color: #495057;
          border-top: 1px solid #dee2e6;
          position: relative;
          overflow: hidden;
        }
        .brand-header { display: flex; align-items: center; margin-bottom: 15px; }
        .logo-icon { font-size: 28px; font-weight: 800; color: white; font-family: 'Segoe UI', sans-serif; }
        .brand-subtitle { font-size: 14px; color: #6c757d; font-weight: 500; margin-bottom: 0; }
        .brand-tagline { font-size: 15px; line-height: 1.6; color: #6c757d; margin-top: 15px; }

        .section-title {
          color: #212529; font-weight: 600; font-size: 18px; margin-bottom: 20px;
          padding-bottom: 10px; position: relative;
        }
        .section-title::after {
          content: ''; position: absolute; left: 0; bottom: 0; width: 40px; height: 3px; background: #0d6efd; border-radius: 2px;
        }

        .nav-links { list-style: none; padding: 0; margin: 0; }
        .nav-links li { margin-bottom: 12px; }
        .nav-link { color: #495057; text-decoration: none; font-size: 14px; transition: all 0.3s ease; padding: 4px 0; }
        .nav-link:hover { color: #0d6efd; text-decoration: none; }

        .contact-info-box, .contact-section { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .contact-title, .contact-label { font-size: 15px; font-weight: 600; color: #212529; margin-bottom: 5px; }
        .address-text { font-size: 14px; color: #6c757d; line-height: 1.5; }

        .phone-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .phone-card { background: #f8f9fa; border-radius: 8px; padding: 12px; border-left: 4px solid #0d6efd; }
        .phone-card:hover { background: #e9ecef; transform: translateY(-2px); }
        .phone-number { color: #0d6efd; text-decoration: none; font-weight: 600; font-size: 15px; display: block; margin-bottom: 4px; }
        .phone-number:hover { color: #0b5ed7; text-decoration: underline; }
        .contact-person { font-size: 13px; color: #6c757d; }

        .timing { font-size: 14px; color: #495057; line-height: 1.6; }
        .timing div { margin-bottom: 6px; }

        .social-section { margin-top: 25px; }
        .social-title { font-size: 15px; font-weight: 600; color: #212529; margin-bottom: 15px; }
        .social-icons { display: flex; gap: 12px; }
        .social-icon { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; color: white; text-decoration: none; }
        .yt { background: #ff0000; } .fb { background: #1877f2; } .wa { background: #25d366; } .ig { background: linear-gradient(45deg, #405DE6, #C13584, #E1306C, #FD1D1D); } .li { background: #0a66c2; }

        .footer-divider { height: 1px; background: linear-gradient(90deg, transparent, #dee2e6, transparent); margin: 40px 0 25px; }
        .footer-bottom { padding-top: 20px; }
        .copyright-text { font-size: 14px; color: #6c757d; }
        .copyright-text strong { color: #212529; font-weight: 600; }
        .policy-link { color: #0d6efd; text-decoration: none; font-size: 14px; }
        .policy-link:hover { color: #0b5ed7; text-decoration: underline; }
        .developer-credit { display: inline-flex; align-items: center; background: white; padding: 8px 16px; border-radius: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .credit-text { font-size: 13px; color: #6c757d; margin-right: 8px; }
        .developer-name { color: #0d6efd; font-weight: 600; font-size: 14px; }

        @media (max-width: 768px) {
          .brand-header { flex-direction: column; text-align: center; }
          .social-icons { justify-content: center; }
          .developer-credit { margin-top: 15px; }
          .copyright-text { text-align: center; margin-bottom: 15px; }
        }
      `}</style>
    </footer>
  );
}
