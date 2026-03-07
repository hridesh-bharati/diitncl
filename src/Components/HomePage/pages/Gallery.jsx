import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase/firebase";
import {
  collection, query, orderBy, onSnapshot, updateDoc,
  doc, limit, addDoc, serverTimestamp, deleteDoc,
  arrayUnion, arrayRemove
} from "firebase/firestore";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../../contexts/AuthContext";
import DownloadButton from "./Gallery/DownloadButton";
import LikeButton from "./Gallery/LikeButton";

export default function PublicSocialGallery() {
  const { user, isAdmin, isLoggedIn, displayName, photoURL } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState({});
  const [showComments, setShowComments] = useState({});
  const [selectedImg, setSelectedImg] = useState(null); // Full size image state
  const [up, setUp] = useState({ show: false, file: null, preview: "", title: "", loading: false });

  const currentUserId = user?.uid || (localStorage.getItem("gallery_user_id") || uuidv4());
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("gallery_user_id", currentUserId);
    const q = query(collection(db, "galleryImages"), orderBy("createdAt", "desc"), limit(40));
    return onSnapshot(q, (s) => {
      setPosts(s.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, [currentUserId]);

  const updatePost = (id, data) => updateDoc(doc(db, "galleryImages", id), data);

  const handleUpload = async () => {
    if (!up.file || !up.title.trim()) return toast.error("File & Title required");
    setUp(p => ({ ...p, loading: true }));
    try {
      const fd = new FormData();
      fd.append("file", up.file);
      fd.append("upload_preset", "hridesh99!");
      const res = await fetch("https://api.cloudinary.com/v1_1/draowpiml/image/upload", { method: "POST", body: fd });
      const { secure_url } = await res.json();
      await addDoc(collection(db, "galleryImages"), {
        url: secure_url, title: up.title.trim(), uploadedBy: displayName || "Admin",
        uploadedById: currentUserId, userPhoto: photoURL || "", createdAt: serverTimestamp(),
        likes: [], comments: [], downloadCount: 0
      });
      setUp({ show: false, file: null, preview: "", title: "", loading: false });
      toast.success("Uploaded!");
    } catch (e) { toast.error("Error"); setUp(p => ({ ...p, loading: false })); }
  };

  if (loading) return <div className="vh-100 d-flex align-items-center justify-content-center text-danger fw-bold">Loading Gallery...</div>;

  return (
    <div className="bg-primary-subtle min-vh-100 pb-5 ">
      <header className="bg-white border-bottom shadow-sm py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <h4 className="fw-bold text-dark m-0">Drishtee <span className="text-danger">Gallery</span></h4>
          <button className={`btn btn-${isLoggedIn ? 'danger' : 'outline-danger'} rounded-pill px-4 fw-bold`}
            onClick={() => isLoggedIn ? setUp(p => ({ ...p, show: true })) : navigate("/login")}>
            {isLoggedIn ? "+ Add Photo" : "Login"}
          </button>
        </div>
      </header>

      <main className="container mt-3 mb-5">
        <div className="row g-3">
          {posts.map((p) => {
            const isLiked = p.likes?.includes(currentUserId);
            const commentsOpen = showComments[p.id];

            return (
              <div key={p.id} className="col-12 col-md-6 col-lg-4 mb-2">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">

                  {/* Header: Title & Delete */}
                  <div className="d-flex justify-content-between align-items-center px-3 pt-3">
                    <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ maxWidth: '80%' }} title={p.title}>
                      {p.title}
                    </h6>
                    {(isAdmin || p.uploadedById === currentUserId) && (
                      <button
                        className="btn btn-link text-danger p-0 border-0"
                        onClick={() => window.confirm("Delete this image?") && deleteDoc(doc(db, "galleryImages", p.id))}
                      >
                        <i className="bi bi-trash3-fill"></i>
                      </button>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="d-flex align-items-center px-3 py-2">
                    <img
                      src={p.userPhoto || `https://ui-avatars.com/api/?name=${p.uploadedBy}&background=random`}
                      className="rounded-circle border"
                      width="24"
                      height="24"
                      alt="user"
                    />
                    <small className="text-muted ms-2" style={{ fontSize: '11px' }}>
                      {p.uploadedBy} • {p.createdAt?.toDate().toLocaleDateString()}
                    </small>
                  </div>

                  {/* Photo Section */}
                  <div
                    className="ratio ratio-4x3 bg-light border-top border-bottom cursor-zoom-in position-relative"
                    onClick={() => setSelectedImg(p.url)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      updatePost(p.id, {
                        likes: isLiked ? arrayRemove(currentUserId) : arrayUnion(currentUserId)
                      });
                    }}
                  >
                    <img src={p.url} className="object-fit-cover w-100 h-100" alt={p.title} loading="lazy" />
                  </div>

                  {/* Card Body: Actions & Comments */}
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex gap-3 align-items-center">
                        {/* Like Button */}
                        <LikeButton
                          isLiked={isLiked}
                          count={p.likes?.length || 0}
                          onClick={() => updatePost(p.id, { likes: isLiked ? arrayRemove(currentUserId) : arrayUnion(currentUserId) })}
                        />

                        {/* Comment Toggle */}
                        <div
                          className="cursor-pointer text-secondary d-flex align-items-center gap-1"
                          onClick={() => setShowComments(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                        >
                          <i className={`bi ${showComments[p.id] ? 'bi-chat-fill' : 'bi-chat'} fs-5`}></i>
                          <span className="small fw-bold">{p.comments?.length || 0}</span>
                        </div>
                      </div>

                      {/* Download Button */}
                      <DownloadButton imageUrl={p.url} imageId={p.id} filename={p.title} count={p.downloadCount || 0} />
                    </div>

                    {/* Comments Section */}
                    {showComments[p.id] && (
                      <div className="mt-3 pt-2 border-top">
                        <div
                          className="overflow-auto mb-2 px-1"
                          style={{ maxHeight: '150px', scrollbarWidth: 'thin' }}
                        >
                          {p.comments && p.comments.length > 0 ? (
                            p.comments.map((c) => (
                              <div key={c.commentId} className="bg-light rounded-3 p-2 mb-2 position-relative border-start border-danger border-3">
                                <div className="d-flex justify-content-between">
                                  <span className="fw-bold text-dark" style={{ fontSize: '11px' }}>{c.userName}</span>
                                  {(isAdmin || c.userId === currentUserId) && (
                                    <i
                                      className="bi bi-x-circle-fill text-muted cursor-pointer"
                                      style={{ fontSize: '12px' }}
                                      onClick={() => updatePost(p.id, { comments: arrayRemove(c) })}
                                    ></i>
                                  )}
                                </div>
                                <div className="small text-muted lh-sm">{c.text}</div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-muted small py-2 italic">No comments yet. Be the first!</div>
                          )}
                        </div>

                        {/* Comment Form */}
                        <form
                          className="input-group input-group-sm mt-2"
                          onSubmit={(e) => {
                            e.preventDefault();
                            const text = comment[p.id]?.trim();
                            if (!text) return;
                            updatePost(p.id, {
                              comments: arrayUnion({
                                text,
                                userId: currentUserId,
                                userName: displayName || "Guest",
                                commentId: uuidv4(),
                                createdAt: new Date()
                              })
                            });
                            setComment({ ...comment, [p.id]: "" });
                          }}
                        >
                          <input
                            className="form-control border-0 bg-light rounded-start-pill px-3"
                            placeholder="Add comment..."
                            value={comment[p.id] || ""}
                            onChange={(e) => setComment({ ...comment, [p.id]: e.target.value })}
                          />
                          <button className="btn btn-danger rounded-end-pill px-3">
                            <i className="bi bi-send-fill"></i>
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 1. FULL SIZE IMAGE MODAL (Lightbox) */}
      {selectedImg && (
        <div
          className="fixed-top vh-100 w-100 d-flex align-items-center justify-content-center bg-light bg-opacity-90 z-3 p-2 p-md-5"
          onClick={() => setSelectedImg(null)}
          style={{ cursor: 'zoom-out', zIndex: 3000 }}
        >
          <button className="btn btn-link text-white position-absolute top-0 end-0 m-3 fs-3 text-decoration-none">&times;</button>
          <img src={selectedImg} className="img-fluid rounded shadow-lg" style={{ maxHeight: '90vh', objectFit: 'contain' }} alt="Full Size" />
        </div>
      )}

      {/* Upload Modal */}
      {up.show && (
        <div className="fixed-top vh-100 w-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75 z-3 p-3" style={{ zIndex: 2000 }}>
          <div className="card w-100 shadow-lg border-0 rounded-4" style={{ maxWidth: 450 }}>
            <div className="card-header bg-white border-bottom d-flex justify-content-between py-3 rounded-top-4">
              <h5 className="fw-bold mb-0">Add to Gallery</h5>
              <button className="btn-close" onClick={() => setUp(p => ({ ...p, show: false }))}></button>
            </div>
            <div className="card-body">
              <input type="file" className="form-control mb-3" accept="image/*" onChange={(e) => setUp(p => ({ ...p, file: e.target.files[0], preview: URL.createObjectURL(e.target.files[0]) }))} />
              {up.preview && <img src={up.preview} className="w-100 rounded border mb-3 shadow-sm" style={{ maxHeight: '200px', objectFit: 'contain' }} alt="" />}
              <input className="form-control mb-3 fw-bold" placeholder="Image Title" value={up.title} onChange={(e) => setUp(p => ({ ...p, title: e.target.value }))} />
              <button className="btn btn-danger w-100 rounded-pill fw-bold py-2 shadow-sm" onClick={handleUpload} disabled={up.loading}>{up.loading ? "Processing..." : "Publish to Gallery"}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`.cursor-zoom-in { cursor: zoom-in; }`}</style>
    </div>
  );
}