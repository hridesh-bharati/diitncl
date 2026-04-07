import React, { useState, useEffect, useRef, useCallback } from "react";

export default function Captcha({ onVerify }) {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const canvasRef = useRef(null);

  // DRY: Ek hi function text generate aur draw karne ke liye
  const drawCaptcha = useCallback(() => {
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";
    const text = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

    setCaptchaText(text);
    setUserInput("");
    onVerify(false);

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // Reset & Background
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, 180, 60);

    // Minimal Noise (Lines & Dots)
    for (let i = 0; i < 20; i++) {
      ctx.strokeStyle = `rgba(0,0,0,${Math.random() * 0.2})`;
      ctx.beginPath();
      i < 5 ? ctx.moveTo(Math.random() * 180, Math.random() * 60) || ctx.lineTo(Math.random() * 180, Math.random() * 60) : 
           ctx.arc(Math.random() * 180, Math.random() * 60, 1, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Letters drawing
    text.split('').forEach((char, i) => {
      ctx.save();
      ctx.font = `italic bold ${24 + Math.random() * 8}px Arial`;
      ctx.fillStyle = `rgb(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100})`;
      ctx.translate(25 + i * 22, 35 + Math.random() * 10);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });
  }, [onVerify]);

  useEffect(() => drawCaptcha(), [drawCaptcha]);

  const isVerified = userInput === captchaText;

  const handleChange = (e) => {
    const val = e.target.value;
    setUserInput(val);
    onVerify(val === captchaText); // Direct call to parent
  };

  return (
    <div className="bg-light p-3 rounded-4  border-dashed">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <canvas ref={canvasRef} width="180" height="60" className="rounded-3 border bg-white" />
        <button type="button" className="btn btn-light btn-sm rounded-circle shadow-sm" onClick={drawCaptcha}>
          <i className="bi bi-arrow-clockwise fs-5"></i>
        </button>
      </div>

      <div className="input-group">
        <input
          type="text"
          className={`form-control rounded-start-4 ${isVerified ? "border-success bg-success-subtle" : ""}`}
          placeholder="Type Captcha"
          value={userInput}
          onChange={handleChange}
          autoComplete="off"
        />
        {isVerified && (
          <span className="input-group-text bg-success text-white border-0 rounded-end-4">
            <i className="bi bi-check-lg"></i>
          </span>
        )}
      </div>
    </div>
  );
}