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
  const [myId, setMyId] = useState("");
  const [comment, setComment] = useState({});
  const [showUpload, setShowUpload] = useState(false);
  
  // Upload States
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const currentUserId = user?.uid || myId;
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("gallery_user_id") || uuidv4();
    localStorage.setItem("gallery_user_id", id);
    setMyId(id);

    const q = query(collection(db, "galleryImages"), orderBy("createdAt", "desc"), limit(40));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        likes: doc.data().likes || [],
        comments: doc.data().comments || []
      })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // DELETE POST WITH CONFIRMATION
  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, "galleryImages", postId));
        toast.success("Post delete ho gayi");
      } catch (err) {
        toast.error("Delete fail ho gaya");
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) return toast.error("File & Title required");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "hridesh99!");
      const res = await fetch("https://api.cloudinary.com/v1_1/draowpiml/image/upload", { method: "POST", body: fd });
      const data = await res.json();

      await addDoc(collection(db, "galleryImages"), {
        url: data.secure_url, title: title.trim(),
        uploadedBy: displayName || "Guest", uploadedById: currentUserId,
        userPhoto: photoURL || "", createdAt: serverTimestamp(),
        likes: [], comments: [], downloadCount: 0
      });

      toast.success("Shared!");
      setShowUpload(false); setFile(null); setTitle(""); setPreview("");
    } catch (err) { toast.error("Failed!"); } finally { setUploading(false); }
  };

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-danger"></div></div>;

  return (
    <div className="bg-light min-vh-100 pb-5">
      <header className="bg-white border-bottom sticky-top shadow-sm py-2 px-3 z-index-1000">
        <div className="container d-flex justify-content-between align-items-center">
          <h4 className="fw-bold text-danger m-0">Drishtee Feed</h4>
          {isLoggedIn ? (
            <button className="btn btn-danger rounded-pill px-4 fw-bold shadow-sm" onClick={() => setShowUpload(true)}>+ Post</button>
          ) : (
            <button className="btn btn-primary rounded-pill px-4 fw-bold" onClick={() => navigate("/login")}>Login</button>
          )}
        </div>
      </header>

      <main className="container mt-4">
        <div className="row g-4">
          {posts.map((post) => (
            <div key={post.id} className="col-12 col-lg-6">
              <article className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                
                <div className="p-3 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <img src={post.userPhoto || `https://ui-avatars.com/api/?name=${post.uploadedBy}`} className="rounded-circle border" width="35" height="35" alt="" />
                    <div className="lh-1">
                      <div className="fw-bold small">{post.uploadedBy}</div>
                      <small className="text-muted extra-small">{new Date(post.createdAt).toLocaleDateString()}</small>
                    </div>
                  </div>
                  {(isAdmin || post.uploadedById === currentUserId) && (
                    <button className="btn btn-sm text-danger border-0 p-0" onClick={() => handleDeletePost(post.id)}>
                      <i className="bi bi-trash3 fs-6"></i>
                    </button>
                  )}
                </div>

                <div className="bg-dark d-flex align-items-center justify-content-center post-img-container">
                  <img src={post.url} className="img-fluid" alt={post.title} onDoubleClick={() => {
                    const ref = doc(db, "galleryImages", post.id);
                    updateDoc(ref, { likes: post.likes.includes(currentUserId) ? arrayRemove(currentUserId) : arrayUnion(currentUserId) });
                  }} />
                </div>

                <div className="p-3">
                  <h6 className="fw-bold mb-3">{post.title}</h6>
                  
                  <div className="d-flex align-items-center gap-4 mb-3">
                    <LikeButton isLiked={post.likes.includes(currentUserId)} count={post.likes.length} onClick={() => {
                      const ref = doc(db, "galleryImages", post.id);
                      updateDoc(ref, { likes: post.likes.includes(currentUserId) ? arrayRemove(currentUserId) : arrayUnion(currentUserId) });
                    }} />
                    <div className="d-flex align-items-center gap-1 small fw-bold"><i className="bi bi-chat fs-5"></i> {post.comments.length}</div>
                    <DownloadButton imageUrl={post.url} filename={post.title} />
                  </div>

                  <div className="comments-area mb-3">
                    {post.comments.slice(-2).map((c) => (
                      <div key={c.commentId} className="extra-small mb-1 d-flex align-items-start gap-2">
                        <div className="flex-grow-1 text-break">
                          <span className="fw-bold me-1 text-dark">{c.userName}:</span>
                          <span className="text-secondary">{c.text}</span>
                        </div>
                        {/* COMMENT DELETE WITH CONFIRMATION */}
                        {(isAdmin || c.userId === currentUserId) && (
                          <i className="bi bi-x-circle-fill text-danger opacity-50" 
                             style={{cursor:'pointer', fontSize: 11}} 
                             onClick={() => {
                               if(window.confirm("Ye comment delete karein?")) {
                                 updateDoc(doc(db, "galleryImages", post.id), { comments: arrayRemove(c) });
                               }
                             }}></i>
                        )}
                      </div>
                    ))}
                  </div>

                  <form className="d-flex gap-2" onSubmit={(e) => {
                    e.preventDefault();
                    const text = comment[post.id]?.trim();
                    if(!text) return;
                    updateDoc(doc(db, "galleryImages", post.id), {
                      comments: arrayUnion({ text, userId: currentUserId, userName: displayName || "Guest", commentId: uuidv4(), createdAt: new Date().toISOString() })
                    });
                    setComment({...comment, [post.id]: ""});
                  }}>
                    <input className="form-control form-control-sm border-0 bg-light rounded-pill px-3" placeholder="Write a comment..." value={comment[post.id] || ""} onChange={(e) => setComment({...comment, [post.id]: e.target.value})} />
                    <button className="btn btn-sm btn-danger rounded-circle p-0 d-flex align-items-center justify-content-center" style={{width: 30, height: 30}} type="submit" disabled={!comment[post.id]}><i className="bi bi-send-fill" style={{fontSize: 12}}></i></button>
                  </form>
                </div>
              </article>
            </div>
          ))}
        </div>
      </main>

      {showUpload && (
        <div className="custom-modal-overlay p-3">
          <div className="bg-white p-4 rounded-4 shadow-lg w-100" style={{ maxWidth: '400px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold m-0">Create Post</h5>
              <button className="btn-close" onClick={() => setShowUpload(false)}></button>
            </div>
            <input type="file" className="form-control mb-3" accept="image/*" onChange={(e) => {
              const f = e.target.files[0]; setFile(f);
              if(f) setPreview(URL.createObjectURL(f));
            }} />
            {preview && <img src={preview} className="w-100 rounded-3 mb-3 border" style={{ maxHeight: '180px', objectFit: 'contain' }} alt="" />}
            <input className="form-control mb-4" placeholder="Caption/Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <button className="btn btn-danger w-100 rounded-pill fw-bold py-2" onClick={handleUpload} disabled={uploading}>{uploading ? "Posting..." : "Post Now"}</button>
          </div>
        </div>
      )}

      <style>{`
        .post-img-container { height: 400px; overflow: hidden; }
        .post-img-container img { width: 100%; height: 100%; object-fit: cover; transition: 0.4s; }
        .extra-small { font-size: 11px; }
        .custom-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 10001; }
        @media (max-width: 992px) { .post-img-container { height: 320px; } }
      `}</style>
    </div>
  );
}