import React, { useRef, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PhotoEdit() {
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // States
    const [imgObj, setImgObj] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
    const [finalImage, setFinalImage] = useState(null);
    const [sizeKB, setSizeKB] = useState(0);
    const [lastTouchDistance, setLastTouchDistance] = useState(0);

    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get("mode");

    const WIDTH = 413;
    const HEIGHT = 531;

    // Drawing Logic (Optimized with useCallback)
    const draw = useCallback((canvas) => {
        if (!imgObj || !canvas) return;
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
    }, [imgObj, zoom, rotation, offset]);

    // Render loop using requestAnimationFrame for 60fps feel
    useEffect(() => {
        let animationFrameId;
        if (imgObj && canvasRef.current) {
            animationFrameId = requestAnimationFrame(() => draw(canvasRef.current));
        }
        return () => cancelAnimationFrame(animationFrameId);
    }, [draw, imgObj]);

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

    const getDistance = (touches) => Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
    );

    const handleStart = (e) => {
        if (e.touches && e.touches.length === 2) {
            setIsDragging(false);
            setLastTouchDistance(getDistance(e.touches));
        } else {
            setLastTouchDistance(0); // Conflict fix
            setIsDragging(true);
            const pos = e.touches ? e.touches[0] : e;
            setLastPos({ x: pos.clientX, y: pos.clientY });
        }
    };

    const handleMove = (e) => {
        if (e.touches && e.touches.length === 2) {
            e.preventDefault();
            const currentDistance = getDistance(e.touches);
            if (lastTouchDistance > 0) {
                const scale = currentDistance / lastTouchDistance;
                // Functional update for buttery smooth zoom
                setZoom(prev => Math.min(Math.max(prev * scale, 0.5), 4));
            }
            setLastTouchDistance(currentDistance);
        } else if (isDragging) {
            if (e.touches) e.preventDefault();
            const pos = e.touches ? e.touches[0] : e;
            setOffset(prev => ({
                x: prev.x + (pos.clientX - lastPos.x),
                y: prev.y + (pos.clientY - lastPos.y)
            }));
            setLastPos({ x: pos.clientX, y: pos.clientY });
        }
    };

    const handleEnd = () => {
        setIsDragging(false);
        setLastTouchDistance(0);
    };

    const handleExport = () => {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = WIDTH;
        tempCanvas.height = HEIGHT;
        draw(tempCanvas);

        let quality = 0.92;
        let dataUrl = tempCanvas.toDataURL("image/jpeg", quality);
        const getSize = (s) => Math.round((s.length * 3) / 4 / 1024);

        while (getSize(dataUrl) > 50 && quality > 0.1) {
            quality -= 0.05;
            dataUrl = tempCanvas.toDataURL("image/jpeg", quality);
        }

        setFinalImage(dataUrl);
        setSizeKB(getSize(dataUrl));
        if (mode === "admission") localStorage.setItem("editedPhoto", dataUrl);
    };

    return (
        <div className="container-fluid py-3 mb-5 mb-lg-0">
            <div className="mx-auto" style={{ maxWidth: "900px" }}>
                <div className="row g-3">
                    {/* Editor Section */}
                    <div className={finalImage ? "col-lg-6" : "col-12 max-width-500 mx-auto"}>
                        <div className="card p-2 p-md-3 shadow-sm border-0 border-top border-primary border-4">
                            <div className="text-center mb-3">
                                <h6 className="fw-bold text-uppercase tracking-wider">Photo Editor Pro</h6>
                            </div>
                            
                            <input type="file" accept="image/*" onChange={handleImage} className="form-control form-control-sm mb-3 shadow-none" />

                            <div className="position-relative bg-light rounded-3 overflow-hidden d-flex justify-content-center align-items-center shadow-inner"
                                style={{
                                    height: "300px",
                                    touchAction: "none",
                                    border: "1px dashed #ccc",
                                    overscrollBehavior: "none",
                                    userSelect: "none",
                                    WebkitUserSelect: "none",
                                    willChange: "transform"
                                }}>
                                {!imgObj && <div className="text-center"><i className="bi bi-cloud-arrow-up fs-2 text-muted"></i><p className="small text-muted mb-0">Select Photo</p></div>}
                                
                                <div
                                    onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={handleEnd}
                                    onMouseLeave={handleEnd} onTouchStart={handleStart} onTouchMove={handleMove}
                                    onTouchEnd={handleEnd} onTouchCancel={handleEnd}
                                    style={{ cursor: isDragging ? "grabbing" : "grab" }}
                                >
                                    <canvas
                                        className="shadow-sm bg-white"
                                        ref={canvasRef}
                                        width={WIDTH}
                                        height={HEIGHT}
                                        style={{ width: "100%", maxWidth: "220px", height: "auto", display: imgObj ? "block" : "none" }}
                                    />
                                </div>
                            </div>

                            {imgObj && (
                                <div className="mt-4 px-2">
                                    <div className="mb-3">
                                        <label className="x-small fw-bold text-muted mb-1 d-block">ZOOM</label>
                                        <input type="range" className="form-range" min="0.5" max="4" step="0.01" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} />
                                    </div>
                                    <div className="mb-4">
                                        <label className="x-small fw-bold text-muted mb-1 d-block">ROTATION</label>
                                        <input type="range" className="form-range" min="-180" max="180" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))} />
                                    </div>
                                    <button onClick={handleExport} className="btn btn-primary btn-sm w-100 fw-bold shadow-sm py-2">APPLY CHANGES</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview Section */}
                    {finalImage && (
                        <div className="col-lg-6">
                            <div className="card p-3 shadow-sm border-0 h-100 text-center animate__animated animate__fadeIn">
                                <h6 className="fw-bold mb-3 small text-muted text-uppercase">Final Preview</h6>
                                <div className="mb-3">
                                    <img src={finalImage} alt="Final" className="img-thumbnail shadow-sm" style={{ width: "120px" }} />
                                </div>
                                <div className="px-md-4">
                                    <div className="badge bg-success mb-3 p-2 w-100">Optimized Size: {sizeKB} KB</div>
                                    {mode === "admission" ? (
                                        <button onClick={() => navigate("/new-admission")} className="btn btn-dark btn-sm w-100 fw-bold py-2 mb-2">UPDATE PHOTO</button>
                                    ) : (
                                        <a href={finalImage} download="passport_photo.jpg" className="btn btn-success btn-sm w-100 fw-bold py-2 mb-2">DOWNLOAD JPG</a>
                                    )}
                                    <button onClick={() => setFinalImage(null)} className="btn btn-link btn-sm text-decoration-none text-muted mt-1">Change Image</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}