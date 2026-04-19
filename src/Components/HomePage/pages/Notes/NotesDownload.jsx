import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function NotesDownload() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "galleryImages"),
      where("type", "==", "pdf")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotes(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // PDF Thumbnail
  const getPdfPreview = (url) => {
    if (!url) return "";
    if (url.includes("cloudinary")) {
      return url
        .replace(/\.pdf$/i, ".jpg")
        .replace("/upload/", "/upload/pg_1,f_auto,q_auto,w_500/");
    }
    return "https://cdn-icons-png.flaticon.com/512/337/337946.png";
  };

  // ✅ Google Viewer Embed
  const getViewerUrl = (url) => {
    return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
      url
    )}`;
  };

  if (loading) {
    return <div className="text-center p-5 fw-bold">Loading Notes...</div>;
  }

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">
        📚 Study <span className="text-danger">Notes</span>
      </h3>

      <div className="row g-4">
        {notes.map((note) => (
          <div className="col-md-4 col-sm-6" key={note.id}>
            <div className="card border-0 shadow rounded-4 h-100 overflow-hidden">

              {/* Thumbnail */}
              <div
                style={{
                  height: "220px",
                  background: "#f8f9fa",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedPdf(note)}
              >
                <img
                  src={getPdfPreview(note.url)}
                  alt="thumb"
                  className="w-100 h-100 object-fit-contain"
                />
              </div>

              {/* Footer */}
              <div className="card-body d-flex justify-content-between align-items-center">
                <h6
                  className="m-0 fw-bold text-truncate"
                  style={{ maxWidth: "180px" }}
                >
                  {note.title}
                </h6>

                <button
                  className="btn btn-danger btn-sm rounded-pill px-3"
                  onClick={() => setSelectedPdf(note)}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPdf && (
        <div
          className="modal fade show d-block"
          style={{
            background: "rgba(0,0,0,.8)",
            zIndex: 9999,
          }}
        >
          <div
            className="modal-dialog modal-xl modal-dialog-centered"
            style={{ maxWidth: "96%" }}
          >
            <div
              className="modal-content rounded-4 overflow-hidden border-0"
              style={{ height: "92vh" }}
            >
              {/* Header */}
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">{selectedPdf.title}</h5>

                <button
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedPdf(null)}
                ></button>
              </div>

              {/* Body */}
              <div className="modal-body p-0 bg-light" style={{ height: "100%" }}>
                <iframe
                  src={getViewerUrl(selectedPdf.url)}
                  title="PDF Viewer"
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                />
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <a
                  href={selectedPdf.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-danger"
                >
                  Open Full
                </a>

                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedPdf(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}