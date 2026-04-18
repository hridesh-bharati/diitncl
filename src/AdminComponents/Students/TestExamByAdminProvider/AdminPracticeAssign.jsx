// src\AdminComponents\Students\TestExamByAdminProvider\AdminPracticeAssign.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase/firebase";
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, onSnapshot, serverTimestamp, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import BackButton from "../../../Components/HelperCmp/BackButton/BackButton";

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
    <div className="container-fluid p-2 bg-light min-vh-100 mb-5 pb-5 mb-lg-0 pb-lg-0">
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        {/* Header Section */}
        <div className="card-header bg-white border-0 py-3 px-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <BackButton />
            <h6 className="fw-bold mb-0 text-dark">Assign Test</h6>
            <div className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
              {filtered.length} Students
            </div>
          </div>

          {/* Title & Search Bar */}
          <div className="text-center mb-3">
            <h5 className="fw-bold text-primary mb-0">{testTitle}</h5>
            <p className="text-muted small">Select students to give access</p>
          </div>

          <div className="position-relative">
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input
              type="text"
              className="form-control form-control-lg rounded-pill border-light bg-light ps-5 shadow-none"
              style={{ fontSize: '14px' }}
              placeholder="Search by name or reg no..."
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* List View (Table se better dikhta hai mobile pe) */}
        <div className="card-body p-0">
          <div className="list-group list-group-flush">
            {filtered.map(s => {
              const isOn = !!assignedMap[s.email?.toLowerCase().trim()];
              return (
                <div key={s.id} className="list-group-item list-group-item-action border-0 px-3 py-2 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    {/* Profile Image with Ring */}
                    <div className="position-relative">
                      <img
                        src={s.photoUrl || `https://ui-avatars.com/api/?name=${s.name}&background=random`}
                        className={`rounded-circle border ${isOn ? 'border-primary' : 'border-light'}`}
                        style={{ width: 42, height: 42, objectFit: 'cover', padding: '2px' }}
                        alt=""
                      />
                      {isOn && <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: 12, height: 12 }}></span>}
                    </div>

                    <div>
                      <div className="fw-bold mb-0 text-dark" style={{ fontSize: '14px' }}>{s.name}</div>
                      <div className="text-muted" style={{ fontSize: '11px' }}>
                        <span className="badge bg-light text-dark fw-normal border">{s.regNo || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input shadow-none cursor-pointer"
                      type="checkbox"
                      role="switch"
                      style={{ width: '40px', height: '20px' }}
                      checked={isOn}
                      onChange={() => toggleAccess(s)}
                    />
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="p-5 text-center text-muted">
                <i className="bi bi-person-exclamation display-4 d-block mb-2"></i>
                No students found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}