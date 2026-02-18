
// src\AdminComponents\Queries\Contacts.jsx
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase/firebase';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { addDoc } from "firebase/firestore";

export default function Contacts() {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const previousLength = useRef(0); 
    
    // Modal States
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    // Notification permission lene ke liye
    useEffect(() => {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

   useEffect(() => {
  async function setupPush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const reg = await navigator.serviceWorker.ready;

    const existingSub = await reg.pushManager.getSubscription();
    if (existingSub) {
      console.log("Already subscribed");
      return;
    }

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: "BFIacnaHPzbs9l-bgfn5dDkpKy4XZ8wdqABEI5dIT4rzuNXnVyVtrVQ6ebtlkyaPFACdUrCC9gSIRUWbiv27_qk"
    });

    await addDoc(collection(db, "adminSubscriptions"), {
      subscription,
      createdAt: new Date()
    });

    console.log("Push subscription saved");
  }

  setupPush();
}, []);

    // Function to trigger modal
    const confirmDelete = (id) => {
        setSelectedId(id);
        setShowModal(true);
    };

    // Actual Delete Logic
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await deleteDoc(doc(db, "studentQueries", selectedId));
                toast.success("Query deleted successfully");
            } catch (error) {
                toast.error("Error deleting query");
            } finally {
                setShowModal(false);
                setSelectedId(null);
            }
        }
    };

    const markAsRead = async (id, currentStatus) => {
        const newStatus = currentStatus === 'pending' ? 'reviewed' : 'pending';
        await updateDoc(doc(db, "studentQueries", id), { status: newStatus });
    };

    return (
        <div className="container-fluid py-4 bg-light min-vh-100 position-relative">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-dark">Student Enquiries 
                    <span className="badge bg-primary ms-2">{queries.length}</span>
                    {queries.filter(q => q.status === 'pending' || !q.status).length > 0 && (
                        <span className="badge bg-danger ms-2 pulse">
                            {queries.filter(q => q.status === 'pending' || !q.status).length} new
                        </span>
                    )}
                </h3>
            </div>

            {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : (
              <div className="row g-3 mb-4 pb-4 mb-md-0 pb-md-0">
                    {queries.map((item) => (
                        <div className="col-xl-4 col-md-6" key={item.id} id={`query-${item.id}`}>
                            <div className={`card h-100 border-0 shadow-sm admin-query-card ${item.status === 'pending' ? 'border-start border-4 border-warning new-query-flash' : ''}`}>
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="user-avatar bg-soft-primary text-primary">
                                            {item.fullName?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className={`badge ${item.status === 'pending' ? 'bg-warning text-dark' : 'bg-success text-white'}`}>
                                            {item.status || 'new'}
                                        </span>
                                    </div>

                                    <h5 className="fw-bold mb-1">{item.fullName}</h5>
                                    <p className="text-muted small mb-3"><i className="bi bi-clock me-1"></i> {item.timestamp?.toDate().toLocaleString()}</p>
                                    
                                    <div className="query-box bg-light p-3 rounded-3 mb-3">
                                        <h6 className="fw-bold small text-uppercase text-secondary">Subject: {item.title}</h6>
                                        <p className="mb-0 text-dark small text-truncate-2">{item.query}</p>
                                    </div>

                                    <div className="contact-links mb-3">
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <i className="bi bi-telephone text-primary small"></i>
                                            <a href={`tel:${item.mobile}`} className="text-decoration-none text-dark small">{item.mobile}</a>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <i className="bi bi-envelope text-danger small"></i>
                                            <span className="text-dark small text-truncate">{item.email}</span>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2 pt-3 border-top mt-auto">
                                        <button className="btn btn-sm btn-outline-success flex-grow-1" onClick={() => markAsRead(item.id, item.status)}>
                                            <i className={`bi ${item.status === 'pending' ? 'bi-check2-circle' : 'bi-arrow-counterclockwise'}`}></i> {item.status === 'pending' ? 'Done' : 'Undo'}
                                        </button>
                                        <a href={`https://wa.me/91${item.mobile}?text=Hello ${item.fullName}`} target="_blank" className="btn btn-sm btn-outline-primary">
                                            <i className="bi bi-whatsapp"></i>
                                        </a>
                                        {/* Updated Delete Button */}
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => confirmDelete(item.id)}>
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- CUSTOM CENTERED MODAL --- */}
            {showModal && (
                <div className="modal-overlay d-flex align-items-center justify-content-center">
                    <div className="modal-content-custom shadow-lg p-4 bg-white text-center">
                        <div className="icon-circle bg-light-danger text-danger mb-3 mx-auto">
                            <i className="bi bi-exclamation-triangle fs-2"></i>
                        </div>
                        <h4 className="fw-bold">Delete Enquiry?</h4>
                        <p className="text-muted">Kya aap sure hain? Ye action wapas nahi liya ja sakega.</p>
                        <div className="d-flex gap-2 mt-4">
                            <button className="btn btn-light w-100 py-2 fw-semibold" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-danger w-100 py-2 fw-semibold shadow-sm" onClick={handleDelete}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}

            <style>
                {`
                .admin-query-card { transition: all 0.3s ease; border-radius: 16px; }
                .admin-query-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
                .user-avatar { width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 12px; font-weight: bold; font-size: 1.2rem; }
                .bg-soft-primary { background-color: #eef4ff; }
                .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .badge { font-weight: 500; padding: 6px 12px; border-radius: 8px; }

                /* New Query Animation */
                .new-query-flash {
                    animation: flash 2s ease;
                }
                
                .highlight-new {
                    animation: highlightFlash 2s ease;
                }
                
                @keyframes flash {
                    0% { border-left-color: #ffc107; }
                    50% { border-left-color: #ffc107; box-shadow: 0 0 15px #ffc107; }
                    100% { border-left-color: #ffc107; }
                }
                
                @keyframes highlightFlash {
                    0% { background-color: #fff3cd; }
                    50% { background-color: #fff3cd; }
                    100% { background-color: transparent; }
                }
                
                .pulse {
                    animation: pulse 1.5s infinite;
                }
                
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }

                /* Modal Specific Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(4px);
                    z-index: 9999;
                }
                .modal-content-custom {
                    width: 90%;
                    max-width: 380px;
                    border-radius: 24px;
                    animation: slideIn 0.3s ease-out;
                }
                .bg-light-danger { background: #ffebeb; color: #dc3545; }
                .icon-circle { width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

                @keyframes slideIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                `}
            </style>
        </div>
    );
}