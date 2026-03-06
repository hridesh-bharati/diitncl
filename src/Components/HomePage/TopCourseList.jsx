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
        {/* Header */}
        <div className="d-flex justify-content-between align-items-end mb-4 px-2">
          <div>
            <h6 className="text-danger fw-bold mb-1" style={{ letterSpacing: '1px', fontSize: '12px' }}>TOP RATED</h6>
            <h2 className="h4 fw-bold mb-0 text-dark">Explore Programs</h2>
          </div>
          <Link to="/courses" className="btn btn-sm btn-white shadow-sm rounded-pill px-3 fw-bold border text-dark">
            View All
          </Link>
        </div>

        {/* Grid: PC=3, Mobile=1 */}
        <div className="row g-4">
          {courses.map((c) => (
            <div key={c.id} className="col-12 col-md-6 col-lg-4">
              <Link to="/courses" className="text-decoration-none">
                <article className="premium-course-card d-flex align-items-center p-3 bg-white rounded-4 shadow-sm border-0">
                  
                  {/* Compact Thumbnail Box */}
                  <div 
                    className="flex-shrink-0 rounded-3 overflow-hidden d-flex align-items-center justify-content-center"
                    style={{ 
                      width: '90px', 
                      height: '90px', 
                      backgroundColor: `${c.theme}10`,
                      border: `1px solid ${c.theme}20` 
                    }}
                  >
                    <img 
                      src={c.src} 
                      alt={c.title} 
                      className="img-fluid p-2" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  {/* Content Area */}
                  <div className="ms-3 flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold extra-small text-uppercase" style={{ color: c.theme }}>{c.title}</span>
                      <span className="text-muted" style={{ fontSize: '10px' }}>
                        <i className="bi bi-calendar3 me-1"></i>{c.dur}
                      </span>
                    </div>
                    <h3 className="h6 fw-bold text-dark mb-1 text-truncate">{c.desc}</h3>
                    <p className="text-muted mb-0 extra-small">Certified by Drishtee Institute</p>
                    
                    <div className="mt-2 d-flex align-items-center text-primary fw-bold" style={{ fontSize: '11px' }}>
                      Enroll Now <i className="bi bi-arrow-right ms-1"></i>
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .extra-small { font-size: 11px; }
        .premium-course-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .premium-course-card:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
          background: #fff;
        }
        .premium-course-card:hover img {
          transform: rotate(-5deg) scale(1.1);
        }
        .premium-course-card img {
          transition: 0.3s ease;
        }
      `}</style>
    </section>
  );
}