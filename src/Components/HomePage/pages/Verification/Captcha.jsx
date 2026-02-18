// src/components/Captcha.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

const STYLES = {
  input: {
    borderRadius: "16px",
    padding: "14px 20px",
    border: "2px solid #f1f3f5",
    backgroundColor: "#f8f9fa",
    fontSize: "1rem",
    transition: "all 0.3s ease",
  }
};

export default function Captcha({ onVerify }) {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const canvasRef = useRef();

  // ✅ FIXED: Case-sensitive ke liye - UPPERCASE + lowercase mix
  const generateCaptcha = useCallback(() => {
    // 🔥 Ab isme UPPERCASE aur lowercase DONO honge
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";
    const text = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setCaptchaText(text);  // ✅ Original text preserve karo
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
    ctx.fillStyle = "#f1f3f5";
    ctx.fillRect(0, 0, width, height);

    // Distortion lines
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},0.7)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // Letters individually - EXACT text draw karo
    [...text].forEach((char, i) => {
      ctx.save();
      const fontSize = 24 + Math.random() * 8;
      ctx.font = `italic bold ${fontSize}px Arial`;
      ctx.fillStyle = `rgb(${Math.random()*100},${Math.random()*100},${Math.random()*100})`;
      const x = 20 + i * 25;
      const y = 25 + Math.random() * 20;
      const angle = (Math.random() - 0.5) * 0.5;
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(char, 0, 0);  // ✅ Original char draw karo
      ctx.restore();
    });

    // Random dots
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random()})`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, 1.5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }, [onVerify]);

  useEffect(() => generateCaptcha(), [generateCaptcha]);

  const handleChange = (e) => {
    const val = e.target.value;
    setUserInput(val);

    // 🔥 FIXED: Exact match - CASE SENSITIVE!
    if (val === captchaText) {  // ❌ toLowerCase() nahi!
      setIsVerified(true);
      onVerify(true);
    } else {
      setIsVerified(false);
      onVerify(false);
    }
  };

  return (
    <div className="bg-light p-3" style={{ borderRadius: "20px", border: "1px dashed #dee2e6" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <canvas ref={canvasRef} width="180" height="60" style={{ borderRadius: "12px" }} />
        <Button variant="light" size="sm" className="rounded-circle shadow-sm" onClick={generateCaptcha}>
          <i className="bi bi-arrow-clockwise fs-5"></i>
        </Button>
      </div>
      <InputGroup>
        <Form.Control
          style={{ ...STYLES.input, border: isVerified ? "2px solid #198754" : "2px solid #f1f3f5" }}
          placeholder="Type Captcha"
          value={userInput}
          onChange={handleChange}
        />
        {isVerified && (
          <InputGroup.Text className="bg-success text-white border-0" style={{ borderRadius: "0 16px 16px 0" }}>
            <i className="bi bi-check-lg"></i>
          </InputGroup.Text>
        )}
      </InputGroup>
    </div>
  );
}