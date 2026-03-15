import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom"; // Link import kiya
import { db } from "../../firebase/firebase";
import {
  collection, query, orderBy, onSnapshot, addDoc,
  updateDoc, deleteDoc, doc, serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";

// --- Sub-Components ---
const MemberCard = ({ member, onClick }) => (
  <div className="text-center me-2" style={{ cursor: "pointer" }} onClick={() => onClick(member)}>
    <div className="rounded-circle border border-primary d-flex justify-content-center align-items-center p-1 shadow-sm" style={{ width: 60, height: 60 }}>
      <img
        src={member.photoURL || `https://ui-avatars.com/api/?name=${member.name}&background=fff&color=007bff`}
        alt={member.name}
        className="rounded-circle"
        style={{ width: 54, height: 54, objectFit: "cover" }}
      />
    </div>
    <div className="text-truncate" style={{ maxWidth: 60, fontSize: 12 }}>{member.name}</div>
  </div>
);

const Message = ({ msg, isMe, isAdmin, onEdit, onDelete }) => (
  <div className={`d-flex mb-2 ${isMe ? "justify-content-end" : "justify-content-start"}`}>
    {!isMe && msg.senderPhoto && (
      <img src={msg.senderPhoto} alt="" className="rounded-circle me-2" style={{ width: 35, height: 35, objectFit: "cover" }} />
    )}
    <div style={{ maxWidth: "70%" }}>
      <div className={`p-2 rounded-3 shadow ${isMe ? "bg-primary text-white" : "bg-white text-dark"}`}>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <strong>{msg.senderName}</strong>
          <div className="d-flex gap-2 mx-1">
            {isMe && <i className="bi bi-pencil-fill" style={{ cursor: "pointer" }} onClick={() => onEdit(msg)}></i>}
            {(isMe || isAdmin) && <i className="bi bi-trash-fill" style={{ cursor: "pointer" }} onClick={() => onDelete(msg)}></i>}
          </div>
        </div>
        <div>{msg.message}</div>
        {msg.edited && <span className="opacity-75" style={{ fontSize: 10 }}> (edited) </span>}
        <div className={`text-end ${isMe ? "text-white-50" : "text-muted"}`} style={{ fontSize: 10 }}>
          {msg.timestamp?.toDate?.()?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  </div>
);

// --- Main Page ---
export default function ChatPage() {
  const { user, displayName, photoURL, isAdmin } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [members, setMembers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  // Helper: Normalize Member Data
  const formatMember = (d, roleType) => ({
    id: d.id, // path matching ke liye 'id' use kiya
    uid: d.id,
    name: d.data().name?.trim() || d.data().displayName?.trim() || d.data().fullName?.trim() || "Unknown",
    email: d.data().email || "N/A",
    phone: d.data().phone || "N/A",
    photoURL: d.data().photoURL || d.data().photoUrl || null,
    role: d.data().role || roleType,
    branch: d.data().branch || "N/A",
  });

  useEffect(() => {
    // Sync Users and Students
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      const usersData = snap.docs.map(d => formatMember(d, "user"));
      setMembers(prev => {
        const others = prev.filter(m => m.role === "student");
        return [...others, ...usersData].sort((a, b) => a.name.localeCompare(b.name));
      });
    });

    const unsubStudents = onSnapshot(collection(db, "admissions"), (snap) => {
      const studentsData = snap.docs.map(d => formatMember(d, "student"));
      setMembers(prev => {
        const others = prev.filter(m => m.role !== "student");
        return [...others, ...studentsData].sort((a, b) => a.name.localeCompare(b.name));
      });
    });

    const qMessages = query(collection(db, "chats"), orderBy("timestamp", "asc"));
    const unsubMsgs = onSnapshot(qMessages, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });

    return () => { unsubUsers(); unsubStudents(); unsubMsgs(); };
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.uid) return;

    try {
      if (editingId) {
        await updateDoc(doc(db, "chats", editingId), { message: newMessage.trim(), edited: true });
        setEditingId(null);
      } else {
        await addDoc(collection(db, "chats"), {
          senderId: user.uid,
          senderName: displayName || "Unknown",
          senderPhoto: photoURL || null,
          message: newMessage.trim(),
          timestamp: serverTimestamp(),
          edited: false,
        });
      }
      setNewMessage("");
    } catch (err) { console.error(err); }
  };

  const handleDeleteMessage = async (msg) => {
    if ((isAdmin || msg.senderId === user.uid) && window.confirm("Delete this message?")) {
      await deleteDoc(doc(db, "chats", msg.id));
    }
  };

  const handleEditInit = (msg) => {
    setEditingId(msg.id);
    setNewMessage(msg.message);
  };

  const membersToShow = isAdmin ? members : members.filter(m => m.role === "admin");

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      {/* Header */}
      <header className="d-flex align-items-center p-2 bg-success text-white shadow-sm">
        <i className="bi bi-arrow-left fs-4 me-3" style={{cursor: 'pointer'}} onClick={() => navigate(-1)}></i>
        <h5 className="flex-grow-1 m-0">Drishtee Chat</h5>
        <img src={photoURL || `https://ui-avatars.com/api/?name=${displayName}`} alt="me" className="rounded-circle" style={{ width: 35, height: 35 }} />
      </header>

      {/* Horizontal Member List */}
      <div className="d-flex overflow-auto p-2 bg-white border-bottom">
        {membersToShow.map(m => <MemberCard key={m.uid} member={m} onClick={setSelectedMember} />)}
      </div>

      {/* Messages Area */}
      <main className="flex-grow-1 overflow-auto p-2">
        {messages.map(msg => (
          <Message key={msg.id} msg={msg} isMe={msg.senderId === user.uid} isAdmin={isAdmin} onEdit={handleEditInit} onDelete={handleDeleteMessage} />
        ))}
        <div ref={messagesEndRef}></div>
      </main>

      {/* Input Form */}
      <form className="d-flex p-2 border-top bg-white mb-5" onSubmit={handleSendMessage}>
        <input
          className="form-control rounded-pill me-2 mb-4 mb-lg-0"
          placeholder={editingId ? "Edit message..." : "Type a message..."}
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
        />
        <button type="submit" className={`btn ${editingId ? 'btn-warning' : 'btn-primary'} rounded-circle`} style={{ width: 45, height: 45 }}>
          <i className={`bi ${editingId ? 'bi-check-lg' : 'bi-send-fill'}`}></i>
        </button>
      </form>

      {/* Profile Modal */}
      {selectedMember && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow-lg border-0">
                <div className="modal-header border-0 pb-0">
                  <button type="button" className="btn-close" onClick={() => setSelectedMember(null)}></button>
                </div>
                <div className="modal-body text-center pb-4">
                  <img src={selectedMember.photoURL || `https://ui-avatars.com/api/?name=${selectedMember.name}`} className="rounded-circle mb-3 border p-1" style={{ width: 100, height: 100, objectFit: "cover" }} />
                  <h4>{selectedMember.name}</h4>
                  <span className="badge bg-info text-dark mb-3 text-capitalize">{selectedMember.role}</span>
                  
                  {/* Admin specific Student details */}
                  {isAdmin && selectedMember.role === "student" && (
                    <div className="mt-2 w-100">
                      <p className="mb-3 text-muted"><strong>Branch:</strong> {selectedMember.branch}</p>
                      
                      {/* VIEW PROFILE LINK ADDED HERE */}
                      <Link to={`/admin/students/${selectedMember.id}`} className="text-decoration-none">
                        <button className="btn btn-light w-100 fw-semibold rounded-3 py-2 border">
                          View Profile
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setSelectedMember(null)}></div>
        </>
      )}
    </div>
  );
}