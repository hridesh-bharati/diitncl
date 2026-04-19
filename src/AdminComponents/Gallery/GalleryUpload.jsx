import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminGalleryManager() {
  const { user, displayName, photoURL } = useAuth();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState("image");
  const [title, setTitle] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const type = selected.type;

    if (type.startsWith("image/")) {
      if (selected.size > 5 * 1024 * 1024)
        return toast.error("Image max 5MB");
      setFileType("image");
    } else if (type.startsWith("video/")) {
      if (selected.size > 50 * 1024 * 1024)
        return toast.error("Video max 50MB");
      setFileType("video");
    } else if (type === "application/pdf") {
      if (selected.size > 10 * 1024 * 1024)
        return toast.error("PDF max 10MB");
      setFileType("pdf");
    } else {
      return toast.error("Only Image / Video / PDF allowed");
    }

    setFile(selected);
  };

  const getCloudinaryUrl = () => {
    if (fileType === "image")
      return "https://api.cloudinary.com/v1_1/draowpiml/image/upload";

    if (fileType === "video")
      return "https://api.cloudinary.com/v1_1/draowpiml/video/upload";

    return "https://api.cloudinary.com/v1_1/draowpiml/raw/upload";
  };

  const handleUpload = async () => {
    if (!title.trim()) return toast.error("Enter title");
    if (!user) return toast.error("Login required");

    if (!file && !externalLink.trim()) {
      return toast.error("Select file or enter link");
    }

    setLoading(true);

    try {
      let mediaUrl = "";
      let mediaType = fileType;

      // FILE UPLOAD
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", "hridesh99!");

        const res = await fetch(getCloudinaryUrl(), {
          method: "POST",
          body: fd,
        });

        const data = await res.json();

        if (!data.secure_url) {
          throw new Error(data.error?.message || "Upload failed");
        }

        mediaUrl = data.secure_url;
      }

      // LINK POST
      if (externalLink.trim()) {
        mediaUrl = externalLink.trim();
        mediaType = "link";
      }

      await addDoc(collection(db, "galleryImages"), {
        url: mediaUrl,
        type: mediaType,
        title: title.trim(),
        uploadedBy: displayName || user.displayName || "Admin",
        uploadedById: user.uid,
        userPhoto: photoURL || user.photoURL || "",
        createdAt: serverTimestamp(),
        likes: [],
        comments: [],
        downloadCount: 0,
      });

      setFile(null);
      setPreview(null);
      setTitle("");
      setExternalLink("");

      toast.success("Published Successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 d-flex justify-content-center">
      <div
        className="bg-white rounded-5 p-4 border shadow-sm w-100"
        style={{ maxWidth: 420 }}
      >
        <h5 className="fw-bold text-center mb-4 text-uppercase">
          Post to Gallery
        </h5>

        {/* File Picker */}
        <label className="d-block mb-3" style={{ cursor: "pointer" }}>
          <input
            type="file"
            hidden
            accept="image/*,video/*,.pdf"
            onChange={handleFileChange}
          />

          <div
            className="bg-light rounded-4 p-3 text-center"
            style={{ border: "2px dashed #dee2e6" }}
          >
            {!preview ? (
              <>
                <i className="bi bi-cloud-arrow-up display-5 text-primary"></i>
                <p className="fw-bold mb-1">Select Image / Video / PDF</p>
                <small className="text-muted">
                  Image 5MB • Video 50MB • PDF 10MB
                </small>
              </>
            ) : fileType === "image" ? (
              <img
                src={preview}
                alt="preview"
                className="w-100 rounded-3"
                style={{ maxHeight: 250, objectFit: "cover" }}
              />
            ) : fileType === "video" ? (
              <video
                src={preview}
                controls
                className="w-100 rounded-3"
                style={{ maxHeight: 250 }}
              />
            ) : (
              <div className="py-4">
                <i className="bi bi-file-earmark-pdf-fill text-danger display-4"></i>
                <p className="mt-2 mb-0 fw-bold">{file?.name}</p>
              </div>
            )}
          </div>
        </label>

        {/* Title */}
        <input
          type="text"
          placeholder="Enter title..."
          className="form-control bg-light border-0 rounded-3 mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Link */}
        <input
          type="text"
          placeholder="Paste YouTube / Drive / Website Link (Optional)"
          className="form-control bg-light border-0 rounded-3 mb-3"
          value={externalLink}
          onChange={(e) => setExternalLink(e.target.value)}
        />

        {/* Button */}
        <button
          className="btn btn-dark w-100 rounded-pill py-2 fw-bold"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? (
            <div
              className="spinner-border spinner-border-sm text-light"
              role="status"
            ></div>
          ) : (
            "Publish Now"
          )}
        </button>
      </div>
    </div>
  );
}