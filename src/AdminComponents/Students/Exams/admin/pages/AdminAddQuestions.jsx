// src\AdminComponents\Students\Exams\admin\pages\AdminAddQuestions.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../../../../../firebase/firebase";
import { collection, query, where, getDocs, doc, writeBatch, serverTimestamp } from "firebase/firestore";
import { useExam } from "../../context/ExamProvider";
import { toast } from "react-toastify";

// Code Editor Imports for Syntax Highlighting
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/themes/prism-tomorrow.css'; 

export default function AdminAddQuestions() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { exams } = useExam();
  const [list, setList] = useState([]);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Updated State to support both MCQ and Programming
  const [q, setQ] = useState({
    question: "",
    type: "mcq", // Default type is MCQ
    language: "javascript", // Default coding language
    optionA: "", optionB: "", optionC: "", optionD: "",
    correctAnswer: "A",
    marks: 1, // Default marks for MCQ
    sampleCode: "" // Optional starter code for students
  });

  const resetForm = () => {
    setQ({
      question: "", type: "mcq", language: "javascript",
      optionA: "", optionB: "", optionC: "", optionD: "",
      correctAnswer: "A", marks: 1, sampleCode: ""
    });
    setEditingId(null);
  };

  useEffect(() => {
    const foundExam = exams.find(e => e.id === examId);
    setExam(foundExam);

    const fetchQs = async () => {
      try {
        const snap = await getDocs(query(collection(db, "examQuestions"), where("examId", "==", examId)));
        setList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchQs();
  }, [examId, exams]);

  // --- Pehle wale saare Features (No Skips) ---

  const handleJsonUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        if (!Array.isArray(jsonData)) return toast.error("Invalid JSON format! Array required.");

        // Basic validation (at least question & type or options)
        const validData = jsonData.filter(item =>
          item.question && (item.type === 'programming' || (item.optionA && item.optionB))
        ).map(item => ({
          type: 'mcq', language: 'javascript', marks: 1, correctAnswer: 'A', // Defaults
          ...item // JSON data overrides defaults
        }));

        if (validData.length === 0) return toast.error("No valid questions found!");
        setList(prev => [...prev, ...validData]);
        toast.success(`${validData.length} Questions Imported!`);
      } catch (err) { toast.error("Invalid JSON File!"); }
    };
    reader.readAsText(file);
  };

  const fetchFromMasterBank = async () => {
    if (!exam?.course) return alert("Course not found!");
    setFetching(true);
    try {
      const qry = query(collection(db, "masterQuestions"), where("course", "==", exam.course));
      const snap = await getDocs(qry);
      const masterData = snap.docs.map(d => {
        const { id, ...rest } = d.data();
        return rest;
      });
      if (masterData.length === 0) {
        alert(`No questions found in Master Bank for: ${exam.course}`);
      } else {
        setList(masterData);
        toast.success(`${masterData.length} Questions imported! Final Save to apply.`);
      }
    } catch (err) { alert("Fetch Error: " + err.message); } finally { setFetching(false); }
  };

  const handleAddOrUpdate = () => {
    if (!q.question) return toast.error("Question is required!");
    if (q.type === 'mcq' && (!q.optionA || !q.optionB)) {
      return toast.error("MCQ needs at least 2 options!");
    }
    // Set coding marks if not set
    if (q.type === 'programming' && q.marks <= 1) {
      q.marks = 10; // Default high marks for programming
    }

    setList(editingId !== null
      ? list.map((item, i) => (i === editingId ? { ...q } : item))
      : [...list, { ...q }]
    );
    resetForm();
  };

  const handleFinalSave = async () => {
    if (!list.length) {
      const confirmEmpty = window.confirm("List is empty. Delete existing questions?");
      if (!confirmEmpty) return;
    }
    const confirmSave = window.confirm("CAUTION: This will OVERRIDE Exam and Master Bank. Continue?");
    if (!confirmSave) return;

    setLoading(true);
    try {
      let batch = writeBatch(db);
      // 1. Delete Old Exam Qs
      const oldExamQs = await getDocs(query(collection(db, "examQuestions"), where("examId", "==", examId)));
      oldExamQs.forEach(d => batch.delete(d.ref));

      // 2. Delete Old Master Bank Qs (Override Logic)
      const oldMasterQs = await getDocs(query(collection(db, "masterQuestions"), where("course", "==", exam.course)));
      oldMasterQs.forEach(d => batch.delete(d.ref));

      await batch.commit(); // Commit deletions first
      batch = writeBatch(db); // New batch for insertions

      // 3. Add New Qs from 'list'
      list.forEach((item) => {
        // Add to examQuestions
        const examQRef = doc(collection(db, "examQuestions"));
        batch.set(examQRef, { ...item, examId, updatedAt: serverTimestamp() });

        // Add to masterQuestions
        const masterRef = doc(collection(db, "masterQuestions"));
        batch.set(masterRef, { ...item, course: exam.course, updatedAt: serverTimestamp() });
      });

      await batch.commit();
      toast.success("Exam and Master Bank Updated!");
      navigate("/admin/exams");
    } catch (err) { toast.error("Save Error: " + err.message); } finally { setLoading(false); }
  };

  // Helper for syntax highlighting in Editor
  const getHighlightFn = (lang) => {
    if (lang === 'javascript') return (code) => highlight(code, languages.js);
    if (lang === 'c') return (code) => highlight(code, languages.c);
    if (lang === 'cpp') return (code) => highlight(code, languages.cpp);
    return (code) => code;
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary" /></div>;

  return (
    <div className="container-fluid p-0 bg-light min-vh-100 mb-5">

      {/* --- TOP HEADER SECTION: BILKUL PEHLE JAISA (NO SKIPS) --- */}
      <div className="bg-white border-bottom p-2 p-md-3 sticky-top shadow-sm">
        <div className="container-fluid d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">

          {/* Title Section */}
          <div className="d-flex align-items-center justify-content-between overflow-hidden">
            <h6 className="fw-bold mb-0 text-truncate me-3">
              <i className="bi bi-tools me-2 text-primary"></i>
              BUILDER: {exam?.title} <span className="text-muted small">({exam?.course})</span>
            </h6>

            <Link to={'/admin/exams'} className="btn btn-sm btn-primary rounded-0 flex-shrink-0">
              <i className="bi bi-house-fill me-1"></i> All Exams
            </Link>
          </div>

          {/* Actions Section */}
          <div className="d-flex justify-content-start align-items-center gap-2 flex-wrap">
            {/* Import from Bank */}
            <button
              className="btn btn-warning btn-sm fw-bold rounded-0 shadow-sm"
              onClick={fetchFromMasterBank}
              disabled={fetching}
            >
              <i className={`bi ${fetching ? 'spinner-border spinner-border-sm' : 'bi-download'} me-1`}></i>
              {fetching ? "FETCHING..." : "IMPORT FROM BANK"}
            </button>

            {/* Upload JSON */}
            <label className="btn btn-info btn-sm fw-bold rounded-0 shadow-sm mb-0">
              <i className="bi bi-filetype-json me-1"></i> JSON
              <input type="file" accept="application/json" hidden onChange={handleJsonUpload} />
            </label>

            {/* Questions Count */}
            <span className="badge bg-dark rounded-0 px-3 py-2 d-flex align-items-center" style={{ fontSize: '0.75rem' }}>
              {list.length} Q's
            </span>
          </div>
        </div>
      </div>
      {/* -------------------------------------------------------- */}

      <div className="container-fluid p-3 bg-light min-vh-100">

        {/* 1. TOP SECTION: FORM (Centered, col-md-8) */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-8">
            <div className="bg-white border p-3 p-md-4 rounded shadow-sm">
              <label className="small fw-bold text-muted mb-2 text-uppercase">
                {editingId !== null ? "Edit Question" : "New Question"}
              </label>

              {/* TYPE TOGGLE */}
              <div className="btn-group w-100 mb-3 rounded-0 shadow-sm">
                <button
                  className={`btn btn-sm ${q.type === 'mcq' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setQ({ ...q, type: 'mcq', marks: 1 })}
                >MCQ (Objective)</button>
                <button
                  className={`btn btn-sm ${q.type === 'programming' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setQ({ ...q, type: 'programming', marks: 10 })}
                >Programming (Practical)</button>
              </div>

              <textarea
                className="form-control rounded-0 mb-3 shadow-none"
                placeholder="Enter Question Statement..."
                value={q.question}
                onChange={e => setQ({ ...q, question: e.target.value })}
                rows="3"
              />

              {/* MCQ Fields */}
              {q.type === 'mcq' && (
                <div className="row g-2 mb-3">
                  {['A', 'B', 'C', 'D'].map(opt => (
                    <div className="col-md-6" key={opt}>
                      <input className="form-control form-control-sm rounded-0 px-2 shadow-none" placeholder={`Option ${opt}`} value={q[`option${opt}`]} onChange={e => setQ({ ...q, [`option${opt}`]: e.target.value })} />
                    </div>
                  ))}
                </div>
              )}

              {/* Programming Fields (Editor) */}
              {q.type === 'programming' && (
                <div className="mb-3">
                  <div className="row g-2 mb-2">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted uppercase">Select Language</label>
                      <select className="form-select form-select-sm rounded-0 shadow-none" value={q.language} onChange={e => setQ({ ...q, language: e.target.value })}>
                        <option value="javascript">JavaScript (JS)</option>
                        <option value="c">C Language</option>
                        <option value="cpp">C++ Language</option>
                      </select>
                    </div>
                  </div>
                  <label className="small fw-bold text-muted uppercase">Starter Code (Optional)</label>
                  <div className="border rounded-0 overflow-hidden">
                    <Editor
                      value={q.sampleCode || ""}
                      onValueChange={code => setQ({ ...q, sampleCode: code })}
                      highlight={getHighlightFn(q.language)}
                      padding={10}
                      style={{ fontFamily: '"Fira code", monospace', fontSize: 12, minHeight: '120px', background: '#f8f9fa' }}
                    />
                  </div>
                </div>
              )}

              <div className="row g-2 mb-3 small">
                {q.type === 'mcq' && (
                  <div className="col-6">
                    <label className="fw-bold text-muted uppercase text-xs">Correct Ans</label>
                    <select className="form-select form-select-sm rounded-0 shadow-none" value={q.correctAnswer} onChange={e => setQ({ ...q, correctAnswer: e.target.value })}>
                      {['A', 'B', 'C', 'D'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                )}
                <div className={q.type === 'mcq' ? 'col-6' : 'col-12'}>
                  <label className="fw-bold text-muted uppercase text-xs">Marks</label>
                  <input type="number" className="form-control form-control-sm rounded-0 shadow-none" value={q.marks} onChange={e => setQ({ ...q, marks: Number(e.target.value) })} />
                </div>
              </div>

              <button className={`btn w-100 rounded-0 fw-bold ${editingId !== null ? 'btn-success' : 'btn-primary'}`} onClick={handleAddOrUpdate}>
                {editingId !== null ? "UPDATE IN LIST" : "ADD TO LIST"}
              </button>
              {editingId !== null && <button className="btn btn-link btn-sm w-100 mt-1 text-muted" onClick={resetForm}>Cancel</button>}
            </div>
          </div>
        </div>

        <hr className="my-3" />

        {/* 2. BOTTOM SECTION: LIST (Full Width col-12, 3 per row) */}
        <div className="row px-md-4">
          <div className="col-12 mb-3 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold m-0">Question Bank ({list.length})</h5>
            {list.length > 0 && (
              <button className="btn btn-dark px-4 rounded-0 fw-bold shadow-sm" onClick={handleFinalSave} disabled={loading}>
                {loading ? 'SAVING...' : 'FINAL SAVE & EXIT'}
              </button>
            )}
          </div>

          <div className="col-12">
            <div className="row g-3">
              {list.map((item, i) => (
                <div key={i} className="col-md-4">
                  <div className={`card h-100 border-0 rounded-0 shadow-sm border-start border-4 ${item.type === 'programming' ? 'border-warning' : 'border-primary'}`}>
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className={`badge rounded-0 ${item.type === 'programming' ? 'bg-warning text-dark' : 'bg-primary'}`} style={{ fontSize: '10px' }}>
                          {item.type.toUpperCase()} | {item.marks} M
                        </span>
                        <div className="d-flex gap-1">
                          <button className="btn btn-xs p-0 px-2 btn-light border rounded-0" onClick={() => { setEditingId(i); setQ(item); window.scrollTo(0, 0); }}>
                            <i className="bi bi-pencil small"></i>
                          </button>
                          <button className="btn btn-xs p-0 px-2 btn-light border rounded-0 text-danger" onClick={() => setList(list.filter((_, idx) => idx !== i))}>
                            <i className="bi bi-trash small"></i>
                          </button>
                        </div>
                      </div>

                      <p className="fw-bold small mb-2 text-truncate-2" style={{ minHeight: '40px' }}>
                        {i + 1}. {item.question}
                      </p>

                      {item.type === 'mcq' ? (
                        <div className="row g-1 mt-1" style={{ fontSize: '11px' }}>
                          {['A', 'B', 'C', 'D'].map(o => (
                            <div key={o} className={`col-6 text-truncate ${item.correctAnswer === o ? 'text-success fw-bold' : 'text-muted'}`}>
                              {o}. {item[`option${o}`]}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-dark text-warning p-1 rounded-0 small font-monospace mt-2 text-center" style={{ fontSize: '11px' }}>
                          <i className="bi bi-code-slash me-1"></i> {item.language.toUpperCase()} MODE
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}