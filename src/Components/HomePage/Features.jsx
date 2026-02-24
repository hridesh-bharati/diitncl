import React from "react";

const FEATURE_DATA = [
  { icon: "bi-laptop", title: "Live Projects", desc: "Work on real-time projects with industry workflow.", color: "#4361ee", grad: "linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)" },
  { icon: "bi-person-gear", title: "Expert Trainers", desc: "Learn from certified & experienced professionals.", color: "#7209b7", grad: "linear-gradient(135deg, #7209b7 0%, #560bad 100%)" },
  { icon: "bi-award", title: "Global Certificates", desc: "Certificates accepted by top corporates worldwide.", color: "#f72585", grad: "linear-gradient(135deg, #f72585 0%, #b5179e 100%)" },
  { icon: "bi-cpu-fill", title: "Latest Technology", desc: "Work with updated tools, software & modern devices.", color: "#ff6b6b", grad: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)" },
];

const HIGHLIGHTS = [
  { t: "Real-World Experience", d: "Simulated workflows for practical knowledge." },
  { t: "Expert-Led Training", d: "Learn from industry veterans and masters." },
  { t: "Global Recognition", d: "Certificates that hold value internationally." }
];

export default function LiveCards() {
  return (
    <section className="container py-5">
      <div className="row align-items-center g-4">
        {/* Left Column */}
        <div className="col-lg-5 text-center text-lg-start">
          <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-3 fw-bold">WHY CHOOSE DRISHTEE</span>
          <h2 className="display-6 fw-bold mb-4">
            Transform Your Career with <span className="text-primary">Industry-Focused</span> Learning
          </h2>

          <div className="mb-4">
            {HIGHLIGHTS.map((item, i) => (
              <div key={i} className="d-flex mb-3 align-items-start justify-content-lg-start justify-content-center text-start">
                <i className="bi bi-check-circle-fill text-primary me-3 fs-5"></i>
                <div>
                  <h6 className="fw-bold mb-0">{item.t}</h6>
                  <p className="text-muted small mb-0">{item.d}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow-sm w-100 w-lg-auto">
            Get Started Now <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>

        {/* Right Column: Grid */}
        <div className="col-lg-7">
          <div className="row g-3">
            {FEATURE_DATA.map((item, i) => (
              <div key={i} className="col-6 d-flex">
                <div className="feature-hover-card p-4 rounded-4 shadow-sm text-center w-100 bg-white border border-light">
                  <div className="icon-box mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{ background: item.grad, boxShadow: `0 10px 20px ${item.color}30` }}>
                    <i className={`bi ${item.icon} text-white fs-4`}></i>
                  </div>
                  <h6 className="fw-extrabold  mb-2">{item.title}</h6>
                  <p className="text-muted small mb-0 d-md-block">{item.desc}</p>
                  <div className="dash mx-auto mt-3 d-md-block" style={{ background: item.grad }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .feature-hover-card { transition: all 0.3s ease; cursor: pointer; }
        .feature-hover-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; }
        .icon-box { width: 60px; height: 60px; border-radius: 18px; }
        .dash { height: 3px; width: 30px; border-radius: 2px; }
        .fw-extrabold { font-weight: 800; }
      `}</style>
    </section>
  );
}