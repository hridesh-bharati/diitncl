// src\hooks\useScrollAnimation.js
import { useEffect } from "react";

export default function useScrollAnimation() {
  useEffect(() => {
    // अगर ब्राउज़र में IntersectionObserver न हो तो सीधे बाहर आ जाएं (Performance Safety)
    if (!window.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // requestAnimationFrame का उपयोग करके एनिमेशन को सीधे GPU फ्रेम रेट से सिंक किया
        window.requestAnimationFrame(() => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("show");
              // एक बार एनिमेट होने के बाद ऑब्जर्वर हटा दें ताकि मेमोरी बची रहे (Lightweight Optimization)
              observer.unobserve(entry.target);
            }
          });
        });
      },
      { 
        threshold: 0.02, // 2% दिखते ही तुरंत ट्रिगर
        rootMargin: "0px 0px -20px 0px" // स्क्रीन में आने से थोड़ा पहले ही लोड होना शुरू हो जाए
      }
    );

    const targets = document.querySelectorAll(".fade-up, .zoom-in, .slide-in-left, .slide-in-right");
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}