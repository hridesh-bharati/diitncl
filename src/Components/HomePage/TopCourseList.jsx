import React from "react";
import { Link } from "react-router-dom";
import useScrollAnimation from "../../hooks/useScrollAnimation";

const COURSES = [
  { id: 1, title: "Angular JS", src: "images/course/angular-js.webp" },
  { id: 2, title: "Tally Prime", src: "images/course/tally-course.webp" },
  { id: 3, title: "Full Stack Development", src: "images/course/full-stack.webp" },
  { id: 4, title: "Mongo DB", src: "images/course/mongodb.webp" },
  { id: 5, title: "Android Development", src: "images/course/android-dev.webp" },
  { id: 6, title: "React JS Advance", src: "images/course/reactjs.webp" },
  { id: 7, title: "Python Data Science", src: "images/course/python-training.webp" },
  { id: 8, title: "Java Mastery Course", src: "images/course/Java-full-stack.webp" }
];

const CourseCard = ({ course, index }) => {
  const isEager = index < 4; 

  return (
    <div
      className="card h-100 border border-light-subtle rounded-3 bg-white overflow-hidden position-relative fade-up hover-up"
      style={{ 
        transitionDelay: `${index * 50}ms`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
    >
      {/* Top Left Mini Label Tag */}
      <span className="position-absolute top-0 start-0 text-white px-2 py-0.5 m-2 rounded-1 fw-semibold maroonGD" style={{ fontSize: '8px', letterSpacing: '0.5px', zIndex: 2 }}>
        DRISHTEE
      </span>

      {/* Course Image Wrapper (Meesho Zoom Effect applied here) */}
      <div className="ratio ratio-16x9 bg-body-tertiary p-2 overflow-hidden">
        <img
          src={course.src}
          alt={course.title}
          className="card-img-top img-fluid w-100 h-100 object-fit-contain img-zoom-effect"
          loading={isEager ? "eager" : "lazy"}
          decoding="async"
          style={{
            transition: 'transform 0.4s ease'
          }}
        />
      </div>

      {/* Course Content Body */}
      <div className="card-body d-flex flex-column justify-content-between p-3">
        <div>
          <h6 className="text-dark text-start mb-2 fw-bold text-truncate" style={{ fontSize: '14px' }} title={course.title}>
            {course.title}
          </h6>

          <div className="d-flex align-items-center gap-1 mb-3">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle fw-semibold" style={{ fontSize: '10px', padding: '3px 7px' }}>
              Job Oriented
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to="/courses"
          className="btn w-100 rounded-2 fw-bold py-2 border-0 text-center btn-sm blueGD text-white shadow-sm"
          style={{ fontSize: '13px' }}
        >
          View Syllabus
        </Link>
      </div>
    </div>
  );
};

export default function TopCourseList() {
  useScrollAnimation();

  return (
    <section className="py-4 bg-white">
      <div className="container-fluid px-3">

        {/* Header Layout */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bolder text-dark mb-0 fs-5 text-uppercase">
              Top Programs
            </h2>
            <div className="maroonGD rounded-pill" style={{ height: '3px', width: '45px', marginTop: '6px' }}></div>
          </div>
          <Link
            to="/courses"
            className="text-decoration-none fw-bold text-maroon"
            style={{ fontSize: '13px' }}
          >
            See All &gt;
          </Link>
        </div>

        {/* Responsive 2-Column Grid */}
        <div className="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4">
          {COURSES.map((course, index) => (
            <div key={course.id} className="col">
              <CourseCard course={course} index={index} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}