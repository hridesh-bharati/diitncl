import React, { useState, useEffect } from "react";
import { Button, Spinner, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { db } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminGalleryManager() {
  const { user, displayName, photoURL } = useAuth();
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-manage Image Preview & Memory Cleanup
  useEffect(() => {
    if (!img) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(img);
    setPreview(url);
    return () => URL.revokeObjectURL(url); // Prevents memory leaks
  }, [img]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Quick Validation
    if (!file.type.startsWith("image/")) return toast.error("Please select an image");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image too large (Max 5MB)");

    setImg(file);
  };

  const handleUpload = async () => {
    if (!img || !title.trim()) return toast.error("Select image & title");
    if (!user) return toast.error("You must be logged in");

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", img);
      fd.append("upload_preset", "hridesh99!");

      // 1. Cloudinary Upload
      const res = await fetch("https://api.cloudinary.com/v1_1/draowpiml/image/upload", {
        method: "POST",
        body: fd
      });

      const data = await res.json();
      if (!data.secure_url) throw new Error(data.error?.message || "Cloudinary Error");

      // 2. Firestore Storage
      await addDoc(collection(db, "galleryImages"), {
        url: data.secure_url,
        title: title.trim(),
        uploadedBy: displayName || user.displayName || "Admin",
        uploadedById: user.uid,
        userPhoto: photoURL || user.photoURL || "",
        createdAt: serverTimestamp(),
        likes: [],
        comments: [],
        downloadCount: 0,
      });

      // Reset
      setImg(null);
      setTitle("");
      toast.success("Media Published Successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 d-flex justify-content-center">
      <div className="ios-upload-card bg-white rounded-5 p-4 border shadow-sm w-100" style={{ maxWidth: 380 }}>
        <h5 className="fw-bold text-center mb-4 text-uppercase" style={{ letterSpacing: '1px' }}>Post to Gallery</h5>

        {/* Interactive Preview Box */}
        <label className="d-block mb-3 cursor-pointer">
          <input type="file" accept="image/*" hidden onChange={handleFileChange} />
          <div className="ratio ratio-1x1 bg-light rounded-4 overflow-hidden border border-dashed d-flex align-items-center justify-content-center"
            style={{ border: '2px dashed #dee2e6', cursor: 'pointer' }}>
            {preview ? (
              <img src={preview} className="object-fit-cover w-100 h-100" alt="Selected" />
            ) : (
              <div className="text-center d-flex flex-column align-items-center justify-content-center text-muted p-3 w-100">
                {/* The Icon */}
                <i className="bi bi-cloud-arrow-up display-4 text-primary opacity-75 mb-2"></i>

                {/* The Text */}
                <p className="small fw-bold mb-0">Click to Select Media</p>
                <span className="text-lowercase opacity-50" style={{ fontSize: '0.75rem' }}>
                  JPG, PNG or GIF (Max 5MB)
                </span>
              </div>
            )}
          </div>
        </label>

        {/* Inputs */}
        <Form.Control
          placeholder="Give it a title..."
          className="border-0 bg-light rounded-3 py-2 mb-3 shadow-none fw-medium"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Button
          variant="dark"
          className="w-100 rounded-pill py-2 fw-bold shadow-sm"
          onClick={handleUpload}
          disabled={loading || !img || !title.trim()}
        >
          {loading ? <Spinner size="sm" /> : "Publish Now"}
        </Button>
      </div>
    </div>
  );
}