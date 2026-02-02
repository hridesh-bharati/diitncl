import React, { useEffect, useState, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import "./Desc.css";

/* ---------- Progress Bar ---------- */
const ProgressBar = ({ percent, color, height = 6 }) => {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setWidth(percent);
    }, { threshold: 0.1 });

    ref.current && io.observe(ref.current);
    return () => io.disconnect();
  }, [percent]);

  return (
    <div className="progress" style={{ height }} ref={ref}>
      <div
        className="progress-bar"
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  );
};

/* ---------- Circular Chart ---------- */
const CircularChart = ({ percent, color, label, size = 70 }) => {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;

      let start;
      const animate = (t) => {
        if (!start) start = t;
        const p = Math.min((t - start) / 1500, 1);
        setValue(Math.round(p * percent));
        p < 1 && requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, { threshold: 0.1 });

    ref.current && io.observe(ref.current);
    return () => io.disconnect();
  }, [percent]);

  return (
    <div className="text-center" ref={ref}>
      <div
        className="completion-chart mx-auto mb-2"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${color} ${value * 3.6}deg, #eee 0)`
        }}
      >
        <div className="completion-inner">
          <strong>{value}%</strong>
        </div>
      </div>
      <small className="fw-medium">{label}</small>
    </div>
  );
};

/* ---------- Chart Section ---------- */
const ChartSection = ({ title, subtitle, badge, children }) => (
  <div className="card border-0 bg-light">
    <div className="card-header bg-transparent border-0">
      <div className="d-flex justify-content-between">
        <div>
          <h6 className="fw-bold mb-0">{title}</h6>
          <small className="text-muted">{subtitle}</small>
        </div>
        {badge && <span className={`badge ${badge.className}`}>{badge.text}</span>}
      </div>
    </div>
    <div className="card-body">{children}</div>
  </div>
);

/* ---------- Analytics ---------- */
const AnalyticsDashboard = () => {
  const completion = [
    { name: "CCC", percent: 85, color: "#4CAF50" },
    { name: "DCA", percent: 78, color: "#2196F3" },
    { name: "Tally", percent: 92, color: "#FF9800" },
    { name: "Web Dev", percent: 65, color: "#E91E63" },
    { name: "Graphic", percent: 70, color: "#9C27B0" }
  ];

  return (
    <ChartSection
      title="Course Completion"
      subtitle="Success rate by course"
      badge={{ text: "High Performance", className: "bg-success" }}
    >
      <div className="row g-3">
        {completion.map((c, i) => (
          <div key={i} className="col-4 col-md-2">
            <CircularChart {...c} label={c.name} />
          </div>
        ))}
      </div>
    </ChartSection>
  );
};

/* ---------- Featured Course ---------- */
const FeaturedCourse = () => (
  <section className="py-5 bg-light">
    <div className="container">
      <div className="card border-0 p-4" data-aos="fade-up">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">
            <Link to="/OurCourses" className="text-dark text-decoration-none">
              CCC Free 1-Year Course
            </Link>
          </h4>
          <img src="images/icon/freegift.gif" width="45" alt="" />
        </div>

        <p className="text-muted">
          Completely free 1-year CCC program for rural students with long-term
          career focused learning.
        </p>

        <strong>Instructor: Drishtee Computer Center</strong>
      </div>
    </div>
  </section>
);

/* ---------- Main ---------- */
export default function FeaturedAndCourses() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 50 });
  }, []);

  return (
    <div className="android-app-container">
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-4">Our Course Catalog</h2>
          <AnalyticsDashboard />
        </div>
      </section>
      <FeaturedCourse />
    </div>
  );
}
