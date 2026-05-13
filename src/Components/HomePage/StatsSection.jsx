import React, { useState, useEffect } from 'react';

const CounterItem = ({ target, label, textColor, isLast }) => {
  const [count, setCount] = useState(0);
  const val = parseInt(target);
  const suffix = target.replace(/[0-9]/g, '');

  useEffect(() => {
    let start = 0;
    const duration = 5000;
    const startTime = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setCount(Math.floor(progress * val));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [val]);

  return (
    <div className={`text-center py-2 ${!isLast ? 'border-end' : ''}`} style={{ width: '25%' }}>
      <h2 className={`fw-bold mb-0 ${textColor}`} style={{ fontSize: 'calc(0.8rem + 1.2vw)' }}>
        {count}{suffix}
      </h2>
      <p className="text-uppercase fw-bold text-muted mb-0 mt-1" style={{ fontSize: 'calc(0.4rem + 0.2vw)' }}>
        {label}
      </p>
    </div>
  );
};

const StatsSection = () => {
  const stats = [
    { n: "19+", l: "YEARS EXP.", c: "text-primary" },
    { n: "5000+", l: "STUDENTS", c: "text-success" },
    { n: "50+", l: "COURSES", c: "text-warning" },
    { n: "100%", l: "PRACTICAL", c: "text-info" },
  ];

  return (
    <div className="container-fluid bg-white shadow-sm rounded-3 my-2">
      <div className="d-flex flex-nowrap align-items-center py-3">
        {stats.map((s, i) => (
          <CounterItem key={i} target={s.n} label={s.l} textColor={s.c} isLast={i === 3} />
        ))}
      </div>
    </div>
  );
};

export default StatsSection;