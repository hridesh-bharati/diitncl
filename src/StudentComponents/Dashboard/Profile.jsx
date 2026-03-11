import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// सुव्यवस्थित आइकॉन कार्ड
const InfoItem = ({ icon, label, value }) => (
  <div className="d-flex align-items-center p-3 mb-2 bg-white rounded-4 border-0 shadow-sm border-start border-primary border-4">
    <div className="icon-box bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '45px', height: '45px' }}>
      <i className={`bi ${icon} text-primary fs-5`}></i>
    </div>
    <div className="overflow-hidden">
      <p className="text-muted mb-0 small text-uppercase fw-bold ls-1" style={{ fontSize: '0.65rem' }}>{label}</p>
      <p className="mb-0 fw-semibold text-dark text-truncate">{value || "N/A"}</p>
    </div>
  </div>
);

// आकर्षक स्टैट्स कार्ड
const QuickStat = ({ label, value, icon, gradient }) => (
  <div className="col-4">
    <div className={`p-3 rounded-4 text-center shadow-sm h-100 border-0`} style={{ background: '#f8f9fa' }}>
      <div className={`mx-auto mb-2 rounded-circle d-flex align-items-center justify-content-center`}
        style={{ width: '40px', height: '40px', background: gradient, color: 'white' }}>
        <i className={`bi ${icon} fs-5`}></i>
      </div>
      <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>{value || "0"}</h6>
      <small className="text-muted" style={{ fontSize: '0.7rem' }}>{label}</small>
    </div>
  </div>
);

export default function Profile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.email) return;
      try {
        const q = query(
          collection(db, "admissions"),
          where("email", "==", user.email.trim().toLowerCase())
        );
        const snap = await getDocs(q);
        if (!snap.empty) setStudent(snap.docs[0].data());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  if (!student) return <div className="container mt-5 alert alert-danger text-center rounded-4">डाटा उपलब्ध नहीं है।</div>;

  return (
    <div className="pb-5 mb-4 mb-lg-0" style={{ background: '#f4f7f6', minHeight: '100vh' }}>
      {/* Header Profile Section */}
      <div className="position-relative mb-5" style={{ height: '220px', background: 'linear-gradient(135deg, #013788 0%, #0a58ca 100%)', borderRadius: '0 0 40px 40px' }}>
        <div className="container pt-4 text-white text-center">
          <h4 className="fw-light mb-0 fw-bolder">Student Profile</h4>
        </div>

        {/* Floating Profile Card */}
        <div className="position-absolute start-50 translate-middle-x" style={{ top: '50%' }}>
          <div className="bg-white p-2 rounded-circle shadow-lg">
            <img
              src={student.photoUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
              alt="Profile"
              className="rounded-circle shadow-sm"
              style={{ width: 130, height: 130, objectFit: "cover", border: '4px solid white' }}
            />
          </div>
        </div>
      </div>

      <div className="container mt-5 pt-4 text-center">
        <h3 className="fw-bold text-dark mt-2">{student.name}</h3>
        <p className="text-muted mb-3"><i className="bi bi-envelope me-2"></i>{student.email}</p>

        <div className="d-flex justify-content-center gap-2 mb-4">
          <span className="badge rounded-pill px-3 py-2 bg-primary-subtle text-primary border border-primary-subtle uppercase small">{student.course}</span>
          <span className="badge rounded-pill px-3 py-2 bg-dark text-white uppercase small">{student.regNo}</span>
        </div>

        {/* Quick Stats Grid */}
        <div className="row g-3 mb-4 px-2">
          <QuickStat label="Percentage" value={`${student.percentage}%`} icon="bi-lightning-charge" gradient="linear-gradient(45deg, #28a745, #85e09b)" />
          <QuickStat label="Joined" value={student.admissionDate} icon="bi-calendar-check" gradient="linear-gradient(45deg, #0d6efd, #6ea8fe)" />
          <QuickStat label="Status" value="Active" icon="bi-shield-check" gradient="linear-gradient(45deg, #ffc107, #ffe082)" />
        </div>

        {/* Detailed Info Sections */}
        <div className="text-start px-2 mt-4">
          <h6 className="fw-bold text-secondary mb-3 ps-1">Personal Details</h6>
          <div className="row g-2">
            <div className="col-md-6"><InfoItem icon="bi-person-badge" label="Father's Name" value={student.fatherName} /></div>
            <div className="col-md-6"><InfoItem icon="bi-person-hearts" label="Mother's Name" value={student.motherName} /></div>
            <div className="col-md-6"><InfoItem icon="bi-cake2" label="Birth Date" value={student.dob} /></div>
            <div className="col-md-6"><InfoItem icon="bi-phone" label="Contact" value={student.mobile} /></div>
            <div className="col-12"><InfoItem icon="bi-fingerprint" label="Aadhar Card" value={student.aadharNo} /></div>
          </div>

          <h6 className="fw-bold text-secondary mb-3 ps-1 mt-4">Address & Location</h6>
          <div className="bg-white p-3 rounded-4 shadow-sm mb-3">
            <div className="d-flex">
              <i className="bi bi-geo-alt-fill text-danger fs-4 me-3"></i>
              <div>
                <p className="mb-1 fw-bold">{student.address}</p>
                <p className="text-muted mb-0 small">{student.village}, {student.city}, {student.state} - {student.pincode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}