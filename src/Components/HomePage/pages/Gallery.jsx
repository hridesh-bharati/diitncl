import React, { useEffect, useState, useCallback, useMemo, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase/firebase";
import { 
  collection, query, orderBy, onSnapshot, updateDoc, doc, 
  limit, addDoc, serverTimestamp, deleteDoc, arrayUnion, arrayRemove 
} from "firebase/firestore";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../../contexts/AuthContext";

const DownloadButton = lazy(() => import("./Gallery/DownloadButton"));
const LikeButton = lazy(() => import("./Gallery/LikeButton"));

export default function PublicSocialGallery() {
  const { user, isAdmin, isLoggedIn, displayName, photoURL } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState({});
  const [showComments, setShowComments] = useState({});
  const [selectedImg, setSelectedImg] = useState(null);
  const [up, setUp] = useState({ show: false, file: null, preview: "", title: "", loading: false });

  const currentUserId = useMemo(() => user?.uid || (localStorage.getItem("gallery_user_id") || uuidv4()), [user]);
  const navigate = useNavigate();

  // ✨ PERFORMANCE: Cloudinary Auto-Transform (DRY)
  const getOptimizedUrl = useCallback((url, type = "thumb") => {
    if (!url?.includes("cloudinary")) return url;
    const transform = type === "thumb" ? "w_600,h_500,c_fill,g_auto,f_auto,q_auto" : "w_1200,f_auto,q_auto";
    return url.replace("/upload/", `/upload/${transform}/`);
  }, []);

  useEffect(() => {
    localStorage.setItem("gallery_user_id", currentUserId);
    const q = query(collection(db, "galleryImages"), orderBy("createdAt", "desc"), limit(24));
    const unsubscribe = onSnapshot(q, (s) => {
      setPosts(s.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUserId]);

  const updatePost = useCallback((id, data) => updateDoc(doc(db, "galleryImages", id), data), []);

  const handleDelete = async (p) => {
    if (window.confirm("Delete this image?")) {
      await deleteDoc(doc(db, "galleryImages", p.id));
      toast.info("Deleted successfully");
    }
  };

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
        url: secure_url, title: up.title.trim(), uploadedBy: displayName || "Guest",
        uploadedById: currentUserId, userPhoto: photoURL || "", createdAt: serverTimestamp(),
        likes: [], comments: [], downloadCount: 0
      });
      setUp({ show: false, file: null, preview: "", title: "", loading: false });
      toast.success("Uploaded!");
    } catch (e) { toast.error("Upload failed"); setUp(p => ({ ...p, loading: false })); }
  };

  if (loading) return <div className="vh-100 d-flex align-items-center justify-content-center text-danger fw-bold">Loading...</div>;

  return (
    <div className="bg-primary-subtle min-vh-100 pb-5">
      <header className="bg-white border-bottom shadow-sm py-3 mb-3">
        <div className="container d-flex justify-content-between align-items-center">
          <h4 className="fw-bold text-dark m-0">Drishtee <span className="text-danger">Gallery</span></h4>
          <button className={`btn btn-${isLoggedIn ? 'danger' : 'outline-danger'} rounded-pill px-4 fw-bold`}
            onClick={() => isLoggedIn ? setUp(p => ({ ...p, show: true })) : navigate("/login")}>
            {isLoggedIn ? "+ Add Photo" : "Login"}
          </button>
        </div>
      </header>

      <main className="container">
        <div className="row g-3">
          {posts.map((p) => {
            const isLiked = p.likes?.includes(currentUserId);
            return (
              <div key={p.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                  
                  {/* ✨ PC/Mobile Friendly Header with Profile Pic */}
                  <div className="d-flex align-items-center justify-content-between px-3 pt-3 pb-2">
                    <div className="d-flex align-items-center gap-2 overflow-hidden" style={{ maxWidth: '85%' }}>
                      <img
                        src={p.userPhoto || `https://ui-avatars.com/api/?name=${p.uploadedBy}&background=random&color=fff`}
                        className="rounded-circle border shadow-sm flex-shrink-0"
                        width="32" height="32" alt="u" loading="lazy"
                      />
                      <div className="d-flex flex-column overflow-hidden">
                        <h6 className="fw-bold text-dark mb-0 text-truncate" title={p.title} style={{ fontSize: '14px' }}>
                          {p.title}
                        </h6>
                        <small className="text-muted" style={{ fontSize: '10px' }}>
                          by {p.uploadedBy} • {p.createdAt?.toDate().toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                    {(isAdmin || p.uploadedById === currentUserId) && (
                      <i className="bi bi-trash3-fill text-danger cursor-pointer p-1" onClick={() => handleDelete(p)}></i>
                    )}
                  </div>

                  {/* Image Body */}
                  <div className="ratio ratio-4x3 bg-light cursor-zoom-in border-top border-bottom" onClick={() => setSelectedImg(getOptimizedUrl(p.url, "large"))}>
                    <img src={getOptimizedUrl(p.url, "thumb")} className="object-fit-cover w-100 h-100" alt={p.title} loading="lazy" decoding="async" />
                  </div>

                  {/* Actions Area */}
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex gap-3 align-items-center">
                        <Suspense fallback="...">
                          <LikeButton
                            isLiked={isLiked}
                            count={p.likes?.length || 0}
                            onClick={() => updatePost(p.id, { likes: isLiked ? arrayRemove(currentUserId) : arrayUnion(currentUserId) })}
                          />
                        </Suspense>
                        <div className="cursor-pointer text-secondary d-flex align-items-center gap-1" onClick={() => setShowComments(prev => ({ ...prev, [p.id]: !prev[p.id] }))}>
                           <i className={`bi ${showComments[p.id] ? 'bi-chat-fill' : 'bi-chat'} fs-5`}></i>
                           <span className="small fw-bold">{p.comments?.length || 0}</span>
                        </div>
                      </div>
                      <Suspense fallback="...">
                        <DownloadButton imageUrl={p.url} imageId={p.id} filename={p.title} count={p.downloadCount || 0} />
                      </Suspense>
                    </div>

                    {/* Comments Toggle */}
                    {showComments[p.id] && (
                      <div className="mt-3 pt-3 border-top animate-fade-in">
                        <div className="overflow-auto mb-2 custom-scroll" style={{ maxHeight: '180px' }}>
                          {p.comments?.map(c => (
                            <div key={c.commentId} className="bg-light rounded-3 p-2 mb-2 border-start border-danger border-3">
                              <div className="d-flex justify-content-between small fw-bold">
                                <span>{c.userName}</span>
                                {(isAdmin || c.userId === currentUserId) && <i className="bi bi-x-circle text-muted cursor-pointer" onClick={() => updatePost(p.id, { comments: arrayRemove(c) })}></i>}
                              </div>
                              <div className="small text-muted">{c.text}</div>
                            </div>
                          ))}
                        </div>
                        <form className="input-group input-group-sm mt-2" onSubmit={(e) => {
                          e.preventDefault();
                          const t = comment[p.id]?.trim();
                          if(!t) return;
                          updatePost(p.id, { comments: arrayUnion({ text: t, userId: currentUserId, userName: displayName || "Guest", commentId: uuidv4(), createdAt: new Date().toISOString() }) });
                          setComment({...comment, [p.id]: ""});
                        }}>
                          <input className="form-control border-0 bg-light rounded-start-pill px-3 shadow-none" placeholder="Add comment..." value={comment[p.id] || ""} onChange={(e) => setComment({ ...comment, [p.id]: e.target.value })} />
                          <button className="btn btn-danger rounded-end-pill px-3 shadow-none"><i className="bi bi-send-fill"></i></button>
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

      {/* LIGHTBOX */}
      {selectedImg && (
        <div className="fixed-top vh-100 w-100 d-flex align-items-center justify-content-center bg-black bg-opacity-90 z-3 p-2" style={{zIndex: 5000}} onClick={() => setSelectedImg(null)}>
          <img src={selectedImg} className="img-fluid rounded shadow-lg" style={{ maxHeight: '95vh' }} alt="F" />
        </div>
      )}

      {/* UPLOAD MODAL */}
      {up.show && (
        <div className="fixed-top vh-100 w-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75 p-3" style={{ zIndex: 4000 }}>
          <div className="card w-100 shadow-lg border-0 rounded-4" style={{ maxWidth: 450 }}>
            <div className="card-header bg-white border-bottom d-flex justify-content-between py-3 rounded-top-4">
              <h5 className="fw-bold mb-0">Add to Gallery</h5>
              <button className="btn-close" onClick={() => setUp(p => ({ ...p, show: false }))}></button>
            </div>
            <div className="card-body">
              <input type="file" className="form-control mb-3" accept="image/*" onChange={(e) => setUp(p => ({ ...p, file: e.target.files[0], preview: URL.createObjectURL(e.target.files[0]) }))} />
              {up.preview && <img src={up.preview} className="w-100 rounded border mb-3 shadow-sm" style={{ maxHeight: '200px', objectFit: 'contain' }} alt="" />}
              <input className="form-control mb-3 fw-bold shadow-none" placeholder="Image Title" value={up.title} onChange={(e) => setUp(p => ({ ...p, title: e.target.value }))} />
              <button className="btn btn-danger w-100 rounded-pill fw-bold py-2 shadow-sm" onClick={handleUpload} disabled={up.loading}>{up.loading ? "Processing..." : "Publish to Gallery"}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #dc3545; border-radius: 10px; }
        .cursor-zoom-in { cursor: zoom-in; }
        .cursor-pointer { cursor: pointer; }
        .animate-fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}