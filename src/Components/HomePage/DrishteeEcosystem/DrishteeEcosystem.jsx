import React from "react";

const DrishteeEcosystem = () => {
  const features = [
    {
      icon: "bi-cpu",
      title: "Advanced Lab & Infrastructure",
      desc: "Hands-on practical training with high-performance computing setups and modern development environments."
    },
    {
      icon: "bi-journal-code",
      title: "Industry-Ready Curriculum",
      desc: "Courses continuously updated to match real-world software development and modern technical paradigms."
    },
    {
      icon: "bi-shield-check",
      title: "Rigorous Assessment Hub",
      desc: "Integrated CBT practice portals with anti-cheat mechanisms to ensure genuine skill validation."
    },
    {
      icon: "bi-briefcase",
      title: "Placement Support",
      desc: "Direct guidance, technical interview preparation, and portfolio building to bridge the gap to jobs."
    }
  ];

  return (
    <section className="py-5 position-relative drishtee-dark-bg text-white">
      <div className="container-fluid py-3">
        <div className="row g-4 align-items-stretch">
          
          {/* Left Column: Heading & Stats */}
          <div className="col-12 col-xl-4 d-flex flex-column justify-content-between">
            <div>
              <span className="text-uppercase fw-bold tracking-wider text-dark-red d-block mb-2 small">
                OUR ECOSYSTEM
              </span>
              <h2 className="fw-bold display-6 mb-3 text-white">
                Why Code & Learn <br />
                With <span className="text-warning">Drishtee</span>?
              </h2>
              <p className="text-white-50 small mb-4">
                We don't just teach courses; we build technically proficient professionals through structured engineering frameworks and real-time lab execution.
              </p>
            </div>

            {/* Stats Counter Grid */}
            <div className="row g-3 border-top border-secondary-subtle pt-3 mt-auto">
              <div className="col-6">
                <small className="text-white-50 d-block text-uppercase tracking-wider metric-lbl">ESTABLISHED</small>
                <span className="fw-bold fs-4 text-white">19+ YEARS</span>
              </div>
              <div className="col-6">
                <small className="text-white-50 d-block text-uppercase tracking-wider metric-lbl">STUDENTS TRAINED</small>
                <span className="fw-bold fs-4 text-white">5,000+</span>
              </div>
              <div className="col-6 mt-3">
                <small className="text-white-50 d-block text-uppercase tracking-wider metric-lbl">PRACTICAL RATIO</small>
                <span className="fw-bold fs-4 text-white">100% LABS</span>
              </div>
              <div className="col-6 mt-3">
                <small className="text-white-50 d-block text-uppercase tracking-wider metric-lbl">PORTFOLIO DRIVEN</small>
                <span className="fw-bold fs-4 text-white">12+ PROJECTS</span>
              </div>
            </div>
          </div>

          {/* Center Column: 2x2 Feature Grid */}
          <div className="col-12 col-md-7 col-xl-5">
            <div className="row g-3 h-100">
              {features.map((feat, idx) => (
                <div key={idx} className="col-12 col-sm-6">
                  <div className="p-4 h-100 d-flex flex-column justify-content-start drishtee-feature-card">
                    <div className="mb-3 text-dark-red fs-3">
                      <i className={`bi ${feat.icon}`}></i>
                    </div>
                    <h6 className="fw-bold text-white mb-2">{feat.title}</h6>
                    <p className="text-white-50 mb-0 small lh-sm">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: High-Converting White Highlight Box */}
          <div className="col-12 col-md-5 col-xl-3">
            <div className="bg-white text-dark p-4 h-100 d-flex flex-column justify-content-between drishtee-cta-box">
              <div>
                <h4 className="fw-bold text-dark mb-3 tracking-tight">Start Your Journey</h4>
                <p className="text-muted small mb-4">Explore comprehensive software programs, customized technical mentorship, and verified certifications.</p>
                
                <ul className="list-unstyled d-flex flex-column gap-2 mb-4">
                  <li className="d-flex align-items-start gap-2 small">
                    <i className="bi bi-check-square-fill text-dark-red mt-0.5"></i>
                    <span>Full Access to Automated Lab Portal</span>
                  </li>
                  <li className="d-flex align-items-start gap-2 small">
                    <i className="bi bi-check-square-fill text-dark-red mt-0.5"></i>
                    <span>Real-World Live Project Assignment</span>
                  </li>
                  <li className="d-flex align-items-start gap-2 small">
                    <i className="bi bi-check-square-fill text-dark-red mt-0.5"></i>
                    <span>Advanced Programming & Core IT Tracks</span>
                  </li>
                  <li className="d-flex align-items-start gap-2 small">
                    <i className="bi bi-check-square-fill text-dark-red mt-0.5"></i>
                    <span>Verified Industry-Recognized Certification</span>
                  </li>
                </ul>
              </div>

              <div>
                <button className="btn btn-dark-red w-100 fw-bold py-2 rounded-0 text-uppercase tracking-wider d-flex align-items-center justify-content-center gap-2 text-white fs-7">
                  Explore Programs <i className="bi bi-arrow-right"></i>
                </button>
                <div className="text-center mt-2">
                  <small className="text-muted tracking-tight" style={{ fontSize: '10px' }}>
                    <i className="bi bi-info-circle"></i> COUNSELING DESK AVAILABLE MON-SAT
                  </small>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Zero Redundant CSS - Minimal Layout Properties */}
      <style>{`
        .drishtee-dark-bg {
          background-color: #060913;
        }
        .text-dark-red { color: #990011 !important; }
        .btn-dark-red { background-color: #990011 !important; border: 1px solid #990011; }
        .btn-dark-red:hover { background-color: #77000d !important; }
        .tracking-wider { letter-spacing: 1.5px; }
        .tracking-tight { letter-spacing: -0.3px; }
        .fs-7 { font-size: 0.8rem; }
        .metric-lbl { font-size: 9px; font-weight: 700; letter-spacing: 1px; }
        
        /* Rigid Flat Boxes matching image structure */
        .drishtee-feature-card {
          background-color: #0b1121;
          border-top: 2px solid rgba(153, 0, 17, 0.3);
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 0px !important;
        }
        
        .drishtee-cta-box {
          border-top: 4px solid #990011;
          border-radius: 0px !important;
          box-shadow: 0px 20px 40px rgba(0,0,0,0.4);
        }
        
        .lh-sm { line-height: 1.4 !important; }
      `}</style>
    </section>
  );
};

export default DrishteeEcosystem;