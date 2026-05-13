import React from "react";

const AppStyleMap = () => {
  const openDirections = () => {
    const lat = 27.31581;
    const lng = 83.72161;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  return (
    <div className="position-relative w-100 overflow-hidden" style={{ height: "80vh", minHeight: "500px" }}>
      
      {/* MAP AREA */}
      <div className="w-100 h-100 bg-light" onClick={openDirections} style={{ cursor: "pointer" }}>
        <iframe
          title="Drishtee Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3544.9162355130584!2d83.72161!3d27.31581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399419806e859715%3A0x542e82fbb42e0941!2sDRISHTEE%20COMPUTER%20CENTER%20NICHLAUL!5e0!3m2!1sen!2sin!4v1770578920556!5m2!1sen!2sin"
          className="w-100 h-100 border-0"
          loading="lazy"
          allowFullScreen
        />
      </div>

      {/* FLOATING ACTION BUTTON (FAB) */}
      <button 
        className="btn btn-primary position-absolute rounded-circle shadow-lg d-flex align-items-center justify-content-center" 
        onClick={openDirections}
        style={{ top: "20px", right: "20px", width: "50px", height: "50px", zIndex: 10 }}
      >
        <i className="bi bi-geo-alt-fill fs-5"></i>
      </button>

      {/* BOTTOM INFO SHEET */}
      <div 
        className="position-absolute bottom-0 w-100 bg-white p-3 shadow-lg" 
        style={{ borderRadius: "24px 24px 0 0", zIndex: 5 }}
      >
        {/* DRAG BAR */}
        <div 
          className="bg-secondary bg-opacity-25 mx-auto mb-3" 
          style={{ width: "40px", height: "5px", borderRadius: "10px" }}
        ></div>

        <div className="px-2">
          <h6 className="fw-bold mb-1 text-dark">Drishtee Computer Center</h6>
          <p className="small text-muted mb-3">Nichlaul, Maharajganj, Uttar Pradesh</p>

          <button
            className="btn btn-primary w-100 py-2 fw-semibold rounded-pill"
            onClick={openDirections}
          >
            Get Directions
          </button>
        </div>
      </div>

    </div>
  );
};

export default AppStyleMap;