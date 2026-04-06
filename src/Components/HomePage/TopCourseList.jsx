import React from "react";
import { Link } from "react-router-dom";

const courses = [
  { id: 1, src: "images/course/oLevel.avif", title: "O-Level", desc: "Digital Literacy & IT", dur: "12 Months", theme: "#4f46e5" },
  { id: 2, src: "images/course/ccc.avif", title: "CCC", desc: "Govt. Literacy Cert.", dur: "3 Months", theme: "#f59e0b" },
  { id: 3, src: "images/course/software.avif", title: "Software", desc: "Full Stack Mastery", dur: "6 Months", theme: "#10b981" },
  { id: 4, src: "images/course/reactJs.avif", title: "React", desc: "Frontend Web Dev", dur: "4 Months", theme: "#06b6d4" },
  { id: 5, src: "images/course/python.avif", title: "Python", desc: "AI & Data Science", dur: "5 Months", theme: "#3b82f6" },
  { id: 6, src: "images/course/tally.avif", title: "Tally", desc: "ERP & Accounting", dur: "3 Months", theme: "#dc2626" },
];

export default function TopCourseList() {
  return (
    <section className="py-5 bg-light" id="programs">
      <div className="container">
        
        {/* Header Animation */}
        <div className="d-flex justify-content-between align-items-end mb-5 px-2 scroll-animate fade-down">
          <div>
            <span className="badge bg-danger-subtle text-danger mb-2 px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '10px' }}>
              🔥 MOST POPULAR
            </span>
            <h2 className="display-6 fw-black mb-0 text-dark">Explore <span className="text-primary">Programs</span></h2>
          </div>
          <Link to="/courses" className="btn btn-outline-dark rounded-pill px-4 fw-bold transition-all shadow-sm">
            View All Courses
          </Link>
        </div>

        {/* Grid with Staggered Animation */}
        <div className="row g-4">
          {courses.map((c, i) => (
            <div 
              key={c.id} 
              className={`col-12 col-md-6 col-lg-4 scroll-animate zoom-in delay-${(i % 3) + 1}`}
            >
              <Link to="/courses" className="text-decoration-none">
                <article className="course-card-modern position-relative overflow-hidden bg-white p-3 rounded-4 border border-light-subtle shadow-sm">
                  
                  {/* Subtle Background Glow on Hover */}
                  <div className="hover-glow" style={{ backgroundColor: c.theme }}></div>

                  <div className="d-flex align-items-center position-relative" style={{ zIndex: 2 }}>
                    {/* Thumbnail with Dynamic Shadow */}
                    <div 
                      className="thumb-container flex-shrink-0 rounded-4 overflow-hidden d-flex align-items-center justify-content-center shadow-sm"
                      style={{ 
                        width: '85px', 
                        height: '85px', 
                        background: `linear-gradient(135deg, ${c.theme}15, ${c.theme}05)`,
                        border: `1px solid ${c.theme}20` 
                      }}
                    >
                      <img 
                        src={c.src} 
                        alt={c.title} 
                        width="85" 
                        height="85"
                        loading="lazy"
                        className="img-fluid p-2 object-fit-contain" 
                      />
                    </div>

                    {/* Content */}
                    <div className="ms-3 flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bolder text-uppercase ls-1" style={{ color: c.theme, fontSize: '10px' }}>
                          {c.title}
                        </span>
                        <div className="badge bg-light text-muted fw-normal border" style={{ fontSize: '10px' }}>
                          <i className="bi bi-clock me-1 text-primary"></i>{c.dur}
                        </div>
                      </div>
                      
                      <h3 className="h6 fw-bold text-dark mb-1">{c.desc}</h3>
                      
                      <div className="d-flex align-items-center justify-content-between mt-2">
                         <span className="text-muted extra-small">ISO Certified</span>
                         <span className="enroll-link fw-bold text-primary" style={{ fontSize: '11px' }}>
                            Join Now <i className="bi bi-arrow-right-short ms-1"></i>
                         </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .ls-1 { letter-spacing: 1px; }
        .extra-small { font-size: 11px; }
        
        .course-card-modern {
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .hover-glow {
          position: absolute;
          width: 100px;
          height: 100px;
          filter: blur(50px);
          opacity: 0;
          top: -20px;
          right: -20px;
          transition: 0.4s ease;
          border-radius: 50%;
          z-index: 1;
        }

        .course-card-modern:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
          border-color: rgba(0,0,0,0.1) !important;
        }

        .course-card-modern:hover .hover-glow {
          opacity: 0.15;
        }

        .course-card-modern:hover .thumb-container {
          transform: scale(1.1) rotate(-3deg);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }

        .thumb-container {
          transition: all 0.4s ease;
        }

        .enroll-link {
          transition: 0.3s;
          position: relative;
        }

        .course-card-modern:hover .enroll-link {
          padding-right: 5px;
        }

        .fw-black { font-weight: 900; }
      `}</style>
    </section>
  );
}