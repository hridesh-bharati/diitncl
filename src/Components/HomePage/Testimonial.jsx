import React, { useEffect, useState } from "react";

const testimonials = [
  { name: "Rohit Kumar", img: "images/testimonial/testimonial1.avif", text: "Drishtee Computer Center transformed my understanding of technology.", rating: 5, role: "Software Engineer" },
  { name: "Abhay Gautam", img: "images/testimonial/testimonial2.avif", text: "The expert guidance and practical approach gave me confidence.", rating: 5, role: "Web Developer" },
  { name: "The Jugnoo", img: "images/testimonial/testimonial3.avif", text: "I appreciated the personalized coaching. Truly prepares you.", rating: 4, role: "UI/UX Designer" },
  { name: "Aditi Verma", img: "images/testimonial/testimonial4.avif", text: "The team helped me grow exponentially from basic to advanced.", rating: 5, role: "Data Analyst" }
];

const Testimonials = () => {
  const [idx, setIdx] = useState(0);
  const T_LEN = testimonials.length;

  useEffect(() => {
    const timer = setInterval(() => setIdx(p => (p + 1) % T_LEN), 4000);
    return () => clearInterval(timer);
  }, [T_LEN]);

  return (
    <section className="py-5 bg-light overflow-hidden">
      <div className="container text-center">
        <div className="text-center mb-5">
          <span className="badge rounded-pill bg-primary-light text-primary px-3 py-2 mb-2">Testimonials</span>
          <h2 className="fw-bold display-6">What Students <span className="text-gradient">Say About Us</span></h2>
          <p className="text-muted">Real stories from students who launched their careers with us.</p>
        </div>
        <div className="position-relative mx-auto slider-box">
          {testimonials.map((item, i) => {
            let cardClass = "hidden-card";
            if (i === idx) cardClass = "active-card shadow-lg";
            else if (i === (idx + 1) % T_LEN) cardClass = "next-card shadow-sm";
            else if (i === (idx - 1 + T_LEN) % T_LEN) cardClass = "prev-card shadow-sm";

            return (
              <div key={i} className={`card-3d p-4 rounded-4 bg-white ${cardClass}`}>
                <div className="text-warning mb-2 small">
                  {[...Array(5)].map((_, s) => <i key={s} className={`bi bi-star${s < item.rating ? '-fill' : ''} mx-1`}></i>)}
                </div>
                <p className="text-muted fst-italic mb-4">"{item.text}"</p>
                <div className="d-flex align-items-center border-top pt-3">
                  <img src={item.img} alt={item.name} className="rounded-circle border" style={{ width: 45, height: 45, objectFit: "cover" }} />
                  <div className="text-start ms-3">
                    <h6 className="mb-0 fw-bold">{item.name}</h6>
                    <small className="text-primary" style={{ fontSize: '11px' }}>{item.role}</small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="d-flex justify-content-center gap-2 mt-4">
          {testimonials.map((_, i) => (
            <span key={i} onClick={() => setIdx(i)}
              className={`dot ${idx === i ? 'bg-primary w-25' : 'bg-secondary opacity-25'}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .slider-box { height: 280px; max-width: 450px; }
        .card-3d { 
          position: absolute; width: 100%; transition: all 0.6s ease-in-out; 
          border: 1px solid #eee; left: 0; top: 0;
        }
        .text-gradient { background: linear-gradient(90deg, #0d6efd, #0dcaf0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        /* Z-Index Logic */
        .active-card { z-index: 10; transform: scale(1); opacity: 1; visibility: visible; }
        .next-card   { z-index: 5;  transform: translateX(40%) scale(0.85); opacity: 0.6; filter: blur(1px); }
        .prev-card   { z-index: 5;  transform: translateX(-40%) scale(0.85); opacity: 0.6; filter: blur(1px); }
        .hidden-card { z-index: 1;  transform: scale(0.7); opacity: 0; visibility: hidden; }

        .dot { height: 6px; width: 10px; border-radius: 10px; cursor: pointer; transition: 0.3s; }
        
        @media (max-width: 768px) {
          .next-card, .prev-card { opacity: 0; transform: scale(0.8); }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;