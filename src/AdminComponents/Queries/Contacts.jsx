import React, { useState, useEffect, useMemo } from "react";
import { db } from "../../firebase/firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function AdaptiveAdminQueries() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(null);

  // 🔥 Fetch queries
  useEffect(() => {
    const q = query(collection(db, "studentQueries"), orderBy("timestamp", "desc"));
    return onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
          dt: d.data().timestamp?.toDate()
        })));
        setLoading(false);
      },
      () => toast.error("Sync Error")
    );
  }, []);

  // 🔹 Filtered queries
  const filtered = useMemo(() =>
    data.filter(d =>
      filter === "all" ? true
      : filter === "pending" ? d.status !== "reviewed"
      : d.status === "reviewed"
    ), [data, filter]
  );

  const fmt = d =>
    d?.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }) || "Syncing...";

  // 🔹 Toggle status
  const handleToggle = async (q) => {
    try {
      await updateDoc(doc(db, "studentQueries", q.id), {
        status: q.status === "reviewed" ? "pending" : "reviewed"
      });
    } catch { toast.error("Update failed"); }
  };

  // 🔹 Delete query
  const handleRemove = async () => {
    try {
      await deleteDoc(doc(db, "studentQueries", modal.id));
      toast.success("Deleted");
    } catch { toast.error("Delete failed"); }
    setModal(null);
  };

  return (
    <div className="win11-bg py-4 px-2 min-vh-100">
      <div className="container">

        {/* Header */}
        <div className="glass-panel p-4 mb-4 d-flex justify-content-between align-items-center shadow-sm">
          <div>
            <h5 className="fw-bold mb-0 text-dark">Query Inbox</h5>
            <small className="text-primary fw-bold text-uppercase">
              {filtered.length} Requests Found
            </small>
          </div>
          <div className="bg-primary bg-opacity-10 p-2 rounded-circle text-primary">
            <i className="bi bi-chat-square-dots-fill fs-4"></i>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="glass-panel p-2 mb-4 d-flex gap-2 overflow-auto">
          {["all", "pending", "reviewed"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn ${filter === f ? "btn-primary" : "btn-light"} rounded-pill px-4 fw-bold small text-uppercase`}
            >
              {f === "pending" ? "New" : f === "reviewed" ? "Solved" : "All"}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-5 text-muted">Loading...</div>
        ) : (
          <div className="row g-3">
            {filtered.length === 0 && (
              <p className="text-center text-muted py-5">No queries found for this filter.</p>
            )}

            {filtered.map(q => (
              <div className="col-12 col-md-6 col-lg-4" key={q.id}>
                <div className="glass-card p-4 h-100 d-flex flex-column shadow-sm">

                  {/* Timestamp + Status */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <small className="text-muted fw-bold" style={{ fontSize: "11px" }}>{fmt(q.dt)}</small>
                    <span className={`badge rounded-pill ${q.status === "reviewed" ? "bg-success" : "bg-danger"}`}>
                      {q.status === "reviewed" ? "SOLVED" : "NEW"}
                    </span>
                  </div>

                  <h6 className="fw-bold text-dark mb-1">{q.fullName || "Anonymous User"}</h6>
                  <p className="text-secondary small fw-bold mb-2">{q.email || "Support Request"}</p>
                  <p className="text-primary small fw-bold mb-2">{q.title || "Support Request"}</p>
                  <p className="text-muted small flex-grow-1 mb-4">{q.query}</p>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2 mt-auto">
                    <button
                      className="btn btn-light flex-grow-1 rounded-4 text-primary fw-bold"
                      onClick={() => handleToggle(q)}
                    >
                      {q.status === "reviewed" ? "REOPEN" : "RESOLVE"}
                    </button>
                    <button
                      className="btn btn-light rounded-4 text-danger px-3"
                      onClick={() => setModal(q)}
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {modal && (
        <>
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-body text-center p-4">
                  <div className="display-6 text-danger mb-3">
                    <i className="bi bi-exclamation-octagon"></i>
                  </div>
                  <h6 className="fw-bold">Permanently Delete?</h6>
                  <p className="small text-muted mb-4">You cannot undo this action.</p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-light w-100 rounded-pill" onClick={() => setModal(null)}>KEEP</button>
                    <button className="btn btn-danger w-100 rounded-pill fw-bold" onClick={handleRemove}>DELETE</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}