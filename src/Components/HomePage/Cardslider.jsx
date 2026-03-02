import React, { useRef, useEffect, useState } from 'react';

const base = "images/cardslider";
const slides = ["android.avif", "ehack.avif", "cpp.avif", "office.avif", "js.avif", "coding.avif", "ai.avif", "tail.avif", "ppt.avif", "python.avif", "ai1.avif", "ps1.avif"];
const SLIDE_WIDTH = 200; // Slide width + gap

export default function CardSlider() {
  const sliderRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);

  // Auto-play logic
  useEffect(() => {
    const timer = setInterval(() => {
      if (!sliderRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      
      // Infinite Loop Check: Agar end ke paas pahunch gaye toh smoothly reset
      if (scrollLeft + clientWidth >= scrollWidth - 50) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        sliderRef.current.scrollBy({ left: SLIDE_WIDTH, behavior: 'smooth' });
      }
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // Update Dot on scroll (Manual or Auto)
  const syncDot = (e) => {
    const index = Math.round(e.target.scrollLeft / SLIDE_WIDTH) % slides.length;
    setActiveDot(index);
  };

  return (
    <div className="py-3" style={{ width: '100%', overflow: 'hidden' }}>
      {/* Slider Container */}
      <div 
        ref={sliderRef}
        onScroll={syncDot}
        className="hide-scrollbar"
        style={{
          display: 'flex',
          gap: '15px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          padding: '10px 15px'
        }}
      >
        <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        
        {[...slides, ...slides].map((img, i) => (
          <div key={i} style={{ flex: '0 0 180px', scrollSnapAlign: 'start' }}>
            <div style={{
              height: '130px', borderRadius: '14px', overflow: 'hidden',
              boxShadow: '0 6px 14px rgba(0,0,0,0.08)', background: '#fff'
            }}>
              <img src={`${base}/${img}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => sliderRef.current?.scrollTo({ left: i * SLIDE_WIDTH, behavior: 'smooth' })}
            style={{
              width: i === activeDot ? '28px' : '10px',
              height: '6px', borderRadius: '6px', border: 'none',
              background: i === activeDot ? '#001297' : '#d1d5db',
              transition: '0.3s', cursor: 'pointer', padding: 0
            }}
          />
        ))}
      </div>
    </div>
  );
}