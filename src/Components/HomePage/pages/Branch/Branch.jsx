import React, { useEffect } from 'react';

// Hooks
import useTypingEffect from '../../../../hooks/useTypingEffect.js';

// Components
import Footer from '../../../Footer/Footer';
import QueryForm from '../About/QuickSupport.jsx';
import Counter from "./Counter"
import "./Branch.css";


/** DATA */
const DATA = {
    TYPING_WORDS: ["Growing", "Faster", "Bigger"],

    STATS: [
        { label: "Students", value: "1500+" },
        { label: "Courses", value: "12+" },
        { label: "Placement", value: "95%" },
        { label: "Years", value: "6+" }
    ],
    PROGRAMS: [
        {
            icon: 'bi-laptop',
            title: 'Web Development',
            text: 'Build websites & apps using React & Node.js.',
            iconColor: 'text-primary',
            details: 'Full-stack web dev including HTML, CSS, JS, React, Node, MongoDB with real projects.',
            duration: '6 Months',
            fee: '₹15,000'
        },
        {
            icon: 'bi-graph-up',
            title: 'Data Science',
            text: 'Learn AI, ML & Data Analytics.',
            iconColor: 'text-dark',
            details: 'Python, ML, data visualization, big data projects, hands-on practice.',
            duration: '8 Months',
            fee: '₹20,000'
        },
        {
            icon: 'bi-phone',
            title: 'Mobile App Dev',
            text: 'Create Android & iOS apps using Flutter/React Native.',
            iconColor: 'text-danger',
            details: 'UI/UX, API integration, publish apps on PlayStore & AppStore.',
            duration: '5 Months',
            fee: '₹18,000'
        }
    ],
    FEATURES: [
        { icon: 'bi-person-circle', title: 'Expert Guidance', text: 'Guidance from industry experts.', iconColor: 'text-primary' },
        { icon: 'bi-clock', title: 'Flexible Timings', text: 'Courses to fit your schedule.', iconColor: 'text-danger' },
        { icon: 'bi-mortarboard', title: 'Certifications', text: 'Get recognized certificates.', iconColor: 'text-primary' }
    ],
    METHODOLOGY: [
        { title: 'Project-Based Learning', description: 'Real projects & portfolio building.' },
        { title: 'Industry Mentorship', description: 'Guidance from professionals.' },
        { title: 'Continuous Assessment', description: 'Quizzes & projects to master skills.' }
    ],
    FAQS: [
        { question: 'Admission requirements?', answer: 'Basic computer knowledge & passion for tech.' },
        { question: 'Placement assistance?', answer: 'Dedicated placement cell helps with resumes & interviews.' },
        { question: 'Discounts available?', answer: 'Early bird & merit-based scholarships available.' },
        { question: 'Class size?', answer: 'Small batches (15-20) for personal attention.' }
    ],
    CAROUSELS: {
        hero: [
            { src: '/images/library/d1.jpg', alt: 'DIIT Campus' },
            { src: '/images/library/d2.jpg', alt: 'DIIT Labs' }
        ],
        campus: [
            { src: '/images/library/tdiit.webp', alt: 'Campus 1' },
            { src: '/images/library/teacher.webp', alt: 'Campus 2' }
        ]
    },
    GALLERY: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'],
    SECTIONS: [
        { title: 'Our Vision', content: 'Transforming lives with tech education & innovation.' },
        { title: 'Student Support', content: 'Counseling, workshops, and career guidance.' },
        { title: 'Get Involved', content: 'Join clubs, events & collaborate with peers & alumni.' }
    ]
};

/** REUSABLE COMPONENTS */
const AppCard = ({ children, className = "", onClick }) => (
    <div className={`bg-white shadow-sm rounded-4 p-3 mobile-active-state ${className}`} onClick={onClick}>
        {children}
    </div>
);

const SectionHeader = ({ title, subtitle, className = "" }) => (
    <div className={`mb-4 px-2 ${className}`}>
        <h4 className="fw-bold text-dark mb-1">{title}</h4>
        {subtitle && <p className="text-muted small">{subtitle}</p>}
    </div>
);

const IconBadge = ({ icon, color, size = "3" }) => {
    const bgColor = color.replace('text-', '');
    return (
        <div
            className={`bg-${bgColor} bg-opacity-10 rounded-4 d-flex align-items-center justify-content-center`}
            style={{ width: '60px', height: '60px' }}
        >
            <i className={`bi ${icon} fs-${size} ${color}`}></i>
        </div>
    );
};

const FeatureCard = ({ icon, title, text, iconColor }) => (
    <AppCard className="h-100 text-center">
        <div className="d-flex">
            <IconBadge icon={icon} color={iconColor} />
            <h5 className="fw-bold m-3">{title}</h5>
        </div>
        <p className="text-muted small ms-3">{text}</p>
    </AppCard>
);

const ProgramCard = ({ program, index }) => (
    <AppCard className="h-100">
        <IconBadge icon={program.icon} color={program.iconColor} />
        <h5 className="fw-bold mt-3">{program.title}</h5>
        <p className="text-muted small">{program.text}</p>
        <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">{program.duration}</span>
            <span className="fw-bold text-dark">{program.fee}</span>
        </div>
        <button className="btn btn-outline-primary btn-sm w-100 mb-2" data-bs-toggle="collapse" data-bs-target={`#programDetails${index}`}>View Details</button>
        <div className="collapse" id={`programDetails${index}`}>
            <div className="card card-body bg-light border-0 small">{program.details}</div>
        </div>
    </AppCard>
);

const Carousel = ({ items, id, height = 250 }) => (
    <div id={id} className="carousel slide carousel-fade rounded-4 overflow-hidden" data-bs-ride="carousel">
        <div className="carousel-inner">
            {items.map((item, i) => (
                <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                    <img src={item.src} alt={item.alt} className="d-block w-100" style={{ height: `${height}px`, objectFit: 'cover' }} loading="lazy" />
                </div>
            ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target={`#${id}`} data-bs-slide="prev">
            <span className="carousel-control-prev-icon" />
        </button>
        <button className="carousel-control-next" type="button" data-bs-target={`#${id}`} data-bs-slide="next">
            <span className="carousel-control-next-icon" />
        </button>
    </div>
);

/** MAIN COMPONENT */
function Branch() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        observer.unobserve(entry.target); // 👈 important
                    }
                });
            },
            { threshold: 0.2 }
        );

        document.querySelectorAll(".fade-up, .fade-left, .fade-right")
            .forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);
    
    // ✅ Using the DRY Hook
    const typingText = useTypingEffect(DATA.TYPING_WORDS);

    return (
        <div className="app-layout overflow-x-hidden">
            <header className="app-header text-center">
                <h1 className="fw-bolder display-5 mb-2">DRISHTEE</h1>
                <p className="opacity-75 mb-3">Institute of Information Technology</p>
                <div className="d-inline-flex align-items-center bg-white bg-opacity-25 px-4 py-2 rounded-pill">
                    <span className="small fw-medium">
                        Drishtee is <span className="typing-text ms-1">{typingText}</span>
                    </span>
                </div>
            </header>

            {/* Stats */}
            <div className="container overlap-container">
                <div className="row g-3 px-2">
                    {DATA.STATS.map((s, i) => (
                        <div key={i} className="col-6 col-md-3 fade-up"  >
                            <AppCard className="text-center py-4">
                                <h3 className="fw-bold text-primary mb-1">{s.value}</h3>
                                <div className="text-muted small">{s.label}</div>
                            </AppCard>
                        </div>
                    ))}
                </div>
            </div>

            <main className="container py-5">
                {/* Hero & Welcome */}
                <div className="row g-4 mb-5">
                    <div className="col-lg-6 fade-right">
                        <AppCard className="p-4 h-100">
                            <h3 className="fw-bold mb-3">Welcome to <span className="text-primary">Drishtee</span></h3>
                            <p className="text-dark mb-3">
                                Drishtee Institute of Technology, founded in 2018, is recognized as one of the top technical computer institutes in the region.
                            </p>
                            <p className="text-dark mb-4">
                                Located in the heart of Thoothibari, our center boasts modern computer labs and experienced faculty.
                            </p>
                            <div className="d-flex gap-2">
                                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">Govt. Certified</span>
                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">ISO Certified</span>
                            </div>
                        </AppCard>
                    </div>

                    <div className="col-lg-6 fade-left">
                        <AppCard className="p-2 overflow-hidden">
                            <Carousel items={DATA.CAROUSELS.hero} id="heroCarousel" height={300} />
                        </AppCard>
                    </div>
                </div>

                <Counter />

                {/* Features */}
                <SectionHeader title="Why Choose Drishtee?" subtitle="Discover our edge in tech education" className="text-center mt-5" />
                <div className="row g-4 mb-5">
                    {DATA.FEATURES.map((f, i) => (
                        <div className="col-md-4 fade-up" key={i} >
                            <FeatureCard {...f} />
                        </div>
                    ))}
                </div>

                {/* Programs */}
                <SectionHeader title="Learning Programs" subtitle="Industry-focused courses" className="text-center" />
                <div className="row g-4 mb-5">
                    {DATA.PROGRAMS.map((p, i) => (
                        <div className="col-md-4 fade-up" key={i} >
                            <ProgramCard program={p} index={i} />
                        </div>
                    ))}
                </div>

                {/* Methodology */}
                <div className="row g-4 mb-5 align-items-center">
                    <div className="col-lg-6 fade-right">
                        <AppCard className="p-4">
                            <SectionHeader title="Our Learning Methodology" />
                            {DATA.METHODOLOGY.map((m, i) => (
                                <div key={i} className="mb-3">
                                    <h6 className="fw-bold text-primary mb-1">
                                        <i className="bi bi-check-circle-fill me-2"></i>
                                        {m.title}
                                    </h6>
                                    <p className="text-muted small mb-0">{m.description}</p>
                                </div>
                            ))}
                        </AppCard>
                    </div>
                    <div className="col-lg-6 fade-left"  >
                        <AppCard className="p-2 overflow-hidden">
                            <Carousel items={DATA.CAROUSELS.campus} id="campusCarousel" height={350} />
                        </AppCard>
                    </div>
                </div>

                {/* Contact & Form */}
                <div className="row g-4 mb-5">
                    <div className="col-lg-7 fade-right"  >
                        <AppCard className="p-3">
                            <SectionHeader title="Locate Us" />
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3550.463375841444!2d83.6931283!3d27.1420138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399415849495689b%3A0x6a06692224097475!2sDrishtee%20Institute%20of%20Information%20Technology!5e0!3m2!1sen!2sin!4v1710000000000"
                                width="100%" height="400" className="rounded-4" style={{ border: 0 }} allowFullScreen loading="lazy" title="Drishtee Location"
                            />
                        </AppCard>
                    </div>
                    <div className="col-lg-5 fade-left">
                        <AppCard className="p-4 h-100">
                            <SectionHeader title="Quick Enquiry" />
                            <QueryForm />
                        </AppCard>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Floating Action Bar */}
            <div className="fab-bottom d-block d-md-none">
                <div className="d-flex gap-2 p-2 bg-white rounded-4 shadow-lg">
                    <a href="tel:+917398889347" className="btn btn-app flex-grow-1 d-flex justify-content-center align-items-center">
                        <i className="bi bi-telephone-fill me-2"></i> Call Now
                    </a>
                    <a
                        href="https://wa.me/917398889347"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-whatsapp d-flex justify-content-center align-items-center"
                        style={{ width: "64px" }}
                    >
                        <i className="bi bi-whatsapp fs-4"></i>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Branch;