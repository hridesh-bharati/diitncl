import React, { useEffect } from "react";

const AdComponent = () => {
  useEffect(() => {
    try {
      // Safely trigger the AdSense script window after component mounts
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error structural log:", e);
    }
  }, []); // Empty array ensures this runs exactly once on mount

  return (
    <div className="container my-4 d-flex justify-content-center">
      <div className="ads-wrapper text-center overflow-hidden" style={{ minHeight: "90px" }}>
        <small className="text-muted d-block mb-1 text-uppercase tracking-wider" style={{ fontSize: "10px" }}>
          Advertisement
        </small>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-2660059673395664"
          data-ad-slot="9613780100"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
};

export default React.memo(AdComponent);