import React, { useEffect, useState } from "react";
import { db } from "../../../firebase/firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc, getDoc } from "firebase/firestore";
import BackButton from "../../../Components/HelperCmp/BackButton/BackButton";

export default function AdminPracticeLive() {
  const [live, setLive] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "practiceResults"), where("status", "==", "Ongoing"));
    const unsub = onSnapshot(q, async (snap) => {
      const list = await Promise.all(snap.docs.map(async (d) => {
        const data = d.data();
        let photo = "";
        let regNo = "N/A";
        const sSnap = await getDoc(doc(db, "admissions", data.studentEmail));
        if (sSnap.exists()) {
          photo = sSnap.data().photoUrl || "";
          regNo = sSnap.data().regNo || "N/A";
        }
        return { id: d.id, name: data.studentName, title: data.testTitle, photo, regNo };
      }));
      setLive(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="p-5 text-center"><div className="spinner-border spinner-border-sm text-danger" /></div>;

  return (
    <div className="container-fluid py-3 bg-light min-vh-100">
      <div className="d-flex align-items-center gap-2 mb-3 px-1">
        <BackButton />
        <h6 className="fw-bold mb-0 text-dark">
          Live Students <span className="badge bg-danger-subtle text-danger rounded-pill ms-1">{live.length}</span>
        </h6>
      </div>

      <div className="row g-2">
        {live.map((s) => (
          <div className="col-12 col-md-4" key={s.id}>
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-2 d-flex align-items-center gap-3">
                <img src={s.photo || `https://ui-avatars.com/api/?name=${s.name}`} className="rounded-circle border" style={{ width: 40, height: 40, objectFit: 'cover' }} alt="" />
                <div className="flex-grow-1 overflow-hidden">
                  <div className="fw-bold small text-dark text-truncate">{s.name}</div>
                  <div className="text-muted text-truncate" style={{ fontSize: '10px' }}>{s.regNo} | {s.title}</div>
                </div>
                <button className="btn btn-link text-danger p-1" onClick={() => window.confirm("Kick?") && deleteDoc(doc(db, "practiceResults", s.id))}>
                  <i className="bi bi-x-circle-fill fs-5"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}