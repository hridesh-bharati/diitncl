import React, { useEffect, useState, useCallback, useMemo, Suspense, lazy } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../../firebase/firebase";
import { 
  collection, query, orderBy, onSnapshot, updateDoc, doc, 
  limit, deleteDoc, arrayUnion, arrayRemove 
} from "firebase/firestore";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../../contexts/AuthContext";

const DownloadButton = lazy(() => import("./Gallery/DownloadButton"));
const LikeButton = lazy(() => import("./Gallery/LikeButton"));

export default function HomeGallery() {
  const { user, isAdmin, displayName, photoURL } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState({});
  const [showComments, setShowComments] = useState({});
  const navigate = useNavigate();

  const currentUserId = useMemo(() => {
    let id = user?.uid || localStorage.getItem("gallery_user_id");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("gallery_user_id", id);
    }
    return id;
  }, [user]);

  useEffect(() => {
    const q = query(collection(db, "galleryImages"), orderBy("createdAt", "desc"), limit(20));
    
    const unsubscribe = onSnapshot(q, (s) => {
      const fetchedPosts = s.docs.map(d => ({ id: d.id, ...d.data() }));
      
      setPosts(prevPosts => {
        if (prevPosts.length > 0) {
          return prevPosts.map(p => {
            const updatedDoc = fetchedPosts.find(f => f.id === p.id);
            return updatedDoc ? updatedDoc : p;
          });
        }
        
        return fetchedPosts
          .sort(() => Math.random() - 0.5)
          .slice(0, 6);
      });

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updatePost = useCallback((id, data) => updateDoc(doc(db, "galleryImages", id), data), []);

  const handleDelete = async (p) => {
    if (window.confirm("Delete this image?")) {
      try {
        await deleteDoc(doc(db, "galleryImages", p.id));
        toast.info("Deleted successfully");
      } catch (e) {
        toast.error("Error deleting image");
      }
    }
  };

  // Optimization: Added type parameter for better sizing control
  const getOptimizedUrl = useCallback((url, type = "post") => {
    if (!url?.includes("cloudinary")) return url;
    // Specifically limit avatar size to 100px for performance
    if (type === "avatar") {
      return url.replace("/upload/", `/upload/w_100,h_100,c_fill,g_face,f_auto,q_auto/`);
    }
    return url.replace("/upload/", `/upload/w_600,h_500,c_fill,g_auto,f_auto,q_auto/`);
  }, []);

  const getEmoji = (name) => {
    const emojis = { Like: "👍", Love: "❤️", Care: "🥰", Haha: "😆", Wow: "😮", Sad: "😢", Angry: "😡" };
    return emojis[name] || "👍";
  };

  if (loading) return <div className="text-center py-5 text-danger fw-bold">Loading Gallery...</div>;

  return (
    <div className="container-fluid py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0">Featured <span className="text-danger">Captures</span></h2>
          <p className="text-muted small m-0">Discover something new today</p>
        </div>
        <Link to="/gallery" className="btn btn-outline-danger rounded-pill px-4 fw-bold">View All</Link>
      </div>

      <div className="row g-4">
        {posts.map((p, index) => {
          const userReaction = p.reactions?.[currentUserId] || null;
          const isLiked = !!userReaction;
          const uniqueReacts = [...new Set(Object.values(p.reactions || {}))];

          return (
            <div key={p.id} className="col-12 col-md-6 col-lg-4 mx-0 p-1">
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white animate-fade-in">
                
                <div className="p-3 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2 overflow-hidden" style={{ maxWidth: '80%' }}>
                    {/* Avatar Optimization applied here */}
                    <img 
                      src={p.userPhoto ? getOptimizedUrl(p.userPhoto, "avatar") : `https://ui-avatars.com/api/?name=${p.uploadedBy}&background=random`} 
                      className="rounded-circle border" 
                      width="32" 
                      height="32" 
                      alt="u" 
                      loading="lazy" 
                    />
                    <div className="d-flex flex-column overflow-hidden">
                      <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: '14px' }}>{p.title}</h6>
                      <small className="text-muted" style={{ fontSize: '10px' }}>by {p.uploadedBy}</small>
                    </div>
                  </div>

                  {(isAdmin || p.uploadedById === currentUserId) && (
                    <button 
                      className="btn btn-link text-danger p-0 border-0 shadow-none" 
                      onClick={() => handleDelete(p)}
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  )}
                </div>

                <div className="post-media position-relative bg-black" style={{ height: '280px', minHeight: '280px' }}>
                    {/* Main Image LCP Optimization applied here */}
                    <img 
                      src={getOptimizedUrl(p.url)} 
                      className="w-100 h-100 object-fit-contain cursor-pointer" 
                      alt={p.title} 
                      onClick={() => navigate("/gallery")}
                      loading={index <= 1 ? "eager" : "lazy"}
                      fetchpriority={index <= 1 ? "high" : "auto"}
                      width="600"
                      height="500"
                    />
                </div>

                <div className="px-3 py-2 d-flex justify-content-between align-items-center border-bottom mx-2">
                  <div className="d-flex align-items-center gap-1">
                    {uniqueReacts.slice(0, 3).map((r, i) => (
                      <span key={i} style={{ fontSize: '13px', marginLeft: i > 0 ? '-5px' : '0' }}>{getEmoji(r)}</span>
                    ))}
                    <span className="small fw-bold text-muted ms-1">{p.likes?.length || 0}</span>
                  </div>
                  <div className="small text-muted cursor-pointer fw-bold" onClick={() => setShowComments(prev => ({ ...prev, [p.id]: !prev[p.id] }))}>
                    {p.comments?.length || 0} Comments
                  </div>
                </div>

                <div className="card-body p-1 d-flex">
                  <Suspense fallback="...">
                    <LikeButton
                      isLiked={isLiked}
                      userReaction={userReaction}
                      onClick={(reactionName) => {
                        const r = { ...(p.reactions || {}) };
                        if (reactionName) {
                          r[currentUserId] = reactionName;
                          updatePost(p.id, { likes: arrayUnion(currentUserId), reactions: r });
                        } else {
                          delete r[currentUserId];
                          updatePost(p.id, { likes: arrayRemove(currentUserId), reactions: r });
                        }
                      }}
                    />
                  </Suspense>
                  <button className="btn flex-grow-1 border-0 text-muted fw-bold btn-sm" onClick={() => setShowComments(prev => ({ ...prev, [p.id]: !prev[p.id] }))}>
                    <i className="bi bi-chat-square me-1"></i> Comment
                  </button>
                  <Suspense fallback="...">
                    <DownloadButton imageUrl={p.url} imageId={p.id} count={p.downloadCount || 0} />
                  </Suspense>
                </div>

                {showComments[p.id] && (
                  <div className="px-3 pb-3 border-top pt-2 animate-fade-in">
                    <div className="overflow-auto mb-2 custom-scroll" style={{ maxHeight: '150px' }}>
                      {p.comments?.map(c => (
                        <div key={c.commentId} className="bg-light rounded-3 p-2 mb-2 border-start border-danger border-3 shadow-xs">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold" style={{ fontSize: '11px' }}>{c.userName}</span>
                            {(isAdmin || c.userId === currentUserId) && (
                              <i className="bi bi-x-circle text-muted cursor-pointer hover-danger" onClick={() => updatePost(p.id, { comments: arrayRemove(c) })}></i>
                            )}
                          </div>
                          <div className="small text-muted" style={{ fontSize: '12px' }}>{c.text}</div>
                        </div>
                      ))}
                    </div>
                    <form className="input-group input-group-sm" onSubmit={(e) => {
                      e.preventDefault();
                      const t = comment[p.id]?.trim();
                      if(!t) return;
                      updatePost(p.id, { 
                        comments: arrayUnion({ text: t, userId: currentUserId, userName: displayName || "Guest", commentId: uuidv4(), createdAt: new Date().toISOString() }) 
                      });
                      setComment({...comment, [p.id]: ""});
                    }}>
                      <input className="form-control border-0 bg-light rounded-start-pill px-3 shadow-none" placeholder="Add comment..." value={comment[p.id] || ""} onChange={(e) => setComment({ ...comment, [p.id]: e.target.value })} />
                      <button className="btn btn-danger rounded-end-pill px-3"><i className="bi bi-send-fill"></i></button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .hover-danger:hover { color: #dc3545 !important; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #dc3545; border-radius: 10px; }
        .animate-fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}