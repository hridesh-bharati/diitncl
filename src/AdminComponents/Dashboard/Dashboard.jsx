// src/AdminComponents/Dashboard/Dashboard.jsx

import React, { useMemo } from "react";
import useAdminCounts from "../../hooks/useAdminCounts";
import { Link, useNavigate } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import "./Dashboard.css";
import VisitorCount from "./VisitorCount";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler);

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="dashboard-wrapper p-4">
    <div className="skeleton-header mb-4"><div className="skeleton-title"></div></div>
    <div className="row g-3 mb-4">
      {[1, 2, 3, 4].map(i => <div key={i} className="col-6 col-lg-3"><div className="skeleton-card"></div></div>)}
    </div>
    <div className="row g-4">
      <div className="col-12 col-lg-8"><div className="skeleton-chart"></div></div>
      <div className="col-12 col-lg-4"><div className="skeleton-chart"></div></div>
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ label, value, icon, bg, onClick, trend }) => (
  <div className="stat-card p-3 rounded-4 shadow-sm position-relative text-white overflow-hidden h-100" style={{ background: bg, cursor: 'pointer' }} onClick={onClick}>
    <div className="position-absolute end-0 bottom-0 opacity-25" style={{ fontSize: '3rem', transform: 'translate(10px, 10px) rotate(-15deg)' }}>
      <i className={`bi ${icon}`}></i>
    </div>
    <div className="position-relative" style={{ zIndex: 2 }}>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ background: 'rgba(255,255,255,0.2)', width: '40px', height: '40px' }}>
          <i className={`bi ${icon} fs-4`}></i>
        </div>
        {trend && <span className="badge bg-white text-dark bg-opacity-75" style={{ fontSize: '0.7rem' }}>{trend}</span>}
        <h1 className="fw-bold mb-0 ps-2 display-6">{value.toLocaleString()}</h1>
      </div>
      <p className="small fw-bold mb-0 my-4 opacity-75">{label}</p>
    </div>
  </div>
);

// Student Row Component
const StudentRow = ({ student, onClick }) => (
  <tr onClick={() => onClick(student.id)} style={{ cursor: 'pointer' }}>
    <td className="ps-3 align-middle border-0">
      <div className="d-flex align-items-center gap-2">
        <div style={{ width: '35px', height: '35px', flexShrink: 0 }}>
          {student.photoUrl ? (
            <img src={student.photoUrl} alt="" className="w-100 h-100 rounded-circle border" style={{ objectFit: 'cover' }} />
          ) : (
            <div className="w-100 h-100 rounded-circle bg-gradient-primary d-flex align-items-center justify-content-center fw-bold text-white text-uppercase">{student.name?.charAt(0)}</div>
          )}
        </div>
        <div className="d-flex flex-column">
          <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>{student.name}</span>
          <span className="text-muted" style={{ fontSize: '10px' }}>{student.course}</span>
        </div>
      </div>
    </td>
    <td className="pe-3 text-end text-muted align-middle border-0" style={{ fontSize: '11px' }}>
      {student.createdAt?.toDate?.().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
    </td>
  </tr>
);

// Enquiry Card Component
const EnquiryCard = ({ enquiry, onClick }) => (
  <div
    className="enquiry-card p-3 bg-white border-0 border-start border-5 border-primary shadow-sm rounded-3 h-100 mt-3"
    onClick={() => onClick(enquiry.id)} style={{ cursor: 'pointer' }}>
    <div className="d-flex justify-content-between align-items-start mb-2">
      <div className="fw-bold text-dark small text-truncate" style={{ maxWidth: '75%' }}>{enquiry.fullName || enquiry.name}</div>
      <span className="badge bg-info text-dark" style={{ fontSize: '8px' }}>NEW</span>
    </div>
    <p className="text-muted m-0 text-truncate" style={{ fontSize: '11px' }}>{enquiry.title || "Admission Inquiry"}</p>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { students, queries, counts, chartData, loading } = useAdminCounts(); // centralized hook

  // 🔹 DRY: Stats Cards Configuration
  const STAT_CARDS = useMemo(() => [
    { label: "Total Students", val: counts.total, icon: "bi-people-fill", bg: "linear-gradient(135deg,#6366f1,#8b5cf6)", link: "/admin/admitted-student-list" },
    { label: "New Today", val: counts.today, icon: "bi-lightning-fill", bg: "linear-gradient(135deg,#10b981,#3b82f6)", link: "/admin/students" },
    { label: "Enquiries", val: counts.queries, icon: "bi-chat-left-dots-fill", bg: "linear-gradient(135deg,#f59e0b,#ef4444)", link: "/admin/clients-contacts" },
    { label: "Gallery", val: "12", icon: "bi-images", bg: "linear-gradient(135deg,#ec4899,#f43f5e)", link: "/gallery" }
  ], [counts]);

  // Chart Data Setup
  const weeklyChartData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{ label: 'Admissions', data: chartData.weeklyData, backgroundColor: '#6366f1', borderRadius: 5 }]
  };

  const courseChartData = {
    labels: Object.keys(chartData.courseDistribution),
    datasets: [{ data: Object.values(chartData.courseDistribution), backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899'] }]
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="container-fluid dashboard-wrapper px-2 py-3 px-md-4 ">
      <header className="mb-4 p-3 rounded-4 shadow-sm border-0"
        style={{
          background: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)',
          color: 'white'
        }}>

        {/* Top Row: Title Only */}
        <div className="mb-2">
          <h4 className="fw-bolder m-0 d-flex align-items-center" style={{ letterSpacing: '-0.5px' }}>
            <i className="bi bi-speedometer2 me-2" style={{ fontSize: '1.4rem' }}></i>
            Admin Console
          </h4>
        </div>

        {/* Bottom Row: Date and Badge Side-by-Side */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">

          {/* Date Section */}
          <p className="small m-0 d-flex align-items-center" style={{ fontSize: "0.85rem", opacity: 0.9 }}>
            <i className="bi bi-calendar3 me-2"></i>
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>

          {/* Status Badge Section */}
          <span className="badge border-0 px-3 py-2 rounded-pill shadow-sm d-flex align-items-center"
            style={{
              background: 'linear-gradient(45deg, #ff6a00, #ee0979)',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}>
            <span className="spinner-grow spinner-grow-sm text-warning me-2" role="status" style={{ width: '8px', height: '8px' }}></span>
            SYSTEM LIVE
          </span>

        </div>
      </header>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {STAT_CARDS.map((card, i) => (
          <div className="col-6 col-lg-3" key={i}>
            <StatCard
              label={card.label}
              value={card.val}
              icon={card.icon}
              bg={card.bg}
              onClick={() => navigate(card.link)}
            />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-8">
          <div className="chart-card bg-white rounded-3 shadow-sm p-3 h-100">
            <h6 className="fw-bold border-bottom bg-primary text-white rounded-5 p-2 mb-3"><i className="bi bi-graph-up me-2"></i>Weekly Performance</h6>
            <div style={{ height: '250px' }}><Bar data={weeklyChartData} options={{ maintainAspectRatio: false }} /></div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="chart-card bg-white rounded-3 shadow-sm p-3 h-100">
            <h6 className="fw-bold border-bottom bg-primary text-white rounded-5 p-2 mb-3"><i className="bi bi-pie-chart me-2"></i>Course Split</h6>
            <div style={{ height: '250px' }}><Doughnut data={courseChartData} options={{ maintainAspectRatio: false }} /></div>
          </div>
        </div>
      </div>
      <VisitorCount />

      {/* Recent Students & Queries */}
      <div className="row g-4 mb-5 pb-5 mb-lg-0 pb-lg-0">
        <div className="col-12 col-lg-6">
          <div className="bg-white rounded-4 shadow-sm border-0 h-100 overflow-hidden">

            {/* Header */}
            <div className="p-3 d-flex justify-content-between align-items-center bg-white border-bottom border-primary border-opacity-10">
              <div className="d-flex align-items-center">
                <div className="bg-gradient-primary p-2 rounded-3 me-2 shadow-sm" style={{ background: 'linear-gradient(45deg, #4e54c8, #8f94fb)' }}>
                  <i className="bi bi-people-fill text-white fs-6"></i>
                </div>
                <h6 className="fw-bolder m-0 text-dark" style={{ letterSpacing: '-0.2px' }}>Recent Admissions</h6>
              </div>
              <Link to="/admin/admitted-student-list" className="btn btn-sm rounded-pill px-3 fw-bold text-primary border-0 bg-primary-subtle" style={{ fontSize: '11px' }}>
                View All
              </Link>
            </div>

            {/* Admission List Area */}
            <div className="px-3 py-1" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {students.length > 0 ? (
                students.map((s, index) => {

                  // 🔥 REAL-TIME STATUS LOGIC
                  const getStatusInfo = () => {
                    // Canceled: Soft Red
                    if (s.status === "canceled") return { label: "CANCELED", color: "#d32f2f", bg: "#fff1f0" };

                    // Done: Modern Blue
                    if (s.status === "done" || (s.regNo && s.issueDate)) return { label: "COMPLETED", color: "#0288d1", bg: "#e0f2fe" };

                    // Accepted: Calm Green
                    if (s.status === "accepted" || s.regNo) return { label: "ADMITTED", color: "#2e7d32", bg: "#f0fdf4" };

                    // Pending: Muted Peach/Soft Orange (Jo chubhega nahi)
                    return { label: "PENDING", color: "#ed6c02", bg: "#fff7ed" };
                  };

                  const statusInfo = getStatusInfo();

                  return (
                    <div
                      key={s.id}
                      onClick={() => navigate(`/admin/students/${s.email}`)}
                      className="enquiry-item p-3 mb-2 rounded-4 d-flex justify-content-between align-items-center transition-all border-0 shadow-none"
                      style={{ background: statusInfo.bg, cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center overflow-hidden">
                        {/* Photo Section */}
                        <div className="flex-shrink-0 me-3">
                          {s.photoUrl ? (
                            <img
                              src={s.photoUrl}
                              alt=""
                              className="rounded-circle border border-2 border-white shadow-sm"
                              style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                              style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', fontSize: '14px' }}>
                              {s.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="overflow-hidden">
                          <span className="fw-bolder text-dark d-block text-truncate" style={{ fontSize: '14px' }}>
                            {s.name}
                          </span>
                          <p className="mb-0 text-truncate fw-medium" style={{ fontSize: '11px', color: statusInfo.color, opacity: 0.9 }}>
                            <i className="bi bi-mortarboard-fill me-1"></i> {s.course || "General Course"}
                          </p>
                        </div>
                      </div>

                      {/* Date & Dynamic Badge */}
                      <div className="text-end ps-2 flex-shrink-0">
                        <div className="fw-bold mb-1" style={{ fontSize: '10px', color: statusInfo.color }}>
                          {s.createdAt?.toDate?.().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </div>
                        <span className="badge rounded-pill bg-white shadow-sm border-0"
                          style={{ fontSize: '8px', fontWeight: '800', color: statusInfo.color }}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-5 opacity-50">
                  <i className="bi bi-person-plus fs-1"></i>
                  <p className="small mt-2">No Admissions Yet</p>
                </div>
              )}
            </div>
          </div>
        </div>



        <div className="col-12 col-lg-6 mt-4">
          <div className="bg-white rounded-4 shadow-sm border-0 h-100 overflow-hidden">

            {/* Header with Color Accent */}
            <div className="p-3 d-flex justify-content-between align-items-center bg-white border-bottom border-primary border-opacity-10">
              <div className="d-flex align-items-center">
                <div className="bg-gradient-primary p-2 rounded-3 me-2 shadow-sm" style={{ background: 'linear-gradient(45deg, #6366f1, #8b5cf6)' }}>
                  <i className="bi bi-chat-dots-fill text-white fs-6"></i>
                </div>
                <h6 className="fw-bolder m-0 text-dark" style={{ letterSpacing: '-0.2px' }}>Latest Enquiries</h6>
              </div>
              <Link to="/admin/clients-contacts" className="btn btn-sm rounded-pill px-3 fw-bold text-primary border-0 bg-primary-subtle" style={{ fontSize: '11px' }}>
                View All
              </Link>
            </div>

            {/* Colorful Enquiry List */}
            <div className="px-3 py-2" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {queries.length > 0 ? (
                queries.map((q, index) => {
                  // Dynamic colors based on index for variety
                  const colors = [
                    { bg: '#eef2ff', text: '#4f46e5', border: '#818cf8' }, // Indigo
                    { bg: '#ecfdf5', text: '#059669', border: '#34d399' }, // Emerald
                    { bg: '#fff7ed', text: '#d97706', border: '#fbbf24' }, // Amber
                    { bg: '#fdf2f8', text: '#db2777', border: '#f472b6' }  // Pink
                  ];
                  const style = colors[index % colors.length];

                  return (
                    <div
                      key={q.id}
                      onClick={() => navigate("/admin/clients-contacts")}
                      className="enquiry-item p-3 mb-2 rounded-4 d-flex justify-content-between align-items-center transition-all border-0 shadow-none"
                      style={{ background: style.bg, cursor: 'pointer' }}
                    >
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="d-flex align-items-center mb-1">
                          {/* Colorful Dot */}
                          <div className="me-2 rounded-circle" style={{ width: '8px', height: '8px', background: style.text }}></div>
                          <span className="fw-bolder text-dark text-truncate" style={{ fontSize: '14px' }}>
                            {q.fullName || q.name}
                          </span>
                        </div>

                        <p className="mb-0 text-truncate fw-medium" style={{ fontSize: '11px', color: style.text, opacity: 0.8 }}>
                          <i className="bi bi-bookmark-fill me-1"></i> {q.title || "New Admission Query"}
                        </p>
                      </div>

                      {/* Date & Time with Style */}
                      <div className="text-end ps-2 flex-shrink-0">
                        <div className="fw-bold" style={{ fontSize: '10px', color: style.text }}>
                          {q.createdAt?.toDate?.().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </div>
                        <div className="text-muted opacity-75" style={{ fontSize: '9px' }}>
                          {q.createdAt?.toDate?.().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-5 opacity-50">
                  <i className="bi bi-envelope-heart fs-1 text-primary"></i>
                  <p className="small mt-2">Inbox is clean!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}