// src/AdminComponents/Students/Exams/admin/pages/AdminAssignExam.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../../../firebase/firebase";
import { collection, getDocs, query, where, doc, deleteDoc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useExam } from "../../context/ExamProvider";

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
    
    // Listen for any changes in studentExams for this specific exam
    const unsubscribe = onSnapshot(q, (snap) => {
      const mapping = {};
      snap.docs.forEach(d => {
        const data = d.data();
        mapping[data.studentId] = d.id;
      });
      setAssignedData(mapping);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [examId]);

  // handleToggle function to on/off examination
  const handleToggle = async (studentAdmissionId) => {
    const isAssigned = !!assignedData[studentAdmissionId];
    const docId = `${studentAdmissionId}_${examId}`;

    try {
      if (isAssigned) {
        // OFF: Record delete hoga -> StudentExamPage ka onSnapshot turant bache ko bahar phekh dega
        await deleteDoc(doc(db, "studentExams", docId));
      } else {
        // ON: Record create hoga -> StudentExamList mein real-time button show ho jayega
        await setDoc(doc(db, "studentExams", docId), {
          studentId: studentAdmissionId,
          examId: examId,
          status: "Pending",
          score: 0,
          assignedAt: serverTimestamp()
        });
      }
    } catch (err) { 
      console.error("Toggle Error:", err);
      alert("Error updating access. Check connection.");
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
                <tr style={{fontSize: '11px'}}>
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
                          className="form-check-input border-2 cursor-pointer shadow-none"
                          type="checkbox"
                          checked={!!assignedData[s.id]}
                          onChange={() => handleToggle(s.id)}
                          style={{ width: '38px', height: '19px' }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img src={s.photoUrl || `https://ui-avatars.com/api/?name=${s.name}`} alt="" style={{ width: "32px", height: "32px", objectFit: "cover", borderRadius: "0" }} />
                        <div>
                          <div className="fw-bold small">{s.name}</div>
                          <div className={`text-uppercase fw-bold ${assignedData[s.id] ? 'text-success' : 'text-muted'}`} style={{ fontSize: '8px' }}>
                            {assignedData[s.id] ? '● Permitted' : '○ Access Off'}
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