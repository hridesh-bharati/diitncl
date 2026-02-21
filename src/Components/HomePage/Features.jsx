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
    <div className="container-fluid py-5">

      {/* Header */}
      <div className="text-center mb-5">
        <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-3">
          POPULAR FEATURES
        </span>

        <h2 className="fw-bold mb-3">
          Why Choose <span className="text-primary">Drishtee</span>
        </h2>

        <p className="text-muted mx-auto" style={{ maxWidth: 650 }}>
          Experience learning reimagined with our cutting-edge platform designed for tomorrow's innovators
        </p>

        <div className="bg-primary mx-auto mt-3" style={{ width: 80, height: 4, borderRadius: 2 }}></div>
      </div>

      <div className="row align-items-stretch">

        {/* Left Column */}
        <div className="col-lg-6 mb-4 mb-lg-0">
          <div className="h-100 p-4 p-lg-5 d-flex flex-column justify-content-center">

            <h3 className="fw-bold mb-4">
              Transform Your Career with Industry-Focused Learning
            </h3>

            <div className="mb-4">
              <h6 className="fw-bold">Real-World Project Experience</h6>
              <p className="text-muted small">
                Gain hands-on experience with projects that simulate actual industry workflows.
              </p>
            </div>

            <div className="mb-4">
              <h6 className="fw-bold">Expert-Led Training</h6>
              <p className="text-muted small">
                Learn from certified professionals with practical experience.
              </p>
            </div>

            <div className="mb-4">
              <h6 className="fw-bold">Global Recognition</h6>
              <p className="text-muted small">
                Earn certificates recognized by top companies worldwide.
              </p>
            </div>

            <button className="btn btn-primary btn-lg px-4 mt-3">
              Start Your Journey Today
            </button>

          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-6">
          <div className="row g-4">

            {featureData.map((item, index) => (
              <div key={index} className="col-6 d-flex">
                <div className="p-4 rounded-4 shadow-sm text-center w-100 bg-white">

                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      background: item.gradient,
                      width: 70,
                      height: 70,
                      borderRadius: 18,
                      boxShadow: `0 6px 15px ${item.colored}30`
                    }}
                  >
                    <i className={item.icon} style={{ fontSize: "1.75rem", color: "#fff" }}></i>
                  </div>

                  <h6 className="fw-bold mb-2">
                    {item.title}
                  </h6>

                  <p className="text-muted small mb-0">
                    {item.desc}
                  </p>

                  <div
                    className="mx-auto mt-3"
                    style={{
                      height: 3,
                      width: 40,
                      borderRadius: 2,
                      background: item.gradient
                    }}
                  ></div>

                </div>
              </div>
            ))}

          </div>
        </div>

      </div>

    </div>
  );
}