// Terms.jsx
import React from "react";

const terms = [
  { icon: "fa-check-circle", color: "bg-success", text: "Official website for information purposes only." },
  { icon: "fa-gavel", color: "bg-danger", text: "Governed by Indian laws. Contact institute for disputes." },
  { icon: "fa-lock", color: "bg-primary", text: "We respect user privacy and only collect voluntarily submitted info." },
  { icon: "fa-info-circle", color: "bg-secondary", text: "Content accuracy not guaranteed. Verify details with institute." },
  { icon: "fa-user-shield", color: "bg-warning", text: "Users are responsible for actions based on website content." },
  { icon: "fa-refresh", color: "bg-info", text: "Terms and content may be updated without notice." },
];

const TermCard = ({ icon, color, text }) => (
  <div className="col-md-6 mb-4">
    <div className="card h-100 shadow-sm border-0 hoverTermCard about-card">
      <div className="card-body d-flex">
        <div className={`rounded-circle d-flex align-items-center justify-content-center text-white me-3 ${color}`} style={{ width: 40, height: 40 }}>
          <i className={`fa ${icon} px-3`}></i>
        </div>
        <p className="mb-0 text-muted small">{text}</p>
      </div>
    </div>
  </div>
);

export default function Terms() {
  return (
    <div className="container-fluid p-0 mt-5" id="termsPage">
      <div className="text-center bg-white py-4 shadow-sm border-bottom about-card">
        <h1 className="fw-bold text-dark"><span className="text-danger">TERMS</span> OF USE</h1>
      </div>

      <div className="container py-5">
        <div className="row">
          {terms.map((term, i) => <TermCard key={i} {...term} />)}
        </div>
      </div>

      <style>{`
        .hoverTermCard { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hoverTermCard:hover { transform: translateY(-4px); box-shadow: 0 0 12px rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
}