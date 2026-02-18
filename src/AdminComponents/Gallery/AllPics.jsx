// src\AdminComponents\Gallery\AllPics.jsx
import React, { useState, useEffect } from "react";
import { Card, Button, Spinner, Image, Row, Col } from "react-bootstrap";
import { db } from "../../firebase/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Trash } from "react-bootstrap-icons";
import { toast } from "react-toastify";

export default function AllPics({ isAdmin = true }) {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "galleryImages"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snapshot => {
      setGallery(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const deleteImg = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteDoc(doc(db, "galleryImages", id));
      toast.success("Image removed");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <Card className="p-3 shadow-sm rounded-4 pb-5 pb-lg-0">
      <h5 className="mb-4 fw-bold">Gallery</h5>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row className="g-3 pb-5 pb-lg-0">
          {gallery.map(item => (
            <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
              <div className="position-relative rounded-4 shadow-sm overflow-hidden">
                <Image
                  src={item.url}
                  fluid
                  style={{ height: '200px', objectFit: 'cover', width: '100%' }}
                />

                {/* Admin delete button */}
                {isAdmin && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute top-0 end-0 rounded-pill m-2 py-0 px-2"
                    onClick={() => deleteImg(item.id)}
                    title="Delete Image"
                  >
                    <Trash size={14} />
                  </Button>
                )}

                {/* Card footer: Likes & Date */}
                <Card className="position-relative mt-2 border-0 shadow-none">
                  <Card.Body className="p-2 d-flex justify-content-between align-items-center">
                    <span className="fw-bold" style={{ fontSize: '0.9rem' }}>
                      {item.likes?.length || 0} Likes
                    </span>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                      {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : ""}
                    </span>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {gallery.length === 0 && !loading && (
        <div className="text-center py-4 text-muted">No images in the gallery yet.</div>
      )}
    </Card>
  );
}
