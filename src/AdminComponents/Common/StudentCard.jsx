import { Card, Badge } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";

const STATUS_COLORS = {
  pending: "warning",
  accepted: "success",
  canceled: "danger"
};

export default function StudentCard({ student, children, isCanceled = false }) {
  const status = student.status || "pending";

  return (
    <Card className={`border-0 shadow-sm rounded-4 h-100 ${isCanceled ? "opacity-50" : ""}`}>
      <Card.Body className={isCanceled ? "pointer-events-none" : ""}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Badge bg={STATUS_COLORS[status] || "secondary"} className="text-uppercase">
            {status}
          </Badge>
          {student.regNo && (
            <small className="text-muted text-truncate ms-2">
              {student.regNo}
            </small>
          )}
        </div>

        <div className="d-flex gap-2 align-items-center mb-3">
          {student.photoUrl ? (
            <img
              src={student.photoUrl}
              alt={student.name}
              className="rounded-circle"
              style={{ width: 45, height: 45, objectFit: "cover" }}
            />
          ) : (
            <PersonCircle size={45} className="text-muted" />
          )}
          <div className="overflow-hidden">
            <strong className="d-block text-truncate">{student.name}</strong>
            <small className="text-muted d-block text-truncate">
              {student.course}
            </small>
          </div>
        </div>

        {children}
      </Card.Body>
    </Card>
  );
}