import React from 'react';

function ScrollUp() {
    const handleScrollToTop = (e) => {
        // Prevent event bubbling taaki swipe wrapper interfere na kare
        e.stopPropagation(); 
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            <style>{`
                #btnBackToTop {
                    /* Ripple animation ko button ke andar restrict karne ke liye overflow hidden */
                    overflow: visible; 
                    transition: all 0.3s ease;
                }

                #btnBackToTop::after {
                    content: "";
                    border-radius: 50%;
                    border: 4px solid #00ffcb;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation: ring 2s infinite;
                    pointer-events: none; /* Click button tak pahunchne dega */
                    z-index: -1; /* Animation ko icon ke peeche rakhega */
                }

                @keyframes ring {
                    0% {
                        width: 40px;
                        height: 40px;
                        opacity: 1;
                    }
                    100% {
                        width: 90px;
                        height: 90px;
                        opacity: 0;
                    }
                }
                
                #btnBackToTop:active {
                    transform: scale(0.9);
                }
            `}</style>

            <button
                onClick={handleScrollToTop}
                onTouchEnd={handleScrollToTop} // Mobile ke liye extra security
                className="btn btn-primary m-0 p-0 position-fixed shadow-lg border-0"
                id="btnBackToTop"
                title="Scroll to Top"
                aria-label="Scroll to top"
                style={{
                    bottom: '90px', // Header ke bottom tab se upar
                    right: '20px',
                    zIndex: 99999, // Sabse upar rakha hai taaki touch ho sake
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0a2885' // Aapka primary theme color
                }}
            >
                <i className="bi bi-arrow-up-circle-fill fs-3 text-white"></i>
            </button>
        </>
    );
}

export default ScrollUp;