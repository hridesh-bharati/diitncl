import { useState, useEffect } from "react";

/**
 * Custom Hook for Typing Effect
 * @param {Array} words - List of strings to type
 * @param {number} typingSpeed - Speed in ms for typing
 * @param {number} deletingSpeed - Speed in ms for deleting
 * @param {number} pauseTime - Wait time before deleting starts
 */
const useTypingEffect = (words = [], typingSpeed = 70, deletingSpeed = 40, pauseTime = 1200) => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const currentWord = words[wordIndex];
    let timer;

    if (!isDeleting && charIndex < currentWord.length) {
      // Typing Phase
      timer = setTimeout(() => {
        setText(currentWord.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
    } else if (isDeleting && charIndex > 0) {
      // Deleting Phase
      timer = setTimeout(() => {
        setText(currentWord.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, deletingSpeed);
    } else if (!isDeleting && charIndex === currentWord.length) {
      // Finished typing, wait then start deleting
      timer = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting, move to next word
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return text;
};

export default useTypingEffect;