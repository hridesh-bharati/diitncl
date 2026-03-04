// src/AdminComponents/Admissions/StudentCard.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const STATUS_COLORS = {
  accepted: "#10b981",
  canceled: "#ef4444",
  pending: "#f59e0b",
  done: "#3b82f6"
};

const BRANCH_DISPLAY = {
  DIIT124: "Main Branch",
  DIIT125: "East Branch"
};

const StudentCard = React.memo(({ student, onSave, onDelete }) => {
  const { isAdmin } = useAuth();

  const [regNumber, setRegNumber] = useState("");
  const [percent, setPercent] = useState("");
  const [issDate, setIssDate] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isValidDigit, setIsValidDigit] = useState(false);
  const [editingRegNo, setEditingRegNo] = useState(false);

  useEffect(() => {
    setPercent(student.percentage ?? "");
    setIssDate(student.issueDate || "");
    setAdmissionDate(student.admissionDate || "");
    setRegNumber("");
    setIsDuplicate(false);
    setEditingRegNo(false);
  }, [student]);

  const status = student.status || "pending";
  const isAccepted = status === "accepted";
  const isDone = status === "done";

  const regNo = student.regNo;
  const studentBranch = student.branch || student.centerCode;
  const studentCourse = student.course;

  useEffect(() => {
    if (regNumber.trim()) {
      setIsValidDigit(/^\d+$/.test(regNumber.trim()));
    } else {
      setIsValidDigit(false);
    }
  }, [regNumber]);

  const checkDuplicateRegNo = async (branch, regNum) => {
    if (!branch || !regNum) return false;
    const q = query(collection(db, "admissions"), where("regNo", "!=", null));
    const snapshot = await getDocs(q);

    let duplicate = false;
    snapshot.docs.forEach(doc => {
      if (doc.id === student.id) return;
      const data = doc.data();
      const existingRegNo = data.regNo;
      const existingBranch = data.branch || data.centerCode;

      if (existingRegNo && existingBranch === branch) {
        const pattern = new RegExp(`${branch}/[^/]+/${regNum}$`);
        if (pattern.test(existingRegNo)) duplicate = true;
      }
    });

    return duplicate;
  };

  useEffect(() => {
    const check = async () => {
      if (!studentBranch || !regNumber.trim() || !isValidDigit) {
        setIsDuplicate(false);
        return;
      }
      setCheckingDuplicate(true);
      const duplicate = await checkDuplicateRegNo(
        studentBranch,
        regNumber.trim()
      );
      setIsDuplicate(duplicate);
      setCheckingDuplicate(false);
    };

    const timer = setTimeout(check, 500);
    return () => clearTimeout(timer);
  }, [regNumber, studentBranch, isValidDigit]);

  const handleGenerateRegNo = async () => {
    if (!isAdmin) return toast.error("Admin only");

    if (!isValidDigit) return toast.error("Digits only");

    setLoading(true);

    try {
      const courseCode = studentCourse.replace(/\s+/g, "").toUpperCase();
      const duplicate = await checkDuplicateRegNo(
        studentBranch,
        regNumber.trim()
      );

      if (duplicate) {
        toast.error("Reg No already exists");
        setLoading(false);
        return;
      }

      const finalRegNo = `${studentBranch}/${courseCode}/${regNumber.trim()}`;

      await onSave(student.id, {
        regNo: finalRegNo,
        branch: studentBranch,
        centerCode: studentBranch
      });

      toast.success("Registration Updated");
      setEditingRegNo(false);
    } catch {
      toast.error("Error updating");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async newStatus => {
    if (!isAdmin) return;

    setLoading(true);
    try {
      await onSave(student.id, { status: newStatus });
      toast.success(`Status: ${newStatus}`);
    } catch {
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDone = async () => {
    if (!isAdmin) return;

    if (!student.regNo) return toast.warning("Generate Reg No first");

    setLoading(true);
    try {
      await onSave(student.id, {
        status: "done",
        percentage: Number(percent),
        admissionDate,
        issueDate: issDate
      });
      toast.success("Marked as Done");
    } catch {
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="mb-4"
    >
      <div
        className="card border-0 bg-white overflow-hidden"
        style={{
          borderRadius: "20px"}}
      >
        {/* Top Gradient Status Bar */}
        <div
          style={{
            height: "6px",
            background: `linear-gradient(90deg, ${STATUS_COLORS[status]}, #6366f1)`
          }}
        />

        <div className="card-body p-3">

          {/* Header */}
          <div className="d-flex align-items-center gap-3 mb-3">
            <img
              src={
                student.photoUrl ||
                `https://ui-avatars.com/api/?name=${student.name}&background=random`
              }
              alt=""
              style={{
                width: "56px",
                height: "56px",
                objectFit: "cover",
                borderRadius: "18px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
              }}
            />

            <div className="flex-grow-1">
              <h6 className="fw-semibold mb-0">{student.name}</h6>
              <small className="text-muted">{student.course}</small>
            </div>

            <span
              style={{
                background: STATUS_COLORS[status],
                color: "#fff",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px"
              }}
            >
              {status.toUpperCase()}
            </span>
          </div>

          {/* Branch */}
          {studentBranch && (
            <div className="mb-3">
              <span
                style={{
                  background: "#eef2ff",
                  color: "#4338ca",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600"
                }}
              >
                {BRANCH_DISPLAY[studentBranch] || studentBranch}
              </span>
            </div>
          )}

          {/* Registration Section */}
          {isAccepted && !isDone && (
            <div className="mb-3">
              <label className="small fw-semibold mb-1">
                Registration Number
              </label>
              <input
                type="text"
                className="form-control border-0"
                style={{
                  background: "#f1f3f4",
                  borderRadius: "14px",
                  padding: "10px 14px"
                }}
                value={regNumber}
                placeholder="Uniquee no..."
                onChange={e =>
                  setRegNumber(e.target.value.replace(/[^0-9]/g, ""))
                }
              />

              <button
                className="btn w-100 mt-2 fw-semibold"
                style={{
                  borderRadius: "16px",
                  background:
                    "linear-gradient(135deg,#3b82f6,#2563eb)",
                  color: "#fff",
                  padding: "10px",
                  boxShadow:
                    "0 4px 12px rgba(59,130,246,0.4)"
                }}
                onClick={handleGenerateRegNo}
                disabled={loading || !isValidDigit}
              >
                Generate Reg No
              </button>
            </div>
          )}

          {/* Done Button */}
          {isAccepted && !isDone && (
            <button
              className="btn w-100 fw-semibold"
              style={{
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg,#22c55e,#16a34a)",
                color: "#fff",
                padding: "10px",
                boxShadow:
                  "0 4px 12px rgba(34,197,94,0.35)"
              }}
              onClick={handleMarkDone}
              disabled={loading}
            >
              MARK AS DONE
            </button>
          )}

          {isDone && (
            <div className="text-center py-3">
              <span
                style={{
                  background: "#dbeafe",
                  color: "#1e40af",
                  padding: "8px 20px",
                  borderRadius: "20px",
                  fontWeight: "600"
                }}
              >
                Admission Completed
              </span>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="mt-3 border-top pt-3 d-flex gap-2">
            <Link
              to={`/admin/students/${student.id}`}
              className="flex-grow-1"
            >
              <button
                className="btn w-100 fw-semibold"
                style={{
                  borderRadius: "14px",
                  background: "#f1f3f4"
                }}
              >
                View Profile
              </button>
            </Link>

            {isAdmin && (
              <button
                className="btn"
                style={{
                  borderRadius: "14px",
                  background: "#fee2e2",
                  color: "#b91c1c"
                }}
                onClick={() => onDelete(student.id)}
              >
                Delete
              </button>
            )}
          </div>

          {status === "pending" && isAdmin && (
            <div className="mt-3 d-flex gap-2">
              <button
                className="btn w-100 fw-semibold"
                style={{
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg,#22c55e,#16a34a)",
                  color: "#fff"
                }}
                onClick={() => handleStatusChange("accepted")}
              >
                APPROVE
              </button>

              <button
                className="btn w-100 fw-semibold"
                style={{
                  borderRadius: "14px",
                  background: "#fee2e2",
                  color: "#b91c1c"
                }}
                onClick={() => handleStatusChange("canceled")}
              >
                REJECT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default StudentCard;