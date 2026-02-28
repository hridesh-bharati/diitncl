import React from "react";
import { Link } from "react-router-dom";

const courses = [
  { id: 1, src: "images/course/oLevel.avif", title: "O-Level", desc: "Digital Literacy & IT", dur: "12 Months", tag: "Popular", theme: "#4f46e5" },
  { id: 2, src: "images/course/ccc.avif", title: "CCC", desc: "Govt. Literacy Cert.", dur: "3 Months", tag: "Basic", theme: "#f59e0b" },
  { id: 3, src: "images/course/software.avif", title: "Software", desc: "Full Stack Mastery", dur: "6 Months", tag: "Career", theme: "#10b981" },
  { id: 4, src: "images/course/reactJs.avif", title: "React", desc: "Frontend Web Dev", dur: "4 Months", tag: "New", theme: "#06b6d4" },
  { id: 5, src: "images/course/python.avif", title: "Python", desc: "AI & Data Science", dur: "5 Months", tag: "High Pay", theme: "#3b82f6" },
  { id: 6, src: "images/course/tally.avif", title: "Tally", desc: "ERP & Accounting", dur: "3 Months", tag: "Business", theme: "#dc2626" },
];

export default function TopCourseList() {
  return (
    <section className="py-1 bg-white" id="programs">
      <div className="container">
        <header className="d-flex justify-content-between align-items-center mb-4 px-2">
          <h2 className="h5 fw-bold mb-0 text-dark">Trending Programs</h2>
          <Link to="/courses" className="small fw-bold text-decoration-none text-primary">
            View All <i className="bi bi-arrow-right-short"></i>
          </Link>
        </header>

        <div className="row g-3">
          {courses.map(c => (
            /* col-6 = 2 cards on Mobile | col-md-4 = 3 cards on PC */
            <div key={c.id} className="col-6 col-md-4">
              <article className="h-100 rounded-4 border p-2 bg-light shadow-sm d-flex flex-column transition-base">
                <div className="rounded-4 mb-2 d-flex justify-content-center align-items-center" 
                     style={{ background: `${c.theme}15`, height: '110px' }}>
                  <img src={c.src} alt={c.title} loading="lazy" width="90" height="90" style={{ objectFit: 'contain' }} />
                </div>

                <div className="px-1 flex-grow-1">
                  <strong style={{ color: c.theme, fontSize: '10px', textTransform: 'uppercase' }}>{c.title}</strong>
                  <h3 className="fw-bold mb-2 text-dark mt-1" style={{ fontSize: '13px', lineHeight: '1.3' }}>{c.desc}</h3>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-auto p-1">
                  <span className="text-muted" style={{ fontSize: '10px' }}>
                    <i className="bi bi-clock me-1"></i>{c.dur}
                  </span>
                  <Link to="/courses" className="bg-light text-dark rounded-3 p-1 px-2 text-decoration-none" aria-label="Course Link">
                    <i className="bi bi-arrow-right small"></i>
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .transition-base { transition: 0.2s ease-in-out; border: 1px solid #eee !important; }
        .transition-base:hover { transform: translateY(-4px); border-color: #0d6efd !important; box-shadow: 0 8px 15px rgba(0,0,0,0.05) !important; }
        h3 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </section>
  );
}