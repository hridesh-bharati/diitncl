import { useState, useCallback } from "react";
import {
  Card,
  Button,
  Spinner,
  Form,
  Badge,
  ProgressBar
} from "react-bootstrap";
import {
  Eye,
  Trash,
  CheckCircleFill,
  XCircleFill,
  CreditCard2Back,
  PersonCircle,
  Save
} from "react-bootstrap-icons";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Link } from "react-router-dom";
import AdmissionProvider from "../Admissions/AdmissionProvider";
import { toast } from "react-toastify";

/* ================= CONSTANTS ================= */

const CENTER_CODE = "DIIT124";

const STATUS_COLORS = {
  accepted: "success",
  canceled: "danger",
  pending: "warning"
};

/* ================= HELPERS ================= */

const generateRegNo = (course, reg) =>
  `${CENTER_CODE}/${course.replace(/\s+/g, "_").toUpperCase()}/${reg}`;

/* ================= MAIN ================= */

export default function StudentList() {
  const [regInputs, setRegInputs] = useState({});
  const [percentageInputs, setPercentageInputs] = useState({});
  const [loading, setLoading] = useState({});

  const saveData = useCallback(async (id, data) => {
    setLoading(p => ({ ...p, [id]: true }));
    try {
      await updateDoc(doc(db, "admissions", id), data);
      toast.success("Saved");
    } catch (e) {
      toast.error(e.message || "Error");
    } finally {
      setLoading(p => ({ ...p, [id]: false }));
    }
  }, []);

  const deleteStudent = async id => {
    if (!window.confirm("Delete this student?")) return;
    await deleteDoc(doc(db, "admissions", id));
    toast.success("Deleted");
  };

  /* ================= MOBILE / CARD ================= */

  const StudentCard = student => {
    const status = student.status || "pending";
    const accepted = status === "accepted";

    return (
      <Card key={student.id} className="mb-2 shadow-sm border-0">
        <Card.Body className="d-flex gap-3 align-items-start position-relative">

          <Badge
            bg={STATUS_COLORS[status]}
            className="position-absolute"
            style={{ top: 8, right: 8 }}
          >
            {status}
          </Badge>

          {student.photoUrl ? (
            <img
              src={student.photoUrl}
              alt=""
              width={56}
              height={56}
              className="rounded-circle"
            />
          ) : (
            <PersonCircle size={56} className="text-secondary" />
          )}

          <div className="flex-grow-1 overflow-hidden">
            <div className="fw-semibold text-truncate fs-sm">
              {student.name}
            </div>
            <div className="text-muted small text-truncate">
              {student.course}
            </div>

            {student.regNo && (
              <div className="small mt-1">Reg: {student.regNo}</div>
            )}

            {student.percentage !== undefined && (
              <div className="mt-2">
                <div className="small d-flex justify-content-between">
                  <span>{student.percentage}%</span>
                  <span>{student.percentage >= 33 ? "Pass" : "Fail"}</span>
                </div>
                <ProgressBar
                  now={student.percentage}
                  style={{ height: 6 }}
                  variant={
                    student.percentage >= 60
                      ? "success"
                      : student.percentage >= 33
                        ? "warning"
                        : "danger"
                  }
                />
              </div>
            )}

            {/* REG NO INPUT */}
            {accepted && !student.regNo && (
              <div className="d-flex gap-2 mt-2">
                <Form.Control
                  size="sm"
                  className="fs-sm"
                  placeholder="Reg No"
                  onChange={e =>
                    setRegInputs(p => ({
                      ...p,
                      [student.id]: e.target.value
                    }))
                  }
                />
                <Button
                  size="sm"
                  className="btn-sm fs-sm px-2 py-1"
                  disabled={!regInputs[student.id] || loading[student.id]}
                  onClick={() =>
                    saveData(student.id, {
                      regNo: generateRegNo(
                        student.course,
                        regInputs[student.id]
                      )
                    })
                  }
                >
                  {loading[student.id] ? <Spinner size="sm" /> : <Save size={14} />}
                </Button>
              </div>
            )}

            {/* PERCENTAGE INPUT */}
            {accepted && student.regNo && student.percentage === undefined && (
              <div className="mt-2">
                <div className="d-flex gap-2">
                  <Form.Control
                    size="sm"
                    type="number"
                    min={0}
                    max={100}
                    step="0.1"
                    inputMode="decimal"
                    className="fs-sm"
                    placeholder="0 – 100 %"
                    onChange={e =>
                      setPercentageInputs(p => ({
                        ...p,
                        [student.id]: e.target.value
                      }))
                    }
                  />
                  <Button
                    size="sm"
                    className="btn-sm fs-sm px-2 py-1"
                    disabled={loading[student.id]}
                    onClick={() => {
                      const v = Number(percentageInputs[student.id]);
                      if (v < 0 || v > 100) {
                        toast.error("Percentage must be 0–100%");
                        return;
                      }
                      saveData(student.id, { percentage: v });
                    }}
                  >
                    {loading[student.id] ? <Spinner size="sm" /> : <Save size={14} />}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card.Body>

        {/* ACTION BAR */}
        <Card.Footer className="bg-white border-0 pt-0">
          <div className="d-flex gap-2">
            <Link to={`/admin/students/${student.id}`} className="flex-fill">
              <Button
                size="sm"
                variant="outline-primary"
                className="w-100 btn-sm fs-sm px-2 py-1"
              >
                <Eye size={14} /> View
              </Button>
            </Link>

            {student.regNo && student.percentage !== undefined && (
              <Link
                to={`/admin/students/${student.id}/certificate`}
                className="flex-fill"
              >
                <Button
                  size="sm"
                  variant="outline-success"
                  className="w-100 btn-sm fs-sm px-2 py-1"
                >
                  <CreditCard2Back size={14} /> Cert
                </Button>
              </Link>
            )}

            <Button
              size="sm"
              variant="outline-danger"
              className="flex-fill btn-sm fs-sm px-2 py-1"
              onClick={() => deleteStudent(student.id)}
            >
              <Trash size={14} />
            </Button>
          </div>

          {status === "pending" && (
            <div className="d-flex gap-2 mt-2">
              <Button
                size="sm"
                variant="success"
                className="flex-fill btn-sm fs-sm px-2 py-1"
                onClick={() => saveData(student.id, { status: "accepted" })}
              >
                <CheckCircleFill size={14} /> Accept
              </Button>
              <Button
                size="sm"
                variant="danger"
                className="flex-fill btn-sm fs-sm px-2 py-1"
                onClick={() => saveData(student.id, { status: "canceled" })}
              >
                <XCircleFill size={14} /> Reject
              </Button>
            </div>
          )}
        </Card.Footer>
      </Card>
    );
  };

  /* ================= RENDER ================= */

  return (
    <AdmissionProvider>
      {({ admissions, loading }) =>
        loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner />
          </div>
        ) : (
          <div className="container-fluid p-3">
            <div className="d-lg-none">
              {admissions.map(StudentCard)}
            </div>

            <div className="row g-3 d-none d-lg-flex">
              {admissions.map(s => (
                <div className="col-lg-3" key={s.id}>
                  {StudentCard(s)}
                </div>
              ))}
            </div>
            <style>{`
            .fs-sm {
  font-size: 0.8rem;
}

            `}</style>
          </div>
        )
      }
    </AdmissionProvider>
  );
}
