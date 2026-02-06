// src\AdminComponents\Students\StudentProfile.jsx
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spinner, Button, Badge } from "react-bootstrap";
import AdmissionProvider from "../Admissions/AdmissionProvider";

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <AdmissionProvider>
      {({ admissions, loading }) => {
        if (loading) {
          return (
            <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
              <Spinner animation="border" />
            </div>
          );
        }

        const s = admissions.find(a => String(a.id) === String(id));

        if (!s) {
          return (
            <div className="vh-100 d-flex flex-column justify-content-center align-items-center">
              <h6 className="text-danger">Student not found</h6>
              <Button size="sm" onClick={() => navigate("/admin/students")}>
                Back to Students
              </Button>
            </div>
          );
        }

        const status = s.status || "pending";
        const isAccepted = status === "accepted";
        const hasRegNo = !!s.regNo;
        const hasPercentage = !!s.percentage;
        const certificateEligible = isAccepted && hasRegNo && hasPercentage;

        return (
          <div className="container-fluid bg-light min-vh-100 p-3">
            <div className="row justify-content-center">
              <div className="col-12 col-md-6 col-lg-5">

                {/* BACK BUTTON */}
                <div className="mb-3">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate("/admin/students")}
                  >
                    ← Back
                  </Button>
                </div>

                {/* PROFILE HEADER */}
                <Card className="border-0 shadow-sm rounded-4 text-center mb-3">
                  <Card.Body>
                    {/* Status Badge */}
                    <div className="mb-2">
                      <Badge 
                        bg={
                          status === "accepted" ? "success" : 
                          status === "canceled" ? "danger" : 
                          "warning"
                        }
                        className="text-uppercase mb-2"
                      >
                        {status}
                      </Badge>
                    </div>

                    <img
                      src={s.photoUrl || "/avatar.png"}
                      alt="Student"
                      className="rounded-circle mb-2"
                      width="90"
                      height="90"
                      style={{ objectFit: "cover" }}
                    />
                    <h6 className="fw-bold mb-0">{s.name}</h6>
                    <small className="text-muted d-block mb-2">Course: {s.course}</small>

                    {/* Certificate Eligibility Info */}
                    <div className="mb-3">
                      {!certificateEligible && (
                        <div className="small text-muted">
                          <p className="mb-1"><strong>Certificate Requirements:</strong></p>
                          {!isAccepted && (
                            <Badge bg="warning" className="me-1 mb-1">❌ Admission Not Accepted</Badge>
                          )}
                          {isAccepted && !hasRegNo && (
                            <Badge bg="warning" className="me-1 mb-1">❌ Registration Number Missing</Badge>
                          )}
                          {isAccepted && hasRegNo && !hasPercentage && (
                            <Badge bg="warning" className="me-1 mb-1">❌ Percentage Missing</Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* CERTIFICATE BUTTON - Only show if eligible */}
                    {certificateEligible ? (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => navigate(`/admin/students/${id}/certificate`)}
                        className="w-100"
                      >
                        🎓 View Certificate
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        disabled
                        className="w-100"
                      >
                        ⏳ Certificate Pending
                      </Button>
                    )}
                  </Card.Body>
                </Card>

                {/* DETAILS */}
                <Card className="border-0 shadow-sm rounded-4">
                  <Card.Body className="p-0">
                    <Info label="Status" value={status} />
                    <Info label="Reg No" value={hasRegNo ? s.regNo : "Not assigned"} />
                    <Info label="Percentage" value={hasPercentage ? `${s.percentage}%` : "Not assigned"} />
                    <Info label="Father" value={s.fatherName} />
                    <Info label="Mother" value={s.motherName} />
                    <Info label="Email" value={s.email} />
                    <Info label="Mobile No" value={s.mobile} />
                    <Info label="Date of Birth" value={s.dob} />
                    <Info label="Address" value={s.address} last />
                  </Card.Body>
                </Card>

              </div>
            </div>
          </div>
        );
      }}
    </AdmissionProvider>
  );
}

const Info = ({ label, value, last }) =>
  value ? (
    <div className={`d-flex justify-content-between align-items-center px-3 py-2 ${!last ? "border-bottom" : ""}`}>
      <small className="text-muted">{label}</small>
      <span className="fw-medium text-end">{value}</span>
    </div>
  ) : null;