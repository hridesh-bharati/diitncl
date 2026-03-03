import React, { memo } from "react";
import { Link } from "react-router-dom";

const CourseNav = ({ data, searchQuery, setSearchQuery }) => {
  return (
    <div className="paytm-nav-card p-3 p-md-4 bg-white rounded-4 border-bottom-blue shadow-sm mb-4 container-fluid">
      <div className="row align-items-center g-3">
        {/* Left: Branding */}
        <div className="col-12 col-md-6">
          <nav className="d-flex align-items-center gap-1 text-uppercase fw-bold text-muted mb-1 small tracking-wider">
            <Link to="/" className="text-decoration-none text-paytm-blue d-flex align-items-center gap-1">
              <i className="bi bi-house-door-fill"></i> Home
            </Link>
            <i className="bi bi-chevron-right" style={{ fontSize: '12px' }}></i>
            <span>{data}</span>
          </nav>
          <h2 className="fw-800 text-paytm-dark m-0 fs-1-5">
            {data} <span className="text-paytm-blue">List</span>
          </h2>
        </div>

        {/* Right: Search */}
        <div className="col-12 col-md-5 col-lg-4 ms-auto">
          <div className="search-box d-flex align-items-center gap-2 px-3 py-2 rounded-3 border bg-light-soft transition-all">
            <i className="bi bi-search text-secondary" style={{ fontSize: '18px' }}></i>
            <input
              type="text"
              className="form-control border-0 p-0 bg-transparent shadow-none small fw-medium text-paytm-dark"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <style>{`
        .text-paytm-blue { color: #00BAF2; }
        .text-paytm-dark { color: #002970; }
        .bg-light-soft { background: #F0F3F8; border-color: #E8EEF3; }
        .border-bottom-blue { border-bottom: 4px solid #00BAF2; }
        .fw-800 { font-weight: 800; }
        .tracking-wider { letter-spacing: 0.5px; font-size: 0.7rem; }
        
        .search-box:focus-within { 
          background: #fff; 
          border-color: #00BAF2; 
          box-shadow: 0 0 0 3px rgba(0, 186, 242, 0.1); 
        }

        @media (min-width: 768px) { .fs-1-5 { font-size: 1.75rem; } }
        @media (max-width: 767px) { 
           .paytm-nav-card { border-radius: 0; margin-left: -12px; margin-right: -12px; }
           .fs-1-5 { font-size: 1.35rem; }
        }
        .transition-all { transition: all 0.2s ease-in-out; }
      `}</style>
    </div>
  );
};

export default memo(CourseNav);