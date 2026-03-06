import React, { useState, useEffect, useRef } from "react";

const stats = [
  { val: 1500, suf: "+", lbl: "Students", bg: "primary" },
  { val: 95, suf: "%", lbl: "Placement", bg: "success" },
  { val: 20, suf: "+", lbl: "Partners", bg: "info" },
  { val: 15, suf: "+", lbl: "Courses", bg: "danger" },
  { val: 10, suf: "+", lbl: "Faculties", bg: "warning" },
  { val: 4.9, suf: "★", lbl: "Rating", bg: "secondary", isF: true }
];

export default function Counter() {
  const [counts, setCounts] = useState(stats.map(() => 0));
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const steps = 30;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setCounts(prev => prev.map((c, i) => {
        if (c < stats[i].val) {
          const inc = stats[i].val / steps;
          return Math.min(c + inc, stats[i].val);
        }
        return c;
      }));
    }, interval);

    return () => clearInterval(timer);
  }, [inView]);

  return (
    <div className="container py-2" ref={ref}>
      <div className="row g-2 g-md-3">
        {stats.map((s, i) => (
          <div key={i} className="col-4 col-md-2">
            <div className={`p-3 text-center rounded-4 shadow-sm bg-white border-bottom border-4 border-${s.bg}`}>
              <h3 className={`fw-bold mb-0 text-${s.bg} h4`}>
                {s.isF ? counts[i].toFixed(1) : Math.floor(counts[i])}{s.suf}
              </h3>
              <div className="text-muted" style={{fontSize: '10px'}}>{s.lbl}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}