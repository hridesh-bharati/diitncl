import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AdComponent = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      // Har route change par Google ko batana ki naya ad slot chahiye
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, [pathname]);  

  return (
    <div 
      key={pathname}  
      style={{ overflow: "hidden", textAlign: "center", margin: "20px 0", minHeight: "100px" }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-2660059673395664"
        data-ad-slot="9613780100"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdComponent;