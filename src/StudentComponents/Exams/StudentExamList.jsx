import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useExam } from "../../AdminComponents/Students/Exams/context/ExamProvider";
import { auth, db } from "../../firebase/firebase";
import { collection, onSnapshot, doc, getDoc, query, where } from "firebase/firestore";

export default function StudentExamList() {
  const { exams, loading: examsLoading } = useExam();
  const navigate = useNavigate();

  const [studentCourse, setStudentCourse] = useState(null);
  const [completedExams, setCompletedExams] = useState([]);
  const [assignedExams, setAssignedExams] = useState([]);
  const [fetching, setFetching] = useState(true);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user?.email) {
      setFetching(false);
      return;
    }

    const userEmail = user.email.toLowerCase().trim();

    // 1. FETCH COURSE
    const fetchCourse = async () => {
      try {
        const docRef = doc(db, "admissions", userEmail);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setStudentCourse(snap.data().course);
        }
      } catch (err) {
        console.error("Course fetch error:", err);
      }
    };
    fetchCourse();

    // 2. REALTIME LISTENER FOR ASSIGNED EXAMS
    const q = query(
      collection(db, "studentExams"),
      where("studentId", "==", userEmail)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const assignedIds = [];
      const completedIds = [];

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.examId) {
          assignedIds.push(data.examId);
          if (data.status === "Completed") {
            completedIds.push(data.examId);
          }
        }
      });

      setAssignedExams(assignedIds);
      setCompletedExams(completedIds);
      setFetching(false);
    }, (error) => {
      setFetching(false);
    });

    return () => unsubscribe();
  }, [user]);

  // FILTER LOGIC
  const myExams = exams.filter((e) => {
    const isLive = e.isLive === true;
    const courseMatch = e.course?.toLowerCase().trim() === studentCourse?.toLowerCase().trim();
    const isAssigned = assignedExams.includes(e.id);
    return isLive && courseMatch && isAssigned;
  });

  if (examsLoading || fetching) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-white">
        <div className="spinner-border text-primary border-4" />
      </div>
    );
  }

  return (
    <div className="bg-light pb-5" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div className="bg-white border-bottom p-3 sticky-top shadow-sm d-flex justify-content-between align-items-center">
        <h6 className="fw-bold mb-0 text-uppercase text-primary">
          <i className="bi bi-journal-check me-2"></i>Examination Hall
        </h6>
        <span className="badge bg-dark rounded-0 px-3 py-2 small">
          {studentCourse || "Student"}
        </span>
      </div>

      <div className="container py-3">
        {myExams.length > 0 ? (
          myExams.map((e) => {
            const isDone = completedExams.includes(e.id);
            return (
              <div key={e.id} className="bg-white border shadow-sm mb-3 rounded-0 overflow-hidden">
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className={`fw-bold mb-1 text-uppercase ${isDone ? "text-muted text-decoration-line-through" : "text-dark"}`}>
                      {e.title}
                    </h6>
                    <div className="small text-muted fw-bold uppercase" style={{ fontSize: "10px" }}>
                      <i className="bi bi-clock me-1 text-primary"></i> {e.duration} Hrs
                      <span className="mx-2 text-light">|</span>
                      <i className="bi bi-award me-1 text-primary"></i> {e.totalMarks || "100"} Marks
                    </div>
                  </div>
                  <span className={`badge rounded-0 border px-2 py-1 ${isDone ? "bg-success-subtle text-success border-success" : "bg-danger-subtle text-danger border-danger"}`} style={{ fontSize: "9px" }}>
                    {isDone ? "FINISHED" : "LIVE NOW"}
                  </span>
                </div>
                <div className="p-2">
                  {isDone ? (
                    <Link to={`/student/exams/finish/${user?.email?.toLowerCase().trim()}_${e.id}`} className="btn btn-outline-success w-100 rounded-0 shadow-none btn-sm">
                      VIEW SCORECARD
                    </Link>
                  ) : (
                    <button className="btn btn-primary w-100 rounded-0 fw-bold py-2 shadow-sm border-0 small" onClick={() => navigate(`attempt/${e.id}`)}>
                      PROCEED TO EXAM <i className="bi bi-arrow-right ms-1"></i>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-5 bg-white border border-dashed rounded-0 mt-4 shadow-sm px-3">
            <i className="bi bi-shield-lock display-4 text-muted opacity-25"></i>
            <h6 className="mt-3 fw-bold text-muted uppercase small">No Exams Available</h6>
            <p className="small text-muted mb-0">Contact your center if you are unable to find your scheduled exam.</p>
          </div>
        )}
      </div>
    </div>
  );
}