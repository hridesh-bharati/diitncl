import React, { useEffect, useState } from "react";

const testimonials = [
  { name: "Rohit Kumar", img: "images/testimonial/testimonial1.avif", text: "Drishtee Computer Center transformed my understanding of technology.", rating: 5 },
  { name: "Abhay Gautam", img: "images/testimonial/testimonial2.avif", text: "The expert guidance and practical approach gave me confidence.", rating: 5 },
  { name: "The Jugnoo", img: "images/testimonial/testimonial3.avif", text: "I appreciated the personalized coaching. Truly prepares you.", rating: 4 },
  { name: "Aditi Verma", img: "images/testimonial/testimonial4.avif", text: "The team helped me grow exponentially from basic to advanced.", rating: 5 }
];

const Testimonials = () => {
  const [idx, setIdx] = useState(0);
  const T_LEN = testimonials.length;

  useEffect(() => {
    const timer = setInterval(() => setIdx(p => (p + 1) % T_LEN), 4000);
    return () => clearInterval(timer);
  }, [T_LEN]);

  return (
    <section className="py-5 overflow-hidden">
      <div className="container text-center">
        <h2 className="fw-bold h3 mb-4">What Students <span className="text-primary">Say</span></h2>

        <div className="slider-container position-relative mx-auto">
          {testimonials.map((item, i) => {
            const pos = i === idx ? "active-card shadow-lg" :
              i === (idx + 1) % T_LEN ? "next-card opacity-50" :
                i === (idx - 1 + T_LEN) % T_LEN ? "prev-card opacity-50" : "hidden-card";
            return (
              <div key={i} className={`testi-card rounded-4 p-4 bg-white border ${pos}`}>
                <div className="text-warning mb-2 small">
                  {[...Array(5)].map((_, s) => <i key={s} className={`bi bi-star${s < item.rating ? '-fill' : ''} mx-1`}></i>)}
                </div>
                <p className="text-muted small italic mb-4">"{item.text}"</p>
                <div className="d-flex align-items-center border-top pt-3">
                  <img src={item.img} alt={item.name} className="rounded-circle border" style={{ width: 45, height: 45, objectFit: "cover" }} />
                  <div className="ms-3 text-start">
                   <h3 className="mb-0 fw-bold h6">{item.name}</h3>
                    <small className="text-primary fw-bold" style={{ fontSize: 10 }}>Verified Student</small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- Updated Pagination Dots --- */}
        <div className="d-flex justify-content-center gap-1 mt-4">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`dot-btn ${idx === i ? 'active' : ''}`}
              aria-label={`Go to slide ${i + 1}`} 
            />
          ))}
        </div>
      </div>

      <style>{`
        .slider-container { height: 280px; max-width: 400px; display: flex; align-items: center; justify-content: center; }
        .testi-card { position: absolute; width: 100%; transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1); opacity: 0; z-index: 1; }
        .active-card { transform: translateX(0) scale(1); opacity: 1; z-index: 3; }
        .next-card { transform: translateX(45%) scale(0.8); z-index: 1; filter: blur(1px); pointer-events: none; }
        .prev-card { transform: translateX(-45%) scale(0.8); z-index: 1; filter: blur(1px); pointer-events: none; }
        .hidden-card { transform: scale(0.5); opacity: 0; }
        
        /* --- Fixed CSS Rules --- */
        .dot-btn { 
          width: 12px;
          height: 6px;
          background: #cbd5e1;
          border: none;
          border-radius: 10px;
          transition: all 0.4s ease;
          cursor: pointer;
          padding: 0;
          margin: 0 4px;
        }

        .dot-btn.active { 
          width: 32px;
          background: #00008b; /* Dark Blue */
        }

        .dot-btn:hover:not(.active) {
          background-color: #94a3b8;
        }

        .italic { font-style: italic; }
        @media (max-width: 768px) { 
          .next-card, .prev-card { display: none; } 
          .slider-container { max-width: 320px; } 
        }
      `}</style>
    </section>
  );
};

export default Testimonials;