import React from "react";
import { Link } from "react-router-dom";
import './TopCourseList.css'
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
    <section className="py-4 bg-white" id="programs">
      <div className="container">
        {/* Header */}
        <header className="d-flex justify-content-between align-items-center mb-4 px-2">
          <h2 className="h5 fw-bold mb-0">Trending Programs</h2>
          <Link to="/courses" className="small fw-bold text-decoration-none text-primary">
            View All <i className="bi bi-arrow-right-short"></i>
          </Link>
        </header>

        {/* Course Grid */}
        <div className="row g-3">
          {courses.map((c) => (
            <div key={c.id} className="col-6 col-md-4">
              <Link to="/courses" className="text-decoration-none h-100 d-block">
                <article className="course-card-premium p-2 h-100 d-flex flex-column">
                  
                  {/* Image Container with Dynamic BG */}
                  <div 
                    className="course-image-wrapper rounded-4 mb-2 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: `${c.theme}15` }}
                  >
                    <img src={c.src} alt={c.title} className="course-img" loading="lazy" />
                  </div>

                  {/* Content */}
                  <div className="px-1 flex-grow-1">
                    <span className="course-tag" style={{ color: c.theme }}>{c.title}</span>
                    <h3 className="course-desc text-dark mt-1">{c.desc}</h3>
                  </div>

                  {/* Footer */}
                  <div className="d-flex justify-content-between align-items-center mt-3 p-1">
                    <span className="text-muted extra-small">
                      <i className="bi bi-clock me-1"></i>{c.dur}
                    </span>
                    <div className="arrow-btn">
                      <i className="bi bi-arrow-right"></i>
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}