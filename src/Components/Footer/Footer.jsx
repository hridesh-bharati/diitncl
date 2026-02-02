import React from "react";
import { Link } from "react-router-dom";
import callIcon from "/images/icon/call.gif";

const addressData = {
  address1: "Paragpur Road Near Sunshine School Nichlaul, Maharajganj.",
  address2: "Main Market Road, Behind Pakli Mandi Thoothibari, Maharajganj.",
  phoneNumbers: [
    { name: "Mr. Ajay Tiwari", number: "9918151032" },
    { name: "Santosh Singh Chauhan", number: "7398889347" },
    { name: "Manjesh Vishwakarma", number: "9621444858" },
    { name: "Hridesh Bharati", number: "7267995307" },
  ],
};

const quickLinks = [
  { text: "Home", link: "/" },
  { text: "Branch", link: "/branch" },
  { text: "NIELIT Course", link: "/Nielet" },
  { text: "Diploma Courses", link: "/OurCourses" },
];

const otherLinks = [
  { text: "Certification", link: "/Download-Certificate" },
  { text: "New Admission", link: "/AdmissionForm" },
  { text: "Enquiry", link: "/Contact-us" },
  { text: "Terms & Conditions", link: "/Discription" },
];

export default function Footer() {
  return (
    <footer className="footer-dark pt-5">
      <div className="container">
        <div className="row gy-4">

          {/* ADDRESS */}
          <div className="col-md-4">
            <h5 className="footer-title">
              <i className="bi bi-geo-alt-fill me-2"></i>Address
            </h5>

            <p className="footer-text">
              <i className="bi bi-building me-2"></i>
              {addressData.address1}
            </p>
            <p className="footer-text">
              <i className="bi bi-building me-2"></i>
              {addressData.address2}
            </p>

            <div className="mt-3">
              {addressData.phoneNumbers.map((p, i) => (
                <div key={i} className="d-flex align-items-center mb-2 footer-text">
                  <img src={callIcon} width="22" alt="call" />
                  <span className="ms-2">+91 {p.number}</span>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="col-md-4">
            <h5 className="footer-title">
              <i className="bi bi-link-45deg me-2"></i>Quick Links
            </h5>

            <div className="row">
              <div className="col-6">
                {quickLinks.map((l, i) => (
                  <Link key={i} to={l.link} className="footer-link">
                    <i className="bi bi-chevron-right"></i> {l.text}
                  </Link>
                ))}
              </div>
              <div className="col-6">
                {otherLinks.map((l, i) => (
                  <Link key={i} to={l.link} className="footer-link">
                    <i className="bi bi-chevron-right"></i> {l.text}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* CONNECT */}
          <div className="col-md-4">
            <h5 className="footer-title">
              <i className="bi bi-broadcast me-2"></i>Connect With Us
            </h5>

            <p className="footer-text">
              Get updates, announcements and admission details through our
              official channels.
            </p>

            <div className="d-flex gap-3 mt-3">
              <a href="#" className="social-icon yt">
                <i className="bi bi-youtube"></i>
              </a>
              <a href="#" className="social-icon fb">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="social-icon wa">
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        <p className="text-center footer-bottom">
          © 2025 <b>DIIT</b> All Rights Reserved <br />
           || Developed by <span>Hridesh Bharati</span>  ||
        </p>
      </div>

      {/* CSS INLINE (you can move to Footer.css) */}
      <style>{`
        .footer-dark {
          background: linear-gradient(180deg, #000957, #020b14);
          color: #cfd8e3;
        }

        .footer-title {
          color: #ffffff;
          font-weight: 600;
          margin-bottom: 15px;
        }

        .footer-text {
          font-size: 14px;
          line-height: 1.6;
          color: #cfd8e3;
        }

        .footer-link {
          display: block;
          color: #cfd8e3;
          text-decoration: none;
          margin-bottom: 10px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .footer-link:hover {
          color: #0dcaf0;
          transform: translateX(5px);
        }

        .social-icon {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: white;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .social-icon:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.4);
        }

        .yt { background: #ff0000; }
        .fb { background: #1877f2; }
        .wa { background: #25d366; }

        .footer-divider {
          border-color: rgba(255,255,255,0.1);
          margin: 30px 0 15px;
        }

        .footer-bottom {
          font-size: 13px;
          color: #9fb3c8;
        }

        .footer-bottom span {
          color: #0dcaf0;
        }
      `}</style>
    </footer>
  );
}
