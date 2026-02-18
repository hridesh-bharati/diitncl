// src/pages/Gallery/PublicSocialGallery.jsx (FULL FIXED CODE)
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  limit,
  addDoc,
  serverTimestamp,
  deleteDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";

import {
  Container,
  Card,
  Button,
  Form,
  Spinner,
  InputGroup,
  Dropdown,
  Row,
  Col,
  Modal
} from "react-bootstrap";

import {
  Trash3,
  PersonCircle,
  Upload,
  ThreeDotsVertical,
  Chat,
  XCircleFill
} from "react-bootstrap-icons";

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
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const currentUserId = user?.uid || myId;
  const navigate = useNavigate();

  // Guest ID Generate
  useEffect(() => {
    let id = localStorage.getItem("gallery_user_id") || uuidv4();
    localStorage.setItem("gallery_user_id", id);
    setMyId(id);
  }, []);

  // Fetch Posts
  useEffect(() => {
    const q = query(
      collection(db, "galleryImages"),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        likes: doc.data().likes || [],
        comments: doc.data().comments || [],
        downloadCount: doc.data().downloadCount || 0
      }));
      setPosts(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Like
  const handleLike = async (post) => {
    const docRef = doc(db, "galleryImages", post.id);

    if (post.likes.includes(currentUserId)) {
      await updateDoc(docRef, {
        likes: arrayRemove(currentUserId)
      });
    } else {
      await updateDoc(docRef, {
        likes: arrayUnion(currentUserId)
      });
    }
  };

  // Comment Add
  const handleComment = async (post) => {
    const text = comment[post.id]?.trim();
    if (!text) return;

    const newComment = {
      text,
      userId: currentUserId,
      userName: displayName || "Guest",
      userPhoto: photoURL || "",
      createdAt: new Date().toISOString(),
      commentId: uuidv4()
    };

    await updateDoc(doc(db, "galleryImages", post.id), {
      comments: arrayUnion(newComment)
    });

    setComment({ ...comment, [post.id]: "" });
  };

  // Comment Delete
  const deleteComment = async (post, commentObj) => {
    await updateDoc(doc(db, "galleryImages", post.id), {
      comments: arrayRemove(commentObj)
    });
  };

  // Upload
  const uploadToCloudinary = async () => {
    if (!file || !title.trim())
      return toast.error("File and title required");

    if (!file.type.startsWith("image/"))
      return toast.error("Only image allowed");

    if (file.size > 2 * 1024 * 1024)
      return toast.error("Max 2MB allowed");

    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "hridesh99!");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/draowpiml/image/upload",
        { method: "POST", body: fd }
      );

      const data = await res.json();

      await addDoc(collection(db, "galleryImages"), {
        url: data.secure_url,
        title: title.trim(),
        uploadedBy: displayName || "Guest",
        uploadedById: currentUserId,
        userPhoto: photoURL || "",
        createdAt: serverTimestamp(),
        likes: [],
        comments: [],
        downloadCount: 0 // ✅ INITIAL DOWNLOAD COUNT
      });

      toast.success("Post shared!");
      setShowUpload(false);
      setFile(null);
      setTitle("");
      setPreview("");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (date) => {
    const diff = (new Date() - new Date(date)) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return new Date(date).toLocaleDateString();
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="danger" />
      </div>
    );

  return (
    <div style={{ background: "#f0f2f5", minHeight: "100vh" }}>

      {/* HEADER */}
      <div className="bg-white border-bottom py-2 shadow-sm">
        <Container className="d-flex justify-content-between align-items-center">
          <h4 className="fw-bold text-danger mb-0">Gallery</h4>
          {isLoggedIn ? (
            <Button
              variant="danger"
              size="sm"
              className="rounded-pill px-4 fw-bold"
              onClick={() => setShowUpload(true)}
            >
              <Upload size={16} className="me-2" />
              Post
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className="rounded-pill px-4 fw-bold"
              onClick={() => navigate("/login-as-member")}
            >
              🔐 Login to Post
            </Button>
          )}
        </Container>
      </div>

      {/* FEED */}
      <Container className="py-4 pb-5 pb-lg-0">
        <Row className="g-4 pb-5 justify-content-center">
          {posts.map((post) => (
            <Col key={post.id} xs={12} md={8} lg={6}>
              <Card className="shadow-sm border-0 rounded-4 overflow-hidden">

                {/* Header - User Info */}
                <Card.Body className="d-flex justify-content-between align-items-center pb-0">
                  <div className="d-flex align-items-center gap-2">
                    {post.userPhoto ? (
                      <img
                        src={post.userPhoto}
                        alt=""
                        className="rounded-circle"
                        width="40"
                        height="40"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <PersonCircle size={40} className="text-secondary" />
                    )}
                    <div>
                      <div className="fw-bold">
                        {post.uploadedBy}
                      </div>
                      <div className="text-muted" style={{ fontSize: 12 }}>
                        {formatTime(post.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Delete Option - Only Admin/Uploader */}
                  {(isAdmin || post.uploadedById === currentUserId) && (
                    <Dropdown align="end">
                      <Dropdown.Toggle variant="link" className="p-0 shadow-none text-dark">
                        <ThreeDotsVertical size={18} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          className="text-danger"
                          onClick={() =>
                            deleteDoc(doc(db, "galleryImages", post.id))
                          }
                        >
                          <Trash3 className="me-2" />
                          Delete Post
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </Card.Body>

                {/* Image */}
                <div className="px-3 pt-2">
                  <img
                    src={post.url}
                    alt={post.title}
                    loading="lazy"
                    style={{
                      width: "100%",
                      maxHeight: "500px",
                      objectFit: "contain",
                      background: "#0a0a0a",
                      borderRadius: "12px",
                      cursor: "pointer"
                    }}
                    onDoubleClick={() => handleLike(post)}
                  />
                </div>

                {/* Title */}
                <Card.Body className="pb-0">
                  <div className="fw-bold fs-6 mb-2">{post.title}</div>
                </Card.Body>

                {/* ACTIONS - LIKE, COMMENT, DOWNLOAD */}
                <Card.Body className="py-2">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>

                    {/* ✅ INSTAGRAM STYLE LIKE BUTTON WITH ANIMATION */}
                    <LikeButton
                      isLiked={post.likes.includes(currentUserId)}
                      count={post.likes.length}
                      onClick={() => handleLike(post)}
                      size={22}
                    />

                    {/* Comment Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Chat size={22} />
                      <span style={{ fontWeight: '600', fontSize: '14px' }}>
                        {post.comments.length}
                      </span>
                    </div>

                    {/* ✅ DOWNLOAD BUTTON WITH COUNTER */}
                    <DownloadButton
                      imageUrl={post.url}
                      imageId={post.id}
                      filename={`${post.uploadedBy}-${post.title}`}
                    />

                  </div>
                </Card.Body>

                {/* Comments Section */}
                <Card.Body className="pt-0">
                  {/* Comments List */}
                  {post.comments.map((c) => (
                    <div key={c.commentId} className="small mb-2 d-flex align-items-start">
                      <strong className="me-1">{c.userName}:</strong>
                      <span className="text-break flex-grow-1">{c.text}</span>
                      {(isAdmin || c.userId === currentUserId) && (
                        <XCircleFill
                          size={14}
                          className="text-danger ms-2"
                          style={{ cursor: "pointer", flexShrink: 0 }}
                          onClick={() => deleteComment(post, c)}
                        />
                      )}
                    </div>
                  ))}

                  {/* Add Comment */}
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleComment(post);
                    }}
                  >
                    <InputGroup className="mt-2">
                      <Form.Control
                        placeholder="Write a comment..."
                        value={comment[post.id] || ""}
                        onChange={(e) =>
                          setComment({
                            ...comment,
                            [post.id]: e.target.value
                          })
                        }
                        size="sm"
                        className="rounded-pill border-0 bg-light"
                      />
                      <Button
                        type="submit"
                        variant="danger"
                        className="rounded-pill px-4 fw-bold shadow-sm"
                        disabled={!comment[post.id]?.trim()}
                        size="sm"
                      >
                        Post
                      </Button>
                    </InputGroup>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* UPLOAD MODAL */}
      <Modal show={showUpload} onHide={() => setShowUpload(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Create New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold text-muted">Select Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              className="py-2"
              onChange={(e) => {
                const selected = e.target.files[0];
                setFile(selected);
                if (selected) {
                  setPreview(URL.createObjectURL(selected));
                }
              }}
            />
            <Form.Text className="text-muted">Max size: 2MB</Form.Text>
          </Form.Group>

          {preview && (
            <div className="mb-3">
              <img
                src={preview}
                alt="Preview"
                className="w-100 rounded-3"
                style={{ maxHeight: 250, objectFit: "contain", background: "#f8f9fa" }}
              />
            </div>
          )}

          <Form.Group>
            <Form.Label className="small fw-bold text-muted">Title</Form.Label>
            <Form.Control
              placeholder="Enter image title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="py-2"
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={() => setShowUpload(false)} className="px-4 rounded-pill">
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={uploadToCloudinary}
            disabled={uploading || !file || !title.trim()}
            className="px-4 rounded-pill"
          >
            {uploading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Posting...
              </>
            ) : (
              "Post"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}