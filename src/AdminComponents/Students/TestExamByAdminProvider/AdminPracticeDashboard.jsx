import React from "react";
import { Link } from "react-router-dom";

export default function AdminPracticeDashboard() {
    const cards = [
        {
            title: "Upload Test",
            path: "/admin/practice-tests/upload",  
            icon: "bi-upload",
            color: "primary",
        },
        {
            title: "Live Monitoring",
            path: "/admin/practice-tests/live",
            icon: "bi-broadcast",
            color: "danger",
        },
        {
            title: "Results",
            path: "/admin/practice-tests/results",
            icon: "bi-bar-chart",
            color: "success",
        }
    ];

    return (
        <div className="container py-3">
            <h4 className="mb-3 fw-bold">Practice Test Dashboard</h4>

            <div className="row g-3">
                {cards.map((card, i) => (
                    <div className="col-6 col-md-4 col-lg-3" key={i}>
                        <Link
                            to={card.path}
                            className="card shadow-sm border-0 text-decoration-none text-dark h-100"
                        >
                            <div className="card-body text-center d-flex flex-column justify-content-center">
                                <i
                                    className={`bi ${card.icon} text-${card.color}`}
                                    style={{ fontSize: "28px" }}
                                ></i>
                                <h6 className="mt-2">{card.title}</h6>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}