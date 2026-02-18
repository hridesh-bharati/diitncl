import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiClock, FiLayers, FiChevronRight, FiCheckCircle, FiPlus, FiMinus } from "react-icons/fi";
import CourseNav from "./CourseNav";
import { staticCourses } from "./courseData";

const CourseCard = React.memo(({ course, themeColor }) => {
  const [showAll, setShowAll] = useState(false);
  
  // Only show first 8 subjects initially to keep cards clean
  const displayedSubjects = showAll ? course.subjects : course.subjects.slice(0, 8);

  return (
    <div className="col-12 col-md-6 mb-4">
      <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden shadow-hover">
        
        {/* Header Section */}
        <div
          className="p-4 text-white position-relative"
          style={{ background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 100%)` }}
        >
          <div className="d-flex justify-content-between align-items-start" style={{ zIndex: 1 }}>
            <div className="d-flex align-items-center">
              <div className="bg-white bg-opacity-25 rounded-3 p-2 d-flex shadow-sm">
                <FiLayers size={28} />
              </div>
              <h4 className="ms-3 mb-0 fw-bold fs-pc-name">{course.name}</h4>
            </div>
            <div className="bg-white text-dark px-3 py-1 rounded-pill fw-bold small shadow-sm fs-pc-duration">
              <FiClock className="me-1" /> {course.duration} Months
            </div>
          </div>
          <p className="mt-3 mb-0 opacity-90 fw-medium fs-pc-desc" style={{ minHeight: '3em' }}>
            {course.description}
          </p>
        </div>

        {/* Card Body */}
        <div className="card-body p-4 d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="text-uppercase text-muted fw-bold mb-0" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
              Course Modules ({course.subjects.length})
            </h6>
          </div>

          {/* Subjects Grid */}
          <div className="row row-cols-2 g-2 mb-3">
            {displayedSubjects.map((sub) => (
              <div key={sub.id} className="col">
                <div className="subject-tag d-flex align-items-center h-100 bg-light rounded-3 p-2 border border-white shadow-sm">
                  <FiCheckCircle className="text-success me-2 flex-shrink-0" size={14} />
                  <span className="text-dark fw-medium text-truncate" style={{ fontSize: "0.75rem" }}>
                    {sub.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Show More/Less Toggle */}
          {course.subjects.length > 8 && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="btn btn-sm text-primary fw-bold p-0 mb-4 d-flex align-items-center border-0 bg-transparent"
            >
              {showAll ? <><FiMinus className="me-1"/> Show Less</> : <><FiPlus className="me-1"/> View All Modules</>}
            </button>
          )}

          {/* Enroll Button */}
          <Link
            to="/new-admission"
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
  );
});

function CommanCourse({ targetCourses, CTitle }) {
  const [searchQuery, setSearchQuery] = useState("");

const filteredCourses = useMemo(() => {
  const query = searchQuery.trim().toLowerCase();
  const isAll = targetCourses.includes("All");

  return staticCourses.filter(course => {
    const courseName = course.name.toLowerCase();

    // ✅ ONLY course name based filtering
    const matchesTarget =
      isAll ||
      targetCourses.some(tc => tc.toLowerCase() === courseName);

    const matchesSearch =
      !query ||
      courseName.includes(query) ||
      course.subjects.some(s =>
        s.name.toLowerCase().includes(query)
      );

    return matchesTarget && matchesSearch;
  });
}, [searchQuery, targetCourses]);

  const getThemeColor = useCallback((cat) => {
    const themes = {
      computer: "#1A237E",    // Deep Indigo
      diploma: "#2E7D32",     // Dark Green
      web: "#1565C0",         // Blue
      programming: "#00695C", // Teal
      nielit: "#D84315",      // Deep Orange
      design: "#6A1B9A",      // Purple
      default: "#4F46E5",
    };
    return themes[cat?.toLowerCase()] || themes.default;
  }, []);

  return (
    <div className="min-vh-100 py-4 bg-light">
      <div className="container-xxl">
        <div className="bg-white p-3 mb-5 shadow-sm rounded-3 border" style={{ zIndex: 1020, top: '1rem' }}>
          <CourseNav data={CTitle} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <div className="row g-4 justify-content-center">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                themeColor={getThemeColor(course.category)}
              />
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <h3 className="text-muted">No courses found matching "{searchQuery}"</h3>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .shadow-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .shadow-hover:hover { transform: translateY(-7px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important; }

        .subject-tag { transition: transform 0.2s; }
        .subject-tag:hover { transform: scale(1.02); background-color: #fff !important; }

        .jio-btn-hover:hover { filter: contrast(1.2); letter-spacing: 0.5px; }
        .transition-all:active { transform: scale(0.97); }

        /* Responsive PC Font Sizes */
        @media (min-width: 992px) {
          .fs-pc-name { font-size: 1.75rem !important; }
          .fs-pc-duration { font-size: 0.9rem !important; }
          .fs-pc-desc { font-size: 0.95rem !important; }
          .fs-pc-btn { font-size: 1.1rem !important; }
        }
      `}</style>
    </div>
  );
}

export default CommanCourse;