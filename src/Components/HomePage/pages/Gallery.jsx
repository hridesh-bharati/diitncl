import React, { useEffect, useState, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase/firebase";
import { collection, query, orderBy, onSnapshot, updateDoc, doc, limit, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { toast } from "react-toastify";
import { useAuth } from "../../../contexts/AuthContext";

// Lazy loading for buttons
const DownloadButton = lazy(() => import("./Gallery/DownloadButton"));
const LikeButton = lazy(() => import("./Gallery/LikeButton"));
import UploadModal from "./GalleryUploadModal";

export default function PublicSocialGallery() {
  const { user, isAdmin, isLoggedIn, displayName, photoURL } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [activeComments, setActiveComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [selectedImg, setSelectedImg] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const navigate = useNavigate();
  const currentUserId = user?.uid || localStorage.getItem("g_id") || "guest";

  useEffect(() => {
    const q = query(collection(db, "galleryImages"), orderBy("createdAt", "desc"), limit(50));
    return onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  const updatePost = (id, data) => updateDoc(doc(db, "galleryImages", id), data);
  const filteredPosts = filterType === "all" ? posts : posts.filter(p => p.type === filterType);
  const getEmoji = (name) => ({ Like: "👍", Love: "❤️", Care: "🥰", Haha: "😆", Wow: "😮", Sad: "😢", Angry: "😡" }[name] || "👍");

  if (loading) return <div className="text-center mt-5 fw-bold text-danger">Loading...</div>;

  return (
    <div className="bg-light min-vh-100 pb-5">
      <nav className="navbar sticky-top bg-white border-bottom shadow-sm px-3 py-2">
        <h4 className="fw-bold m-0">Drishtee <span className="text-danger">Gallery</span></h4>
        <button className="btn btn-danger rounded-pill fw-bold" onClick={() => isLoggedIn ? setShowUploadModal(true) : navigate("/login")}>
          {isLoggedIn ? "+ Add Post" : "Login"}
        </button>
      </nav>

      <div className="container mt-3 d-flex gap-2 overflow-auto pb-2">
        {["all", "image", "video", "pdf"].map(t => (
          <button key={t} onClick={() => setFilterType(t)} className={`btn btn-sm rounded-pill px-3 ${filterType === t ? "btn-danger" : "btn-outline-danger"}`}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <main className="container mt-3">
        <div className="row g-3">
          {filteredPosts.map((p) => {
            const userReaction = p.reactions?.[currentUserId];
            const uniqueReacts = [...new Set(Object.values(p.reactions || {}))];

            return (
              <div key={p.id} className="col-12 col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                  {/* Card Header with User Photo */}
                  <div className="p-3 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2 overflow-hidden">
                      <img 
                        src={p.userPhoto || `https://ui-avatars.com/api/?name=${p.uploadedBy}`} 
                        className="rounded-circle border" 
                        width="32" height="32" 
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${p.uploadedBy}`; }}
                      />
                      <div className="d-flex flex-column">
                        <h6 className="m-0 small fw-bold text-truncate" style={{maxWidth: '150px'}}>{p.title}</h6>
                        <small className="text-muted" style={{fontSize:'10px'}}>by {p.uploadedBy}</small>
                      </div>
                    </div>
                    {(isAdmin || p.uploadedById === currentUserId) && (
                      <i className="bi bi-trash3 text-danger cursor-pointer" onClick={() => window.confirm("Delete?") && deleteDoc(doc(db, "galleryImages", p.id))}></i>
                    )}
                  </div>

                  {/* Media Content */}
                  <div className="bg-black d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
                    {p.type === "video" ? (
                      <video src={p.url} controls className="w-100 h-100 object-fit-cover" />
                    ) : p.type === "pdf" ? (
                      <div className="text-center cursor-pointer" onClick={() => window.open(p.url)}>
                        <i className="bi bi-file-earmark-pdf-fill text-danger display-1"></i>
                        <p className="text-white small">View PDF</p>
                      </div>
                    ) : (
                      <img src={p.url} className="w-100 h-100 object-fit-cover cursor-zoom-in" onClick={() => setSelectedImg(p.url)} alt="" />
                    )}
                  </div>

                  {/* Reaction Stats */}
                  <div className="px-3 py-2 d-flex justify-content-between border-bottom mx-2">
                    <div className="small fw-bold text-muted">
                      {uniqueReacts.slice(0, 3).map(r => getEmoji(r))} {p.likes?.length || 0}
                    </div>
                    <div className="small fw-bold text-muted cursor-pointer" onClick={() => setActiveComments(prev => ({ ...prev, [p.id]: !prev[p.id] }))}>
                      {p.comments?.length || 0} Comments
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="d-flex align-items-center p-1">
                    <Suspense fallback="...">
                      <LikeButton
                        isLiked={!!userReaction}
                        userReaction={userReaction}
                        onClick={(emoji) => {
                          const r = { ...(p.reactions || {}) };
                          if (emoji) {
                            r[currentUserId] = emoji;
                            updatePost(p.id, { likes: arrayUnion(currentUserId), reactions: r });
                          } else {
                            delete r[currentUserId];
                            updatePost(p.id, { likes: arrayRemove(currentUserId), reactions: r });
                          }
                        }}
                      />
                    </Suspense>
                    <button className="btn flex-grow-1 text-muted fw-bold btn-sm" onClick={() => setActiveComments(prev => ({ ...prev, [p.id]: !prev[p.id] }))}>
                      <i className="bi bi-chat-square me-1"></i> Comment
                    </button>
                    <Suspense fallback="...">
                      <DownloadButton imageUrl={p.url} imageId={p.id} count={p.downloadCount || 0} filename={p.title} />
                    </Suspense>
                  </div>

                  {/* Comment Section */}
                  {activeComments[p.id] && (
                    <div className="p-3 bg-light border-top">
                      <div className="overflow-auto mb-2 custom-scroll" style={{ maxHeight: '150px' }}>
                        {p.comments?.map((c, i) => (
                          <div key={i} className="bg-white p-2 rounded shadow-sm mb-2 border-start border-danger border-3">
                            <span className="d-block small fw-bold text-danger">{c.userName}</span>
                            <p className="m-0 small text-dark">{c.text}</p>
                          </div>
                        ))}
                      </div>
                      <div className="input-group input-group-sm">
                        <input className="form-control rounded-pill-start border-0 shadow-none" placeholder="Write..." value={commentText[p.id] || ""} onChange={(e) => setCommentText({...commentText, [p.id]: e.target.value})} />
                        <button className="btn btn-danger rounded-pill-end px-3" onClick={() => {
                          if(!commentText[p.id]?.trim()) return;
                          updatePost(p.id, { comments: arrayUnion({ text: commentText[p.id], userId: currentUserId, userName: displayName || "Guest", id: Date.now() }) });
                          setCommentText({...commentText, [p.id]: ""});
                        }}><i className="bi bi-send-fill"></i></button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <UploadModal show={showUploadModal} onClose={() => setShowUploadModal(false)} userDetails={{ displayName, currentUserId, photoURL }} />
      {selectedImg && <div className="img-overlay" onClick={() => setSelectedImg(null)}><img src={selectedImg} /></div>}

      <style>{`
        .img-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 5000; display: flex; align-items: center; justify-content: center; p: 10px; }
        .img-overlay img { max-width: 95%; max-height: 95%; border-radius: 8px; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
        .cursor-pointer { cursor: pointer; }
        .cursor-zoom-in { cursor: zoom-in; }
        .rounded-pill-start { border-top-left-radius: 50px; border-bottom-left-radius: 50px; }
        .rounded-pill-end { border-top-right-radius: 50px; border-bottom-right-radius: 50px; }
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #dc3545; }
      `}</style>
    </div>
  );
}