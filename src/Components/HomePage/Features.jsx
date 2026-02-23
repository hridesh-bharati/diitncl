import React from "react";

const featureData = [
  {
    icon: "bi bi-laptop",
    title: "Live Projects",
    desc: "Work on real-time projects with industry workflow.",
    colored: "#4361ee",
    gradient: "linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)"
  },
  {
    icon: "bi bi-person-gear",
    title: "Expert Trainers",
    desc: "Learn from certified & experienced professionals.",
    colored: "#7209b7",
    gradient: "linear-gradient(135deg, #7209b7 0%, #560bad 100%)"
  },
  {
    icon: "bi bi-award",
    title: "Global Certificates",
    desc: "Certificates accepted by top corporates worldwide.",
    colored: "#f72585",
    gradient: "linear-gradient(135deg, #f72585 0%, #b5179e 100%)"
  },
  {
    icon: "bi bi-cpu-fill",
    title: "Latest Technology",
    desc: "Work with updated tools, software & modern devices.",
    colored: "#ff6b6b",
    gradient: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)"
  },
];

export default function LiveCards() {
  return (
    <section className="container py-5">
      <div className="row align-items-center g-2">
        <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-3 fw-bold">
          WHY CHOOSE DRISHTEE
        </span>
        <h2 className="display-5 fw-bold">
          Transform Your Career with <span className="text-primary">Industry-Focused</span> Learning
        </h2>
        {/* Left Column: Content */}
        <div className="col-lg-5 text-center text-lg-start">

          <div className="ps-lg-2">
            {[
              { t: "Real-World Experience", d: "Simulated workflows for practical knowledge." },
              { t: "Expert-Led Training", d: "Learn from industry veterans and masters." },
              { t: "Global Recognition", d: "Certificates that hold value internationally." }
            ].map((item, i) => (
              <div key={i} className="d-flex mb-4 align-items-start justify-content-center justify-content-lg-start">
                <i className="bi bi-check-circle-fill text-primary me-3 fs-5"></i>
                <div>
                  <h6 className="fw-bold mb-1">{item.t}</h6>
                  <p className="text-muted small mb-0">{item.d}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow-sm mt-3 w-100 w-lg-auto">
            Get Started Now <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>

        {/* Right Column: Grid Cards */}
        <div className="col-lg-7">
          <div className="row g-3 g-md-4">
            {featureData.map((item, index) => (
              <div key={index} className="col-6 col-sm-6 d-flex">
                <div className="feature-hover-card p-4 rounded-4 shadow-sm text-center w-100 bg-white border border-light transition-all">

                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      background: item.gradient,
                      width: 65,
                      height: 65,
                      borderRadius: 20,
                      boxShadow: `0 10px 20px ${item.colored}30`
                    }}
                  >
                    <i className={item.icon} style={{ fontSize: "1.5rem", color: "#fff" }}></i>
                  </div>

                  <h6 className="fw-extrabold text-dark mb-2">{item.title}</h6>
                  <p className="text-muted mb-0 d-none d-md-block" style={{ fontSize: '0.8rem' }}>
                    {item.desc}
                  </p>

                  <div
                    className="mx-auto mt-3 d-none d-md-block"
                    style={{ height: 3, width: 30, borderRadius: 2, background: item.gradient }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        .feature-hover-card {
            transition: all 0.3s ease;
            cursor: pointer;
        }
        .feature-hover-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
            border-color: #dee2e6 !important;
        }
        .fw-extrabold { font-weight: 800; }
      `}</style>
    </section>
  );
}