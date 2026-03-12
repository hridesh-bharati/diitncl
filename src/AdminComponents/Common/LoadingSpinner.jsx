import React from "react";

export default function LoadingSpinner({ fullHeight = true }) {
  return (
    <div className={`d-flex align-items-center justify-content-center ${fullHeight ? 'vh-100' : 'py-5'}`}>
      <div className="text-center">
        <div className="spinner-container position-relative" style={{ width: '120px', height: '120px', margin: '0 auto' }}>

          {/* Ring 1 - Blue */}
          <div className="ring-layer border-top border-4 position-absolute w-100 h-100 rounded-circle"
            style={{ borderColor: '#667eea', animation: 'spin 2s linear infinite' }}></div>

          {/* Ring 2 - Purple (Reverse) */}
          <div className="ring-layer border-end border-4 position-absolute w-100 h-100 rounded-circle"
            style={{ borderColor: '#764ba2', animation: 'spin 2s linear infinite reverse' }}></div>

          {/* Ring 3 - Green (Fast) */}
          <div className="ring-layer border-bottom border-4 position-absolute w-100 h-100 rounded-circle"
            style={{ borderColor: '#00b09b', animation: 'spin 1.5s linear infinite' }}></div>

          {/* Center DIIT Logo */}
          <div className="position-absolute top-50 start-50 translate-middle rounded-circle d-flex align-items-center justify-content-center pulse-logo"
            style={{
              width: '60px', height: '60px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
              zIndex: 2
            }}>
            <span className="text-white fw-bold fs-5">DIIT</span>
          </div>
        </div>

        {/* Loading Text */}
        <p className="mt-4 fw-bold text-dark animate-fade" style={{ fontSize: '1.2rem' }}>
          Loading...
        </p>
      </div>

      <style>{`
        .ring-layer {
          border-top-color: inherit;
          border-right-color: transparent !important;
          border-left-color: transparent !important;
          border-bottom-color: transparent !important;
        }
        
        /* Ring specific overrides to match your old look */
        .spinner-container div:nth-child(2) { border-top-color: transparent; border-right-color: #764ba2 !important; }
        .spinner-container div:nth-child(3) { border-top-color: transparent; border-bottom-color: #00b09b !important; }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .pulse-logo {
          animation: pulse 2s infinite ease-in-out;
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }

        .animate-fade {
          animation: fade 2s infinite;
        }

        @keyframes fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}