import React, { useEffect, useState, useMemo } from "react";
import { auth, db } from "../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Container, Card, Spinner, Row, Col } from "react-bootstrap";
import {
  EnvelopeFill, TelephoneFill, Calendar2EventFill, GeoAltFill,
  MortarboardFill, AwardFill, PersonBadgeFill, CalendarCheckFill,
  CpuFill, CodeSlash, LaptopFill, Check2Circle, PcDisplay
} from "react-bootstrap-icons";

// Sub-Component for Technical Info Tiles
const TechTile = ({ icon: Icon, label, value, color }) => (
  <div className="d-flex align-items-center p-3 mb-3 bg-white rounded-3 shadow-sm border-start border-4" style={{ borderColor: color }}>
    <div className="p-2 rounded-circle me-3" style={{ backgroundColor: `${color}15`, color: color }}>
      <Icon size={24} />
    </div>
    <div>
      <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>{label}</small>
      <span className="fw-bold">{value || "N/A"}</span>
    </div>
  </div>
);

export default function Profile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.email) {
        try {
          const q = query(collection(db, "admissions"), where("email", "==", user.email.toLowerCase()));
          const snap = await getDocs(q);
          if (!snap.empty) {
            setStudent({ id: snap.docs[0].id, ...snap.docs[0].data() });
          }
        } catch (err) { console.error(err); } finally { setLoading(false); }
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><Spinner animation="border" variant="primary" /></div>;

  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: "#f0f2f5" }}>
      {/* Profile Header */}
      <div className="p-5 text-white text-center" style={{ background: "linear-gradient(135deg, #004a77 0%, #0072b1 100%)", borderRadius: "0 0 50px 50px" }}>
        <img
          src={student?.photoUrl || ` `}
          className="rounded-circle border border-4 border-white shadow-lg mb-3"
          style={{ width: 120, height: 120, objectFit: "cover" }}
          alt="Avatar"
        />
        <h3 className="fw-bold mb-1">{student?.name}</h3>
        <p className="mb-0 opacity-75"><PcDisplay className="me-2" />{student?.course} Student</p>
      </div>

      <Container className="mt-n4" style={{ marginTop: "-30px" }}>
        {/* Quick Stats for Computer Students */}
        <Row className="g-3 mb-4">
          <Col md={4}><TechTile icon={CodeSlash} label="Enrolled Course" value={student?.course} color="#6610f2" /></Col>
          <Col md={4}><TechTile icon={CpuFill} label="System Assigned" value="Lab-01 / PC-04" color="#0d6efd" /></Col>
          <Col md={4}><TechTile icon={Check2Circle} label="Attendance" value="85%" color="#198754" /></Col>
        </Row>

        <Row>
          {/* Main Academic Info */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4 mb-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center">
                  <MortarboardFill className="me-2 text-primary" /> Academic Record
                </h5>
                <Row className="g-4">
                  <InfoBox label="Roll Number" value={Number(student?.regNo?.split("/").pop())} />
                  <InfoBox label="Registration No" value={student?.regNo} />
                  <InfoBox label="Admission Date" value={student?.admissionDate} />
                  <InfoBox label="Batch Timing" value={student?.batchTime || "10:00 AM - 12:00 PM"} />
                </Row>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm rounded-4 mb-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center">
                  <PersonBadgeFill className="me-2 text-primary" /> Personal Information
                </h5>
                <Row className="g-4">
                  <InfoBox label="Father's Name" value={student?.fatherName} />
                  <InfoBox label="Mother's Name" value={student?.motherName} />
                  <InfoBox label="Date of Birth" value={student?.dob} />
                  <InfoBox label="Mobile" value={student?.mobile} />
                  <Col md={12}>
                    <label className="text-muted small d-block mb-1">Residential Address</label>
                    <span className="fw-bold"><GeoAltFill className="text-danger me-1" /> {student?.address}</span>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar Info */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-4 mb-4 bg-primary text-white">
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3"><LaptopFill className="me-2" /> Skill Progress</h6>
                <ProgressBar label="Operating System" now={90} />
                <ProgressBar label="Office Suite" now={75} />
                <ProgressBar label="Typing Speed" now={60} />
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm rounded-4 p-3 text-center">
              <div className="small text-muted mb-2">Login Verified via</div>
              <div className="fw-bold text-dark border rounded-pill py-1 bg-light">
                <EnvelopeFill className="me-2 text-primary" />{student?.email}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

// Helper Components
function InfoBox({ label, value }) {
  return (
    <Col md={6}>
      <label className="text-muted small d-block mb-1 text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>{label}</label>
      <span className="fw-bold text-dark">{value || "—"}</span>
    </Col>
  );
}

function ProgressBar({ label, now }) {
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between small mb-1">
        <span>{label}</span>
        <span>{now}%</span>
      </div>
      <div className="progress" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
        <div className="progress-bar bg-white" style={{ width: `${now}%` }}></div>
      </div>
    </div>
  );
}