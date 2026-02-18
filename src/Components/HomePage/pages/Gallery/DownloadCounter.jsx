// src/components/Gallery/DownloadCounter.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../../../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function DownloadCounter({ imageId }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!imageId) return;
    const unsub = onSnapshot(doc(db, "galleryImages", imageId), (doc) => {
      if (doc.exists()) setCount(doc.data().downloadCount || 0);
    });
    return () => unsub();
  }, [imageId]);

  const format = (num) => {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num;
  };

  return (
    <span style={{ 
      fontSize: '12px', 
      color: '#8e8e8e',
      fontWeight: '500',
      minWidth: '30px'
    }}>
      {format(count)}
    </span>
  );
}