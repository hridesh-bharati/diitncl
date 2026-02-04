import React from 'react';
import { Link } from 'react-router-dom';
import './FeatureUpdates.css';

const notices = [
    { text: "Course certified by Microsoft.", tag: "Global", color: "#4f46e5" },
    { text: "CCC free on ADCA course", isNew: true, color: "#f59e0b" },
    { text: "Free English Speaking classes", isNew: true, color: "#10b981" },
    { text: "प्रत्येक पाठ्यक्रम पर नि: शुल्क प्रमाण पत्र", tag: "Offer", color: "#dc2626" },
    { text: "GOVT. recognized institute", tag: "ISO", color: "#0891b2" },
];

export default function NoticeBoard() {
    return (
        <div className="app-dashboard-card shadow-sm border-0">
            <div className="app-card-header d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <div className="position-relative me-2 fs-5">
                        <i className="bi bi-bell-fill"></i>
                        <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{animation: 'pulse 1.5s infinite'}}></span>
                    </div>
                    <h6 className="mb-0 fw-bold">Campus Updates</h6>
                </div>
                <span className="badge bg-white text-dark x-small-text rounded-pill px-3">Live</span>
            </div>

            <div className="p-3">
                {notices.map((n, idx) => (
                    <div key={idx} className="d-flex align-items-start mb-3">
                        <div className="indicator-bar mt-1" style={{ backgroundColor: n.color }}></div>
                        <div className="ms-3 flex-grow-1">
                            <div className="d-flex gap-2 mb-1">
                                {n.tag && <span className="app-badge-tag" style={{color: n.color, backgroundColor: n.color + '15'}}>{n.tag}</span>}
                                {n.isNew && <span className="app-badge-tag new-glow-tag">NEW</span>}
                            </div>
                            <p className="small fw-bold text-secondary mb-0">{n.text}</p>
                        </div>
                    </div>
                ))}
                <Link to="/Download-Certificate" className="app-btn-action shadow-sm mt-2">
                    <span>Check Certificate Status</span>
                    <i className="bi bi-arrow-right-short"></i>
                </Link>
            </div>
        </div>
    );
}