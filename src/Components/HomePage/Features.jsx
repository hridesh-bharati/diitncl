import React from "react";
import { Link } from "react-router-dom";

const DATA = [
  { i: "laptop", t: "Live Projects", bg: "bg-primary-subtle", icon: "text-primary", desc: "Real-time work" },
  { i: "person-badge", t: "Expert Trainers", bg: "bg-info-subtle", icon: "text-info", desc: "Industry mentors" },
  { i: "award-fill", t: "Certificates", bg: "bg-danger-subtle", icon: "text-danger", desc: "ISO Verified" },
  { i: "cpu-fill", t: "Latest Tech", bg: "bg-success-subtle", icon: "text-success", desc: "Future-ready" }
];

const H = [
  { t: "Real-World Experience", d: "Practical knowledge.", icon: "bi-rocket-takeoff", color: "text-primary", bg: "bg-primary-subtle" },
  { t: "Expert-Led Training", d: "Industry veterans.", icon: "bi-person-workspace", color: "text-success", bg: "bg-success-subtle" },
  { t: "Global Recognition", d: "ISO Certificates.", icon: "bi-globe-central-south-asia", color: "text-danger", bg: "bg-danger-subtle" }
];

export default function LiveCards() {
  return (
    <section className="container-fluid py-5 px-lg-5 overflow-hidden bg-white">
      <div className="row align-items-center g-4 g-lg-5">
        <div className="col-lg-7 order-1 order-lg-2">
          <div className="row g-3">
            {DATA.map((item, i) => (
              <div key={i} className="col-6">
                <div className={`card h-100 border-0 rounded-4 p-3 p-md-4 text-center shadow-sm shadow-hover transition-base ${item.bg}`}>
                  <div className="bg-white d-flex align-items-center justify-content-center mx-auto mb-2 rounded-circle shadow-sm"
                    style={{ width: "clamp(45px, 10vw, 65px)", height: "clamp(45px, 10vw, 65px)" }}>
                    <i className={`bi bi-${item.i} ${item.icon} fs-4 fs-md-2`}></i>
                  </div>
                  <h6 className="fw-bold mb-1 text-dark small-md-large">{item.t}</h6>
                  <span className="badge bg-white bg-opacity-75 text-dark rounded-pill py-1 px-2 mx-auto" style={{ fontSize: "0.6rem" }}>
                    {item.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-5 text-start order-2 order-lg-1">
          <span className="badge bg-primary-subtle text-primary rounded-pill mb-3 fw-bold px-3 py-2 border border-primary border-opacity-10 text-uppercase" style={{ fontSize: '10px' }}>
            WHY CHOOSE DRISHTEE
          </span>
          <h2 className="fw-bolder mb-3 display-5 lh-sm text-dark" style={{ letterSpacing: '-1px' }}>
            Upgrade Your <span className="text-primary border-bottom border-4 border-primary border-opacity-25">Skills</span>
          </h2>

          <div className="mt-4">
            {H.map((item, i) => (
              <div key={i} className="d-flex mb-3 align-items-center p-2 rounded-4 hover-bg-light transition-base">
                <div className={`${item.bg} rounded-3 d-flex align-items-center justify-content-center flex-shrink-0`}
                  style={{ width: '45px', height: '45px' }}>
                  <i className={`bi ${item.icon} ${item.color} fs-5`}></i>
                </div>
                <div className="ms-3">
                  <h6 className="fw-bold mb-0 text-dark">{item.t}</h6>
                  <p className="text-muted mb-0 small">{item.d}</p>
                </div>
              </div>
            ))}
          </div>

          <Link to="/courses" className="text-decoration-none">
            <button className="btn text-white rounded-pill px-4 py-3 fw-bold w-100 shadow-lg mt-3 border-0 blueGD">
              GET STARTED NOW <i className="bi bi-arrow-right-short ms-1 fs-5"></i>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}