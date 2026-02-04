import React from "react";
import CountdownTimer from "./Counter";
import LibraryFeatures from "./LibraryFeatures";
import ScrollUp from "../../../HelperCmp/Scroller/ScrollUp";
import QueryForm from "../QueryFrom";

/* =======================
   STYLING
======================= */
const appStyle = {
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
};

const STATS = [
    { icon: "bi-book", label: "Digital Books", value: "50k+", color: "#6366f1", description: "E-books & PDFs" },
    { icon: "bi-person-badge", label: "Successful Toppers", value: "500+", color: "#10b981", description: "From Our Library" },
    { icon: "bi-clock-history", label: "Study Hours", value: "24/7", color: "#f59e0b", description: "Unlimited Access" },
    { icon: "bi-wifi", label: "High-Speed WiFi", value: "5G", color: "#3b82f6", description: "Fiber Optic" },
    { icon: "bi-laptop", label: "Study Pods", value: "120+", color: "#8b5cf6", description: "Private Spaces" },
    { icon: "bi-cup-hot", label: "Coffee Bar", value: "Free", color: "#ef4444", description: "Unlimited Refills" },
];

const FEATURES = [
    {
        title: "Digital Resource Center",
        description: "Access to 50,000+ e-books, research papers, and study materials for UPSC, NEET, and other competitive exams.",
        icon: "bi-laptop",
        color: "#3b82f6"
    },
    {
        title: "24/7 Study Environment",
        description: "Round-the-clock access with secure biometric entry, perfect for night owls and early birds.",
        icon: "bi-clock",
        color: "#10b981"
    },
    {
        title: "Expert Guidance Sessions",
        description: "Weekly workshops by subject matter experts and previous year toppers.",
        icon: "bi-people",
        color: "#f59e0b"
    },
    {
        title: "Smart Study Pods",
        description: "Sound-proof cubicles with charging ports, LED lighting, and adjustable furniture.",
        icon: "bi-door-closed",
        color: "#8b5cf6"
    },
    {
        title: "High-Speed Internet",
        description: "5G WiFi connectivity with dedicated bandwidth for research and online classes.",
        icon: "bi-wifi",
        color: "#6366f1"
    },
    {
        title: "Print & Scan Facility",
        description: "High-quality printing, scanning, and photocopying services available.",
        icon: "bi-printer",
        color: "#ef4444"
    }
];

const MEMBERSHIP_PLANS = [
    {
        name: "Basic Plan",
        price: "₹1,999",
        duration: "per month",
        features: ["8 Hours Daily Access", "WiFi Access", "Study Material", "Basic Printing"],
        popular: false,
        color: "border-primary"
    },
    {
        name: "Premium Plan",
        price: "₹4,999",
        duration: "per month",
        features: ["24/7 Access", "Priority WiFi", "Private Pod", "Unlimited Printing", "Coffee Bar Access"],
        popular: true,
        color: "border-warning"
    },
    {
        name: "Pro Plan",
        price: "₹11,999",
        duration: "per quarter",
        features: ["All Premium Features", "Mentor Sessions", "Locker Access", "Group Study Room", "Exam Simulation"],
        popular: false,
        color: "border-success"
    }
];

/* =======================
   MAIN COMPONENT
======================= */

export default function Library() {
    return (
        <div style={appStyle}>
            
            {/* 1. HERO SECTION */}
            <div className="position-relative" style={{ height: "100vh", width: "100%" }}>
                <img 
                    src="images/library/library.webp" 
                    alt="Modern Library Interior" 
                    className="w-100 h-100" 
                    style={{ objectFit: "cover" }} 
                />
                
                {/* Gradient Overlay */}
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-4 p-md-5"
                    style={{ 
                        background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.4) 60%, transparent 100%)"
                    }}>
                    
                    <div className="mb-5 pb-3">
                        <span className="badge bg-primary mb-3 px-3 py-2 rounded-pill shadow-sm fw-bold">
                            <i className="bi bi-star-fill me-2"></i>PREMIUM STUDY HUB
                        </span>
                        <h1 className="text-white fw-bold display-4 mb-3">Ultimate Learning Sanctuary</h1>
                        <p className="text-white-50 fs-5 mb-4 pe-lg-5">
                            Lucknow's most advanced digital library designed for serious civil services, 
                            medical, and engineering aspirants. Experience focused learning like never before.
                        </p>
                        
                        <div className="d-flex flex-wrap gap-3 mt-4">
                            <button className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow d-flex align-items-center">
                                <i className="bi bi-calendar-check me-2"></i> Book Tour
                            </button>
                            <button className="btn btn-outline-light btn-lg rounded-pill px-5 py-3 shadow-sm d-flex align-items-center">
                                <i className="bi bi-play-circle me-2"></i> Virtual Tour
                            </button>
                        </div>
                    </div>
                </div>

                {/* Simple Floating Contact */}
                <div className="position-absolute top-3 end-3">
                    <button className="btn btn-light rounded-pill px-4 py-2 shadow-sm fw-bold d-flex align-items-center">
                        <i className="bi bi-telephone-fill text-primary me-2"></i>
                        <span className="d-none d-md-inline">Call: </span>0522-XXXXXXX
                    </button>
                </div>
            </div>

            {/* 2. ENHANCED STATS SECTION */}
            <div className="container py-5">
                <div className="row g-4">
                    {STATS.map((stat, index) => (
                        <div key={index} className="col-6 col-md-4 col-lg-2">
                            <div className="card border-0 shadow-lg text-center p-3 rounded-4 bg-white h-100 hover-lift">
                                <div className="mb-3">
                                    <div className="rounded-circle p-3 d-inline-flex" 
                                         style={{ backgroundColor: `${stat.color}15` }}>
                                        <i className={`bi ${stat.icon} fs-3`} style={{ color: stat.color }}></i>
                                    </div>
                                </div>
                                <h3 className="fw-bold mb-1">{stat.value}</h3>
                                <div className="text-dark fw-bold small mb-1">{stat.label}</div>
                                <div className="text-muted" style={{ fontSize: '11px' }}>{stat.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. LIBRARY FEATURES SECTION */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold display-6 mb-3">World-Class Facilities</h2>
                        <p className="text-muted lead">Everything you need for productive study sessions</p>
                    </div>
                    
                    <div className="row g-4">
                        {FEATURES.map((feature, index) => (
                            <div key={index} className="col-md-6 col-lg-4">
                                <div className="card border-0 shadow-sm h-100 hover-lift p-4 rounded-4">
                                    <div className="mb-4">
                                        <div className="rounded-circle p-3 d-inline-flex" 
                                             style={{ backgroundColor: `${feature.color}15` }}>
                                            <i className={`bi ${feature.icon} fs-3`} style={{ color: feature.color }}></i>
                                        </div>
                                    </div>
                                    <h4 className="fw-bold mb-3">{feature.title}</h4>
                                    <p className="text-muted mb-0">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. MEMBERSHIP PLANS */}
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold display-6 mb-3">Flexible Membership Plans</h2>
                        <p className="text-muted">Choose the plan that fits your study schedule</p>
                    </div>
                    
                    <div className="row g-4 justify-content-center">
                        {MEMBERSHIP_PLANS.map((plan, index) => (
                            <div key={index} className="col-md-6 col-lg-4">
                                <div className={`card border-3 ${plan.color} border-0 shadow-lg h-100 rounded-4 overflow-hidden ${plan.popular ? 'mt-n3' : ''}`}>
                                    {plan.popular && (
                                        <div className="bg-warning text-dark text-center py-2 fw-bold">
                                            <i className="bi bi-star-fill me-2"></i>MOST POPULAR
                                        </div>
                                    )}
                                    <div className="card-body p-4">
                                        <h3 className="fw-bold mb-3">{plan.name}</h3>
                                        <div className="mb-4">
                                            <span className="display-4 fw-bold">{plan.price}</span>
                                            <span className="text-muted">/{plan.duration}</span>
                                        </div>
                                        <ul className="list-unstyled mb-4">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="mb-2">
                                                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <button className={`btn ${plan.popular ? 'btn-warning' : 'btn-primary'} w-100 py-3 rounded-pill fw-bold`}>
                                            Select Plan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. STUDENT LIFE SECTION */}
            <section className="py-5">
                <div className="container">
                    <div className="mb-5">
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div style={{ width: "6px", height: "40px", backgroundColor: "#0d6efd", borderRadius: "10px" }}></div>
                            <div>
                                <h3 className="fw-bold mb-1">Student Life at Drishtee</h3>
                                <p className="text-muted">Experience the vibrant community of learners</p>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-5 shadow-lg overflow-hidden border">
                            <LibraryFeatures />
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. COUNTDOWN TIMER SECTION */}
            <section className="container mb-5">
                <div className="card border-0 bg-gradient text-white p-4 p-md-5 rounded-5 shadow-lg overflow-hidden position-relative"
                     style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                    <div className="position-relative" style={{ zIndex: 2 }}>
                        <div className="text-center mb-4">
                            <h3 className="fw-bold mb-2">Next Entrance Exam</h3>
                            <p className="text-white-75">Start your preparation journey today</p>
                        </div>
                        <CountdownTimer />
                        <div className="text-center mt-4">
                            <button className="btn btn-light rounded-pill px-5 py-3 fw-bold shadow">
                                <i className="bi bi-calendar2-week me-2"></i> View Exam Calendar
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. CONTACT & LOCATION SECTION */}
            <section className="container mb-5">
                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="bg-white rounded-5 shadow-lg overflow-hidden border h-100">
                            <div className="p-4 p-md-5">
                                <h4 className="fw-bold mb-2">Visit Our Campus</h4>
                                <p className="text-muted mb-4">Schedule a visit or virtual tour of our facilities</p>
                                <div style={{ height: "300px", borderRadius: "20px", overflow: "hidden" }}>
                                    <iframe
                                        title="Drishtee Library Location"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.102257750857!2d80.94641531504386!3d26.84140408316062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd991f32b16b%3A0x93ccba8909978be!2sLucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1647851551234!5m2!1sen!2sin"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="bg-white rounded-5 shadow-lg overflow-hidden border h-100">
                            <div className="p-4 p-md-5">
                                <h4 className="fw-bold mb-3">Quick Inquiry</h4>
                                <p className="text-muted small mb-4">Get instant response from our team</p>
                                <QueryForm />
                                <div className="mt-4 pt-3 border-top">
                                    <div className="d-flex align-items-center mb-3">
                                        <i className="bi bi-geo-alt-fill text-primary fs-4 me-3"></i>
                                        <div>
                                            <div className="fw-bold">Address</div>
                                            <div className="text-muted small">Drishtee Study Hub, Gomti Nagar, Lucknow</div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-clock-fill text-warning fs-4 me-3"></i>
                                        <div>
                                            <div className="fw-bold">Opening Hours</div>
                                            <div className="text-muted small">24/7 for Premium Members</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. FOOTER */}
            <footer className="bg-dark text-white py-5">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-4">
                            <h4 className="fw-bold mb-4">Drishtee Study Hub</h4>
                            <p className="text-white-50">
                                Premier digital library providing world-class study environment for 
                                competitive exam aspirants since 2015.
                            </p>
                        </div>
                        <div className="col-lg-4">
                            <h6 className="fw-bold mb-3">Quick Links</h6>
                            <div className="d-flex flex-column gap-2">
                                <a href="#features" className="text-white-50 text-decoration-none">Facilities</a>
                                <a href="#membership" className="text-white-50 text-decoration-none">Membership</a>
                                <a href="#resources" className="text-white-50 text-decoration-none">E-Resources</a>
                                <a href="#contact" className="text-white-50 text-decoration-none">Contact</a>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <h6 className="fw-bold mb-3">Contact Info</h6>
                            <div className="d-flex flex-column gap-2">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-telephone text-primary me-2"></i>
                                    <span className="text-white-50">0522-XXXXXXX</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-whatsapp text-success me-2"></i>
                                    <span className="text-white-50">+91 XXXXX XXXXX</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-envelope text-warning me-2"></i>
                                    <span className="text-white-50">info@drishteelibrary.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-5 pt-3 border-top border-white-10">
                        <p className="text-white-50 small mb-0">© 2024 Drishtee Study Hub. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            <ScrollUp />
        </div>
    );
}

/* =======================
   ADD TO YOUR CSS FILE
======================= */
/*
.hover-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
}
*/