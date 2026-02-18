//
import React, { useEffect, useRef } from "react";

export default function CounterCard() {
  const timersRef = useRef([]);

  useEffect(() => {
    const counter = (id, start, end, duration) => {
      let current = start;
      const range = end - start;
      const increment = end > start ? 1 : -1;
      const step = Math.abs(Math.floor(duration / range));
      const obj = document.getElementById(id);

      const timer = setInterval(() => {
        current += increment;
        if (obj) obj.textContent = current;
        if (current === end) clearInterval(timer);
      }, step);

      timersRef.current.push(timer);
    };

    counter("count0", 0, 1500, 2000);
    counter("count1", 0, 200, 2000);
    counter("count2", 0, 20, 2000);
    counter("count3", 0, 2, 2000);

    return () => timersRef.current.forEach(clearInterval);
  }, []);

  return (
    <div className="container p-2" style={{ maxWidth: "95%" }}>
      <div className="row row-cols-2 row-cols-md-4 g-4 justify-content-center">
        <CounterBox id="count0" label="Students Enrolled" icon="fa-users" bg="var(--cardStudent)" delay="100" />
        <CounterBox id="count1" label="Books in Library" icon="fa-book" bg="var(--cardBooks)" delay="200" />
        <CounterBox id="count2" label="Computers" icon="fa-laptop" bg="var(--cardComputer)" delay="300" />
        <CounterBox id="count3" label="Wi-Fi Enabled" icon="fa-wifi" bg="var(--cardEst)" delay="400" />
      </div>

      {/* CSS Variables */}
      <style>{`
        :root {
          --cardStudent: #4f46e5;   /* Indigo */
          --cardBooks: #10b981;     /* Emerald */
          --cardComputer: #0ea5e9;  /* Sky Blue */
          --cardEst: #f59e0b;       /* Amber */
        }
      `}</style>
    </div>
  );
}

const CounterBox = ({ id, label, icon, bg, delay }) => (
  <div
    className="col"
    data-aos="fade-up"
    data-aos-delay={delay}
    style={{ minWidth: "140px" }}
  >
    <div
      className="rounded-4 shadow-sm text-center p-3 h-100 glass-card"
      style={{
        backdropFilter: "blur(12px)",
        background: "rgba(255, 255, 255, 0.3)",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        borderRadius: "20px",
      }}
    >
      <div
        className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 text-white"
        style={{
          width: 80,
          height: 80,
          background: bg,
          fontSize: "1.75rem",
        }}
      >
        <i className={`fas ${icon}`}></i>
      </div>
      <h5 id={id} className="fw-bold text-dark">0</h5>
      <p className="m-0 fw-semibold text-muted small">{label}</p>
    </div>
  </div>
);