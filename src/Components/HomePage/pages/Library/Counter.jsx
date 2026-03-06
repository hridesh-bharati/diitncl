import React, { useState, useEffect } from "react";

export default function CountdownTimer() {
  const stats = [
    { target: 500, suffix: "+", label: "Happy Students", color: "text-primary" },
    { target: 150, suffix: "+", label: "Study Seats", color: "text-success" },
    { target: 24, suffix: "/7", label: "Digital Access", color: "text-danger" },
    { target: 50, suffix: "+", label: "Courses", color: "text-warning" }
  ];

  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const duration = 2000; // 2 Seconds
    const steps = 50;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setCounts(prev => 
        prev.map((count, i) => {
          if (count < stats[i].target) {
            const increment = Math.ceil(stats[i].target / steps);
            return Math.min(count + increment, stats[i].target);
          }
          return count;
        })
      );
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container py-4">
      <div className="row g-3 text-center">
        {stats.map((s, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className="p-3 p-md-4 rounded-4 bg-white shadow-sm border-0 h-100">
              <h2 className={`fw-bold mb-1 ${s.color}`}>
                {counts[i]}{s.suffix}
              </h2>
              <p className="small text-muted fw-bold mb-0 text-uppercase">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}