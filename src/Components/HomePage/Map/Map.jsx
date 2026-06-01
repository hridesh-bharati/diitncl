import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Fix default leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Official State-GIS Radar Beacon Emitting Node Animation
const createCustomIcon = (color) => {
    return new L.DivIcon({
        html: `
      <div style="position: relative; width: 24px; height: 24px;">
        <span style="background-color: ${color}; width: 24px; height: 24px; display: block; border-radius: 50%; border: 4px solid #ffffff; box-shadow: 0 0 12px rgba(0,0,0,0.6); z-index: 3; position: absolute;"></span>
        <span style="content: ''; border: 6px solid ${color}; width: 50px; height: 50px; position: absolute; top: -13px; left: -13px; border-radius: 50%; opacity: 0; animation: adminPulse 2.2s infinite linear; z-index: 1;"></span>
      </div>
      <style>
        @keyframes adminPulse {
          0% { transform: scale(0.3); opacity: 0; }
          30% { opacity: 0.7; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      </style>
    `,
        className: "admin-gis-node",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

const branchData = {
    nichlaul: {
        name: "DRISHTEE INSTITUTE OF INFORMATION TECHNOLOGY",
        hindiName: "दृष्टि इंस्टीट्यूट ऑफ  इंफॉर्मेशन टेक्नोलॉजी - निचलौल (मुख्य शाखा)",
        location: "Paragpur Road, Near Sunshine School, Nichlaul, District: Maharajganj, Uttar Pradesh - 273304",
        coordinates: [27.320516, 83.722473],
        color: "#0056b3",
        status: "CENTRAL REPOSITORY HUB (HQ)",
        centerCode: "DIIT124",
        established: "2007",
        metaRegistry: "Govt. Regd. No: 14/2025 | NGO Darpan ID: UP/20250878051",
        certification: "ISO 9001:2015 Certified Compliance Audit Standard",
        totalStudents: "500+",
        courses: { labels: ["DCA", "ADCA", "CCC", "O Level"], data: [150, 200, 100, 50] },
        stats: { certified: "2000+", systems: "20 Data Terminals", activeBatches: "12" }
    },
    thuthibari: {
        name: "DRISHTEE INSTITUTE OF INFORMATION TECHNOLOGY",
        hindiName: "दृष्टि इंस्टीट्यूट ऑफ इंफॉर्मेशन टेक्नोलॉजी - ठूठीबारी शाखा",
        location: "Main Market Road, Behind Pakli Mandi, Thuthibari, District: Maharajganj, Uttar Pradesh - 273305",
        coordinates: [27.425429, 83.691281],
        color: "#b91c1c",
        status: "REGIONAL SUB-STATION NODE",
        centerCode: "DIIT125",
        established: "2018",
        metaRegistry: "Extension Approval Ref No: DIIT-TTB/2026",
        certification: "Affiliated Subsidiary Node | Operational Verification Passed",
        totalStudents: "145",
        courses: { labels: ["DCA", "ADCA", "CCC", "Other"], data: [40, 55, 35, 15] },
        stats: { certified: "120+", systems: "18 Data Terminals", activeBatches: "06" }
    }
};

export default function BranchMapSection() {
    const [selectedBranch, setSelectedBranch] = useState("nichlaul");
    const currentBranch = branchData[selectedBranch];

    const chartData = {
        labels: currentBranch.courses.labels,
        datasets: [
            {
                data: currentBranch.courses.data,
                backgroundColor: ["#0056b3", "#198754", "#d97706", "#4b5563"],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "right",
                labels: { boxWidth: 12, font: { size: 10, family: "monospace", weight: "bold" } }
            },
        },
    };

    return (
        <div className="container-fluid my-4 px-1" style={{ backgroundColor: "#f4f6f9" }}>

            {/* Official Government Top tricolor Header Ribbon */}
            <div className="w-100 shadow-sm bg-white border border-dark-subtle rounded-1 overflow-hidden mb-4">
                <div style={{ height: "5px", background: "linear-gradient(to right, #ff9933 33%, #ffffff 33%, #ffffff 66%, #138808 66%)" }}></div>

                {/* State System Header */}
                <div className="p-3 bg-light border-bottom border-secondary-subtle d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                    <div className="d-flex align-items-center flex-wrap gap-2">
                        <div className="bg-dark text-white p-2 rounded-1 font-monospace fw-bold text-center" style={{ fontSize: "0.75rem", lineHeight: "1.2", minWidth: "75px" }}>
                            GOVT. ID<br /><span className="text-warning" style={{ fontSize: "0.65rem" }}>VERIFIED</span>
                        </div>
                        <div>
                            <span className="text-uppercase font-monospace fw-bold text-secondary d-block tracking-wider" style={{ fontSize: "0.65rem" }}>
                                National Web-GIS Mapping Network & Educational Resource Inventory Directory
                            </span>
                            <h1 className="fw-bolder m-0 text-dark" style={{ fontSize: "1.4rem", color: "#002855", letterSpacing: "-0.5px" }}>
                                District Training Node Registry & Affiliation Portal
                            </h1>
                        </div>
                    </div>
                    
                    {/* Header Right Side - Registration Metadata */}
                    <div className="mt-2 mt-md-0 text-md-end font-monospace text-secondary" style={{ fontSize: "0.75rem", lineHeight: "1.4" }}>
                        <div className="fw-bold text-dark">Reg. under The Indian Trust Act 1882</div>
                        <div>Reg No: <span className="text-primary fw-bold">14/2025</span></div>
                        <div>Darpan ID: <span className="text-success fw-bold">UP/20250878051</span></div>
                    </div>
                </div>

                {/* Dynamic Frame Wrapper */}
                <div className="row g-0">

                    {/* LEFT PANEL: Administrative GIS Map Frame */}
                    <div className="col-12 col-md-6 border-end border-dark-subtle bg-white">
                        <div className="p-2 bg-dark text-light font-monospace d-flex justify-content-between align-items-center" style={{ fontSize: "0.75rem" }}>
                            <span><i className="bi bi-pin-map-fill text-warning me-1"></i> LOGICAL GEOSPATIAL NODE DISTRIBUTION SATELLITE</span>
                            <span className="text-muted" style={{ fontSize: "0.65rem" }}>COORD REF: WGS84 / EPSG:3857</span>
                        </div>
                        <div style={{ height: "500px", width: "100%" }} className="position-relative">
                            <MapContainer
                                center={[27.3730, 83.7068]}
                                zoom={11}
                                scrollWheelZoom={false}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    attribution='&copy; Core Government Land Record Map Services'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {/* Nichlaul Node Location */}
                                <Marker
                                    position={branchData.nichlaul.coordinates}
                                    icon={createCustomIcon(branchData.nichlaul.color)}
                                    eventHandlers={{ click: () => setSelectedBranch("nichlaul") }}
                                >
                                    <Popup>
                                        <div className="font-monospace small">
                                            <strong>{branchData.nichlaul.name}</strong><br />
                                            Code: {branchData.nichlaul.centerCode}<br />
                                            Est: {branchData.nichlaul.established}
                                        </div>
                                    </Popup>
                                </Marker>
                                <Circle center={branchData.nichlaul.coordinates} radius={1400} pathOptions={{ color: branchData.nichlaul.color, fillColor: branchData.nichlaul.color, fillOpacity: 0.1 }} />

                                {/* Thuthibari Node Location */}
                                <Marker
                                    position={branchData.thuthibari.coordinates}
                                    icon={createCustomIcon(branchData.thuthibari.color)}
                                    eventHandlers={{ click: () => setSelectedBranch("thuthibari") }}
                                >
                                    <Popup>
                                        <div className="font-monospace small">
                                            <strong>{branchData.thuthibari.name}</strong><br />
                                            Code: {branchData.thuthibari.centerCode}<br />
                                            Est: {branchData.thuthibari.established}
                                        </div>
                                    </Popup>
                                </Marker>
                                <Circle center={branchData.thuthibari.coordinates} radius={1400} pathOptions={{ color: branchData.thuthibari.color, fillColor: branchData.thuthibari.color, fillOpacity: 0.1 }} />
                            </MapContainer>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Official Central System Ledger Data Sheet */}
                    <div className="col-12 col-md-6 bg-white d-flex flex-column justify-content-between">

                        {/* Government High Contrast Tab Headers */}
                        <div className="p-2 bg-dark-subtle border-bottom border-dark-subtle">
                            <div className="nav nav-tabs nav-fill border-0" role="tablist">
                                <button
                                    className={`nav-link py-2 rounded-0 fw-bold border border-dark-subtle border-bottom-0 text-uppercase tracking-wider ${selectedBranch === "nichlaul" ? "bg-white text-primary border-bottom-transparent" : "bg-light text-secondary"}`}
                                    onClick={() => setSelectedBranch("nichlaul")}
                                    style={{ fontSize: "0.78rem" }}
                                >
                                    🏢 NICHLAUL HQ (CODE: {branchData.nichlaul.centerCode})
                                </button>
                                <button
                                    className={`nav-link py-2 rounded-0 fw-bold border border-dark-subtle border-bottom-0 text-uppercase tracking-wider ${selectedBranch === "thuthibari" ? "bg-white text-danger border-bottom-transparent" : "bg-light text-secondary"}`}
                                    onClick={() => setSelectedBranch("thuthibari")}
                                    style={{ fontSize: "0.78rem" }}
                                >
                                    🛰️ THUTHIBARI NODE (CODE: {branchData.thuthibari.centerCode})
                                </button>
                            </div>
                        </div>

                        {/* Information Intensive Official Sheet */}
                        <div className="p-4 flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="badge bg-dark rounded-0 font-monospace text-uppercase px-2 py-1" style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}>
                                    REF NODE STATUS: {currentBranch.status}
                                </span>
                                <span className="badge border border-dark text-dark font-monospace rounded-0" style={{ fontSize: "0.65rem" }}>ESTABLISHED: {currentBranch.established}</span>
                            </div>

                            {/* Bilingual Title Setup */}
                            <h2 className="fw-black text-dark m-0 tracking-tight" style={{ fontSize: "1.25rem", color: "#102a43" }}>
                                {currentBranch.name}
                            </h2>
                            <div className="text-muted fw-bold mb-2 small text-secondary">{currentBranch.hindiName}</div>

                            <div className="font-monospace text-primary border-bottom border-dark-subtle pb-2 mb-3 fw-bold" style={{ fontSize: "0.75rem" }}>
                                📌 {currentBranch.metaRegistry}
                            </div>

                            {/* Authorized Certificate Verification Banner */}
                            <div className="p-2 mb-3 rounded-0 bg-success-subtle border border-success d-flex align-items-center">
                                <div className="text-success me-2 fs-5"><i className="bi bi-patch-check-fill"></i></div>
                                <div style={{ fontSize: "0.72rem" }} className="font-monospace fw-bold text-success-emphasis text-uppercase">
                                    COMPLIANCE VERDICT: {currentBranch.certification}
                                </div>
                            </div>

                            {/* High Density Metric Structural Grid Table */}
                            <table className="table table-sm table-bordered border-dark align-middle text-center font-monospace mb-3 shadow-sm" style={{ fontSize: "0.78rem" }}>
                                <thead className="table-dark text-uppercase" style={{ fontSize: "0.68rem" }}>
                                    <tr>
                                        <th className="py-2">Live Matriculations</th>
                                        <th className="py-2">Certified Candidates</th>
                                        <th className="py-2">Computational Infrastructure</th>
                                    </tr>
                                </thead>
                                <tbody className="fw-bolder text-dark bg-light">
                                    <tr>
                                        <td className="py-2 fs-5 text-primary">{currentBranch.totalStudents} Active</td>
                                        <td className="py-2 fs-5 text-success">{currentBranch.stats.certified} Issued</td>
                                        <td className="py-2 text-dark">{currentBranch.stats.systems}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Matrix Chart Analysis Component */}
                            <div className="p-2 border border-dark-subtle bg-light rounded-1">
                                <div className="font-monospace text-secondary text-uppercase fw-bold mb-2 tracking-wide" style={{ fontSize: "0.65rem" }}>
                                    STATISTICAL DISTRIBUTION MATRIX: DISCIPLINE-WISE SECTOR STREAMS
                                </div>
                                <div style={{ height: "135px" }}>
                                    <Pie data={chartData} options={chartOptions} />
                                </div>
                            </div>
                        </div>

                        {/* Bottom Official Audit Timestamp Seal Validation Section */}
                        <div className="p-3 bg-light border-top border-dark-subtle d-flex flex-column flex-sm-row justify-content-between align-items-sm-center font-monospace" style={{ fontSize: "0.7rem" }}>
                            <span className="text-dark fw-semibold"><i className="bi bi-geo-alt-fill text-dark"></i> PHYSICAL SITE LOC: <strong>{currentBranch.location}</strong></span>
                            <span className="fw-bold text-success text-uppercase mt-1 mt-sm-0 border border-success px-2 py-0.5 bg-white"><i className="bi bi-shield-lock-fill"></i> NATIONAL VERIFICATION: APPROVED</span>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}