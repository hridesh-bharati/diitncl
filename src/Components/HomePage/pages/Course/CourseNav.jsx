import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiSearch, FiChevronRight } from "react-icons/fi";

/* 🔍 Paytm Style SearchBox */
const SearchBox = ({ searchQuery, setSearchQuery }) => (
  <div className="search-wrapper w-100">
    <div className="paytm-search d-flex align-items-center gap-2 px-3 py-2 shadow-sm">
      <FiSearch className="text-secondary" size={18} />
      <input
        type="text"
        className="form-control border-0 p-0 bg-transparent"
        placeholder="Search for courses, subjects..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  </div>
);

/* 📚 Paytm Style CourseNav */
const CourseNav = ({ data, searchQuery, setSearchQuery }) => {
  return (
    <div className="paytm-nav-card container-fluid mb-4">
      <div className="row align-items-center g-3">
        {/* Left: Branding & Breadcrumbs */}
        <div className="col-12 col-md-6">
          <div className="breadcrumb-paytm mb-1">
            <Link to="/" className="paytm-home">
              <FiHome /> Home
            </Link>
            <FiChevronRight size={12} className="mx-1" />
            <span>{data} Courses</span>
          </div>
          
          <h2 className="paytm-heading">
            {data} <span className="text-paytm-blue">List</span>
          </h2>
        </div>

        {/* Right: Modern Search */}
        <div className="col-12 col-md-6 col-lg-4 ms-auto">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>

      <style>{`
        /* ================= PAYTM THEME COLORS ================= */
        :root {
          --paytm-blue: #00BAF2;
          --paytm-dark: #002970;
          --paytm-bg: #F5F7FA;
          --paytm-light-blue: #EBF8FF;
        }

        .paytm-nav-card {
          padding: 1.5rem 2rem;
          background: #ffffff;
          border-radius: 16px;
          border-bottom: 4px solid var(--paytm-blue);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        /* ================= BREADCRUMBS ================= */
        .breadcrumb-paytm {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #8B98A5;
          display: flex;
          align-items: center;
        }

        .paytm-home {
          color: var(--paytm-blue);
          text-decoration: none;
        }

        /* ================= HEADING ================= */
        .paytm-heading {
          font-weight: 800;
          color: var(--paytm-dark);
          margin: 0;
          font-size: 1.75rem;
        }

        .text-paytm-blue {
          color: var(--paytm-blue);
        }

        /* ================= SEARCH BOX (PAYTM STYLE) ================= */
        .paytm-search {
          background: #F0F3F8 !important;
          border-radius: 12px; /* Paytm uses slightly square-rounded corners for inputs */
          border: 1px solid #E8EEF3;
          transition: all 0.3s ease;
        }

        .paytm-search:focus-within {
          background: #ffffff !important;
          border-color: var(--paytm-blue);
          box-shadow: 0 0 0 3px rgba(0, 186, 242, 0.1) !important;
        }

        .paytm-search input {
          box-shadow: none !important;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--paytm-dark);
        }

        .paytm-search input::placeholder {
          color: #A9B6C3;
        }

        /* ================= RESPONSIVE ================= */
        @media (max-width: 768px) {
          .paytm-nav-card {
            padding: 1rem;
            border-radius: 0; /* Mobile view typically goes full width */
          }
          .paytm-heading {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseNav;