import React from "react";
import { Link } from "react-router-dom";

const courses = [
  { id: 1, title: "Angular JS", src: "images/course/angular-js.webp" },
  { id: 2, title: "Tally Prime", src: "images/course/tally-course.png" },
  { id: 3, title: "Full Stack Development", src: "images/course/full-stack.png" },
  { id: 4, title: "Mongo DB", src: "images/course/mongodb.png" },
  { id: 5, title: "Android Development", src: "images/course/android-dev.jpg" },
  { id: 6, title: "React JS Advance", src: "images/course/reactjs.jpg" },
  { id: 7, title: "Python Data Science", src: "images/course/python-training.png" },
  { id: 8, title: "Java Mastery Course", src: "images/course/Java-full-stack.png" }
];

const CourseCard = ({ course }) => (
  <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden course-card bg-white position-relative w-100">

    {/* Official Image Container */}
    <div className="ratio ratio-16x9 bg-light d-flex align-items-center justify-content-center p-2">
      <img
        src={course.src}
        alt={course.title}
        className="card-img-top img-fluid"
        style={{
          objectFit: 'contain',
          maxHeight: '100%',
          filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.05))'
        }}
      />
    </div>

    {/* Card Content */}
    <div className="card-body p-3 d-flex flex-column text-center">
      <h5 className="fw-bolder mb-3 mt-1" style={{ color: '#002d5b', fontSize: '1.25rem', letterSpacing: '-0.3px' }}>
        {course.title}
      </h5>

      {/* Premium Gradient Button */}
      <Link to="/courses" className="btn enroll-btn py-2 rounded-pill fw-bold text-white shadow-sm mt-auto mb-2">
        Enroll Now
      </Link>

      {/* Branding Label */}
      <div className="brand-label position-absolute bottom-0 end-0">
        <div className="bg-dark text-white px-3 py-1 text-end shadow-sm" style={{ borderRadius: '20px 0 0 0', fontSize: '9px' }}>
          <div className="fw-bold lh-1">DRISHTEE</div>
          <div className="opacity-75" style={{ fontSize: '7px' }}>Nichlaul</div>
        </div>
      </div>
    </div>
  </div>
);

export default function TopCourseList() {
  return (
    <section >
      <div className="container-fluid p-0 bg-primary-subtle">

        {/* Header Section */}
        <div className="bg-white p-4">
          <div className="d-flex justify-content-between align-items-center mb-4 px-2">
            <div>
              <h4 className="fw-bold mb-0 text-primary">Top Programs</h4>
              <p className="text-muted small m-0">Official Certification Courses</p>
            </div>
            <Link to="/courses" className="btn btn-outline-primary rounded-pill px-4 btn-sm fw-bold border-2">
              View All
            </Link>
          </div>
        </div>

        {/* Grid: 1 per row on mobile, 2 on tablet, 4 on desktop */}
        <div className="row g-4 justify-content-center bg-primary-subtle">
          {courses.map(course => (
            <div key={course.id} className="col-12 col-md-6 col-lg-3">
              <CourseCard course={course} />
            </div>
          ))}
        </div>

      </div>

      <style>{`
        .enroll-btn {
          background: linear-gradient(135deg, #002d5b 0%, #00d2ff 100%);
          border: none;
          font-size: 1rem;
          transition: all 0.3s ease-in-out;
          letter-spacing: 0.5px;
        }
        .enroll-btn:hover {
          background: linear-gradient(135deg, #001a35 0%, #00b8e6 100%);
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgba(0, 210, 255, 0.4);
          color: white;
        }
        .course-card { 
          transition: all 0.3s ease;
          border: 1px solid rgba(0,0,0,0.05) !important;
        }
        .course-card:hover { 
          transform: translateY(-8px); 
          box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
          border-color: rgba(0, 210, 255, 0.3) !important;
        }
        .brand-label { z-index: 5; width: 90px; }
      `}</style>
    </section>
  );
}