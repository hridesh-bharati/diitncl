// import React, {
//   useEffect,
//   useState,
//   Suspense,
//   lazy,
//   useCallback,
// } from "react";
// import { useNavigate } from "react-router-dom";
// import { db } from "../../../firebase/firebase";
// import {
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   updateDoc,
//   doc,
//   limit,
//   deleteDoc,
//   arrayUnion,
//   arrayRemove,
// } from "firebase/firestore";
// import { toast } from "react-toastify";
// import { useAuth } from "../../../contexts/AuthContext";
// import UploadModal from "./GalleryUploadModal";

import { RecaptchaVerifier } from "firebase/auth";

// const DownloadButton = lazy(() => import("./Gallery/DownloadButton"));
// const LikeButton = lazy(() => import("./Gallery/LikeButton"));

// export default function PublicSocialGallery() {
//   const { user, isAdmin, isLoggedIn, displayName, photoURL } = useAuth();
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filterType, setFilterType] = useState("all");
//   const [activeComments, setActiveComments] = useState({});
//   const [commentText, setCommentText] = useState({});
//   const [selectedImg, setSelectedImg] = useState(null);
//   const [showUploadModal, setShowUploadModal] = useState(false);

//   const navigate = useNavigate();

//   const currentUserId = user?.uid || localStorage.getItem("g_id") || "guest";

//   /* ======================================================
//       CLOUDINARY OPTIMIZATION (f_auto, q_auto:eco)
//   ====================================================== */
//   const getOptimizedUrl = useCallback((url, type = "post") => {
//     if (!url?.includes("cloudinary")) return url;

//     if (type === "avatar") {
//       return url.replace(
//         "/upload/",
//         "/upload/f_auto,q_auto:eco,w_80,h_80,c_fill,g_face/"
//       );
//     }
//     return url.replace(
//       "/upload/",
//       "/upload/f_auto,q_auto:eco,w_800,h_600,c_fill/"
//     );
//   }, []);

//   /* ======================================================
//       FETCH (Limited to 12 for high performance mobile load)
//   ====================================================== */
//   useEffect(() => {
//     const q = query(
//       collection(db, "galleryImages"),
//       orderBy("createdAt", "desc"),
//       limit(12)
//     );

//     const unsubscribe = onSnapshot(q, (snap) => {
//       setPosts(
//         snap.docs.map((d) => ({
//           id: d.id,
//           ...d.data(),
//         }))
//       );
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const updatePost = useCallback((id, data) => {
//     return updateDoc(doc(db, "galleryImages", id), data);
//   }, []);

//   const filteredPosts =
//     filterType === "all" ? posts : posts.filter((p) => p.type === filterType);

//   const getEmoji = (name) =>
//     ({
//       Like: "👍",
//       Love: "❤️",
//       Care: "🥰",
//       Haha: "😆",
//       Wow: "😮",
//       Sad: "😢",
//       Angry: "😡",
//     }[name] || "👍");

//   if (loading) {
//     return (
//       <div className="text-center mt-5 fw-bold text-danger py-5">
//         Loading Gallery...
//       </div>
//     );
//   }

//   return (
//     <div className="bg-light min-vh-100 pb-5">
//       {/* NAVBAR */}
//       <nav className="navbar sticky-top bg-white border-bottom shadow-sm px-3 py-2">
//         <h4 className="fw-bold m-0">
//           Drishtee <span className="text-danger">Gallery</span>
//         </h4>
//         <button
//           className="btn btn-danger rounded-pill fw-bold"
//           onClick={() => (isLoggedIn ? setShowUploadModal(true) : navigate("/login"))}
//         >
//           {isLoggedIn ? "+ Add Post" : "Login"}
//         </button>
//       </nav>

//       {/* FILTERS */}
//       <div className="container mt-3 d-flex gap-2 overflow-auto pb-2 custom-scroll">
//         {["all", "image", "video", "pdf"].map((t) => (
//           <button
//             key={t}
//             onClick={() => setFilterType(t)}
//             className={`btn btn-sm rounded-pill px-3 fw-bold ${
//               filterType === t ? "btn-danger" : "btn-outline-danger"
//             }`}
//           >
//             {t.toUpperCase()}
//           </button>
//         ))}
//       </div>

//       {/* MAIN GALLERY GRID */}
//       <main className="container mt-3">
//         <div className="row g-3">
//           {filteredPosts.map((p, index) => {
//             const userReaction = p.reactions?.[currentUserId];
//             const uniqueReacts = [...new Set(Object.values(p.reactions || {}))];

//             return (
//               <div key={p.id} className="col-12 col-md-6 col-lg-4">
//                 <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                  
//                   {/* HEADER */}
//                   <div className="p-3 d-flex justify-content-between align-items-center">
//                     <div className="d-flex align-items-center gap-2 overflow-hidden">
//                       <img
//                         src={
//                           p.userPhoto
//                             ? getOptimizedUrl(p.userPhoto, "avatar")
//                             : `https://ui-avatars.com/api/?name=${p.uploadedBy}&background=random`
//                         }
//                         alt="user profile"
//                         className="rounded-circle border"
//                         width="40"
//                         height="40"
//                         loading="lazy"
//                       />
//                       <div className="overflow-hidden">
//                         <h6 className="m-0 fw-bold text-dark text-truncate" style={{ fontSize: "14px" }}>
//                           {p.title}
//                         </h6>
//                         <small className="text-muted d-block text-truncate" style={{ fontSize: "11px" }}>
//                           by {p.uploadedBy}
//                         </small>
//                       </div>
//                     </div>

//                     {(isAdmin || p.uploadedById === currentUserId) && (
//                       <button
//                         className="btn btn-sm text-danger border-0 p-1 shadow-none"
//                         onClick={async () => {
//                           if (!window.confirm("Delete this post?")) return;
//                           try {
//                             await deleteDoc(doc(db, "galleryImages", p.id));
//                             toast.success("Deleted");
//                           } catch {
//                             toast.error("Delete failed");
//                           }
//                         }}
//                       >
//                         <i className="bi bi-trash3-fill"></i>
//                       </button>
//                     )}
//                   </div>

//                   {/* MEDIA BOX - Fixed aspect layout ratios */}
//                   <div
//                     className="bg-dark d-flex align-items-center justify-content-center overflow-hidden position-relative"
//                     style={{ height: "320px" }}
//                   >
//                     {p.type === "video" ? (
//                       <video
//                         src={p.url}
//                         controls
//                         preload="metadata"
//                         className="w-100 h-100 object-fit-cover"
//                         width="400"
//                         height="320"
//                       />
//                     ) : p.type === "pdf" ? (
//                       <div
//                         className="text-center text-white cursor-pointer w-100 py-5"
//                         onClick={() => window.open(p.url, "_blank")}
//                         style={{ cursor: "pointer" }}
//                       >
//                         <i className="bi bi-file-earmark-pdf-fill display-1 text-danger"></i>
//                         <p className="small m-0 mt-2 fw-bold">View PDF Document</p>
//                       </div>
//                     ) : (
//                       <img
//                         src={getOptimizedUrl(p.url)}
//                         alt={p.title || "Gallery Item"}
//                         className="w-100 h-100"
//                         style={{ objectFit: "cover", cursor: "zoom-in" }}
//                         width="400"
//                         height="320"
//                         loading={index <= 1 ? "eager" : "lazy"}
//                         fetchPriority={index <= 1 ? "high" : "auto"}
//                         decoding="async"
//                         onClick={() => setSelectedImg(getOptimizedUrl(p.url))}
//                       />
//                     )}
//                   </div>

//                   {/* STATS */}
//                   <div className="px-3 py-2 border-bottom d-flex justify-content-between bg-white">
//                     <div className="small fw-bold text-muted d-flex align-items-center">
//                       {uniqueReacts.slice(0, 3).map((r, i) => (
//                         <span key={i} className="me-1">
//                           {getEmoji(r)}
//                         </span>
//                       ))}
//                       <span className="ms-1">{p.likes?.length || 0}</span>
//                     </div>

//                     <div
//                       className="small fw-bold text-muted"
//                       style={{ cursor: "pointer" }}
//                       onClick={() =>
//                         setActiveComments((prev) => ({
//                           ...prev,
//                           [p.id]: !prev[p.id],
//                         }))
//                       }
//                     >
//                       {p.comments?.length || 0} Comments
//                     </div>
//                   </div>

//                   {/* ACTIONS BAR */}
//                   <div className="d-flex align-items-center p-2 bg-white">
//                     <Suspense fallback={<button className="btn btn-sm flex-grow-1">...</button>}>
//                       <LikeButton
//                         isLiked={!!userReaction}
//                         userReaction={userReaction}
//                         onClick={(emoji) => {
//                           const reactions = { ...(p.reactions || {}) };
//                           if (emoji) {
//                             reactions[currentUserId] = emoji;
//                             updatePost(p.id, {
//                               likes: arrayUnion(currentUserId),
//                               reactions,
//                             });
//                           } else {
//                             delete reactions[currentUserId];
//                             updatePost(p.id, {
//                               likes: arrayRemove(currentUserId),
//                               reactions,
//                             });
//                           }
//                         }}
//                       />
//                     </Suspense>

//                     <button
//                       className="btn flex-grow-1 text-muted fw-bold btn-sm shadow-none"
//                       onClick={() =>
//                         setActiveComments((prev) => ({
//                           ...prev,
//                           [p.id]: !prev[p.id],
//                         }))
//                       }
//                     >
//                       <i className="bi bi-chat-square me-1"></i> Comment
//                     </button>

//                     <Suspense fallback={<button className="btn btn-sm">...</button>}>
//                       <DownloadButton
//                         imageUrl={p.url}
//                         imageId={p.id}
//                         count={p.downloadCount || 0}
//                         filename={p.title}
//                       />
//                     </Suspense>
//                   </div>

//                   {/* COMMENTS DRAWER */}
//                   {activeComments[p.id] && (
//                     <div className="p-3 bg-light border-top transform-fade">
//                       <div className="overflow-auto mb-2 custom-scroll" style={{ maxHeight: "150px" }}>
//                         {p.comments?.map((c, i) => (
//                           <div
//                             key={i}
//                             className="bg-white p-2 rounded-3 shadow-sm mb-2 border-start border-danger border-3"
//                           >
//                             <small className="fw-bold text-danger d-block">{c.userName}</small>
//                             <small className="text-dark d-block mt-1">{c.text}</small>
//                           </div>
//                         ))}
//                       </div>

//                       <div className="input-group input-group-sm mt-2">
//                         <input
//                           className="form-control border-0 bg-white shadow-none px-3 rounded-start"
//                           placeholder="Write comment..."
//                           value={commentText[p.id] || ""}
//                           onChange={(e) =>
//                             setCommentText({
//                               ...commentText,
//                               [p.id]: e.target.value,
//                             })
//                           }
//                         />
//                         <button
//                           className="btn btn-danger rounded-end px-3"
//                           onClick={() => {
//                             const text = commentText[p.id]?.trim();
//                             if (!text) return;

//                             updatePost(p.id, {
//                               comments: arrayUnion({
//                                 text,
//                                 userId: currentUserId,
//                                 userName: displayName || "Guest",
//                                 id: Date.now(),
//                               }),
//                             });
//                             setCommentText({ ...commentText, [p.id]: "" });
//                           }}
//                         >
//                           <i className="bi bi-send-fill"></i>
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </main>

//       {/* MODAL */}
//       <UploadModal
//         show={showUploadModal}
//         onClose={() => setShowUploadModal(false)}
//         userDetails={{ displayName, currentUserId, photoURL }}
//       />

//       {/* OVERLAY PREVIEW */}
//       {selectedImg && (
//         <div
//           onClick={() => setSelectedImg(null)}
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.94)",
//             zIndex: 5000,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             padding: "15px",
//             cursor: "zoom-out",
//           }}
//         >
//           <img
//             src={selectedImg}
//             alt="zoomed preview"
//             style={{ maxWidth: "98%", maxHeight: "95%", borderRadius: "12px" }}
//           />
//         </div>
//       )}

//       <style>{`
//         .custom-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
//         .custom-scroll::-webkit-scrollbar-thumb { background: #dc3545; border-radius: 10px; }
//         .transform-fade { animation: fIn 0.25s ease-out; }
//         @keyframes fIn { from { opacity:0; transform: translateY(-3px); } to { opacity:1; transform: translateY(0); } }
//       `}</style>
//     </div>
//   );
// }

import React from 'react'

export default function Gallery() {
  return (
    <div>Gallery</div>
  )
}

