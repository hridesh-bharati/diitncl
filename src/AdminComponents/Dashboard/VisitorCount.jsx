
// AnalyticsDashboard.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Chart.js and React-Chartjs-2
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// const API_URL = "http://10.163.16.196:5000/api/dashboard";
const API_URL = "/api/google-analytics";

const COORDS = {
  India: [20.5937, 78.9629],
  "United States": [37.0902, -95.7129],
  Germany: [51.1657, 10.4515],
  Nepal: [28.3949, 84.1240],
  "United Kingdom": [55.3781, -3.4360],
  Canada: [56.1304, -106.3468],
  Australia: [-25.2744, 133.7751]
};

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("7daysAgo");

  const loadData = async () => {
    try {
      const res = await fetch(`${API_URL}?timeRange=${timeRange}`);
      if (!res.ok) throw new Error("Failed to fetch analytics from GA4 stream");
      const result = await res.json();
      setData(result);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center bg-light" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: "2rem", height: "2rem" }}></div>
        <p className="text-muted small fw-bold text-uppercase tracking-wider">Loading Dashboard Streams...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="card border-0 shadow-sm rounded-3 bg-white p-4 text-center">
          <i className="bi bi-exclamation-triangle-fill text-danger fs-1 d-block mb-2"></i>
          <h5 className="fw-bold text-dark">Connection Error</h5>
          <p className="text-muted small mb-0">{error}</p>
        </div>
      </div>
    );
  }

  // --- GA4 DATA PARSING ENGINE ---
const overview = data?.overview?.rows?.[0]?.metricValues || [];
const activeUsers = parseInt(overview[0]?.value) || 0;
const newUsers = parseInt(overview[1]?.value) || 0;
const eventCount = parseInt(overview[2]?.value) || 0;
const pageViews = parseInt(overview[3]?.value) || 0; 
const keyEvents = 0;

const prevOverview = data?.previousOverview?.rows?.[0]?.metricValues || [];
const prevActiveUsers = parseInt(prevOverview[0]?.value) || 1;
const prevNewUsers = parseInt(prevOverview[1]?.value) || 1;
const prevEventCount = parseInt(prevOverview[2]?.value) || 1;
const prevPageViews = parseInt(prevOverview[3]?.value) || 1; 

const activeChange = (((activeUsers - prevActiveUsers) / prevActiveUsers) * 100).toFixed(1);
const newChange = (((newUsers - prevNewUsers) / prevNewUsers) * 100).toFixed(1);
const eventChange = (((eventCount - prevEventCount) / prevEventCount) * 100).toFixed(1);
const viewsChange = (((pageViews - prevPageViews) / prevPageViews) * 100).toFixed(1);

  const countries = data?.countries?.rows?.map(row => ({
    name: row.dimensionValues?.[0]?.value || "Unknown",
    users: parseInt(row.metricValues?.[0]?.value) || 0
  })).sort((a, b) => b.users - a.users) || [];

  const topPages = data?.topPages?.rows?.map(row => ({
    title: row.dimensionValues?.[0]?.value || "Unknown",
    views: parseInt(row.metricValues?.[0]?.value) || 0
  })).sort((a, b) => b.views - a.views) || [];

  const trafficSources = data?.trafficSources?.rows?.map(row => ({
    source: row.dimensionValues?.[0]?.value || "Unknown",
    sessions: parseInt(row.metricValues?.[0]?.value) || 0
  })).sort((a, b) => b.sessions - a.sessions) || [];

  const chartRows = [...(data?.chart?.rows || [])].sort((a, b) =>
    (a.dimensionValues?.[0]?.value || "").localeCompare(b.dimensionValues?.[0]?.value || "")
  );

  // --- CHART.JS CONFIGURATION ---
  const trafficPieData = {
    labels: trafficSources.length > 0 ? trafficSources.map(src => src.source) : ["No Data"],
    datasets: [
      {
        label: "Sessions",
        data: trafficSources.length > 0 ? trafficSources.map(src => src.sessions) : [0],
        backgroundColor: ["#fd7e14", "#007aff", "#28a745", "#ffc107", "#6f42c1", "#dc3545"],
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 12,
      }
    ]
  };

  const trafficPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: { boxWidth: 12, color: "#4b545c", font: { size: 11, weight: "600" } }
      }
    }
  };

  const countriesPieData = {
    labels: countries.length > 0 ? countries.slice(0, 6).map(c => c.name) : ["No Data"],
    datasets: [
      {
        label: "Total Users",
        data: countries.length > 0 ? countries.slice(0, 6).map(c => c.users) : [0],
        backgroundColor: ["#20c997", "#6610f2", "#e83e8c", "#007aff", "#fd7e14", "#ffc107"],
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 12,
      }
    ]
  };

  const countriesPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: { boxWidth: 12, color: "#4b545c", font: { size: 11, weight: "600" } }
      }
    }
  };

  const stats = [
    { title: "Active Users", value: activeUsers, change: activeChange, label: "Engagement", icon: "bi-people-fill", bg: "#17a2b8", textColor: "#ffffff" },
    { title: "Event Count", value: eventCount, change: eventChange, label: "Actions", icon: "bi-lightning-fill", bg: "#28a745", textColor: "#ffffff" },
    { title: "Key Events", value: keyEvents, change: "0.0", label: "Conversions", icon: "bi-trophy-fill", bg: "#ffc107", textColor: "#1f2d3d" },
    { title: "New Users", value: newUsers, change: newChange, label: "Acquisition", icon: "bi-person-plus-fill", bg: "#dc3545", textColor: "#ffffff" },
    { title: "Page Views", value: pageViews, change: viewsChange, label: "Traffic", icon: "bi-graph-up", bg: "#4b545c", textColor: "#ffffff" }
  ];

  return (
    <div className="bg-primary-subtle px-3 py-4 ">

      {/* Main Dashboard Header */}
      <div className="bg-primary bg-gradient d-flex justify-content-between align-items-center mb-4 border-bottom pb-3 p-3 rounded shadow-sm">
        <div>
          <h1 className="fw-bold text-white m-0 h3 d-flex align-items-center gap-2">
            <i className="bi bi-speedometer2 text-light"></i> drishteeindia.com
          </h1>
          <small className="text-muted fw-semibold">Real-time Analytics Stream Platform</small>
        </div>
        <div>
          <div className="input-group">
            <span className="input-group-text bg-dark text-white border-0 small"><i className="bi bi-calendar3"></i></span>
            <select
              className="form-select border-1 text-dark fw-bold"
              style={{ minWidth: "120px", cursor: "pointer" }}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7daysAgo">7 Days</option>
              <option value="14daysAgo">14 Days</option>
              <option value="28daysAgo">28 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top Colorful Grid Section */}
      <div className="row g-3 mb-4">
        {stats.map((stat, i) => {
          const numChange = parseFloat(stat.change);
          const columnClass = i === 4 ? "col-12 col-md" : "col-6 col-md-3";
          return (
            <div className={columnClass} key={i}>
              <div
                className="card border-0 shadow-sm position-relative overflow-hidden"
                style={{ backgroundColor: stat.bg, color: stat.textColor, borderRadius: "8px", height: "130px", display: "flex", flexDirection: "column", justifyContent: "between" }}
              >
                <i className={`bi ${stat.icon} position-absolute`} style={{ fontSize: "75px", right: "-8px", top: "-10px", opacity: "0.18", pointerEvents: "none" }}></i>
                <div className="p-3 position-relative" style={{ zIndex: 2 }}>
                  <span className="fw-bold text-uppercase d-block mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px", opacity: 0.9 }}>{stat.title}</span>
                  <h2 className="fw-bold m-0" style={{ fontSize: "32px" }}>{stat.value.toLocaleString()}</h2>
                </div>
                <div className="mt-auto px-3 py-2 bg-dark bg-opacity-10 d-flex align-items-center justify-content-between" style={{ zIndex: 2 }}>
                  <span className="text-uppercase fw-bold" style={{ fontSize: "10px", opacity: 0.85 }}>{stat.label}</span>
                  <span className="fw-bold px-2 py-0.5 rounded-1 text-white" style={{ fontSize: "11px", backgroundColor: numChange >= 0 ? "rgba(40, 167, 69, 0.4)" : "rgba(220, 53, 69, 0.4)" }}>
                    {numChange > 0 ? "↑" : numChange < 0 ? "↓" : ""} {Math.abs(numChange)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* NEW ROW: Timeline (col-6) + Pie Charts (col-6) */}
      <div className="row g-3 mb-4">
        {/* LEFT COLUMN: Timeline Analytics with 3D bars */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white h-100">
            <div className="p-3 bg-white border-bottom border-light d-flex justify-content-between align-items-center" style={{ borderTop: "4px solid #007aff" }}>
              <span className="fw-bold text-dark d-flex align-items-center gap-2">
                <i className="bi bi-graph-up-arrow text-primary"></i> Active Users Timeline
              </span>
              <span className="badge bg-light text-primary border border-primary border-opacity-20 fw-bold px-2 py-1" style={{ fontSize: '10px' }}>GA4 DATA LIVE</span>
            </div>
            <div className="p-4">
              <div className="d-flex align-items-end justify-content-between px-2 pt-3 bg-light rounded" style={{ height: "280px", perspective: "800px" }}>
                {chartRows.map((row, i) => {
                  const val = parseInt(row.metricValues?.[0]?.value) || 0;
                  const max = Math.max(...(chartRows.map(r => parseInt(r.metricValues?.[0]?.value) || 0) || [1]));
                  const rawDate = row.dimensionValues?.[0]?.value || "";
                  const formattedDate = rawDate.length === 8 ? `${rawDate.slice(6, 8)}/${rawDate.slice(4, 6)}` : `D${i + 1}`;
                  const barHeight = Math.max(8, (val / max) * 140);
                  return (
                    <div key={i} className="d-flex flex-column align-items-center flex-grow-1 mx-1">
                      {/* 3D Bar Container */}
                      <div style={{ transformStyle: "preserve-3d", transform: "rotateX(5deg)" }}>
                        <div
                          className="position-relative shadow-sm transition-all"
                          style={{
                            height: `${barHeight}px`,
                            width: "32px",
                            background: "linear-gradient(135deg, #007aff 0%, #0056b3 100%)",
                            borderRadius: "4px 4px 2px 2px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)",
                            position: "relative",
                          }}
                        >
                          {/* 3D top face shine */}
                          <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "4px",
                            background: "rgba(255,255,255,0.4)",
                            borderRadius: "4px 4px 0 0"
                          }}></div>
                          {/* Value label */}
                          <div className="position-absolute w-100 text-center" style={{ bottom: "calc(100% + 4px)", fontSize: "10px", fontWeight: "bold", color: "#007aff" }}>
                            {val}
                          </div>
                        </div>
                      </div>
                      <div className="bg-white w-100 text-center py-1 border-top mt-2">
                        <span className="text-dark fw-bold d-block" style={{ fontSize: "9px" }}>{formattedDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Both Pie Charts stacked */}
        <div className="col-12 col-lg-6">
          <div className="row g-3 h-100">
            {/* Traffic Channels Pie */}
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white h-100">
                <div className="p-3 bg-white border-bottom border-light" style={{ borderLeft: "4px solid #fd7e14" }}>
                  <span className="fw-bold text-dark d-flex align-items-center gap-2">
                    <i className="bi bi-pie-chart-fill text-warning"></i> Traffic Channels
                  </span>
                </div>
                <div className="p-2" style={{ height: "220px" }}>
                  <Pie data={trafficPieData} options={trafficPieOptions} />
                </div>
                <div className="table-responsive small-table">
                  <table className="table table-sm table-striped mb-0" style={{ fontSize: "11px" }}>
                    <thead className="table-dark">
                      <tr><th>Medium</th><th className="text-end">Sessions</th></tr>
                    </thead>
                    <tbody>
                      {trafficSources.slice(0, 3).map((src, i) => (
                        <tr key={i}><td>{src.source}</td><td className="text-end">{src.sessions.toLocaleString()}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Demographics Pie */}
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white h-100">
                <div className="p-3 bg-white border-bottom border-light" style={{ borderLeft: "4px solid #28a745" }}>
                  <span className="fw-bold text-dark d-flex align-items-center gap-2">
                    <i className="bi bi-pie-chart-fill text-success"></i> Top Countries
                  </span>
                </div>
                <div className="p-2" style={{ height: "220px" }}>
                  <Pie data={countriesPieData} options={countriesPieOptions} />
                </div>
                <div className="table-responsive small-table">
                  <table className="table table-sm table-striped mb-0" style={{ fontSize: "11px" }}>
                    <thead className="table-dark">
                      <tr><th>Country</th><th className="text-end">Users</th></tr>
                    </thead>
                    <tbody>
                      {countries.slice(0, 3).map((c, i) => (
                        <tr key={i}><td>{c.name}</td><td className="text-end">{c.users.toLocaleString()}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Split Block Layout (Map and Lists) */}
      <div className="row g-3">
        {/* Left Grid Side */}
        <div className="col-12 col-lg-7">
          {/* Map Block */}
          <div className="card overflow-hidden mb-3 border-0 shadow-sm rounded-3 bg-white">
            <div className="p-3 bg-white border-bottom border-light d-flex align-items-center justify-content-between" style={{ borderLeft: "4px solid #17a2b8" }}>
              <span className="fw-bold text-dark d-flex align-items-center gap-2">
                <i className="bi bi-geo-alt-fill text-info"></i> Global Active Node Distribution Map
              </span>
              <span className="badge bg-info bg-opacity-10 text-info fw-bold rounded-1" style={{ fontSize: "10px" }}>VECTORS</span>
            </div>
            <div style={{ height: "280px", width: "100%", position: "relative" }}>
              <MapContainer center={[20.5937, 78.9629]} zoom={3} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                {countries.filter(c => c.name && c.users > 0).map((country, idx) => (
                  <Marker key={idx} position={COORDS[country.name] || [20, 0]}>
                    <Popup><div className="p-1 text-dark small fw-bold"><i className="bi bi-flag-fill text-primary me-1"></i> {country.name} <br /><span className="text-muted">Actives:</span> {country.users}</div></Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
          {/* Directory Traffic Card */}
          <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white">
            <div className="p-3 bg-white border-bottom border-light" style={{ borderLeft: "4px solid #6f42c1" }}>
              <span className="fw-bold text-dark d-flex align-items-center gap-2">
                <i className="bi bi-layers-half text-purple"></i> Screen Target Content & Request Traffic
              </span>
            </div>
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle mb-0 text-nowrap" style={{ fontSize: "13px" }}>
                <thead className="table-dark">
                  <tr><th className="ps-3">Target Directory Route / Page Title</th><th className="text-end pe-3" style={{ width: "140px" }}>Total Hits / Views</th></tr>
                </thead>
                <tbody>
                  {topPages.length > 0 ? topPages.slice(0, 10).map((page, i) => (
                    <tr key={i}><td className="ps-3 fw-semibold text-secondary"><i className="bi bi-file-earmark-text text-muted me-2"></i>{page.title}</td><td className="text-end pe-3"><span className="badge text-white bg-opacity-75 fw-bold px-2 py-1 rounded-1" style={{ backgroundColor: "#6f42c1" }}>{page.views.toLocaleString()}</span></td></tr>
                  )) : (<tr><td colSpan="2" className="p-3 text-center text-muted">No target log streams recorded.</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Grid Side - Traffic Channels & Demographics (full tables now) */}
        <div className="col-12 col-lg-5">
          {/* Traffic Channels Full Card */}
          <div className="card mb-3 border-0 shadow-sm rounded-3 overflow-hidden bg-white">
            <div className="p-3 bg-white border-bottom border-light" style={{ borderLeft: "4px solid #fd7e14" }}>
              <span className="fw-bold text-dark d-flex align-items-center gap-2">
                <i className="bi bi-diagram-3-fill text-warning"></i> Traffic Sources Details
              </span>
            </div>
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle mb-0" style={{ fontSize: "13px" }}>
                <thead className="table-dark">
                  <tr><th className="ps-3">Inbound Medium</th><th className="text-end pe-3">Sessions</th></tr>
                </thead>
                <tbody>
                  {trafficSources.length > 0 ? trafficSources.map((src, i) => (
                    <tr key={i}><td className="ps-3"><span className="badge text-uppercase font-monospace text-white px-2 py-1 rounded-1" style={{ backgroundColor: "#fd7e14", fontSize: "10px" }}>{src.source}</span></td><td className="text-end pe-3 fw-bold text-dark">{src.sessions.toLocaleString()}</td></tr>
                  )) : (<tr><td colSpan="2" className="p-3 text-center text-muted">No system channel matrix streams.</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>

          {/* Demographics Full Card */}
          <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white">
            <div className="p-3 bg-white border-bottom border-light" style={{ borderLeft: "4px solid #28a745" }}>
              <span className="fw-bold text-dark d-flex align-items-center gap-2">
                <i className="bi bi-globe2 text-success"></i> Regional Breakdown
              </span>
            </div>
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle mb-0" style={{ fontSize: "13px" }}>
                <thead className="table-dark">
                  <tr><th className="ps-3">Country Nodes</th><th className="text-end pe-3">Total Users</th></tr>
                </thead>
                <tbody>
                  {countries.length > 0 ? countries.map((country, i) => (
                    <tr key={i}><td className="ps-3 fw-semibold text-dark"><div className="d-flex align-items-center gap-2"><span className="bg-success rounded-circle" style={{ width: "6px", height: "6px" }} />{country.name}</div></td><td className="text-end pe-3 fw-bold text-secondary">{country.users.toLocaleString()}</td></tr>
                  )) : (<tr><td colSpan="2" className="p-3 text-center text-muted">No demographic streams verified.</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-muted mt-5 pt-3 border-top small" style={{ fontSize: "11px", letterSpacing: "0.2px" }}>
        <span><i className="bi bi-arrow-clockwise text-primary animate-spin"></i> GA4 Cloud Engine connected successfully • Autosync loop: 30s</span>
      </div>
    </div>
  );
}