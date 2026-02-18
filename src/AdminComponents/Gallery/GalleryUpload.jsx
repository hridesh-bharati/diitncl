// src/AdminComponents/Gallery/GalleryUpload.jsx
import React, { useState, useEffect } from "react";
import { Button, Spinner, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { db } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminGalleryManager() {
  const { user, displayName, photoURL } = useAuth(); // ✅ ADD photoURL

  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  /* 🔒 SAFE PREVIEW */
  useEffect(() => {
    if (!img) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(img);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [img]);

  const upload = async () => {
    if (!img || !title.trim())
      return toast.error("Image & title required");

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", img);
      fd.append("upload_preset", "hridesh99!");
      fd.append("folder", "gallery");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/draowpiml/image/upload",
        { method: "POST", body: fd }
      );

      const data = await res.json();
      if (!data.secure_url) throw new Error("Upload failed");

      await addDoc(collection(db, "galleryImages"), {
        url: data.secure_url,
        title: title.trim(),
        uploadedBy: displayName || "Admin",
        uploadedById: user?.uid || "admin",
        userPhoto: photoURL || user?.photoURL || "", // ✅ ADD THIS
        createdAt: serverTimestamp(),
        likes: [],
        comments: [],
        downloadCount: 0,
      });

      setImg(null);
      setTitle("");
      toast.success("Uploaded successfully!");
    } catch (err) {
      toast.error(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3">
      <div
        className="bg-white rounded-4 p-3 shadow-sm mx-auto"
        style={{ maxWidth: 400 }}
      >
        {/* 🔹 PREVIEW */}
        <div className="d-flex justify-content-center mb-3">
          <div
            className="bg-light rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 120, height: 120 }}
          >
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-100 h-100 rounded-circle"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <span className="fs-1 text-secondary">📷</span>
            )}
          </div>
        </div>

        {/* 🔹 FILE INPUT */}
        <Form.Control
          type="file"
          accept="image/*"
          className="mb-2 py-2"
          onChange={(e) => setImg(e.target.files[0])}
        />

        {/* 🔹 TITLE INPUT */}
        <Form.Control
          type="text"
          placeholder="Title"
          className="mb-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* 🔹 UPLOAD BUTTON */}
        <Button
          variant="primary"
          className="w-100 rounded-pill d-flex justify-content-center gap-2 fw-bold"
          onClick={upload}
          disabled={loading || !img || !title.trim()}
        >
          {loading ? <Spinner size="sm" /> : "Upload Image"}
        </Button>
      </div>
    </div>
  );
}