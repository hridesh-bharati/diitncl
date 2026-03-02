import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function AllPics({ isAdmin = true }) {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "galleryImages"), orderBy("createdAt", "desc"));
    return onSnapshot(q, snap => {
      setGallery(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
  }, []);

  const deleteImg = async (id) => {
    if (!window.confirm("Delete image?")) return;
    try {
      await deleteDoc(doc(db, "galleryImages", id));
      toast.success("Removed");
    } catch {
      toast.error("Failed");
    }
  };

  if (loading) return <div className="text-center py-5"><p>Loading...</p></div>;

  return (
    <div className="p-2">
      <h4 className="fw-900 mb-4" style={{ fontFamily: 'Arial Black' }}>GALLERY</h4>

      <div className="row g-3">
        {gallery.map(item => (
          <div key={item.id} className="col col-sm-6 col-md-4 col-lg-3" >
            <div className="position-relative group">
              <div className="overflow-hidden rounded-4 shadow-sm border bg-white p-1">
                <img
                  src={item.url}
                  className="rounded-3 w-100"
                  style={{ height: '160px', objectFit: 'cover' }}
                />
                <div className="p-2 d-flex justify-content-between align-items-center">
                  <span className="small fw-bold">❤️ {item.likes?.length || 0}</span>
                  <span className="text-muted" style={{ fontSize: '10px' }}>
                    {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : ""}
                  </span>
                </div>
              </div>

              {/* Minimal Delete Button */}
              {isAdmin && (
                <button
                  onClick={() => deleteImg(item.id)}
                  className="btn-dark position-absolute top-0 end-0 m-2 rounded-circle opacity-75 shadow-sm border-0 d-flex align-items-center justify-content-center"
                  style={{ width: '28px', height: '28px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                >
                  <i className="bi bi-trash" style={{ fontSize: '12px' }}></i>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {!gallery.length && <div className="text-center py-5 text-muted">No images found.</div>}
    </div>
  );
}