import React, { useEffect } from "react";
import AOS from "aos";
import CountdownTimer from "./Counter";
import ScrollUp from "../../../HelperCmp/Scroller/ScrollUp";
import QueryForm from "../QueryFrom";
import LibraryFeatures from "./LibraryFeatures"
/* ================= DATA ================= */

const STATS = [
  { icon: "bi-lightning-charge-fill", value: "1 Gbps", label: "Fiber Internet" },
  { icon: "bi-people-fill", value: "150+", label: "Study Seats" },
  { icon: "bi-door-open-fill", value: "24×7", label: "Open Hours" },
  { icon: "bi-shield-lock-fill", value: "News Paper", label: "Daily News Paper" },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "UPSC Aspirant",
    text: "The calm atmosphere helped me stay consistent for long hours."
  },
  {
    name: "Rahul Verma",
    role: "NEET Student",
    text: "Fast internet and silence make this library perfect."
  },
  {
    name: "Anjali Patel",
    role: "SSC Aspirant",
    text: "Feels disciplined, clean and motivating every day."
  },
];

/* ================= COMPONENT ================= */

export default function DrishteeLibrary() {

  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: "ease-out-cubic" });
  }, []);

  return (
    <div className="bg-light overflow-hidden">

      {/* ================= HERO ================= */}
      <section style={{ height: "100vh" }}>
        <img
          src="/images/library/library.webp"
          alt="Drishtee Library"
          className="hero-bg-image position-absolute top-0 start-0 w-100 h-100"
          style={{ objectFit: "cover" }}
        />


        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.08))"
          }}
        />

        <div className="position-relative h-100 d-flex align-items-center">
          <div className="container text-white position-relative bottom-0">
            <span
              className="badge bg-warning text-dark rounded-pill px-3 py-2  mb-3"
              data-aos="fade-down"
            >
              Open 24 × 7
            </span>

            <h1
              className="display-4 fw-bold mb-3"
              data-aos="fade-up"
            >
              Drishtee Digital Library
            </h1>

            <p
              className="opacity-75 col-lg-6"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              A modern, silent and secure study space designed for serious
              aspirants preparing for competitive exams.
            </p>

            <div
              className="d-flex gap-3 mt-4"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <button className="btn btn-primary btn-lg rounded-pill px-4">
                Reserve Seat
              </button>
              <button className="btn btn-light btn-lg text-primary rounded-pill px-4">
                Visit Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="container mt-n5 position-relative">
        <div className="row g-3 justify-content-center">
          {STATS.map((s, i) => (
            <div key={i} className="col-6 col-md-3" data-aos="zoom-in">
              <div className="bg-white rounded-4 p-4 shadow-sm text-center">
                <i className={`bi ${s.icon} fs-2 text-primary mb-2`} />
                <h5 className="fw-bold mb-0">{s.value}</h5>
                <small className="text-muted">{s.label}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="container mt-5" data-aos="fade-up">
        <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm">
          <h3 className="fw-bold mb-3 text-primary">
            About Drishtee Library
          </h3>
          <p className="text-muted mb-0">
            Drishtee Digital Library is built for students who demand discipline,
            focus and consistency. From early morning to late night, our library
            provides a calm academic environment where distractions are kept
            outside and productivity stays inside.
          </p>
        </div>
      </section>

      {/* ================= WHY DRISHTEE ================= */}
      <section className="container" data-aos="fade-up">
        <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm">
          <h4 className="fw-bold ">
            Why Choose Drishtee?
          </h4>

          <p className="text-muted">
            With ultra-fast 1Gbps internet, ergonomic seating, uninterrupted
            power backup and fully air-conditioned halls, Drishtee Library ensures
            comfort even during long study hours.
          </p>

          <p className="text-muted">
            Biometric access guarantees security, while dedicated silent zones
            help students maintain deep concentration. Clean washrooms,
            drinking water and free tea add convenience without breaking focus.
          </p>

          <p className="text-muted mb-0">
            Open 24×7 with flexible plans, Drishtee is not just a library —
            it is a disciplined ecosystem built to support serious preparation.
          </p>
        </div>
      </section>


      {/* ================= GALLERY ================= */}
      {/* <section className="container mt-5">
        <h5 className="fw-bold mb-3" data-aos="fade-right">
          Inside the Library
        </h5>

        <div className="row g-3">
          {["3.jpg", "1.jpg", "2.jpg"].map((img, i) => (
            <div key={i} className="col-md-4" data-aos="zoom-in">
              <img
                src={`/images/library/${img}`}
                className="w-100 rounded-4 shadow-sm"
                style={{ height: 220, objectFit: "cover" }}
                alt=""
              />
            </div>
          ))}
        </div>
      </section> */}

      <LibraryFeatures />
      {/* ================= TESTIMONIALS ================= */}
      <section className="container mt-5">
        <h5 className="fw-bold mb-4" data-aos="fade-right">
          Student Experiences
        </h5>

        <div className="row g-4">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="col-md-4" data-aos="fade-up">
              <div className="bg-white rounded-4 p-4 shadow-sm h-100">
                <p className="text-muted mb-3">“{t.text}”</p>
                <h6 className="fw-bold mb-0">{t.name}</h6>
                <small className="text-primary">{t.role}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="container-fluid mt-5 mb-5" data-aos="fade-up">
        <div className="text-center mb-4">
          <h4 className="fw-bold">Reserve Your Study Seat</h4>
          <p className="text-muted">
            Limited seats available. Book your place today.
          </p>
          <CountdownTimer />
        </div>
        <QueryForm />
      </section>

      <ScrollUp />
    </div>
  );
}
