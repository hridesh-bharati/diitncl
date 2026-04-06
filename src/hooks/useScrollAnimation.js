import { useEffect } from "react";

const useScrollAnimation = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-animate");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Jab screen par aaye toh class add karo
            entry.target.classList.add("animate-visible");
          } else {
            // Jab screen se bahar jaye toh class remove kardo (Repeatable animation)
            entry.target.classList.remove("animate-visible");
          }
        });
      },
      {
        threshold: 0.1, // Thoda jaldi trigger hoga
        rootMargin: "0px 0px -50px 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

export default useScrollAnimation;