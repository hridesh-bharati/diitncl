// // src\AdminComponents\Students\StudentCard.jsx
// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useAuth } from "../../contexts/AuthContext";
// import { collection, query, where, getDocs, doc, onSnapshot } from "firebase/firestore";
// import { db } from "../../firebase/firebase";
// // 🔹 Nodemailer & Push Service Imports
// import { 
//   sendEmailNotification, 
//   admissionTemplate, 
//   certificateTemplate, 
//   deleteAccountTemplate 
// } from "../../services/emailService";

// const STATUS_COLORS = {
//   accepted: "#10b981",
//   canceled: "#ef4444",
//   pending: "#f59e0b",
//   done: "#3b82f6"
// };

// const BRANCH_DISPLAY = {
//   DIIT124: "Main Branch",
//   DIIT125: "East Branch"
// };

// const StudentCard = React.memo(({ student: initialStudent, onSave, onDelete }) => {
//   const { isAdmin } = useAuth();
//   const [student, setStudent] = useState(initialStudent);

//   // States for Input Fields
//   const [regNumber, setRegNumber] = useState("");
//   const [percent, setPercent] = useState("");
//   const [issDate, setIssDate] = useState("");
//   const [admissionDate, setAdmissionDate] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isDuplicate, setIsDuplicate] = useState(false);
//   const [editingRegNo, setEditingRegNo] = useState(false);
//   const [showRegInput, setShowRegInput] = useState(false);
//   const [isEditingFinal, setIsEditingFinal] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [showRejectConfirm, setShowRejectConfirm] = useState(false);

//   // 🔥 DIRECT EMAIL ID LISTENER (No Encoding/Decoding)
//   useEffect(() => {
//     // Hamara document ID student ka email hai (Case-insensitive safety ke liye lowercase)
//     const docId = initialStudent.email?.toLowerCase().trim();
//     if (!docId) return;

//     const docRef = doc(db, "admissions", docId);
//     const unsubscribe = onSnapshot(docRef, (docSnap) => {
//       if (docSnap.exists()) {
//         const data = { id: docSnap.id, ...docSnap.data() };
//         setStudent(data);
//       }
//     });
//     return () => unsubscribe();
//   }, [initialStudent.email]);

//   const status = useMemo(() => {
//     if (student.status === "canceled") return "canceled";
//     if (student.regNo && student.issueDate) return "done";
//     if (student.regNo) return "accepted";
//     return "pending";
//   }, [student.status, student.regNo, student.issueDate]);

//   const isPending = status === "pending";
//   const isAccepted = status === "accepted";
//   const isDone = status === "done";
//   const isCanceled = status === "canceled";

//   const studentBranch = student.branch || student.centerCode;
//   const studentCourse = student.course || "General";
//   const isValidDigit = /^\d{1,8}$/.test(regNumber.trim());

//   const avatarUrl = useMemo(() => {
//     if (student.photoUrl) return student.photoUrl;
//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || "Student")}&background=random&length=2`;
//   }, [student.photoUrl, student.name]);

//   useEffect(() => {
//     setPercent(student.percentage ?? "");
//     setIssDate(student.issueDate || "");
//     setAdmissionDate(student.admissionDate || "");
//     setRegNumber(student.regNo ? student.regNo.split("/").pop() : "");
//     setEditingRegNo(false);
//     setShowRegInput(false);
//     setIsEditingFinal(false);
//   }, [student]);

//   const checkDuplicateRegNo = useCallback(async (branch, regNum) => {
//     if (!branch || !regNum) return false;
//     try {
//       const num = Number(regNum);
//       const q = query(collection(db, "admissions"), where("regShort", "==", num), where("branch", "==", branch));
//       const snapshot = await getDocs(q);
//       return snapshot.docs.some(doc => doc.id !== student.email.toLowerCase());
//     } catch (error) { return false; }
//   }, [student.email]);

//   useEffect(() => {
//     const check = async () => {
//       if (!studentBranch || !regNumber.trim() || !isValidDigit) { setIsDuplicate(false); return; }
//       const duplicate = await checkDuplicateRegNo(studentBranch, regNumber.trim());
//       setIsDuplicate(duplicate);
//     };
//     const timer = setTimeout(check, 300);
//     return () => clearTimeout(timer);
//   }, [regNumber, studentBranch, isValidDigit, checkDuplicateRegNo]);

//   const handleApproveClick = useCallback(() => setShowRegInput(true), []);

//   const handleStatusChange = useCallback(async (newStatus) => {
//     if (!isAdmin) return;
//     setLoading(true);
//     try {
//       await onSave(student.email.toLowerCase(), { status: newStatus });
//       toast.success(`Application ${newStatus}`);
//       setShowRejectConfirm(false);
//     } catch {
//       toast.error("Update failed");
//     } finally {
//       setLoading(false);
//     }
//   }, [isAdmin, onSave, student.email]);

//   const handleGenerateRegNo = useCallback(async () => {
//     if (!isAdmin || !isValidDigit || isDuplicate) return;
//     setLoading(true);
//     try {
//       const cleanRegNum = regNumber.trim();
//       const courseCode = (studentCourse || "CRS").toString().replace(/\s+/g, "").toUpperCase().slice(0, 10);
//       const newRegNo = `${studentBranch}/${courseCode}/${cleanRegNum}`;

//       await onSave(student.email.toLowerCase(), {
//         branch: studentBranch,
//         regNo: newRegNo,
//         regShort: Number(cleanRegNum),
//         status: "accepted"
//       });

//       if (student.email) {
//         sendEmailNotification(student.email, "Admission Approved - Drishtee", admissionTemplate(student, newRegNo));
//       }


//       toast.success("Approved & Notified!");
//       setShowRegInput(false);
//     } catch (error) {
//       toast.error("Failed to save");
//     } finally {
//       setLoading(false);
//     }
//   }, [isAdmin, isValidDigit, isDuplicate, regNumber, studentCourse, studentBranch, onSave, student]);

//   const handleMarkDone = useCallback(async () => {
//     if (!isAdmin || !student.regNo || !percent || !admissionDate || !issDate) return toast.error("Fill all details");
//     setLoading(true);
//     try {
//       await onSave(student.email.toLowerCase(), {
//         status: "done",
//         percentage: Number(percent),
//         admissionDate,
//         issueDate: issDate
//       });

//       if (student.email) {
//         sendEmailNotification(student.email, "Congratulations! Certificate Ready", certificateTemplate(student, percent, issDate));
//       }


//       toast.success("Finalized & Notified!");
//       setIsEditingFinal(false);
//     } catch (err) {
//       toast.error("Action failed");
//     } finally {
//       setLoading(false);
//     }
//   }, [isAdmin, student, percent, admissionDate, issDate, onSave, studentCourse]);

//   const handleDelete = useCallback(async () => {
//     setLoading(true);
//     try {
//       if (student.email) {
//         await sendEmailNotification(student.email, "Student Record Deactivated", deleteAccountTemplate(student));
//       }

//       await onDelete(student.email.toLowerCase());
//       toast.success("Record Deleted & Student Notified");
//     } catch (err) {
//       toast.error("Delete failed");
//     } finally {
//       setLoading(false);
//     }
//   }, [onDelete, student]);

//   return (
//     <div className="mb-4">
//       <div className="card bg-white border overflow-hidden">
//         <div style={{ height: "6px", background: `linear-gradient(90deg, ${STATUS_COLORS[status]}, #6366f1)` }} />

//         <div className="card-body p-3">
//           <div className="d-flex align-items-center gap-3 mb-3">
//             {/* ✅ DIRECT EMAIL LINK */}
//             <Link to={`/admin/students/${student.email}`}>
//               <img src={avatarUrl} alt="Drishtee Student" style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "50%" }} />
//             </Link>
//             <div className="flex-grow-1" style={{ minWidth: 0 }}>
//               <h6 className="fw-bold mb-0 text-truncate">{student.name}</h6>
//               <small className="text-muted d-block text-truncate">{studentCourse}</small>
//             </div>
//             <span style={{ background: STATUS_COLORS[status], color: "#fff", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }}>
//               {status.toUpperCase()}
//             </span>
//           </div>

//           <div className="d-flex gap-1 mb-2">
//             <span className="badge bg-light text-primary border rounded-pill p-2">
//               <i className="bi bi-geo-alt me-1"></i>
//               {BRANCH_DISPLAY[studentBranch] || studentBranch}
//             </span>
//             {student.regNo && (
//               <span className="badge bg-light text-dark border rounded-pill p-2 d-flex align-items-center">
//                 <strong>{student.regNo}</strong>
//                 {isAdmin && !isDone && !isCanceled && (
//                   <i className="bi bi-pencil-square ms-2 text-primary cursor-pointer" onClick={() => setEditingRegNo(true)}></i>
//                 )}
//               </span>
//             )}

//           </div>

//           {isPending && isAdmin && !showRegInput && (
//             <div className="mt-2 d-flex gap-2 border-top pt-3">
//               <button className="btn btn-success flex-grow-1 fw-bold shadow-none" onClick={handleApproveClick}>APPROVE</button>
//               {!showRejectConfirm ? (
//                 <button className="btn btn-outline-danger flex-grow-1 shadow-none" onClick={() => setShowRejectConfirm(true)}>REJECT</button>
//               ) : (
//                 <div className="flex-grow-1 d-flex gap-1 animate__animated animate__fadeIn">
//                   <button className="btn btn-danger flex-grow-1 btn-sm fw-bold shadow-none" onClick={() => handleStatusChange("canceled")}>CONFIRM?</button>
//                   <button className="btn btn-secondary btn-sm shadow-none" onClick={() => setShowRejectConfirm(false)}>✕</button>
//                 </div>
//               )}
//             </div>
//           )}

//           {((isPending && showRegInput) || (isAccepted && (!student.regNo || editingRegNo))) && (
//             <div className="bg-light p-3 rounded-4 mb-3 border border-success">
//               <div className="d-flex justify-content-between mb-2">
//                 <label className="small fw-bold text-success">Assign Registration No</label>
//                 <button className="btn-close shadow-none" onClick={() => { setEditingRegNo(false); setShowRegInput(false); }}></button>
//               </div>
//               <input type="text" className={`form-control mb-2 rounded-0 shadow-none border-2 ${isDuplicate ? 'is-invalid' : ''}`} value={regNumber} placeholder="Enter 1-8 digits" onChange={e => setRegNumber(e.target.value.replace(/[^0-9]/g, "").slice(0, 8))} />
//               {isDuplicate && <small className="text-danger d-block mb-2 fw-bold">Already Taken!</small>}
//               <button className="btn btn-success w-100 fw-bold rounded-0" onClick={handleGenerateRegNo} disabled={loading || !isValidDigit || isDuplicate}>CONFIRM</button>
//             </div>
//           )}

//           {((isAccepted && student.regNo && !editingRegNo && !showRegInput) || (isDone && isEditingFinal)) && (
//             <div className="bg-light p-3 rounded-4 mb-3 border-0">
//               <div className="d-flex justify-content-between align-items-center">
//                 <h6 className="fw-bold mb-0 text-primary small">Finalize / Issue Certificate</h6>
//                 <button className="btn btn-success btn-sm rounded-4 fw-bold px-3 shadow-none" onClick={handleMarkDone} disabled={loading || !percent || !admissionDate || !issDate}>Done</button>
//               </div>
//               <label className="small text-muted p-0 m-0 fw-bold">Percentage (%)</label>
//               <input type="number" className="form-control form-control-sm mb-2 rounded-0 shadow-none" value={percent} onChange={(e) => setPercent(e.target.value)} />
//               <div className="row g-2">
//                 <div className="col-6">
//                   <label className="small text-muted p-0 m-0 fw-bold">Admission Date</label>
//                   <input type="date" className="form-control form-control-sm rounded-0 shadow-none" value={admissionDate} onChange={(e) => setAdmissionDate(e.target.value)} />
//                 </div>
//                 <div className="col-6">
//                   <label className="small text-muted mb-1 fw-bold">Issue Date</label>
//                   <input type="date" className="form-control form-control-sm rounded-0 shadow-none" value={issDate} onChange={(e) => setIssDate(e.target.value)} />
//                 </div>
//               </div>
//             </div>
//           )}

//           {isDone && !isEditingFinal && (
//             <div className="bg-primary bg-opacity-10 p-3 rounded-4 mb-3 border border-primary border-opacity-25">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div className="text-primary fw-bold small"><i className="bi bi-patch-check-fill me-2"></i>COURSE COMPLETE</div>
//                 <i className="bi bi-pencil-square text-primary cursor-pointer" onClick={() => setIsEditingFinal(true)}></i>
//               </div>
//               <small className="text-muted d-block mt-1 fw-bold">Score: {student.percentage}% | Issued: {student.issueDate}</small>
//             </div>
//           )}

//           <div className="d-flex justify-content-end">
//             {isAdmin && (
//               <div className="d-flex gap-1">
//                 {!showDeleteConfirm ? (
//                   <button className="btn btn-link text-danger text-decoration-none small p-0 px-2" onClick={() => setShowDeleteConfirm(true)}><i className="bi bi-trash"></i> Delete</button>
//                 ) : (
//                   <div className="d-flex gap-1 animate__animated animate__fadeIn">
//                     <button className="btn btn-danger btn-sm rounded-pill px-3 fw-bold shadow-none" onClick={handleDelete} disabled={loading}>Confirm Delete?</button>
//                     <button className="btn btn-light btn-sm rounded-pill shadow-none" onClick={() => setShowDeleteConfirm(false)}>✕</button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// });

// export default StudentCard;


// src\AdminComponents\Students\StudentCard.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import {
  sendEmailNotification,
  admissionTemplate,
  certificateTemplate,
  deleteAccountTemplate
} from "../../services/emailService";

const STATUS_COLORS = { accepted: "#10b981", canceled: "#ef4444", pending: "#f59e0b", done: "#3b82f6" };
const BRANCH_DISPLAY = { DIIT124: "Main Branch", DIIT125: "East Branch" };

export const getActualStatus = (s) => {
  if (s.status === "canceled") return "canceled";
  return s.regNo && s.issueDate ? "done" : s.regNo ? "accepted" : "pending";
};

const StudentCard = React.memo(({ student, onSave, onDelete }) => {
  const { isAdmin } = useAuth();

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

  const status = useMemo(() => getActualStatus(student), [student]);

  const isPending = status === "pending";
  const isAccepted = status === "accepted";
  const isDone = status === "done";
  const isCanceled = status === "canceled";

  const studentBranch = student.branch || student.centerCode;
  const studentCourse = student.course || "General";
  const isValidDigit = /^\d{1,8}$/.test(regNumber.trim());

  const avatarUrl = useMemo(() => student.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || "Student")}&background=random&length=2`, [student.photoUrl, student.name]);

  useEffect(() => {
    setPercent(student.percentage ?? "");
    setIssDate(student.issueDate || "");
    setAdmissionDate(student.admissionDate || "");
    setRegNumber(student.regNo ? student.regNo.split("/").pop() : "");
    setEditingRegNo(false);
    setShowRegInput(false);
    setIsEditingFinal(false);
  }, [student]);

  const checkDuplicateRegNo = useCallback(async (branch, regNum) => {
    if (!branch || !regNum) return false;
    try {
      const q = query(collection(db, "admissions"), where("regShort", "==", Number(regNum)), where("branch", "==", branch));
      const snapshot = await getDocs(q);
      return snapshot.docs.some(d => d.id !== student.id);
    } catch { return false; }
  }, [student.id]);

  useEffect(() => {
    const check = async () => {
      if (!studentBranch || !regNumber.trim() || !isValidDigit) { setIsDuplicate(false); return; }
      setIsDuplicate(await checkDuplicateRegNo(studentBranch, regNumber.trim()));
    };
    const timer = setTimeout(check, 300);
    return () => clearTimeout(timer);
  }, [regNumber, studentBranch, isValidDigit, checkDuplicateRegNo]);

  const handleStatusChange = useCallback(async (newStatus) => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      await onSave(student.id, { status: newStatus });
      toast.success(`Application ${newStatus}`);
      setShowRejectConfirm(false);
    } catch {
      toast.error("Update failed");
    } finally { setLoading(false); }
  }, [isAdmin, onSave, student.id]);

  const handleGenerateRegNo = useCallback(async () => {
    if (!isAdmin || !isValidDigit || isDuplicate) return;
    setLoading(true);
    try {
      const cleanRegNum = regNumber.trim();
      const courseCode = studentCourse.toString().replace(/\s+/g, "").toUpperCase().slice(0, 10);
      const newRegNo = `${studentBranch}/${courseCode}/${cleanRegNum}`;

      await onSave(student.id, {
        branch: studentBranch, regNo: newRegNo, regShort: Number(cleanRegNum), status: "accepted"
      });

      if (student.email) sendEmailNotification(student.email, "Admission Approved - Drishtee", admissionTemplate(student, newRegNo));
      toast.success("Approved & Notified!");
      setShowRegInput(false);
    } catch { toast.error("Failed to save"); }
    finally { setLoading(false); }
  }, [isAdmin, isValidDigit, isDuplicate, regNumber, studentCourse, studentBranch, onSave, student]);

  const handleMarkDone = useCallback(async () => {
    if (!isAdmin || !student.regNo || !percent || !admissionDate || !issDate) return toast.error("Fill all details");
    setLoading(true);
    try {
      await onSave(student.id, {
        status: "done", percentage: Number(percent), admissionDate, issueDate: issDate
      });

      if (student.email) sendEmailNotification(student.email, "Congratulations! Certificate Ready", certificateTemplate(student, percent, issDate));
      toast.success("Finalized & Notified!");
      setIsEditingFinal(false);
    } catch { toast.error("Action failed"); }
    finally { setLoading(false); }
  }, [isAdmin, student, percent, admissionDate, issDate, onSave]);

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      if (student.email) await sendEmailNotification(student.email, "Student Record Deactivated", deleteAccountTemplate(student));
      await onDelete(student.id);
      toast.success("Record Deleted & Student Notified");
    } catch { toast.error("Delete failed"); }
    finally { setLoading(false); }
  }, [onDelete, student]);

  return (
    <div className="card border my-1 overflow-hidden rounded-3">
      <div style={{ height: "4px", background: `linear-gradient(90deg, ${STATUS_COLORS[status]}, #6366f1)` }} />
      <div className="card-body p-3">
        <div className="d-flex align-items-center gap-3 mb-0">
          <Link to={`/admin/students/${student.email}`}>
            <img src={avatarUrl} alt="Student" className="border border-light" style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "50%" }} />
          </Link>
          <div className="flex-grow-1" style={{ minWidth: 0 }}>
            <h6 className="fw-bold mb-0 text-dark text-truncate" style={{ fontSize: "14px" }}>{student.name}</h6>
            <small className="text-muted d-block text-truncate" style={{ fontSize: "12px" }}>{studentCourse}</small>
          </div>
          <span className="badge border" style={{ backgroundColor: `${STATUS_COLORS[status]}15`, color: STATUS_COLORS[status], borderColor: `${STATUS_COLORS[status]}30`, padding: "5px 10px", fontSize: "10px" }}>
            {status.toUpperCase()}
          </span>
        </div>

        <div className="d-flex flex-wrap gap-1 my-1">
          <span className="badge bg-light text-secondary border rounded-pill px-2.5 py-1.5" style={{ fontSize: "11px" }}>
            <i className="bi bi-geo-alt me-1"></i>{BRANCH_DISPLAY[studentBranch] || studentBranch}
          </span>
          {student.regNo && (
            <span className="badge bg-light text-dark border rounded-pill px-2 py-1 d-flex align-items-center" style={{ fontSize: "11px" }}>
              <strong>{student.regNo}</strong>
              {isAdmin && !isDone && !isCanceled && (
                <i className="bi bi-pencil-square ms-2 text-primary" style={{ cursor: "pointer" }} onClick={() => setEditingRegNo(true)}></i>
              )}
            </span>
          )}
        </div>

        {isPending && isAdmin && !showRegInput && (
          <div className="d-flex gap-2 border-top pt-2 mt-2">
            <button className="btn btn-sm btn-success flex-grow-1 fw-bold py-1.5" onClick={() => setShowRegInput(true)}>APPROVE</button>
            {!showRejectConfirm ? (
              <button className="btn btn-sm btn-outline-danger flex-grow-1 py-1.5" onClick={() => setShowRejectConfirm(true)}>REJECT</button>
            ) : (
              <div className="flex-grow-1 d-flex gap-1">
                <button className="btn btn-sm btn-danger flex-grow-1 fw-bold" onClick={() => handleStatusChange("canceled")}>CONFIRM?</button>
                <button className="btn btn-sm btn-secondary" onClick={() => setShowRejectConfirm(false)}>✕</button>
              </div>
            )}
          </div>
        )}

        {((isPending && showRegInput) || (isAccepted && (!student.regNo || editingRegNo))) && (
          <div className="bg-light p-2 rounded-3 my-2 border">
            <div className="d-flex justify-content-between mb-1">
              <label className="small fw-bold text-success" style={{ fontSize: "11px" }}>Assign Registration No</label>
              <button className="btn-close small" style={{ transform: "scale(0.7)" }} onClick={() => { setEditingRegNo(false); setShowRegInput(false); }}></button>
            </div>
            <input type="text" className={`form-control form-control-sm mb-1.5 ${isDuplicate ? 'is-invalid' : ''}`} value={regNumber} placeholder="1-8 digits" onChange={e => setRegNumber(e.target.value.replace(/[^0-9]/g, "").slice(0, 8))} />
            {isDuplicate && <small className="text-danger d-block mb-1 fw-bold" style={{ fontSize: "11px" }}>Already Taken!</small>}
            <button className="btn btn-sm btn-success w-100 fw-bold" onClick={handleGenerateRegNo} disabled={loading || !isValidDigit || isDuplicate}>CONFIRM</button>
          </div>
        )}

        {((isAccepted && student.regNo && !editingRegNo && !showRegInput) || (isDone && isEditingFinal)) && (
          <div className="bg-light p-2 rounded-3 my-2 border">
            <div className="d-flex justify-content-between align-items-center mb-1.5">
              <span className="fw-bold text-primary" style={{ fontSize: "11px" }}>Ongoing Course</span>
              <button className="btn btn-success mb-1 fw-bold px-2 py-1" style={{ fontSize: "11px" }} onClick={handleMarkDone} disabled={loading || !percent || !admissionDate || !issDate}>Done</button>
            </div>
            <input type="number" className="form-control form-control-sm mb-1" placeholder="Percentage (%)" value={percent} onChange={(e) => setPercent(e.target.value)} />
            <div className="row g-1">
              <div className="col-6">
                <input type="date" className="form-control form-control-sm" style={{ fontSize: "11px" }} value={admissionDate} onChange={(e) => setAdmissionDate(e.target.value)} />
              </div>
              <div className="col-6">
                <input type="date" className="form-control form-control-sm" style={{ fontSize: "11px" }} value={issDate} onChange={(e) => setIssDate(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {isDone && !isEditingFinal && (
          <div className="p-2 rounded-3 my-2 border border-primary-subtle" style={{ backgroundColor: "#e7f3ff" }}>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-primary fw-bold" style={{ fontSize: "11px" }}><i className="bi bi-patch-check-fill me-1"></i>PASSED</span>
              <i className="bi bi-pencil-square text-primary" style={{ cursor: "pointer", fontSize: "12px" }} onClick={() => setIsEditingFinal(true)}></i>
            </div>
            <small className="text-muted d-block" style={{ fontSize: "11px" }}>Score: {student.percentage}% | Issued: {student.issueDate}</small>
          </div>
        )}

        <div className="d-flex justify-content-end mt-1">
          {isAdmin && (
            <>
              {!showDeleteConfirm ? (
                <button className="btn btn-link text-danger text-decoration-none p-0" style={{ fontSize: "12px" }} onClick={() => setShowDeleteConfirm(true)}><i className="bi bi-trash"></i> Delete</button>
              ) : (
                <div className="d-flex gap-1">
                  <button className="btn btn-xs btn-danger fw-bold" style={{ fontSize: "11px" }} onClick={handleDelete} disabled={loading}>Confirm?</button>
                  <button className="btn btn-xs btn-light" style={{ fontSize: "11px" }} onClick={() => setShowDeleteConfirm(false)}>✕</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default StudentCard;