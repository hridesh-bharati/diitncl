import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function NotesDownload() {
  const [notes, setNotes] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [thumbnails, setThumbnails] = useState({});

  // Timestamp format karne ka function
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Recent";
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const generateThumbnail = async (pdfUrl, noteId) => {
    try {
      const pdfjsLib = window.pdfjsLib;
      if (!pdfjsLib) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
      }

      const pdf = await window.pdfjsLib.getDocument(pdfUrl).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      const thumbnailUrl = canvas.toDataURL();
      setThumbnails(prev => ({ ...prev, [noteId]: thumbnailUrl }));
    } catch (error) {
      console.error("Error generating thumbnail:", error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesList);
      setLoading(false);

      notesList.forEach(note => {
        if (note.pdfUrl && !thumbnails[note.id]) {
          generateThumbnail(note.pdfUrl, note.id);
        }
      });
    });
    return () => unsubscribe();
  }, []);

  const openPdfViewer = (pdfUrl, title) => {
    setSelectedPdf(pdfUrl);
    setSelectedTitle(title);
    document.body.style.overflow = 'hidden';
  };

  const closePdfViewer = () => {
    setSelectedPdf(null);
    setSelectedTitle("");
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <main className="container-fluid pb-5 pt-3 mb-5 mb-lg-0 bg-light">
        <div>

          <header className="row justify-content-center mb-3">
            <div className="col text-center">
              <div className="p-4 p-md-5 rounded-4 shadow-sm bg-white border border-light position-relative overflow-hidden">
                <div className="position-absolute top-0 start-0 end-0 bg-primary" style={{ height: '5px' }}></div>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 mb-3 fw-semibold text-uppercase tracking-wider" style={{ fontSize: '11px' }}>
                  ⚡ Student Resource Portal
                </span>
                <h1 className="fw-bold mb-3 display-6 tracking-tight px-2" style={{ color: '#1e293b', fontSize: 'calc(1.5rem + 1.5vw)' }}>
                  Drishtee Official <span style={{
                    background: 'linear-gradient(45deg, #0d6efd, #0dcaf0)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: '800'
                  }}>Study Notes</span>
                </h1>

                {/* Premium Subtitle */}
                <p className="text-muted mx-auto mb-4 fs-6 px-2" style={{ maxWidth: '650px', lineHeight: '1.6', fontSize: '14px' }}>
                  Access premium quality curated study materials, lecture PDFs, and notes structured for your academic success.
                </p>

                {/* Dynamic Counter Tags */}
                {!loading && (
                  <div className="d-flex justify-content-center align-items-center gap-2 max-w-100 flex-nowrap px-1">
                    <span className="badge bg-dark rounded-pill px-3 py-2 fw-medium text-truncate" style={{ fontSize: '12px', maxWidth: '50%' }}>
                      Total Materials: {notes.length}
                    </span>
                    <span className="badge bg-success rounded-pill px-3 py-2 fw-medium d-flex align-items-center justify-content-center gap-2 text-truncate" style={{ fontSize: '12px', maxWidth: '50%' }}>
                      <span className="spinner-grow spinner-grow-sm text-light p-0 m-0" style={{ width: '8px', height: '8px', flexShrink: 0 }} role="status"></span>
                      Updated Live
                    </span>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Loading State - Updated to <aside> since it's auxiliary content */}
          {loading && (
            <aside className="text-center py-5" aria-live="polite">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading notes...</p>
            </aside>
          )}

          {/* Empty State - Updated to <aside> */}
          {!loading && notes.length === 0 && (
            <aside className="alert alert-info text-center" role="alert">
              No notes available yet. Please check back later.
            </aside>
          )}

          {/* Notes Grid - Updated wrapper to <section> */}
          {!loading && notes.length > 0 && (
            <section className="row g-4" aria-label="Available Study Notes">
              {notes.map((note) => (
                <div key={note.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                  {/* Card wrapper changed to <article> for self-contained items */}
                  <article
                    className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden"
                    style={{ cursor: 'pointer' }}
                    onClick={() => openPdfViewer(note.pdfUrl, note.title)}
                  >
                    {/* Thumbnail Section */}
                    <div className="position-relative bg-light" style={{ height: '280px', overflow: 'hidden' }}>
                      {thumbnails[note.id] ? (
                        <img
                          src={thumbnails[note.id]}
                          alt={note.title}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover', objectPosition: 'top' }}
                        />
                      ) : (
                        <div className="d-flex align-items-center justify-content-center h-100">
                          <div className="text-center">
                            <div className="spinner-border text-secondary spinner-border-sm" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2 text-muted small">Loading preview...</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="card-body p-3 d-flex flex-column justify-content-between">
                      <div>
                        <h2 className="card-title fw-semibold text-dark mb-1 text-truncate" style={{ fontSize: '1rem' }}>
                          {note.title}
                        </h2>
                        <p className="text-muted mb-2" style={{ fontSize: '12px' }}>
                          📅 Added on: <time dateTime={note.createdAt?.toDate ? note.createdAt.toDate().toISOString() : ""}>{formatTimestamp(note.createdAt)}</time>
                        </p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="badge bg-primary rounded-pill" style={{ fontSize: '11px' }}>Read Online</span>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </section>
          )}
        </div>
      </main>

      {/* PDF Viewer Modal - Updated to <dialog> or <aside> role */}
      {selectedPdf && (
        <aside
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(0,0,0,0.95)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={closePdfViewer}
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Header */}
          <div
            className="bg-white px-4 py-3 d-flex justify-content-between align-items-center border-bottom"
            style={{ flexShrink: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="mb-0 text-primary fw-semibold text-truncate pe-3">
              📖 {selectedTitle || 'PDF Viewer'}
            </h5>
            <button
              className="btn btn-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
              onClick={closePdfViewer}
              style={{ width: '35px', height: '35px', flexShrink: 0 }}
              aria-label="Close PDF Viewer"
            >
              ✕
            </button>
          </div>

          {/* PDF Viewer Body */}
          <div
            className="flex-grow-1 position-relative bg-light overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-100 h-100 d-flex justify-content-center align-items-center p-2 p-md-3">
              <iframe
                src={`${selectedPdf}#toolbar=1&navpanes=1&view=FitH`}
                title="PDF Viewer"
                className="w-100 h-100 border-0 rounded shadow-lg"
                style={{ borderRadius: '8px' }}
                allow="fullscreen"
              />
            </div>
          </div>
        </aside>
      )}
    </>
  );
}