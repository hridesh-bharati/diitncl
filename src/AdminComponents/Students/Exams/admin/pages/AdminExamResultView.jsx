// src\AdminComponents\Students\Exams\admin\pages\AdminExamResultView.jsx
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
  const [extraMarks, setExtraMarks] = useState({ attendance: 0, notes: 0 });

  const fetchData = async () => {
    try {
      const resSnap = await getDoc(doc(db, "studentExams", studentExamId));
      if (!resSnap.exists()) return toast.error("Record not found");
      const res = resSnap.data();

      setExtraMarks({
        attendance: res.attendanceMarks || 0,
        notes: res.notesMarks || 0
      });

      const [sS, eS, qS] = await Promise.all([
        getDoc(doc(db, "admissions", res.studentId)),
        getDoc(doc(db, "exams", res.examId)),
        getDocs(query(collection(db, "examQuestions"), where("examId", "==", res.examId)))
      ]);

      setData({ 
        result: res, 
        student: sS.data(), 
        exam: eS.data(), 
        questions: qS.docs.map(d => ({ id: d.id, ...d.data() })) 
      });
    } catch (err) { 
      console.error(err); 
      toast.error("Error fetching data");
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, [studentExamId]);

  const updateExtraMarks = async () => {
    try {
      await updateDoc(doc(db, "studentExams", studentExamId), {
        attendanceMarks: Number(extraMarks.attendance),
        notesMarks: Number(extraMarks.notes),
      });
      toast.success("Marks Sync Successfully");
      fetchData();
    } catch (err) { toast.error("Update failed"); }
  };

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
      fetchData();
      toast.success("Score Updated");
    } catch (err) { toast.error("Grading failed"); }
  };

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-primary border-4" /></div>;

  const { result, student, exam, questions } = data;
  const totalObtained = (result?.score || 0) + Number(extraMarks.attendance) + Number(extraMarks.notes);
  const grandTotalMarks = (exam?.totalMarks || 0) + 30;
  const percentage = ((totalObtained / grandTotalMarks) * 100).toFixed(1);

  return (
    <div className="container-fluid py-3 px-2 bg-light min-vh-100">
      
      {/* 1. Header Card */}
      <div className="card border-0 shadow-sm rounded-0 mb-3 overflow-hidden">
        <div className="card-body p-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <img src={student?.photoUrl || `https://ui-avatars.com/api/?name=${student?.name}`} className="rounded border shadow-sm" width="55" height="55" style={{objectFit:'cover'}} alt="" />
            <div>
              <h5 className="fw-bold mb-0 text-dark">{student?.name?.toUpperCase()}</h5>
              <p className="mb-0 small text-muted fw-bold text-uppercase">{student?.course} | REG: {student?.regNo}</p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-4 border-start ps-md-4">
            <div className="text-center">
              <h4 className="fw-bold mb-0 text-primary">{totalObtained}</h4>
              <small className="fw-bold text-muted" style={{fontSize:'10px'}}>OBTAINED</small>
            </div>
            <div className="text-center">
              <h4 className={`fw-bold mb-0 ${Number(percentage) >= 40 ? 'text-success' : 'text-danger'}`}>{percentage}%</h4>
              <small className="fw-bold text-muted" style={{fontSize:'10px'}}>RESULT</small>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Internal Marks Bar (Hidden in Print) */}
      <div className="bg-white border rounded shadow-sm p-2 mb-3 no-print d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div className="d-flex gap-3">
              <div className="text-center">
                  <label className="d-block small fw-bold text-muted mb-1">ATTENDANCE (10)</label>
                  <input type="number" className="form-control form-control-sm text-center fw-bold" style={{width:'80px'}} value={extraMarks.attendance} onChange={(e)=>setExtraMarks({...extraMarks, attendance: Math.min(10, e.target.value)})} />
              </div>
              <div className="text-center">
                  <label className="d-block small fw-bold text-muted mb-1">NOTES (20)</label>
                  <input type="number" className="form-control form-control-sm text-center fw-bold" style={{width:'80px'}} value={extraMarks.notes} onChange={(e)=>setExtraMarks({...extraMarks, notes: Math.min(20, e.target.value)})} />
              </div>
          </div>
          <button className="btn btn-dark btn-sm fw-bold px-4 rounded-0" onClick={updateExtraMarks}><i className="bi bi-cloud-upload me-2"></i>SAVE INTERNAL MARKS</button>
      </div>

      {/* 3. Final Result Summary Grid */}
      <div className="row g-2 mb-4 text-center">
          {[
            { label: 'Exam Score', val: result?.score, max: exam?.totalMarks || 70 },
            { label: 'Attendance', val: extraMarks.attendance, max: 10 },
            { label: 'Practical/Notes', val: extraMarks.notes, max: 20 },
            { label: 'Grand Total', val: totalObtained, max: grandTotalMarks, color: 'text-primary' }
          ].map((item, idx) => (
            <div key={idx} className="col-6 col-md-3">
              <div className="bg-white p-2 border shadow-sm h-100">
                <small className="d-block text-muted fw-bold text-uppercase" style={{fontSize:'9px'}}>{item.label}</small>
                <h5 className={`fw-bold mb-0 ${item.color || ''}`}>{item.val} <small className="text-muted" style={{fontSize:'12px'}}>/{item.max}</small></h5>
              </div>
            </div>
          ))}
      </div>

      {/* 4. Assessment List */}
      <div className="row g-2">
        {questions.map((q, i) => {
          const ansObj = result.answers?.[q.id];
          const isProg = q.type === 'programming';
          const currentStatus = isProg ? ansObj?.graded : (ansObj === q.correctAnswer ? 'correct' : 'incorrect');
          const studentAns = isProg ? (ansObj?.code || "") : (ansObj || "NOT ATTEMPTED");

          return (
            <div key={q.id} className="col-12 col-md-6 mb-2">
              <div className={`card shadow-sm border-0 rounded-0 h-100 ${currentStatus === 'correct' ? 'border-start border-4 border-success' : 'border-start border-4 border-danger'}`}>
                <div className="card-header bg-white py-2 px-3 d-flex justify-content-between align-items-center">
                  <div className="fw-bold small text-dark"><span className="text-primary me-2">Q{i+1}</span>{q.question}</div>
                  <span className="badge bg-light text-dark border rounded-0" style={{fontSize:'10px'}}>{q.marks}M</span>
                </div>
                
                <div className="card-body p-2 bg-light">
                    <div className="row g-0 align-items-center text-center">
                        <div className="col border-end px-1">
                            <small className="d-block text-muted fw-bold" style={{fontSize:'9px'}}>STUDENT PICK</small>
                            <div className={`text-truncate small fw-bold ${currentStatus === 'correct' ? 'text-success' : 'text-danger'}`}>{isProg ? (ansObj?.code ? 'VIEW CODE' : 'EMPTY') : (ansObj || 'N/A')}</div>
                        </div>
                        <div className="col border-end px-1">
                            <small className="d-block text-muted fw-bold" style={{fontSize:'9px'}}>CORRECT ANS</small>
                            <div className="text-truncate small fw-bold text-dark">{isProg ? 'MANUAL' : q.correctAnswer}</div>
                        </div>
                        <div className="col px-1">
                           {isProg ? (
                             <div className="btn-group border rounded overflow-hidden">
                               <button className={`btn btn-xs p-1 ${currentStatus === 'correct' ? 'btn-success' : 'btn-light'}`} onClick={() => toggleGrade(q.id, q.marks, 'correct')}><i className="bi bi-check-lg"></i></button>
                               <button className={`btn btn-xs p-1 ${currentStatus === 'incorrect' ? 'btn-danger' : 'btn-light'}`} onClick={() => toggleGrade(q.id, q.marks, 'incorrect')}><i className="bi bi-x-lg"></i></button>
                             </div>
                           ) : (
                             <i className={`bi fs-5 ${currentStatus === 'correct' ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}`}></i>
                           )}
                        </div>
                    </div>
                    {isProg && (
                      <button className="btn btn-dark w-100 btn-sm rounded-0 mt-2 py-1" style={{fontSize:'10px'}} onClick={() => setShowCode(showCode === q.id ? null : q.id)}>
                        {showCode === q.id ? 'HIDE SOURCE CODE' : 'VIEW SOURCE CODE'}
                      </button>
                    )}
                </div>

                {showCode === q.id && isProg && (
                  <div className="bg-dark p-2 overflow-auto" style={{maxHeight:'250px'}}>
                    <pre className="m-0 text-white" style={{fontSize:'11px'}}>
                      <code dangerouslySetInnerHTML={{ __html: highlight(studentAns, languages[q.language] || languages.js) }} />
                    </pre>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center my-5 pb-5 pb-lg-0 no-print">
        <button className="btn btn-outline-dark rounded-0 px-4 fw-bold" onClick={() => window.print()}>
          <i className="bi bi-printer-fill me-2"></i> GENERATE FINAL REPORT
        </button>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .container-fluid { padding: 0 !important; }
          .card { border: 1px solid #eee !important; box-shadow: none !important; }
        }
        .btn-xs { padding: 0.1rem 0.4rem; font-size: 0.75rem; }
      `}</style>
    </div>
  );
}