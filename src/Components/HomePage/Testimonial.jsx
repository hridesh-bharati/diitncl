import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const testimonials = [
  { name: "Rohit Kumar", img: "images/testimonial/testimonial1.avif", text: "Drishtee Computer Center transformed my understanding of technology—top-notch training.", rating: 5 },
  { name: "Abhay Gautam", img: "images/testimonial/testimonial2.avif", text: "The expert guidance and practical approach here gave me the confidence to tackle problems.", rating: 5 },
  { name: "The Jugnoo", img: "images/testimonial/testimonial3.avif", text: "I appreciated the personalized coaching. Drishtee truly prepares you for the real world.", rating: 4 },
  { name: "Aditi Verma", img: "http://themes.audemedia.com/html/goodgrowth/images/testimonial4.jpg", text: "From basic skills to advanced concepts, the team helped me grow exponentially.", rating: 5 }
];

const Testimonials = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((p) => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const getPos = (i) => {
    if (i === idx) return "active-card shadow-lg";
    if (i === (idx + 1) % testimonials.length) return "next-card opacity-50";
    if (i === (idx - 1 + testimonials.length) % testimonials.length) return "prev-card opacity-50";
    return "hidden-card";
  };

  return (
    <section className="py-5 overflow-hidden" style={{ background: "#f8fafc" }}>
      <div className="container py-2">
        <div className="text-center mb-5">
          <h2 className="fw-bold h3">What Students <span className="text-primary">Say</span></h2>
          <div className="mx-auto bg-primary opacity-25" style={{ width: '40px', height: '3px' }}></div>
        </div>

        <div className="slider-container position-relative mx-auto">
          {testimonials.map((item, i) => (
            <div key={i} className={`testi-card rounded-4 p-4 bg-white border ${getPos(i)}`}>
              <div className="text-warning mb-2" style={{ fontSize: '12px' }}>
                {[...Array(item.rating)].map((_, s) => <i key={s} className="bi bi-star-fill mx-1"></i>)}
              </div>

              <p className="text-muted small italic mb-4">"{item.text}"</p>

              <div className="d-flex align-items-center mt-auto border-top pt-3">
                <img src={item.img} alt={item.name} className="rounded-circle border" style={{ width: "45px", height: "45px", objectFit: "cover" }} loading="lazy" />
                <div className="ms-3 text-start">
                  <h6 className="mb-0 fw-bold small text-dark">{item.name}</h6>
                  <small className="text-primary" style={{ fontSize: '10px', fontWeight: '700' }}>Verified Student</small>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-center gap-2 mt-4">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label="slide" className={`dot-btn ${idx === i ? 'active' : ''}`} />
          ))}
        </div>
      </div>

      <style>{`
        .slider-container { height: 280px; width: 100%; max-width: 400px; display: flex; align-items: center; justify-content: center; }
        .testi-card {
          position: absolute;
          width: 100%;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          z-index: 1;
        }
        .active-card { transform: translateX(0) scale(1); opacity: 1; z-index: 3; }
        .next-card { transform: translateX(45%) scale(0.8); z-index: 1; filter: blur(1px); }
        .prev-card { transform: translateX(-45%) scale(0.8); z-index: 1; filter: blur(1px); }
        .hidden-card { transform: scale(0.5); opacity: 0; }

        .dot-btn { width: 8px; height: 8px; background: #cbd5e1; border: none; border-radius: 50%; transition: 0.3s; padding: 0; }
        .dot-btn.active { width: 20px; background: #0d6efd; border-radius: 10px; }
        .italic { font-style: italic; line-height: 1.5; }

        @media (max-width: 768px) {
          .next-card, .prev-card { display: none; }
          .slider-container { max-width: 320px; height: 300px; }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;