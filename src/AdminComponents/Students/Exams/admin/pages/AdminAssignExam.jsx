// src/AdminComponents/Students/Exams/admin/pages/AdminAssignExam.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../../../firebase/firebase";
import { collection, getDocs, query, where, doc, deleteDoc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useExam } from "../../context/ExamProvider";
import { sendEmailNotification, examPermitTemplate } from "../../../../../services/emailService";
import { toast } from "react-toastify";

export default function AdminAssignExam() {
  const { examId } = useParams();
  const { exams } = useExam();
  const [students, setStudents] = useState([]);
  const [assignedData, setAssignedData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const exam = useMemo(() => exams.find(e => e.id === examId), [exams, examId]);

  // 1. Students List Fetch
  useEffect(() => {
    if (!exam) return;
    const fetchStudents = async () => {
      const sSnap = await getDocs(query(collection(db, "admissions"), where("course", "==", exam.course)));
      const list = sSnap.docs.map(d => ({ id: d.id, ...d.data() }))
        .filter(s => s.regNo && !s.issueDate && s.status !== "canceled");
      setStudents(list);
    };
    fetchStudents();
  }, [exam]);

  // 2. Real-time Assigned Data
  useEffect(() => {
    if (!examId) return;
    const q = query(collection(db, "studentExams"), where("examId", "==", examId));
    const unsubscribe = onSnapshot(q, (snap) => {
      const mapping = {};
      snap.docs.forEach((d) => {
        const data = d.data();
        if (data.studentId) {
          mapping[data.studentId.toLowerCase().trim()] = d.id;
        }
      });
      setAssignedData(mapping);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [examId]);

  const handleToggle = async (student) => {
    const studentEmail = student.email?.toLowerCase().trim();
    if (!studentEmail) {
      toast.error("Student has no email address!");
      return;
    }

    const isAssigned = !!assignedData[studentEmail];
    const docId = `${studentEmail}_${examId}`;

    try {
      if (isAssigned) {
        await deleteDoc(doc(db, "studentExams", docId));
        toast.info(`Access Revoked for ${student.name}`);
      } else {
        await setDoc(doc(db, "studentExams", docId), {
          studentId: studentEmail,
          admissionId: student.id,
          examId: examId,
          status: "Pending",
          score: 0,
          assignedAt: serverTimestamp()
        });

        if (student.email) {
          const emailSent = await sendEmailNotification(
            student.email,
            `Examination Permit: ${exam?.title}`,
            examPermitTemplate(student, exam)
          );
          emailSent ? toast.success(`Access Enabled for ${student.name}`) : toast.warning(`Access Enabled, but Email failed.`);
        }
      }
    } catch (err) {
      console.error("Toggle Error:", err);
      toast.error("Database Error");
    }
  };

  const filtered = useMemo(() => students.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.regNo?.toLowerCase().includes(searchTerm.toLowerCase())
  ), [students, searchTerm]);

  if (loading && students.length === 0) return <div className="text-center p-5"><div className="spinner-border text-primary" /></div>;

  return (
    <div className="container-fluid p-0 bg-light min-vh-100">
      <div className="card border-0 shadow-sm rounded-0">
        <div className="card-body p-3 text-dark">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h6 className="fw-bold mb-0">Permit Access</h6>
              <small className="text-primary fw-bold text-uppercase" style={{ fontSize: '10px' }}>{exam?.title}</small>
            </div>
            <input type="text" className="form-control form-control-sm rounded-pill px-3 border-2 w-auto shadow-none" placeholder="Search student..." onChange={e => setSearchTerm(e.target.value)} />
          </div>

          <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            <table className="table table-hover align-middle mb-0 text-nowrap">
              <thead className="bg-white sticky-top shadow-sm">
                <tr style={{ fontSize: '11px' }}>
                  <th width="100" className="text-center border-0 text-uppercase">Access</th>
                  <th className="border-0 text-uppercase">Student Details</th>
                  <th className="text-end pe-3 border-0 text-uppercase">Reg No</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => {
                  const isPermitted = !!assignedData[s.email?.toLowerCase().trim()];
                  return (
                    <tr key={s.id}>
                      <td className="text-center">
                        {/* 🔥 Updated Bootstrap Toggle Switch */}
                        <div className="form-check form-switch d-flex justify-content-center">
                          <input
                            className="form-check-input cursor-pointer shadow-none"
                            type="checkbox"
                            role="switch"
                            style={{ width: '2.5em', height: '1.25em' }}
                            checked={isPermitted}
                            onChange={() => handleToggle(s)}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src={s.photoUrl || `https://ui-avatars.com/api/?name=${s.name}`} alt="" style={{ width: "35px", height: "35px", objectFit: "cover", borderRadius: "4px" }} />
                          <div>
                            <div className="fw-bold small mb-0">{s.name}</div>
                            <div className={`fw-bold ${isPermitted ? 'text-success' : 'text-muted'}`} style={{ fontSize: '9px', textTransform: 'uppercase' }}>
                              {isPermitted ? (
                                <span><i className="bi bi-check-circle-fill me-1"></i>Permitted</span>
                              ) : (
                                <span><i className="bi bi-x-circle me-1"></i>No Access</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-end pe-3 small fw-bold text-secondary">{s.regNo}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer bg-white border-top p-2 sticky-bottom text-center small uppercase fw-bold text-muted">
          Total Students: {students.length} | Permitted: {Object.keys(assignedData).length}
        </div>
      </div>
    </div>
  );
}