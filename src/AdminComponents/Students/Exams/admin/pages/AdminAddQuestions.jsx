import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../../../firebase/firebase";
import { collection, query, where, getDocs, doc, writeBatch, serverTimestamp } from "firebase/firestore";
import { useExam } from "../../context/ExamProvider";
import { toast } from "react-toastify";

export default function AdminAddQuestions() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { exams } = useExam();
  const [list, setList] = useState([]);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [q, setQ] = useState({ question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A", marks: 1 });

  const resetForm = () => {
    setQ({ question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A", marks: 1 });
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

  // 🔥 FETCH LOGIC: Language updated to English
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
        toast.success(`${masterData.length} Questions imported successfully!`);
      }
    } catch (err) {
      alert("Fetch Error: " + err.message);
    } finally { setFetching(false); }
  };

  const handleAddOrUpdate = () => {
    if (!q.question || !q.optionA || !q.optionB) return toast.info("Min 2 options required!");
    setList(editingId !== null
      ? list.map((item, i) => (i === editingId ? { ...q } : item))
      : [...list, { ...q }]
    );
    resetForm();
  };

  const handleFinalSave = async () => {
    if (!list.length) return toast.info("List is empty!");
    setLoading(true);
    try {
      const batch = writeBatch(db);

      // 1. Delete old questions
      const oldSnap = await getDocs(query(collection(db, "examQuestions"), where("examId", "==", examId)));
      oldSnap.docs.forEach(d => batch.delete(d.ref));

      // 2. Save to current exam and Master Bank
      list.forEach(item => {
        const { id, ...data } = item;

        const examQRef = doc(collection(db, "examQuestions"));
        batch.set(examQRef, { ...data, examId, updatedAt: serverTimestamp() });

        const masterId = `${exam.course}_${data.question.replace(/\s+/g, '_').substring(0, 20)}`.toLowerCase();
        const masterRef = doc(db, "masterQuestions", masterId);
        batch.set(masterRef, { ...data, course: exam.course, updatedAt: serverTimestamp() });
      });

      await batch.commit();
      navigate("/admin/exams");
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary" /></div>;

  return (
    <div className="container-fluid p-0 bg-light min-vh-100 mb-5 pb-2 mb-lg-0 pb-lg-0">
     <div className="bg-white border-bottom p-2 p-md-3 sticky-top shadow-sm">
  <div className="container-fluid d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
    
    {/* Title Section */}
    <div className="d-flex align-items-center overflow-hidden">
      <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.9rem' }}>
        <i className="bi bi-tools me-2 text-primary"></i>
        BUILDER: {exam?.title} <span className="text-muted small">({exam?.course})</span>
      </h6>
    </div>

    {/* Actions Section */}
    <div className="d-flex justify-content-between align-items-center gap-2">
      <button 
        className="btn btn-warning btn-sm fw-bold rounded-0 shadow-sm flex-grow-1 flex-md-grow-0"
        onClick={fetchFromMasterBank}
        disabled={fetching}
        style={{ fontSize: '0.75rem', padding: '6px 12px' }}
      >
        <i className={`bi ${fetching ? 'spinner-border spinner-border-sm' : 'bi-cloud-download'} me-1`}></i>
        {fetching ? "FETCHING..." : "IMPORT FROM BANK"}
      </button>
      
      <span className="badge bg-dark rounded-0 px-2 py-2 d-flex align-items-center" style={{ fontSize: '0.75rem' }}>
        {list.length} Q's
      </span>
    </div>

  </div>
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
                  <select className="form-select form-select-sm rounded-0 shadow-none" value={q.correctAnswer} onChange={(e) => setQ({ ...q, correctAnswer: e.target.value })}>
                    {["A", "B", "C", "D"].map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
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
            {loading ? 'SAVING DATA...' : 'FINAL SAVE & EXIT'}
          </button>
        </div>
      </div>
    </div>
  );
}