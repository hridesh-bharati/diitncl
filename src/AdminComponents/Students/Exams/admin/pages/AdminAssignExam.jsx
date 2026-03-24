// src/AdminComponents/Students/Exams/admin/pages/AdminAssignExam.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../../../firebase/firebase";
import { collection, getDocs, query, where, doc, deleteDoc, setDoc, serverTimestamp, onSnapshot, getDoc } from "firebase/firestore";
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

  // 1. Students List Fetch Karo (Static)
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

  // 🔥 2. REAL-TIME ASSIGNED DATA: Isse reload ki tension khatam
  useEffect(() => {
    if (!examId) return;
    const q = query(collection(db, "studentExams"), where("examId", "==", examId));
    const unsubscribe = onSnapshot(q, (snap) => {
      const mapping = {};
      snap.docs.forEach(d => {
        const data = d.data();
        // Yahan studentId (Email) ko hi key banayein matching ke liye
        mapping[data.studentId] = d.id;
      });
      setAssignedData(mapping);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [examId]);

  // handleToggle function to on/off examination
  const handleToggle = async (student) => {
    const studentEmail = student.email?.toLowerCase().trim(); // 👈 Yeh line add karein
    const studentAdmissionId = student.id;
    const isAssigned = !!assignedData[studentEmail];
    const docId = `${studentAdmissionId}_${examId}`;

    try {
      if (isAssigned) {
        await deleteDoc(doc(db, "studentExams", docId));
        toast.info(`Access Revoked for ${student.name}`);
      } else {
        await setDoc(doc(db, "studentExams", docId), {
          studentId: studentEmail, // 🔥 ID ki jagah Email save karein
          admissionId: student.id, // Reference ke liye Admission ID bhi rakh sakte hain
          examId: examId,
          status: "Pending",
          score: 0,
          assignedAt: serverTimestamp()
        });

        // 3. Nodemailer Email Trigger (Jab Access ON ho)
        if (student.email) {
          // Hum await kar rahe hain taaki email success confirm ho sake
          const emailSent = await sendEmailNotification(
            student.email,
            `Examination Permit: ${exam?.title}`,
            examPermitTemplate(student, exam)
          );

          // 🔥 4. PUSH NOTIFICATION TRIGGER  
          if (student.pushSubscription) {
            fetch('/api/send-push', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                subscription: JSON.parse(student.pushSubscription),
                title: "Exam Permit Issued! 📝",
                body: `Hi ${student.name}, You are permitted for ${exam?.title}. Best of luck!`
              })
            })
              .then(response => {
                if (!response.ok) console.error("Push API error response:", response.status);
              })
              .catch(e => console.error("Exam Push failed", e));
          }

          if (emailSent) {
            toast.success(`Access Enabled & Permit Sent to ${student.name}`);
          } else {
            toast.warning(`Access Enabled, but Permit Email failed.`);
          }
        } else {
          toast.success(`Access Enabled for ${student.name} (No Email)`);
        }
      }
    } catch (err) {
      console.error("Toggle Error:", err);
      toast.error("Error updating access.");
    }
  };

  const filtered = useMemo(() => students.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.regNo?.toLowerCase().includes(searchTerm.toLowerCase())
  ), [students, searchTerm]);

  if (loading && students.length === 0) return <div className="text-center p-5"><div className="spinner-border text-primary border-4" /></div>;

  return (
    <div className="container-fluid p-0 bg-light min-vh-100">
      <div className="card border-0 shadow-sm rounded-0">
        <div className="card-body p-3 text-dark">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h6 className="fw-bold mb-0">Permit Access</h6>
              <small className="text-primary fw-bold text-uppercase" style={{ fontSize: '10px' }}>{exam?.title} ({exam?.course})</small>
            </div>
            <input type="text" className="form-control form-control-sm rounded-0 border-2 w-auto shadow-none" placeholder="Search..." onChange={e => setSearchTerm(e.target.value)} />
          </div>

          <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            <table className="table table-hover align-middle mb-0 text-nowrap">
              <thead className="bg-light sticky-top shadow-sm">
                <tr style={{ fontSize: '11px' }}>
                  <th width="70" className="text-center border-0">ACCESS</th>
                  <th className="border-0 text-uppercase">Student Name</th>
                  <th className="text-end pe-3 border-0 text-uppercase">Reg No</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td className="text-center">
                      <div className="form-check form-switch d-inline-block">
                        <input
                          type="checkbox"
                          checked={!!assignedData[s.email?.toLowerCase().trim()]}
                          onChange={() => handleToggle(s)}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img src={s.photoUrl || `https://ui-avatars.com/api/?name=${s.name}`} alt="" style={{ width: "32px", height: "32px", objectFit: "cover", borderRadius: "0" }} />
                        <div>
                          <div className="fw-bold small">{s.name}</div>
                          <div className={`text-uppercase fw-bold ${assignedData[s.email?.toLowerCase().trim()] ? 'text-success' : 'text-muted'}`} style={{ fontSize: '8px' }}>
                            {assignedData[s.email?.toLowerCase().trim()] ? '● Permitted' : '○ Access Off'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-end pe-3 small fw-bold text-muted">{s.regNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer bg-dark text-white p-2 sticky-bottom border-0 rounded-0 text-center small uppercase fw-bold opacity-75">
          Total Students in Batch: {students.length}
        </div>
      </div>
    </div>
  );
}