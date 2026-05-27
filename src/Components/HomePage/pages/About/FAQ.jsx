import React, { useState, useMemo, useCallback, memo, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../../../Footer/Footer";

// Memory Optimization: Static arrays ko render cycle se bahar nikala
const FAQ_CATEGORIES = [
  { id: "general", name: "General", icon: "bi-question-circle" },
  { id: "courses", name: "Courses & Fees", icon: "bi-book" },
  { id: "admission", name: "Admission", icon: "bi-pencil-square" },
  { id: "certificate", name: "Certificate", icon: "bi-award" },
  { id: "support", name: "Support", icon: "bi-headset" },
];

const FAQS_DATA = [
  {
    id: 1,
    category: "general",
    question: "What is Drishtee Computer Center?",
    answer: "Drishtee Computer Center is a government recognized IT training institute in Nichlaul, Maharajganj. We offer professional computer courses including CCC, ADCA, Web Development, Python, Designing, and Banking courses with placement support."
  },
  {
    id: 2,
    category: "general",
    question: "Where is Drishtee Computer Center located?",
    answer: "We have two branches:\n\n• Main Branch: Paragpur Road, Near Sunshine School, Nichlaul, Maharajganj (UP) - 273304\n• Thoothibari Branch: Thoothibari, Maharajganj (UP)\n\nContact: +91-7267995307"
  },
  {
    id: 3,
    category: "general",
    question: "What are the operating hours?",
    answer: "Monday to Saturday: 8:00 AM - 8:00 PM\nSunday: 9:00 AM - 2:00 PM\n\nLibrary hours: 7:00 AM - 8:00 PM (All days)"
  },
  {
    id: 4,
    category: "general",
    question: "Is Drishtee Computer Center government recognized?",
    answer: "Yes, our institute is government recognized and affiliated with NIELIT (DOEACC Society). We are also registered under MSME (Government of India)."
  },
  {
    id: 5,
    category: "courses",
    question: "What courses does Drishtee Computer Center offer?",
    answer: "We offer a wide range of courses:\n\n• Short Term: CCC, CCC+, Basic Computer\n• Diploma: ADCA, DCA\n• Programming: Python, C, C++, Java\n• Web Development: HTML, CSS, JavaScript, React, PHP\n• Designing: Graphic Design, Photoshop, CorelDRAW\n• Banking: Tally, Busy, GST, Income Tax\n• Government Exams: NIELIT CCC, O-Level"
  },
  {
    id: 8,
    category: "courses",
    question: "What are the course fees?",
    answer: "Our courses are affordable and budget-friendly:\n\n• CCC Course: Starting from ₹2,999\n• ADCA: Starting from ₹8,999\n• Web Development: Starting from ₹12,999\n• Python Programming: Starting from ₹7,999\n• Designing: Starting from ₹6,999\n• Tally with GST: Starting from ₹5,999\n\n*Contact us for current fee structure and installment options."
  },
  {
    id: 9,
    category: "courses",
    question: "Do you offer online courses?",
    answer: "Yes, we offer select courses online including CCC, Basic Computer, Python Programming, and Web Development basics. Live interactive classes and recorded sessions are available for online students."
  },
  {
    id: 10,
    category: "courses",
    question: "What is NIELIT CCC course?",
    answer: "CCC (Course on Computer Concepts) is a government recognized certificate course by NIELIT, Ministry of Electronics & IT. It covers basic computer knowledge, internet usage, and office applications. This certificate is valid for government job applications."
  },
  {
    id: 11,
    category: "admission",
    question: "What is the admission process?",
    answer: "Admission is simple:\n\n1. Visit our center or apply online through our website\n2. Fill the admission form\n3. Pay course fees (cash/online)\n4. Submit required documents\n5. Get your enrollment number and start classes"
  },
  {
    id: 12,
    category: "admission",
    question: "What documents are required for admission?",
    answer: "Required documents:\n\n• Passport size photographs (2 copies)\n• Valid Identity Proof copy\n• 10th/12th Marksheet (if available)\n• Previous qualification certificates (if any)\n• Caste certificate (for scholarship)\n\n*No original documents required, only self-attested copies."
  },
  {
    id: 13,
    category: "admission",
    question: "Is there any scholarship available?",
    answer: "Yes! We offer:\n\n• Meritorious Student Scholarship: Up to 50% off on fees\n• Economically Weaker Section: Special discounts\n• Group Admission: 20% off for 3+ students\n• Early Bird Discount: 10% off for admission in first week of month\n\n*Contact administration for scholarship eligibility."
  },
  {
    id: 14,
    category: "admission",
    question: "What is the eligibility criteria?",
    answer: "Eligibility varies by course:\n\n• CCC/Basic Courses: Class 8th pass\n• Diploma Courses: Class 10th or 12th\n• Programming/Web Development: Class 12th (preferred)\n• No upper age limit for any course\n\nBasic computer knowledge is recommended but not mandatory for beginner courses."
  },
  {
    id: 15,
    category: "admission",
    question: "Can I join classes after admission starts?",
    answer: "Yes, we have batch starts every 1st and 15th of each month. You can join any ongoing batch, and our teachers will provide catch-up sessions to cover missed topics."
  },
  {
    id: 16,
    category: "certificate",
    question: "How can I download my certificate?",
    answer: "To download your certificate:\n\n1. Go to 'Download Certificate' page\n2. Enter your Certificate ID\n3. Enter your registered mobile number\n4. Click 'Verify Certificate'\n5. Download your digital certificate\n\n*If you face issues, contact our support team."
  },
  {
    id: 17,
    category: "certificate",
    question: "Is the certificate valid for government jobs?",
    answer: "Yes! Our certificates are recognized by:\n\n• NIELIT (Government of India)\n• MSME (Government of India)\n• Skill India\n\nNIELIT certificates are valid for all central/state government job applications."
  },
  {
    id: 18,
    category: "certificate",
    question: "Can I verify someone else's certificate?",
    answer: "Yes, anyone can verify a certificate by visiting our 'Certificate Verification' page and entering the certificate ID. It's a public service to prevent fake certificates."
  },
  {
    id: 19,
    category: "certificate",
    question: "What if I lose my certificate?",
    answer: "Don't worry! You can:\n\n• Download digital copy anytime from our website\n• Request a duplicate physical certificate (₹200 fee)\n• Contact our office with your enrollment number for immediate assistance"
  },
  {
    id: 20,
    category: "support",
    question: "How can I contact support?",
    answer: "Reach us through:\n\n📞 Phone: +91-7267995307\n📧 Email: support@drishteeindia.com\n💬 Live Chat: Available on our website\n📍 Visit: Our branches (9 AM - 6 PM)\n\nResponse time: Within 24 hours"
  },
  {
    id: 21,
    category: "support",
    question: "Do you provide placement assistance?",
    answer: "Absolutely! Our placement cell provides:\n\n• Resume building workshops\n• Interview preparation\n• Soft skills training\n• Job alerts via WhatsApp\n• Campus placement drives\n\nOur students have been placed in leading companies like TCS, Infosys, Wipro, and local businesses."
  },
  {
    id: 22,
    category: "support",
    question: "What if I miss a class?",
    answer: "We understand you might miss classes. We provide:\n\n• Backup classes on weekends\n• Personal doubt sessions\n• Recorded video lectures\n• Study material access\n\nContact your class coordinator to schedule makeup classes."
  },
  {
    id: 23,
    category: "support",
    question: "Do you offer demo classes?",
    answer: "Yes! We offer FREE demo classes for all courses. You can:\n\n• Attend 2 demo classes for free\n• Meet our faculty\n• Check lab facilities\n• Get course details\n\nCall +91-7267995307 to book your demo slot."
  },
  {
    id: 24,
    category: "support",
    question: "Is there a library facility?",
    answer: "Yes! Our library is open 7:00 AM - 8:00 PM. Features:\n\n• 5000+ books on computers, programming, and competitive exams\n• Free Wi-Fi\n• Reading room with AC\n• Daily newspapers and magazines\n• Laptop charging points\n\nFree for enrolled students!"
  },
  {
    id: 25,
    category: "support",
    question: "Do you provide study materials?",
    answer: "Yes, we provide:\n\n• Printed course books\n• PDF notes via our student app\n• Practice assignments\n• Previous year question papers\n• Online test series\n\nAll materials are included in course fees."
  }
];

// Sub-component optimized with React.memo for prevention of unnecessary re-renders
const FAQItem = memo(({ faq, isOpen, onToggle }) => {
  return (
    <article className="card border-0 shadow-sm mb-3 rounded-3 faq-card">
      <button
        className="btn btn-link w-100 text-start p-3 text-decoration-none"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq.id}`}
        id={`faq-question-${faq.id}`}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <i className={`bi ${isOpen ? 'bi-dash-circle-fill text-primary' : 'bi-plus-circle-fill text-primary'}`} aria-hidden="true"></i>
            <h3 className="h5 mb-0 fw-semibold text-dark">{faq.question}</h3>
          </div>
          <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'} text-muted`} aria-hidden="true"></i>
        </div>
      </button>
      <div
        id={`faq-answer-${faq.id}`}
        role="region"
        aria-labelledby={`faq-question-${faq.id}`}
        className={`collapse ${isOpen ? 'show' : ''}`}
      >
        <div className="card-body pt-0 pb-3 px-3 px-md-5">
          <div className="text-muted lh-base" style={{ whiteSpace: "pre-line" }}>
            {faq.answer}
          </div>
        </div>
      </div>
    </article>
  );
});

FAQItem.displayName = "FAQItem";

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaqs, setOpenFaqs] = useState({});

  // UseCallback optimization: Toggling function recreate nahi hoga har render pe
  const toggleFaq = useCallback((id) => {
    setOpenFaqs(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // UseMemo optimization: Search/Filter algorithms tabhi chalenge jab dependence badlegi
  const filteredFaqs = useMemo(() => {
    const cleanSearch = searchTerm.toLowerCase().trim();
    return FAQS_DATA.filter(faq => {
      const matchesCategory = faq.category === activeCategory;
      const matchesSearch = cleanSearch === "" ||
        faq.question.toLowerCase().includes(cleanSearch) ||
        faq.answer.toLowerCase().includes(cleanSearch);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  // Total count calculate karne ke liye efficient filter count
  const categoryCounts = useMemo(() => {
    return FAQS_DATA.reduce((acc, faq) => {
      acc[faq.category] = (acc[faq.category] || 0) + 1;
      return acc;
    }, {});
  }, []);

  // Google Ranking Structure (FAQ Schema SEO Injection)
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": FAQS_DATA.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer.replace(/\n/g, " ")
        }
      }))
    };

    const scriptId = "faq-structured-data";
    let scriptContainer = document.getElementById(scriptId);

    if (!scriptContainer) {
      scriptContainer = document.createElement("script");
      scriptContainer.id = scriptId;
      scriptContainer.type = "application/ld+json";
      document.head.appendChild(scriptContainer);
    }

    scriptContainer.text = JSON.stringify(schema);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();
    };
  }, []);

  return (
    <div className="bg-light min-vh-100 pb-5 pb-lg-0">

      {/* Header Section */}
      <header className="bg-white py-5 shadow-sm mb-4 border-bottom">
        <div className="container text-center">
          <h1 className="fw-bold text-dark mb-3">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-muted fs-5 mb-4">
            Find answers to your questions about courses, admission, certificates and more
          </p>
          <nav aria-label="breadcrumb" className="small text-secondary fw-medium">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-primary">Home</Link></li>
              <li className="breadcrumb-item active text-dark" aria-current="page">FAQ</li>
            </ol>
          </nav>
        </div>
      </header>

      <main className="container">

        {/* Search Bar */}
        <section className="row justify-content-center mb-5" aria-label="FAQ Search">
          <div className="col-md-8">
            <div className="input-group shadow-sm rounded-3 overflow-hidden">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-primary" aria-hidden="true"></i>
              </span>
              <input
                type="search"
                className="form-control border-start-0 py-3"
                placeholder="Search your question..."
                aria-label="Search frequently asked questions"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="btn btn-light border-start-0"
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchTerm("")}
                >
                  <i className="bi bi-x-lg" aria-hidden="true"></i>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Categories Tabs Navigation */}
        <nav className="row mb-5" aria-label="FAQ Categories">
          <div className="col-12">
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {FAQ_CATEGORIES.map(category => {
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    className={`btn px-4 py-2 rounded-pill fw-semibold transition-all ${isActive ? "btn-primary shadow-sm text-white" : "btn-outline-primary bg-white"
                      }`}
                    onClick={() => setActiveCategory(category.id)}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <i className={`bi ${category.icon} me-2`} aria-hidden="true"></i>
                    {category.name}
                    <span className={`ms-2 badge ${isActive ? 'bg-light text-primary' : 'bg-primary bg-opacity-10 text-primary'}`}>
                      {categoryCounts[category.id] || 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* FAQ List Content */}
        <section className="row" aria-label="FAQ Answers">
          <div className="col-lg-8 mx-auto">
            {filteredFaqs.length > 0 ? (
              <>
                <div className="text-center mb-4">
                  <p className="text-muted small">
                    <i className="bi bi-info-circle me-1" aria-hidden="true"></i>
                    Showing {filteredFaqs.length} questions
                  </p>
                </div>
                {filteredFaqs.map(faq => (
                  <FAQItem
                    key={faq.id}
                    faq={faq}
                    isOpen={!!openFaqs[faq.id]}
                    onToggle={() => toggleFaq(faq.id)}
                  />
                ))}
              </>
            ) : (
              <div className="text-center py-5 bg-white rounded-3 shadow-sm">
                <i className="bi bi-inbox fs-1 text-muted" aria-hidden="true"></i>
                <h2 className="h4 mt-3 text-dark">No questions found</h2>
                <p className="text-muted">Try searching with different keywords</p>
                <button
                  type="button"
                  className="btn btn-primary mt-2"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("general");
                  }}
                >
                  <i className="bi bi-arrow-repeat me-2" aria-hidden="true"></i>
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Support CTA Section */}
        <section className="row mt-5 pt-4" aria-label="Contact Support Center">
          <div className="col-12">
            <div className="card border-0 bg-gradient-primary shadow-lg rounded-4 overflow-hidden">
              <div className="card-body p-4 p-lg-5 text-center text-white">
                <i className="bi bi-chat-dots-fill fs-1 mb-3" aria-hidden="true"></i>
                <h2 className="fw-bold mb-3">Still have questions?</h2>
                <p className="mb-4 fs-5 opacity-90">
                  Can't find the answer you're looking for? We're here to help!
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <Link to="/contact-us" className="btn btn-light btn-lg rounded-pill px-4">
                    <i className="bi bi-envelope me-2" aria-hidden="true"></i>
                    Contact Support
                  </Link>
                  <a
                    href="https://wa.me/917267995307"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-light btn-lg rounded-pill px-4"
                  >
                    <i className="bi bi-whatsapp me-2" aria-hidden="true"></i>
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats Grid */}
        <section className="row mt-5 g-3 mb-5" aria-label="Center Statistics">
          {[
            { icon: "bi-people-fill", value: "5000+", label: "Students Trained" },
            { icon: "bi-award-fill", value: "20+ ", label: "Courses Offered" },
            { icon: "bi-star-fill", value: "4.8", label: "Google Rating" },
            { icon: "bi-building", value: "2", label: "Active Branches" }
          ].map((stat, i) => (
            <div className="col-md-3 col-6" key={i}>
              <div className="card border-0 shadow-sm text-center p-3 h-100">
                <i className={`bi ${stat.icon} fs-2 text-primary`} aria-hidden="true"></i>
                <div className="fw-bold fs-3 mt-2 mb-0 text-dark">{stat.value}</div>
                <p className="text-muted small mb-0">{stat.label}</p>
              </div>
            </div>
          ))}
        </section>
      </main>

      <style jsx="true">{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #00378a 0%, #0056b3 100%);
        }
        .faq-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .faq-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.08) !important;
        }
        .btn-primary {
          background-color: #00378a;
          border-color: #00378a;
        }
        .btn-primary:hover {
          background-color: #002a6b;
          border-color: #002a6b;
        }
        .btn-outline-primary {
          color: #00378a;
          border-color: #00378a;
        }
        .btn-outline-primary:hover {
          background-color: #00378a;
          border-color: #00378a;
          color: #fff;
        }
        .transition-all {
          transition: all 0.25s ease-in-out;
        }
      `}</style>

      <div className="mt-2">
        <Footer />
      </div>
    </div>
  );
}