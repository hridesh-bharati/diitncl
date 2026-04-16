import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase/firebase";
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, onSnapshot, serverTimestamp, query, where } from "firebase/firestore";
import { toast } from "react-toastify";

export default function AdminPracticeAssign() {
  const { testId: paramTestId } = useParams(); 
  const [students, setStudents] = useState([]);
  const [assignedMap, setAssignedMap] = useState({});
  const [testTitle, setTestTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoc(doc(db, "practiceTests", paramTestId)).then(s => s.exists() && setTestTitle(s.data().title));
    getDocs(collection(db, "admissions")).then(snap => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(s => s.email && s.status !== "pending"));
      setLoading(false);
    });
    const unsub = onSnapshot(query(collection(db, "practiceAssigned"), where("testId", "==", paramTestId)), (snap) => {
      const map = {};
      snap.forEach(d => map[d.data().studentId?.toLowerCase().trim()] = true);
      setAssignedMap(map);
    });
    return () => unsub();
  }, [paramTestId]);

  const toggleAccess = async (s) => {
    const email = s.email?.toLowerCase().trim();
    const docId = `${email}_${paramTestId}`;
    try {
      if (assignedMap[email]) {
        await deleteDoc(doc(db, "practiceAssigned", docId));
        await deleteDoc(doc(db, "practiceResults", docId));
        toast.info("Removed");
      } else {
        await setDoc(doc(db, "practiceAssigned", docId), { studentId: email, testId: paramTestId, name: s.name, regNo: s.regNo, assignedAt: serverTimestamp() });
        toast.success("Assigned");
      }
    } catch (err) { toast.error("Error"); }
  };

  const filtered = useMemo(() => students.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase())), [students, searchTerm]);

  if (loading) return <div className="text-center p-3 small">Loading...</div>;

  return (
    <div className="container-fluid p-1 bg-light min-vh-100">
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-2">
          <div className="d-flex justify-content-between align-items-center mb-2 gap-2">
            <h6 className="fw-bold mb-0 text-truncate" style={{fontSize: '14px'}}>{testTitle}</h6>
            <input type="text" className="form-control form-control-sm rounded-pill w-auto border-1" placeholder="Search..." onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="table-responsive">
            <table className="table table-sm table-hover align-middle mb-0">
              <thead>
                <tr className="small text-muted" style={{fontSize: '11px'}}>
                  <th className="text-center">ON</th>
                  <th>STUDENT</th>
                  <th className="text-end">REG</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => {
                  const isOn = !!assignedMap[s.email?.toLowerCase().trim()];
                  return (
                    <tr key={s.id} style={{fontSize: '12px'}}>
                      <td className="text-center p-1">
                        <div className="form-check form-switch p-0 m-0 d-inline-block">
                          <input className="form-check-input m-0" type="checkbox" checked={isOn} onChange={() => toggleAccess(s)}/>
                        </div>
                      </td>
                      <td className="p-1">
                        <div className="d-flex align-items-center gap-1">
                          <img src={s.photoUrl || `https://ui-avatars.com/api/?name=${s.name}`} className="rounded-circle" style={{width: 25, height: 25}} alt="" />
                          <div className="text-truncate" style={{maxWidth: '100px'}}><strong>{s.name}</strong></div>
                        </div>
                      </td>
                      <td className="text-end p-1 text-muted" style={{fontSize: '11px'}}>{s.regNo}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}