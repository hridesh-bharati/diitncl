// src/components/Gallery/DownloadButton.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { db } from "../../../../firebase/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import DownloadCounter from "./DownloadCounter";

export default function DownloadButton({ imageUrl, imageId, filename = "image" }) {
  const [loading, setLoading] = useState(false);

  const download = async () => {
    if (!imageUrl) return toast.error("No image");
    setLoading(true);

    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.jpg`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      if (imageId) {
        await updateDoc(doc(db, "galleryImages", imageId), {
          downloadCount: increment(1)
        });
      }
      toast.success("✓ Downloaded");
    } catch {
      window.open(imageUrl, '_blank');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <button
        onClick={download}
        disabled={loading}
        style={{
          background: 'none',
          border: 'none',
          padding: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: loading ? '#ccc' : '#262626'
        }}
      >
        {loading ? (
          <div style={{ width: '18px', height: '18px', border: '2px solid #ccc', borderTopColor: '#0095f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" strokeLinecap="round" />
            <path d="M12 4v12m0 0l-3-3m3 3l3-3" strokeLinecap="round" />
          </svg>
        )}
      </button>
      <DownloadCounter imageId={imageId} />
    </div>
  );
}

// Add this CSS anywhere in your global styles
const style = document.createElement('style');
style.textContent = `
  @keyframes spin { 
    0% { transform: rotate(0deg); } 
    100% { transform: rotate(360deg); } 
  }
`;
document.head.appendChild(style);