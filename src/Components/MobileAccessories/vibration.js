export const vibration = () => {
  // ❌ vibration support nahi
  if (!navigator.vibrate) return;

  // ❌ desktop detect (disable vibration)
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isMobile) return;

  document.addEventListener("pointerdown", (e) => {
    const target = e.target;

    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest("[role='button']")
    ) {
      navigator.vibrate(15);  
    }
  });
};