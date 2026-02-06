import { Badge, Button } from "react-bootstrap";
import { PersonCircle, CreditCard2Back } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

export default function StudentCard({ student }) {
  const status = student.status || "pending";

  const statusColor =
    status === "accepted"
      ? "success"
      : status === "canceled"
      ? "danger"
      : "warning";

  return (
    <div className="border rounded shadow-sm bg-white h-100 d-flex flex-column">
      
      {/* Photo */}
      {student.photoUrl ? (
        <img
          src={student.photoUrl}
          alt={student.name}
          style={{ width: "100%", height: 200, objectFit: "cover" }}
        />
      ) : (
        <div
          className="bg-secondary d-flex justify-content-center align-items-center"
          style={{ height: 200 }}
        >
          <PersonCircle size={80} className="text-white opacity-50" />
        </div>
      )}

      {/* Status */}
      <Badge bg={statusColor} className="position-absolute top-0 end-0 m-2">
        {status}
      </Badge>

      {/* Content */}
      <div className="p-3 flex-grow-1">
        
        {/* Name & Course */}
        <b className="d-block text-truncate">{student.name}</b>
        <small className="text-muted d-block text-truncate mb-2">
          {student.course}
        </small>

        {/* 🔥 Percentage TOP with Progress Bar */}
        {student.percentage && (
          <div className="mb-3">
            <div className="progress" style={{ height: 6 }}>
              <div
                className="progress-bar bg-success"
                style={{ width: `${student.percentage}%` }}
              />
            </div>
            <small className="text-success fw-bold">
              {student.percentage}%
            </small>
          </div>
        )}
      </div>

      {/* 🔽 Certificate Button BOTTOM */}
      {student.percentage && (
        <div className="p-2 border-top text-center">
          <Link to={`/admin/students/${student.id}/certificate`}>
            <Button size="sm" variant="dark" className="w-100">
              <CreditCard2Back className="me-1" />
              View Certificate
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
