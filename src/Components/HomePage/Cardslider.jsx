// import React, { useRef, useEffect, useState } from 'react';

// const base = "images/cardslider";
// const slides = ["android.avif", "ehack.avif", "cpp.avif", "office.avif", "js.avif", "coding.avif", "ai.avif", "tail.avif", "ppt.avif", "python.avif", "ai1.avif", "ps1.avif"];
// const SLIDE_WIDTH = 195; // 180px width + 15px gap

// export default function CardSlider() {
//   const sliderRef = useRef(null);
//   const [activeDot, setActiveDot] = useState(0);

//   // Reusable scroll function
//   const scrollTo = (index) => {
//     sliderRef.current?.scrollTo({ left: index * SLIDE_WIDTH, behavior: 'smooth' });
//   };

//   useEffect(() => {
//     const timer = setInterval(() => {
//       if (!sliderRef.current) return;
//       const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      
//       // Reset if at end, else scroll next
//       const nextPos = (scrollLeft + clientWidth >= scrollWidth - 10) ? 0 : scrollLeft + SLIDE_WIDTH;
//       sliderRef.current.scrollTo({ left: nextPos, behavior: 'smooth' });
//     }, 3000);
//     return () => clearInterval(timer);
//   }, []);

//   const onScroll = (e) => {
//     const index = Math.round(e.target.scrollLeft / SLIDE_WIDTH) % slides.length;
//     if (activeDot !== index) setActiveDot(index);
//   };

//   // Common Styles to keep JSX clean (DRY)
//   const cardStyle = {
//     flex: '0 0 180px',
//     height: '130px',
//     borderRadius: '14px',
//     overflow: 'hidden',
//     boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
//     background: '#fff',
//     scrollSnapAlign: 'start'
//   };

//   return (
//     <div className="py-3 w-100 overflow-hidden container-fluid">
//       <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      
//       <div 
//         ref={sliderRef}
//         onScroll={onScroll}
//         className="hide-scrollbar d-flex"
//         style={{ gap: '15px', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollBehavior: 'smooth', padding: '10px 15px' }}
//       >
//         {/* Infinite mapping logic optimized */}
//         {[...slides, ...slides].map((img, i) => (
//           <div key={i} style={cardStyle}>
//             <img src={`${base}/${img}`} alt="Drishtee Student" className="w-100 h-100 object-fit-cover" loading="lazy" />
//           </div>
//         ))}
//       </div>

//       {/* Optimized Dots Section */}
//       <div className="d-flex justify-content-center gap-2 mt-3">
//         {slides.map((_, i) => (
//           <button
//             key={i}
//             onClick={() => scrollTo(i)}
//             aria-label={`Go to slide ${i + 1}`}
//             className="border-0 p-0"
//             style={{
//               width: i === activeDot ? '28px' : '10px',
//               height: '6px', 
//               borderRadius: '6px',
//               background: i === activeDot ? '#001297' : '#d1d5db',
//               transition: '0.3s', 
//               cursor: 'pointer'
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useRef, useEffect, useState } from 'react';

const BASE_URL = "images/cardslider";

// Rich Dataset map loaded with high-intent SEO search phrases for local ranking
const SLIDES_DATA = [
  { id: 1, file: "android.avif", alt: "Android Application Development Training Course in Nichlaul" },
  { id: 2, file: "ehack.avif", alt: "Ethical Hacking and Cyber Security Certified Classes" },
  { id: 3, file: "cpp.avif", alt: "C++ Object Oriented Programming Core Language Institute" },
  { id: 4, file: "office.avif", alt: "MS Office Automation and Corporate Executive Course Diploma" },
  { id: 5, file: "js.avif", alt: "Advanced JavaScript and ES6 Frontend Web Scripting Modules" },
  { id: 6, file: "coding.avif", alt: "Computer Coding Bootcamps and Software Engineering Lab" },
  { id: 7, file: "ai.avif", alt: "Artificial Intelligence and Machine Learning Career Program" },
  { id: 8, file: "tail.avif", alt: "Tally Prime ERP Taxation and Accounting Training Academy" },
  { id: 9, file: "ppt.avif", alt: "Professional Presentation and Graphic Design Basics Coaching" },
  { id: 10, file: "python.avif", alt: "Python Core Backend Development Training with Live Projects" },
  { id: 11, file: "ai1.avif", alt: "Generative AI Systems Application and Deep Tech Concepts" },
  { id: 12, file: "ps1.avif", alt: "Adobe Photoshop Graphic Designing and UI Layout Mastery" }
];

const SLIDE_WIDTH = 195; // 180px card layout dimension + 15px element gap allocation

export default function CardSlider() {
  const sliderRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);

  // High performance hardware-accelerated scroll runner
  const scrollTo = (index) => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: index * SLIDE_WIDTH, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const autoScrollTimer = setInterval(() => {
      if (!sliderRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      
      // Infinite snap logic reset protocol
      const isEndReached = scrollLeft + clientWidth >= scrollWidth - 15;
      const nextPosition = isEndReached ? 0 : scrollLeft + SLIDE_WIDTH;
      
      sliderRef.current.scrollTo({ left: nextPosition, behavior: 'smooth' });
    }, 2800);

    return () => clearInterval(autoScrollTimer);
  }, []);

  const handleScrollTracking = (e) => {
    const rawIndex = Math.round(e.target.scrollLeft / SLIDE_WIDTH);
    const indexBound = rawIndex % SLIDES_DATA.length;
    if (activeDot !== indexBound) {
      setActiveDot(indexBound);
    }
  };

  return (
    // Semantic structural node for SEO crawl visibility
    <section className="py-3 w-100 overflow-hidden bg-white" aria-label="Drishtee Skill Development Portfolio">
      
      {/* High-speed Native Scroll Framework Wrapper */}
      <div 
        ref={sliderRef}
        onScroll={handleScrollTracking}
        className="hide-scrollbar d-flex overflow-auto custom-scroll-gap px-3 py-2"
      >
        {/* Infinite duplication rendering blocks with dynamic keyword injections */}
        {[...SLIDES_DATA, ...SLIDES_DATA].map((slide, index) => (
          <figure 
            key={`${slide.id}-${index}`} 
            className="slider-card-frame flex-shrink-0 bg-white m-0 border shadow-sm position-relative overflow-hidden"
          >
            <img 
              src={`${BASE_URL}/${slide.file}`} 
              alt={slide.alt} 
              title={slide.alt}
              className="w-100 h-100 object-fit-cover d-block img-optimize-layer" 
              width="180"
              height="130"
              loading={index < 4 ? "eager" : "lazy"} 
              decoding="async"
            />
            {/* Contextual markup trace hidden from visual layer but fully visible to Google Bot */}
            <figcaption className="visually-hidden">{slide.alt}</figcaption>
          </figure>
        ))}
      </div>

      {/* SEO Friendly Accessible Interactive Dot Controls */}
      <div className="d-flex justify-content-center gap-2 mt-3" role="tablist" aria-label="Slider Navigation Controls">
        {SLIDES_DATA.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            role="tab"
            aria-selected={idx === activeDot}
            aria-label={`Maps to portfolio module ${idx + 1}`}
            className={`border-0 p-0 slider-nav-dot-pill ${idx === activeDot ? "dot-active-brand" : "dot-inactive"}`}
          />
        ))}
      </div>

      {/* Static Core Style Scope with Zero Runtime Performance Penalties */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; } 
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; scroll-snap-type: x mandatory; scroll-behavior: smooth; }
        
        .custom-scroll-gap {
          gap: 15px;
        }

        /* Card Frame Performance Tokenization Optimization */
        .slider-card-frame {
          width: 180px;
          height: 130px;
          border-radius: 12px;
          scroll-snap-align: start;
          border-color: #f1f5f9 !important;
          will-change: transform;
        }

        .img-optimize-layer {
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        /* Navigation Interactive Infrastructure */
        .slider-nav-dot-pill {
          height: 6px;
          border-radius: 6px;
          cursor: pointer;
          transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
        }

        .dot-inactive {
          width: 10px;
          background-color: #cbd5e1;
        }

        .dot-active-brand {
          width: 26px;
          background-color: #990011 !important; /* Maroon Accent matching brand colors */
        }
      `}</style>
    </section>
  );
}