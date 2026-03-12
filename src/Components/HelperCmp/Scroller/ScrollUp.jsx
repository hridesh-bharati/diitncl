import React, { useState, useEffect, useCallback } from 'react';

function ScrollUp() {
    const [isVisible, setIsVisible] = useState(false);

    // 1. Scroll check ko optimize kiya (Throttle jaisa kaam karega)
    const toggleVisibility = useCallback(() => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility, { passive: true });
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, [toggleVisibility]);

    const handleScrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!isVisible) return null;

    return (
        <>
            <style>{`
                #btnBackToTop {
                    overflow: visible; 
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    animation: fadeIn 0.4s ease-out;
                }

                #btnBackToTop::after {
                    content: "";
                    border-radius: 50%;
                    border: 2px solid #00ffcb;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation: ring 2s infinite;
                    pointer-events: none;
                    z-index: -1;
                }

                @keyframes ring {
                    0% { width: 40px; height: 40px; opacity: 1; }
                    100% { width: 80px; height: 80px; opacity: 0; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.5) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                
                #btnBackToTop:hover {
                    background-color: #1a73e8 !important;
                    transform: translateY(-5px);
                }

                #btnBackToTop:active {
                    transform: scale(0.9);
                }
            `}</style>

            <button
                onClick={handleScrollToTop}
                className="btn position-fixed shadow-lg border-0"
                id="btnBackToTop"
                title="Scroll to Top"
                aria-label="Scroll to top"
                style={{
                    bottom: '90px', 
                    right: '20px',
                    zIndex: 9999, 
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0a2885',
                    color: 'white'
                }}
            >
                <i className="bi bi-arrow-up-short fs-2"></i>
            </button>
        </>
    );
}

export default React.memo(ScrollUp);