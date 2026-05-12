import React, { useState, useEffect } from 'react';

const CounterItem = ({ target, label, textColor, isLast }) => {
  const [count, setCount] = useState(0);
  const hasNumber = /\d/.test(target);
  const numericValue = hasNumber ? parseInt(target.replace(/[^0-9]/g, '')) : 0;
  const suffix = target.replace(/[0-9]/g, '');

  useEffect(() => {
    if (!hasNumber) return;
    let startTime;
    const duration = 5000;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * numericValue));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [numericValue, hasNumber]);

  return (
    <div className={`text-center py-2 ${!isLast ? 'border-end' : ''}`} style={{ width: '25%' }}>
      <h2 className={`fw-bold mb-0 ${textColor}`} style={{ fontSize: 'calc(0.8rem + 1.2vw)' }}>
        {hasNumber ? `${count}${suffix}` : target}
      </h2>
      
      <p className="text-uppercase fw-bold text-muted mb-0 mt-1" 
         style={{ 
           fontSize: 'calc(0.4rem + 0.2vw)',
           letterSpacing: '0.5px',
           lineHeight: '1.2'
         }}>
        {label}
      </p>
    </div>
  );
};

const StatsSection = () => {
  const stats = [
    { n: "19+", l: "YEARS EXP.", color: "text-primary" },
    { n: "5000+", l: "STUDENTS", color: "text-success" },
    { n: "ISO", l: "CERTIFIED", color: "text-warning" },
    { n: "100%", l: "PRACTICAL", color: "text-info" },
  ];

  return (
    <div className="container-fluid bg-white shadow-sm rounded-3 my-2">
      <div className="d-flex flex-nowrap align-items-center py-3">
        {stats.map((s, i) => (
          <CounterItem 
            key={i} 
            target={s.n} 
            label={s.l} 
            textColor={s.color} 
            isLast={i === stats.length - 1} 
          />
        ))}
      </div>
    </div>
  );
};

export default StatsSection;