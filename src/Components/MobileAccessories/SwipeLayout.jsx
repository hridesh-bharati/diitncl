import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const routes = ["/", "/about", "/courses", "/gallery", "/library", "/login"];

export default function SwipeLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [direction, setDirection] = useState(0);
  const currentIndex = routes.indexOf(location.pathname);
  const prevIndex = useRef(currentIndex);

  // Direction update logic
  useEffect(() => {
    if (currentIndex > prevIndex.current) setDirection(1);
    else if (currentIndex < prevIndex.current) setDirection(-1);
    prevIndex.current = currentIndex;
  }, [currentIndex]);

  const handleDragEnd = (event, info) => {
    const { offset, velocity } = info;
    const swipeThreshold = 100;

    // Next page logic (Swipe Left)
    if (offset.x < -swipeThreshold || velocity.x < -500) {
      if (currentIndex < routes.length - 1) {
        setDirection(1);
        navigate(routes[currentIndex + 1]);
      }
    } 
    // Previous page logic (Swipe Right)
    else if (offset.x > swipeThreshold || velocity.x > 500) {
      if (currentIndex > 0) {
        setDirection(-1);
        navigate(routes[currentIndex - 1]);
      }
    }
  };

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30, 
        mass: 0.8 
      }
    },
    exit: (dir) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    }),
  };

  return (
    <div style={{ 
      position: "relative", 
      width: "100vw", 
      height: "100vh", 
      overflow: "hidden", // Outer container hides horizontal overflow
      background: "#f8f9fa" 
    }}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={location.pathname}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2} 
          dragDirectionLock={true} // ✨ Vertical scroll ko priority deta hai
          onDragEnd={handleDragEnd}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "white",
            // ✨ Yahan main changes hain:
            touchAction: "pan-y", // Browser ko vertical scroll ki permission deta hai
            overflowY: "auto",    // Internal content ko scrollable banata hai
            overflowX: "hidden",  // Horizontal scroll block karta hai
            WebkitOverflowScrolling: "touch", // iOS par smooth scrolling ke liye
            boxShadow: "0px 0px 30px rgba(0,0,0,0.05)"
          }}
        >
          {/* Content Wrapper: Isse ensure hota hai ki height sahi se calculate ho */}
          <div style={{ width: "100%", minHeight: "100.1%" }}>
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}