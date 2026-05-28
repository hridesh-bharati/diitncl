import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "firebase/firestore";

export default function NotesUpload() {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [uploading, setUploading] = useState(false);
    const [notesList, setNotesList] = useState([]); 

    useEffect(() => {
        const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNotesList(notesData);
        });

        return () => unsubscribe();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !title) return alert("Please enter title and select a PDF file");

        setUploading(true);

        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("upload_preset", "hridesh99!");

            const response = await fetch("https://api.cloudinary.com/v1_1/draowpiml/image/upload", {
                method: "POST",
                body: fd,
            });

            const data = await response.json();

            if (data.secure_url) {
                await addDoc(collection(db, "notes"), {
                    title: title,
                    pdfUrl: data.secure_url,
                    createdAt: serverTimestamp(),
                });

                alert("✅ PDF Uploaded Successfully!");
                setTitle("");
                setFile(null);
                document.getElementById("pdf-file-input").value = "";
            } else {
                alert("Upload failed. Check Cloudinary settings.");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Something went wrong during upload.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (noteId) => {
        if (window.confirm("क्या aap sach me is file ko delete karna chahte hain?")) {
            try {
                await deleteDoc(doc(db, "notes", noteId));
                alert("🗑️ File successfully deleted from database!");
            } catch (error) {
                console.error("Error deleting document:", error);
                alert("Delete failed! (Ensure you are logged in as an Admin)");
            }
        }
    };

    // Timestamp ko readble date-time string me convert karne ka function
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "Just now";
        const date = timestamp.toDate(); 
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="row container-fluid mb-5 mt-2 pb-5 pb-lg-0">
            <div className="col-md-6">
                {/* Upload Form Card */}
                <div className="card shadow-sm border-0 rounded-4 p-4 mb-2">
                    <h4 className="text-center mb-4 fw-bold text-dark">📤 Upload New PDF</h4>
                    <form onSubmit={handleUpload}>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Title *</label>
                            <input
                                type="text"
                                className="form-control rounded-3"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter note title"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-semibold">PDF File *</label>
                            <input
                                id="pdf-file-input"
                                type="file"
                                className="form-control rounded-3"
                                accept="application/pdf"
                                onChange={(e) => setFile(e.target.files[0])}
                                required
                            />
                            {file && (
                                <div className="form-text text-success mt-2 small">
                                    ✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={uploading}
                            className={`btn w-100 py-2.5 fw-bold rounded-3 ${uploading ? "btn-secondary" : "btn-primary"}`}
                        >
                            {uploading ? "Uploading..." : "Upload PDF"}
                        </button>
                    </form>
                </div>
            </div>
            
            <div className="col-md-6">
                {/* Uploaded Files Ki List */}
                <div className="card shadow-sm border-0 rounded-4 p-4">
                    <h5 className="fw-bold text-dark mb-3">📄 Uploaded Notes & PDFs</h5>

                    {notesList.length === 0 ? (
                        <p className="text-muted text-center my-3 small">Koi bhi file uploaded nahi hai.</p>
                    ) : (
                        <div className="list-group list-group-flush">
                            {notesList.map((note) => (
                                <div
                                    key={note.id}
                                    className="list-group-item d-flex justify-content-between align-items-center px-0 py-3"
                                >
                                    <div className="me-3 text-truncate">
                                        <h6 className="mb-0 fw-semibold text-dark text-truncate" style={{ maxWidth: "350px" }}>
                                            {note.title}
                                        </h6>
                                        {/* Added Simple Timestamp Here */}
                                        <div className="text-muted mb-1" style={{ fontSize: '11px' }}>
                                            📅 {formatTimestamp(note.createdAt)}
                                        </div>
                                        <a
                                            href={note.pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="small text-primary text-decoration-none"
                                        >
                                            View PDF
                                        </a>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(note.id)}
                                        className="btn btn-outline-danger btn-sm rounded-3 px-3"
                                        title="Delete File"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}