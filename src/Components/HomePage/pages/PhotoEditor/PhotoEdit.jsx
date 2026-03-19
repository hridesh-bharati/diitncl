import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useNavigate add kiya

export default function PhotoEdit() {
    const canvasRef = useRef(null);
    const navigate = useNavigate(); // Navigate initialize kiya
    const [imgObj, setImgObj] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
    const [finalImage, setFinalImage] = useState(null);
    const [sizeKB, setSizeKB] = useState(0);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get("mode");

    const WIDTH = 413;
    const HEIGHT = 531;

    // ... handleImage aur draw functions same rahenge ...
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                setImgObj(img);
                setZoom(1);
                setOffset({ x: 0, y: 0 });
                setFinalImage(null);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const draw = (canvas, withBorder = false) => {
        if (!imgObj) return;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.save();
        ctx.translate(WIDTH / 2 + offset.x, HEIGHT / 2 + offset.y);
        ctx.rotate((rotation * Math.PI) / 180);
        const imgRatio = imgObj.width / imgObj.height;
        const drawWidth = WIDTH * zoom;
        const drawHeight = (WIDTH / imgRatio) * zoom;
        ctx.drawImage(imgObj, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();
    };

    useEffect(() => {
        if (imgObj) draw(canvasRef.current, false);
    }, [imgObj, zoom, rotation, offset]);

    const handleStart = (e) => {
        setIsDragging(true);
        const pos = e.touches ? e.touches[0] : e;
        setLastPos({ x: pos.clientX, y: pos.clientY });
    };

    const handleMove = (e) => {
        if (!isDragging) return;
        if (e.touches) e.preventDefault();
        const pos = e.touches ? e.touches[0] : e;
        setOffset(prev => ({
            x: prev.x + (pos.clientX - lastPos.x),
            y: prev.y + (pos.clientY - lastPos.y)
        }));
        setLastPos({ x: pos.clientX, y: pos.clientY });
    };

    const handleExport = () => {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = WIDTH;
        tempCanvas.height = HEIGHT;
        draw(tempCanvas, false);

        let quality = 0.9;
        let dataUrl = tempCanvas.toDataURL("image/jpeg", quality);
        const getSize = (s) => Math.round((s.length * 3) / 4 / 1024);

        while (getSize(dataUrl) > 50 && quality > 0.1) {
            quality -= 0.05;
            dataUrl = tempCanvas.toDataURL("image/jpeg", quality);
        }
        
        setFinalImage(dataUrl);
        setSizeKB(getSize(dataUrl));

        // ✅ Mode check karke storage mein save karna
        if (mode === "admission") {
            localStorage.setItem("editedPhoto", dataUrl);
        }
    };

    // ✅ Done button ka logic
    const handleFinish = () => {
        // Form par wapas bhej do (Admission route check kar lena sahi hai ya nahi)
        navigate("/new-admission"); 
    };

    return (
        <div className="container-fluid py-4 mb-5 mb-lg-0">
            <div className="mx-auto" style={{ maxWidth: "1000px" }}>
                <div className="row g-4">
                    
                    {/* LEFT SIDE: Editing Area */}
                    <div className={finalImage ? "col-lg-6" : "col-12 max-width-500 mx-auto"}>
                        <div className="card p-3 shadow-sm border-0 h-100">
                            <div className="text-center text-lg-start mb-4">
                                <h4 className="fw-bold mb-1 text-dark">
                                    <i className="bi bi-camera-fill me-2 text-primary"></i>Passport Photo Editor
                                </h4>
                                <p className="text-muted small mb-0">Adjust photo for your application.</p>
                            </div>
                            <input type="file" accept="image/*" onChange={handleImage} className="form-control mb-3" />

                            <div className="position-relative bg-light rounded overflow-hidden d-flex justify-content-center align-items-center"
                                style={{ height: "400px", touchAction: "none", border: "2px dashed #ccc" }}>
                                {!imgObj && <span className="text-muted small">Upload Image to Edit</span>}
                                <div
                                    onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={() => setIsDragging(false)}
                                    onMouseLeave={() => setIsDragging(false)}
                                    onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={() => setIsDragging(false)}
                                    style={{ cursor: isDragging ? "grabbing" : "grab" }}
                                >
                                    <canvas
                                        className="border border-secondary shadow-sm"
                                        ref={canvasRef}
                                        width={WIDTH}
                                        height={HEIGHT}
                                        style={{ maxWidth: "100%", height: "350px", display: imgObj ? "block" : "none", backgroundColor: "#fff" }}
                                    />
                                </div>
                            </div>

                            {imgObj && (
                                <div className="mt-3 p-2">
                                    {/* Zoom & Rotate Controls... */}
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <span className="small fw-bold" style={{ minWidth: "60px" }}>🔍 Zoom</span>
                                        <input type="range" className="form-range" min="0.5" max="3" step="0.01" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} />
                                    </div>
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <span className="small fw-bold" style={{ minWidth: "60px" }}>🔄 Rotate</span>
                                        <input type="range" className="form-range" min="-180" max="180" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))} />
                                    </div>
                                    <button onClick={handleExport} className="btn btn-dark w-100 fw-bold">Apply & Preview</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDE: Final Preview & Done/Download */}
                    {finalImage && (
                        <div className="col-lg-6 animate__animated animate__fadeIn">
                            <div className="card p-3 shadow-sm border-0 h-100 text-center justify-content-center">
                                <h6 className="fw-bold mb-3">Final Preview</h6>
                                <div className="mb-3">
                                    <div className="d-inline-block p-1 border bg-white shadow-sm">
                                        <img src={finalImage} alt="Final" style={{ width: "220px", height: "auto" }} />
                                    </div>
                                </div>
                                <div className="px-lg-5">
                                    <div className="alert alert-success py-2 small fw-bold mb-3">
                                        📏 Size: {sizeKB} KB
                                    </div>

                                    {/* ✅ Conditional Buttons based on Mode */}
                                    {mode === "admission" ? (
                                        <button onClick={handleFinish} className="btn btn-primary btn-lg w-100 fw-bold">
                                            ✅ Done & Update Photo
                                        </button>
                                    ) : (
                                        <a href={finalImage} download="passport-photo.jpg" className="btn btn-success btn-lg w-100 fw-bold">
                                            ⬇ Download Photo
                                        </a>
                                    )}

                                    <button onClick={() => setFinalImage(null)} className="btn btn-link btn-sm text-muted mt-2">Re-edit</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}