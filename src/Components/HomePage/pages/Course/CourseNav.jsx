import React, { memo } from "react";
import { Link } from "react-router-dom";

const CourseNav = ({ data, searchQuery, setSearchQuery }) => {
  return (
    <div className="p-3 p-md-4 bg-white rounded-4 border-bottom border-primary border-4 shadow-sm mb-4 container-fluid">
      <div className="row align-items-center g-3">
        
        {/* Left: Branding & Breadcrumb */}
        <div className="col-12 col-md-6">
          <nav className="d-flex align-items-center gap-1 text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
            <Link to="/" className="text-decoration-none text-info d-flex align-items-center gap-1">
              <i className="bi bi-house-door-fill"></i> Home
            </Link>
            <i className="bi bi-chevron-right" style={{ fontSize: '10px' }}></i>
            <span>{data}</span>
          </nav>
          <h2 className="fw-bolder text-dark m-0 h3">
            {data} <span className="text-info">List</span>
          </h2>
        </div>

        {/* Right: Search Box */}
        <div className="col-12 col-md-5 col-lg-4 ms-auto">
          <div className="input-group bg-light rounded-3 border">
            <span className="input-group-text border-0 bg-transparent ps-3">
              <i className="bi bi-search text-secondary"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 bg-transparent shadow-none py-2 fw-medium"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default memo(CourseNav);