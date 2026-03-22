// src/StudentComponents/Exams/StudentExamList.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useExam } from "../../AdminComponents/Students/Exams/context/ExamProvider";
import { auth, db } from "../../firebase/firebase";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";

export default function StudentExamList() {
  const { exams, loading } = useExam();
  const navigate = useNavigate();
  const [studentCourse, setStudentCourse] = useState(null);
  const [completedExams, setCompletedExams] = useState([]);
  const [assignedExams, setAssignedExams] = useState([]);
  const [fetching, setFetching] = useState(true);

  // 1. Get Student Course (One time fetch)
  useEffect(() => {
    const fetchCourse = async () => {
      const user = auth.currentUser;
      if (!user?.email) return;
      const q = query(collection(db, "admissions"), where("email", "==", user.email.toLowerCase()));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setStudentCourse(snap.docs[0].data().course);
      }
    };
    fetchCourse();
  }, []);

  // 2. 🔥 REAL-TIME LISTENER: Admin toggle karega toh turant yahan update hoga
useEffect(() => {
  const user = auth.currentUser;
  if (!user?.email) return;

  const userEmail = user.email.toLowerCase().trim();
  
  // 🔥 Listen to studentExams real-time using email filter
  // Admin assign karte waqt studentId mein email daale
  const examQ = query(collection(db, "studentExams"), where("studentId", "==", userEmail));

  const unsubscribe = onSnapshot(examQ, (snapshot) => {
    const assignedIds = [];
    const completedIds = [];

    snapshot.docs.forEach(d => {
      const data = d.data();
      assignedIds.push(data.examId);
      if (data.status === "Completed") {
        completedIds.push(data.examId);
      }
    });

    setAssignedExams(assignedIds);
    setCompletedExams(completedIds);
    setFetching(false);
  });

  return () => unsubscribe();
}, []);
  // Filter exams based on Real-time assignedExams
  const myExams = exams.filter(e =>
    e.isLive &&
    e.course === studentCourse &&
    assignedExams.includes(e.id)
  );

  if (loading || fetching) return <div className="vh-100 d-flex justify-content-center align-items-center bg-white"><div className="spinner-border text-primary border-4" /></div>;

  return (
    <div className="bg-light pb-5 ">
      <div className="bg-white border-bottom p-3 sticky-top shadow-sm d-flex justify-content-between align-items-center">
        <h6 className="fw-bold mb-0 text-uppercase text-primary letter-spacing-1">
          <i className="bi bi-journal-check me-2"></i>Examination Hall
        </h6>
        <span className="badge bg-dark rounded-0 px-3 py-2 small uppercase">{studentCourse}</span>
      </div>

      <div className="container py-3">
        {myExams.length > 0 ? myExams.map(e => {
          const isDone = completedExams.includes(e.id);
          return (
            <div key={e.id} className="bg-white border shadow-sm mb-3 rounded-0 overflow-hidden">
              <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                <div>
                  <h6 className={`fw-bold mb-1 text-uppercase ${isDone ? 'text-muted text-decoration-line-through' : 'text-dark'}`}>{e.title}</h6>
                  <div className="small text-muted fw-bold uppercase" style={{ fontSize: '10px' }}>
                    <i className="bi bi-clock me-1 text-primary"></i> {e.duration} Hrs
                    <span className="mx-2 text-light">|</span>
                    <i className="bi bi-award me-1 text-primary"></i> {e.totalMarks || '60'} Marks
                  </div>
                </div>
                <span className={`badge rounded-0 border px-2 py-1 ${isDone ? 'bg-success-subtle text-success border-success' : 'bg-danger-subtle text-danger border-danger animate-pulse'}`} style={{ fontSize: '9px' }}>
                  {isDone ? 'FINISHED' : 'LIVE NOW'}
                </span>
              </div>
              <div className="p-2 bg-light bg-opacity-10">
                {isDone ? (
                  <Link to={`/student/exams/finish/${auth.currentUser.email.split('@')[0]}_${e.id}`} className="btn btn-outline-success w-100 rounded-0 fw-bold py-2 border-2 shadow-sm small">
                    <i className="bi bi-file-earmark-bar-graph me-2"></i> VIEW SCORECARD
                  </Link>
                ) : (
                  <button className="btn btn-primary w-100 rounded-0 fw-bold py-2 shadow-sm border-0 small" onClick={() => navigate(`attempt/${e.id}`)}>
                    PROCEED TO EXAM <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                )}
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-5 bg-white border border-dashed rounded-0 mt-4 shadow-sm">
            <i className="bi bi-shield-lock display-4 text-muted opacity-25"></i>
            <h6 className="mt-3 fw-bold text-muted uppercase small">No Permitted Exams Found</h6>
            <p className="small text-muted mb-0">Contact center if your exam is scheduled today.</p>
          </div>
        )}
      </div>
    </div>
  );
}