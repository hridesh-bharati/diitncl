import React from "react";

export default function LoadingSpinner({ fullHeight = true }) {
  return (
    <div className={`d-flex flex-column align-items-center justify-content-center ${fullHeight ? 'vh-100' : 'py-4'}`}>
      <div className="diit-loader-wrapper position-relative d-flex align-items-center justify-content-center">
        
        {/* Animated Rings (All 3 rings using 1 div + pseudo elements) */}
        <div className="loader-ring-system"></div>

        {/* Center Logo */}
        <div className="loader-logo shadow-sm pulse-animation">
          DIIT
        </div>
      </div>

      <p className="mt-3 small fw-bold text-muted text-uppercase tracking-wider animate-opacity">
        Loading...
      </p>

      <style>{`
        .diit-loader-wrapper { width: 100px; height: 100px; }

        .loader-ring-system, .loader-ring-system::before, .loader-ring-system::after {
          position: absolute;
          border: 3px solid transparent;
          border-radius: 50%;
        }

        /* Ring 1 - Blue */
        .loader-ring-system {
          width: 100%; height: 100%;
          border-top-color: #667eea;
          animation: diit-spin 1.5s linear infinite;
        }

        /* Ring 2 - Purple (Reverse) */
        .loader-ring-system::before {
          content: "";
          top: 5px; left: 5px; right: 5px; bottom: 5px;
          border-right-color: #764ba2;
          animation: diit-spin 2s linear infinite reverse;
        }

        /* Ring 3 - Green (Fast) */
        .loader-ring-system::after {
          content: "";
          top: 15px; left: 15px; right: 15px; bottom: 15px;
          border-bottom-color: #00b09b;
          animation: diit-spin 1s linear infinite;
        }

        .loader-logo {
          width: 45px; height: 45px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 0.8rem; font-weight: 800;
          z-index: 5;
        }

        @keyframes diit-spin {
          to { transform: rotate(360deg); }
        }

        .pulse-animation { animation: diit-pulse 1.5s infinite; }
        @keyframes diit-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .animate-opacity { animation: diit-fade 2s infinite; }
        @keyframes diit-fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}