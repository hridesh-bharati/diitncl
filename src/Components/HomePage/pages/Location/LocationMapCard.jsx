import React from "react";
import { useNavigate } from "react-router-dom";
import "./LocationMapCard.css";

const AppStyleMap = () => {
  const navigate = useNavigate();

  const openDirections = () => {
    const lat = 27.31581;
    const lng = 83.72161;

    // Google Maps Direction URL
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

    window.open(url, "_blank");
  };

  return (
    <div className="app-map-wrapper">

      {/* MAP */}
      <div className="app-map" onClick={openDirections}>
        <iframe
          title="Drishtee Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3544.9162355130584!2d83.72161!3d27.31581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399419806e859715%3A0x542e82fbb42e0941!2sDRISHTEE%20COMPUTER%20CENTER%20NICHLAUL!5e0!3m2!1sen!2sin!4v1770578920556!5m2!1sen!2sin"
          loading="lazy"
          allowFullScreen
        />
      </div>

      {/* FLOATING BUTTON */}
      <button className="map-fab" onClick={openDirections}>
        <i className="bi bi-geo-alt-fill"></i>
      </button>

      {/* BOTTOM SHEET */}
      <div className="map-bottom-sheet">
        <div className="drag-bar"></div>

        <h6>Drishtee Computer Center</h6>
        <p>Nichlaul, Maharajganj, Uttar Pradesh</p>

        <button
          className="btn btn-primary w-100 rounded-pill"
          onClick={openDirections}
        >
          Get Directions
        </button>
      </div>

    </div>
  );
};

export default AppStyleMap;
