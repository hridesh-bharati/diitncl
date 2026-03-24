// src/AdminComponents/Dashboard/Dashboard.jsx

import React, { useMemo } from "react";
import useAdminCounts from "../../hooks/useAdminCounts";
import { Link, useNavigate } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import "./Dashboard.css";

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
      </div>
      <h1 className="fw-bold mb-0 display-6">{value.toLocaleString()}</h1>
      <p className="small fw-bold mb-0 mt-1 opacity-75">{label}</p>
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
    <div className="container-fluid dashboard-wrapper px-3 px-md-4 py-3">
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

      {/* Recent Students & Queries */}
      <div className="row g-4 mb-5 pb-5 mb-lg-0 pb-lg-0">
        <div className="col-12 col-lg-6">
          <div className="bg-white rounded-3 shadow-sm overflow-hidden h-100">
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-primary bg-gradient text-white">
              <h6 className="fw-bold m-0">Recent Admissions</h6>
              <Link to="/admin/admitted-student-list" className="small text-decoration-none">View All</Link>
            </div>
            <table className="table table-hover mb-0">
              <tbody>
                {students.map(s => <StudentRow key={s.id} student={s} onClick={(id) => navigate(`/admin/students/${id}`)} />)}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="bg-white rounded-3 shadow-sm p-3 h-100">
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-primary bg-gradient text-white">
              <h6 className="fw-bold m-0">Latest Enquiries</h6>
              <Link to="/admin/clients-contacts" className="small text-decoration-none">View All</Link>
            </div>

            <div className="row g-2">
              {queries.map(q => (
                <div className="col-12 col-md-6 pb-3" key={q.id}>
                  <EnquiryCard enquiry={q} onClick={() => navigate("/admin/clients-contacts")} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}