import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const testimonials = [
  {
    name: "Rohit Sharma",
    img: "images/testimonial/testimonial1.jpg",
    text: "Drishtee Computer Center transformed my understanding of technology—top-notch training.",
    rating: 5
  },
  {
    name: "Abhay Gautam",
    img: "images/testimonial/testimonial2.jpg",
    text: "The expert guidance and practical approach here gave me the confidence to tackle problems.",
    rating: 5
  },
  {
    name: "The Jugnoo",
    img: "images/testimonial/testimonial3.png",
    text: "I appreciated the personalized coaching. Drishtee truly prepares you for the real world.",
    rating: 4
  },
  {
    name: "Aditi Verma",
    img: "http://themes.audemedia.com/html/goodgrowth/images/testimonial4.jpg",
    text: "From basic skills to advanced concepts, the team helped me grow exponentially.",
    rating: 5
  }
];

const getSlidesToShow = () => {
  if (window.innerWidth < 768) return 1;
  return 3;
};

const Testimonials = () => {
  const [centerIdx, setCenterIdx] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());
  const intervalRef = useRef();

  useEffect(() => {
    const handleResize = () => setSlidesToShow(getSlidesToShow());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCenterIdx((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [centerIdx]);

  const getVisibleSlides = () => {
    if (slidesToShow === 1) return [testimonials[centerIdx]];
    const prev = (centerIdx - 1 + testimonials.length) % testimonials.length;
    const next = (centerIdx + 1) % testimonials.length;
    return [testimonials[prev], testimonials[centerIdx], testimonials[next]];
  };

  return (
    <section className="app-testimonial-section py-5">
      <div className="container">
        {/* App Style Header */}
        <div className="text-center mb-5">
          <span className="badge rounded-pill bg-primary-soft text-primary px-3 py-2 mb-2">Student Reviews</span>
          <h2 className="fw-extrabold text-dark">What Our Students Say</h2>
        </div>

        <div className="testimonial-wrapper position-relative">
          <div className="d-flex justify-content-center align-items-center gap-3">
            {getVisibleSlides().map((item, idx) => {
              const isCenter = slidesToShow === 1 ? true : idx === 1;
              return (
                <div 
                  key={item.name + idx} 
                  className={`app-testi-card shadow-sm ${isCenter ? 'center-card' : 'side-card d-none d-md-block'}`}
                >
                  <div className="quote-icon"><i className="bi bi-quote"></i></div>
                  
                  <div className="rating mb-2">
                    {[...Array(item.rating)].map((_, i) => <i key={i} className="bi bi-star-fill text-warning me-1 small"></i>)}
                  </div>

                  <p className="testi-text mb-4">"{item.text}"</p>

                  <div className="d-flex align-items-center mt-auto border-top pt-3">
                    <img src={item.img} alt={item.name} className="user-avatar shadow-sm" />
                    <div className="ms-3 text-start">
                      <h6 className="mb-0 fw-bold text-dark">{item.name} <i className="bi bi-patch-check-fill text-primary ms-1 small"></i></h6>
                      <small className="text-muted x-small">Verified Student</small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Dots */}
        <div className="d-flex justify-content-center mt-5 gap-2">
          {testimonials.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCenterIdx(idx)}
              className={`dot ${centerIdx === idx ? 'active' : ''}`}
            ></div>
          ))}
        </div>
      </div>

      <style>{`
        .app-testimonial-section { background: #f8fafc; overflow: hidden; }
        .bg-primary-soft { background: #e0e7ff; font-size: 0.75rem; font-weight: 800; }
        .fw-extrabold { font-weight: 800; letter-spacing: -1px; }

        .app-testi-card {
            background: white;
            border-radius: 28px;
            padding: 30px;
            width: 100%;
            max-width: 400px;
            position: relative;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(0,0,0,0.03);
        }

        .side-card { transform: scale(0.85); opacity: 0.4; filter: blur(1px); }
        .center-card { transform: scale(1); opacity: 1; z-index: 10; border: 1px solid #e2e8f0; }

        .quote-icon {
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 2rem;
            color: #f1f5f9;
            z-index: 0;
        }

        .testi-text {
            font-size: 0.95rem;
            color: #475569;
            line-height: 1.6;
            font-style: italic;
            position: relative;
            z-index: 1;
        }

        .user-avatar { width: 50px; height: 50px; border-radius: 15px; object-fit: cover; }
        .x-small { font-size: 0.7rem; font-weight: 600; }

        .dot {
            width: 8px; height: 8px; background: #cbd5e1;
            border-radius: 50px; cursor: pointer; transition: 0.3s;
        }
        .dot.active { width: 25px; background: #0a2885; }

        @media (max-width: 768px) {
            .app-testi-card { padding: 20px; max-width: 90%; margin: 0 auto; }
            .testi-text { font-size: 0.85rem; }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;