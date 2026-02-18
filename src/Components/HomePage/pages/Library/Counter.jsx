import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CountdownTimer() {
  /* ================= DATA ================= */
  const statisticsData = [
    { number: "50K+", text: "Books Collection", target: 50000, color: "#2563EB" },
    { number: "10K+", text: "E-Resources", target: 10000, color: "#059669" },
    { number: "24/7", text: "Digital Access", target: 24, color: "#DC2626" },
    { number: "500+", text: "Study Spaces", target: 500, color: "#7C3AED" }
  ];

  /* ================= STATE ================= */
  const [counts, setCounts] = useState(statisticsData.map(() => 0));

  /* ================= COUNT ANIMATION ================= */
  useEffect(() => {
    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);

    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      setCounts(
        statisticsData.map(stat => {
          const value = Math.round(stat.target * progress);
          return value > stat.target ? stat.target : value;
        })
      );

      if (frame === totalFrames) clearInterval(timer);
    }, frameRate);

    return () => clearInterval(timer);
  }, []);

  /* ================= UI ================= */
  return (
    <div className="py-5">
      <div className="container">
        <div className="row g-4 text-center">
          {statisticsData.map((stat, index) => (
            <div key={index} className="col-6 col-md-3">
              <div
                className="p-4 rounded-4 h-100"
                style={{
                  background: "linear-gradient(180deg,#ffffff,#f5f7ff)",
                  boxShadow: "0 8px 22px rgba(0,0,0,.08)"
                }}
              >
                <h2
                  className="fw-bold mb-1"
                  style={{
                    color: stat.color
                  }}
                >
                  {counts[index] === stat.target
                    ? stat.number
                    : counts[index]}
                </h2>

                <p className="text-muted fw-semibold mb-0">
                  {stat.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
