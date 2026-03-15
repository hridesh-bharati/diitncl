// src/AdminComponents/Students/Exams/admin/pages/AdminAddQuestions.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../../../firebase/firebase";
import { collection, query, where, getDocs, doc, writeBatch, serverTimestamp } from "firebase/firestore";
import { useExam } from "../../context/ExamProvider";

export default function AdminAddQuestions() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { exams } = useExam();
  const [list, setList] = useState([]);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [q, setQ] = useState({ question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A", marks: 1 });

  const resetForm = () => {
    setQ({ question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A", marks: 1 });
    setEditingId(null);
  };

  useEffect(() => {
    const fetchQs = async () => {
      setExam(exams.find(e => e.id === examId));
      try {
        const snap = await getDocs(query(collection(db, "examQuestions"), where("examId", "==", examId)));
        setList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchQs();
  }, [examId, exams]);

  const handleAddOrUpdate = () => {
    if (!q.question || !q.optionA || !q.optionB) return alert("Min 2 options required!");
    setList(editingId !== null
      ? list.map((item, i) => (i === editingId ? { ...q } : item))
      : [...list, { ...q }]
    );
    resetForm();
  };

  const handleFinalSave = async () => {
    if (!list.length) return alert("No questions!");
    setLoading(true);
    try {
      const batch = writeBatch(db);
      const oldSnap = await getDocs(query(collection(db, "examQuestions"), where("examId", "==", examId)));
      oldSnap.docs.forEach(d => batch.delete(d.ref));
      list.forEach(item => {
        const { id, ...data } = item;
        batch.set(doc(collection(db, "examQuestions")), { ...data, examId, updatedAt: serverTimestamp() });
      });
      await batch.commit();
      navigate("/admin/exams");
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary" /></div>;

  return (
    <div className="container-fluid p-0 bg-light min-vh-100 mb-5 pb-2 mb-lg-0 pb-lg-0">
      <div className="bg-white border-bottom p-3 sticky-top d-flex justify-content-between align-items-center shadow-sm">
        <h6 className="fw-bold mb-0 text-truncate me-2">BUILDER: {exam?.title}</h6>
        <span className="badge bg-dark rounded-0 px-2 py-1">{list.length} Q's</span>
      </div>

      <div className="row g-0">
        <div className="col-lg-6 border-end">
          <div className="p-3 bg-white sticky-lg-top" style={{ top: "65px" }}>
            <div className="border p-3">
              <label className="small fw-bold text-muted mb-1 text-uppercase">{editingId !== null ? "Edit Question" : "New Question"}</label>
              <textarea className="form-control rounded-0 mb-3 shadow-none" placeholder="Enter Question Statement..." value={q.question} onChange={e => setQ({ ...q, question: e.target.value })} rows="2" />

              <div className="row g-2 mb-3">
                {['A', 'B', 'C', 'D'].map(opt => (
                  <div className="col-6" key={opt}>
                    <input className="form-control form-control-sm rounded-0 px-2 shadow-none" placeholder={`Option ${opt}`} value={q[`option${opt}`]} onChange={e => setQ({ ...q, [`option${opt}`]: e.target.value })} />
                  </div>
                ))}
              </div>

              <div className="row g-2 mb-3 small">
                <div className="col-6">
                  <label className="fw-bold text-muted uppercase">Correct Ans</label>
                  <select
                    className="form-select form-select-sm rounded-0 shadow-none"
                    value={q.correctAnswer}
                    onChange={(e) => setQ({ ...q, correctAnswer: e.target.value })}
                  >
                    {["A", "B", "C", "D"].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className="fw-bold text-muted uppercase">Marks</label>
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

        <div className="col-lg-6 p-3">
          {list.map((item, i) => (
            <div key={i} className={`bg-white rounded-4 border-start border-primary border-4 mb-3 p-3 position-relative ${editingId === i ? 'border-primary border-3' : ''}`}>
              <div className="d-flex justify-content-between">
                <p className="fw-bold small mb-2">{i + 1}. {item.question}</p>
                <div className="d-flex gap-1 ms-2">
                  <button className="btn btn-sm btn-light border rounded-0" onClick={() => { setEditingId(i); setQ(item); window.scrollTo(0, 0); }}><i className="bi bi-pencil small"></i></button>
                  <button className="btn btn-sm btn-light border rounded-0 text-danger" onClick={() => setList(list.filter((_, idx) => idx !== i))}><i className="bi bi-trash small"></i></button>
                </div>
              </div>
              <div className="row g-1 mt-1">
                {['A', 'B', 'C', 'D'].map(o => (
                  <div key={o} className={`col-6 small ${item.correctAnswer === o ? 'text-success fw-bold' : 'text-muted'}`}>{o}. {item[`option${o}`]}</div>
                ))}
              </div>
            </div>
          ))}

          <button className="btn btn-dark w-100 py-3 rounded-0 fw-bold mt-2 shadow-sm" onClick={handleFinalSave} disabled={loading}>
            {loading ? 'SAVING...' : 'FINAL SAVE & EXIT'}
          </button>
        </div>
      </div>
    </div>
  );
}