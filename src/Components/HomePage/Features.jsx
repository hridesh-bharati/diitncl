import React from "react";
import { Link } from "react-router-dom";

const DATA = [
  { i: "laptop", t: "Live Projects", bg: "bg-primary-subtle", icon: "text-primary", desc: "Real-time work" },
  { i: "person-badge", t: "Expert Trainers", bg: "bg-info-subtle", icon: "text-info", desc: "Industry mentors" },
  { i: "award-fill", t: "Certificates", bg: "bg-danger-subtle", icon: "text-danger", desc: "ISO Verified" },
  { i: "cpu-fill", t: "Latest Tech", bg: "bg-success-subtle", icon: "text-success", desc: "Future-ready" }
];

// Alag-alag icons aur colors list ke liye
const H = [
  { t: "Real-World Experience", d: "Practical knowledge.", icon: "bi-rocket-takeoff", color: "text-primary", bg: "rgba(13, 110, 253, 0.1)" },
  { t: "Expert-Led Training", d: "Industry veterans.", icon: "bi-person-workspace", color: "text-success", bg: "rgba(25, 135, 84, 0.1)" },
  { t: "Global Recognition", d: "ISO Certificates.", icon: "bi-globe-central-south-asia", color: "text-danger", bg: "rgba(220, 53, 69, 0.1)" }
];

export default function LiveCards() {
  return (
    <section className="container-fluid py-4 py-md-5 bg-white shadow-sm rounded-4 my-2 my-md-3 px-2 px-md-5 overflow-hidden">
      <div className="row align-items-center g-3 g-md-5">
        
        {/* Top Grid for Mobile/PC */}
        <div className="col-lg-7 order-1 order-lg-2">
          <div className="row g-2 g-md-3"> 
            {DATA.map((item, i) => (
              <div key={i} className="col-6">
                <div className={`card h-100 border-0 rounded-4 p-2 p-md-4 text-center feature-card ${item.bg}`}>
                  <div className="bg-white d-flex align-items-center justify-content-center mx-auto mb-2 rounded-circle shadow-sm icon-wrapper">
                    <i className={`bi bi-${item.i} ${item.icon} fs-4 fs-md-2`}></i>
                  </div>
                  <h6 className="fw-bolder mb-1 text-dark title-text">{item.t}</h6>
                  <span className="badge bg-white bg-opacity-50 text-dark rounded-pill py-1 px-2 mx-auto desc-badge">
                    {item.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Text Content & List */}
        <div className="col-lg-5 text-start order-2 order-lg-1 mt-4 mt-lg-0 px-2">
          <span className="badge bg-primary-subtle text-primary rounded-pill mb-2 fw-bolder px-3 py-2 border border-primary border-opacity-10" style={{ fontSize: '9px' }}>
            WHY CHOOSE DRISHTEE
          </span>
          <h2 className="fw-bolder mb-3 display-6 lh-sm hero-text" style={{ letterSpacing: '-1px', color: '#002d5b' }}>
            Upgrade Your <span className="text-primary position-relative">Skills <span className="position-absolute bottom-0 start-0 w-100 bg-primary opacity-25" style={{ height: '5px' }}></span></span>
          </h2>

          {/* Icon-based List Section */}
          <div className="mt-3 mt-md-4">
            {H.map((item, i) => (
              <div key={i} className="d-flex mb-3 align-items-center p-2 rounded-4 list-item-box transition-all">
                <div className={`me-3 rounded-4 d-flex align-items-center justify-content-center flex-shrink-0`} 
                     style={{ width: '42px', height: '42px', backgroundColor: item.bg }}>
                   <i className={`bi ${item.icon} ${item.color} fs-5`}></i>
                </div>
                <div>
                  <h6 className="fw-bolder mb-0 small-text text-dark">{item.t}</h6>
                  <p className="text-muted mb-0 extra-small-text">{item.d}</p>
                </div>
              </div>
            ))}
          </div>

          <Link to="/courses" className="text-decoration-none">
            <button className="btn btn-primary rounded-pill px-4 py-3 fw-bold w-100 shadow mt-3 border-0 main-btn shadow-lg">
              GET STARTED NOW <i className="bi bi-arrow-right-short ms-1 fs-5"></i>
            </button>
          </Link>
        </div>

      </div>

      <style>{`
        .feature-card { transition: 0.3s ease-in-out; }
        .list-item-box { border: 1px solid transparent; }
        .list-item-box:hover { background: #f8fafc; border-color: #eef2ff; }
        
        .icon-wrapper { width: 45px; height: 45px; }
        .title-text { font-size: 11px; }
        .desc-badge { font-size: 8px; width: fit-content; }
        .small-text { font-size: 14px; }
        .extra-small-text { font-size: 11px; }
        .main-btn { font-size: 14px; background: linear-gradient(135deg, #002d5b 0%, #00d2ff 100%); }

        @media (min-width: 768px) {
           .icon-wrapper { width: 65px; height: 65px; }
           .title-text { font-size: 15px; }
           .desc-badge { font-size: 10px; }
           .small-text { font-size: 16px; }
           .extra-small-text { font-size: 13px; }
           .main-btn { font-size: 16px; }
           .feature-card:hover { transform: translateY(-8px); box-shadow: 0 15px 35px rgba(0,0,0,0.08); background-color: #fff !important; }
        }
        
        .bg-primary-subtle { background-color: #e7f3ff !important; }
        .bg-info-subtle { background-color: #e0f7fa !important; }
        .bg-danger-subtle { background-color: #fdeaea !important; }
        .bg-success-subtle { background-color: #eafaf1 !important; }
        
        @media (max-width: 991px) {
           .hero-text { font-size: 1.85rem !important; }
        }
      `}</style>
    </section>
  );
}