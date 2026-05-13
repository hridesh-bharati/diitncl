import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const AdComponent = () => {
  const adRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (
          window.adsbygoogle &&
          adRef.current &&
          !adRef.current.getAttribute("data-adsbygoogle-status")
        ) {
          window.adsbygoogle.push({});
        }
      } catch (e) {
        console.error("Adsense error:", e);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      className="ad-container text-center my-4"
      style={{
        minHeight: "280px",
        overflow: "hidden",
      }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-2660059673395664"
        data-ad-slot="9613780100"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdComponent;