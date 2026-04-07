import React, { useRef, useEffect, useState } from 'react';

const base = "images/cardslider";
const slides = ["android.avif", "ehack.avif", "cpp.avif", "office.avif", "js.avif", "coding.avif", "ai.avif", "tail.avif", "ppt.avif", "python.avif", "ai1.avif", "ps1.avif"];
const SLIDE_WIDTH = 195; // 180px width + 15px gap

export default function CardSlider() {
  const sliderRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);

  // Reusable scroll function
  const scrollTo = (index) => {
    sliderRef.current?.scrollTo({ left: index * SLIDE_WIDTH, behavior: 'smooth' });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!sliderRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      
      // Reset if at end, else scroll next
      const nextPos = (scrollLeft + clientWidth >= scrollWidth - 10) ? 0 : scrollLeft + SLIDE_WIDTH;
      sliderRef.current.scrollTo({ left: nextPos, behavior: 'smooth' });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const onScroll = (e) => {
    const index = Math.round(e.target.scrollLeft / SLIDE_WIDTH) % slides.length;
    if (activeDot !== index) setActiveDot(index);
  };

  // Common Styles to keep JSX clean (DRY)
  const cardStyle = {
    flex: '0 0 180px',
    height: '130px',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
    background: '#fff',
    scrollSnapAlign: 'start'
  };

  return (
    <div className="py-3 w-100 overflow-hidden container-fluid">
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      
      <div 
        ref={sliderRef}
        onScroll={onScroll}
        className="hide-scrollbar d-flex"
        style={{ gap: '15px', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollBehavior: 'smooth', padding: '10px 15px' }}
      >
        {/* Infinite mapping logic optimized */}
        {[...slides, ...slides].map((img, i) => (
          <div key={i} style={cardStyle}>
            <img src={`${base}/${img}`} alt="" className="w-100 h-100 object-fit-cover" loading="lazy" />
          </div>
        ))}
      </div>

      {/* Optimized Dots Section */}
      <div className="d-flex justify-content-center gap-2 mt-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="border-0 p-0"
            style={{
              width: i === activeDot ? '28px' : '10px',
              height: '6px', 
              borderRadius: '6px',
              background: i === activeDot ? '#001297' : '#d1d5db',
              transition: '0.3s', 
              cursor: 'pointer'
            }}
          />
        ))}
      </div>
    </div>
  );
}