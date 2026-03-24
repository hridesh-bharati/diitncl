import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../../../firebase/firebase";
import { doc, getDoc, collection, query, where, getDocs, updateDoc, increment } from "firebase/firestore";
import { toast } from "react-toastify";
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

export default function AdminExamResultView() {
  const { studentExamId } = useParams();
  const [data, setData] = useState({ result: null, student: null, exam: null, questions: [] });
  const [loading, setLoading] = useState(true);
  const [showCode, setShowCode] = useState(null);

  const fetchData = async () => {
    try {
      const resSnap = await getDoc(doc(db, "studentExams", studentExamId));
      if (!resSnap.exists()) return;
      const res = resSnap.data();
      const [sS, eS, qS] = await Promise.all([
        getDoc(doc(db, "admissions", res.studentId)),
        getDoc(doc(db, "exams", res.examId)),
        getDocs(query(collection(db, "examQuestions"), where("examId", "==", res.examId)))
      ]);
      setData({ result: res, student: sS.data(), exam: eS.data(), questions: qS.docs.map(d => ({ id: d.id, ...d.data() })) });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [studentExamId]);

  const toggleGrade = async (qId, marks, newStatus) => {
    const currentStatus = data.result.answers?.[qId]?.graded;
    if (currentStatus === newStatus) return;
    if (!window.confirm(`Mark as ${newStatus.toUpperCase()}?`)) return;

    try {
      let scoreChange = 0;
      if (currentStatus !== 'correct' && newStatus === 'correct') scoreChange = marks;
      else if (currentStatus === 'correct' && newStatus !== 'correct') scoreChange = -marks;

      await updateDoc(doc(db, "studentExams", studentExamId), {
        [`answers.${qId}.graded`]: newStatus,
        score: increment(scoreChange)
      });
      toast.success("Result Updated");
      fetchData();
    } catch (err) { toast.error("Error updating score"); }
  };

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-primary border-4" /></div>;

  const { result, student, exam, questions } = data;
  const percentage = ((result.score / (exam?.totalMarks || 1)) * 100).toFixed(1);

  return (
    <div className="container-fluid py-4 px-1 bg-light min-vh-100">

      {/* Top Student Info Bar */}
      <div className="student-header bg-white shadow-sm p-3 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 no-print">
        <div className="d-flex align-items-center gap-3">
          <img src={student?.photoUrl || `https://ui-avatars.com/api/?name=${student?.name}`} className="rounded border shadow-sm" style={{ width: '50px', height: '50px', objectFit: 'cover' }} alt="" />
          <div>
            <h6 className="fw-bold mb-0 text-dark">{student?.name?.toUpperCase()}</h6>
            <small className="text-muted fw-bold">{student?.course} | REG: {student?.regNo}</small>
          </div>
        </div>
        <div className="d-flex gap-4">
          <div className="text-center">
            <h5 className="fw-bold mb-0 text-primary">{result.score} / {exam?.totalMarks}</h5>
            <small className="fw-bold text-muted small">MARKS</small>
          </div>
          <div className="text-center">
            <h5 className={`fw-bold mb-0 ${Number(percentage) >= 40 ? 'text-success' : 'text-danger'}`}>{percentage}%</h5>
            <small className="fw-bold text-muted small">RESULT</small>
          </div>
        </div>
      </div>

      {/* Assessment Grid: PC par 2-Column */}
      {/* --- ASSESSMENT LIST --- */}
      <div className="row g-3 px-md-2">
        {questions.map((q, i) => {
          const ansObj = result.answers?.[q.id];
          const isProg = q.type === 'programming';
          const currentStatus = isProg ? ansObj?.graded : (ansObj === q.correctAnswer ? 'correct' : 'incorrect');
          const studentAns = isProg ? (ansObj?.code || "") : (ansObj || "EMPTY");

          const studentChoiceText = !isProg && ansObj ? q[`option${ansObj}`] : studentAns;
          const correctChoiceText = !isProg ? q[`option${q.correctAnswer}`] : "MANUAL";

          return (
            <div key={q.id} className="col-12 col-md-6 mb-2">
              <div className="card shadow-sm border-0 rounded-0 h-100">

                {/* 1. Header: Question Row */}
                <div className="card-header bg-white p-2 d-flex justify-content-between align-items-start border-bottom">
                  <div className="fw-bold small text-dark lh-sm">
                    <span className="text-primary me-1">Q{i + 1}:</span> {q.question}
                  </div>
                  <div className="d-flex gap-1 flex-shrink-0 align-items-center">
                    {isProg && (
                      <button className="btn btn-dark btn-sm py-0 px-2 rounded-0" style={{ fontSize: '9px' }} onClick={() => setShowCode(showCode === q.id ? null : q.id)}>
                        {showCode === q.id ? 'CLOSE' : 'CODE'}
                      </button>
                    )}
                    <span className="badge bg-light text-dark border rounded-0" style={{ fontSize: '9px' }}>{q.marks}M</span>
                  </div>
                </div>

                {/* 2. Code Viewer (Drawer) */}
                {showCode === q.id && isProg && (
                  <div className="bg-dark p-2">
                    <pre className="m-0 text-white overflow-auto" style={{ maxHeight: '200px', fontSize: '11px' }}>
                      <code dangerouslySetInnerHTML={{ __html: highlight(studentAns, languages[q.language] || languages.js) }} />
                    </pre>
                  </div>
                )}

                {/* 3. Comparison Section (Strictly Inline with Bootstrap Flex) */}
                <div className="d-flex flex-row flex-nowrap align-items-center bg-light p-2 border-top">

                  {/* Student Choice */}
                  <div className="flex-fill min-width-0 px-1 border-end">
                    <span className="text-uppercase text-muted fw-bold" style={{ fontSize: '9px', display: 'block' }}>Student Pick</span>
                    <div className={`text-truncate fw-bold ${currentStatus === 'correct' ? 'text-success' : 'text-danger'}`} style={{ fontSize: '12px' }} title={studentChoiceText}>
                      {isProg ? (ansObj?.code ? '✅ Code' : '❌ Empty') :
                        <>{ansObj || 'Empty'} <small className="fw-normal text-muted">({studentChoiceText})</small></>}
                    </div>
                  </div>

                  {/* Real Answer */}
                  <div className="flex-fill min-width-0 px-2 border-end">
                    <span className="text-uppercase text-muted fw-bold" style={{ fontSize: '9px', display: 'block' }}>Real Ans</span>
                    <div className="text-truncate fw-bold text-primary" style={{ fontSize: '12px' }} title={correctChoiceText}>
                      {isProg ? 'Review' : <>{q.correctAnswer} <small className="fw-normal text-muted">({correctChoiceText})</small></>}
                    </div>
                  </div>

                  {/* Status / Grading Toggle */}
                  <div className="flex-shrink-0 ps-2 text-end" style={{ minWidth: '80px' }}>
                    <span className="text-uppercase text-muted fw-bold" style={{ fontSize: '9px', display: 'block' }}>Status</span>
                    {isProg ? (
                      <div className="btn-group border rounded overflow-hidden shadow-sm" style={{ height: '22px' }}>
                        <button className={`btn btn-sm btn-white p-0 px-2 ${currentStatus === 'correct' ? 'bg-success text-white' : ''}`} onClick={() => toggleGrade(q.id, q.marks, 'correct')}>
                          <i className="bi bi-check-lg" style={{ fontSize: '11px' }}></i>
                        </button>
                        <button className={`btn btn-sm btn-white p-0 px-2 ${currentStatus === 'incorrect' ? 'bg-danger text-white' : ''}`} onClick={() => toggleGrade(q.id, q.marks, 'incorrect')}>
                          <i className="bi bi-x-lg" style={{ fontSize: '11px' }}></i>
                        </button>
                      </div>
                    ) : (
                      <i className={`bi fs-5 ${currentStatus === 'correct' ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}`}></i>
                    )}
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Print Button */}
      <div className="text-center mt-4 no-print">
        <button className="btn btn-outline-dark rounded-0 px-5 fw-bold" onClick={() => window.print()}>
          <i className="bi bi-printer me-2"></i> PRINT REPORT
        </button>
      </div>
    </div>
  );
}