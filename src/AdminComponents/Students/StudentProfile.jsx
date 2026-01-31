// src/AdminComponents/Students/StudentProfile.jsx
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spinner, Button } from "react-bootstrap";
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

        // ✅ SAFE ID MATCH
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
                    <img
                      src={s.photoUrl || "/avatar.png"}
                      alt="Student"
                      className="rounded-circle mb-2"
                      width="90"
                      height="90"
                      style={{ objectFit: "cover" }}
                    />

                    <h6 className="fw-bold mb-0">{s.name}</h6>
                    <small className="text-muted d-block mb-2">
                      Course: {s.course}
                    </small>

                    {/* CERTIFICATE BUTTON */}
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() =>
                        navigate(`/admin/students/${id}/certificate`)
                      }
                    >
                      🎓 View Certificate
                    </Button>
                  </Card.Body>
                </Card>

                {/* DETAILS */}
                <Card className="border-0 shadow-sm rounded-4">
                  <Card.Body className="p-0">
                    <Info label="Reg No" value={s.regNo} />
                    <Info label="Father" value={s.fatherName} />
                    <Info label="Mother" value={s.motherName} />
                    <Info label="Email" value={s.email} />
                    <Info label="Mobile No" value={s.mobile} />
                    <Info label="Issue Date" value={s.issueDate} />
                    <Info label="Time Span" value={s.timeSpan} />
                    <Info label="Duration" value={s.duration} />
                    <Info
                      label="Admission Time"
                      value={
                        s.createdAt &&
                        new Date(
                          s.createdAt.seconds * 1000
                        ).toLocaleString()
                      }
                    />
                    <Info label="Phone" value={s.phone} />
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

/* INFO ROW */
const Info = ({ label, value, last }) =>
  value ? (
    <div
      className={`d-flex justify-content-between align-items-center px-3 py-2 ${
        !last ? "border-bottom" : ""
      }`}
    >
      <small className="text-muted">{label}</small>
      <span className="fw-medium text-end">{value}</span>
    </div>
  ) : null;
