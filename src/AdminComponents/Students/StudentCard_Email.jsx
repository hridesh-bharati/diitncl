import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import emailjs from "@emailjs/browser"; // 1. EmailJS Import kiya

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

  // States
  const [regNumber, setRegNumber] = useState("");
  const [percent, setPercent] = useState("");
  const [issDate, setIssDate] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [editingRegNo, setEditingRegNo] = useState(false);
  const [showRegInput, setShowRegInput] = useState(false);
  const [isEditingFinal, setIsEditingFinal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  // --- EMAILJS CREDENTIALS ---
  const SERVICE_ID = "service_a1jmn6q"; 
  const TEMPLATE_ID = "YOUR_NEW_ADMISSION_TEMPLATE_ID"; // <-- Naya Template ID yahan dalein
  const PUBLIC_KEY = "8VANIXFp8ZzrP5SsZ";

  // --- STRICT STATUS LOGIC ---
  const status = useMemo(() => {
    if (student.status === "canceled") return "canceled";
    if (student.regNo && student.issueDate) return "done";
    if (student.regNo) return "accepted";
    return "pending";
  }, [student.status, student.regNo, student.issueDate]);

  const isPending = status === "pending";
  const isAccepted = status === "accepted";
  const isDone = status === "done";
  const isCanceled = status === "canceled";

  const studentBranch = student.branch || student.centerCode;
  const studentCourse = student.course || "General";
  const isValidDigit = /^\d{1,8}$/.test(regNumber.trim());

  const avatarUrl = useMemo(() => {
    if (student.photoUrl) return student.photoUrl;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || "Student")}&background=random&length=2`;
  }, [student.photoUrl, student.name]);

  useEffect(() => {
    setPercent(student.percentage ?? "");
    setIssDate(student.issueDate || "");
    setAdmissionDate(student.admissionDate || "");
    setRegNumber(student.regNo ? student.regNo.split("/").pop() : "");
    setEditingRegNo(false);
    setShowRegInput(false);
    setIsEditingFinal(false);
    setIsDuplicate(false);
    setShowDeleteConfirm(false);
    setShowRejectConfirm(false);
  }, [student]);

  const checkDuplicateRegNo = useCallback(async (branch, regNum) => {
    if (!branch || !regNum) return false;
    try {
      const num = Number(regNum);
      const q = query(
        collection(db, "admissions"),
        where("regShort", "==", num),
        where("branch", "==", branch)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.some(doc => doc.id !== student.id);
    } catch (error) {
      console.error("Duplicate check failed:", error);
      return false;
    }
  }, [student.id]);

  useEffect(() => {
    const check = async () => {
      if (!studentBranch || !regNumber.trim() || !isValidDigit) {
        setIsDuplicate(false);
        return;
      }
      const duplicate = await checkDuplicateRegNo(studentBranch, regNumber.trim());
      setIsDuplicate(duplicate);
    };
    const timer = setTimeout(check, 300);
    return () => clearTimeout(timer);
  }, [regNumber, studentBranch, isValidDigit, checkDuplicateRegNo]);

  const handleApproveClick = useCallback(() => setShowRegInput(true), []);

  const handleStatusChange = useCallback(async (newStatus) => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      await onSave(student.id, { status: newStatus });
      toast.success(`Application ${newStatus}`);
      setShowRejectConfirm(false);
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, onSave, student.id]);

  // 2. Updated Handle Generate Reg No (With Email Trigger)
  const handleGenerateRegNo = useCallback(async () => {
    if (!isAdmin || !isValidDigit || isDuplicate) return;
    setLoading(true);
    try {
      const cleanRegNum = regNumber.trim();
      const courseCode = (studentCourse || "CRS").toString().replace(/\s+/g, "").toUpperCase().slice(0, 10);
      const newRegNo = `${studentBranch}/${courseCode}/${cleanRegNum}`;

      // A. Firebase Update
      await onSave(student.id, {
        branch: studentBranch,
        regNo: newRegNo,
        regShort: Number(cleanRegNum),
        status: "accepted"
      });

      // B. Send Email to Student (Agar email provide kiya hai)
      if (student.email) {
        const emailParams = {
          student_name: student.name,
          student_email: student.email, // Student ki email ID
          reg_no: newRegNo,
          course_name: studentCourse,
          branch_name: BRANCH_DISPLAY[studentBranch] || studentBranch
        };

        await emailjs.send(SERVICE_ID, TEMPLATE_ID, emailParams, PUBLIC_KEY);
        toast.success("Reg No Assigned & Email Sent!");
      } else {
        toast.success("Registration Number Assigned!");
      }

      setEditingRegNo(false);
      setShowRegInput(false);
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error("Failed to process approval");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, isValidDigit, isDuplicate, regNumber, studentCourse, studentBranch, onSave, student, SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY]);

  const handleMarkDone = useCallback(async () => {
    if (!isAdmin || !student.regNo || !percent || !admissionDate || !issDate) return;
    if (Number(percent) < 0 || Number(percent) > 100) {
      toast.error("Please enter a valid percentage (0-100)");
      return;
    }
    setLoading(true);
    try {
      await onSave(student.id, {
        status: "done",
        percentage: Number(percent),
        admissionDate,
        issueDate: issDate
      });
      toast.success(isEditingFinal ? "Details Updated!" : "Admission Finalized!");
      setIsEditingFinal(false);
    } catch {
      toast.error("Action failed");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, student.regNo, percent, admissionDate, issDate, onSave, student.id, isEditingFinal]);

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      await onDelete(student.id);
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  }, [onDelete, student.id]);

  return (
    <div className="mb-4">
      <div className="card border-0 bg-white shadow-sm overflow-hidden" style={{ borderRadius: "20px" }}>
        <div style={{ height: "6px", background: `linear-gradient(90deg, ${STATUS_COLORS[status]}, #6366f1)` }} />

        <div className="card-body p-3">
          <div className="d-flex align-items-center gap-3 mb-3">
            <Link to={`/admin/students/${student.id}`} style={{ textDecoration: 'none' }}>
              <img src={avatarUrl} alt="" style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "18px", cursor: 'pointer' }} />
            </Link>
            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <Link to={`/admin/students/${student.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h6 className="fw-bold mb-0 text-truncate" style={{ cursor: 'pointer' }}>{student.name}</h6>
              </Link>
              <small className="text-muted d-block text-truncate">{studentCourse}</small>
            </div>
            <span style={{ background: STATUS_COLORS[status], color: "#fff", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }}>
              {status.toUpperCase()}
            </span>
          </div>

          <div className="d-flex gap-1 p-0 m-0 mb-3">
            <span className="badge bg-light text-primary border rounded-pill px-3 py-2">
              <i className="bi bi-geo-alt me-1"></i>
              {BRANCH_DISPLAY[studentBranch] || studentBranch}
            </span>
            {student.regNo && (
              <span className="badge bg-light text-dark border rounded-pill px-3 py-2 d-flex align-items-center">
                <strong className="ms-1">{student.regNo}</strong>
                {isAdmin && !isDone && !isCanceled && (
                  <i className="bi bi-pencil-square ms-2 text-primary" onClick={() => setEditingRegNo(true)} style={{ cursor: 'pointer' }}></i>
                )}
              </span>
            )}
          </div>

          {isPending && isAdmin && !showRegInput && (
            <div className="mt-2 d-flex gap-2 border-top pt-3">
              <button className="btn btn-success flex-grow-1 fw-bold" onClick={handleApproveClick} disabled={loading}>APPROVE</button>
              {!showRejectConfirm ? (
                <button className="btn btn-outline-danger flex-grow-1" onClick={() => setShowRejectConfirm(true)} disabled={loading}>REJECT</button>
              ) : (
                <div className="flex-grow-1 d-flex gap-1 animate__animated animate__fadeIn">
                  <button className="btn btn-danger flex-grow-1 btn-sm fw-bold" onClick={() => handleStatusChange("canceled")} disabled={loading}>CONFIRM REJECT?</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setShowRejectConfirm(false)} disabled={loading}>✕</button>
                </div>
              )}
            </div>
          )}

          {((isPending && showRegInput) || (isAccepted && (!student.regNo || editingRegNo))) && (
            <div className="bg-light p-3 rounded-4 mb-3 border border-success">
              <div className="d-flex justify-content-between mb-2">
                <label className="small fw-bold text-success">Assign Reg No</label>
                {(editingRegNo || showRegInput) && <button className="btn-close" onClick={() => { setEditingRegNo(false); setShowRegInput(false); }}></button>}
              </div>
              <input type="text" className={`form-control mb-2 ${isDuplicate ? 'is-invalid' : ''}`} value={regNumber} placeholder="1-8 digits" onChange={e => setRegNumber(e.target.value.replace(/[^0-9]/g, "").slice(0, 8))} />
              {isDuplicate && <small className="text-danger d-block mb-2">Taken!</small>}
              <button className="btn btn-success w-100 small fw-bold" onClick={handleGenerateRegNo} disabled={loading || !isValidDigit || isDuplicate}>
                {isPending ? "CONFIRM" : "UPDATE"}
              </button>
            </div>
          )}

          {((isAccepted && student.regNo && !editingRegNo && !showRegInput) || (isDone && isEditingFinal)) && (
            <div className="bg-light p-3 rounded-4 mb-3 border border-primary border-opacity-25 animate__animated animate__fadeIn">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0 text-primary small">{isEditingFinal ? "Edit Details" : "Finalize"}</h6>
                <div className="d-flex gap-2">
                  <button className="btn btn-success btn-sm rounded-4 fw-bold px-3" onClick={handleMarkDone} disabled={loading || !percent || !admissionDate || !issDate}>
                    {isEditingFinal ? "Update" : "Done"}
                  </button>
                  {isEditingFinal && <button className="btn-close" onClick={() => setIsEditingFinal(false)}></button>}
                </div>
              </div>
              <label className="small text-muted mb-1 d-block">Percentage (%)</label>
              <input type="number" className="form-control form-control-sm mb-2" value={percent} onChange={(e) => setPercent(e.target.value)} />
              <div className="row g-2">
                <div className="col-6">
                  <label className="small text-muted mb-1 d-block">Admission</label>
                  <input type="date" style={{ fontSize: '11px' }} className="form-control form-control-sm" value={admissionDate} onChange={(e) => setAdmissionDate(e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="small text-muted mb-1 d-block">Issue Date</label>
                  <input type="date" style={{ fontSize: '11px' }} className="form-control form-control-sm" value={issDate} onChange={(e) => setIssDate(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {isDone && !isEditingFinal && (
            <div className="bg-primary bg-opacity-10 p-3 rounded-4 mb-3 border border-primary border-opacity-25">
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-primary fw-bold small"><i className="bi bi-patch-check-fill me-2"></i>COMPLETE</div>
                {isAdmin && <i className="bi bi-pencil-square text-primary" style={{ cursor: 'pointer' }} onClick={() => { setPercent(student.percentage || ""); setAdmissionDate(student.admissionDate || ""); setIssDate(student.issueDate || ""); setIsEditingFinal(true); }}></i>}
              </div>
              <small className="text-muted d-block mt-1">Score: {student.percentage}% | {student.issueDate}</small>
            </div>
          )}

          <div className="d-flex justify-content-end pt-2 border-top">
            {isAdmin && (
              <div className="d-flex gap-1">
                {!showDeleteConfirm ? (
                  <button className="btn btn-danger bg-gradient p-0 px-2" onClick={() => setShowDeleteConfirm(true)}><i className="bi bi-trash"></i> Delete Record</button>
                ) : (
                  <div className="d-flex gap-1 animate__animated animate__fadeIn">
                    <button className="btn btn-danger btn-sm rounded-pill px-3" onClick={handleDelete} disabled={loading}>Confirm Delete?</button>
                    <button className="btn btn-light btn-sm rounded-pill" onClick={() => setShowDeleteConfirm(false)}>✕ Cancel</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default StudentCard;