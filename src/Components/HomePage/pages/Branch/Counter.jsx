import React, { useRef, useEffect, useState } from "react";

const statsData = [
  { value: 1500, suffix: "+", label: "Students Trained", bg: "#EEF2FF", color: "#4338CA" },
  { value: 95, suffix: "%", label: "Placement Rate", bg: "#ECFDF5", color: "#047857" },
  { value: 20, suffix: "+", label: "Industry Partners", bg: "#E0F2FE", color: "#0369A1" },
  { value: 15, suffix: "+", label: "Certified Courses", bg: "#FEF2F2", color: "#B91C1C" },
  { value: 10, suffix: "+", label: "Faculties", bg: "#FFF7ED", color: "#C2410C" },
  { value: 4.9, suffix: "★", label: "Rating", isFloat: true, bg: "#FAF5FF", color: "#7C3AED" }
];

function useCountUp(target, isFloat, start) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let current = 0;
    const end = Number(target);
    const step = end / 60;

    const timer = setInterval(() => {
      current += step;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(isFloat ? current.toFixed(1) : Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, isFloat, start]);

  return count;
}

function useInView(ref) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.4 }
    );
    ref.current && obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return visible;
}

export default function Counter() {
  return (
    <div className="container my-4">
      <div className="row g-3 justify-content-center">
        {statsData.map((item) => {
          const ref = useRef(null);
          const inView = useInView(ref);
          const count = useCountUp(item.value, item.isFloat, inView);

          return (
            <div
              key={item.label}
              ref={ref}
              className="col-6 col-md-4 col-lg-2"
              style={{
                transform: inView ? "translateY(0)" : "translateY(20px)",
                opacity: inView ? 1 : 0,
                transition: "0.4s ease"
              }}
            >
              <div
                className="rounded-4 text-center p-3 h-100"
                style={{
                  background: item.bg,
                  boxShadow: "0 6px 18px rgba(0,0,0,.08)"
                }}
              >
                <h3
                  className="fw-bold mb-1"
                  style={{
                    color: item.color,
                    textShadow: "0 2px 6px rgba(0,0,0,.15)"
                  }}
                >
                  {count}
                  <span className={item.suffix === "★" ? "ms-1 text-warning" : ""}>
                    {item.suffix}
                  </span>
                </h3>

                <small className="text-muted">{item.label}</small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
