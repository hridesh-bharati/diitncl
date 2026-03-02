import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiClock, FiLayers, FiChevronRight, FiCheckCircle, FiPlus, FiMinus } from "react-icons/fi";
import CourseNav from "./CourseNav";
import { staticCourses } from "./courseData";

// Static Themes: Outside component to save memory
const THEMES = {
  computer: "#1A237E", diploma: "#2E7D32", web: "#1565C0",
  programming: "#00695C", nielit: "#D84315", design: "#6A1B9A", default: "#4F46E5",
};

const CourseCard = React.memo(({ course, themeColor }) => {
  const [showAll, setShowAll] = useState(false);
  const subjects = showAll ? course.subjects : course.subjects.slice(0, 8);

  return (
    <div className="col-12 col-md-6 mb-4">
      <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden shadow-hover">
        {/* Header */}
        <div className="p-4 text-white" style={{ background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 100%)` }}>
          <div className="d-flex justify-content-between align-items-start">
            <div className="d-flex align-items-center">
              <div className="bg-white bg-opacity-25 rounded-3 p-2 d-flex shadow-sm"><FiLayers size={28} /></div>
              <h4 className="ms-3 mb-0 fw-bold fs-pc-name">{course.name}</h4>
            </div>
            <div className="bg-white text-dark px-3 py-1 rounded-pill fw-bold small shadow-sm fs-pc-duration">
              <FiClock className="me-1" /> {course.duration} Mo
            </div>
          </div>
          <p className="mt-3 mb-0 opacity-90 fw-medium fs-pc-desc min-h-3">{course.description}</p>
        </div>

        {/* Body */}
        <div className="card-body p-4 d-flex flex-column">
          <h6 className="text-uppercase text-muted fw-bold mb-3 small tracking-wider">
            Modules ({course.subjects.length})
          </h6>
          
          <div className="row row-cols-2 g-2 mb-3">
            {subjects.map((sub) => (
              <div key={sub.id} className="col">
                <div className="subject-tag d-flex align-items-center h-100 bg-light rounded-3 p-2 border border-white shadow-sm">
                  <FiCheckCircle className="text-success me-2 flex-shrink-0" size={14} />
                  <span className="text-dark fw-medium text-truncate small">{sub.name}</span>
                </div>
              </div>
            ))}
          </div>

          {course.subjects.length > 8 && (
            <button onClick={() => setShowAll(!showAll)} className="btn btn-sm text-primary fw-bold p-0 mb-4 border-0 bg-transparent d-flex align-items-center">
              {showAll ? <><FiMinus className="me-1"/> Less</> : <><FiPlus className="me-1"/> View All</>}
            </button>
          )}

          <Link to="/new-admission" className="btn w-100 rounded-3 py-3 fw-bold d-flex align-items-center justify-content-between text-white border-0 shadow-sm jio-btn-hover mt-auto" style={{ backgroundColor: themeColor }}>
            <span className="ps-2 fs-pc-btn">Enroll Now</span>
            <div className="bg-black bg-opacity-10 rounded-circle p-1 d-flex"><FiChevronRight size={22} /></div>
          </Link>
        </div>
      </div>
    </div>
  );
});

function CommanCourse({ targetCourses, CTitle }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const isAll = targetCourses.includes("All");

    return staticCourses.filter(c => {
      const name = c.name.toLowerCase();
      const matchesTarget = isAll || targetCourses.some(tc => tc.toLowerCase() === name);
      const matchesSearch = !q || name.includes(q) || c.subjects.some(s => s.name.toLowerCase().includes(q));
      return matchesTarget && matchesSearch;
    });
  }, [searchQuery, targetCourses]);

  return (
    <div className="min-vh-100 py-4 bg-light">
      <div className="container-xxl">
        <div className="bg-white p-3 mb-5 shadow-sm rounded-3 border" style={{ top: '1rem', zIndex: 1 }}>
          <CourseNav data={CTitle} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <div className="row g-4 justify-content-center">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(c => (
              <CourseCard key={c.id} course={c} themeColor={THEMES[c.category?.toLowerCase()] || THEMES.default} />
            ))
          ) : (
            <div className="col-12 text-center py-5"><h3 className="text-muted">No courses found</h3></div>
          )}
        </div>
      </div>

      <style>{`
        .shadow-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .shadow-hover:hover { transform: translateY(-7px); box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; }
        .subject-tag:hover { background: #fff !important; transform: scale(1.02); }
        .jio-btn-hover:hover { filter: brightness(1.1); letter-spacing: 0.5px; }
        .jio-btn-hover:active { transform: scale(0.98); }
        .min-h-3 { min-height: 3.2rem; }
        .tracking-wider { letter-spacing: 1px; }
        @media (min-width: 992px) {
          .fs-pc-name { font-size: 1.6rem !important; }
          .fs-pc-duration { font-size: 0.85rem !important; }
          .fs-pc-desc { font-size: 0.9rem !important; }
          .fs-pc-btn { font-size: 1.05rem !important; }
        }
      `}</style>
    </div>
  );
}

export default CommanCourse;