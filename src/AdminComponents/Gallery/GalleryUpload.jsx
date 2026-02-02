import React, { useState } from "react";
import { Card, Button, Spinner, Image } from "react-bootstrap";
import { toast } from "react-toastify";

export default function AdminGalleryUpload() {
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState({ img: false });

  const uploadImg = async () => {
    if (!img) return toast.error("Pick an image");

    setLoading((p) => ({ ...p, img: true }));

    try {
      const fd = new FormData();
      fd.append("file", img);
      fd.append("upload_preset", "hridesh99!"); 
      fd.append("cloud_name", "draowpiml");

      fd.append("folder", "gallery");

      const r = await fetch(
        "https://api.cloudinary.com/v1_1/draowpiml/image/upload",
        { method: "POST", body: fd }
      );

      const d = await r.json();
      if (!r.ok) throw new Error(d.error?.message || "Upload failed");

      // preview
      setPreview((p) => [d.secure_url, ...p]);
      setImg(null);

      toast.success("Uploaded!");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading((p) => ({ ...p, img: false }));
    }
  };

  return (
    <Card className="p-3 shadow-sm">
      <h5 className="mb-3">Gallery Upload</h5>

      <input
        type="file"
        accept="image/*"
        className="form-control mb-2"
        onChange={(e) => setImg(e.target.files[0])}
      />

      <Button onClick={uploadImg} disabled={loading.img}>
        {loading.img ? <Spinner size="sm" /> : "Upload"}
      </Button>

      {/* Preview */}
      <div className="row mt-3">
        {preview.map((url, i) => (
          <div key={i} className="col-4 mb-2">
            <Image src={url} fluid rounded />
          </div>
        ))}
      </div>
    </Card>
  );
}
