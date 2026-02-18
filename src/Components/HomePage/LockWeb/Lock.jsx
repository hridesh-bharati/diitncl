import { useEffect } from "react";

const Lock = ({ children }) => {
  useEffect(() => {
    // Block keys like Ctrl+U, Ctrl+I, Ctrl+S, F12, etc.
    const handleKeyDown = (e) => {
      const blockedKeys = ["u", "i", "s"];
      if (
        (e.ctrlKey && blockedKeys.includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.shiftKey && ["i", "j"].includes(e.key.toLowerCase())) ||
        e.key === "F12"
      ) {
        e.preventDefault();
      }
    };

    // Disable right-click
    const disableRightClick = (e) => e.preventDefault();

    // Disable select, copy, cut, paste, drag
    const disableSelect = (e) => e.preventDefault();
    const disableDrag = (e) => e.preventDefault();

    // Detect DevTools
    const detectDevTools = () => {
      const threshold = 100; // Minimum window size difference to detect DevTools
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        document.body.innerHTML =
          "<h1>Welcome to DRISHTEE COMPUTER CENTER NICHLUAL!</h1>";
        return true;
      }
      return false;
    };

    // Run detection once on load
    detectDevTools();

    // Add event listeners
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("selectstart", disableSelect);
    document.addEventListener("copy", disableSelect);
    document.addEventListener("cut", disableSelect);
    document.addEventListener("paste", disableSelect);
    document.addEventListener("dragstart", disableDrag);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("selectstart", disableSelect);
      document.removeEventListener("copy", disableSelect);
      document.removeEventListener("cut", disableSelect);
      document.removeEventListener("paste", disableSelect);
      document.removeEventListener("dragstart", disableDrag);
    };
  }, []);

  return children || null;
};

export default Lock;
