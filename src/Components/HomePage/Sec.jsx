import React from "react";
// import "./HeroSection.css";

export default function HeroSection() {
  return (
    <section className="hero-wrapper py-5">
      {/* BACKGROUND SHAPES */}
      <div className="position-absolute hero-shapes">
        <svg className="light-orb orb-1" viewBox="0 0 800 800">
          <circle cx="400" cy="400" r="350" fill="url(#light-gradient-1)" />
          <defs>
            <radialGradient id="light-gradient-1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <svg className="light-orb orb-2" viewBox="0 0 600 600">
          <circle cx="300" cy="300" r="280" fill="url(#light-gradient-2)" />
          <defs>
            <radialGradient id="light-gradient-2">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <svg className="light-pattern pattern-1" viewBox="0 0 1000 1000">
          <circle cx="500" cy="500" r="400" fill="none" stroke="#6366f1" strokeWidth="2" opacity="0.05" strokeDasharray="20 10" />
          <rect x="200" y="200" width="600" height="600" rx="50" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.04" />
        </svg>
        <svg className="light-shape shape-1" viewBox="0 0 300 300">
          <path d="M150,20 C220,30 280,80 280,150 C280,220 220,270 150,280 C80,270 20,220 20,150 C20,80 80,30 150,20 Z" fill="#6366f1" opacity="0.08" />
        </svg>
        <svg className="light-shape shape-2" viewBox="0 0 250 250">
          <rect x="25" y="25" width="200" height="200" rx="40" fill="#8b5cf6" opacity="0.06" transform="rotate(45 125 125)" />
        </svg>
        <div className="light-pulse-elements">
          <div className="pulse-ring ring-1"></div>
          <div className="pulse-ring ring-2"></div>
        </div>
        <div className="light-dots">
          <div className="light-dot ld-1"></div>
          <div className="light-dot ld-2"></div>
          <div className="light-dot ld-3"></div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container py-5">
        <div className="row align-items-center min-vh-80">
          <div className="col-lg-6 col-md-10">
            <div className="content-wrapper">
              <div className="light-badge">🚀 Premium Digital Agency</div>
              <h1 className="hero-title">We Build <span className="text-accent">Amazing</span> Digital Experiences</h1>
              <h2 className="hero-subtitle">Specializing in <span className="text-gradient">UI/UX Design</span>, <span className="text-gradient">Web Development</span> & <span className="text-gradient">Digital Marketing</span></h2>
              <p className="hero-description">Transform your business with cutting-edge digital solutions. We create stunning user experiences, powerful web applications, and results-driven marketing strategies that drive growth and success.</p>

              <div className="stats-container">
                <div className="stat-item"><div className="stat-number">500+</div><div className="stat-label">Projects Completed</div></div>
                <div className="stat-item"><div className="stat-number">99+</div><div className="stat-label">Client Satisfaction</div></div>
                <div className="stat-item"><div className="stat-number">19+</div><div className="stat-label">Years Experience</div></div>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-3 align-items-center">
                <button className="cta-primary">Start Your Project 🚀</button>
                <button className="cta-secondary">View Our Work ✨</button>
              </div>

              <div className="trust-indicators d-none d-lg-flex">
                <div className="trust-item"><div className="trust-icon">✅</div>Award Winning</div>
                <div className="trust-item"><div className="trust-icon">🎯</div>Result Driven</div>
                <div className="trust-item"><div className="trust-icon">⭐</div>5-Star Rated</div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="hero-image-section">
              <div className="main-hero-container">
                <svg className="hero-main-bg" viewBox="0 0 600 600">
                  <circle cx="300" cy="300" r="280" fill="url(#light-main-gradient)" />
                  <defs>
                    <linearGradient id="light-main-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.08" />
                      <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.06" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="hero-image-wrapper">
                  <img src="/images/hero.png" alt="Digital Creative Team" className="main-hero-image"/>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-header"><div className="contact-icon">📞</div><div className="contact-title">Ready to Talk?</div></div>
                <div className="contact-number">(+91) 9918151032</div>
                <div className="contact-desc">24/7 Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
