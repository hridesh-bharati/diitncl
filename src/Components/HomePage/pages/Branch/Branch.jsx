import React, { useEffect } from 'react';
import useTypingEffect from '../../../../hooks/useTypingEffect.js';
import Footer from '../../../Footer/Footer';
import QueryForm from '../About/QuickSupport.jsx';
import Counter from "./Counter";
import "./Branch.css";

const DATA = {
    TYPING_WORDS: ["Growing", "Faster", "Bigger"],
    PROGRAMS: [
        { icon: 'bi-laptop', title: 'Web Development', text: 'Build websites & apps using React & Node.js.', iconColor: 'text-primary', details: 'Full-stack web dev including HTML, CSS, JS, React, Node, MongoDB.', duration: '6 Months', fee: '₹15,000' },
        { icon: 'bi-graph-up', title: 'Data Science', iconColor: 'text-success', text: 'Learn AI, ML & Data Analytics.', details: 'Python, ML, data visualization, big data projects, hands-on practice.', duration: '8 Months', fee: '₹20,000' },
        { icon: 'bi-phone', title: 'Mobile App Dev', iconColor: 'text-danger', text: 'Create Android & iOS apps.', details: 'UI/UX, API integration, publish apps on PlayStore & AppStore.', duration: '5 Months', fee: '₹18,000' }
    ],
    FEATURES: [
        { icon: 'bi-person-circle', title: 'Expert Guidance', text: 'Industry experts.', color: 'primary' },
        { icon: 'bi-clock', title: 'Flexible Timings', text: 'Fit your schedule.', color: 'danger' },
        { icon: 'bi-mortarboard', title: 'Certifications', text: 'Recognized certificates.', color: 'success' }
    ],
    METHODOLOGY: [
        { title: 'Project-Based Learning', desc: 'Real projects & portfolio building.' },
        { title: 'Industry Mentorship', desc: 'Guidance from professionals.' },
        { title: 'Continuous Assessment', desc: 'Quizzes & master skills.' }
    ],
    CAROUSELS: {
        hero: [{ src: '/images/library/d1.jpg', alt: 'Campus' }, { src: '/images/library/d2.jpg', alt: 'Labs' }],
        campus: [{ src: '/images/library/tdiit.webp', alt: 'C1' }, { src: '/images/library/teacher.webp', alt: 'C2' }]
    }
};

const SectionHeader = ({ title, subtitle, center }) => (
    <div className={`mb-4 px-2 ${center ? 'text-center' : ''}`}>
        <h2 className="fw-bold text-dark mb-1 h4">{title}</h2>
        {subtitle && <p className="text-muted small">{subtitle}</p>}
    </div>
);

const AppCard = ({ children, className = "" }) => (
    <div className={`bg-white shadow-sm rounded-4 p-3 h-100 ${className}`}>{children}</div>
);

export default function Branch() {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => e.isIntersecting && e.target.classList.add("show"));
        }, { threshold: 0.1 });
        document.querySelectorAll(".fade-up, .fade-left, .fade-right").forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const typingText = useTypingEffect(DATA.TYPING_WORDS);

    return (
        <div className="app-layout overflow-hidden bg-light">
            <header className="app-header text-center py-5 text-white">
                <h1 className="fw-bolder display-4 mb-2">DRISHTEE</h1>
                <p className="opacity-75 mb-3 lead">Institute of Information Technology</p>
                <div className="bg-white bg-opacity-25 px-4 py-2 rounded-pill d-inline-block">
                    <span className="small fw-medium text-warning">Drishtee is <span className="typing-text">{typingText}</span></span>
                </div>
            </header>

            <div className="container overlap-container" style={{ marginTop: '-50px' }}>
                <Counter /> 
            </div>

            <main className="container py-5">
                {/* Welcome Section */}
                <div className="row g-4 mb-5 align-items-center">
                    <div className="col-lg-6 fade-right">
                        <AppCard className="p-4 border-start border-4 border-primary">
                            <h3 className="fw-bold mb-3">Welcome to <span className="text-primary">Drishtee</span></h3>
                            <p>Founded in 2018, recognized as a top technical institute. Located in Thoothibari with modern labs.</p>
                            <div className="d-flex gap-2 mt-3">
                                <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 border border-primary border-opacity-25">Govt. Certified</span>
                                <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2 border border-success border-opacity-25">ISO Certified</span>
                            </div>
                        </AppCard>
                    </div>
                    <div className="col-lg-6 fade-left">
                        <div className="carousel slide rounded-4 overflow-hidden shadow" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                {DATA.CAROUSELS.hero.map((img, i) => (
                                    <div key={i} className={`carousel-item ${i===0?'active':''}`}>
                                        <img src={img.src} className="w-100" style={{height:'300px', objectFit:'cover'}} alt={img.alt} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <SectionHeader title="Why Choose Drishtee?" center subtitle="Discover our edge in tech education" />
                <div className="row g-3 mb-5 text-center">
                    {DATA.FEATURES.map((f, i) => (
                        <div className="col-md-4 fade-up" key={i}>
                            <AppCard>
                                <i className={`bi ${f.icon} display-5 text-${f.color} mb-3`}></i>
                                <h5 className="fw-bold">{f.title}</h5>
                                <p className="text-muted small mb-0">{f.text}</p>
                            </AppCard>
                        </div>
                    ))}
                </div>

                {/* Programs */}
                <SectionHeader title="Learning Programs" center />
                <div className="row g-3 mb-5">
                    {DATA.PROGRAMS.map((p, i) => (
                        <div className="col-md-4 fade-up" key={i}>
                            <AppCard>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <i className={`bi ${p.icon} fs-1 ${p.iconColor}`}></i>
                                    <span className="badge bg-light text-dark border">{p.duration}</span>
                                </div>
                                <h5 className="fw-bold">{p.title}</h5>
                                <p className="text-muted small">{p.text}</p>
                                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                    <span className="fw-bold h6 mb-0">{p.fee}</span>
                                    <button className="btn btn-sm btn-primary rounded-pill px-3" data-bs-toggle="collapse" data-bs-target={`#p${i}`}>Details</button>
                                </div>
                                <div className="collapse" id={`p${i}`}>
                                    <div className="mt-2 small text-muted bg-light p-2 rounded">{p.details}</div>
                                </div>
                            </AppCard>
                        </div>
                    ))}
                </div>

                {/* Contact & Form */}
                <div className="row g-4">
                    <div className="col-lg-7 fade-right">
                        <AppCard className="p-2 overflow-hidden shadow-sm">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56673.45958182093!2d83.67044173430745!3d27.4040833462884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39942392249c9073%3A0x6b62ef81415149dd!2sDrishtee%20Institute%20of%20Information%20Technology!5e0!3m2!1sen!2sin!4v1773220082099!5m2!1sen!2sin" width="100%" height="350" className="rounded-3 border-0" allowFullScreen loading="lazy" />
                             </AppCard>
                    </div>
                    <div className="col-lg-5 p-0 m-0 fade-left">
                        <AppCard className="p-0 m-0 bg-white">
                            <QueryForm />
                        </AppCard>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Mobile Actions */}
            <div className="fixed-bottom p-3 d-md-none" style={{zIndex: 1050}}>
                <div className="d-flex gap-2 bg-white p-2 rounded-4 shadow-lg border">
                    <a href="tel:+917398889347" className="btn btn-primary flex-grow-1 rounded-3 py-2 shadow-sm fw-bold">Call Now</a>
                    <a href="https://wa.me/917398889347" className="btn btn-success rounded-3 px-3"><i className="bi bi-whatsapp fs-5"></i></a>
                </div>
            </div>
        </div>
    );
}