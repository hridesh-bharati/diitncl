import React, { useState, useEffect } from "react";

const testimonials = [
  { id: 1, name: "Rohit Kumar", img: "images/testimonial/testimonial1.avif", text: "Drishtee Computer Center transformed my understanding of technology.", rating: 5, role: "Software Engineer" },
  { id: 2, name: "Abhay Gautam", img: "images/testimonial/testimonial2.avif", text: "The expert guidance and practical approach gave me confidence.", rating: 5, role: "Web Developer" },
  { id: 3, name: "The Jugnoo", img: "images/testimonial/testimonial3.avif", text: "I appreciated the personalized coaching. Truly prepares you.", rating: 4, role: "UI/UX Designer" },
  { id: 4, name: "Aditi Verma", img: "images/testimonial/testimonial4.avif", text: "The team helped me grow exponentially from basic to advanced.", rating: 5, role: "Data Analyst" },
  { id: 5, name: "Priya Sharma", img: "images/testimonial/testimonial5.avif", text: "Best decision I ever made for my career.", rating: 5, role: "Full Stack Developer" },
  { id: 6, name: "Rahul Mehta", img: "images/testimonial/testimonial6.avif", text: "Practical training made all the difference.", rating: 5, role: "DevOps Engineer" },
  { id: 7, name: "Neha Gupta", img: "images/testimonial/testimonial7.avif", text: "Supportive environment. Highly recommended!", rating: 4, role: "Product Manager" },
  { id: 8, name: "Vikram Singh", img: "images/testimonial/testimonial8.avif", text: "From zero to hero in web development.", rating: 5, role: "Frontend Developer" }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(window.innerWidth < 768 ? 1 : 2);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (testimonials.length - cardsPerView + 1));
    }, 4000);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(timer);
    };
  }, [cardsPerView]);

  const visibleCards = testimonials.slice(currentIndex, currentIndex + cardsPerView);

  return (
    <section className="py-5" style={{ backgroundColor: '#fff5f5' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge px-4 py-2 mb-3 rounded-0" style={{ 
            backgroundColor: '#800020', 
            color: 'white'
          }}>
            Testimonials
          </span>
          <h2 className="display-5 fw-bold mb-3">
            What Students <span style={{ color: '#800020' }}>Say About Us</span>
          </h2>
          <p className="text-muted">Real stories from 5000+ successful students</p>
        </div>

        {/* Cards Container */}
        <div className="row g-4 justify-content-center">
          {visibleCards.map((item) => (
            <div key={item.id} className="col-md-6">
              <div className="card h-100 border-0 shadow-sm animate-slide" style={{
                borderTop: `4px solid #800020`,
                borderRadius: '0'
              }}>
                <div className="card-body p-4">
                  <div className="mb-3">
                    {[...Array(5)].map((_, s) => (
                      <i key={s} className={`bi bi-star${s < item.rating ? '-fill' : ''}`} 
                        style={{ color: '#800020', fontSize: '18px' }}></i>
                    ))}
                  </div>
                  
                  <p className="mb-4 text-secondary fst-italic" style={{ fontSize: '0.95rem', minHeight: '80px' }}>
                    "{item.text}"
                  </p>
                  
                  <div className="d-flex align-items-center">
                    <img src={item.img} alt={item.name} 
                      className="rounded-circle" 
                      style={{ width: '50px', height: '50px', objectFit: 'cover', border: `2px solid #800020`, padding: '2px' }} />
                    <div className="ms-3">
                      <h6 className="mb-0 fw-bold" style={{ color: '#800020' }}>{item.name}</h6>
                      <small className="text-muted">{item.role}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="text-center mt-5">
          <button 
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="btn me-3"
            style={{
              backgroundColor: '#800020',
              color: 'white',
              borderRadius: 0,
              padding: '8px 20px',
              opacity: currentIndex === 0 ? 0.5 : 1
            }}
          >
            Previous
          </button>
          
          <button 
            onClick={() => setCurrentIndex(prev => Math.min(testimonials.length - cardsPerView, prev + 1))}
            disabled={currentIndex === testimonials.length - cardsPerView}
            className="btn"
            style={{
              backgroundColor: '#800020',
              color: 'white',
              borderRadius: 0,
              padding: '8px 20px',
              opacity: currentIndex === testimonials.length - cardsPerView ? 0.5 : 1
            }}
          >
            Next
          </button>
        </div>

        {/* Dots */}
        <div className="text-center mt-4">
          {[...Array(testimonials.length - cardsPerView + 1)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className="border-0 mx-1"
              style={{
                width: currentIndex === idx ? '30px' : '8px',
                height: '4px',
                backgroundColor: '#800020',
                opacity: currentIndex === idx ? 1 : 0.3,
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        .animate-slide {
          animation: slideIn 0.5s ease;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .card {
          transition: transform 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(128, 0, 32, 0.15) !important;
        }
        
        @media (max-width: 768px) {
          .display-5 {
            font-size: 1.8rem !important;
          }
          
          .card-body {
            padding: 1.25rem !important;
          }
          
          p.mb-4 {
            font-size: 0.85rem !important;
            min-height: auto !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;