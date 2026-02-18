import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import CounterCard from "./CounterCard";
import Certificate from "./Certificate";
import Team from "../../Team";
import ScrollUp from "../../../HelperCmp/Scroller/ScrollUp";
import "./About.css";

/* --- ASSETS & DATA --- */
const EST_YEAR = "2007";

const IMPACT_STATS = [
  { value: "1500+", label: "Students Transformed", icon: "bi bi-people-fill", color: "#0a2885", bg: "rgba(10, 40, 133, 0.08)" },
  { value: "95%", label: "Placement Success Rate", icon: "bi bi-graph-up-arrow", color: "#10B981", bg: "rgba(16, 185, 129, 0.08)" },
  { value: "30+", label: "Professional Programs", icon: "bi bi-pc-display", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.08)" },
  { value: "TOP", label: "Institute in Region", icon: "bi bi-trophy-fill", color: "#EF4444", bg: "rgba(239, 68, 68, 0.08)" },
  { value: "100%", label: "Practical Exposure", icon: "bi bi-laptop", color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.08)" },
  { value: "24/7", label: "Lab Facility Access", icon: "bi bi-clock-fill", color: "#EC4899", bg: "rgba(236, 72, 153, 0.08)" }
];

const QUICK_APPS = [
  { name: "ADCA+", icon: "bi bi-window-stack", color: "#4F46E5", desc: "Advanced Diploma in Computer Applications" },
  { name: "CCC", icon: "bi bi-patch-check", color: "#10B981", desc: "Course on Computer Concepts" },
  { name: "O Level", icon: "bi bi-terminal-fill", color: "#8B5CF6", desc: "NIELIT O Level Certification" },
  { name: "Web Dev", icon: "bi bi-code-slash", color: "#EC4899", desc: "Full Stack Web Development" },
  { name: "Tally", icon: "bi bi-calculator-fill", color: "#F59E0B", desc: "Tally with GST & Accounting" },
  { name: "Python", icon: "bi bi-braces", color: "#EF4444", desc: "Python Programming & Django" },
  { name: "DCA", icon: "bi bi-pc-display", color: "#0a2885", desc: "Diploma in Computer Applications" },
  { name: "DTP", icon: "bi bi-vector-pen", color: "#10B981", desc: "Desktop Publishing Mastery" },
  { name: "C/C++", icon: "bi bi-code-square", color: "#8B5CF6", desc: "Programming Fundamentals" },
  { name: "Java", icon: "bi bi-cup-fill", color: "#EF4444", desc: "Java & Advanced Programming" },
  { name: "Photoshop", icon: "bi bi-palette-fill", color: "#EC4899", desc: "Graphic Design Professional" },
  { name: "Excel", icon: "bi bi-table", color: "#4F46E5", desc: "Advanced Excel & Analytics" }
];

const FACILITIES = [
  {
    title: "Modern Computer Laboratory",
    description: "State-of-the-art computer lab equipped with latest i3/i5 processors, high-speed internet connectivity, and licensed software suites for comprehensive practical training.",
    icon: "bi bi-pc-display-horizontal",
    color: "#0a2885"
  },
  {
    title: "Smart Digital Classrooms",
    description: "Interactive learning environment with digital smart boards, HD projectors, and multimedia systems that enhance conceptual understanding through visual teaching methods.",
    icon: "bi bi-display",
    color: "#10B981"
  },
  {
    title: "Career Placement Cell",
    description: "Dedicated placement assistance department with industry connections, conducting regular campus drives, mock interviews, and resume building workshops for students.",
    icon: "bi bi-briefcase-fill",
    color: "#F59E0B"
  },
  {
    title: "Digital & Physical Library",
    description: "Comprehensive library featuring latest IT books, journals, e-learning resources, and quiet study zones for research and self-study purposes.",
    icon: "bi bi-book-fill",
    color: "#8B5CF6"
  },
  {
    title: "High-Speed Wi-Fi Campus",
    description: "Complete campus coverage with high-speed wireless internet, enabling students to access online resources, research materials, and cloud-based learning platforms.",
    icon: "bi bi-wifi",
    color: "#EC4899"
  },
  {
    title: "Project Development Center",
    description: "Dedicated space for real-world project development where students work on live projects under expert guidance to build professional portfolios.",
    icon: "bi bi-lightbulb-fill",
    color: "#EF4444"
  }
];



/* --- UI COMPONENTS --- */

const AppTile = ({ item }) => (
  <div className="col-6 col-md-3 col-lg-2 mb-4">
    <div className="modern-card p-4 text-center border-0 h-100 d-flex flex-column align-items-center justify-content-center hover-lift">
      <div className="rounded-circle mb-3 d-flex align-items-center justify-content-center"
        style={{ width: "60px", height: "60px", backgroundColor: `${item.color}15`, color: item.color }}>
        <i className={`${item.icon} fs-3`}></i>
      </div>
      <h6 className="fw-700 text-dark mb-2">{item.name}</h6>
      <p className="text-muted small mb-0" style={{ fontSize: '11px' }}>{item.desc}</p>
    </div>
  </div>
);

const SectionHeader = ({ title, subtitle, icon, buttonText, buttonLink }) => (
  <div className="mb-5 text-center">
    <div className="d-inline-block p-2 px-4 mb-3" style={{ backgroundColor: '#0a2885', borderRadius: '30px' }}>
      <i className={`${icon} me-2 text-white`}></i>
      <span className="text-white fw-bold">{title}</span>
    </div>
    <h2 className="fw-800 mb-3">{subtitle}</h2>
    {buttonText && (
      <Link to={buttonLink || "#"} className="btn btn-outline-primary rounded-pill px-4 mt-2">
        {buttonText} <i className="bi bi-arrow-right ms-2"></i>
      </Link>
    )}
  </div>
);

const FacilityCard = ({ facility }) => (
  <div className="col-md-6 col-lg-4 mb-4">
    <div className="modern-card h-100 p-4 border-0">
      <div className="d-flex align-items-start gap-1">
        <div className="rounded-circle p-3 flex-shrink-0" style={{ backgroundColor: `${facility.color}15`, color: facility.color }}>
          <i className={`${facility.icon} fs-4`}></i>
        </div>
        <div>
          <h5 className="fw-700 mb-2">{facility.title}</h5>
          <p className="text-muted">{facility.description}</p>
        </div>
      </div>
    </div>
  </div>
);

const About = () => {
  return (
  <div className="bg-white pb-5 pb-lg-0">
      {/* 1. HERO SECTION WITH DETAILED INTRO */}
      <div className="container-fluid pt-3 pb-5" >
        <div className="row align-items-center shadow-sm p-4 bg-white">
          <div className="col-lg-7 mb-5 mb-lg-0">
            <div className="pe-lg-5">
              <span className="badge bg-primary rounded-pill px-4 py-2 mb-3 fw-bold">
                <i className="bi bi-geo-alt-fill me-2"></i>Nichlaul, Maharajganj
              </span>
              <h1 className="display-4 fw-800 mb-4 gradient-text">
                Drishtee Computer Institute
                <span className="d-block fs-3 text-muted mt-2">Empowering Rural India Since {EST_YEAR}</span>
              </h1>

              <div className=" mb-4">
                <p className="mb-3">
                  Welcome to <strong>Drishtee Computer Institute</strong>, the premier destination for computer education in Eastern Uttar Pradesh. For over {new Date().getFullYear() - EST_YEAR} years, we have been at the forefront of digital literacy and professional IT training, transforming thousands of lives through quality education.
                </p>
                <p className="mb-3">
                  Located in the heart of Nichlaul, Maharajganj, our institute bridges the digital divide by providing world-class computer education to rural and semi-urban youth. We believe in the philosophy of "<em>Shining India through Skilled India</em>" and work relentlessly towards this vision.
                </p>
                <p>
                  Our comprehensive curriculum, expert faculty, and state-of-the-art infrastructure combine to create an exceptional learning environment where students don't just learn technology - they master it for successful careers.
                </p>
              </div>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link to="/new-admission" className="btn btn-primary btn-lg rounded-pill px-5 py-3">
                  <i className="bi bi-pencil-square me-2"></i>Apply for Admission
                </Link>
                <button className="btn btn-outline-primary btn-lg rounded-pill px-5 py-3">
                  <i className="bi bi-telephone-fill me-2"></i>Call: 9918151032
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="position-relative">
              <img src="/images/vender/homepic.webp" alt="Drishtee Computer Campus"
                className="img-fluid rounded-4 shadow-lg mb-4"
                style={{ border: '5px solid white' }} />
              <div className="position-absolute bottom-0 start-25 mx-5 translate-middle">
                <div className="bg-white p-3 rounded-3 shadow-lg">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle p-2 me-3">
                      <i className="bi bi-award-fill fs-4"></i>
                    </div>
                    <div>
                      <h6 className="fw-800 mb-0">NIELIT Accredited</h6>
                      <small className="text-muted">Center Code: DIIT0124</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. INSTITUTE OVERVIEW */}
      <div className="container-fluid py-5">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className=" mb-5">
              <h2 className="fw-800 mb-3 text-primary ">A Legacy of Excellence in Computer Education</h2>
              <p className=" text-muted mx-auto" style={{ maxWidth: '800px' }}>
                Established in 2007, Drishtee Computer Institute has grown from a small training center to the region's most trusted computer education hub. Our journey reflects our commitment to quality education and student success.
              </p>
            </div>

            <div className="modern-card p-3 mb-5 border-0">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h3 className="fw-800 mb-4">Our Educational Philosophy</h3>
                  <p className="mb-3">
                    At Drishtee, we follow a <strong>student-centric approach</strong> where each learner receives personalized attention. Our teaching methodology combines theoretical knowledge with extensive practical exposure, ensuring that students gain not just certificates but actual skills.
                  </p>
                  <p className="mb-3">
                    We understand that rural India has unique educational needs. Therefore, we have designed our courses to be <strong>industry-relevant yet accessible</strong>, with special emphasis on local employment opportunities and entrepreneurship development.
                  </p>
                  <p>
                    Our institute operates on three core principles: <strong>Quality Education, Affordability, and Placement Assurance</strong>. These pillars have helped us maintain our position as the top computer institute in the region.
                  </p>
                </div>
                <div className="col-md-6">
                  <img src="/images/vender/office.jpg" alt="Office" className="img-fluid rounded-4 shadow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* 3. IMPACT STATISTICS */}
      <div className="container-fluid py-5 bg-white">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center mb-5">
            <h2 className="fw-800 mb-3">Our Impact in Numbers</h2>
            <p className="text-muted">
              The success of our institute is reflected in these numbers that showcase our journey of empowering rural youth with digital skills and creating employment opportunities.
            </p>
          </div>
        </div>
        <div className="row g-4">
          {IMPACT_STATS.map((stat, i) => (
            <div className="col-6 col-md-4 col-lg-2" key={i}>
              <div className="modern-card p-4 border-0 d-flex flex-column align-items-center text-center hover-scale h-100">
                <div className="stat-icon p-3 rounded-4 mb-3" style={{ backgroundColor: stat.bg, color: stat.color }}>
                  <i className={`${stat.icon} fs-3`}></i>
                </div>
                <h3 className="fw-800 mb-1">{stat.value}</h3>
                <p className="small text-muted mb-0">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CounterCard text={EST_YEAR} />

      {/* 4. COMPREHENSIVE COURSE CATALOG */}
      <div className="container-fluid py-5">
        <SectionHeader
          title="PROGRAMS"
          subtitle="Industry-Ready Certification Courses"
          icon="bi bi-laptop"
          buttonText="View Complete Course List"
          buttonLink="/OurCourses"
        />

        <div className="row mb-5">
          <div className="col-lg-10 mx-auto">
            <div className="modern-card p-2 border-0 mb-4">
              <p className=" text-center mb-4">
                We offer a diverse range of certification programs designed to cater to different career aspirations - from basic computer literacy to advanced professional courses. Each course is structured to provide maximum practical exposure and industry relevance.
              </p>
              <div className="row g-4">
                {QUICK_APPS.map((app, i) => <AppTile key={i} item={app} />)}
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-muted">
                <i className="bi bi-info-circle-fill text-primary me-2"></i>
                All our courses include <strong>certificate preparation, project work, and placement assistance</strong>. New batches start every month with flexible duration options.
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* 6. WORLD-CLASS INFRASTRUCTURE */}
      <div className="container-fluid py-5">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <SectionHeader
              title="INFRASTRUCTURE"
              subtitle="Premium Learning Environment & Facilities"
              icon="bi bi-building"
            />

            <div className="mb-5">
              <div className="modern-card p-2 border-0 mb-4">
                <h4 className="fw-800 mb-4">Our Learning Ecosystem</h4>
                <p className=" mb-4">
                  Drishtee Computer Institute boasts a completely modern infrastructure designed to provide the perfect learning environment. We believe that quality education requires quality infrastructure, and we've invested significantly in creating spaces that inspire learning and innovation.
                </p>

                <div className="row g-4">
                  {FACILITIES.map((facility, index) => (
                    <FacilityCard key={index} facility={facility} />
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Infrastructure Details */}
            <div className="row g-4">
              <div className="col-md-6">
                <div className="modern-card h-100 p-4 border-0">
                  <h5 className="fw-700 mb-3"><i className="bi bi-shield-check text-primary me-2"></i>Security & Safety</h5>
                  <p>
                    Our campus is equipped with 24/7 security surveillance, fire safety equipment, and first-aid facilities. We maintain a secure and disciplined environment where students can focus entirely on their education without any concerns about safety.
                  </p>
                  <ul className="text-muted">
                    <li>CCTV surveillance throughout campus</li>
                    <li>Regular attendance system</li>
                    <li>Separate common areas for male and female students</li>
                    <li>Clean drinking water and sanitation facilities</li>
                  </ul>
                </div>
              </div>

              <div className="col-md-6">
                <div className="modern-card h-100 p-4 border-0">
                  <h5 className="fw-700 mb-3"><i className="bi bi-people-fill text-success me-2"></i>Student Support Services</h5>
                  <p>
                    Beyond academics, we provide comprehensive student support including counseling services, doubt-clearing sessions, extra classes for weaker students, and mentorship programs. Our goal is to ensure no student is left behind.
                  </p>
                  <ul className="text-muted">
                    <li>Personalized attention with limited batch size</li>
                    <li>Regular parent-teacher meetings</li>
                    <li>Progress tracking and feedback system</li>
                    <li>Extra-curricular activities and events</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. ADMISSION PROCESS */}
      <div className="container-fluid py-5 bg-white">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <SectionHeader
              title="ADMISSIONS"
              subtitle="Start Your IT Career Journey with Us"
              icon="bi bi-door-open"
              buttonText="Download Admission Form"
              buttonLink="/new-admission"
            />

            <div className="modern-card p-2 border-0">
              <h4 className="fw-800 mb-4 text-center">Simple & Transparent Admission Process</h4>

              <div className="row g-4 mb-5">
                {[
                  {
                    step: "01",
                    title: "Course Counseling",
                    description: "Visit our campus for free career counseling session. Our experts will guide you in choosing the right course based on your background, interests, and career goals."
                  },
                  {
                    step: "02",
                    title: "Documentation",
                    description: "Submit required documents (educational certificates, ID proof, photographs) and complete the registration formalities with our admission desk."
                  },
                  {
                    step: "03",
                    title: "Fee Payment",
                    description: "Choose from flexible payment options - one-time payment or convenient EMI plans. We offer special scholarships for meritorious and financially weaker students."
                  },
                  {
                    step: "04",
                    title: "Orientation & Start",
                    description: "Attend the orientation program, receive study materials, and begin your classes with our expert faculty in a modern learning environment."
                  }
                ].map((step, index) => (
                  <div className="col-md-6 col-lg-3" key={index}>
                    <div className="modern-card h-100 p-4 border-0 position-relative">
                      <div className="position-absolute top-0 start-0 p-2 bg-primary text-white rounded-end fw-bold">
                        {step.step}
                      </div>
                      <div className="pt-4">
                        <h6 className="fw-700 mb-3">{step.title}</h6>
                        <p className="text-muted small">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center p-4 rounded-3" style={{ backgroundColor: '#f0f7ff' }}>
                <h5 className="fw-700 mb-3">Ready to Transform Your Future?</h5>
                <p className="mb-4">
                  Take the first step towards a successful IT career. Visit our campus today for a free demo class and experience the Drishtee difference firsthand.
                </p>
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                  <Link to="/Contact-us" className="btn btn-primary rounded-pill px-5 py-3">
                    <i className="bi bi-calendar-check me-2"></i>Book Free Demo Class
                  </Link>
                  <button className="btn btn-outline-primary rounded-pill px-5 py-3">
                    <i className="bi bi-download me-2"></i>Download Prospectus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. FINAL CTA */}
      <div className="container-fluid py-1">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="modern-card px-1 py-4 border-0 text-center position-relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0a2885 0%, #157ed2 100%)',
                borderRadius: '20px',
                color: 'white'
              }}>
              <div className="position-absolute top-0 end-0 p-2 opacity-10">
                <i className="bi bi-laptop display-1"></i>
              </div>

              <h2 className="fw-800 pt-5 m-4">Begin Your Journey with Eastern UP's Most Trusted Computer Institute</h2>

              <p className=" mb-5 opacity-90 mx-auto" style={{ maxWidth: '700px' }}>
                At Drishtee Computer Institute, we don't just offer courses - we build careers. Our proven track record of student success, comprehensive curriculum, and unwavering commitment to quality education makes us the preferred choice for IT training in the region.
              </p>

              <div className="d-flex flex-wrap gap-3 justify-content-center mb-4">
                <div className="text-center p-3">
                  <i className="bi bi-check-circle-fill text-warning display-6 d-block mb-2"></i>
                  <small>ISO Certified Institute</small>
                </div>
                <div className="text-center p-3">
                  <i className="bi bi-check-circle-fill text-warning display-6 d-block mb-2"></i>
                  <small>NIELIT Accredited Center</small>
                </div>
                <div className="text-center p-3">
                  <i className="bi bi-check-circle-fill text-warning display-6 d-block mb-2"></i>
                  <small>17+ Years Experience</small>
                </div>
                <div className="text-center p-3">
                  <i className="bi bi-check-circle-fill text-warning display-6 d-block mb-2"></i>
                  <small>95% Placement Record</small>
                </div>
              </div>

              <div className="mt-4">
                <h5 className="fw-700 mb-3">Contact Us Today</h5>
                <div className="d-flex flex-wrap justify-content-center gap-4 mb-4">
                  <div>
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    <span>Paragpur Road, near Sunshine school, Nichlaul, Maharajganj, UP-273304</span>
                  </div>
                  <div>
                    <i className="bi bi-telephone-fill me-2"></i>
                    <span>9918141032, 7267995307</span>
                  </div>
                  <div>
                    <i className="bi bi-envelope-fill me-2"></i>
                    <span>hridesh027@gmail.com</span>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-3 justify-content-center mt-3">
                  <Link to="/contact" className="btn btn-light btn-lg rounded-pill px-5 py-3 fw-bold">
                    <i className="bi bi-chat-dots-fill me-2"></i>Enquire Now
                  </Link>
                  <Link to="/courses" className="btn btn-outline-light btn-lg rounded-pill px-5 py-3">
                    <i className="bi bi-book me-2"></i>Browse All Courses
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UTILITY COMPONENTS */}
      <div className="container-fluid mt-5">
        <Certificate />
        <div className="mt-5"><Team /></div>
      </div>

      <ScrollUp />
    </div>
  );
};

export default React.memo(About);