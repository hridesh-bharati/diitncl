import React from "react";
import "./HeroSection.css";

export default function HeroSection() {
    return (
        <section className="position-relative overflow-hidden hero-wrapper py-5">
            {/* ==== MASSIVE BACKGROUND SVG SHAPES ==== */}
            <div className="position-absolute hero-shapes">
                {/* Giant Animated Background Orbs */}
                <svg className="massive-orb orb-1" viewBox="0 0 800 800">
                    <circle cx="400" cy="400" r="350" fill="url(#massive-gradient-1)" />
                    <defs>
                        <radialGradient id="massive-gradient-1">
                            <stop offset="0%" stopColor="#667eea" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#667eea" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>

                <svg className="massive-orb orb-2" viewBox="0 0 600 600">
                    <circle cx="300" cy="300" r="280" fill="url(#massive-gradient-2)" />
                    <defs>
                        <radialGradient id="massive-gradient-2">
                            <stop offset="0%" stopColor="#764ba2" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#764ba2" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>

                {/* Huge Geometric Patterns */}
                <svg className="huge-pattern pattern-1" viewBox="0 0 1000 1000">
                    <circle cx="500" cy="500" r="400" fill="none" stroke="#667eea" strokeWidth="3" opacity="0.08" strokeDasharray="20 10" />
                    <rect x="200" y="200" width="600" height="600" rx="50" fill="none" stroke="#764ba2" strokeWidth="2" opacity="0.06" />
                    <polygon points="500,100 800,500 500,900 200,500" fill="none" stroke="#f093fb" strokeWidth="2" opacity="0.05" />
                </svg>

                {/* Extra Large Floating Shapes */}
                <svg className="xl-shape xl-shape1" viewBox="0 0 300 300">
                    <path d="M150,20 C220,30 280,80 280,150 C280,220 220,270 150,280 C80,270 20,220 20,150 C20,80 80,30 150,20 Z"
                        fill="#667eea" opacity="0.15" />
                </svg>

                <svg className="xl-shape xl-shape2" viewBox="0 0 250 250">
                    <rect x="25" y="25" width="200" height="200" rx="40" fill="#764ba2" opacity="0.12" transform="rotate(45 125 125)" />
                </svg>

                <svg className="xl-shape xl-shape3" viewBox="0 0 280 280">
                    <polygon points="140,20 250,140 140,260 30,140" fill="#f093fb" opacity="0.18" />
                </svg>

                <svg className="xl-shape xl-shape4" viewBox="0 0 320 320">
                    <circle cx="160" cy="160" r="140" fill="none" stroke="#4facfe" strokeWidth="4" opacity="0.2" strokeDasharray="15 8" />
                </svg>

                {/* Massive Connection Network */}
                <svg className="massive-network" viewBox="0 0 1200 800">
                    <path d="M100,400 Q400,100 700,300 Q1000,500 1100,400" stroke="url(#network-gradient)" strokeWidth="3" opacity="0.15" fill="none" />
                    <path d="M200,200 Q500,50 800,200 Q1100,350 1000,600" stroke="url(#network-gradient)" strokeWidth="3" opacity="0.12" fill="none" />
                    <path d="M50,600 Q300,700 600,500 Q900,300 1150,200" stroke="url(#network-gradient)" strokeWidth="3" opacity="0.1" fill="none" />
                    <defs>
                        <linearGradient id="network-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#667eea" />
                            <stop offset="50%" stopColor="#764ba2" />
                            <stop offset="100%" stopColor="#f093fb" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Giant Pulsing Elements */}
                <div className="giant-pulse-elements">
                    <div className="pulse-ring ring-1"></div>
                    <div className="pulse-ring ring-2"></div>
                    <div className="pulse-ring ring-3"></div>
                </div>

                {/* Floating Mega Dots */}
                <div className="mega-dots">
                    <div className="mega-dot md-1"></div>
                    <div className="mega-dot md-2"></div>
                    <div className="mega-dot md-3"></div>
                    <div className="mega-dot md-4"></div>
                    <div className="mega-dot md-5"></div>
                </div>
            </div>

            {/* ==== MAIN CONTENT ==== */}
            <div className="container py-5">
                <div className="row align-items-center min-vh-80">
                    {/* Text Content - Left Side */}
                    <div className="col-lg-6 col-md-10">
                        <div className="content-wrapper">
                            {/* Animated Badge */}
                            <div className="pre-title-badge">
                                <span>🚀 Premium Digital Agency</span>
                            </div>

                            <h1 className="display-3 fw-black mb-4 hero-title mega-text">
                                We Build <span className="text-stroke">Amazing</span> Digital Experiences
                            </h1>

                            <h2 className="display-6 fw-bold mb-4 hero-subtitle">
                                Specializing in <span className="text-gradient">UI/UX Design</span>,{" "}
                                <span className="text-gradient">Web Development</span> &{" "}
                                <span className="text-gradient">Digital Marketing</span>
                            </h2>

                            <p className="lead mb-5 hero-description giant-text">
                                Transform your business with cutting-edge digital solutions.
                                We create stunning user experiences, powerful web applications,
                                and results-driven marketing strategies that drive growth and success.
                            </p>

                            {/* Enhanced Stats */}
                            <div className="mega-stats-container mb-5">
                                <div className="mega-stat-item">
                                    <div className="mega-stat-number" data-count="500">0</div>
                                    <div className="mega-stat-label">Projects Completed</div>
                                </div>
                                <div className="mega-stat-item">
                                    <div className="mega-stat-number" data-count="99">0</div>
                                    <div className="mega-stat-label">Client Satisfaction</div>
                                </div>
                                <div className="mega-stat-item">
                                    <div className="mega-stat-number" data-count="8">0</div>
                                    <div className="mega-stat-label">Years Experience</div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex flex-column flex-sm-row gap-4 align-items-center">
                                <button className="btn btn-primary btn-lg px-5 py-3 rounded-pill hero-cta mega-button">
                                    <span className="btn-text">Start Your Project</span>
                                    <span className="btn-icon">🚀</span>
                                </button>

                                <button className="btn btn-outline-primary btn-lg px-5 py-3 rounded-pill hero-cta-secondary">
                                    <span className="btn-text">View Our Work</span>
                                    <span className="btn-icon">✨</span>
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="trust-badges mt-5 d-none d-lg-block">
                                <div className="trust-item">
                                    <div className="trust-icon">🎓</div>
                                    <span>Expert Training</span>
                                </div>
                                <div className="trust-item">
                                    <div className="trust-icon">🖥️</div>
                                    <span>Modern Lab</span>
                                </div>
                                <div className="trust-item">
                                    <div className="trust-icon">📜</div>
                                    <span>Certification</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image Section - Right Side */}
                    <div className="col-lg-6">
                        <div className="hero-image-section">
                            {/* Main Hero Container */}
                            <div className="main-hero-container">
                                {/* Background Elements */}
                                <svg className="hero-main-bg" viewBox="0 0 600 600">
                                    <circle cx="300" cy="300" r="280" fill="url(#hero-main-gradient)" />
                                    <defs>
                                        <linearGradient id="hero-main-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#667eea" stopOpacity="0.15" />
                                            <stop offset="50%" stopColor="#764ba2" stopOpacity="0.1" />
                                            <stop offset="100%" stopColor="#f093fb" stopOpacity="0.12" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                {/* Main Hero Image */}
                                <div className="hero-image-wrapper">
                                    <img
                                        src="/images/hero.png"
                                        alt="Digital Creative Team"
                                        className="main-hero-image"
                                    />

                                    {/* Animated Frame */}
                                    <div className="hero-image-frame"></div>
                                </div>

                                {/* Floating Service Cards */}
                                <div className="floating-service-cards">
                                    <div className="service-card sc-1">
                                        <div className="card-icon">🎨</div>
                                        <div className="card-content">
                                            <div className="card-title">UI/UX Design</div>
                                            <div className="card-desc">Beautiful Interfaces</div>
                                        </div>
                                    </div>

                                    <div className="service-card sc-2">
                                        <div className="card-icon">💻</div>
                                        <div className="card-content">
                                            <div className="card-title">Web Development</div>
                                            <div className="card-desc">Powerful Solutions</div>
                                        </div>
                                    </div>

                                    <div className="service-card sc-3">
                                        <div className="card-icon">📈</div>
                                        <div className="card-content">
                                            <div className="card-title">Digital Marketing</div>
                                            <div className="card-desc">Growth Strategies</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Animated Elements Around Hero */}
                                <div className="hero-animated-elements">
                                    <div className="animated-element ae-1">⚡</div>
                                    <div className="animated-element ae-2">🌟</div>
                                    <div className="animated-element ae-3">💫</div>
                                    <div className="animated-element ae-4">🔥</div>
                                </div>
                            </div>

                            {/* Contact Info Card */}
                            <div className="contact-card">
                                <div className="contact-header">
                                    <div className="contact-icon">📞</div>
                                    <div className="contact-title">Ready to Talk?</div>
                                </div>
                                <div className="contact-number">(0123) 456 - 789</div>
                                <div className="contact-desc">24/7 Support Available</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}