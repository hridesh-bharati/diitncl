import React, { useState, useEffect } from "react";
import { db } from "../../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export default function UploadModal({ show, onClose, userDetails }) {
  const { displayName, currentUserId, photoURL } = userDetails;
  
  const initialState = { file: null, preview: "", title: "", loading: false, type: "image" };
  const [up, setUp] = useState(initialState);

  // Cleanup preview URL
  useEffect(() => {
    return () => { if (up.preview) URL.revokeObjectURL(up.preview); };
  }, [up.preview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    let type = "image";
    if (file.type.startsWith("video/")) type = "video";
    else if (file.type === "application/pdf") type = "pdf";

    if (up.preview) URL.revokeObjectURL(up.preview);
    setUp((p) => ({ ...p, file, preview: URL.createObjectURL(file), type }));
  };

  const handleUpload = async () => {
    if (!up.file || !up.title.trim()) return toast.error("Title and File are required!");
    setUp((p) => ({ ...p, loading: true }));

    try {
      const fd = new FormData();
      fd.append("file", up.file);
      fd.append("upload_preset", "hridesh99!");

      const res = await fetch(`https://api.cloudinary.com/v1_1/draowpiml/auto/upload`, { method: "POST", body: fd });
      const data = await res.json();

      if (data.secure_url) {
        await addDoc(collection(db, "galleryImages"), {
          url: data.secure_url,
          title: up.title.trim(),
          type: up.type,
          uploadedBy: displayName || "Guest",
          uploadedById: currentUserId,
          userPhoto: photoURL || "", // Profile pic saved here
          createdAt: serverTimestamp(),
          likes: [],
          reactions: {},
          comments: [],
          downloadCount: 0,
        });

        toast.success("Published to Gallery!");
        resetAndClose();
      }
    } catch (err) {
      toast.error("Upload failed!");
      setUp((p) => ({ ...p, loading: false }));
    }
  };

  const resetAndClose = () => {
    if (up.preview) URL.revokeObjectURL(up.preview);
    setUp(initialState);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed-top vh-100 w-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75 p-3" style={{ zIndex: 4000 }}>
      <div className="card w-100 shadow-lg border-0 rounded-4" style={{ maxWidth: 450 }}>
        <div className="card-header bg-white border-bottom d-flex justify-content-between py-3">
          <h5 className="fw-bold mb-0">Create New Post</h5>
          <button className="btn-close" onClick={resetAndClose} disabled={up.loading}></button>
        </div>
        <div className="card-body">
          <input type="file" className="form-control mb-3 shadow-none" accept="image/*,video/*,.pdf" onChange={handleFileChange} disabled={up.loading} />
          
          {up.preview && (
            <div className="mb-3 text-center border rounded p-2 bg-light">
              {up.type === "pdf" ? (
                <div className="py-2"><i className="bi bi-file-pdf text-danger display-1"></i></div>
              ) : up.type === "video" ? (
                <video src={up.preview} className="w-100 rounded" style={{ maxHeight: "180px" }} muted />
              ) : (
                <img src={up.preview} className="w-100 rounded" style={{ maxHeight: "180px", objectFit: "contain" }} alt="" />
              )}
            </div>
          )}

          <input className="form-control mb-3 fw-bold shadow-none" placeholder="Post Title" value={up.title} onChange={(e) => setUp(p => ({ ...p, title: e.target.value }))} disabled={up.loading} />

          <button className="btn btn-danger w-100 rounded-pill fw-bold py-2 shadow-sm" onClick={handleUpload} disabled={up.loading}>
            {up.loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Posting...</> : "Publish Now"}
          </button>
        </div>
      </div>
    </div>
  );
}