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
    
    // Feature: Extract existing regNo for editing
    if (student.regNo) {
      const parts = student.regNo.split("/");
      setRegNumber(parts[parts.length - 1]);
    } else {
      setRegNumber("");
    }
    setIsDuplicate(false);
    setEditingRegNo(false);
  }, [student]);

  const status = student.status || "pending";
  const isAccepted = status === "accepted";
  const isDone = status === "done";
  const studentBranch = student.branch || student.centerCode;
  const studentCourse = student.course;

  useEffect(() => {
    setIsValidDigit(/^\d+$/.test(regNumber.trim()));
  }, [regNumber]);

  // Feature: Duplicate Check logic across the same branch
  const checkDuplicateRegNo = async (branch, regNum) => {
    if (!branch || !regNum) return false;
    const q = query(collection(db, "admissions"), where("regNo", "!=", null));
    const snapshot = await getDocs(q);

    let duplicate = false;
    snapshot.docs.forEach(doc => {
      if (doc.id === student.id) return; // Ignore current student
      const data = doc.data();
      const existingRegNo = data.regNo;
      const existingBranch = data.branch || data.centerCode;

      if (existingRegNo && existingBranch === branch) {
        // Match only the numeric part at the end
        if (existingRegNo.endsWith(`/${regNum}`)) duplicate = true;
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
      const duplicate = await checkDuplicateRegNo(studentBranch, regNumber.trim());
      setIsDuplicate(duplicate);
      setCheckingDuplicate(false);
    };

    const timer = setTimeout(check, 600);
    return () => clearTimeout(timer);
  }, [regNumber, studentBranch, isValidDigit]);

  const handleGenerateRegNo = async () => {
    if (!isAdmin) return toast.error("Admin only");
    if (!isValidDigit) return toast.error("Digits only");
    if (isDuplicate) return toast.error("Reg No already in use");

    setLoading(true);
    try {
      const courseCode = studentCourse.replace(/\s+/g, "").toUpperCase();
      const finalRegNo = `${studentBranch}/${courseCode}/${regNumber.trim()}`;

      await onSave(student.id, {
        regNo: finalRegNo,
        branch: studentBranch,
        centerCode: studentBranch
      });

      toast.success("Registration Saved");
      setEditingRegNo(false);
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async newStatus => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      await onSave(student.id, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error("Error updating status");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDone = async () => {
    if (!isAdmin) return;
    if (!student.regNo) return toast.warning("Assign Reg No first");
    setLoading(true);
    try {
      await onSave(student.id, {
        status: "done",
        percentage: Number(percent),
        admissionDate,
        issueDate: issDate
      });
      toast.success("Admission Completed!");
    } catch {
      toast.error("Error marking as done");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="card border-0 bg-white shadow-sm overflow-hidden" style={{ borderRadius: "20px" }}>
        <div style={{ height: "6px", background: `linear-gradient(90deg, ${STATUS_COLORS[status]}, #6366f1)` }} />

        <div className="card-body p-3">
          {/* 1. Header with Photo and Status */}
          <div className="d-flex align-items-center gap-3 mb-3">
            <img
              src={student.photoUrl || `https://ui-avatars.com/api/?name=${student.name}&background=random`}
              alt=""
              style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "18px" }}
            />
            <div className="flex-grow-1">
              <h6 className="fw-bold mb-0 text-truncate" style={{ maxWidth: "150px" }}>{student.name}</h6>
              <small className="text-muted d-block">{student.course}</small>
            </div>
            <span style={{ background: STATUS_COLORS[status], color: "#fff", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }}>
              {status.toUpperCase()}
            </span>
          </div>

          {/* 2. Branch and NEW Feature: Reg No Display with Edit Button */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            <span className="badge bg-light text-primary border rounded-pill px-3 py-2">
              <i className="bi bi-geo-alt me-1"></i>
              {BRANCH_DISPLAY[studentBranch] || studentBranch}
            </span>
            
            {student.regNo && (
              <span className="badge bg-light text-dark border rounded-pill px-3 py-2 d-flex align-items-center">
                <i className="bi bi-card-text me-1"></i>
                <strong className="ms-1">{student.regNo}</strong>
                {isAdmin && !isDone && (
                  <i 
                    className="bi bi-pencil-square ms-2 text-primary" 
                    onClick={() => setEditingRegNo(!editingRegNo)}
                    style={{ cursor: 'pointer', fontSize: '1.1rem' }}
                    title="Edit Registration Number"
                  ></i>
                )}
              </span>
            )}
          </div>

          {/* 3. NEW Feature: Assign/Edit Reg No Section */}
          {( (isAccepted && !student.regNo) || editingRegNo ) && (
            <div className="bg-light p-3 rounded-4 mb-3 border">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="small fw-bold text-secondary">
                  {editingRegNo ? "Edit Registration" : "Assign Registration"}
                </label>
                {editingRegNo && <button className="btn-close" style={{ fontSize: '0.7rem' }} onClick={() => setEditingRegNo(false)}></button>}
              </div>
              
              <div className="input-group mb-1 shadow-sm rounded-3 overflow-hidden">
                <input
                  type="text"
                  className={`form-control border-0 ${isDuplicate ? 'is-invalid' : ''}`}
                  style={{ background: "#fff" }}
                  value={regNumber}
                  placeholder="Enter last digits..."
                  onChange={e => setRegNumber(e.target.value.replace(/[^0-9]/g, ""))}
                />
              </div>

              {/* Real-time Validation UI */}
              {checkingDuplicate && <small className="text-muted d-block mb-2">Checking...</small>}
              {isDuplicate && <small className="text-danger d-block mb-2 fw-bold">⚠️ Already taken in this branch!</small>}
              {!isDuplicate && regNumber && isValidDigit && <small className="text-success d-block mb-2 fw-bold">✅ Available</small>}

              <button
                className="btn w-100 btn-primary btn-sm fw-bold py-2 mt-1"
                style={{ borderRadius: "10px" }}
                onClick={handleGenerateRegNo}
                disabled={loading || !isValidDigit || isDuplicate}
              >
                {loading ? "Saving..." : editingRegNo ? "Update Reg No" : "Generate Reg No"}
              </button>
            </div>
          )}

          {/* 4. Mark Done Section */}
          {isAccepted && !isDone && student.regNo && !editingRegNo && (
            <button
              className="btn w-100 mb-3 fw-bold text-white py-2 shadow-sm"
              style={{ borderRadius: "12px", background: "linear-gradient(135deg,#22c55e,#16a34a)" }}
              onClick={handleMarkDone}
              disabled={loading}
            >
              MARK AS DONE
            </button>
          )}

          {isDone && (
            <div className="text-center bg-info bg-opacity-10 p-2 rounded-3 mb-3 border border-info border-opacity-25">
              <span className="text-info fw-bold small">✨ Admission Process Complete</span>
            </div>
          )}

          {/* 5. Footer Actions (View/Delete) */}
          <div className="d-flex gap-2 pt-2 border-top">
            <Link to={`/admin/students/${student.id}`} className="flex-grow-1">
              <button className="btn btn-light w-100 fw-semibold rounded-3 py-2 border">View Profile</button>
            </Link>
            {isAdmin && (
              <button
                className="btn btn-outline-danger rounded-3"
                onClick={() => onDelete(student.id)}
              >
                <i className="bi bi-trash"></i>
              </button>
            )}
          </div>

          {/* 6. Approval Buttons (Only for Pending) */}
          {status === "pending" && isAdmin && (
            <div className="mt-3 d-flex gap-2">
              <button
                className="btn btn-success flex-grow-1 fw-bold rounded-3 py-2"
                onClick={() => handleStatusChange("accepted")}
                disabled={loading}
              >
                APPROVE
              </button>
              <button
                className="btn btn-outline-danger flex-grow-1 fw-bold rounded-3 py-2"
                onClick={() => handleStatusChange("canceled")}
                disabled={loading}
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