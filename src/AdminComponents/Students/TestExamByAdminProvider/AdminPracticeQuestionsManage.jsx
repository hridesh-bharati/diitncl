import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { db } from "../../../firebase/firebase";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { toast } from "react-toastify";

export default function AdminPracticeQuestionsManage() {
    const [searchParams] = useSearchParams();
    const testId = searchParams.get("testId");
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correct, setCorrect] = useState(0);
    const [qList, setQList] = useState([]);
    const [importing, setImporting] = useState(false);

    const loadQ = async () => {
        if (!testId) return;
        const q = query(collection(db, "practiceQuestions"), where("testId", "==", testId));
        const snap = await getDocs(q);
        setQList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    useEffect(() => { loadQ(); }, [testId]);

    // JSON Import Logic
    const handleImportJSON = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (!Array.isArray(data)) return toast.error("Invalid JSON format (Array required)");

                setImporting(true);
                const batch = writeBatch(db); // Use Batch for faster upload

                data.forEach((item) => {
                    // Convert A,B,C,D to 0,1,2,3
                    const correctMap = { "A": 0, "B": 1, "C": 2, "D": 3 };
                    const correctIdx = correctMap[item.correctAnswer.toUpperCase()];

                    const newDocRef = doc(collection(db, "practiceQuestions"));
                    batch.set(newDocRef, {
                        testId,
                        question: item.question,
                        options: [item.optionA, item.optionB, item.optionC, item.optionD],
                        correct: correctIdx
                    });
                });

                await batch.commit();
                toast.success(`${data.length} Questions Imported!`);
                loadQ();
            } catch (err) {
                toast.error("Error reading JSON file");
            } finally {
                setImporting(false);
                e.target.value = null; // Reset input
            }
        };
        reader.readAsText(file);
    };

    const saveQ = async (e) => {
        e.preventDefault();
        if (!question || options.some(o => !o)) return toast.error("Fill all fields");
        await addDoc(collection(db, "practiceQuestions"), {
            testId, question, options, correct: Number(correct)
        });
        setQuestion(""); setOptions(["", "", "", ""]); loadQ();
        toast.success("Added Successfully");
    };

    if (!testId) return <div className="p-5 text-center">Invalid Test ID</div>;

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0 text-primary">Manage Questions</h5>
                <div>
                    <input type="file" accept=".json" id="importJson" hidden onChange={handleImportJSON} />
                    <label htmlFor="importJson" className={`btn btn-outline-primary btn-sm rounded-pill px-3 ${importing ? 'disabled' : ''}`}>
                        {importing ? "Importing..." : "📁 Import JSON"}
                    </label>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4 p-4">
                <form onSubmit={saveQ}>
                    <label className="small fw-bold mb-1">Question Text</label>
                    <textarea className="form-control mb-2 shadow-none" rows="2" value={question} onChange={e => setQuestion(e.target.value)} />
                    
                    <div className="row g-2 mb-2">
                        {options.map((o, i) => (
                            <div className="col-md-6" key={i}>
                                <input className="form-control shadow-none" placeholder={`Option ${String.fromCharCode(65 + i)}`} value={o} onChange={e => {
                                    const newO = [...options]; newO[i] = e.target.value; setOptions(newO);
                                }} />
                            </div>
                        ))}
                    </div>

                    <div className="row g-2 align-items-center">
                        <div className="col-md-8">
                            <select className="form-select shadow-none" value={correct} onChange={e => setCorrect(e.target.value)}>
                                {options.map((_, i) => <option key={i} value={i}>Option {String.fromCharCode(65 + i)} is Correct</option>)}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <button className="btn btn-dark w-100 fw-bold shadow-sm">Save Question</button>
                        </div>
                    </div>
                </form>
            </div>

            <h6 className="fw-bold mb-3 px-1 text-muted small">Total Questions: {qList.length}</h6>
            <div className="list-group border-0 shadow-sm rounded-4 overflow-hidden">
                {qList.map((q, i) => (
                    <div key={q.id} className="list-group-item list-group-item-action border-0 border-bottom d-flex justify-content-between align-items-center py-3">
                        <div className="small">
                            <span className="fw-bold text-primary me-2">Q{i + 1}.</span> {q.question}
                        </div>
                        <button className="btn btn-sm btn-light text-danger rounded-circle" onClick={async () => { if(window.confirm("Delete?")) { await deleteDoc(doc(db, "practiceQuestions", q.id)); loadQ(); } }}>
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>
                ))}
                {qList.length === 0 && <div className="p-5 text-center text-muted">No questions added yet.</div>}
            </div>
        </div>
    );
}