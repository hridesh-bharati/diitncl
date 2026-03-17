import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { collection, query, where, getDocs, doc, onSnapshot } from "firebase/firestore"; 
import { db } from "../../firebase/firebase";
// 🔹 Nodemailer Service Imports
import { sendEmailNotification, admissionTemplate, certificateTemplate, deleteAccountTemplate } from "../../../src/services/emailService"; 

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

const StudentCard = React.memo(({ student: initialStudent, onSave, onDelete }) => {
  const { isAdmin } = useAuth();

  // 🔹 Step 1: Local state jo LIVE data hold karegi (onSnapshot isi ko update karega)
  const [student, setStudent] = useState(initialStudent);

  // States for Input Fields
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

  // 🔥 FEATURE 1: REAL-TIME ON-SNAPSHOT (No Reload Needed)
  // Jaise hi Admin "Approve" ya "Done" karega, ye listener data ko turant fetch kar lega
  useEffect(() => {
    const docRef = doc(db, "admissions", initialStudent.id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        setStudent(data); // Local state update
      }
    });
    return () => unsubscribe();
  }, [initialStudent.id]);

  // --- STRICT STATUS LOGIC (Using live 'student' state) ---
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

  // 🔥 Inputs ko live 'student' data ke saath sync rakhna zaroori hai
  useEffect(() => {
    setPercent(student.percentage ?? "");
    setIssDate(student.issueDate || "");
    setAdmissionDate(student.admissionDate || "");
    setRegNumber(student.regNo ? student.regNo.split("/").pop() : "");
    // Close inputs if status changes externally
    setEditingRegNo(false);
    setShowRegInput(false);
    setIsEditingFinal(false);
  }, [student]);

  const checkDuplicateRegNo = useCallback(async (branch, regNum) => {
    if (!branch || !regNum) return false;
    try {
      const num = Number(regNum);
      const q = query(collection(db, "admissions"), where("regShort", "==", num), where("branch", "==", branch));
      const snapshot = await getDocs(q);
      return snapshot.docs.some(doc => doc.id !== student.id);
    } catch (error) { return false; }
  }, [student.id]);

  useEffect(() => {
    const check = async () => {
      if (!studentBranch || !regNumber.trim() || !isValidDigit) { setIsDuplicate(false); return; }
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

  // 🔥 FEATURE 2: NODEMAILER (Admission Approved)
  const handleGenerateRegNo = useCallback(async () => {
    if (!isAdmin || !isValidDigit || isDuplicate) return;
    setLoading(true);
    try {
      const cleanRegNum = regNumber.trim();
      const courseCode = (studentCourse || "CRS").toString().replace(/\s+/g, "").toUpperCase().slice(0, 10);
      const newRegNo = `${studentBranch}/${courseCode}/${cleanRegNum}`;

      await onSave(student.id, {
        branch: studentBranch,
        regNo: newRegNo,
        regShort: Number(cleanRegNum),
        status: "accepted"
      });

      if (student.email) {
        sendEmailNotification(student.email, "Admission Approved - Drishtee Computer Centre", admissionTemplate(student, newRegNo));
        toast.success("Approved & Email Sent!");
      } else {
        toast.success("Approved Successfully!");
      }
    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, isValidDigit, isDuplicate, regNumber, studentCourse, studentBranch, onSave, student]);

  // 🔥 FEATURE 3: NODEMAILER (Certificate/Done Notification)
  const handleMarkDone = useCallback(async () => {
    if (!isAdmin || !student.regNo || !percent || !admissionDate || !issDate) return;
    setLoading(true);
    try {
      await onSave(student.id, {
        status: "done",
        percentage: Number(percent),
        admissionDate,
        issueDate: issDate
      });

      if (!isDone && student.email) {
        sendEmailNotification(student.email, "Congratulations! Certificate Ready", certificateTemplate(student, percent, issDate));
        toast.success("Finalized & Email Sent!");
      } else {
        toast.success("Details Updated!");
      }
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, student, percent, admissionDate, issDate, onSave, isDone]);

  // 🔥 FEATURE 4: NODEMAILER (Delete Account Alert)
  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      if (student.email) {
        sendEmailNotification(student.email, "Student Record Removed", deleteAccountTemplate(student));
      }
      await onDelete(student.id);
      toast.success("Deleted Successfully");
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  }, [onDelete, student]);

  return (
    <div className="mb-4">
      <div className="card border-0 bg-white shadow-sm overflow-hidden" style={{ borderRadius: "20px" }}>
        <div style={{ height: "6px", background: `linear-gradient(90deg, ${STATUS_COLORS[status]}, #6366f1)` }} />

        <div className="card-body p-3">
          <div className="d-flex align-items-center gap-3 mb-3">
            <Link to={`/admin/students/${student.id}`}>
              <img src={avatarUrl} alt="" style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "18px" }} />
            </Link>
            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <h6 className="fw-bold mb-0 text-truncate">{student.name}</h6>
              <small className="text-muted d-block text-truncate">{studentCourse}</small>
            </div>
            <span style={{ background: STATUS_COLORS[status], color: "#fff", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }}>
              {status.toUpperCase()}
            </span>
          </div>

          <div className="d-flex gap-1 mb-3 flex-wrap">
            <span className="badge bg-light text-primary border rounded-pill px-3 py-2">
              <i className="bi bi-geo-alt me-1"></i>
              {BRANCH_DISPLAY[studentBranch] || studentBranch}
            </span>
            {student.regNo && (
              <span className="badge bg-light text-dark border rounded-pill px-3 py-2 d-flex align-items-center">
                <strong>{student.regNo}</strong>
                {isAdmin && !isDone && !isCanceled && (
                  <i className="bi bi-pencil-square ms-2 text-primary cursor-pointer" onClick={() => setEditingRegNo(true)}></i>
                )}
              </span>
            )}
          </div>

          {/* Render Sections based on status (Pending -> Registration -> Finalize) */}
          {isPending && isAdmin && !showRegInput && (
            <div className="mt-2 d-flex gap-2 border-top pt-3">
              <button className="btn btn-success flex-grow-1 fw-bold shadow-none" onClick={handleApproveClick}>APPROVE</button>
              {!showRejectConfirm ? (
                <button className="btn btn-outline-danger flex-grow-1 shadow-none" onClick={() => setShowRejectConfirm(true)}>REJECT</button>
              ) : (
                <div className="flex-grow-1 d-flex gap-1 animate__animated animate__fadeIn">
                  <button className="btn btn-danger flex-grow-1 btn-sm fw-bold shadow-none" onClick={() => handleStatusChange("canceled")}>CONFIRM?</button>
                  <button className="btn btn-secondary btn-sm shadow-none" onClick={() => setShowRejectConfirm(false)}>✕</button>
                </div>
              )}
            </div>
          )}

          {((isPending && showRegInput) || (isAccepted && (!student.regNo || editingRegNo))) && (
            <div className="bg-light p-3 rounded-4 mb-3 border border-success">
              <div className="d-flex justify-content-between mb-2">
                <label className="small fw-bold text-success">Assign Registration No</label>
                <button className="btn-close shadow-none" onClick={() => { setEditingRegNo(false); setShowRegInput(false); }}></button>
              </div>
              <input type="text" className={`form-control mb-2 rounded-0 shadow-none border-2 ${isDuplicate ? 'is-invalid' : ''}`} value={regNumber} placeholder="Enter 1-8 digits" onChange={e => setRegNumber(e.target.value.replace(/[^0-9]/g, "").slice(0, 8))} />
              {isDuplicate && <small className="text-danger d-block mb-2 fw-bold">Already Taken!</small>}
              <button className="btn btn-success w-100 fw-bold rounded-0" onClick={handleGenerateRegNo} disabled={loading || !isValidDigit || isDuplicate}>CONFIRM</button>
            </div>
          )}

          {((isAccepted && student.regNo && !editingRegNo && !showRegInput) || (isDone && isEditingFinal)) && (
            <div className="bg-light p-3 rounded-4 mb-3 border border-primary border-opacity-25 animate__animated animate__fadeIn">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0 text-primary small">Finalize / Issue Certificate</h6>
                <button className="btn btn-success btn-sm rounded-4 fw-bold px-3 shadow-none" onClick={handleMarkDone} disabled={loading || !percent || !admissionDate || !issDate}>Mark Done</button>
              </div>
              <label className="small text-muted mb-1 fw-bold">Percentage (%)</label>
              <input type="number" className="form-control form-control-sm mb-2 rounded-0 shadow-none" value={percent} onChange={(e) => setPercent(e.target.value)} />
              <div className="row g-2">
                <div className="col-6">
                  <label className="small text-muted mb-1 fw-bold">Admission Date</label>
                  <input type="date" className="form-control form-control-sm rounded-0 shadow-none" value={admissionDate} onChange={(e) => setAdmissionDate(e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="small text-muted mb-1 fw-bold">Issue Date</label>
                  <input type="date" className="form-control form-control-sm rounded-0 shadow-none" value={issDate} onChange={(e) => setIssDate(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {isDone && !isEditingFinal && (
            <div className="bg-primary bg-opacity-10 p-3 rounded-4 mb-3 border border-primary border-opacity-25">
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-primary fw-bold small"><i className="bi bi-patch-check-fill me-2"></i>COURSE COMPLETE</div>
                <i className="bi bi-pencil-square text-primary cursor-pointer" onClick={() => setIsEditingFinal(true)}></i>
              </div>
              <small className="text-muted d-block mt-1 fw-bold">Score: {student.percentage}% | Issued: {student.issueDate}</small>
            </div>
          )}

          <div className="d-flex justify-content-end pt-2 border-top mt-2">
            {isAdmin && (
              <div className="d-flex gap-1">
                {!showDeleteConfirm ? (
                  <button className="btn btn-link text-danger text-decoration-none small p-0 px-2" onClick={() => setShowDeleteConfirm(true)}><i className="bi bi-trash"></i> Delete</button>
                ) : (
                  <div className="d-flex gap-1 animate__animated animate__fadeIn">
                    <button className="btn btn-danger btn-sm rounded-pill px-3 fw-bold shadow-none" onClick={handleDelete} disabled={loading}>Confirm Delete?</button>
                    <button className="btn btn-light btn-sm rounded-pill shadow-none" onClick={() => setShowDeleteConfirm(false)}>✕</button>
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