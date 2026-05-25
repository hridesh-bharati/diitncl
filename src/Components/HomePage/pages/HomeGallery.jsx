import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  Suspense,
  lazy,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../../firebase/firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  limit,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../../contexts/AuthContext";

const DownloadButton = lazy(() => import("./Gallery/DownloadButton"));
const LikeButton = lazy(() => import("./Gallery/LikeButton"));

function HomeGallery() {
  const { user, isAdmin, displayName } = useAuth();
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

  /* ======================================================
      OPTIMIZED CLOUDINARY URL
  ====================================================== */
  const getOptimizedUrl = useCallback((url, type = "post") => {
    if (!url?.includes("cloudinary")) return url;

    if (type === "avatar") {
      return url.replace(
        "/upload/",
        "/upload/f_auto,q_auto:eco,w_80,h_80,c_fill,g_face/"
      );
    }
    return url.replace(
      "/upload/",
      "/upload/f_auto,q_auto:eco,w_600,h_500,c_fill/"
    );
  }, []);

  /* ======================================================
      FETCH ONLY 3 POSTS (Static fast execution)
  ====================================================== */
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const q = query(
          collection(db, "galleryImages"),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const snap = await getDocs(q);
        const fetchedPosts = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setPosts(fetchedPosts);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load gallery");
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const updatePost = useCallback((id, data) => {
    return updateDoc(doc(db, "galleryImages", id), data);
  }, []);

  const handleDelete = useCallback(async (p) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await deleteDoc(doc(db, "galleryImages", p.id));
      setPosts((prev) => prev.filter((item) => item.id !== p.id));
      toast.success("Deleted successfully");
    } catch (e) {
      console.error(e);
      toast.error("Error deleting image");
    }
  }, []);

  const toggleComments = useCallback((id) => {
    setShowComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const getEmoji = useCallback((name) => {
    const emojis = {
      Like: "👍",
      Love: "❤️",
      Care: "🥰",
      Haha: "😆",
      Wow: "😮",
      Sad: "😢",
      Angry: "😡",
    };
    return emojis[name] || "👍";
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5 fw-bold text-danger">
        Loading Gallery...
      </div>
    );
  }

  return (
    <div className="container-fluid p-2 pt-3 bg-light">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center bg-white shadow-sm rounded-4 p-3 mb-4">
        <div>
          <h2 className="fw-bold m-0">
            Our <span className="text-danger">Gallery</span>
          </h2>
          <small className="text-muted">Student activities & achievements</small>
        </div>
        <Link to="/gallery" className="btn btn-danger rounded-pill px-4 fw-bold">
          View All
        </Link>
      </div>

      {/* POSTS ROW */}
      <div className="row g-3">
        {posts.map((p, index) => {
          const userReaction = p.reactions?.[currentUserId] || null;
          const uniqueReacts = [...new Set(Object.values(p.reactions || {}))];

          return (
            <div key={p.id} className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                
                {/* PROFILE HEADER */}
                <div className="p-3 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2 overflow-hidden">
                    <img
                      src={
                        p.userPhoto
                          ? getOptimizedUrl(p.userPhoto, "avatar")
                          : `https://ui-avatars.com/api/?name=${p.uploadedBy}&background=random`
                      }
                      alt="user"
                      width="40"
                      height="40"
                      loading="lazy"
                      className="rounded-circle border"
                    />
                    <div className="overflow-hidden">
                      <h6 className="m-0 fw-bold text-dark text-truncate" style={{ fontSize: "14px" }}>
                        {p.title}
                      </h6>
                      <small className="text-muted d-block text-truncate" style={{ fontSize: "11px" }}>
                        by {p.uploadedBy}
                      </small>
                    </div>
                  </div>

                  {(isAdmin || p.uploadedById === currentUserId) && (
                    <button
                      className="btn btn-sm text-danger border-0 shadow-none"
                      onClick={() => handleDelete(p)}
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  )}
                </div>

                {/* POST IMAGE BOX */}
                <div className="bg-dark" style={{ height: "280px" }}>
                  <img
                    src={getOptimizedUrl(p.url)}
                    alt={p.title || "Gallery post"}
                    className="w-100 h-100"
                    style={{ objectFit: "cover", cursor: "pointer" }}
                    onClick={() => navigate("/gallery")}
                    width="400"
                    height="280"
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                  />
                </div>

                {/* STATS ROW */}
                <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom bg-white">
                  <div className="small fw-bold text-muted d-flex align-items-center">
                    {uniqueReacts.slice(0, 3).map((r, i) => (
                      <span key={i} className="me-1">
                        {getEmoji(r)}
                      </span>
                    ))}
                    <span className="ms-1">{p.likes?.length || 0}</span>
                  </div>

                  <div
                    className="small fw-bold text-muted"
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleComments(p.id)}
                  >
                    {p.comments?.length || 0} Comments
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="d-flex align-items-center p-2 bg-white">
                  <Suspense fallback={<button className="btn btn-sm flex-grow-1">...</button>}>
                    <LikeButton
                      isLiked={!!userReaction}
                      userReaction={userReaction}
                      onClick={(reactionName) => {
                        const reactions = { ...(p.reactions || {}) };

                        if (reactionName) {
                          reactions[currentUserId] = reactionName;
                          updatePost(p.id, {
                            likes: arrayUnion(currentUserId),
                            reactions,
                          });
                        } else {
                          delete reactions[currentUserId];
                          updatePost(p.id, {
                            likes: arrayRemove(currentUserId),
                            reactions,
                          });
                        }
                      }}
                    />
                  </Suspense>

                  <button
                    className="btn flex-grow-1 text-muted fw-bold btn-sm shadow-none"
                    onClick={() => toggleComments(p.id)}
                  >
                    <i className="bi bi-chat-square me-1"></i> Comment
                  </button>

                  <Suspense fallback={<button className="btn btn-sm">...</button>}>
                    <DownloadButton
                      imageUrl={p.url}
                      imageId={p.id}
                      count={p.downloadCount || 0}
                    />
                  </Suspense>
                </div>

                {/* COMMENTS MODULE */}
                {showComments[p.id] && (
                  <div className="p-3 border-top bg-light">
                    <div className="overflow-auto mb-2 custom-scroll" style={{ maxHeight: "150px" }}>
                      {p.comments?.map((c) => (
                        <div
                          key={c.commentId}
                          className="bg-white rounded-3 p-2 mb-2 border-start border-danger border-3 shadow-xs"
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="fw-bold text-danger">{c.userName}</small>
                            {(isAdmin || c.userId === currentUserId) && (
                              <i
                                className="bi bi-x-circle text-muted cursor-pointer"
                                style={{ cursor: "pointer", fontSize: "12px" }}
                                onClick={() =>
                                  updatePost(p.id, {
                                    comments: arrayRemove(c),
                                  })
                                }
                              ></i>
                            )}
                          </div>
                          <small className="text-dark d-block mt-1">{c.text}</small>
                        </div>
                      ))}
                    </div>

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
                            createdAt: new Date().toISOString(),
                          }),
                        });
                        setComment({ ...comment, [p.id]: "" });
                      }}
                    >
                      <input
                        className="form-control shadow-none border-0 bg-white px-3 rounded-start"
                        placeholder="Add comment..."
                        value={comment[p.id] || ""}
                        onChange={(e) =>
                          setComment({
                            ...comment,
                            [p.id]: e.target.value,
                          })
                        }
                      />
                      <button className="btn btn-danger rounded-end px-3">
                        <i className="bi bi-send-fill"></i>
                      </button>
                    </form>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(HomeGallery);