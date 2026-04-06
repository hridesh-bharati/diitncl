import React from 'react';
import { Link } from 'react-router-dom';

const notices = [
    { text: "Course certified by Microsoft.", tag: "Global", color: "#4f46e5", icon: "bi-patch-check" },
    { text: "CCC free on ADCA course", isNew: true, color: "#f59e0b", icon: "bi-gift" },
    { text: "Free English Speaking classes", isNew: true, color: "#10b981", icon: "bi-mic" },
    { text: "प्रत्येक पाठ्यक्रम पर नि: शुल्क प्रमाण पत्र", tag: "Offer", color: "#dc2626", icon: "bi-award" },
    { text: "GOVT. recognized institute", tag: "ISO", color: "#0891b2", icon: "bi-bank" },
];

export default function NoticeBoard() {
    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            {/* Header: Glass effect using Bootstrap opacity classes */}
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light bg-opacity-50">
                <div className="d-flex align-items-center">
                    <div className="position-relative me-3">
                        <i className="bi bi-bell-fill text-primary h5 mb-0"></i>
                        <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-white rounded-circle"
                            style={{ animation: 'pulse 2s infinite' }}></span>
                    </div>
                    <h6 className="mb-0 fw-bold text-dark" style={{ letterSpacing: '-0.5px' }}>Campus Updates</h6>
                </div>
                <div className="d-flex align-items-center  gap-2 bg-white border px-2 py-1 rounded-pill shadow-sm" style={{ fontSize: '10px' }}>
                    <span className="bg-success rounded-circle" style={{ width: '6px', height: '6px' }}></span>
                    <span className="fw-800 text-dark ">LIVE</span>
                </div>
            </div>

            {/* Notice List */}
            <div className="card-body p-3">
                <div style={{ maxHeight: '320px', overflowY: 'auto', scrollbarWidth: 'none' }}>
                    {notices.map((n, idx) => (
                        <div key={idx} className="d-flex align-items-center mb-3">
                            {/* Colorful Icon Box */}
                            <div className="rounded-3 d-flex align-items-center justify-content-center shadow-sm"
                                style={{
                                    minWidth: '40px',
                                    height: '40px',
                                    backgroundColor: `${n.color}15`,
                                    color: n.color,
                                    border: `1px solid ${n.color}20`
                                }}>
                                <i className={`bi ${n.icon} h5 mb-0`}></i>
                            </div>

                            <div className="ms-3 flex-grow-1">
                                <div className="d-flex align-items-center gap-2 mb-1">
                                    {n.tag && <span className="badge rounded-1" style={{ backgroundColor: n.color, fontSize: '9px' }}>{n.tag}</span>}
                                    {n.isNew && <span className="badge bg-danger rounded-1" style={{ fontSize: '9px', boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)' }}>NEW</span>}
                                </div>
                                <p className="mb-0 fw-bold text-secondary" style={{ fontSize: '13px' }}>{n.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Button: Pure Bootstrap with small inline fix */}
                <Link to="/Download-Certificate"
                    className="btn btn-dark w-100 mt-2 py-2 px-3 rounded-3 d-flex justify-content-between align-items-center shadow-sm border-0"
                    style={{ background: '#0f172a', transition: '0.3s' }}>
                    <span className="fw-bold" style={{ fontSize: '14px' }}>Verify My Certificate</span>
                    <i className="bi bi-arrow-right-circle-fill h5 mb-0"></i>
                </Link>
            </div>

            {/* Minimal Inline CSS for Pulse Animation */}
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(0.95) translate(-50%, -50%); opacity: 1; }
                    70% { transform: scale(1.5) translate(-35%, -35%); opacity: 0; }
                    100% { transform: scale(0.95) translate(-50%, -50%); opacity: 1; }
                }
            `}</style>
        </div>
    );
}