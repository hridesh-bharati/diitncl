import React, { useEffect, useState, useMemo } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  orderBy
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import StudentCard from "../Students/StudentCard";
import { toast } from "react-toastify";

const AdmittedList = () => {
  const [students, setStudents] = useState([]);
  const [branchFilter, setBranchFilter] = useState("all");
  const [loading, setLoading] = useState(true); // ✅ loading state

  // 🔥 Fetch only accepted & done
  useEffect(() => {
    const q = query(
      collection(db, "admissions"),
      where("status", "in", ["accepted", "done"]),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(data);
      setLoading(false); // ✅ data fetched
    });

    return () => unsub();
  }, []);

  // 📊 Branch stats
  const stats = useMemo(() => {
    const total = students.length;
    const main = students.filter(s =>
      (s.branch || s.centerCode) === "DIIT124"
    ).length;
    const east = students.filter(s =>
      (s.branch || s.centerCode) === "DIIT125"
    ).length;
    return { total, main, east };
  }, [students]);

  // 🎯 Filter
  const filtered = useMemo(() => {
    if (branchFilter === "all") return students;
    return students.filter(
      s => (s.branch || s.centerCode) ===
        (branchFilter === "Main" ? "DIIT124" : "DIIT125")
    );
  }, [students, branchFilter]);

  // ✏ Update
  const handleSave = async (id, updates) => {
    try {
      await updateDoc(doc(db, "admissions", id), updates);
    } catch {
      toast.error("Update failed");
    }
  };

  // 🗑 Delete
  const handleDelete = async id => {
    if (!window.confirm("Delete permanently?")) return;
    try {
      await deleteDoc(doc(db, "admissions", id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-center gap-3 text-center text-md-start">
          {/* Title */}
          <h5 className="fw-bold mb-0">
            Admitted Students ({stats.total})
          </h5>
          {/* Filters */}
          <div className="d-flex flex-wrap justify-content-center justify-content-md-end gap-2">
            {["all", "Main", "East"].map((b) => (
              <button
                key={b}
                className={`btn btn-sm rounded-pill ${branchFilter === b
                    ? "btn-primary"
                    : "btn-outline-secondary"
                  }`}
                onClick={() => setBranchFilter(b)}
              >
                {b === "all"
                  ? `All (${stats.total})`
                  : `${b} (${stats[b.toLowerCase()]})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ GRID SYSTEM / Loading */}
      {loading ? (
        <div className="text-center py-5 text-muted">Loading...</div>
      ) : (
        <div className="row g-3">
          {filtered.map(student => (
            <div
              key={student.id}
              className="col-12 col-sm-6 col-lg-4 col-xl-3"
            >
              <StudentCard
                student={student}
                onSave={handleSave}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdmittedList;