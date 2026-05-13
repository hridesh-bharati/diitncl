import React, { useEffect } from 'react';
import useTypingEffect from '../../../../hooks/useTypingEffect.js';
import Footer from '../../../Footer/Footer';
import QueryForm from '../About/QuickSupport.jsx';
import Counter from "./Counter";

const DATA = {
    TYPING_WORDS: ["Growing", "Faster", "Bigger"],
    PROGRAMS: [
        { icon: 'bi-laptop', title: 'Web Development', text: 'Build websites & apps.', iconColor: 'text-primary', duration: '6 Mo', fee: '₹15,000' },
        { icon: 'bi-graph-up', title: 'Data Science', iconColor: 'text-success', text: 'Learn AI & ML.', duration: '8 Mo', fee: '₹20,000' },
        { icon: 'bi-phone', title: 'Mobile App', iconColor: 'text-danger', text: 'Android & iOS.', duration: '5 Mo', fee: '₹18,000' }
    ],
    FEATURES: [
        { icon: 'bi-person-circle', title: 'Expert Guidance', color: 'primary' },
        { icon: 'bi-clock', title: 'Flexible Timings', color: 'danger' },
        { icon: 'bi-mortarboard', title: 'Certifications', color: 'success' }
    ],
    HERO_IMAGES: ['/images/library/d1.jpg', '/images/library/d2.jpg']
};

export default function Branch() {
    const typingText = useTypingEffect(DATA.TYPING_WORDS);

    useEffect(() => {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => e.isIntersecting && e.target.classList.add('v-show'));
        }, { threshold: 0.1 });
        document.querySelectorAll(".v-hide").forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    return (
        <div className="bg-light min-vh-100 overflow-hidden">
            {/* Minimal Header */}
            <header className="text-center py-5 text-white shadow-sm" 
                    style={{ background: 'linear-gradient(135deg, #00268f 0%, #0052D4 100%)', borderRadius: '0 0 40px 40px', paddingBottom: '80px' }}>
                <h1 className="fw-bold display-5 mb-0">DRISHTEE</h1>
                <p className="small opacity-75 mb-3">Institute of Information Technology</p>
                <div className="bg-white bg-opacity-10 px-4 py-1 rounded-pill d-inline-block border border-white border-opacity-25 shadow-sm">
                    <span className="small fw-bold text-warning">Drishtee is <span>{typingText}</span></span>
                </div>
            </header>

            {/* Faster Counter Overlap */}
            <div className="container position-relative" style={{ marginTop: '-40px', zIndex: 5 }}>
                <Counter />
            </div>

            <main className="container py-5">
                {/* Welcome Section Optimized */}
                <div className="row g-4 mb-5 align-items-center">
                    <div className="col-lg-6 v-hide slide-in-left">
                        <div className="bg-white p-4 rounded-4 shadow-sm border-start border-4 border-primary h-100">
                            <span className="text-uppercase small fw-bold text-primary mb-2 d-block tracking-tight">Established Excellence</span>
                            <h3 className="fw-bold mb-3">Welcome to <span className="text-primary">Drishtee Thuthibari</span></h3>
                            <p className="text-muted small mb-4" style={{ lineHeight: '1.6' }}>
                                Drishtee Computer Center (Thuthibari Branch) was established in <b>2018</b>. 
                                As a proud extension of our <b>Head Branch in Nichlaul</b>, we empower students with high-tech labs and certifications.
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                {['ISO 9001:2015', 'Main Branch: Nichlaul'].map((txt, i) => (
                                    <span key={i} className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-3 py-2 rounded-pill small fw-bold">
                                        {txt}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-6 v-hide slide-in-right">
                        <div className="carousel slide rounded-4 overflow-hidden shadow-sm" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                {DATA.HERO_IMAGES.map((img, i) => (
                                    <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                                        <img src={img} className="d-block w-100" style={{ height: '280px', objectFit: 'cover' }} alt="campus" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Features */}
                <div className="row g-3 mb-5">
                    {DATA.FEATURES.map((f, i) => (
                        <div className="col-md-4 v-hide fade-up" key={i}>
                            <div className="bg-white p-3 rounded-4 shadow-sm h-100 text-center border-bottom border-2 border-light">
                                <i className={`bi ${f.icon} h3 text-${f.color}`}></i>
                                <h6 className="fw-bold mb-0 mt-2 small">{f.title}</h6>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Minimal Programs */}
                <div className="row g-3 mb-5">
                    {DATA.PROGRAMS.map((p, i) => (
                        <div className="col-md-4 v-hide fade-up" key={i}>
                            <div className="bg-white p-4 rounded-4 shadow-sm h-100 d-flex flex-column border">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <i className={`bi ${p.icon} h3 ${p.iconColor}`}></i>
                                    <span className="badge bg-light text-muted border fw-normal">{p.duration}</span>
                                </div>
                                <h6 className="fw-bold">{p.title}</h6>
                                <p className="text-muted extra-small flex-grow-1">{p.text}</p>
                                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                    <span className="fw-bold text-dark">{p.fee}</span>
                                    <button className="btn btn-sm btn-primary rounded-pill px-3 fw-bold">Enroll</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Map & Support Form Cleaned */}
                <div className="row g-0 rounded-4 overflow-hidden shadow-sm bg-white border v-hide fade-up">
                    <div className="col-lg-7">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56673.45958182093!2d83.67044173430745!3d27.4040833462884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39942392249c9073%3A0x6b62ef81415149dd!2sDrishtee%20Institute%20of%20Information%20Technology!5e0!3m2!1sen!2sin!4v1773220082099!5m2!1sen!2sin" width="100%" height="350" className="rounded-3 border-0" allowFullScreen loading="lazy" />
                    </div>
                    <div className="col-lg-5">
                        <QueryForm />
                    </div>
                </div>
            </main>

            <Footer />

            {/* Minimal Floating Mobile Action */}
            <div className="fixed-bottom p-3 d-md-none" style={{ zIndex: 1050 }}>
                <div className="d-flex gap-2 p-2 bg-white bg-opacity-90 rounded-4 shadow-lg border border-white" style={{ backdropFilter: 'blur(8px)' }}>
                    <a href="tel:+917398889347" className="btn btn-primary flex-grow-1 rounded-3 fw-bold py-2 shadow-sm">Call Now</a>
                    <a href="https://wa.me/917398889347" className="btn btn-success rounded-3 px-3 shadow-sm"><i className="bi bi-whatsapp fs-5"></i></a>
                </div>
            </div>
        </div>
    );
}