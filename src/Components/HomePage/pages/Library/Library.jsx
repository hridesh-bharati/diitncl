import React from "react";
import { Link } from "react-router-dom";

import Footer from "../../../Footer/Footer";
import CountdownTimer from "./Counter";
import LibraryFeatures from "./LibraryFeatures";
import ScrollUp from "../../../HelperCmp/Scroller/ScrollUp";
import QueryForm from "../QueryFrom";

/* =======================
   CONSTANTS / DATA
======================= */

const GRADIENTS = [
    "linear-gradient(135deg, #5f72bd, #9b23ea)",
    "linear-gradient(135deg, #11998e, #38ef7d)",
    "linear-gradient(135deg, #f7971e, #ffd200)",
    "linear-gradient(135deg, #56ccf2, #2f80ed)",
];

const STATS = [
    { icon: "bi-book", label: "Books", value: "50,000+", aos: "fade-left", color: GRADIENTS[0], delay: 100 },
    { icon: "bi-person", label: "Members", value: "2,300+", aos: "fade-right", color: GRADIENTS[1], delay: 120 },
    { icon: "bi-clock-history", label: "Open Hours", value: "24/7", aos: "fade-left", color: GRADIENTS[2], delay: 140 },
    { icon: "bi-globe", label: "Online Resources", value: "12,000+", aos: "fade-right", color: GRADIENTS[3], delay: 160 },
];

const LIBRARY_FEATURES = [
    { icon: "bi-book-half", title: "Digital Resources", text: "Access to over 50,000 e-books, academic journals, research papers, and digital learning materials." },
    { icon: "bi-wifi", title: "High-Speed WiFi", text: "Seamless high-speed internet connectivity throughout the library for uninterrupted learning." },
    { icon: "bi-laptop", title: "Computer Lab", text: "State-of-the-art computer facilities equipped with the latest software and hardware for research and learning." },
    { icon: "bi-people", title: "Study Groups", text: "Spacious collaborative zones and discussion rooms for group studies and academic interactions." },
    { icon: "bi-calendar-check", title: "24/7 Access", text: "Round-the-clock access to digital resources and extended hours during examination periods." },
    { icon: "bi-lightning-charge", title: "Inverter Backup", text: "Uninterrupted power supply with inverter backup during outages." },
    { icon: "bi-snow", title: "Air Conditioning", text: "Fully air-conditioned environment for comfortable reading and research." },
    { icon: "bi-camera-video", title: "CCTV Surveillance", text: "24/7 security with CCTV monitoring for a safe and secure environment." },
];

const GENERAL_RULES = [
    "Maintain silence in the library premises",
    "Library cards are non-transferable",
    "Keep mobile phones in silent mode",
    "Handle books and equipment with care",
    "No food or drinks allowed inside",
    "Keep your belongings safely",
];

const BORROWING_RULES = [
    "Maximum 3 books can be issued at a time",
    "Books are issued for 14 days",
    "Late fee applies after due date",
    "Lost books must be replaced or compensated",
    "Reference books for in-library use only",
    "Return books in good condition",
];

/* =======================
   SMALL REUSABLE COMPONENTS
======================= */

const SectionTitle = ({ children }) => (
    <h2 className="text-center mb-5 fw-bolder text-primary">{children}</h2>
);

const RuleCard = ({ title, rules, aos }) => (
    <div className="col-md-5" data-aos={aos}>
        <div className="p-4 rounded-4 border bg-light h-100 shadow-sm">
            <h4 className="text-primary mb-3 fw-bold">{title}</h4>
            <ul className="list-group list-group-flush text-start">
                {rules.map((rule, i) => (
                    <li key={i} className="list-group-item border-0 ps-0 bg-light">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        {rule}
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const StatCard = ({ icon, label, value, color, aos, delay }) => (
    <div className="col-6 col-md-3">
        <div
            className="p-4 rounded-3 shadow-lg text-white text-center"
            style={{
                background: color,
                minHeight: 140,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
            }}
            data-aos={aos}
            data-aos-delay={delay}
        >
            <i className={`bi ${icon} fs-1 mb-2`} />
            <h4 className="fw-bold mb-0">{value}</h4>
            <small className="mt-2">{label}</small>
        </div>
    </div>
);

/* =======================
   MAIN COMPONENT
======================= */

export default function Library() {
    return (
        <div className="pt-4 bg-white">

            {/* HERO */}
            <div className="position-relative">
                <img src="images/library/library.webp" alt="Library" className="w-100" />
                <div className="position-absolute bottom-0 start-0 end-0 p-3"
                    style={{ background: "linear-gradient(transparent, rgba(0,0,0,.7))" }}>
                    <h2 className="h4 text-white mb-1">Welcome to</h2>
                    <h1 className="h3 text-white fw-bold">Digital Learning Hub</h1>
                    <p className="text-white small opacity-75">State-of-the-art library facilities</p>
                </div>
            </div>

            {/* STATS */}
            <section className="py-5">
                <div className="container">
                    <div className="row g-3 justify-content-center">
                        {STATS.map((s, i) => <StatCard key={i} {...s} />)}
                    </div>
                </div>
            </section>

            {/* EXTRA FEATURES */}
            <LibraryFeatures />

            {/* FEATURES GRID */}
            <section className="bg-primary-subtle py-5">
                <div className="container">
                    <SectionTitle>Our Library Features</SectionTitle>
                    <div className="row g-4">
                        {LIBRARY_FEATURES.map((f, i) => (
                            <div key={i} className="col-12 col-md-6 col-lg-3">
                                <div className="card h-100 border-0 shadow-sm p-3 text-center rounded-4">
                                    <i className={`bi ${f.icon} fs-1 text-primary mb-3`} />
                                    <h5 className="fw-bold">{f.title}</h5>
                                    <p>{f.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* RULES */}
            <section className="py-5">
                <div className="container text-center">
                    <SectionTitle>Library Rules</SectionTitle>
                    <div className="row justify-content-center g-4">
                        <RuleCard title="General Rules" rules={GENERAL_RULES} aos="fade-right" />
                        <RuleCard title="Borrowing Rules" rules={BORROWING_RULES} aos="fade-left" />
                    </div>
                </div>
            </section>

            <CountdownTimer />

            {/* MAP + FORM */}
            <section className="container-fluid py-5">
                <SectionTitle>Locate Us</SectionTitle>
                <div className="row g-4 align-items-center">
                    <div className="col-md-6">
                        <iframe
                            title="Drishtee Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221.54797399460082!2d83.72486270964144!3d27.320461487836297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399419806e859715%3A0x542e82fbb42e0941!2sDRISHTEE%20COMPUTER%20CENTER%20NICHLAUL!5e0!3m2!1sen!2sin!4v1752075044710!5m2!1sen!2sin "
                            width="100%"
                            height="500"
                            style={{ border: 0 }}
                            loading="lazy"
                        />
                    </div>
                    <div className="col-md-6">
                        <QueryForm />
                    </div>
                </div>
            </section>

            <Footer />
            <ScrollUp />
        </div>
    );
}
