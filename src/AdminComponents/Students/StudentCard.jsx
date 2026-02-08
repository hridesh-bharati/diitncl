import React, { useState, useEffect } from "react";
import { Card, Button, Form, Badge, ProgressBar } from "react-bootstrap";
import { Trash, PersonCircle, Check2Circle, CalendarCheck, CalendarEvent, Award, ArrowRightShort } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const STATUS_COLORS = { accepted: "success", canceled: "danger", pending: "warning" };
const CENTER_CODE = "DIIT124";

const StudentCard = React.memo(({ student, onSave, onDelete }) => {
  if (!student) return null;

  const [val, setVal] = useState(""); // For ID
  const [percent, setPercent] = useState(student.percentage || "");
  const [admDate, setAdmDate] = useState(student.admissionDate || "");
  const [issDate, setIssDate] = useState(student.issueDate || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAdmDate(student.admissionDate || "");
    setIssDate(student.issueDate || "");
    setPercent(student.percentage || "");
  }, [student]);

  const status = student.status || "pending";
  const isAccepted = status === "accepted";

  // Dono fields required validation
  const canSaveFinal = percent !== "" && issDate !== "" && (percent !== student.percentage || issDate !== student.issueDate);

  const handleAction = async (data, type) => {
    setLoading(true);
    try {
      let finalData = { ...data };
      if (type === "status" && data.status === "accepted") {
        const today = new Date().toISOString().split('T')[0];
        finalData.admissionDate = today;
        setAdmDate(today);
      }
      await onSave(student.id, finalData);
      toast.success("Updated Successfully");
    } catch (e) {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm rounded-4 mb-3 overflow-hidden" style={{ background: "#fff" }}>
      <Card.Body className="p-3">
        {/* Android Header Style */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="position-relative">
            {student.photoUrl ? (
              <img src={student.photoUrl} alt="" className="rounded-circle shadow-sm" style={{ width: "60px", height: "60px", objectFit: "cover", border: "2px solid #f8f9fa" }} />
            ) : (
              <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px" }}>
                <PersonCircle size={32} className="text-secondary" />
              </div>
            )}
            <div className={`position-absolute bottom-0 end-0 p-1 bg-${STATUS_COLORS[status]} rounded-circle border border-2 border-white`} style={{ width: "14px", height: "14px" }} />
          </div>

          <div className="flex-grow-1">
            <h6 className="fw-bold mb-0 text-dark" style={{ letterSpacing: "-0.3px" }}>{student.name}</h6>
            <div className="text-muted small mb-1" style={{ fontSize: '12px' }}>{student.course}</div>
            {student.regNo && (
              <Badge bg="primary" className="bg-opacity-10 text-primary fw-medium rounded-pill px-2" style={{ fontSize: '10px' }}>{student.regNo}</Badge>
            )}
          </div>
          
          <div className="text-end">
             {student.percentage && <div className="text-success fw-bolder h5 mb-0">{student.percentage}%</div>}
          </div>
        </div>

        {/* Realistic Android Input Surface */}
        <div className="rounded-4 p-3" style={{ background: "#f9fafb", border: "1px solid #f1f3f5" }}>
          
          {/* Admission Date (Compact) */}
          {isAccepted && (
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="small text-secondary fw-medium">Admission Date</div>
              <Form.Control 
                type="date" size="sm" value={admDate} 
                onChange={(e) => setAdmDate(e.target.value)}
                className="border-0 bg-white shadow-sm rounded-pill px-3"
                style={{ width: "auto", fontSize: "12px" }}
              />
            </div>
          )}

          {!student.regNo && isAccepted ? (
            <div className="bg-white p-2 rounded-3 shadow-sm d-flex gap-2 align-items-center">
              <Form.Control size="sm" placeholder="Enter ID (Ex: 99)" value={val} onChange={e => setVal(e.target.value)} className="border-0 shadow-none" />
              <Button size="sm" variant="dark" className="rounded-circle p-1" onClick={() => handleAction({ regNo: `${CENTER_CODE}/${student.course.replace(/\s+/g, "").toUpperCase()}/${val.trim()}` }, "reg")}>
                <ArrowRightShort size={20}/>
              </Button>
            </div>
          ) : isAccepted ? (
            <div className="d-flex flex-column gap-3">
              
              {/* Material Style Inputs */}
              <div className="row g-2">
                <div className="col-5">
                   <div className="small text-secondary mb-1 fw-medium">Percentage</div>
                   <Form.Control 
                    type="number" size="sm" placeholder="%" 
                    value={percent} onChange={e => setPercent(e.target.value)}
                    className="border-0 shadow-sm rounded-3 py-2 text-center fw-bold"
                  />
                </div>
                <div className="col-7">
                   <div className="small text-secondary mb-1 fw-medium">Issue Date</div>
                   <Form.Control 
                    type="date" size="sm" 
                    value={issDate} onChange={(e) => setIssDate(e.target.value)}
                    className="border-0 shadow-sm rounded-3 py-2"
                  />
                </div>
              </div>

              {/* SAVE BUTTON (Only when both filled) */}
              {canSaveFinal && (
                <Button 
                    variant="success" 
                    size="sm" 
                    className="w-100 rounded-pill fw-bold shadow-sm py-2 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => handleAction({ percentage: Number(percent), issueDate: issDate }, "final_save")}
                    disabled={loading}
                >
                  {loading ? 'Saving...' : <><Check2Circle size={16}/> SAVE MARKS & DATE</>}
                </Button>
              )}
            </div>
          ) : (
             <div className="text-center py-2 text-muted small italic">Awaiting enrollment confirmation</div>
          )}
        </div>

        {/* Android Style Bottom Navigation */}
        <div className="d-flex gap-2 mt-3 pt-2">
          <Link to={`/admin/students/${student.id}`} className="flex-fill">
            <Button variant="outline-light" size="sm" className="w-100 rounded-pill text-dark border fw-medium py-2" style={{ fontSize: "13px" }}>Profile</Button>
          </Link>
          <Button variant="outline-danger" size="sm" className="rounded-pill border-0" onClick={() => onDelete(student.id)}><Trash size={18} /></Button>
        </div>

        {/* Approval Footer (Overlay Style) */}
        {status === "pending" && (
          <div className="d-flex gap-2 mt-3 pt-3 border-top">
            <Button variant="success" className="flex-grow-1 rounded-pill py-2 border-0 fw-bold shadow-sm" onClick={() => handleAction({ status: "accepted" }, "status")}>APPROVE</Button>
            <Button variant="danger" className="flex-grow-1 rounded-pill py-2 border-0 fw-medium shadow-sm" onClick={() => handleAction({ status: "canceled" }, "status")}>REJECT</Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
});

export default StudentCard;