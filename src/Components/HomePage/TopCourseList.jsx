import React from "react";
import { Link } from "react-router-dom";

const courses = [
  { id: 1, title: "Angular JS", src: "images/course/angular-js.webp" },
  { id: 2, title: "Tally Prime", src: "images/course/tally-course.webp" },
  { id: 3, title: "Full Stack Development", src: "images/course/full-stack.webp" },
  { id: 4, title: "Mongo DB", src: "images/course/mongodb.webp" },
  { id: 5, title: "Android Development", src: "images/course/android-dev.webp" },
  { id: 6, title: "React JS Advance", src: "images/course/reactjs.webp" },
  { id: 7, title: "Python Data Science", src: "images/course/python-training.webp" },
  { id: 8, title: "Java Mastery Course", src: "images/course/Java-full-stack.webp" }
];

const CourseCard = ({ course }) => (
  <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative">
    <div className="ratio ratio-16x9 bg-white p-3">
      <img
        src={course.src}
        alt={course.title}
        className="card-img-top img-fluid w-100 h-100"/>
    </div>

    <div className="card-body d-flex flex-column text-center p-3 bg-white">
      <h6 className="fw-bold text-dark px-2" style={{ minHeight: '40px' }}>
        {course.title}
      </h6>

      <Link
        to="/courses"
        className="btn border-0 rounded-pill fw-bold text-white py-2 shadow-sm blueGD"
      >
        Enroll Now
      </Link>
    </div>

    <div className="position-absolute bottom-0 end-0 bg-dark text-white px-2 py-1"
      style={{ fontSize: '9px', borderRadius: '15px 0 0 0' }}>
      DRISHTEE
    </div>
  </div>
);

export default function TopCourseList() {
  return (
    <section className="pt-5 bg-primary-subtle ">
      <div className="container-fluid">

        <div className="mb-4 px-3 py-2 bg-white rounded-3">
          {/* Row 1: Title and Button */}
          <div className="d-flex justify-content-between align-items-center mb-1">
            <div className="d-flex align-items-center gap-2">
              {/* Premium Icon */}
              <div className="text-primary">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="me-2"
                >
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="fw-bolder text-dark mb-0" style={{ fontSize: '1.1rem' }}>
                Top Programs
              </h3>
            </div>

            <Link to="/courses" className="btn btn-outline-primary rounded-pill px-3 py-1 btn-sm fw-bold border-2" style={{ fontSize: '11px' }}>
              View All
            </Link>
          </div>

          {/* Row 2: Subtitle */}
          <p className="text-muted small mb-0 fw-medium" style={{ fontSize: '0.75rem', paddingLeft: '30px' }}>
            Official Certification Courses
          </p>
        </div>

        <div className="row g-4">
          {courses.map(course => (
            <div key={course.id} className="col-12 col-sm-6 col-lg-3">
              <CourseCard course={course} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}