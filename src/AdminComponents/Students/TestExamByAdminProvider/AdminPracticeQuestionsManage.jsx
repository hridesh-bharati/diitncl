import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { db } from "../../../firebase/firebase";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, writeBatch, updateDoc, increment } from "firebase/firestore";
import { toast } from "react-toastify";
import BackButton from "../../../Components/HelperCmp/BackButton/BackButton";

export default function AdminPracticeQuestionsManage() {
    const [searchParams] = useSearchParams();
    const testId = searchParams.get("testId");
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correct, setCorrect] = useState(0);
    const [qList, setQList] = useState([]);
    const [importing, setImporting] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const loadQ = async () => {
        if (!testId) return;
        const q = query(collection(db, "practiceQuestions"), where("testId", "==", testId));
        const snap = await getDocs(q);
        setQList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    useEffect(() => { loadQ(); }, [testId]);

    // JSON Import Logic (Fixing from previous code)
    const handleImportJSON = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (!Array.isArray(data)) return toast.error("Invalid JSON format");
                setImporting(true);
                const batch = writeBatch(db);
                data.forEach((item) => {
                    const correctMap = { "A": 0, "B": 1, "C": 2, "D": 3 };
                    const correctIdx = correctMap[item.correctAnswer?.toUpperCase()] || 0;
                    const newDocRef = doc(collection(db, "practiceQuestions"));
                    batch.set(newDocRef, {
                        testId,
                        question: item.question,
                        options: [item.optionA, item.optionB, item.optionC, item.optionD],
                        correct: correctIdx
                    });
                });
                const testRef = doc(db, "practiceTests", testId);
                batch.update(testRef, { totalQuestions: increment(data.length) });
                await batch.commit();
                toast.success(`${data.length} Questions Imported!`);
                loadQ();
            } catch (err) { toast.error("Error reading JSON"); }
            finally { setImporting(false); e.target.value = null; }
        };
        reader.readAsText(file);
    };

    const startEdit = (q) => {
        setEditingId(q.id);
        setQuestion(q.question);
        setOptions(q.options);
        setCorrect(q.correct);
        window.scrollTo(0, 0);
    };

    const saveQ = async (e) => {
        e.preventDefault();
        if (!question || options.some(o => !o)) return toast.error("Fill all fields");
        try {
            if (editingId) {
                await updateDoc(doc(db, "practiceQuestions", editingId), {
                    question, options, correct: Number(correct)
                });
                toast.success("Updated Successfully");
            } else {
                await addDoc(collection(db, "practiceQuestions"), {
                    testId, question, options, correct: Number(correct)
                });
                await updateDoc(doc(db, "practiceTests", testId), { totalQuestions: increment(1) });
                toast.success("Added Successfully");
            }
            setQuestion(""); setOptions(["", "", "", ""]); setCorrect(0); setEditingId(null); loadQ();
        } catch { toast.error("Operation failed"); }
    };

    const deleteQuestion = async (qId) => {
        if (window.confirm("Delete?")) {
            await deleteDoc(doc(db, "practiceQuestions", qId));
            await updateDoc(doc(db, "practiceTests", testId), { totalQuestions: increment(-1) });
            loadQ();
        }
    };

    if (!testId) return <div className="p-5 text-center text-danger">Invalid Test ID</div>;

    return (
        <div className="container-fluid py-3 bg-light min-vh-100">
            {/* CLEAN HEADER */}
            <div className="d-flex align-items-center justify-content-between mb-3 bg-white p-2 rounded-3 shadow-sm">
                <div className="d-flex align-items-center gap-2">
                    <BackButton />
                    <h6 className="fw-bold mb-0 text-dark d-none d-sm-block">Questions</h6>
                </div>

                <div className="d-flex gap-2">
                    <Link to={`/admin/practice-tests/assign/${testId}`} className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm">
                        <i className="bi bi-person-plus me-1"></i> Assign
                    </Link>

                    <input type="file" accept=".json" id="importJson" hidden onChange={handleImportJSON} />
                    <label htmlFor="importJson" className={`btn btn-dark btn-sm rounded-pill px-3 shadow-sm mb-0 cursor-pointer ${importing ? 'disabled' : ''}`}>
                        {importing ? "..." : <><i className="bi bi-upload me-1"></i> Import</>}
                    </label>
                </div>
            </div>

            {/* FORM CARD */}
            <div className={`card border-0 shadow-sm rounded-4 mb-4 overflow-hidden ${editingId ? 'border-warning border' : ''}`}>
                <div className={`card-header py-2 ${editingId ? 'bg-warning' : 'bg-dark'}`}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className={`${editingId ? 'text-dark' : 'text-white'} mb-0 small fw-bold`}>
                            {editingId ? "Edit Mode" : "New Question"}
                        </h6>
                        <span className="badge bg-white text-dark rounded-pill">Total: {qList.length}</span>
                    </div>
                </div>
                <div className="card-body p-3">
                    <form onSubmit={saveQ}>
                        <textarea
                            className="form-control border-light-subtle bg-light shadow-none mb-3 p-2"
                            rows="2"
                            placeholder="Type question here..."
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                        />

                        <div className="row g-2 mb-3">
                            {options.map((o, i) => (
                                <div className="col-md-6" key={i}>
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-text bg-white border-light-subtle fw-bold text-primary">{String.fromCharCode(65 + i)}</span>
                                        <input
                                            className="form-control border-light-subtle bg-light shadow-none"
                                            value={o}
                                            placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                            onChange={e => {
                                                const newO = [...options]; newO[i] = e.target.value; setOptions(newO);
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="row g-2 align-items-center bg-light p-2 rounded-3 border">
                            <div className="col-7">
                                <select className="form-select form-select-sm border-0 bg-transparent fw-bold shadow-none" value={correct} onChange={e => setCorrect(e.target.value)}>
                                    {options.map((_, i) => <option key={i} value={i}>Correct: {String.fromCharCode(65 + i)}</option>)}
                                </select>
                            </div>
                            <div className="col-5 d-flex gap-1">
                                {editingId && <button type="button" className="btn btn-light btn-sm w-100 rounded-pill" onClick={() => { setEditingId(null); setQuestion(""); setOptions(["", "", "", ""]); }}>Cancel</button>}
                                <button className={`btn ${editingId ? 'btn-warning' : 'btn-dark'} btn-sm w-100 rounded-pill fw-bold`}>
                                    {editingId ? "Update" : "Save"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* LIST SECTION */}
            <div className="row g-2 mb-4 pb-5 mb-lg-0 pb-lg-0">
                {qList.map((q, i) => (
                    /* col-md-6 lagane se PC me 2-2 dikhenge */
                    <div className="col-12 col-md-6" key={q.id}>
                        <div className="card border-0 shadow-sm rounded-3 h-100">
                            <div className="card-body p-2">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="small fw-bold text-dark d-flex gap-2">
                                        <span className="text-primary">{i + 1}.</span>
                                        <span className="text-truncate-2" style={{ maxHeight: '40px', overflow: 'hidden' }}>
                                            {q.question}
                                        </span>
                                    </div>
                                    <div className="d-flex gap-1">
                                        <button className="btn btn-sm py-0 text-primary" onClick={() => startEdit(q)}>
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button className="btn btn-sm py-0 text-danger" onClick={() => deleteQuestion(q.id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="row g-1 mt-2">
                                    {q.options.map((opt, idx) => (
                                        <div className="col-6" key={idx}>
                                            <div className={`px-2 py-1 rounded-2 border ${Number(q.correct) === idx ? 'bg-success-subtle border-success text-success fw-bold' : 'bg-white border-light-subtle text-muted'}`} style={{ fontSize: '11px' }}>
                                                {String.fromCharCode(65 + idx)}. {opt}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}