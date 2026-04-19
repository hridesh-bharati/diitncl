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
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState({});
  const [showComments, setShowComments] = useState({});
  const [selectedImg, setSelectedImg] = useState(null);

  const [up, setUp] = useState({
    show: false,
    file: null,
    preview: "",
    title: "",
    loading: false,
    type: "image",
  });

  const navigate = useNavigate();

  // ✅ Guest/User ID logic from your comment reference
  const currentUserId = useMemo(() => {
    let id = user?.uid || localStorage.getItem("gallery_user_id");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("gallery_user_id", id);
    }
    return id;
  }, [user]);

  // ✅ Cloudinary PDF Preview Logic
  const getPdfPreview = useCallback((url) => {
    if (!url) return "";
    if (url.includes("cloudinary")) {
      return url.replace(/\.pdf$/, ".jpg").replace("/upload/", "/upload/w_600,h_800,c_fill,pg_1,f_auto,q_auto/");
    }
    return "https://cdn-icons-png.flaticon.com/512/337/337946.png";
  }, []);

  const getEmoji = (name) => {
    const emojis = { Like: "👍", Love: "❤️", Care: "🥰", Haha: "😆", Wow: "😮", Sad: "😢", Angry: "😡" };
    return emojis[name] || "👍";
  };

  useEffect(() => {
    const q = query(collection(db, "galleryImages"), orderBy("createdAt", "desc"), limit(50));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const updatePost = useCallback((id, data) => updateDoc(doc(db, "galleryImages", id), data), []);

  const handleDelete = async (p) => {
    if (window.confirm("Delete this post?")) {
      await deleteDoc(doc(db, "galleryImages", p.id));
      toast.info("Deleted successfully");
    }
  };

  const handleUpload = async () => {
    if (!up.file || !up.title.trim()) return toast.error("File & Title required");
    setUp((p) => ({ ...p, loading: true }));

    try {
      const fd = new FormData();
      fd.append("file", up.file);
      fd.append("upload_preset", "hridesh99!");

      // let resourceType = up.type === "video" ? "video" : "image";
      // const res = await fetch(`https://api.cloudinary.com/v1_1/draowpiml/${resourceType}/upload`, {
      //   method: "POST",
      //   body: fd
      // });

      // handleUpload function ke andar ye change karein:
      const res = await fetch(`https://api.cloudinary.com/v1_1/draowpiml/auto/upload`, {
        method: "POST",
        body: fd
      });

      const data = await res.json();

      await addDoc(collection(db, "galleryImages"), {
        url: data.secure_url,
        title: up.title.trim(),
        type: up.type,
        uploadedBy: displayName || "Guest",
        uploadedById: currentUserId,
        userPhoto: photoURL || "",
        createdAt: serverTimestamp(),
        likes: [],
        reactions: {},
        comments: [],
        downloadCount: 0,
      });

      toast.success("Uploaded!");
      setUp({ show: false, file: null, preview: "", title: "", loading: false, type: "image" });
    } catch (err) {
      toast.error("Upload failed");
      setUp((p) => ({ ...p, loading: false }));
    }
  };

  const filteredPosts = filterType === "all" ? posts : posts.filter((p) => p.type === filterType);

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center fw-bold text-danger">Loading...</div>;

  return (
    <div className="bg-primary-subtle min-vh-100 pb-5">
      <header className="bg-white border-bottom shadow-sm py-3 mb-3 sticky-top" style={{ zIndex: 1000 }}>
        <div className="container d-flex justify-content-between align-items-center">
          <h4 className="fw-bold text-dark m-0">Drishtee <span className="text-danger">Gallery</span></h4>
          <button className={`btn btn-${isLoggedIn ? 'danger' : 'outline-danger'} rounded-pill px-4 fw-bold`}
            onClick={() => isLoggedIn ? setUp(p => ({ ...p, show: true })) : navigate("/login")}>
            {isLoggedIn ? "+ Add Post" : "Login"}
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="container mb-3 d-flex gap-2 overflow-auto pb-1">
        {[["all", "All"], ["image", "Pics"], ["video", "Reels"], ["pdf", "PDF"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilterType(val)} className={`btn btn-sm rounded-pill px-3 fw-bold ${filterType === val ? "btn-danger" : "btn-outline-danger"}`}>{label}</button>
        ))}
      </div>

      <main className="container">
        <div className="row g-3">
          {filteredPosts.map((p) => {
            const isVideo = p.type === "video";
            const isPdf = p.type === "pdf";
            const userReaction = p.reactions?.[currentUserId] || null;
            const isLiked = !!userReaction;
            const uniqueReacts = [...new Set(Object.values(p.reactions || {}))];

            return (
              <div key={p.id} className="col-12 col-md-6 col-lg-4 px-2">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white animate-fade-in">

                  {/* Card Header */}
                  <div className="p-3 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2 overflow-hidden">
                      <img src={p.userPhoto || `https://ui-avatars.com/api/?name=${p.uploadedBy}`} className="rounded-circle border" width="32" height="32" alt="" />
                      <div className="d-flex flex-column overflow-hidden">
                        <h6 className="fw-bold mb-0 text-truncate small">{p.title}</h6>
                        <small className="text-muted" style={{ fontSize: '10px' }}>by {p.uploadedBy}</small>
                      </div>
                    </div>
                    {(isAdmin || p.uploadedById === currentUserId) && (
                      <i className="bi bi-trash3-fill text-danger cursor-pointer" onClick={() => handleDelete(p)}></i>
                    )}
                  </div>

                  {/* Media Section */}
                  <div className="bg-black" style={{ height: '320px' }}>
                    {isVideo ? (
                      <video src={p.url} controls className="w-100 h-100 object-fit-cover" />
                    ) : isPdf ? (
                      /* ✅ OPEN PDF button remove kar diya hai, ab sirf preview image dikhegi */
                      <div className="w-100 h-100" onClick={() => window.open(p.url, "_blank")} style={{ cursor: "pointer" }}>
                        <img
                          src={getPdfPreview(p.url)}
                          className="w-100 h-100 object-fit-contain bg-white"
                          alt="PDF Preview"
                          onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/337/337946.png"}
                        />
                      </div>
                    ) : (
                      <img
                        src={p.url}
                        className="w-100 h-100 object-fit-cover cursor-zoom-in"
                        onClick={() => setSelectedImg(p.url)}
                        alt=""
                      />
                    )}
                  </div>

                  {/* Stats Bar from your reference */}
                  <div className="px-3 py-2 d-flex justify-content-between align-items-center border-bottom mx-2">
                    <div className="d-flex align-items-center gap-1">
                      {uniqueReacts.length > 0 && (
                        <div className="d-flex align-items-center">
                          {uniqueReacts.slice(0, 3).map((r, i) => (
                            <span key={r} style={{ fontSize: '14px', marginLeft: i > 0 ? '-5px' : '0', zIndex: 5 - i }}>{getEmoji(r)}</span>
                          ))}
                        </div>
                      )}
                      <span className="small fw-bold text-muted">{p.likes?.length || 0}</span>
                    </div>
                    <div className="cursor-pointer text-secondary" onClick={() => setShowComments(prev => ({ ...prev, [p.id]: !prev[p.id] }))}>
                      <span className="small fw-bold">{p.comments?.length || 0} Comments</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="card-body p-1">
                    <div className="d-flex align-items-center">
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

                      <button className="btn flex-grow-1 border-0 bg-transparent text-muted fw-bold btn-sm py-2" onClick={() => setShowComments(prev => ({ ...prev, [p.id]: !prev[p.id] }))}>
                        <i className="bi bi-chat-square me-1"></i> Comment
                      </button>

                      <Suspense fallback="...">
                        <DownloadButton imageUrl={p.url} imageId={p.id} count={p.downloadCount || 0} filename={p.title} />
                      </Suspense>
                    </div>

                    {/* Comments Toggle Section from your reference */}
                    {showComments[p.id] && (
                      <div className="mt-2 pt-2 border-top animate-fade-in px-2 pb-2">
                        <div className="overflow-auto mb-2 custom-scroll" style={{ maxHeight: '180px' }}>
                          {p.comments?.map(c => (
                            <div key={c.commentId} className="bg-light rounded-3 p-2 mb-2 border-start border-danger border-3 text-start text-dark">
                              <div className="d-flex justify-content-between small fw-bold">
                                <span>{c.userName}</span>
                                {(isAdmin || c.userId === currentUserId) && (
                                  <i className="bi bi-x-circle text-muted cursor-pointer" onClick={() => updatePost(p.id, { comments: arrayRemove(c) })}></i>
                                )}
                              </div>
                              <div className="small text-muted">{c.text}</div>
                            </div>
                          ))}
                        </div>
                        <form className="input-group input-group-sm mt-2" onSubmit={(e) => {
                          e.preventDefault();
                          const t = comment[p.id]?.trim();
                          if (!t) return;
                          updatePost(p.id, {
                            comments: arrayUnion({
                              text: t,
                              userId: currentUserId,
                              userName: displayName || "Guest",
                              commentId: uuidv4(),
                              createdAt: new Date().toISOString()
                            })
                          });
                          setComment({ ...comment, [p.id]: "" });
                        }}>
                          <input className="form-control border-0 bg-light rounded-start-pill px-3 shadow-none" placeholder="Write a comment..." value={comment[p.id] || ""} onChange={(e) => setComment({ ...comment, [p.id]: e.target.value })} />
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

      {/* Modals & Style remains the same */}
      {selectedImg && (
        <div className="fixed-top vh-100 w-100 d-flex align-items-center justify-content-center bg-black bg-opacity-90 z-3 p-2" onClick={() => setSelectedImg(null)}>
          <img src={selectedImg} className="img-fluid rounded shadow-lg" style={{ maxHeight: '95vh' }} alt="" />
        </div>
      )}

      {up.show && (
        <div className="fixed-top vh-100 w-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75 p-3" style={{ zIndex: 4000 }}>
          <div className="card w-100 shadow-lg border-0 rounded-4" style={{ maxWidth: 450 }}>
            <div className="card-header bg-white border-bottom d-flex justify-content-between py-3 rounded-top-4">
              <h5 className="fw-bold mb-0">Add to Gallery</h5>
              <button className="btn-close" onClick={() => setUp(p => ({ ...p, show: false }))}></button>
            </div>
            <div className="card-body">
              <input type="file" className="form-control mb-3" accept="image/*,video/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  let type = "image";
                  if (file.type.startsWith("video/")) type = "video";
                  else if (file.type === "application/pdf") type = "pdf";
                  setUp(p => ({ ...p, file, preview: URL.createObjectURL(file), type }));
                }}
              />
              {up.preview && <img src={up.preview} className="w-100 rounded border mb-3 shadow-sm" style={{ maxHeight: '200px', objectFit: 'contain' }} alt="" />}
              <input className="form-control mb-3 fw-bold shadow-none" placeholder="Title" value={up.title} onChange={(e) => setUp(p => ({ ...p, title: e.target.value }))} />
              <button className="btn btn-danger w-100 rounded-pill fw-bold py-2 shadow-sm" onClick={handleUpload} disabled={up.loading}>{up.loading ? "Processing..." : "Publish"}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #dc3545; border-radius: 10px; }
        .cursor-zoom-in { cursor: zoom-in; }
        .animate-fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}