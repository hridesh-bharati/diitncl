import React from 'react';
import { Link } from 'react-router-dom';
import './FeatureUpdates.css';

const notices = [
    { text: "Course certified by Microsoft.", tag: "Global", color: "#4f46e5", icon: "bi-patch-check" },
    { text: "CCC free on ADCA course", isNew: true, color: "#f59e0b", icon: "bi-gift" },
    { text: "Free English Speaking classes", isNew: true, color: "#10b981", icon: "bi-mic" },
    { text: "प्रत्येक पाठ्यक्रम पर नि: शुल्क प्रमाण पत्र", tag: "Offer", color: "#dc2626", icon: "bi-award" },
    { text: "GOVT. recognized institute", tag: "ISO", color: "#0891b2", icon: "bi-bank" },
];

export default function NoticeBoard() {
    return (
        <div className="notice-card-modern shadow-sm border-0">
            {/* Header */}
            <div className="notice-header-glass d-flex justify-content-between align-items-center p-3">
                <div className="d-flex align-items-center">
                    <div className="bell-container me-3">
                        <i className="bi bi-bell-fill text-primary"></i>
                        <span className="bell-dot"></span>
                    </div>
                    <h6 className="mb-0 fw-800 text-dark">Campus Updates</h6>
                </div>
                <div className="live-pill">
                    <span className="live-dot"></span>
                    <span className="live-text">LIVE</span>
                </div>
            </div>

            {/* Notice List */}
            <div className="notice-body p-3">
                <div className="notice-scroll-area">
                    {notices.map((n, idx) => (
                        <div key={idx} className="notice-item-wrapper mb-3 animate__animated animate__fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                            <div className="d-flex align-items-center">
                                <div className="notice-icon-box" style={{ backgroundColor: n.color + '15', color: n.color }}>
                                    <i className={`bi ${n.icon}`}></i>
                                </div>
                                <div className="ms-3 flex-grow-1">
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        {n.tag && <span className="mini-tag" style={{backgroundColor: n.color, color: '#fff'}}>{n.tag}</span>}
                                        {n.isNew && <span className="mini-tag new-glow">NEW</span>}
                                    </div>
                                    <p className="notice-text mb-0">{n.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Button */}
                <Link to="/Download-Certificate" className="notice-cta-btn mt-2">
                    <span>Verify My Certificate</span>
                    <i className="bi bi-arrow-right-circle-fill"></i>
                </Link>
            </div>
        </div>
    );
}