import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

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

  // PDF Viewer URL
  const getViewerUrl = (url) => {
    return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
      url
    )}`;
  };

  if (loading) {
    return (
      <div className="text-center p-5 fw-bold">
        Loading PDFs...
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">
        📚 Notes <span className="text-danger">PDF</span>
      </h3>

      {notes.length === 0 ? (
        <div className="alert alert-warning">
          No PDFs Found
        </div>
      ) : (
        <div className="row g-3">
          {notes.map((note) => (
            <div className="col-md-6" key={note.id}>
              <div className="card shadow border-0 rounded-4 h-100">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold mb-1">
                      📄 {note.title}
                    </h6>
                    <small className="text-muted">
                      {note.uploadedBy || "Admin"}
                    </small>
                  </div>

                  <button
                    className="btn btn-danger rounded-pill px-4"
                    onClick={() =>
                      setSelectedPdf({
                        title: note.title,
                        url: note.url,
                      })
                    }
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedPdf && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,.7)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content rounded-4 overflow-hidden">

              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  {selectedPdf.title}
                </h5>

                <button
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedPdf(null)}
                ></button>
              </div>

              <div className="modal-body p-0">
                <iframe
                  src={getViewerUrl(selectedPdf.url)}
                  width="100%"
                  height="650"
                  title="PDF"
                  style={{ border: "none" }}
                />
              </div>

              <div className="modal-footer">
                <a
                  href={selectedPdf.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-danger"
                >
                  Open New Tab
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