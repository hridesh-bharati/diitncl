import React, { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import StudentCard from "../Students/StudentCard";

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
      <div className="row g-3 mb-4 align-items-center">
        <div className="col-md-4">
          <h5 className="fw-bold mb-0">Admitted ({stats.all})</h5>
        </div>

        <div className="col-md-4">
          <input
            type="text"
            className="form-control form-control-sm border-0 shadow-sm rounded-pill px-3"
            placeholder="Search name, reg no, or phone..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="col-md-4 text-md-end">
          <div className="btn-group btn-group-sm bg-white shadow-sm rounded-pill p-1">
            {["all", "Main", "East"].map(b => (
              <button 
                key={b} 
                onClick={() => setBranchFilter(b)}
                className={`btn btn-sm rounded-pill border-0 ${branchFilter === b ? "btn-primary" : "btn-light text-muted"}`}
              >
                {b} {b !== "all" ? `(${stats[b.toLowerCase()]})` : ""}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-3">
        {filtered.map(s => (
          <div key={s.id} className="col-12 col-sm-6 col-lg-3">
            <StudentCard student={s} />
          </div>
        ))}
        {!filtered.length && <div className="col-12 text-center py-5 text-muted">No students found.</div>}
      </div>
    </div>
  );
};

export default AdmittedList;