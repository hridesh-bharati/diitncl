import React, { useState } from "react";

export default function LikeButton({ isLiked, count, onClick, size = 22 }) {
  const [animate, setAnimate] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setAnimate(true);
    setTimeout(() => setAnimate(false), 400);
    onClick();
  };

  return (
    <div className="d-flex align-items-center gap-1 cursor-pointer" onClick={handleClick} style={{ transition: '0.2s' }}>
      <i className={`bi ${isLiked ? "bi-heart-fill text-danger animate-pop" : "bi-heart text-secondary"}`} 
         style={{ fontSize: size }}></i>
      <span className={`small fw-bold ${isLiked ? 'text-danger' : 'text-secondary'}`}>{count}</span>
      
      <style>{`
        .animate-pop { animation: pop 0.4s ease-out; }
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
}