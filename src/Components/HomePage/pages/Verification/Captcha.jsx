// src/components/Captcha.js
import React, { useState, useEffect, useRef, useCallback } from "react";

export default function Captcha({ onVerify }) {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const canvasRef = useRef(null);

  const generateCaptcha = useCallback(() => {
    const chars =
      "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";

    const text = Array.from({ length: 6 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");

    setCaptchaText(text);
    setUserInput("");
    setIsVerified(false);
    onVerify(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = 180;
    const height = 60;

    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, width, height);

    // Lines
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${
        Math.random() * 255
      }, ${Math.random() * 255}, 0.6)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // Letters
    [...text].forEach((char, i) => {
      ctx.save();
      const fontSize = 24 + Math.random() * 8;
      ctx.font = `italic bold ${fontSize}px Arial`;
      ctx.fillStyle = `rgb(${Math.random() * 100}, ${
        Math.random() * 100
      }, ${Math.random() * 100})`;

      const x = 20 + i * 25;
      const y = 35 + Math.random() * 10;
      const angle = (Math.random() - 0.5) * 0.5;

      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });

    // Dots
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random()})`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        1.5,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  }, [onVerify]);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const handleChange = (e) => {
    const val = e.target.value;
    setUserInput(val);

    if (val === captchaText) {
      setIsVerified(true);
      onVerify(true);
    } else {
      setIsVerified(false);
      onVerify(false);
    }
  };

  return (
    <div className="bg-light p-3 rounded-4 border border-dashed">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <canvas
          ref={canvasRef}
          width="180"
          height="60"
          className="rounded-3 border"
        />

        <button
          type="button"
          className="btn btn-light btn-sm rounded-circle shadow-sm"
          onClick={generateCaptcha}
        >
          <i className="bi bi-arrow-clockwise fs-5"></i>
        </button>
      </div>

      <div className="input-group">
        <input
          type="text"
          className={`form-control rounded-start-4 ${
            isVerified ? "border-success" : ""
          }`}
          placeholder="Type Captcha"
          value={userInput}
          onChange={handleChange}
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