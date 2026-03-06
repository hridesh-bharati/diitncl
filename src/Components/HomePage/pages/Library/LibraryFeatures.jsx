import React from 'react';
import { Link } from 'react-router-dom';

const facilities = [
  { title: 'Meeting Rooms', img: 'images/vender/meeting-room.webp', icon: 'bi-people' },
  { title: 'Reading Hall', img: 'images/vender/reading-hall.webp', icon: 'bi-book' },
  { title: 'Cafeteria', img: 'images/vender/cefeteria.webp', icon: 'bi-cup-hot' },
  { title: 'Digital Library', img: 'images/vender/onlineclass.webp', icon: 'bi-laptop' },
];

const amenities = [
  'High-speed Wi-Fi', 'Full AC', 'CCTV Security', 'Power Backup',
  'Ergonomic Chairs', 'Relaxation Zone', 'Secure Lockers', 'RO Water'
];

const FacilityCard = ({ title, img, icon }) => (
  <div className="col-6 col-lg-3">
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
      <img src={img} className="card-img-top" alt={title} style={{ height: '120px', objectFit: 'cover' }} />
      <div className="card-body p-2 p-md-3 text-center">
        <div className="d-flex align-items-center justify-content-center mb-2">
          <i className={`bi ${icon} text-primary me-2 d-none d-sm-inline`}></i>
          <h6 className="fw-bold mb-0 small text-truncate">{title}</h6>
        </div>
        <Link to="#!" className="btn btn-outline-primary btn-sm w-100 rounded-pill py-0" style={{ fontSize: '0.7rem' }}>View</Link>
      </div>
    </div>
  </div>
);

const LibraryFeatures = () => {
  return (
    <div className="bg-light pb-5">
      {/* HEADER SECTION */}
      <div className="bg-primary text-white py-5 px-4 shadow-sm">
        <div className="container text-center text-md-start">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2 className="fw-bold mb-1 display-6">Drishtee Hub</h2>
              <p className="opacity-75 mb-0">Premium study space for excellence.</p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <Link to="/Contact-us" className="btn btn-outline-light rounded-pill px-4 btn-sm">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-25px' }}>
        {/* FACILITIES GRID */}
        <div className="row g-2 g-md-3">
          {facilities.map((f, i) => <FacilityCard key={i} {...f} />)}
        </div>

        {/* AMENITIES SECTION */}
        <div className="row align-items-center mt-5 g-4">
          <div className="col-lg-6 d-none d-lg-block">
            <img src="images/vender/librarypic2.jpg" className="img-fluid rounded-5 shadow-lg" alt="Interior" />
          </div>

          <div className="col-lg-6">
            <div className="bg-white rounded-5 shadow-sm p-4">
              <h4 className="fw-bold text-dark mb-4 border-start border-4 border-primary ps-3">Premium Amenities</h4>
              <div className="row">
                {amenities.map((item, index) => (
                  <div key={index} className="col-6 mb-2">
                    <div className="d-flex align-items-center small fw-semibold text-secondary">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      {item}
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary w-100 mt-4 py-2 rounded-pill fw-bold shadow">
                Get Membership
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryFeatures;