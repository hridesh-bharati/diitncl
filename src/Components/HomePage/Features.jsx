import React from "react";

const DATA = [
  { i: "laptop", t: "Live Projects", c: "#4361ee" },
  { i: "person-gear", t: "Expert Trainers", c: "#7209b7" },
  { i: "award", t: "Global Certificates", c: "#f72585" },
  { i: "cpu-fill", t: "Latest Technology", c: "#ff6b6b" }
];

const H = [
  { t: "Real-World Experience", d: "Simulated workflows for practical knowledge." },
  { t: "Expert-Led Training", d: "Learn from industry veterans." },
  { t: "Global Recognition", d: "Certificates that hold value internationally." }
];

export default function LiveCards() {
  const grad = (c) => `linear-gradient(135deg, ${c} 0%, #000 150%)`;

  return (
    <section className="container py-5">
      <div className="row align-items-center g-4">
        
        {/* Left Side: Fade Left Animation */}
        <div className="col-lg-5 text-start scroll-animate fade-left">
          <span className="badge bg-primary-subtle text-primary rounded-pill mb-3 fw-bold">
            WHY CHOOSE DRISHTEE
          </span>
          <h2 className="display-6 fw-bold mb-4">
            Transform Your Career with <span className="text-primary">Industry-Focused</span> Learning
          </h2>

          {H.map((item, i) => (
            <div key={i} className="d-flex mb-3 align-items-start justify-content-start text-start">
              <i className="bi bi-check-circle-fill text-primary me-3 fs-5"></i>
              <div>
                <h6 className="fw-bold mb-0 small">{item.t}</h6>
                <p className="text-muted extra-small mb-0">{item.d}</p>
              </div>
            </div>
          ))}

          <button className="btn btn-primary btn-lg px-5 rounded-pill fw-bold shadow-sm w-100 mt-3 scroll-animate zoom-in delay-2">
            Get Started Now →
          </button>
        </div>

        {/* Right Grid: Staggered Fade Up Animation */}
        <div className="col-lg-7">
          <div className="row g-3">
            {DATA.map((item, i) => (
              <div 
                key={i} 
                className={`col-6 scroll-animate fade-right delay-${(i % 5) + 1}`}
              >
                <div className="f-card p-4 rounded-4 shadow-sm text-center bg-white border border-light h-100">
                  <div className="i-box mx-auto mb-3 d-flex align-items-center justify-content-center shadow" style={{ background: grad(item.c) }}>
                    <i className={`bi bi-${item.i} text-white fs-4`}></i>
                  </div>
                  <h6 className="fw-bold mb-2 small">{item.t}</h6>
                  <p className="text-muted extra-small mb-0">Industry standard workflow & tools.</p>
                  <div className="dash mx-auto mt-3" style={{ background: item.c }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      
      <style>{`
        .f-card { transition: .3s; cursor: pointer; }
        .f-card:hover { transform: translateY(-8px); border-color: #0d6efd !important; }
        .i-box { width: 55px; height: 55px; border-radius: 15px; }
        .dash { height: 3px; width: 25px; border-radius: 2px; }
        .extra-small { font-size: 11px; }
      `}</style>
    </section>
  );
}