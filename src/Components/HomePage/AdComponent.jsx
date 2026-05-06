import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AdComponent = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, [pathname]);

  return (
    <div 
      key={pathname}  
      className="ad-container"
      style={{ textAlign: "center", overflow: "hidden" }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-2660059673395664"
        data-ad-slot="9613780100"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      
      <style>{`
        .adsbygoogle[data-ad-status="unfilled"],
        .adsbygoogle:empty {
          display: none !important;
        }

        .ad-container:has(ins[data-ad-status="filled"]) {
          margin: 20px 0;
        }
      `}</style>
    </div>
  );
};

export default AdComponent;