import React, { useState } from "react";
import { Card, Button, Spinner, Form, Badge, ProgressBar } from "react-bootstrap";
import { Eye, Trash, CreditCard2Back, PersonCircle, Save, CheckCircleFill, XCircleFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const STATUS_COLORS = { accepted: "success", canceled: "danger", pending: "warning" };
const CENTER_CODE = "DIIT124";

const StudentCard = React.memo(({ student, onSave, onDelete }) => {
  const [val, setVal] = useState("");
  const [loading, setLoading] = useState(false);

  const status = student.status || "pending";
  const isAccepted = status === "accepted";

  const handleAction = async (data, type) => {
    // PRODUCTION VALIDATION
    if (type === "reg" && !val.trim()) return toast.warn("Reg No is required!");
    if (type === "percent" && (val === "" || val < 0 || val > 100)) return toast.warn("Invalid Percentage!");

    setLoading(true);
    try {
      await onSave(student.id, data);
      setVal(""); // Reset input on success
    } catch (e) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm rounded-4 mb-3 overflow-hidden mobile-app-card h-100">
      <Card.Body className="p-3">
        {/* Profile Info */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="position-relative">
            {student.photoUrl ? (
              <img src={student.photoUrl} alt="" className="rounded-circle border border-2 border-white shadow-sm" style={{ width: "65px", height: "65px", objectFit: "cover" }} />
            ) : (
              <div className="rounded-circle bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: "65px", height: "65px" }}>
                <PersonCircle size={35} className="text-secondary opacity-50" />
              </div>
            )}
            <Badge bg={STATUS_COLORS[status]} className="position-absolute bottom-0 end-0 border border-2 border-white rounded-circle p-1" />
          </div>

          <div className="flex-grow-1 min-width-0">
            <h6 className="fw-bold mb-0 text-dark text-truncate">{student.name}</h6>
            <div className="text-muted small text-truncate" style={{ fontSize: '11px' }}>{student.course}</div>
            {student.regNo && (
              <Badge bg="light" text="dark" className="mt-1 border fw-normal" style={{ fontSize: '10px' }}>ID: {student.regNo}</Badge>
            )}
          </div>
          <div className="text-end">
             {student.percentage !== undefined && <div className="text-success fw-bold h5 mb-0">{student.percentage}%</div>}
          </div>
        </div>

        {/* Dynamic Input Section */}
        <div className="bg-light rounded-3 p-2 mb-3">
          {!student.regNo && isAccepted ? (
            <div className="d-flex gap-2">
              <Form.Control size="sm" placeholder="Assign ID..." value={val} onChange={e => setVal(e.target.value)} className="border-0 shadow-none bg-white" />
              <Button size="sm" variant="dark" onClick={() => handleAction({ regNo: `${CENTER_CODE}/${student.course.replace(/\s+/g, "_").toUpperCase()}/${val.trim()}` }, "reg")}>
                {loading ? <Spinner size="sm" /> : <Save size={14}/>}
              </Button>
            </div>
          ) : student.regNo && student.percentage === undefined && isAccepted ? (
            <div className="d-flex gap-2">
              <Form.Control size="sm" type="number" placeholder="Percent..." value={val} onChange={e => setVal(e.target.value)} className="border-0 shadow-none bg-white" />
              <Button size="sm" variant="success" onClick={() => handleAction({ percentage: Number(val) }, "percent")}>
                {loading ? <Spinner size="sm" /> : <Save size={14}/>}
              </Button>
            </div>
          ) : student.percentage !== undefined ? (
            <ProgressBar now={student.percentage} variant={student.percentage >= 33 ? "success" : "danger"} style={{ height: "6px" }} className="rounded-pill mx-1" />
          ) : (
            <div className="text-center text-muted small py-1" style={{ fontSize: '10px' }}>{status === 'pending' ? 'Pending Approval' : 'Ready to Register'}</div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="d-flex gap-2">
          <Link to={`/admin/students/${student.id}`} className="flex-fill">
            <Button size="sm" variant="light" className="w-100 rounded-3 fw-semibold text-primary py-2 border-0 shadow-xs">Profile</Button>
          </Link>
          {student.regNo && student.percentage !== undefined && (
            <Link to={`/admin/students/${student.id}/certificate`} className="flex-fill">
              <Button size="sm" variant="light" className="w-100 rounded-3 fw-semibold text-success py-2 border-0 shadow-xs">Cert</Button>
            </Link>
          )}
          <Button size="sm" variant="light" className="text-danger border-0" onClick={() => onDelete(student.id)}><Trash size={16} /></Button>
        </div>

        {/* Approve/Reject Buttons */}
        {status === "pending" && (
          <div className="d-flex gap-2 mt-3 pt-3 border-top">
            <Button variant="success" className="flex-grow-1 rounded-pill py-2 border-0 fw-bold" style={{ fontSize: '11px' }} onClick={() => handleAction({ status: "accepted" }, "status")}>APPROVE</Button>
            <Button variant="danger" className="flex-grow-1 rounded-pill py-2 border-0 fw-bold" style={{ fontSize: '11px' }} onClick={() => handleAction({ status: "canceled" }, "status")}>REJECT</Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
});

export default StudentCard;