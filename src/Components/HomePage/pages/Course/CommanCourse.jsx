import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiClock, FiLayers, FiChevronRight, FiCheckCircle } from "react-icons/fi";
import CourseNav from "./CourseNav";
import { staticCourses } from "./courseData";

const CourseCard = React.memo(({ course, themeColor }) => (
  <div className="col-12 col-md-6 mb-4">
    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden shadow-hover">

      {/* Header */}
      <div
        className="p-4 text-white position-relative"
        style={{ background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 100%)` }}
      >
        <div className="d-flex justify-content-between align-items-center position-relative" style={{ zIndex: 1 }}>
          <div className="d-flex align-items-center">
            <div className="bg-white bg-opacity-25 rounded-3 p-2 d-flex shadow-sm">
              <FiLayers size={28} />
            </div>
            <h4 className="ms-3 mb-0 fw-bold fs-pc-name">{course.name}</h4>
          </div>

          {/* Duration on right */}
          <div className="bg-white text-dark px-3 py-1 rounded-pill fw-bold small shadow-sm flex-shrink-0 fs-pc-duration">
            <FiClock className="me-1 mb-1" /> {course.duration} Months
          </div>
        </div>

        <p className="mt-3 mb-0 opacity-90 fw-medium fs-pc-desc">
          {course.description}
        </p>
      </div>

      {/* Card Body */}
      <div className="card-body p-4 d-flex flex-column">
        <h6 className="text-uppercase text-muted fw-bold mb-3" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
          Course Modules
        </h6>

        {/* Subjects Grid */}
        <div className="row row-cols-2 g-2 mb-4 flex-grow-1">
          {course.subjects.map((sub, i) => (
            <div key={i} className="col">
              <div className="d-flex align-items-center h-100 bg-light rounded-3 p-2 border border-white">
                <FiCheckCircle className="text-primary me-2 flex-shrink-0" size={14} />
                <span className="text-dark fw-medium" style={{ fontSize: "0.75rem", lineHeight: '1.2' }}>
                  {sub.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Enroll Button */}
        <Link
          to="/AdmissionForm"
          className="btn w-100 rounded-3 py-3 fw-bold d-flex align-items-center justify-content-between text-white border-0 shadow-sm transition-all mt-auto jio-btn-hover"
          style={{ backgroundColor: themeColor }}
        >
          <span className="ps-2 fs-pc-btn">Enroll Now</span>
          <div className="bg-black bg-opacity-10 rounded-circle p-1 d-flex">
            <FiChevronRight size={22} />
          </div>
        </Link>
      </div>
    </div>
  </div>
));

function CommanCourse({ targetCourses, CTitle }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const isAll = targetCourses.includes("All");

    return staticCourses.filter((course) => {
      const matchesCategory =
        isAll || targetCourses.some(tc => tc.toLowerCase() === (course.category || "").toLowerCase());
      const matchesSearch =
        !query ||
        course.name.toLowerCase().includes(query) ||
        course.subjects.some((s) => s.name.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, targetCourses]);

  const getThemeColor = useCallback((cat) => {
    const themes = {
      web: "#1565C0",
      programming: "#00897B",
      nielit: "#EF6C00",
      default: "#4F46E5",
    };
    return themes[cat] || themes.default;
  }, []);

  return (
    <div className="min-vh-100 py-4 bg-light">
      <div className="container-xxl">
        <div className="bg-white p-3 mb-5 shadow-sm rounded-3 border" style={{ zIndex: 1020, top: '1rem' }}>
          <CourseNav data={CTitle} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <div className="row g-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              themeColor={getThemeColor(course.category)}
            />
          ))}
        </div>
      </div>

      <style>{`
        .shadow-hover { transition: all 0.3s ease; }
        .shadow-hover:hover { transform: translateY(-7px); box-shadow: 0 1.5rem 4rem rgba(0,0,0,.15) !important; }

        .jio-btn-hover:hover { filter: brightness(1.1); }
        .transition-all:active { transform: scale(0.97); }

        /* Responsive PC Font Sizes */
        @media (min-width: 992px) {
          .fs-pc-name { font-size: 2rem !important; }
          .fs-pc-duration { font-size: 1rem !important; }
          .fs-pc-desc { font-size: 1rem !important; }
          .fs-pc-btn { font-size: 1.25rem !important; }
        }
      `}</style>
    </div>
  );
}

export default CommanCourse;
