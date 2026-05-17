// src/Components/HomePage/AdComponent.jsx

import React, { useEffect } from "react";

const AdComponent = () => {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("AdSense Error:", err);
    }
  }, []);

  return (
    <div
      className="my-4 text-center mx-auto"
      style={{
        minHeight: "250px",
        overflow: "hidden",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
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