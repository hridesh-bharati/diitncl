import React from "react";
import CountdownTimer from "./Counter";
import QuickSupport from "../About/QuickSupport";
import LibraryFeatures from "./LibraryFeatures";
import useScrollAnimation from "../../../../hooks/useScrollAnimation";

/* ================= DATA ARRAY MATRIX ================= */
const STATS = [
  { icon: "bi-lightning-charge-fill", value: "1 Gbps", label: "Fiber Internet", color: "linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)" },
  { icon: "bi-people-fill", value: "150+", label: "Study Seats", color: "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)" },
  { icon: "bi-door-open-fill", value: "24×7", label: "Open Hours", color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { icon: "bi-newspaper", value: "Daily", label: "News Paper", color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", role: "UPSC Aspirant", text: "The calm atmosphere helped me stay consistent for long hours.", rating: 5 },
  { name: "Rahul Verma", role: "NEET Student", text: "Fast internet and silence make this library perfect.", rating: 5 },
  { name: "Anjali Patel", role: "SSC Aspirant", text: "Feels disciplined, clean and motivating every day.", rating: 5 },
  { name: "Vikash Singh", role: "Bank PO Aspirant", text: "Best library in town! The environment is so peaceful and focused.", rating: 5 },
  { name: "Neha Gupta", role: "JEE Aspirant", text: "24×7 access helped me study late nights before exams.", rating: 5 },
  { name: "Amit Kumar", role: "CA Student", text: "Amazing facilities with great internet speed. Highly recommended!", rating: 5 }
];

const LIBRARY_RULES = [
  { rule: "Complete Silence Zone", desc: "No talking or phone calls inside study area", icon: "bi-mic-mute-fill", color: "danger" },
  { rule: "No Food Inside", desc: "Only water bottles are allowed inside the hall", icon: "bi-cup-straw", color: "warning" },
  { rule: "Mobile on Silent", desc: "Use designated phone booths for calls", icon: "bi-phone-vibrate", color: "info" },
  { rule: "Bag Screening", desc: "All personal bags are checked at the entrance for security", icon: "bi-shield-check", color: "success" },
  { rule: "ID Card Mandatory", desc: "Carry library ID at all times", icon: "bi-card-id", color: "primary" },
  { rule: "Return on Time", desc: "Late fees apply for delayed book returns", icon: "bi-clock-history", color: "dark" }
];

const MEMBERSHIP_PLANS = [
  { name: "Daily Pass", price: "₹50", duration: "per day", features: ["Full day access", "Free WiFi", "Water Facility", "Newspaper Access"], popular: false, color: "primary" },
  { name: "Monthly", price: "₹999", duration: "per month", features: ["30 Days Access", "Free WiFi", "Locker Facility", "Tea/Coffee", "Printing 50 pages", "Book Issuing"], popular: true, color: "success" },
  { name: "Quarterly", price: "₹2499", duration: "3 months", features: ["90 Days Access", "Free WiFi", "Locker Facility", "Tea/Coffee", "Printing 200 pages", "Book Issuing", "1 Free Workshop"], popular: false, color: "info" },
  { name: "Yearly", price: "₹8999", duration: "12 months", features: ["365 Days Access", "Free WiFi", "Premium Locker", "Unlimited Tea/Coffee", "Printing 1000 pages", "Book Issuing", "4 Free Workshops", "Priority Support"], popular: false, color: "danger" }
];

const BOOK_CATEGORIES = [
  { name: "UPSC Civil Services", count: 2500, icon: "bi-bank", color: "primary" },
  { name: "SSC & Banking", count: 1800, icon: "bi-calculator-fill", color: "success" },
  { name: "Engineering (GATE/JEE)", count: 3000, icon: "bi-gear-fill", color: "info" },
  { name: "Medical (NEET/AIIMS)", count: 1500, icon: "bi-heart-pulse-fill", color: "danger" },
  { name: "Management (MBA)", count: 1200, icon: "bi-bar-chart-steps", color: "warning" },
  { name: "Law (CLAT)", count: 800, icon: "bi-briefcase-fill", color: "dark" }
];

const FACILITIES_DETAILED = [
  { title: "High-Speed Internet", desc: "1 Gbps fiber optic connection for seamless online learning", icon: "bi-wifi", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { title: "AC Study Rooms", desc: "Fully air-conditioned halls with comfortable seating", icon: "bi-wind", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { title: "Power Backup", desc: "Inverter & generator backup for 24×7 uninterrupted study", icon: "bi-battery-charging", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { title: "Digital Resources", desc: "Access to e-books, online journals & video lectures", icon: "bi-display", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
  { title: "Discussion Room", desc: "Group study room for collaborative learning", icon: "bi-people", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
  { title: "Printing Service", desc: "High-speed printing & photocopy at minimal cost", icon: "bi-printer", gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" }
];

const GALLERY_IMAGES = ["library.webp", "d2.jpg", "d3.jpg", "d1.jpg"];

const FAQ_DATA = [
  { q: "What are the library timings?", a: "Our library is open 24×7, 365 days a year. You can study anytime you want." },
  { q: "Can I bring my own books?", a: "Yes, you can bring your own study materials. However, all bags are screened at the entrance for security." },
  { q: "Is WiFi available?", a: "Yes, we provide 1 Gbps high-speed fiber internet connection to all members." },
  { q: "How can I become a member?", a: "Visit our library with a valid ID proof and fill out the membership form. Plans start from just ₹999/month." },
  { q: "Is there a parking facility?", a: "Yes, we have a dedicated, secured parking space for bikes and cycles." },
  { q: "Can I take library books home?", a: "Yes, monthly and yearly members can issue up to 3 books at a time for a duration of 7 days." }
];

export default function DrishteeLibrary() {
  // Shared GPU Optimized Animation Execution
  useScrollAnimation();

  return (
    <main className="bg-light overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="position-relative d-flex align-items-center justify-content-center" style={{ minHeight: "500px", height: "80vh" }}>
        <div className="position-absolute top-0 start-0 w-100 h-100">
          <img
            src="/images/library/library.webp"
            alt="Drishtee Library Study Environment"
            className="w-100 h-100 object-fit-cover"
          />
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.85))" }} />
        </div>

        <div className="container position-relative text-white text-center text-md-start">
          <div className="row">
            <div className="col-lg-8">
              <span className="badge rounded-pill bg-warning text-dark px-3 py-2 mb-3 shadow-sm fade-up">
                <i className="bi bi-clock-fill me-1"></i> OPEN 24 × 7
              </span>
              <h1 className="display-3 fw-bold mb-3 fade-up">Drishtee Digital Library</h1>
              <p className="lead opacity-75 mb-4 fade-up pe-lg-5">
                A modern, silent and secure study space designed for serious aspirants preparing for competitive exams like UPSC, NEET, SSC & Banking.
              </p>
              <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3 fade-up">
                <button type="button" className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow">Reserve Seat</button>
                <button type="button" className="btn btn-outline-light btn-lg rounded-pill px-5 fw-bold">Visit Today</button>
              </div>
            </div>
          </div>
        </div>

        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 animate-bounce" aria-hidden="true">
          <i className="bi bi-chevron-down fs-1 text-white opacity-75"></i>
        </div>
      </section>

      {/* ================= STATS OVERLAP ================= */}
      <section className="container position-relative" style={{ marginTop: "-50px", zIndex: 10 }}>
        <div className="row g-2 g-md-4 justify-content-center px-2">
          {STATS.map((s, i) => (
            <div key={i} className="col-6 col-md-3 zoom-in">
              <div
                className="rounded-4 p-3 p-md-4 shadow-lg text-center border-0 h-100 transition-hover"
                style={{ background: s.color, color: "white" }}
              >
                <i className={`bi ${s.icon} fs-2 text-white opacity-75 mb-2 d-block`} aria-hidden="true" />
                <h4 className="fw-bold mb-0 text-white">{s.value}</h4>
                <small className="text-white-50 fw-semibold d-block">{s.label}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="container py-5 mt-4">
        <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm fade-up">
          <div className="row align-items-center">
            <div className="col-md-1 text-center d-none d-md-block">
              <div className="vr h-100 bg-primary opacity-100" style={{ width: '4px' }}></div>
            </div>
            <div className="col-md-11">
              <h2 className="fw-bold text-primary mb-3">About Drishtee Library</h2>
              <p className="text-muted">
                Drishtee Digital Library is built for students who demand discipline, focus and consistency.
                From early morning to late night, our library provides a calm academic environment where
                distractions are kept outside and productivity stays inside.
              </p>
              <div className="row mt-4 g-3">
                <div className="col-md-6">
                  <div className="d-flex gap-2 align-items-center">
                    <i className="bi bi-check-circle-fill text-success" aria-hidden="true"></i>
                    <span>Established in 2018</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex gap-2 align-items-center">
                    <i className="bi bi-check-circle-fill text-success" aria-hidden="true"></i>
                    <span>5000+ Happy Members</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex gap-2 align-items-center">
                    <i className="bi bi-check-circle-fill text-success" aria-hidden="true"></i>
                    <span>10,000+ Books Collection</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex gap-2 align-items-center">
                    <i className="bi bi-check-circle-fill text-success" aria-hidden="true"></i>
                    <span>98% Member Satisfaction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR COLLECTION SECTION ================= */}
      <section className="container py-5">
        <div className="text-center mb-5 fade-up">
          <span className="badge bg-primary bg-opacity-10 text-primary px-4 py-2 rounded-pill mb-3">
            <i className="bi bi-book-half me-2" aria-hidden="true"></i>Our Collection
          </span>
          <h2 className="display-5 fw-bold">Vast Collection of <span className="text-primary">Study Materials</span></h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
            Over 10,000 books, journals, and digital resources for all competitive exams
          </p>
        </div>
        <div className="row g-4">
          {BOOK_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="col-md-6 col-lg-4 slide-in-left" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white hover-up">
                <div className="d-flex align-items-center gap-3">
                  <div className={`bg-${cat.color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center`} style={{ width: "60px", height: "60px" }}>
                    <i className={`bi ${cat.icon} fs-2 text-${cat.color}`} aria-hidden="true"></i>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-1">{cat.name}</h6>
                    <p className="small text-muted mb-0">{cat.count}+ Books</p>
                  </div>
                  <i className="bi bi-arrow-right-circle text-primary fs-4 opacity-50" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FACILITIES GRID ================= */}
      <section className="py-5" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
        <div className="container">
          <div className="text-center mb-5 fade-up">
            <h2 className="display-5 fw-bold">Premium <span className="text-primary">Facilities</span></h2>
            <p className="text-muted">Everything you need for focused and productive study sessions</p>
          </div>
          <div className="row g-4">
            {FACILITIES_DETAILED.map((fac, idx) => (
              <div key={idx} className="col-md-6 col-lg-4 zoom-in" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="card border-0 rounded-4 overflow-hidden shadow-sm hover-up">
                  <div className="p-4 text-white" style={{ background: fac.gradient }}>
                    <i className={`bi ${fac.icon} fs-1 mb-3 d-block`} aria-hidden="true"></i>
                    <h5 className="fw-bold mb-2">{fac.title}</h5>
                    <p className="opacity-90 small mb-0">{fac.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE DRISHTEE ================= */}
      <section className="container py-5">
        <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm fade-up">
          <h3 className="fw-bold text-primary mb-4">Why Choose Drishtee?</h3>
          <div className="row g-4">
            <div className="col-md-6">
              <p className="text-muted fs-6 mb-3">
                With ultra-fast <strong>1Gbps internet</strong>, ergonomic seating, uninterrupted power backup
                and fully air-conditioned halls, Drishtee Library ensures comfort even during long study hours.
              </p>
              <ul className="list-unstyled">
                <li className="mb-2"><i className="bi bi-check2-circle text-success me-2 fw-bold" aria-hidden="true"></i> Silent Study Zones</li>
                <li className="mb-2"><i className="bi bi-check2-circle text-success me-2 fw-bold" aria-hidden="true"></i> Ergonomic Seating</li>
                <li className="mb-2"><i className="bi bi-check2-circle text-success me-2 fw-bold" aria-hidden="true"></i> Uninterrupted Power Backup</li>
                <li className="mb-2"><i className="bi bi-check2-circle text-success me-2 fw-bold" aria-hidden="true"></i> Individual Study Carrels</li>
              </ul>
            </div>
            <div className="col-md-6">
              <p className="text-muted fs-6 mb-3">
                <strong>Biometric access</strong> guarantees security, while dedicated silent zones help students
                maintain deep concentration. Clean washrooms, drinking water and free tea add convenience.
              </p>
              <ul className="list-unstyled">
                <li className="mb-2"><i className="bi bi-check2-circle text-success me-2 fw-bold" aria-hidden="true"></i> 24/7 CCTV Monitoring</li>
                <li className="mb-2"><i className="bi bi-check2-circle text-success me-2 fw-bold" aria-hidden="true"></i> RO Drinking Water & Tea</li>
                <li className="mb-2"><i className="bi bi-check2-circle text-success me-2 fw-bold" aria-hidden="true"></i> Daily Newspaper Access</li>
                <li className="mb-2"><i className="bi bi-check2-circle text-success me-2 fw-bold" aria-hidden="true"></i> Personal Lockers</li>
              </ul>
            </div>
          </div>
          <div className="mt-3 p-3 bg-light rounded-4 text-center">
            <blockquote className="text-muted mb-0 fw-bold fst-italic">"Drishtee is not just a library — it is a disciplined ecosystem built to support serious preparation."</blockquote>
          </div>
        </div>
      </section>

      {/* ================= LIBRARY RULES ================= */}
      <section className="container py-5">
        <div className="text-center mb-5 fade-up">
          <span className="badge bg-danger bg-opacity-10 text-danger px-4 py-2 rounded-pill mb-3">
            <i className="bi bi-shield-check me-2" aria-hidden="true"></i>Library Guidelines
          </span>
          <h2 className="display-5 fw-bold">Rules & <span className="text-primary">Regulations</span></h2>
          <p className="text-muted">Maintaining discipline for everyone's benefit</p>
        </div>
        <div className="row g-3">
          {LIBRARY_RULES.map((rule, idx) => (
            <div key={idx} className="col-md-6 col-lg-4 slide-in-right" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="d-flex gap-3 p-3 rounded-4 bg-white shadow-sm hover-up">
                <div className={`bg-${rule.color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0`} style={{ width: "50px", height: "50px" }}>
                  <i className={`bi ${rule.icon} fs-3 text-${rule.color}`} aria-hidden="true"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">{rule.rule}</h6>
                  <p className="small text-muted mb-0">{rule.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= MEMBERSHIP PLANS ================= */}
      <section className="py-5" style={{ background: "#f8f9fa" }}>
        <div className="container">
          <div className="text-center mb-5 fade-up">
            <span className="badge bg-success bg-opacity-10 text-success px-4 py-2 rounded-pill mb-3">
              <i className="bi bi-credit-card me-2" aria-hidden="true"></i>Membership
            </span>
            <h2 className="display-5 fw-bold">Choose Your <span className="text-primary">Plan</span></h2>
            <p className="text-muted">Flexible membership options to suit your study needs</p>
          </div>
          <div className="row g-4">
            {MEMBERSHIP_PLANS.map((plan, idx) => (
              <div key={idx} className="col-md-6 col-lg-3 zoom-in" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className={`card border-0 rounded-4 shadow-sm h-100 hover-up ${plan.popular ? 'border border-warning border-2' : ''}`}>
                  {plan.popular && (
                    <div className="position-absolute top-0 start-50 translate-middle bg-warning text-dark px-3 py-1 rounded-pill small fw-bold">
                      <i className="bi bi-star-fill me-1" aria-hidden="true"></i>Most Popular
                    </div>
                  )}
                  <div className="card-body p-4 text-center">
                    <h4 className="fw-bold mb-2">{plan.name}</h4>
                    <div className="mb-3">
                      <span className="display-4 fw-bold text-primary">{plan.price}</span>
                      <span className="text-muted">/{plan.duration}</span>
                    </div>
                    <ul className="list-unstyled text-start mt-4 mb-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="mb-2">
                          <i className="bi bi-check-circle-fill text-success me-2 small" aria-hidden="true"></i>
                          <small>{feature}</small>
                        </li>
                      ))}
                    </ul>
                    <button type="button" className={`btn btn-${plan.color} w-100 rounded-pill py-2 fw-bold`}>
                      Choose Plan <i className="bi bi-arrow-right ms-2" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GALLERY PREVIEW ================= */}
      <section className="container-fluid px-3 py-4 bg-white">
        <div className="row g-3">
          {GALLERY_IMAGES.map((img, idx) => (
            <div key={idx} className="col-6 col-md-4 col-lg-3 zoom-in" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="position-relative rounded-4 overflow-hidden bg-light border border-light-subtle" style={{ height: "200px" }}>
                <img
                  src={`/images/library/${img}`}
                  alt={`Drishtee Library Premises View ${idx + 1}`}
                  className="w-100 h-100 object-fit-cover"
                  style={{ cursor: "pointer" }}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-5" style={{ background: "#f0f2f5" }}>
        <div className="container">
          <h3 className="fw-bold mb-5 text-center fade-up">What Our Students Say</h3>
          <div className="row g-4">
            {TESTIMONIALS.map((t, i) => (
              <article key={i} className="col-md-6 col-lg-4 fade-up" style={{ transitionDelay: `${i * 50}ms` }}>
                <div className="bg-white rounded-4 p-4 shadow-sm h-100 border-top border-5 border-primary">
                  <div className="text-warning mb-3" aria-label={`Rating ${t.rating} out of 5`}>
                    {[...Array(t.rating)].map((_, r) => (
                      <i key={r} className="bi bi-star-fill" aria-hidden="true"></i>
                    ))}
                  </div>
                  <p className="text-muted mb-4 fst-italic">“{t.text}”</p>
                  <div className="d-flex align-items-center">
                    <div className="text-white rounded-circle d-flex align-items-center justify-content-center me-3 bg-gradient-primary" style={{ width: '45px', height: '45px' }}>
                      <i className="bi bi-person-fill fs-4" aria-hidden="true"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">{t.name}</h6>
                      <small className="text-primary fw-bold">{t.role}</small>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="container py-5">
        <div className="text-center mb-5 fade-up">
          <h2 className="display-5 fw-bold">Frequently Asked <span className="text-primary">Questions</span></h2>
          <p className="text-muted">Everything you need to know about Drishtee Library</p>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="accordion shadow-sm rounded-4 overflow-hidden" id="faqAccordion">
              {FAQ_DATA.map((faq, idx) => (
                <div key={idx} className="accordion-item border-0 border-bottom">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed bg-white fw-bold" type="button" data-bs-toggle="collapse" data-bs-target={`#faq${idx}`} aria-expanded="false" aria-controls={`faq${idx}`}>
                      {faq.q}
                    </button>
                  </h2>
                  <div id={`faq${idx}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-muted">{faq.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA & COUNTDOWN ================= */}
      <section className="container py-5 mb-5 mx-0 mx-lg-auto px-0 bg-white fade-up">
        <div className="rounded-5 p-4 p-lg-5 text-center position-relative overflow-hidden">
          <div className="position-absolute top-0 end-0 p-4 opacity-25" aria-hidden="true">
            <i className="bi bi-journal-bookmark-fill fs-1"></i>
          </div>
          <div className="position-absolute bottom-0 start-0 p-4 opacity-25" aria-hidden="true">
            <i className="bi bi-brightness-high-fill fs-1"></i>
          </div>
          <div className="position-relative z-1">
            <h2 className="display-5 fw-bold mb-3">Reserve Your Study Seat Now</h2>
            <p className="lead mb-4">Limited seats available to maintain a calm and silent atmosphere. Book your trial today and feel the difference.</p>
            <div className="d-inline-block p-4 bg-white bg-opacity-10 rounded-5 backdrop-blur mb-4">
              <CountdownTimer />
            </div>
            <div className="mt-3 bg-white text-dark rounded-4 overflow-hidden shadow-sm">
              <QuickSupport />
            </div>
            <div className="mt-4">
              <button type="button" className="btn btn-warning btn-lg rounded-pill px-5 fw-bold me-3 my-1">
                <i className="bi bi-calendar-check me-2" aria-hidden="true"></i>Book Free Trial
              </button>
              <button type="button" className="btn btn-outline-light btn-lg rounded-pill px-5 fw-bold my-1">
                <i className="bi bi-whatsapp me-2" aria-hidden="true"></i>Call Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <LibraryFeatures />
    </main>
  );
}