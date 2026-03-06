import React from "react";
import { Link } from "react-router-dom";

const terms = [
    { icon: "bi-check-circle-fill", color: "text-success", text: "This official website of Drishtee Institute has been developed to provide information to the general public." },
    { icon: "bi-pencil-square", color: "text-primary", text: "Designed and developed by students and maintained internally. Content is for reference only and not a legal document." },
    { icon: "bi-gavel", color: "text-danger", text: "Terms are governed by Indian laws. Disputes should be directed to the institute via official communication channels." },
    { icon: "bi-shield-lock", color: "text-primary", text: "User privacy is respected. Personal info is only collected when voluntarily provided for admissions or inquiries." },
    { icon: "bi-exclamation-triangle", color: "text-warning", text: "While we strive for accuracy, Drishtee does not guarantee the absolute completeness or reliability of the content." },
    { icon: "bi-person-badge", color: "text-secondary", text: "Users are responsible for actions taken based on site content. Verify details with the office before proceeding." },
    { icon: "bi-arrow-repeat", color: "text-info", text: "Drishtee reserves the right to update or modify terms, content, or services without any prior notice." },
    { icon: "bi-link-45deg", color: "text-success", text: "External links are provided for convenience. Drishtee is not responsible for their content or privacy policies." },
    { icon: "bi-shield-slash", color: "text-danger", text: "Unauthorized attempts to alter content or damage this website are prohibited and punishable under cyber laws." },
    { icon: "bi-universal-access", color: "text-primary", text: "We aim for site accessibility for all. Contact us if you face any issues while navigating the website." },
    { icon: "bi-c-circle", color: "text-dark", text: "All content is property of Drishtee Institute. Do not reproduce any material without written permission." },
    { icon: "bi-envelope-at", color: "text-success", text: "For queries or complaints, reach out via our contact page or official email address." },
];

const TermCard = ({ icon, color, text }) => (
    <div className="col-md-6 mb-3">
        <div className="card h-100 border-0 shadow-sm rounded-4 hover-lift bg-white">
            <div className="card-body d-flex align-items-start p-3">
                <div className={`p-2 rounded-3 bg-light ${color} me-3`}>
                    <i className={`bi ${icon} fs-5`}></i>
                </div>
                <p className="mb-0 text-muted small lh-base">{text}</p>
            </div>
        </div>
    </div>
);

export default function TermsOfUse() {
    return (
        <div className="bg-light min-vh-100 pb-5">
            {/* Header Section */}
            <div className="bg-white py-5 shadow-sm mb-4 border-bottom">
                <div className="container text-center">
                    <h1 className="fw-bold text-dark mb-2">
                        <span className="text-primary">TERMS</span> OF USE
                    </h1>
                    <nav className="small text-secondary fw-medium">
                        <Link to="/" className="text-decoration-none text-primary">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-dark">Terms & Conditions</span>
                    </nav>
                </div>
            </div>

            <div className="container">
                {/* Important Notice Banner */}
                <div className="alert alert-primary border-0 rounded-4 shadow-sm mb-5 p-3 text-center small">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    Please read these terms carefully before using the <strong>Drishtee Institute of Information Technology</strong> website.
                </div>

                <div className="row">
                    <div className="col-12">
                        <h4 className="fw-bold mb-4 d-flex align-items-center">
                            <i className="bi bi-card-checklist text-primary me-2"></i>
                            General Guidelines
                        </h4>
                    </div>
                    {terms.map((term, index) => (
                        <TermCard key={index} {...term} />
                    ))}
                </div>

                {/* Footer Note */}
                <div className="text-center mt-5">
                    <p className="text-muted small">
                        Last Updated: March 2026 | &copy; Drishtee Institute
                    </p>
                </div>
            </div>

            <style>{`
                .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.08)!important; }
            `}</style>
        </div>
    );
}