import React from "react";
import "./LoadingSpinner.css";
export default function LoadingSpinner({ fullHeight = true }) {
  return (
    <div className={`loading-container ${fullHeight ? 'full-height' : ''}`}>
      <div className="spinner-wrapper">
        <div className="jio-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-center">
            <div className="spinner-logo">DIIT</div>
          </div>
        </div>
        <p className="loading-text text-dark">Loading...</p>
      </div>
    </div>
  );
}