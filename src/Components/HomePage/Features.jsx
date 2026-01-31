import React from "react";
import Sec from "./Sec"

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
    icon: "bi bi-tools",
    title: "Hands-On Training",
    desc: "100% practical training with modern labs.",
    colored: "#4cc9f0",
    gradient: "linear-gradient(135deg, #4cc9f0 0%, #4895ef 100%)"
  },
  {
    icon: "bi bi-cpu-fill",
    title: "Latest Technology",
    desc: "Work with updated tools, software & modern devices.",
    colored: "#ff6b6b",
    gradient: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)"
  },
  {
    icon: "bi bi-people-fill",
    title: "Small Batch Size",
    desc: "Personal attention & doubt support sessions.",
    colored: "#1dd1a1",
    gradient: "linear-gradient(135deg, #1dd1a1 0%, #10ac84 100%)"
  },
  {
    icon: "bi bi-patch-check-fill",
    title: "Guaranteed Quality",
    desc: "Trusted learning system followed strictly.",
    colored: "#ff9f43",
    gradient: "linear-gradient(135deg, #ff9f43 0%, #f39c12 100%)"
  },
  {
    icon: "bi bi-lightning-charge-fill",
    title: "Fast Learning",
    desc: "Special fast-track batches for quick learners.",
    colored: "#54a0ff",
    gradient: "linear-gradient(135deg, #54a0ff 0%, #2e86de 100%)"
  },
];

export default function LiveCards() {
  return (
    <>
      <Sec />

      <div className="container-fluid py-5" id="liveCards">
        {/* -------------------- Android Style Header -------------------- */}
        <div className="text-center mb-5">
          <div className="android-badge mb-3">
            <span>POPULAR FEATURES</span>
          </div>
          <h2 className="fw-bold text-dark display-5 mb-3">
            Why Choose <span className="gradient-text">Drishtee</span>
          </h2>
          <p className="text-muted lead mx-auto" style={{ maxWidth: 650 }}>
            Experience learning reimagined with our cutting-edge platform designed for tomorrow's innovators
          </p>
          <div className="header-divider bg-primary mx-auto mt-3"></div>
        </div>

        {/* -------------------- Dual Column Layout - Mixed Design -------------------- */}
        <div className="row align-items-stretch">
          {/* Left Column - Text Content */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="h-100 p-4 p-lg-5 d-flex flex-column justify-content-center">
              <h3 className="fw-bold text-dark mb-4 android-title">
                Transform Your Career with Industry-Focused Learning
              </h3>
              
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="android-bullet bg-primary me-3"></div>
                  <h6 className="fw-bold mb-0 android-subtitle">Real-World Project Experience</h6>
                </div>
                <p className="text-muted ps-5 android-desc">
                  Gain hands-on experience with projects that simulate actual industry scenarios and workflows.
                </p>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="android-bullet bg-success me-3"></div>
                  <h6 className="fw-bold mb-0 android-subtitle">Expert-Led Training</h6>
                </div>
                <p className="text-muted ps-5 android-desc">
                  Learn from industry professionals with years of practical experience and teaching expertise.
                </p>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="android-bullet bg-warning me-3"></div>
                  <h6 className="fw-bold mb-0 android-subtitle">Global Recognition</h6>
                </div>
                <p className="text-muted ps-5 android-desc">
                  Earn certificates that are recognized by top companies worldwide, enhancing your career prospects.
                </p>
              </div>

              <div className="mt-4">
                <button className="btn btn-primary btn-lg px-4 py-2 android-button">
                  Start Your Journey Today
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Feature Cards Grid with Gradient Icons */}
          <div className="col-lg-6">
            <div className="row g-4 h-100">
              {featureData.map((item, index) => (
                <div key={index} className="col-12 col-sm-6 d-flex">
                  <div className="android-card p-4 rounded-4 text-center w-100 h-100">
                    {/* Icon with Gradient Background */}
                    <div 
                      className="icon-container mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{
                        background: item.gradient,
                        width: '70px',
                        height: '70px',
                        borderRadius: '18px',
                        boxShadow: `0 6px 15px ${item.colored}30`
                      }}
                    >
                      <i className={item.icon} style={{ fontSize: '1.75rem', color: 'white' }}></i>
                    </div>

                    {/* Content */}
                    <h6 className="fw-bold text-dark mb-2 android-card-title">
                      {item.title}
                    </h6>
                    <p className="text-muted small mb-0 android-card-desc">
                      {item.desc}
                    </p>

                    {/* Bottom Indicator */}
                    <div className="card-indicator mt-3" style={{ background: item.gradient }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* -------------------- Bottom CTA - Mixed Design -------------------- */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="cta-section p-5 rounded-4 text-center">
              <div className="cta-icon mb-3">
                <i className="bi bi-rocket-takeoff" style={{ fontSize: '3rem', color: '#4361ee' }}></i>
              </div>
              <h4 className="fw-bold text-dark mb-3">Ready to Launch Your Career?</h4>
              <p className="text-muted mb-4 mx-auto android-cta-desc">
                Join our community of successful learners and transform your future today
              </p>
             
            </div>
          </div>
        </div>

        <style jsx>{`
          .header-divider {
            width: 80px;
            height: 4px;
            border-radius: 2px;
          }
          
          .android-badge {
            display: inline-block;
            background: #e3f2fd;
            padding: 8px 20px;
            border-radius: 25px;
            color: #1976d2;
            font-weight: 600;
            font-size: 0.8rem;
            border: 1px solid #bbdefb;
          }
          
          .gradient-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .android-stats {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border: 1px solid rgba(0,0,0,0.05);
          }
          
          .android-bullet {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            flex-shrink: 0;
          }
          
          .android-title {
            font-size: 1.5rem;
            line-height: 1.4;
          }
          
          .android-subtitle {
            font-size: 1rem;
          }
          
          .android-desc {
            font-size: 0.9rem;
            line-height: 1.6;
          }
          
          .android-button {
            font-size: 1rem;
            border-radius: 8px;
          }
          
          .android-card {
            background: white;
            border: 1px solid rgba(0,0,0,0.08);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }
          
          .android-card-title {
            font-size: 1rem;
            line-height: 1.3;
          }
          
          .android-card-desc {
            font-size: 0.85rem;
            line-height: 1.5;
          }
          
          .card-indicator {
            height: 3px;
            width: 40px;
            border-radius: 2px;
            margin: 0 auto;
          }
          
          .cta-section {
            background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
            border: 1px solid rgba(67, 97, 238, 0.1);
          }
          
          .cta-icon {
            animation: float 3s ease-in-out infinite;
          }
          
          .android-cta-desc {
            font-size: 1rem;
            max-width: 500px;
          }
          
          .android-cta-btn {
            border-radius: 8px;
          }
          
          .badge-item {
            display: flex;
            align-items: center;
            padding: 10px 20px;
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 12px;
            color: #495057;
            font-weight: 500;
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          @media (max-width: 768px) {
            .display-5 {
              font-size: 2rem;
            }
            
            .android-card {
              padding: 1.5rem !important;
            }
            
            .icon-container {
              width: 60px !important;
              height: 60px !important;
            }
            
            .icon-container i {
              font-size: 1.5rem !important;
            }
          }
          
          @media (max-width: 576px) {
            .container {
              padding-left: 15px;
              padding-right: 15px;
            }
            
            .android-stats {
              padding: 1.5rem !important;
            }
            
            .android-bullet {
              width: 10px;
              height: 10px;
            }
            
            .icon-container {
              width: 55px !important;
              height: 55px !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}