import React, { useEffect, useState, useMemo } from "react";
// 1. deleteDoc aur doc import karein
import { collection, onSnapshot, query, where, orderBy, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import StudentCard from "../Students/StudentCard";
import { toast } from "react-toastify"; // Optional: feedback ke liye

const BRANCH_MAP = { Main: "DIIT124", East: "DIIT125" };

const AdmittedList = () => {
  const [students, setStudents] = useState([]);
  const [branchFilter, setBranchFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "admissions"), where("status", "in", ["accepted", "done"]), orderBy("createdAt", "desc"));
    return onSnapshot(q, (s) => {
      setStudents(s.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  // 2. Delete aur Save functions banayein
  const handleDelete = async (emailId) => {
    try {
      await deleteDoc(doc(db, "admissions", emailId));
      toast.success("Record deleted successfully");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete");
    }
  };

  const handleUpdate = async (emailId, updatedData) => {
    try {
      const docRef = doc(db, "admissions", emailId);
      await updateDoc(docRef, updatedData);
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const { filtered, stats } = useMemo(() => {
    let counts = { all: students.length, main: 0, east: 0 };
    const search = searchTerm.toLowerCase();

    const list = students.filter((s) => {
      const bCode = s.branch || s.centerCode;
      if (bCode === BRANCH_MAP.Main) counts.main++;
      if (bCode === BRANCH_MAP.East) counts.east++;

      const matchesBranch = branchFilter === "all" || bCode === BRANCH_MAP[branchFilter];
      const matchesSearch = 
        (s.name || "").toLowerCase().includes(search) || 
        (s.regNo || "").toLowerCase().includes(search) || 
        (s.phone || "").includes(search);

      return matchesBranch && matchesSearch;
    });

    return { filtered: list, stats: counts };
  }, [students, branchFilter, searchTerm]);

  if (loading) return <div className="text-center py-5 text-muted">Loading...</div>;

  return (
    <div className="container-fluid py-4">
      {/* ... (apka baki UI same rahega) ... */}
      <div className="row g-3">
        {filtered.map(s => (
          <div key={s.id} className="col-12 col-sm-6 col-lg-3">
            {/* 3. Yahan functions pass karein */}
            <StudentCard 
                student={s} 
                onDelete={handleDelete} 
                onSave={handleUpdate} 
            />
          </div>
        ))}
        {!filtered.length && <div className="col-12 text-center py-5 text-muted">No students found.</div>}
      </div>
    </div>
  );
};

export default AdmittedList;