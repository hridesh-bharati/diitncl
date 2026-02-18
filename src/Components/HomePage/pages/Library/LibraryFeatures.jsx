import React, { useEffect } from 'react';
import { Link, Links } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const facilities = [
  { title: 'Meeting Rooms', img: 'images/vender/meeting-room.jpg', description: 'Private spaces for discussions.', icon: 'fas fa-users' },
  { title: 'Reading Hall', img: 'images/vender/reading-hall.jpg', description: 'Quiet zone for deep focus.', icon: 'fas fa-book-open' },
  { title: 'Cafeteria', img: 'images/vender/cefeteria.jpg', description: 'Fresh meals to recharge.', icon: 'fas fa-coffee' },
  { title: 'Digital Library', img: 'images/vender/onlineclass.jpg', description: 'Access e-books and lectures.', icon: 'fas fa-laptop' },
];

const amenities = [
  'High-speed Wi-Fi', 'Full AC', 'CCTV Security', 'Power Backup',
  'Ergonomic Chairs', 'Relaxation Zone', 'Secure Lockers', 'RO Water',
  'Pantry Access', 'Clean Washrooms'
];

const FacilityCard = ({ title, img, description, icon, index }) => (
  // Mobile: 6 (2 per row), Tablet/PC: 3 (4 per row)
  <div className="col-6 col-lg-3 mb-3" data-aos="fade-up" data-aos-delay={index * 50}>
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 transition-hover">
      <img src={img} className="card-img-top" alt={title} style={{ height: '140px', objectFit: 'cover' }} />
      <div className="card-body p-3 text-center text-lg-start">
        <div className="d-flex align-items-center justify-content-center justify-content-lg-start mb-2">
          <i className={`${icon} text-primary me-2 d-none d-sm-inline`}></i>
          <h6 className="fw-bold mb-0 text-truncate">{title}</h6>
        </div>
        <p className="text-muted mb-3 d-none d-md-block" style={{ fontSize: '0.8rem' }}>{description}</p>
        <Link to="#!" className="btn btn-outline-primary btn-sm w-100 rounded-pill border-1 py-1" style={{ fontSize: '0.75rem' }}>View</Link>
      </div>
    </div>
  </div>
);

const LibraryFeatures = () => {
  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  return (
    <div className="bg-light min-vh-100">
      {/* Header: PC par center align, Mobile par left */}
      <div className="bg-primary text-white pt-4 pb-5 px-4 rounded-bottom-lg-0 shadow-sm mt-3">
        <div className="container text-center text-lg-start py-lg-4">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="fw-bold mb-1 display-5" style={{ letterSpacing: '-1px' }}>Drishtee Hub</h1>
              <p className="lead mb-0 opacity-75">Your premium modern study space for excellence.</p>
            </div>
            <div className="col-lg-4 text-lg-end text-center">
              <Link to="/Contact-us">
                <button className="btn btn-outline-light rounded-pill px-4">Contact Us</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-30px' }}>
        {/* Facilities Grid */}
        <div className="row g-3 px-1">
          {facilities.map((f, i) => <FacilityCard key={i} {...f} index={i} />)}
        </div>

        {/* Library Banner Section: PC par side-by-side, Mobile par stacked */}
        <div className="row align-items-center my-5 g-4">
          <div className="col-lg-6" data-aos="fade-right">
            <div className="rounded-5 overflow-hidden shadow-lg border-4 border-white" style={{ height: '350px' }}>
              <img
                src="images/vender/librarypic2.jpg"
                className="w-100 h-100"
                alt="Library Interior"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          <div className="col-lg-6" data-aos="fade-left">
            <div className="bg-white rounded-5 shadow-sm p-4 p-lg-5">
              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary rounded-pill me-3" style={{ width: '6px', height: '30px' }}></div>
                <h3 className="fw-bold mb-0 text-dark">Premium Amenities</h3>
              </div>
              <div className="row">
                {amenities.map((item, index) => (
                  <div key={index} className="col-6 mb-3">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      <span className="fw-medium text-secondary" style={{ fontSize: '0.95rem' }}>{item}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="#!" className="btn btn-primary w-100 mt-4 py-3 rounded-4 fw-bold shadow">
                Get Membership Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Padding for bottom button on mobile */}
      <div className="py-5 d-lg-none"></div>
    </div>
  );
};

export default LibraryFeatures;