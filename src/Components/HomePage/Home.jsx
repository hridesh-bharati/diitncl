import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Typed from 'typed.js';
import TopCourseList from "./TopCourseList";
import Features from "./Features";
import Team from "./Team";
import Testimonial from "./Testimonial";
import Footer from "../Footer/Footer";
import QueryForm from "./pages/QueryFrom";
import Offers from "./Offers";
import NoticeBoard from "../HelperCmp/FeaturesUpdate/NoticeBoard";
import TimeTable from "../HelperCmp/FeaturesUpdate/TimeTable";
import CardSlider from "./Cardslider";
import Desc from "./pages/Desc";

const homeItems = [
    {
        title: "Student-Centric Approach",
        content: "We prioritize the needs and aspirations of our students, providing a supportive learning environment.",
        aosDuration: 1000
    },
    {
        title: "Comprehensive Computer Courses",
        content: "We offer a wide range of courses, including programming, web development, networking, and software applications, designed to cater to all skill levels—from beginners to advanced learners.",
        aosDuration: 1500
    },
    {
        title: "Join the Drishtee Community",
        content: "At Drishtee Institute, we believe in creating a supportive community. Participate in workshops, seminars, and networking events that enhance your learning experience and connect you with peers and professionals in the field.",
        aosDuration: 1500
    }
];

const quickActions = [
    { path: "/Download-Certificate", label: "Result", icon: "fas fa-file-lines", color: "#E91E63" },
    { path: "/Contact-us", label: "Enquiry", icon: "fas fa-headset", color: "#9C27B0" },
    { path: "/Student-Portal", label: "Students", icon: "fas fa-user-graduate", color: "#3F51B5" },
    { path: "/AdmissionForm", label: "Admission", icon: "fas fa-user-plus", color: "#009688" },
    { path: "/Gallery", label: "Gallery", icon: "fas fa-images", color: "#FF5722" },
    { path: "/Library", label: "Library", icon: "fas fa-book-open", color: "#607D8B" }
];

const sliderImages = [
    'images/mainSlider/slider1.webp',
    'images/mainSlider/slider2.png',
    'images/mainSlider/slider3.webp'
];

function Home() {
    const navigate = useNavigate();
    const aToken = localStorage.getItem('aToken');

    useEffect(() => {
        if (aToken) navigate('/Admin-Pannel');
    }, [aToken, navigate]);

    useEffect(() => {
        const typed1 = new Typed('#element', {
            strings: [
                `"<span class="text-danger fw-bold">Drishtee</span> envisions a world where all communities are empowered to achieve shared prosperity."`
            ],
            typeSpeed: 55,
            loop: true,
        });

        const typed2 = new Typed('#diit', {
            strings: [
                "Empowering Tomorrow's Tech Leaders!",
                "Unlocking Your Digital Potential!",
                "Coding Your Future, Today!",
                "Where Innovation Meets Education!",
                "Building Skills for the Digital Age!",
                "Transforming Learners into Developers!",
                "Your Gateway to the Tech World!",
                "Learn. Code. Succeed."
            ],
            typeSpeed: 55,
            loop: true,
        });

        const typed3 = new Typed('#admnow', {
            strings: ["Get your admission now"],
            typeSpeed: 55,
            loop: true,
        });

        return () => {
            typed1.destroy();
            typed2.destroy();
            typed3.destroy();
        };
    }, []);

    return (
        <div>
            {/* Hero Carousel */}
            <div id="heroCarousel" className="carousel mt-5 slide carousel-fade" data-bs-ride="carousel" data-bs-interval="3000">
                <div className="carousel-inner">
                    {sliderImages.map((image, idx) => (
                        <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                            <img
                                src={image}
                                loading={idx === 0 ? "eager" : "lazy"}
                                className="d-block w-100"
                                style={{ height: "auto", width: "100%" }}
                                alt={`Drishtee Computer Center ${idx + 1}`}
                            />
                        </div>
                    ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>

                <style>{`
                .carousel-control-next-icon, .carousel-control-prev-icon {
    width: 1px;
    height: 1px;

                }
                `}</style>
            </div>

            {/* Welcome Section */}
            <section className="py-4 bg-light">
                <div className="container">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <h5 className="fw-bold text-primary text-uppercase mb-3">Welcome to Drishtee Computer Center</h5>
                            <p className=" mb-3">
                                Drishtee Institute of Information Technology has been inaugurated at a new location:
                                Paragpur Road, near Sunshine School, Nichlaul, Maharajganj.
                            </p>
                            <h6 className="mb-4 small">
                                <span className="text-danger fw-bold">Drishtee</span>{" "}
                                <span id="diit" className="small text-primary fw-semibold "></span>
                            </h6>
                            <Link to="/Contact-us" className="btn btn-primary rounded-pill px-4">
                                <i className="fas fa-phone-alt me-2"></i>Call To Action
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-5">
                <div className="container">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-5">
                            <img
                                src="images/vender/aboutBg.webp"
                                className="img-fluid rounded-3 shadow"
                                alt="About Drishtee Institute"
                                loading="lazy"
                            />
                        </div>
                        <div className="col-lg-7">
                            <h2 className="text-primary fw-bold mb-4">Drishtee Institute of Information Technology</h2>
                            {homeItems.map((item, idx) => (
                                <div className="card border-0 shadow-sm mb-3" key={idx} data-aos="fade-up" data-aos-duration={item.aosDuration}>
                                    <div className="card-body">
                                        <h5 className="text-primary fw-semibold">{item.title}</h5>
                                        <p className="mb-0">{item.content}</p>
                                    </div>
                                </div>
                            ))}
                            <Link to="/About" className="btn btn-outline-primary mt-3">
                                Learn More <i className="fas fa-arrow-right ms-2"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Desc />

            {/* Top Courses Section */}
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
                        <div>
                            <h6 className="text-danger fw-bold mb-1">DRISHTEE</h6>
                            <h2 className="text-primary fw-bold mb-0">TOP COURSES</h2>
                        </div>
                        <Link to="/AdmissionForm" className="btn btn-success mt-3 mt-md-0">
                            Take Admission <i className="fas fa-arrow-right ms-2"></i>
                        </Link>
                    </div>
                    <TopCourseList />
                    <div className="mt-5">
                        <CardSlider />
                    </div>
                </div>
            </section>

            <div className="row g-3">
                {quickActions.map((action, index) => (
                    <div
                        key={index}
                        className="col-6 col-md-4 col-lg-2"
                    >
                        <Link
                            to={action.path}
                            className="card text-decoration-none border-0 shadow-sm h-100 text-center hover-lift"
                        >
                            <div className="card-body py-4">
                                <div
                                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        backgroundColor: action.color
                                    }}
                                >
                                    <i className={`${action.icon} fa-lg text-white`}></i>
                                </div>

                                <h6 className="fw-semibold mb-0">{action.label}</h6>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>


            <Features />

            {/* Testimonials */}
            <section className="py-5 bg-light">
                <div className="container">
                    <Testimonial />
                </div>
            </section>

            {/* Features & Updates */}
            <section className="py-5">
                <div className="container">
                    <h2 className="text-primary fw-bold text-center mb-4">Features And Updates</h2>
                    <div className="text-center mb-5">
                        <p className="lead mb-0" id="element"></p>
                    </div>
                    <div className="row g-4">
                        <div className="col-lg-6">
                            <TimeTable />
                        </div>
                        <div className="col-lg-6">
                            <NoticeBoard />
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-5 bg-light" id="team">
                <div className="container">
                    <Team />
                </div>
            </section>

            {/* Offers & Query Form */}
            <section className="py-5">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-5">
                            <Offers />
                        </div>
                        <div className="col-lg-7">
                            <QueryForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-5" style={{ backgroundColor: "#6a41ed" }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-7 mb-4 mb-md-0">
                            <h1 className="text-white fw-bold mb-0" id="admnow"></h1>
                        </div>
                        <div className="col-md-5 text-md-end">
                            <Link to="/AdmissionForm">
                                <button className="btn btn-light btn-lg rounded-pill px-5 py-3 fw-bold hover-scale">
                                    Enroll Now <i className="fas fa-arrow-right ms-2"></i>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            {/* Add this CSS to your global styles or in a style tag */}
            <style>{`
                .hover-lift {
                    transition: transform 0.2s ease;
                }
                .hover-lift:hover {
                    transform: translateY(-5px);
                }
                .hover-scale {
                    transition: transform 0.2s ease;
                }
                .hover-scale:hover {
                    transform: scale(1.05);
                }
                .object-fit-cover {
                    object-fit: cover;
                }
                @media (max-width: 768px) {
                    .carousel-item img {
                        height: 300px !important;
                    }
                    h1 {
                        font-size: 1.8rem;
                        text-align: center;
                    }
                }
            `}</style>
        </div>
    );
}

export default Home;