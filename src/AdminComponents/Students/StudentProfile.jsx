import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, Badge, Spinner, Row, Col } from "react-bootstrap";
import { ArrowLeft, Envelope, Phone, CalendarEvent, GeoAlt, Mortarboard, Award } from "react-bootstrap-icons";
import AdmissionProvider from "../Admissions/AdmissionProvider";

// 1. Separate UI Content to avoid Hook order bugs
const ProfileContent = ({ admissions, loading, error }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Student ko find karna (Optimized)
  const student = React.useMemo(() => 
    admissions.find(a => String(a.id) === String(id)), 
    [admissions, id]
  );

  if (loading) return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  if (error) return <div className="alert alert-danger m-4">{error}</div>;

  if (!student) return (
    <Container className="text-center py-5">
      <h4 className="text-muted">Student Record Not Found</h4>
      <Button variant="primary" className="mt-3" onClick={() => navigate("/admin/students")}>
        Back to List
      </Button>
    </Container>
  );

  const status = student.status || "pending";
  const isAccepted = status === "accepted";
  const certificateEligible = isAccepted && student.regNo && student.percentage;

  return (
    <Container className="py-4 bg-light min-vh-100">
      <div className="mb-4">
        <Button variant="white" className="shadow-sm rounded-pill px-3" onClick={() => navigate(-1)}>
          <ArrowLeft className="me-2" /> Back
        </Button>
      </div>

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            {/* Header / Banner */}
            <div className="bg-dark p-4 text-center position-relative" style={{ minHeight: "150px" }}>
              <div className="position-absolute start-50 translate-middle-x" style={{ bottom: "-50px" }}>
                {student.photoUrl ? (
                  <img src={student.photoUrl} className="rounded-circle border border-4 border-white shadow" 
                       style={{ width: "120px", height: "120px", objectFit: "cover" }} alt="profile" />
                ) : (
                  <div className="rounded-circle border border-4 border-white shadow bg-secondary d-flex align-items-center justify-content-center"
                       style={{ width: "120px", height: "120px" }}>
                    <PersonCircle size={60} className="text-white opacity-50" />
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <Card.Body className="text-center mt-5 pt-4">
              <h3 className="fw-bold mb-0">{student.name}</h3>
              <p className="text-muted mb-2">{student.course}</p>
              <Badge bg={status === "accepted" ? "success" : status === "canceled" ? "danger" : "warning"} 
                     className="text-uppercase px-3 py-2 rounded-pill">
                {status}
              </Badge>

              <hr className="my-4 opacity-25" />

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-3 justify-content-center mb-4">
                {certificateEligible ? (
                  <Button variant="dark" className="rounded-pill px-4" onClick={() => navigate(`/admin/students/${id}/certificate`)}>
                    <Award className="me-2" /> View Certificate
                  </Button>
                ) : (
                  <Button variant="outline-secondary" className="rounded-pill px-4" disabled>
                    Certificate Pending
                  </Button>
                )}
              </div>

              {/* Details Grid */}
              <Row className="text-start g-4 p-2">
                <DetailItem icon={<Mortarboard/>} label="Registration No" value={student.regNo || "Not Assigned"} />
                <DetailItem icon={<Award/>} label="Performance" value={student.percentage ? `${student.percentage}%` : "Not Evaluated"} />
                <DetailItem icon={<Envelope/>} label="Email Address" value={student.email} />
                <DetailItem icon={<Phone/>} label="Contact Number" value={student.mobile} />
                <DetailItem icon={<CalendarEvent/>} label="Date of Birth" value={student.dob} />
                <DetailItem icon={<GeoAlt/>} label="Residential Address" value={student.address} fullWidth />
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Main Export
export default function StudentProfile() {
  return (
    <AdmissionProvider>
      {(data) => <ProfileContent {...data} />}
    </AdmissionProvider>
  );
}

// Helper Component for UI consistency
const DetailItem = ({ icon, label, value, fullWidth }) => (
  <Col md={fullWidth ? 12 : 6}>
    <div className="p-3 border rounded-3 bg-white h-100 shadow-none border-light">
      <div className="d-flex align-items-center mb-1 text-primary">
        {icon} <small className="ms-2 fw-bold text-uppercase text-muted" style={{ fontSize: "10px", letterSpacing: "1px" }}>{label}</small>
      </div>
      <div className="fw-semibold text-dark">{value || "N/A"}</div>
    </div>
  </Col>
);