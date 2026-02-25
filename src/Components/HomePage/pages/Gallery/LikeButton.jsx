// src/components/Gallery/LikeButton.jsx
import React, { useState } from "react";
import "./LikeButton.css";

export default function LikeButton({
  isLiked,
  count,
  onClick,
  size = 22,
  showAnimation = true,
  variant = "instagram"
}) {
  const [animate, setAnimate] = useState(false);
  const [doubleClick, setDoubleClick] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();

    if (showAnimation) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 450);
    }

    // Detect double click
    if (e.detail === 2) {
      setDoubleClick(true);
      setTimeout(() => setDoubleClick(false), 450);

      // If double click and not liked, auto-like
      if (!isLiked) {
        onClick();
      }
    } else {
      onClick();
    }
  };

  // Instagram Style
  if (variant === 'instagram') {
    return (
      <div
        className="instagram-like-wrapper"
        onClick={handleClick}
      >
        <span className={`instagram-like-icon ${isLiked ? 'liked' : ''} ${animate ? 'likePop' : ''} ${doubleClick ? 'double-click-like' : ''}`}>
          <i
            className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`}
            style={{
              fontSize: size,
              color: isLiked ? "#ed4956" : "inherit"
            }}
          ></i>
        </span>
        <span className={`instagram-like-count ${isLiked ? 'liked' : ''}`}>
          {count}
        </span>
      </div>
    );
  }

  // Facebook Style
  if (variant === 'facebook') {
    return (
      <div
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          padding: '4px 12px',
          borderRadius: '4px',
          backgroundColor: isLiked ? '#e7f3ff' : 'transparent',
          transition: 'all 0.2s ease'
        }}
      >
        <i
          className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`}
          style={{
            fontSize: size,
            color: isLiked ? "#ed4956" : "inherit"
          }}
        ></i>
        <span style={{
          color: isLiked ? '#1877f2' : '#65676b',
          fontWeight: '600',
          fontSize: '14px'
        }}>
          Like • {count}
        </span>
      </div>
    );
  }

  // Minimal Style
  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        cursor: 'pointer'
      }}
    >
      <i
        className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`}
        style={{
          fontSize: size,
          color: isLiked ? "#ed4956" : "inherit"
        }}
      ></i>
      <span style={{ fontWeight: '600', fontSize: '14px' }}>{count}</span>
    </div>
  );
}