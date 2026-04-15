import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase/firebase";
import { 
  collection, getDocs, doc, getDoc, setDoc, deleteDoc, 
  onSnapshot, serverTimestamp, query, where 
} from "firebase/firestore";
import { toast } from "react-toastify";

export default function AdminPracticeAssign() {
  const { testId: paramTestId } = useParams(); 
  const [students, setStudents] = useState([]);
  const [assignedMap, setAssignedMap] = useState({});
  const [testTitle, setTestTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paramTestId || paramTestId === "testId") {
        toast.error("Invalid Test ID in URL!");
        return;
    }

    // Load Test Details
    getDoc(doc(db, "practiceTests", paramTestId)).then(s => {
        if(s.exists()) setTestTitle(s.data().title);
    });

    // Load Admitted Students
    getDocs(collection(db, "admissions")).then(snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .filter(s => s.email && s.status !== "pending" && !s.issueDate);
      setStudents(list);
      setLoading(false);
    });

    // Real-time listener
    const q = query(collection(db, "practiceAssigned"), where("testId", "==", paramTestId));
    const unsub = onSnapshot(q, (snap) => {
      const map = {};
      snap.forEach(d => {
        const sId = d.data().studentId;
        if (sId) map[sId.toLowerCase().trim()] = true;
      });
      setAssignedMap(map);
    });
    return () => unsub();
  }, [paramTestId]);

const toggleAccess = async (student) => {
  const email = student.email?.toLowerCase().trim(); 
  if (!email || !paramTestId || paramTestId === "testId") return toast.error("Error!");

  const docId = `${email}_${paramTestId}`; 
  const isAssigned = !!assignedMap[email];

  try {
    const docRef = doc(db, "practiceAssigned", docId);
    const resultRef = doc(db, "practiceResults", docId); // Live session reference

    if (isAssigned) {
      await deleteDoc(docRef); // Access hatao
      await deleteDoc(resultRef); // 🔥 Session band karo (Student kicked)
      toast.info("Access Removed & Test Stopped");
    } else {
        await setDoc(docRef, {
          studentId: email, 
          testId: paramTestId, 
          name: student.name || "",
          regNo: student.regNo || "",
          course: student.course || "",
          status: true,
          assignedAt: serverTimestamp(),
        });
        toast.success("Access Granted!");
      }
  } catch (err) { toast.error("DB Error!"); }
};

  const filtered = useMemo(() => 
    students.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase())), 
  [students, searchTerm]);

  if (loading) return <div className="text-center p-5 mt-5"><div className="spinner-border text-primary" /></div>;

  return (
    <div className="container-fluid p-3 bg-light min-vh-100">
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h5 className="fw-bold mb-0">Assign Practice: <span className="text-primary">{testTitle}</span></h5>
            <input type="text" className="form-control form-control-sm rounded-pill w-auto px-3 border-2" placeholder="Search student..." onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-muted">
                  <th className="text-center">ACCESS</th>
                  <th>STUDENT DETAILS</th>
                  <th className="text-end px-3">REG NO</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => {
                  const emailKey = s.email?.toLowerCase().trim();
                  const isOn = !!assignedMap[emailKey];
                  return (
                    <tr key={s.id}>
                      <td className="text-center">
                        <div className="form-check form-switch d-inline-block">
                          <input className="form-check-input" type="checkbox" checked={isOn} onChange={() => toggleAccess(s)} style={{ width: '2.4em', height: '1.2em', cursor: 'pointer' }} />
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src={s.photoUrl || `https://ui-avatars.com/api/?name=${s.name}`} className="rounded-circle border" style={{ width: 38, height: 38, objectFit: 'cover' }} alt="" />
                          <div>
                            <div className="fw-bold small">{s.name}</div>
                            <small className={isOn ? 'text-success fw-bold' : 'text-muted'}>{isOn ? '● PERMITTED' : '○ NO ACCESS'}</small>
                          </div>
                        </div>
                      </td>
                      <td className="text-end px-3 fw-bold small text-secondary">{s.regNo}</td>
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