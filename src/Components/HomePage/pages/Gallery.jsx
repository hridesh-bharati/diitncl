import React, { useEffect, useState } from "react";
import { Container, Image, Spinner, Alert } from "react-bootstrap";

const CLOUD_NAME = "draowpiml";
const LIST_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/gallery.json`;

export default function PublicGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${LIST_URL}?t=${Date.now()}`) 
      .then((r) => r.json())
      .then((d) => {
        setImages(d.resources || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Gallery load failed");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <Container  className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container className="py-4">
      <h4 className="text-center my-4">Gallery</h4>

      <div className="row">
        {images.map((img) => (
          <div
            key={img.public_id}
            className="col-lg-3 col-md-4 col-6 mb-3"
          >
            <Image
              src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${img.public_id}.${img.format}`}
              fluid
              rounded
            />
          </div>
        ))}
      </div>
    </Container>
  );
}
