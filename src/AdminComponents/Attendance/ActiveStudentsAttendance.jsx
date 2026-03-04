import React, { useState, useEffect, useMemo } from "react";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { toast } from "react-toastify";

const AttendanceMark = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: 'present' | 'absent' | 'leave' }
  const [loading, setLoading] = useState(true);
  const [branchFilter, setBranchFilter] = useState("all");

  useEffect(() => {
    const fetchActiveStudents = async () => {
      try {
        // Sirf 'accepted' status waale students ko fetch kar rahe hain (Done waale exclude ho jayenge)
        const q = query(collection(db, "admissions"), where("status", "==", "accepted"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(list);
        
        // Default: Sabko present set kar do starting mein
        const initial = {};
        list.forEach(s => initial[s.id] = 'present');
        setAttendance(initial);
      } catch (error) {
        toast.error("Data load nahi ho paya");
      } finally {
        setLoading(false);
      }
    };
    fetchActiveStudents();
  }, []);

  // Branch wise filtering logic
  const filteredStudents = useMemo(() => {
    if (branchFilter === "all") return students;
    return students.filter(s => (s.branch || s.centerCode) === branchFilter);
  }, [students, branchFilter]);

  const handleStatusChange = (id, status) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const submitAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await addDoc(collection(db, "attendance"), {
        date: today,
        branch: branchFilter,
        records: attendance,
        createdAt: serverTimestamp()
      });
      toast.success("Attendance save ho gayi!");
    } catch (e) {
      toast.error("Error saving data");
    }
  };

  return (
    <div className="container-fluid py-4" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      {/* Heading Section */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold mb-1"> <i className="bi bi-calendar-check me-2"></i>Daily Attendance</h4>
          <p className="text-muted small">Mark attendance for active students only</p>
        </div>
        
        {/* Branch Filter */}
        <select 
          className="form-select w-auto rounded-pill shadow-sm"
          onChange={(e) => setBranchFilter(e.target.value)}
        >
          <option value="all">All Branches</option>
          <option value="DIIT124">Main Branch</option>
          <option value="DIIT125">East Branch</option>
        </select>
      </div>

      <div className="row g-3">
        {loading ? <div className="text-center w-100 p-5">Loading...</div> : 
         filteredStudents.map((s) => (
          <div key={s.id} className="col-12 col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm p-3" style={{ borderRadius: "18px" }}>
              <div className="d-flex align-items-center gap-3">
                <img 
                  src={s.photoUrl || `https://ui-avatars.com/api/?name=${s.name}`} 
                  alt="" 
                  style={{ width: "55px", height: "55px", borderRadius: "15px", objectFit: "cover" }}
                />
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0">{s.name}</h6>
                  <small className="text-primary fw-medium">{s.regNo || "No Reg No"}</small>
                  <div className="text-muted" style={{ fontSize: "11px" }}>{s.course}</div>
                </div>
              </div>

              <hr className="my-3 opacity-10" />

              {/* Attendance Options: Present, Absent, Leave */}
              <div className="d-flex justify-content-between gap-2">
                {['present', 'absent', 'leave'].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleStatusChange(s.id, type)}
                    className={`btn btn-sm flex-grow-1 rounded-pill fw-bold py-2 ${
                      attendance[s.id] === type 
                        ? (type === 'present' ? 'btn-success' : type === 'absent' ? 'btn-danger' : 'btn-warning') 
                        : 'btn-light text-muted'
                    }`}
                    style={{ fontSize: "12px", transition: "0.3s" }}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length > 0 && (
        <div className="text-center mt-5">
          <button 
            className="btn btn-primary px-5 py-3 fw-bold shadow"
            style={{ borderRadius: "15px", background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}
            onClick={submitAttendance}
          >
            Final Submit Attendance
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceMark;