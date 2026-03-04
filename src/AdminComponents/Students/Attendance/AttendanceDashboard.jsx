import React from "react";
import { Link } from "react-router-dom";

export default function AttendanceDashboard() {
  
  // Mock data for visualization
  const stats = {
    totalStudents: 156,
    presentToday: 124,
    averageAttendance: 78.5,
    pendingMarks: 3
  };

  const quickActions = [
    {
      to: "/admin/students/attendance/mark",
      title: "Mark Attendance",
      description: "Record today's attendance",
      emoji: "📝",
      color: "#0d6efd",
      bgColor: "#e3f2fd",
      stats: `${stats.presentToday}/${stats.totalStudents} Present`
    },
    {
      to: "/admin/students/attendance/summary",
      title: "Summary Report",
      description: "View attendance summary",
      emoji: "📊",
      color: "#198754",
      bgColor: "#e8f5e9",
      stats: `${stats.averageAttendance}% Average`
    },
    {
      to: "/admin/students/attendance/analytics",
      title: "Analytics",
      description: "Deep insights & trends",
      emoji: "📈",
      color: "#ffc107",
      bgColor: "#fff3e0",
      stats: "Last 30 days"
    }
  ];

  const recentActivity = [
    { id: 1, action: "Marked attendance for Batch A", time: "10 min ago", status: "completed" },
    { id: 2, action: "Generated monthly report", time: "2 hours ago", status: "completed" },
    { id: 3, action: "Pending: Today's attendance", time: "Due in 2 hours", status: "pending" },
  ];

  // Weekly data for chart
  const weeklyData = [
    { day: "Mon", percentage: 70 },
    { day: "Tue", percentage: 85 },
    { day: "Wed", percentage: 65 },
    { day: "Thu", percentage: 90 },
    { day: "Fri", percentage: 75 },
    { day: "Sat", percentage: 50 }
  ];

  return (
    <div className="container py-4" style={{ maxWidth: "1200px" }}>
      
      {/* Header with Welcome */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">📋 Attendance Dashboard</h3>
          <p className="text-muted small mb-0">
            ⏰ {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        {/* Quick Stats Card */}
        <div className="bg-white rounded-4 shadow-sm p-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary bg-opacity-10 p-3 rounded-3">
              👥
            </div>
            <div>
              <span className="text-muted small">Total Students</span>
              <h4 className="fw-bold mb-0">{stats.totalStudents}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Cards - Enhanced Visualization */}
      <div className="row g-4 mb-4">
        {quickActions.map((action, index) => {
          return (
            <div key={index} className="col-md-4">
              <Link 
                to={action.to} 
                className="text-decoration-none"
                style={{ display: 'block' }}
              >
                <div 
                  className="card border-0 rounded-4 overflow-hidden shadow-sm hover-lift"
                  style={{ 
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                >
                  {/* Animated Gradient Bar */}
                  <div 
                    className="w-100" 
                    style={{ 
                      height: '4px',
                      background: `linear-gradient(90deg, ${action.color} 0%, ${action.color}80 100%)`
                    }}
                  />

                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div 
                        className="p-3 rounded-3"
                        style={{ backgroundColor: action.bgColor, fontSize: '28px' }}
                      >
                        {action.emoji}
                      </div>
                      
                      {/* Live Indicator */}
                      <div className="d-flex align-items-center gap-1">
                        <span 
                          className="badge rounded-pill px-3 py-2"
                          style={{ 
                            backgroundColor: action.bgColor,
                            color: action.color,
                            fontSize: '12px'
                          }}
                        >
                          {action.stats}
                        </span>
                      </div>
                    </div>

                    <h5 className="fw-bold mb-1">{action.title}</h5>
                    <p className="text-muted small mb-3">{action.description}</p>

                    {/* Progress Visualization */}
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-muted">📊</span>
                        <span className="small text-muted">Click to proceed</span>
                      </div>
                      <span className="text-muted">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Additional Visualizations Row */}
      <div className="row g-4">
        {/* Weekly Overview Card */}
        <div className="col-md-8">
          <div className="card border-0 rounded-4 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="fw-bold mb-0">
                  <span className="me-2">🏆</span>
                  Weekly Overview
                </h6>
                <span className="badge bg-light text-dark px-3 py-2">This Week</span>
              </div>

              {/* Simple Bar Chart Visualization */}
              <div className="d-flex align-items-end justify-content-between gap-2 mb-4">
                {weeklyData.map((item, i) => {
                  const height = item.percentage;
                  return (
                    <div key={item.day} className="text-center flex-grow-1">
                      <div 
                        className="rounded-3 mb-2 mx-auto position-relative"
                        style={{ 
                          width: '100%',
                          height: `${height}px`,
                          background: `linear-gradient(180deg, #0d6efd 0%, #0d6efd80 100%)`,
                          opacity: 0.7 + (height/200),
                          minHeight: '20px'
                        }}
                      >
                        {/* Tooltip on hover */}
                        <span 
                          className="position-absolute top-0 start-50 translate-middle-x bg-dark text-white px-2 py-1 rounded small"
                          style={{ 
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            pointerEvents: 'none',
                            fontSize: '10px',
                            whiteSpace: 'nowrap',
                            top: '-25px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                        >
                          {item.percentage}%
                        </span>
                      </div>
                      <span className="small text-muted">{item.day}</span>
                    </div>
                  );
                })}
              </div>

              <div className="d-flex justify-content-between">
                <div>
                  <span className="text-muted small">Average</span>
                  <h6 className="fw-bold mb-0">78.5%</h6>
                </div>
                <div>
                  <span className="text-muted small">Best Day</span>
                  <h6 className="fw-bold mb-0 text-success">Thursday (90%)</h6>
                </div>
                <div>
                  <span className="text-muted small">Total Classes</span>
                  <h6 className="fw-bold mb-0">24</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="col-md-4">
          <div className="card border-0 rounded-4 shadow-sm">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4">📌 Recent Activity</h6>
              
              {recentActivity.map((activity, index) => (
                <div key={index} className="d-flex align-items-center gap-3 mb-3">
                  <div 
                    className="rounded-circle"
                    style={{ 
                      width: '8px', 
                      height: '8px',
                      backgroundColor: activity.status === 'completed' ? '#28a745' : '#ffc107'
                    }}
                  />
                  <div className="flex-grow-1">
                    <p className="small mb-0 fw-medium">{activity.action}</p>
                    <span className="text-muted small">{activity.time}</span>
                  </div>
                  <span className="small">
                    {activity.status === 'completed' ? '✅' : '⏳'}
                  </span>
                </div>
              ))}

              {/* Pending Indicator */}
              {stats.pendingMarks > 0 && (
                <div className="mt-4 p-3 bg-warning bg-opacity-10 rounded-3">
                  <div className="d-flex align-items-center gap-2">
                    <span>⏰</span>
                    <span className="small fw-medium">
                      {stats.pendingMarks} attendance pending
                    </span>
                  </div>
                  {/* Mini Progress Bar */}
                  <div className="progress mt-2" style={{ height: '4px' }}>
                    <div 
                      className="progress-bar bg-warning" 
                      style={{ width: '70%' }}
                    />
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="row g-2 mt-4">
                <div className="col-6">
                  <div className="bg-light rounded-3 p-2 text-center">
                    <span className="d-block small text-muted">Today</span>
                    <span className="fw-bold">124</span>
                    <span className="text-success small ms-1">↑8%</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-light rounded-3 p-2 text-center">
                    <span className="d-block small text-muted">Weekly</span>
                    <span className="fw-bold">78.5%</span>
                    <span className="text-success small ms-1">↑2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Footer */}
      <div className="row my-5 pb-5" >
        <div className="col-12">
          <div className="bg-white rounded-4 shadow-sm p-3">
            <div className="d-flex justify-content-around">
              <Link to="/admin/students/attendance/mark" className="text-decoration-none text-center">
                <div className="bg-light rounded-circle p-3 mx-auto mb-2" style={{ width: '50px', height: '50px' }}>
                  📝
                </div>
                <small className="text-dark">Mark</small>
              </Link>
              <Link to="/admin/students/attendance/summary" className="text-decoration-none text-center">
                <div className="bg-light rounded-circle p-3 mx-auto mb-2" style={{ width: '50px', height: '50px' }}>
                  📊
                </div>
                <small className="text-dark">Summary</small>
              </Link>
              <Link to="/admin/students/attendance/analytics" className="text-decoration-none text-center">
                <div className="bg-light rounded-circle p-3 mx-auto mb-2" style={{ width: '50px', height: '50px' }}>
                  📈
                </div>
                <small className="text-dark">Analytics</small>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for hover effects */}
      <style>{`
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
        
        .card {
          transition: all 0.3s ease;
        }
        
        .progress-bar {
          transition: width 0.3s ease;
        }
        
        .position-relative:hover span {
          opacity: 1 !important;
        }
        
        @media (max-width: 768px) {
          .container {
            padding-left: 15px;
            padding-right: 15px;
          }
        }
      `}</style>
    </div>
  );
}