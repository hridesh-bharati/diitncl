import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import CounterCard from "./CounterCard";
import Certificate from "./Certificate";
import Team from "../../Team";
import ScrollUp from "../../../HelperCmp/Scroller/ScrollUp";
import "./About.css"; // custom styles (see file below)

/* --- DATA (same as your original) --- */
const EST_YEAR = "2007";
const VISION = `Our vision is to improve the youth of rural India, by giving them high-class training atmosphere at a very affordable cost.
We work on the philosophy of "SHINING INDIA", which can be achieved by developing only rural India.
We are committed to impart quality computer education among the students.`;

const BASIC_INFO = [
  { icon: "bi bi-geo-alt", label: "Address", value: "Paragpur Road near Ramharsh inter collage Ncl.", color: "#10B981" },
  { icon: "bi bi-building", label: "City", value: "Nichlaul", color: "#3B82F6" },
  { icon: "bi bi-map", label: "District", value: "Maharajganj", color: "#8B5CF6" },
  { icon: "bi bi-pin-map", label: "State", value: "Uttar Pradesh", color: "#EF4444" },
  { icon: "bi bi-book", label: "Library", value: "Available", color: "#F59E0B" },
  { icon: "bi bi-wifi", label: "WiFi", value: "High Speed", color: "#10B981" },
  { icon: "bi bi-calendar-check", label: "Established", value: EST_YEAR, color: "#EC4899" }
];

const ACCORDION = [
  {
    id: "collapseOne",
    title: "Our Aim",
    content: "We provide high-quality education at nominal fees to maximize value for students and community.",
    icon: "bi bi-bullseye",
    color: "#3B82F6"
  },
  {
    id: "collapseTwo",
    title: "Our Mission",
    content: "To lead in I.T.-oriented education and training, becoming the country's premier organization for IT certification.",
    icon: "bi bi-flag",
    color: "#10B981"
  },
  {
    id: "collapseThree",
    title: "Industry Focus",
    content: "All programs are designed by experts with industry input. Student placements are our ultimate satisfaction.",
    icon: "bi bi-building",
    color: "#8B5CF6"
  },
  {
    id: "collapseFour",
    title: "Our Vision",
    content: VISION,
    icon: "bi bi-eye",
    color: "#F59E0B"
  }
];

const DIGITAL_FEATURES = [
  {
    img: "/images/vender/digital.jpg",
    icon: "bi bi-display",
    title: "Digital Board Classes",
    text: "Interactive smart boards enhance visualization, boost understanding, and make learning engaging.",
    color: "#667eea",
    tags: ["Interactive", "Smart Learning"]
  },
  {
    img: "/images/vender/onlineclass.jpg",
    icon: "bi bi-code-slash",
    title: "Live Project Training",
    text: "Gain hands-on experience with real-world projects under industry expert guidance.",
    color: "#f5576c",
    tags: ["Hands-on", "Projects"]
  },
  {
    img: "/images/vender/office.jpg",
    icon: "bi bi-building-check",
    title: "Office Environment",
    text: "Our setup simulates a professional office, preparing students for real work culture.",
    color: "#4facfe",
    tags: ["Professional", "Real-world"]
  },
];

const LEARNING_ADV = [
  { icon: "bi bi-lightbulb", title: "Problem Solving", text: "Projects designed to develop real-world problem solving skills.", color: "#F59E0B" },
  { icon: "bi bi-people", title: "Group Learning", text: "Peer-to-peer sessions improve collaboration and boost confidence.", color: "#10B981" },
  { icon: "bi bi-trophy", title: "Weekly Challenges", text: "Compete in fun logic-based competitions every weekend.", color: "#EF4444" }
];

const IMPACT_STATS = [
  { value: "1500+", label: "Students", icon: "bi bi-people", color: "#3B82F6", bg: "rgba(59, 130, 246, 0.08)" },
  { value: "95%", label: "Success Rate", icon: "bi bi-graph-up", color: "#10B981", bg: "rgba(16, 185, 129, 0.08)" },
  { value: "30+", label: "Courses", icon: "bi bi-laptop", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.08)" },
  { value: "300+", label: "Projects", icon: "bi bi-briefcase", color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.08)" }
];

const COURSES = [
  { name: "ADCA+", icon: "bi bi-file-text", color: "#3B82F6" },
  { name: "CCC", icon: "bi bi-mortarboard", color: "#10B981" },
  { name: "O_LEVEL", icon: "bi bi-pc-display", color: "#8B5CF6" },
  { name: "DCA", icon: "bi bi-calculator", color: "#F59E0B" },
  { name: "Python", icon: "bi bi-code-square", color: "#EF4444" },
  { name: "Web Dev", icon: "bi bi-globe", color: "#EC4899" }
];

/* --- REUSABLE BOOTSTRAP-BASED COMPONENTS --- */

const ModernCard = ({ children, className = "", style = {}, onClick }) => (
  <div
    className={`modern-card ${className}`}
    onClick={onClick}
    style={style}
  >
    {children}
  </div>
);

const InfoCard = ({ icon, label, value, color }) => (
  <ModernCard className="p-3">
    <div className="d-flex align-items-center">
      <div className="rounded-circle p-3 me-3 info-icon" style={{ backgroundColor: `${color}22`, color }}>
        <i className={`${icon} fs-4`}></i>
      </div>
      <div>
        <h6 className="mb-1 fw-bold">{label}</h6>
        <p className="mb-0 text-muted small">{value}</p>
      </div>
    </div>
  </ModernCard>
);

const StatCard = ({ stat }) => (
  <ModernCard className="p-4 text-center">
    <div className="rounded-circle p-3 mb-3 d-inline-flex align-items-center justify-content-center stat-icon" style={{ backgroundColor: stat.bg }}>
      <i className={`${stat.icon} fs-3`} style={{ color: stat.color }} />
    </div>
    <h3 className="fw-bold mb-1">{stat.value}</h3>
    <h6 className="fw-semibold text-muted">{stat.label}</h6>
  </ModernCard>
);

const CourseChip = ({ course }) => (
  <ModernCard className="text-center p-3">
    <div className="mb-2">
      <div className="rounded-circle mx-auto p-2 course-icon" style={{ backgroundColor: `${course.color}22`, color: course.color }}>
        <i className={`${course.icon} fs-4`} />
      </div>
    </div>
    <h6 className="fw-bold mb-0">{course.name}</h6>
  </ModernCard>
);

const FeatureCard = ({ feature }) => {
  const [hover, setHover] = useState(false);
  return (
    <ModernCard
      className="h-100"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "default" }}
    >
      <div className="position-relative overflow-hidden rounded-top" style={{ height: 160 }}>
        <img
          src={feature.img}
          alt={feature.title}
          className="w-100 h-100 feature-img"
          style={{ objectFit: "cover", filter: hover ? "brightness(0.85)" : "none" }}
        />
        <div className="position-absolute top-0 start-0 p-3">
          <div className="rounded-circle p-2 shadow-sm" style={{ backgroundColor: "#fff" }}>
            <i className={`${feature.icon} fs-5`} style={{ color: feature.color }} />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h5 className="fw-bold mb-2">{feature.title}</h5>
        <p className="mb-3 small text-muted">{feature.text}</p>
        <button className="btn btn-sm btn-primary rounded-pill">Learn More <i className="bi bi-arrow-right ms-1"></i></button>
      </div>
    </ModernCard>
  );
};

const AccordionItem = ({ item, isActive, onClick }) => (
  <ModernCard className="mb-3">
    <button
      className={`w-100 btn text-start d-flex justify-content-between align-items-center p-3 accordion-toggle ${isActive ? "active" : ""}`}
      onClick={onClick}
      style={{ borderRadius: 10 }}
    >
      <div className="d-flex align-items-center">
        <div className="rounded-circle p-2 me-3" style={{ backgroundColor: `${item.color}22`, color: item.color }}>
          <i className={`${item.icon}`} />
        </div>
        <span className="fw-semibold">{item.title}</span>
      </div>
      <i className={`bi bi-chevron-${isActive ? "up" : "down"}`} />
    </button>
    {isActive && (
      <div className="p-3" style={{ backgroundColor: `${item.color}08`, borderLeft: `4px solid ${item.color}`, borderRadius: "0 0 10px 10px" }}>
        <p className="mb-0">{item.content}</p>
      </div>
    )}
  </ModernCard>
);

/* --- MAIN COMPONENT --- */

const About = () => {
  const [activeAccordion, setActiveAccordion] = useState(0);
  const handleAccordion = useCallback(idx => setActiveAccordion(prev => prev === idx ? -1 : idx), []);

  return (
    <div className="bg-light" style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <div className="container-fluid py-5">
        <div className="row align-items-center gx-4">
          <div className="col-md-6 mb-4 mb-md-0">
            <div className="card rounded-4 shadow-lg overflow-hidden">
              <img src="/images/vender/homepic.webp" alt="DIIT Campus" className="img-fluid w-100" style={{ transform: "perspective(1000px) rotateY(-5deg)" }} />
            </div>
          </div>

          <div className="col-md-6">
            <ModernCard className="p-4">
              <div className="d-flex align-items-start mb-3">
                <div className="rounded-circle p-3 me-3 shadow-sm" style={{ backgroundColor: "#3B82F6", color: "#fff" }}>
                  <i className="bi bi-building fs-4"></i>
                </div>
                <div className="flex-grow-1">
                  <h1 className="h2 fw-bold text-primary mb-0">DIIT</h1>
                  <p className="mb-0 fw-semibold text-success"><i className="bi bi-award me-1"></i>Complete I.T. Institute</p>
                  <span className="badge rounded-pill px-3 py-2 text-primary bg-white" style={{ border: "1px solid rgba(59,130,246,0.12)" }}>Since {EST_YEAR}</span>
                </div>
              </div>
              <p className="text-muted mb-4"><span className="fw-bold text-danger">Drishtee Institute Of Information Technology</span> delivers high-quality IT training in Nichlaul, Uttar Pradesh.</p>

              <div className="row g-2 mb-4">
                {COURSES.slice(0, 3).map((course, i) => (
                  <div className="col-4" key={i}>
                    <CourseChip course={course} />
                  </div>
                ))}
              </div>

              <div className="d-flex gap-2">
                <Link to="/Contact-us" className="btn btn-primary flex-grow-1 rounded-pill"><i className="bi bi-chat-text me-2"></i>Enquire Now</Link>
                <button className="btn btn-outline-success rounded-pill"><i className="bi bi-telephone"></i></button>
              </div>
            </ModernCard>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container-fluid mt-4">
        <div className="row g-3">
          {IMPACT_STATS.map((stat) => (
            <div className="col-6 col-md-3" key={stat.label}>
              <StatCard stat={stat} />
            </div>
          ))}
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="container-fluid mt-5">
        <div className="row g-4">
          {[ 
            { title: "Our Vision", icon: "bi bi-eye", color: "#3B82F6", text: VISION, highlight: "Building Shining India" },
            { title: "Our Mission", icon: "bi bi-flag", color: "#10B981", text: 'DIIT is committed to impart Professional education by inculcating three basic values among the youth— "Building National Character, quality education and developing Management Skills".', highlight: "ISO 9001:2008 Certified" }
          ].map((item, i) => (
            <div className="col-md-6" key={i}>
              <ModernCard className="h-100 p-0">
                <div className="p-4 border-bottom" style={{ borderBottomColor: item.color }}>
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle p-2 me-3" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                      <i className={`${item.icon} fs-4`} />
                    </div>
                    <h4 className="fw-bold mb-0">{item.title}</h4>
                  </div>
                  <p className="text-muted mb-0">{item.text}</p>
                </div>
                <div className="p-4">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-stars me-2" style={{ color: item.color }}></i>
                    <span className="fw-semibold" style={{ color: item.color }}>{item.highlight}</span>
                  </div>
                </div>
              </ModernCard>
            </div>
          ))}
        </div>
      </div>

      {/* Courses */}
      <div className="container-fluid mt-5">
        <ModernCard className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0"><i className="bi bi-laptop me-2 text-primary"></i>Our Courses</h4>
            <Link to="/courses" className="btn btn-sm btn-outline-primary rounded-pill">View All</Link>
          </div>
          <div className="row g-3">
            {COURSES.map((course, i) => (
              <div className="col-4 col-md-2" key={i}>
                <CourseChip course={course} />
              </div>
            ))}
          </div>
        </ModernCard>
      </div>

      {/* Features */}
      <div className="container-fluid mt-5">
        <h4 className="fw-bold mb-1"><i className="bi bi-stars me-2 text-purple"></i>Smart Features</h4>
        <p className="text-muted mb-4">Experience next-generation learning technology</p>
        <div className="row g-4">
          {DIGITAL_FEATURES.map(f => (
            <div className="col-md-4" key={f.title}>
              <FeatureCard feature={f} />
            </div>
          ))}
        </div>
      </div>

      {/* Accordion */}
      <div className="container-fluid mt-5">
        <ModernCard className="p-4">
          <h4 className="fw-bold mb-4"><i className="bi bi-question-circle me-2 text-primary"></i>Why Choose DIIT?</h4>
          <div>
            {ACCORDION.map((item,i) => (
              <AccordionItem key={item.id} item={item} isActive={activeAccordion === i} onClick={() => handleAccordion(i)} />
            ))}
          </div>
        </ModernCard>
      </div>

      {/* Campus Info */}
      <div className="container-fluid mt-5">
        <ModernCard>
          <div className="p-4 text-white" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}>
            <h4 className="fw-bold mb-2"><i className="bi bi-geo-alt me-2"></i>Campus Details</h4>
            <p className="opacity-90 mb-0">Nichlaul, Uttar Pradesh • Est. 2007</p>
          </div>
          <div className="p-4">
            <div className="row">
              {BASIC_INFO.map((info,i) => (
                <div className="col-md-6" key={i}>
                  <InfoCard {...info} />
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-top">
              <div className="row g-2">
                {LEARNING_ADV.map((adv,i) => (
                  <div className="col-md-4" key={i}>
                    <ModernCard className="p-3 text-center h-100" style={{ backgroundColor: `${adv.color}08` }}>
                      <i className={`${adv.icon} fs-3 mb-3 d-block`} style={{ color: adv.color }}></i>
                      <h6 className="fw-semibold mb-2">{adv.title}</h6>
                      <p className="small mb-0 text-muted">{adv.text}</p>
                    </ModernCard>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ModernCard>
      </div>

      {/* Call to Action */}
      <div className="container-fluid mt-5 mb-5">
        <ModernCard className="overflow-hidden">
          <div className="row g-0">
            <div className="col-md-8 p-5 bg-dark text-white">
              <h3 className="fw-bold mb-3">Ready to Start Your IT Career?</h3>
              <p className="mb-4 text-secondary">Join 1500+ successful students who transformed their careers with DIIT</p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/Contact-us" className="btn btn-primary rounded-pill"><i className="bi bi-calendar-check me-2"></i>Apply Now</Link>
                <button className="btn btn-secondary rounded-pill"><i className="bi bi-download me-2"></i>Brochure</button>
              </div>
            </div>
            <div className="col-md-4 p-5 text-center d-flex flex-column justify-content-center bg-warning text-white">
              <h4 className="fw-bold mb-3">Limited Seats</h4>
              <p className="mb-4">Next batch starting soon</p>
              <button className="btn btn-primary text-white rounded-pill border">Call Now</button>
            </div>
          </div>
        </ModernCard>
      </div>

      {/* Additional Components */}
      <div className="container-fluid mt-5">
        <Certificate />
        <div className="mt-5"><Team /></div>
        <CounterCard text={EST_YEAR} />
      </div>

      <ScrollUp />
    </div>
  );
};

export default React.memo(About);