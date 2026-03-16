import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ label = "", className = "" }) {

    const navigate = useNavigate();

    return (
        <button
            className={`btn btn-light border btn-sm rounded-0 me-1 d-flex align-items-center gap-1 ${className}`}
            onClick={() => navigate(-1)}
        >
            <i className="bi bi-arrow-left"></i>
            {label && <span>{label}</span>}
        </button>
    );
}