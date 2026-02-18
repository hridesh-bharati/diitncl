import { useEffect } from "react";

const CopyBoard = ({ children }) => {
  useEffect(() => {
    const handleCopy = (e) => {
      e.preventDefault();
      e.clipboardData.setData("text/plain", "Welcome to DIIT");
    };

    document.addEventListener("copy", handleCopy);
    return () => document.removeEventListener("copy", handleCopy);
  }, []);

  return children || null;
};

export default CopyBoard;
