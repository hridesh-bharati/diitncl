import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const courses = [
  { id: 1, src: "images/course/oLevel.webp", title: "O-Level", desc: "Digital Literacy & IT", duration: "12 Months", tag: "Most Popular", theme: "#4f46e5" },
  { id: 2, src: "images/course/ccc.webp", title: "CCC", desc: "Govt. Literacy Cert.", duration: "3 Months", tag: "Basic", theme: "#f59e0b" },
  { id: 3, src: "images/course/software.webp", title: "Software", desc: "Full Stack Mastery", duration: "6 Months", tag: "Career Track", theme: "#10b981" },
  { id: 4, src: "images/course/reactJs.webp", title: "React", desc: "Frontend Web Dev", duration: "4 Months", tag: "Trending", theme: "#06b6d4" },
  { id: 5, src: "images/course/python.webp", title: "Python", desc: "AI & Data Science", duration: "5 Months", tag: "High Pay", theme: "#3b82f6" },
  { id: 6, src: "images/course/tally.webp", title: "Tally", desc: "ERP & Accounting", duration: "3 Months", tag: "Business", theme: "#dc2626" },
];

export default function TopCourseList() {
  return (
    <div className="app-course-section py-4">
      <div className="container">
        {/* Section Header - Mobile Friendly */}
        <div className="d-flex justify-content-between align-items-end mb-4 px-2">
          <div>
            <h4 className="fw-bold mb-0" style={{ letterSpacing: "-0.5px" }}>Trending Programs</h4>
            <p className="text-muted small mb-0">Learn top-rated industry skills</p>
          </div>
          <Link to="/OurCourses" className="text-primary fw-bold small text-decoration-none">
            View All <i className="bi bi-chevron-right"></i>
          </Link>
        </div>

        {/* Course Grid - App Like */}
        <div className="row g-3 g-md-4">
          {courses.map(course => (
            <div key={course.id} className="col-6 col-lg-3 col-md-4">
              <div className="app-course-card shadow-sm h-100">
                {/* Image & Badge Container */}
                <div className="app-img-container">
                  <div className="app-course-badge" style={{ backgroundColor: course.theme }}>
                    {course.tag}
                  </div>
                  <img src={course.src} alt={course.title} className="app-course-img" />
                </div>

                {/* Content */}
                <div className="app-card-content p-3">
                  <span className="x-small-text fw-bold opacity-75" style={{ color: course.theme }}>
                    {course.title}
                  </span>
                  <h6 className="course-title-app mt-1 mb-2">{course.desc}</h6>

                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <div className="d-flex align-items-center text-muted x-small-text">
                      <i className="bi bi-stopwatch me-1"></i> {course.duration}
                    </div>

                    <Link to="/OurCourses">
                      <button className="app-mini-btn shadow-sm" style={{ color: course.theme }}>
                        <i className="bi bi-arrow-right-short"></i>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .app-course-section { background: transparent; }
        
        .app-course-card {
            background: white;
            border-radius: 24px;
            overflow: hidden;
            border: 1px solid rgba(0,0,0,0.04);
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
        }

        .app-course-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.08) !important;
        }

        .app-img-container {
            position: relative;
            height: 140px;
            background: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            margin: 8px;
            border-radius: 18px;
        }

        .app-course-img {
            width: 80%;
            height: 80%;
            object-fit: contain;
            transition: 0.3s;
        }

        .app-course-badge {
            position: absolute;
            top: 8px;
            left: 8px;
            font-size: 0.6rem;
            color: white;
            padding: 4px 10px;
            border-radius: 50px;
            font-weight: 700;
            z-index: 2;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .course-title-app {
            font-size: 0.9rem;
            font-weight: 800;
            line-height: 1.3;
            color: #1e293b;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .app-mini-btn {
            width: 28px;
            height: 28px;
            background: #f1f5f9;
            border-radius: 8px;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        }

        .x-small-text { font-size: 0.7rem; font-weight: 600; }

        @media (max-width: 768px) {
            .app-img-container { height: 110px; margin: 6px; }
            .course-title-app { font-size: 0.8rem; }
            .app-course-card { border-radius: 20px; }
        }
      `}</style>
    </div>
  );
}