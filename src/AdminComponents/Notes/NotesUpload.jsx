import React, { useState } from 'react';
import { db } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export default function NotesUpload() {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !title.trim()) return toast.error("Please select file and enter title");

        setLoading(true);
        try {
            // 1. Cloudinary Upload Logic
            const fd = new FormData();
            fd.append("file", file);
            fd.append("upload_preset", "hridesh99!"); // Aapka preset

            const res = await fetch(
                "https://api.cloudinary.com/v1_1/draowpiml/auto/upload", // 'auto' for both PDF & Images
                { method: "POST", body: fd }
            );

            const data = await res.json();
            if (!data.secure_url) throw new Error("Cloudinary Upload Failed");

            // 2. Save Link to Firestore
            await addDoc(collection(db, "notes"), {
                title: title.trim(),
                fileUrl: data.secure_url,
                size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
                fileType: file.type,
                createdAt: serverTimestamp(),
            });

            toast.success("Notes Published Successfully!");
            setTitle("");
            setFile(null);
        } catch (error) {
            console.error(error);
            toast.error("Upload failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-3 d-flex justify-content-center">
            <div className="bg-white rounded-5 p-4 border shadow-sm w-100" style={{ maxWidth: 400 }}>
                <h5 className="fw-bold text-center mb-4">UPLOAD NOTES</h5>

                <div className="mb-3">
                    <label className="small fw-bold text-muted ms-1">Note Title</label>
                    <input
                        type="text" className="form-control rounded-3 border-0 bg-light py-2 shadow-none"
                        placeholder="e.g. Tally Prime Chapter 1"
                        value={title} onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="small fw-bold text-muted ms-1">Select Document (PDF/Image)</label>
                    <input
                        type="file" className="form-control rounded-3 border-0 bg-light py-2 shadow-none"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>

                <button
                    className="btn btn-dark w-100 rounded-pill py-2 fw-bold shadow-sm"
                    onClick={handleUpload}
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Publish to Students"}
                </button>
            </div>
        </div>
    );
}