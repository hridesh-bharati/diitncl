import React from "react";
import CountdownTimer from "./Counter";
import LibraryFeatures from "./LibraryFeatures";
import ScrollUp from "../../../HelperCmp/Scroller/ScrollUp";
import QueryForm from "../QueryFrom";

/* =======================
   DATA
======================= */

const STATS = [
  { icon: "📚", label: "Digital Resources", value: "75K+" },
  { icon: "🏆", label: "Toppers", value: "650+" },
  { icon: "⏰", label: "Open Hours", value: "24/7" },
  { icon: "🚀", label: "Internet", value: "1Gbps" },
  { icon: "🧠", label: "Study Seats", value: "150+" },
  { icon: "☕", label: "Cafe", value: "Free" },
];

const FEATURES = [
  {
    icon: "bi-wifi",
    title: "High Speed Internet",
    description: "1Gbps unlimited internet for uninterrupted study",
  },
  {
    icon: "bi-book",
    title: "Digital Library",
    description: "Thousands of books, PDFs and online resources",
  },
  {
    icon: "bi-volume-mute",
    title: "Silent Zone",
    description: "Noise-free environment for deep focus",
  },
  {
    icon: "bi-lightning",
    title: "Power Backup",
    description: "24×7 electricity with inverter support",
  },
  {
    icon: "bi-person-workspace",
    title: "Personal Seating",
    description: "Comfortable chairs & dedicated desks",
  },
  {
    icon: "bi-cup-hot",
    title: "Refreshments",
    description: "Free water & tea for students",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "UPSC Aspirant",
    content: "Best study environment I have ever experienced.",
  },
  {
    name: "Rahul Verma",
    role: "NEET Student",
    content: "Silent zone and internet speed are top class.",
  },
  {
    name: "Anjali Patel",
    role: "SSC Aspirant",
    content: "Perfect place for serious preparation.",
  },
];

/* =======================
   MAIN COMPONENT
======================= */

export default function DrishteeLibrary() {
  return (
    <div className="bg-light">

      {/* ================= HERO ================= */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center g-5">

            <div className="col-lg-6">
              <span className="badge bg-primary mb-3">
                Smart Digital Library
              </span>
              <h1 className="display-4 fw-bold mb-3">
                Drishtee <span className="text-primary">Library</span>
              </h1>
              <p className="lead text-muted mb-4">
                A modern study library for UPSC, NEET, SSC & competitive exams.
                Peaceful environment with premium facilities.
              </p>

              <div className="d-flex gap-3">
                <button className="btn btn-primary btn-lg">
                  Join Now
                </button>
                <button className="btn btn-outline-primary btn-lg">
                  Visit Library
                </button>
              </div>
            </div>

            <div className="col-lg-6 text-center">
              <img
                src="/images/library/library.webp"
                alt="Library"
                className="img-fluid rounded-4 shadow"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-4 bg-white">
        <div className="container">
          <div className="row text-center g-4">
            {STATS.map((s, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-2">
                <div className="border rounded-3 p-3 shadow-sm h-100">
                  <div className="fs-2 mb-1">{s.icon}</div>
                  <h5 className="fw-bold mb-0">{s.value}</h5>
                  <small className="text-muted">{s.label}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-5">
        <div className="container">

          <div className="text-center mb-5">
            <h2 className="fw-bold">Library Facilities</h2>
            <p className="text-muted">
              Everything you need for focused preparation
            </p>
          </div>

          <div className="row g-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <i className={`bi ${f.icon} fs-2 text-primary mb-3`}></i>
                    <h5 className="fw-bold">{f.title}</h5>
                    <p className="text-muted mb-0">{f.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= LIBRARY IMAGES ================= */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center g-4">

            <div className="col-lg-5">
              <h3 className="fw-bold mb-3">Study Environment</h3>
              <p className="text-muted">
                Well-lit halls, comfortable seating and distraction-free zones.
              </p>
            </div>

            <div className="col-lg-7">
              <div className="row g-3">
                <div className="col-6">
                  <img
                    src="/images/library/1.jpg"
                    className="img-fluid rounded shadow"
                    alt=""
                  />
                </div>
                <div className="col-6">
                  <img
                    src="/images/library/2.jpg"
                    className="img-fluid rounded shadow"
                    alt=""
                  />
                </div>
                <div className="col-12">
                  <img
                    src="/images/library/3.jpg"
                    className="img-fluid rounded shadow"
                    alt=""
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="col-md-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <h6 className="fw-bold mb-0">{t.name}</h6>
                    <small className="text-primary">{t.role}</small>
                    <p className="text-muted mt-2">
                      "{t.content}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA + FORM ================= */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-4 align-items-center">

            <div className="col-lg-6">
              <h3 className="fw-bold mb-3">
                Limited Seats Available
              </h3>
              <p className="text-muted mb-4">
                Enroll now and secure your study seat.
              </p>
              <CountdownTimer />
            </div>

            <div className="col-lg-6">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <QueryForm />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <ScrollUp />
    </div>
  );
}
