import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const courses = [
  { id: 1, src: "images/course/oLevel.webp", title: "O-Level", desc: "O-Level Computer Course", duration: "12 Months" },
  { id: 2, src: "images/course/ccc.webp", title: "CCC", desc: "CCC Certification Course", duration: "3 Months" },
  { id: 3, src: "images/course/software.webp", title: "Software", desc: "Software Development", duration: "6 Months" },
  { id: 4, src: "images/course/reactJs.webp", title: "React", desc: "React.js Frontend", duration: "4 Months" },
  { id: 5, src: "images/course/python.webp", title: "Python", desc: "Python Programming", duration: "5 Months" },
  { id: 6, src: "images/course/mongo.webp", title: "MongoDB", desc: "MongoDB Database", duration: "2 Months" },
  { id: 7, src: "images/course/iot.webp", title: "IoT", desc: "Introduction to IoT", duration: "6 Months" },
  { id: 8, src: "images/course/tally.webp", title: "Tally", desc: "Tally ERP Accounting", duration: "3 Months" },
];

export default function TopCourseList() {
  return (
    <div className="py-5 bg-light">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <h2 className="fw-bold display-6">Trending Programs</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
            Elevate your career with industry-recognized certifications and hands-on technical training.
          </p>
        </div>

        {/* Course Cards */}
        <div className="row g-4">
          {courses.map(course => (
            <div key={course.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
              <div className="card h-100 shadow-sm border-0">
                <div className="d-flex justify-content-center align-items-center p-0" style={{ height: "180px", background: "#ffffff" }}>
                  <img src={course.src} alt={course.title} className="img-fluid p-0 m-0" style={{width:"100%", maxHeight: "100%", objectFit: "contain" }} />
                </div>
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <span className="text-primary text-uppercase fw-semibold small">{course.title}</span>
                    <h5 className="card-title mt-1">{course.desc}</h5>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                    <small className="text-muted">
                      <i className="bi bi-clock me-1"></i>{course.duration}
                    </small>
                    <button className="btn btn-primary btn-sm d-flex align-items-center justify-content-center">
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
