import React, { useState, useEffect } from 'react';

function ScrollUp() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggle = () => setIsVisible(window.scrollY > 300);
        window.addEventListener('scroll', toggle, { passive: true });
        return () => window.removeEventListener('scroll', toggle);
    }, []);

    if (!isVisible) return null;

    const btnStyle = {
        bottom: '90px', right: '20px', zIndex: 9999,
        width: '50px', height: '50px', backgroundColor: '#0a2885',
        transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    };

    return (
        <>
            <style>{`
                .btn-up:hover { transform: translateY(-5px); background: #1a73e8 !important; }
                .btn-up:active { transform: scale(0.9); }
                .btn-up::after {
                    content: ""; border-radius: 50%; border: 6px solid #00ffcb;
                    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    animation: ring 2s infinite; z-index: -1;
                }
                @keyframes ring { 0% { width: 40px; height: 40px; opacity: 1; } 100% { width: 80px; height: 80px; opacity: 0; } }
            `}</style>

            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="btn-up btn position-fixed shadow-lg border-0 d-flex align-items-center justify-content-center text-white rounded-circle"
                style={btnStyle}
            >
                <i className="bi bi-arrow-up-short fs-2"></i>
            </button>
        </>
    );
}

export default React.memo(ScrollUp); 