import React, { useState, useMemo } from 'react';
import AdmissionProvider from '../../AdminComponents/Admissions/AdmissionProvider';

// Helper: Lightweight CSS Gradient Generator for Initial Avatars
const getAvatarGradient = (name = 'S') => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#BB8FCE', '#85C1E2'];
  const charCode = name.charCodeAt(0) || 0;
  const color1 = colors[charCode % colors.length];
  const color2 = colors[(charCode + 3) % colors.length];
  return `linear-gradient(135deg, ${color1}, ${color2})`;
};

// Individual Birthday Card Component
const BirthdayCard = ({ student, isToday }) => {
  const studentPhoto = student.photoUrl || student.photoURL || student.image || student.avatar || null;
  const studentName = student.name || student.studentName || "Student";

  const handleWish = () => {
    const text = isToday 
      ? `✨ *Dear ${studentName},* ✨\n\n🎉 *Drishtee Computer Centre* wishes you a very *Happy Birthday!* 🎂\n\nMay this year bring you immense success, great health, and brilliant achievements in your learning journey. Keep shining! 🚀\n\nBest Regards,\n*Team Drishtee* 👋`
      : `⏳ Upcoming Birthday wishes to ${studentName} from Drishtee Computer Centre! 🎈`;
      
    if (navigator.share) {
      navigator.share({ title: 'Birthday Wishes', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text)
        .then(() => alert(`🎉 Wish copied to clipboard for ${studentName}!`))
        .catch(() => alert(text));
    }
  };

  const formatDisplayDate = (dobString) => {
    if (!dobString) return '';
    let parts = [];
    if (dobString.includes('/')) {
      parts = dobString.split('/'); 
      if (parts.length !== 3) return '';
      const dateObj = new Date(2000, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
      return dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    } else if (dobString.includes('-')) {
      parts = dobString.split('-'); 
      if (parts.length !== 3) return '';
      const dateObj = new Date(2000, parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
    return dobString;
  };

  return (
    <div className="col">
      <div className={`card h-100 border-0 shadow-sm text-center p-3 position-relative transition-card ${isToday ? 'border border-primary border-2 bg-gradient-light' : ''}`}>
        
        {/* Avatar Section */}
        <div className="d-flex justify-content-center my-3 position-relative align-self-center" style={{ width: '130px', height: '130px' }}>
          {studentPhoto ? (
            <img 
              src={studentPhoto} 
              alt={studentName} 
              className="rounded-circle shadow-sm object-fit-cover w-100 h-100"
              onError={(e) => { 
                e.target.style.display = 'none'; 
                if (e.target.nextSibling) e.target.nextSibling.classList.replace('d-none', 'd-flex'); 
              }}
            />
          ) : null}
          <div 
            className={`rounded-circle shadow-sm text-white fw-bold align-items-center justify-content-center w-100 h-100 fs-3 ${studentPhoto ? 'd-none' : 'd-flex'}`} 
            style={{ background: getAvatarGradient(studentName) }}
          >
            {studentName.charAt(0).toUpperCase()}
          </div>
          {isToday && (
            <span className="position-absolute bottom-0 end-0 bg-white shadow rounded-circle d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px', transform: 'translate(10%, 10%)' }}>
              🎂
            </span>
          )}
        </div>

        {/* Card Body Information */}
        <div className="card-body d-flex flex-column p-2">
          <h5 className="card-title fw-bold text-dark mb-1">{studentName}</h5>
          <p className="card-text text-muted small mb-3">
            {student.course || 'DCA/ADCA'} &bull; {student.branch || 'DIIT124'}
          </p>
          
          <div className="mt-auto">
            {isToday ? (
              <span className="badge bg-success-subtle text-success border border-success border-opacity-25 px-3 py-2 rounded-pill w-100 fs-7">
                🎉 Happy Birthday!
              </span>
            ) : (
              <span className="badge bg-secondary-subtle text-secondary px-3 py-2 rounded-pill w-100 fs-7">
                📅 {formatDisplayDate(student.dob)}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="card-footer bg-transparent border-0 p-0 my-2">
          <button 
            className={`btn w-100 fw-bold rounded-3 ${isToday ? 'btn-primary shadow-sm' : 'btn-outline-primary'}`} 
            onClick={handleWish}
          >
            {isToday ? 'Send Wishes 🎁' : 'Remind Me 🔔'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Section Component
export default function BdaySection() {
  const [viewTab, setViewTab] = useState('today');

  return (
    <AdmissionProvider>
      {({ admissions = [], loading }) => {
        
        const filteredBirthdays = useMemo(() => {
          const today = new Date();
          const currentMonth = today.getMonth() + 1; 
          const currentDate = today.getDate(); 

          const todayArr = [];
          const upcomingArr = [];

          admissions.forEach((student) => {
            if (!student?.dob || student.status === "canceled") return;

            let dobMonth = 0;
            let dobDate = 0;

            if (student.dob.includes('/')) {
              const parts = student.dob.split('/');
              if (parts.length !== 3) return;
              dobDate = parseInt(parts[0], 10);
              dobMonth = parseInt(parts[1], 10);
            } else if (student.dob.includes('-')) {
              const parts = student.dob.split('-');
              if (parts.length !== 3) return;
              dobMonth = parseInt(parts[1], 10);
              dobDate = parseInt(parts[2], 10);
            } else {
              return; 
            }

            if (dobMonth === currentMonth && dobDate === currentDate) {
              todayArr.push(student);
            } else {
              const tDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
              let bDate = new Date(today.getFullYear(), dobMonth - 1, dobDate);
              
              if (bDate < tDate) {
                bDate.setFullYear(today.getFullYear() + 1);
              }
              
              const diffTime = bDate - tDate;
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              if (diffDays > 0 && diffDays <= 7) {
                upcomingArr.push({ ...student, diffDays });
              }
            }
          });

          upcomingArr.sort((a, b) => a.diffDays - b.diffDays);

          return { today: todayArr, upcoming: upcomingArr };
        }, [admissions]);

        if (loading) {
          return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          );
        }

        const activeList = viewTab === 'today' ? filteredBirthdays.today : filteredBirthdays.upcoming;

        return (
          <div className="container-fluid py-4" style={{ maxWidth: '1400px' }}>
            
            {/* Real App Dashboard Style Header */}
            <div className="p-4 p-md-5 mb-4 rounded-4 darkBG text-white shadow-sm position-relative overflow-hidden">
              <div className="position-relative z-1">
                <h1 className="display-6 fw-extrabold mb-2">✨ Drishtee Celebrations</h1>
                <p className="lead mb-0 opacity-90 fs-6 fs-md-5">Sharing happiness and grooming profiles within our student community.</p>
              </div>
            </div>

            {/* Bootstrap Navigation Pills for Tabs */}
            <div className="d-flex justify-content-center mb-4">
              <ul className="nav nav-pills bg-light p-1 rounded-pill shadow-sm">
                <li className="nav-item">
                  <button 
                    className={`nav-link rounded-pill fw-bold px-4 py-2 ${viewTab === 'today' ? 'active shadow-sm' : 'text-secondary'}`}
                    onClick={() => setViewTab('today')}
                  >
                    📅 Today <span className={`badge ms-2 ${viewTab === 'today' ? 'bg-white text-primary' : 'bg-secondary text-white'}`}>{filteredBirthdays.today.length}</span>
                  </button>
                </li>
                <li className="nav-item ">
                  <button 
                    className={`nav-link rounded-pill fw-bold px-4 py-2 ${viewTab === 'upcoming' ? 'active shadow-sm' : 'text-secondary'}`}
                    onClick={() => setViewTab('upcoming')}
                  >
                    ⏳ Next 7 Days <span className={`badge ms-2 ${viewTab === 'upcoming' ? 'bg-white text-primary' : 'bg-secondary text-white'}`}>{filteredBirthdays.upcoming.length}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* MASTER GRID: Balanced split into 6 cols (Left) and 6 cols (Right) */}
            <div className="row g-4">
              
              {/* LEFT SIDE: Student Cards Grid (6 Columns on md and larger) */}
              <div className="col-md-6">
                {activeList.length === 0 ? (
                  <div className="text-center py-5 border rounded-4 bg-light shadow-sm h-100 d-flex flex-column justify-content-center align-items-center">
                    <div className="fs-1 mb-2">🎉</div>
                    <h5 className="text-secondary mb-0">No birthdays scheduled in this filter!</h5>
                  </div>
                ) : (
                  <div className="row  g-3">
                    {activeList.map((student, idx) => (
                      <BirthdayCard 
                        key={student.id || student.applicationId || idx} 
                        student={student} 
                        isToday={viewTab === 'today'} 
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT SIDE: Static Brand Wishes Panel (6 Columns on md and larger) */}
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm rounded-4 p-4 d-flex flex-column text-center bg-white border border-light" style={{ minHeight: '350px' }}>

                  {/* Main Greeting Content */}
                  <div className="my-auto py-3">
                    <div className="display-5 mb-1">🎂</div>
                    <h3 className="fw-extrabold text-dark mb-0">Happy Birthday!</h3>
                    <p className="text-secondary p-2 pb-0">
                      Drishtee Computer Centre wishes all our wonderful students an amazing birthday. May your skills grow and your future be filled with limitless tech achievements!
                    </p>
                  </div>

                  {/* Corporate Signature Footer */}
                  <div className="mt-auto pt-0 border-top">
                    <p className="text-muted small mb-1">Warm Regards,</p>
                    <p className="fw-bold text-dark mb-0 fs-5">Team Drishtee</p>
                    <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 mt-2 fw-bold" style={{ fontSize: '0.75rem' }}>
                      🚀 Learn • Grow • Achieve
                    </span>
                  </div>

                </div>
              </div>

            </div>

            {/* Extra Styling for smooth hover effects */}
            <style jsx global>{`
              .transition-card {
                transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
              }
              .transition-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important;
              }
              .bg-gradient-light {
                background: linear-gradient(to bottom, #ffffff, #f8faff);
              }
              .fw-extrabold { font-weight: 800; }
              .opacity-90 { opacity: 0.9; }
              .fs-7 { font-size: 0.85rem; }
            `}</style>

          </div>
        );
      }}
    </AdmissionProvider>
  );
}