import React, { useState, useRef, useEffect } from "react";
import "./LikeButton.css";

const REACTIONS = [
  { name: "Like", icon: "👍", color: "#2078f4" },
  { name: "Love", icon: "❤️", color: "#f33e58" },
  { name: "Care", icon: "🥰", color: "#f7b125" },
  { name: "Haha", icon: "😆", color: "#f7b125" },
  { name: "Wow", icon: "😮", color: "#f7b125" },
  { name: "Sad", icon: "😢", color: "#f7b125" },
  { name: "Angry", icon: "😡", color: "#e9710f" },
];

export default function LikeButton({ isLiked, onClick, userReaction = null }) {
  const [showReactions, setShowReactions] = useState(false);
  const timerRef = useRef(null);

  const handleHold = () => {
    timerRef.current = setTimeout(() => setShowReactions(true), 500);
  };

  const handleRelease = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleReactionClick = (e, reactionName) => {
    e.stopPropagation();
    onClick(reactionName);
    setShowReactions(false);
  };

  useEffect(() => {
    const close = () => setShowReactions(false);
    if (showReactions) window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [showReactions]);

  const activeReaction = REACTIONS.find((r) => r.name === userReaction);

  return (
    <div className="fb-like-container" onMouseLeave={() => setShowReactions(false)}>
      {showReactions && (
        <div className="reactions-panel shadow-lg">
          {REACTIONS.map((r, i) => (
            <div
              key={r.name}
              className="reaction-icon"
              style={{ animationDelay: `${i * 0.1}s` }}
              onClick={(e) => handleReactionClick(e, r.name)}
            >
              <span className="emoji-img">{r.icon}</span>
              <span className="emoji-label">{r.name}</span>
            </div>
          ))}
        </div>
      )}

      <div
        className="like-btn-trigger d-flex align-items-center justify-content-center gap-2 w-100 py-2"
        style={{ cursor: 'pointer', userSelect: 'none' }}
        onMouseDown={handleHold}
        onMouseUp={handleRelease}
        onTouchStart={handleHold}
        onTouchEnd={handleRelease}
        onClick={(e) => !showReactions && handleReactionClick(e, activeReaction ? null : "Like")}
      >
        {activeReaction ? (
          <span className="active-emoji animate-pop" style={{ fontSize: '1.2rem' }}>{activeReaction.icon}</span>
        ) : (
          <i className="bi bi-hand-thumbs-up fs-5"></i>
        )}
        <span className="fw-bold small" style={{ color: activeReaction ? activeReaction.color : "#65676b" }}>
          {activeReaction ? activeReaction.name : "Like"}
        </span>
      </div>
    </div>
  );
}