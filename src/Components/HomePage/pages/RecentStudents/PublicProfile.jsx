import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db, auth } from "../../../../firebase/firebase";
import { doc, onSnapshot, collection, query, where, getDocs } from "firebase/firestore";
import { sendFriendRequest, cancelRequest, handleFriendAction } from "./socialActions";

export default function PublicProfile() {
    const { userId } = useParams();
    const [official, setOfficial] = useState(null);
    const [social, setSocial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalData, setModalData] = useState({ show: false, title: "", users: [] });
    const myEmail = auth.currentUser?.email;

    useEffect(() => {
        if (!userId) return;
        const unsubOff = onSnapshot(doc(db, "admissions", userId), (s) => setOfficial(s.data()));
        const unsubSoc = onSnapshot(doc(db, "socialProfiles", userId), (s) => {
            setSocial(s.data() || { followers: [], following: [], pendingRequests: [] });
            setLoading(false);
        });
        return () => { unsubOff(); unsubSoc(); };
    }, [userId]);

    // ✨ Professional List Fetcher for Modal
    const openListModal = async (emails, title) => {
        if (!emails || emails.length === 0) {
            setModalData({ show: true, title, users: [] });
            return;
        }
        const q = query(collection(db, "admissions"), where("__name__", "in", emails));
        const snap = await getDocs(q);
        const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setModalData({ show: true, title, users });
    };

    if (loading) return <div className="vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary"></div></div>;

    const isFriend = social?.followers?.includes(myEmail);
    const iRequested = social?.pendingRequests?.includes(myEmail);
    const isMyProfile = myEmail === userId;

    return (
        <div className="pb-5 bg-light min-vh-100">
            {/* Header */}
            <div className="position-relative mb-5" style={{ height: '160px', background: 'linear-gradient(45deg, #0866ff, #00c6ff)' }}>
                <img src={official?.photoUrl} className="position-absolute start-50 translate-middle-x rounded-circle border border-4 border-white shadow-lg" 
                     style={{ width: '120px', height: '120px', bottom: '-60px', objectFit: 'cover' }} alt="Avatar" />
            </div>

            <div className="container mt-5 pt-3 text-center">
                <h4 className="fw-bold mb-0">{official?.name}</h4>
                <p className="text-muted small mb-4">{official?.course} Student</p>

                {/* --- STATS BAR (Clickable) --- */}
                <div className="row g-0 mx-3 mb-4 bg-white rounded-4 shadow-sm border py-2">
                    <div className="col-4 border-end" style={{cursor:'pointer'}} onClick={() => openListModal(social.followers, "Friends")}>
                        <h6 className="fw-bold mb-0">{social?.followers?.length || 0}</h6>
                        <small className="text-muted small">Friends</small>
                    </div>
                    <div className="col-4 border-end" style={{cursor:'pointer'}} onClick={() => openListModal(social.following, "Following")}>
                        <h6 className="fw-bold mb-0">{social?.following?.length || 0}</h6>
                        <small className="text-muted small">Following</small>
                    </div>
                    <div className="col-4" style={{cursor:'pointer'}} onClick={() => isMyProfile && openListModal(social.pendingRequests, "Friend Requests")}>
                        <h6 className="fw-bold mb-0 text-primary">{social?.pendingRequests?.length || 0}</h6>
                        <small className="text-muted small">{isMyProfile ? "Requests" : "Social"}</small>
                    </div>
                </div>

                {/* Main Action Buttons */}
                <div className="px-4 mb-4">
                    {!isMyProfile ? (
                        isFriend ? (
                            <button onClick={() => handleFriendAction(myEmail, userId, "unfriend")} className="btn btn-light border w-100 rounded-pill fw-bold">Unfriend</button>
                        ) : iRequested ? (
                            <button onClick={() => cancelRequest(myEmail, userId)} className="btn btn-secondary w-100 rounded-pill fw-bold text-white">Cancel Request</button>
                        ) : (
                            <button onClick={() => sendFriendRequest(myEmail, userId)} className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm">Add Friend</button>
                        )
                    ) : (
                        <Link to="/student/account" className="btn btn-dark w-100 rounded-pill fw-bold">Edit Profile</Link>
                    )}
                </div>

                <div className="px-4 text-start">
                    <h6 className="fw-bold small text-secondary mb-3">ABOUT</h6>
                    <div className="bg-white p-3 rounded-4 shadow-sm border">
                        <p className="small mb-1"><i className="bi bi-geo-alt text-danger me-2"></i>{official?.city}, {official?.state}</p>
                        <p className="small mb-0"><i className="bi bi-info-circle text-primary me-2"></i>{social?.bio || "Student at Drishtee Computer Centre"}</p>
                    </div>
                </div>
            </div>

            {/* --- REAL-TIME MODAL LIST --- */}
            {modalData.show && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-end align-items-md-center justify-content-center" 
                     style={{ zIndex: 1050, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                     onClick={() => setModalData({ ...modalData, show: false })}>
                    
                    <div className="bg-white w-100 rounded-top-5 p-3 shadow-lg animate__animated animate__slideInUp" 
                         style={{ maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto' }}
                         onClick={e => e.stopPropagation()}>
                        
                        <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                            <h6 className="fw-bold m-0">{modalData.title}</h6>
                            <button className="btn-close" onClick={() => setModalData({ ...modalData, show: false })}></button>
                        </div>

                        <div className="list-group list-group-flush">
                            {modalData.users.length > 0 ? modalData.users.map(u => (
                                <div key={u.id} className="list-group-item d-flex align-items-center justify-content-between border-0 px-2 py-3">
                                    <Link to={`/profile/${u.id}`} onClick={() => setModalData({...modalData, show:false})} className="d-flex align-items-center text-decoration-none text-dark">
                                        <img src={u.photoUrl} className="rounded-circle me-3" style={{width:'45px', height:'45px', objectFit:'cover'}} />
                                        <div>
                                            <p className="mb-0 fw-bold small">{u.name}</p>
                                            <p className="mb-0 text-muted" style={{fontSize:'10px'}}>{u.course}</p>
                                        </div>
                                    </Link>
                                    
                                    {/* Action Buttons inside Modal (Specifically for Requests) */}
                                    {modalData.title === "Friend Requests" && (
                                        <div className="d-flex gap-1">
                                            <button onClick={() => handleFriendAction(myEmail, u.id, "accept")} className="btn btn-sm btn-primary px-3 rounded-pill">Confirm</button>
                                            <button onClick={() => handleFriendAction(myEmail, u.id, "decline")} className="btn btn-sm btn-light border rounded-pill">Delete</button>
                                        </div>
                                    )}
                                </div>
                            )) : <p className="text-center text-muted py-5">No profiles found here.</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}