import React, { useState } from "react";
import { toast } from "react-toastify";
import { db } from "../../../../firebase/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export default function DownloadButton({ imageUrl, imageId, filename = "Drishtee_Img", count = 0 }) {
  const [loading, setLoading] = useState(false);

  const download = async () => {
    if (!imageUrl) return toast.error("No image found");
    setLoading(true);

    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename.replace(/\s+/g, '_')}.jpg`;
      link.click();
      window.URL.revokeObjectURL(url);

      // Update count in Firestore
      if (imageId) {
        await updateDoc(doc(db, "galleryImages", imageId), {
          downloadCount: increment(1)
        });
      }
    } catch (err) {
      window.open(imageUrl, '_blank');
    } finally {
      setLoading(false);
    }
  };

  // Number Formatter (1000 -> 1K)
  const format = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="d-flex align-items-center gap-1">
      <button
        onClick={download}
        disabled={loading}
        className="btn btn-link p-1 text-dark border-0 shadow-none d-flex align-items-center justify-content-center"
      >
        {loading ? (
          <div className="spinner-border spinner-border-sm text-primary" role="status" style={{ width: '18px', height: '18px' }}></div>
        ) : (
          <i className="bi bi-download fs-5"></i>
        )}
      </button>
      <span className="small fw-bold text-muted" style={{ minWidth: '20px' }}>
        {format(count)}
      </span>
    </div>
  );
}