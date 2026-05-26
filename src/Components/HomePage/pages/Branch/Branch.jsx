import React, { useEffect } from 'react';
import useTypingEffect from '../../../../hooks/useTypingEffect.js';
import useScrollAnimation from '../../../../hooks/useScrollAnimation.js'; // Your global hook
import Footer from '../../../Footer/Footer';
import QueryForm from '../About/QuickSupport.jsx';
import Counter from "./Counter";

const DATA = {
    TYPING_WORDS: ["Growing", "Faster", "Bigger"],
    
    // Core Job-Oriented IT Courses
    PROGRAMS: [
        { icon: 'bi-laptop', title: 'ADCA (Advanced Diploma)', text: 'Comprehensive 1-year master program covering MS Office, Advanced Excel, DTP, Graphic Design, and Tally Prime.', iconColor: 'text-primary', duration: '12 Months', fee: '₹6,500' },
        { icon: 'bi-calculator', title: 'Financial Accounting (Tally)', text: 'Professional corporate training in Tally Prime with GST, e-Way Billing, Payroll, Corporate Inventory, and Taxation modules.', iconColor: 'text-success', duration: '3 Months', fee: '₹4,000' },
        { icon: 'bi-code-slash', title: 'Web Dev & Python Programming', text: 'Frontend web engineering using HTML5, CSS3, Modern JavaScript, and object-oriented backend programming with Python.', iconColor: 'text-danger', duration: '6 Months', fee: '₹12,000' },
        { icon: 'bi-cpu', title: 'NIELIT CCC / O Level', text: 'Official government-aligned certification syllabus mapping designed specifically to crack state and central government job eligibility exams.', iconColor: 'text-warning', duration: '3 Mo / 1 Yr', fee: '₹3,500' },
    ],

    // Professional Branch Features
    FEATURES: [
        { icon: 'bi-cpu-fill', title: '1:1 Live Practical Lab', color: 'primary', desc: 'Dedicated individual workstation for every single student' },
        { icon: 'bi-clock-history', title: 'Flexible Batch Timings', color: 'danger', desc: 'Multiple batches operating continuously from 7 AM to 7 PM' },
        { icon: 'bi-patch-check-fill', title: 'Govt. Approved Certificates', color: 'success', desc: 'ISO 9001:2015 authenticated global standard grading' },
        { icon: 'bi-person-video3', title: 'Certified Technical Faculty', color: 'warning', desc: 'Highly experienced domain corporate mentors and teachers' }
    ],

    // Infrastructure Assets
    INFRASTRUCTURE: [
        { icon: 'bi-lightning-charge', title: 'Uninterrupted Power Supply', desc: 'Dual smart inverter backups coupled with heavy generator setups ensuring zero downtime for lab sessions.' },
        { icon: 'bi-journal-bookmark', title: 'Comprehensive Study Material', desc: 'Free access to premium printed technical handbooks, customized reference guides, and rich digital resource files.' },
        { icon: 'bi-shield-shaded', title: 'CCTV Surveillance & Safety', desc: 'Fully secure campus monitored 24/7 via ultra-high-definition cameras for complete safety of student batches.' }
    ],

    // Step-by-Step Admission Walkthrough
    STEPS: [
        { num: '01', title: 'Career Counseling', desc: 'Meet our senior technical counselors to analyze your background and discover the best curriculum.' },
        { num: '02', title: 'Free Demo Session', desc: 'Attend free live interactive theory and practical lab classes to experience our premium training standard.' },
        { num: '03', title: 'Batch Allocation', desc: 'Choose your preferred operating morning or evening slot timings and secure your dedicated workstation lab seat.' }
    ],

    // Student Testimonials
    REVIEWS: [
        { name: "Anjali Mishra", course: "ADCA Graduate", text: "The individual 1:1 computer facility at the Thuthibari branch completely changed my confidence. Teachers are incredibly supportive during practical hours.", stars: 5 },
        { name: "Vikram Pratap Singh", course: "Tally Prime Certified", text: "Best IT learning environment. The accounting course layout is deeply practical, and the study materials provided helped me secure an immediate accountant role.", stars: 5 }
    ],

    HERO_IMAGES: ['/images/library/d1.jpg', '/images/library/d2.jpg']
};

export default function Branch() {
    const typingText = useTypingEffect(DATA.TYPING_WORDS);
    
    // Activating your highly optimized scroll animations hook
    useScrollAnimation();

    useEffect(() => {
        // Advanced Semantic Search Engine Optimization (SEO Meta-tags)
        document.title = "Drishtee Computer Center Thuthibari Branch | Leading IT Training Institute";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Discover Drishtee Computer Center Thuthibari Branch (Est. 2018). Offering expert certified technical programs including ADCA, DCA, Tally Prime with GST, Python, and NIELIT CCC with 100% placement support.");
        }
    }, []);

    return (
        <div className="bg-light min-vh-100 no-scrollbar overflow-x-hidden">
            
            {/* Header Area */}
            <header className="text-center py-5 text-white shadow-sm" 
                    style={{ background: 'linear-gradient(135deg, #00268f 0%, #0052D4 100%)', borderRadius: '0 0 40px 40px', paddingBottom: '80px' }}>
                <h1 className="fw-bold display-5 mb-0 tracking-tight">DRISHTEE</h1>
                <p className="small text-uppercase opacity-75 mb-3 tracking-widest">Institute of Information Technology (Thuthibari Branch)</p>
                <div className="bg-white bg-opacity-10 px-4 py-1 rounded-pill d-inline-block border border-white border-opacity-25 shadow-sm">
                    <span className="small fw-bold text-warning">Drishtee is <span className="text-white">{typingText}</span></span>
                </div>
            </header>

            {/* Counter Component Overlap Wrapper */}
            <div className="container position-relative" style={{ marginTop: '-40px', zIndex: 5 }}>
                <Counter />
            </div>

            {/* Main Application Container */}
            <main className="container py-5">
                
                {/* 1. Welcoming & Informative Brand Briefing */}
                <section className="row g-4 mb-5 align-items-center" aria-label="Branch Briefing">
                    <div className="col-lg-6 slide-in-left">
                        <article className="bg-white p-4 rounded-4 shadow-sm border-start border-4 border-primary h-100">
                            <span className="text-uppercase small fw-bold text-primary mb-2 d-block tracking-wider">Established Excellence Since 2018</span>
                            <h2 className="fw-bold mb-3 fs-3 text-dark">Welcome to <span className="text-primary">Drishtee Thuthibari</span></h2>
                            <p className="text-muted small mb-3" style={{ lineHeight: '1.7' }}>
                                Drishtee Computer Center (Thuthibari Branch) was established in <b>2018</b> to empower regional youth with high-grade digital literacy and global employment opportunities. Operating symmetrically with our corporate <b>Head Branch in Nichlaul</b>, this branch features advanced tech frameworks, state-of-the-art infrastructure, and dedicated mentorship.
                            </p>
                            <p className="text-muted small mb-4" style={{ lineHeight: '1.7' }}>
                                All diplomas and professional certificates awarded upon curriculum completion are fully aligned with industry protocols and valid across all national public and private sector employment avenues.
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                {['ISO 9001:2015 Certified', 'Govt. Act Registered', 'Complimentary Demo Classes'].map((txt, i) => (
                                    <span key={i} className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-3 py-2 rounded-pill small fw-bold">
                                        {txt}
                                    </span>
                                ))}
                            </div>
                        </article>
                    </div>
                    
                    {/* Branch Media Showcase Carousel */}
                    <div className="col-lg-6 slide-in-right">
                        <div id="branchHeroCarousel" className="carousel slide rounded-4 overflow-hidden shadow-sm" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                {DATA.HERO_IMAGES.map((img, i) => (
                                    <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                                        <img src={img} 
                                             className="d-block w-100" 
                                             style={{ height: '300px', objectFit: 'cover' }} 
                                             alt="Drishtee Computer Center Thuthibari Advanced Laboratory Architecture" 
                                             loading={i === 0 ? "eager" : "lazy"} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. core Core Structural Branch Features Grid */}
                <section className="mb-5" aria-label="Branch Metrics">
                    <div className="row g-3">
                        {DATA.FEATURES.map((f, i) => (
                            <div className="col-6 col-md-3 fade-up" key={i}>
                                <div className="bg-white p-3 rounded-4 shadow-sm h-100 text-center border-bottom border-2 border-light transition-hover">
                                    <div className={`mb-2 mx-auto d-flex align-items-center justify-content-center bg-${f.color} bg-opacity-10 rounded-circle`} style={{ width: '50px', height: '50px' }}>
                                        <i className={`bi ${f.icon} fs-4 text-${f.color}`}></i>
                                    </div>
                                    <h3 className="fw-bold mb-1 fs-6 text-dark">{f.title}</h3>
                                    <p className="text-muted mb-0 small" style={{ fontSize: '11px' }}>{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Job-Oriented Computer Programs / Catalog */}
                <section className="mb-5" aria-label="Available Programs">
                    <h2 className="fw-bold text-center mb-1 fs-3 text-dark">Our Professional <span className="text-primary">Computer Courses</span></h2>
                    <p className="text-muted text-center small mb-4">In-demand skill architectures structured to secure corporate roles and clear government exam parameters</p>
                    <div className="row g-3">
                        {DATA.PROGRAMS.map((p, i) => (
                            <div className="col-md-3 fade-up" key={i}>
                                <div className="bg-white p-3 rounded-4 shadow-sm h-100 d-flex flex-column border transition-hover">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <i className={`bi ${p.icon} h4 ${p.iconColor}`}></i>
                                        <span className="badge bg-light text-muted border fw-medium px-2 py-1" style={{ fontSize: '11px' }}>{p.duration}</span>
                                    </div>
                                    <h3 className="fw-bold h6 text-dark mb-2">{p.title}</h3>
                                    <p className="text-muted flex-grow-1" style={{ fontSize: '0.75rem', lineHeight: '1.5' }}>{p.text}</p>
                                    <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                                        <div>
                                            <small className="text-muted d-block" style={{ fontSize: '9px' }}>Standard Tuition</small>
                                            <span className="fw-bold text-dark" style={{ fontSize: '14px' }}>{p.fee}</span>
                                        </div>
                                        <button className="btn btn-sm btn-primary rounded-pill px-3 fw-bold" style={{ fontSize: '11px' }}>Course Specs</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. NEW SECTION - Admission Step-by-Step Flowchart */}
                <section className="mb-5 py-4 bg-white rounded-4 px-3 shadow-sm fade-up" aria-label="Admission Procedure">
                    <h3 className="fw-bold text-dark text-center mb-1 fs-4">Simplifying Your <span className="text-primary">Enrollment Path</span></h3>
                    <p className="text-muted text-center small mb-4">Follow three simple, transparent actions to unlock your career potential</p>
                    <div className="row g-3">
                        {DATA.STEPS.map((step, idx) => (
                            <div key={idx} className="col-md-4 zoom-in">
                                <div className="p-3 border rounded-3 h-100 position-relative bg-light">
                                    <span className="position-absolute top-0 end-0 m-2 fw-bolder text-primary opacity-25 display-6">{step.num}</span>
                                    <h4 className="fw-bold fs-6 text-dark mb-2 pe-4">{step.title}</h4>
                                    <p className="text-muted mb-0 small" style={{ lineHeight: '1.4' }}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. Fully Instrumented Branch Infrastructure Section */}
                <section className="mb-5 py-4 bg-white rounded-4 px-3 shadow-sm fade-up" aria-label="Infrastructure Assets">
                    <h4 className="fw-bold text-dark text-center mb-4"><i className="bi bi-building-check text-primary me-2"></i>Campus Amenities & Safety Protocol</h4>
                    <div className="row g-3">
                        {DATA.INFRASTRUCTURE.map((item, idx) => (
                            <div key={idx} className="col-md-4 zoom-in">
                                <div className="p-3 bg-light rounded-3 h-100">
                                    <h5 className="fw-bold fs-6 text-dark mb-2">
                                        <i className={`bi ${item.icon} text-primary me-2`}></i>{item.title}
                                    </h5>
                                    <p className="text-muted mb-0 small" style={{ lineHeight: '1.4' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 6. NEW SECTION - Alumni Success Stories / Student Testimonials */}
                <section className="mb-5 fade-up" aria-label="Student Reviews">
                    <h4 className="fw-bold text-dark text-center mb-1 fs-4">What Our <span className="text-primary">Students Say</span></h4>
                    <p className="text-muted text-center small mb-4">Real, unedited learning experiences from our Thuthibari branch graduates</p>
                    <div className="row g-3">
                        {DATA.REVIEWS.map((rev, index) => (
                            <div key={index} className="col-md-6 zoom-in">
                                <div className="bg-white p-4 rounded-4 border shadow-sm h-100 d-flex flex-column justify-content-between">
                                    <p className="text-muted fst-italic small mb-3">"{rev.text}"</p>
                                    <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                                        <div>
                                            <h6 className="fw-bold text-dark mb-0 small">{rev.name}</h6>
                                            <small className="text-primary" style={{ fontSize: '10px' }}>{rev.course}</small>
                                        </div>
                                        <div className="text-warning small">
                                            {Array(rev.stars).fill().map((_, i) => <i key={i} className="bi bi-star-fill me-1"></i>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 7. Localized Mapping & Support Framework */}
                <section className="mb-5 fade-up" aria-label="Location Map and Contacts">
                    <h4 className="fw-bold text-dark mb-3"><i className="bi bi-geo-alt-fill text-danger me-2"></i>Find Our Campus / File an Inquiry</h4>
                    <div className="row g-0 rounded-4 overflow-hidden shadow-sm bg-white border">
                        <div className="col-lg-7">
                            <iframe 
                                title="Drishtee Computer Center Thuthibari Branch Map Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3546.7457782638843!2d83.6841235!3d27.2582136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39943bd1c5555555%3A0x7cc3ee23ba40a7cf!2sDrishtee%20Computer%20Center!5e0!3m2!1sen!2sin!4v1710000000000" 
                                width="100%" 
                                height="380" 
                                className="w-100 border-0" 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade" />
                        </div>
                        <div className="col-lg-5 d-flex flex-column justify-content-center bg-white">
                            <div className="p-2 border-bottom bg-light text-center">
                                <small className="text-muted fw-bold"><i className="bi bi-pin-angle-fill text-danger me-1"></i>Location: Nichlaul Road, Thuthibari, Maharajganj, U.P.</small>
                            </div>
                            <QueryForm />
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {/* Mobile Adaptive Floating Action Control Grid */}
            <div className="fixed-bottom p-3 d-md-none" style={{ zIndex: 1050 }}>
                <div className="d-flex gap-2 p-2 bg-white bg-opacity-90 rounded-4 shadow-lg border border-white" style={{ backdropFilter: 'blur(10px)' }}>
                    <a href="tel:+917398889347" className="btn btn-primary flex-grow-1 rounded-3 fw-bold py-2 shadow-sm">Call Branch Desk</a>
                    <a href="https://wa.me/917398889347" className="btn btn-success rounded-3 px-3 shadow-sm d-flex align-items-center" aria-label="Instant WhatsApp Connection">
                        <i className="bi bi-whatsapp fs-5"></i>
                    </a>
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
                .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
                .transition-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
                .transition-hover:hover { transform: translateY(-5px); box-shadow: 0 0.5rem 1.5rem rgba(0,0,0,0.08) !important; }
            `}</style>
        </div>
    );
}