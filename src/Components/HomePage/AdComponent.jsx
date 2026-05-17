import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const AdComponent = () => {
  const adRef = useRef(null);
  const location = useLocation();
  const pushAttempted = useRef(false);

  useEffect(() => {
    pushAttempted.current = false; // Reset flag on route change

    let timer;
    let retries = 0;
    const MAX_RETRIES = 5;

    const tryPush = () => {
      if (pushAttempted.current) return;
      if (!adRef.current) return;

      if (window.adsbygoogle && typeof window.adsbygoogle.push === "function") {
        try {
          // Reset AdSense internal state – essential for SPA
          adRef.current.removeAttribute("data-adsbygoogle-status");
          adRef.current.removeAttribute("data-ad-status");
          
          window.adsbygoogle.push({});
          pushAttempted.current = true;
        } catch (err) {
          console.error("AdSense push error:", err);
        }
      } else if (retries < MAX_RETRIES) {
        retries++;
        timer = setTimeout(tryPush, 500 * retries);
      } else {
        console.warn("AdSense not available after retries");
      }
    };

    timer = setTimeout(tryPush, 150); // short delay for DOM stability

    return () => clearTimeout(timer);
  }, [location.pathname]); // ✅ Re-run when route changes

  return (
    <div
      className="ad-container text-center my-4 w-100"
      style={{
        minHeight: "280px",
        overflow: "hidden",
      }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          minHeight: "250px",
        }}
        data-ad-client="ca-pub-2660059673395664"
        data-ad-slot="9613780100"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdComponent;