import { useEffect } from "react";

const Locker = ({ children }) => {
  useEffect(() => {
    const blockKeys = ["u", "i", "j", "s", "c"];

    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && blockKeys.includes(e.key.toLowerCase())) ||
        e.key === "F12"
      ) {
        e.preventDefault();
      }
    };

    const preventDefault = (e) => e.preventDefault();

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", preventDefault);
    document.addEventListener("copy", preventDefault);
    document.addEventListener("cut", preventDefault);
    document.addEventListener("dragstart", preventDefault);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("copy", preventDefault);
      document.removeEventListener("cut", preventDefault);
      document.removeEventListener("dragstart", preventDefault);
    };
  }, []);

  return (
    <div
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {children}
    </div>
  );
};

export default Locker;