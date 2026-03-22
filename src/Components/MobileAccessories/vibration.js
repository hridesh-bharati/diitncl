// vibration.js (ya App.jsx me useEffect me)

export const initGlobalVibration = () => {
  if (!navigator.vibrate) return;

  document.addEventListener("click", (e) => {
    const target = e.target;

    // button ya link check
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest("[role='button']")
    ) {
          navigator.vibrate([20, 10, 20]);

    }
  });
};