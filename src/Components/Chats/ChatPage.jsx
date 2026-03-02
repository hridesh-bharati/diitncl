// src/Components/Chat/ChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";

// ----------------------- MEMBER CARD -----------------------
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

// ----------------------- MESSAGE -----------------------
const Message = ({ msg, isMe, isAdmin, onEdit, onDelete }) => (
  <div className={`d-flex mb-2 ${isMe ? "justify-content-end" : "justify-content-start"}`}>
    {!isMe && msg.senderPhoto && (
      <img src={msg.senderPhoto} alt="" className="rounded-circle me-2" style={{ width: 35, height: 35, objectFit: "cover" }} />
    )}
    <div style={{ maxWidth: "70%" }}>
      <div className={`p-2 rounded-3 shadow ${isMe ? "bg-primary text-white" : "bg-white text-dark"}`}>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <strong>{msg.senderName}</strong>
          <div className="d-flex gap-2">
            {isMe && <i className="bi bi-pencil-fill" style={{ cursor: "pointer" }} onClick={() => onEdit(msg)}></i>}
            {(isMe || isAdmin) && <i className="bi bi-trash-fill" style={{ cursor: "pointer" }} onClick={() => onDelete(msg)}></i>}
          </div>
        </div>
        <div>{msg.message}</div>
        {msg.edited && <span className="text-muted" style={{ fontSize: 10 }}> (edited) </span>}
        <div className="text-end text-muted" style={{ fontSize: 10 }}>
          {msg.timestamp?.toDate?.()?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  </div>
);

// ----------------------- CHAT PAGE -----------------------
export default function ChatPage() {
  const { user, displayName, photoURL, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [members, setMembers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const messagesEndRef = useRef(null);

  // ------------------- FETCH MEMBERS -------------------
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      const users = snap.docs.map((d) => ({
        uid: d.id,
        name: d.data().name?.trim() || d.data().displayName?.trim() || "Unknown",
        email: d.data().email || "N/A",
        phone: d.data().phone || "N/A",
        photoURL: d.data().photoURL || d.data().photoUrl || null,
        role: d.data().role || "user",
      }));
      setMembers(prev => {
        const students = prev.filter(m => m.role === "student");
        return [...students, ...users].sort((a, b) => a.name.localeCompare(b.name));
      });
    });

    const unsubStudents = onSnapshot(collection(db, "admissions"), (snap) => {
      const students = snap.docs.map((d) => ({
        uid: d.id,
        name: d.data().name?.trim() || d.data().fullName?.trim() || "Unknown",
        email: d.data().email || "N/A",
        phone: d.data().phone || "N/A",
        photoURL: d.data().photoURL || d.data().photoUrl || null,
        role: "student",
        branch: d.data().branch || "N/A",
      }));
      setMembers(prev => {
        const users = prev.filter(m => m.role !== "student");
        return [...users, ...students].sort((a, b) => a.name.localeCompare(b.name));
      });
    });

    return () => {
      unsubUsers();
      unsubStudents();
    };
  }, []);

  // ------------------- FETCH MESSAGES -------------------
  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return () => unsubscribe();
  }, []);

  // ------------------- SEND / EDIT MESSAGE -------------------
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.uid) return;

    try {
      if (editingId) {
        await updateDoc(doc(db, "chats", editingId), { message: editingText.trim(), edited: true });
        setEditingId(null);
        setEditingText("");
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (msg) => {
    if (!(isAdmin || msg.senderId === user.uid)) return;
    if (!window.confirm("Delete this message?")) return;
    try {
      await deleteDoc(doc(db, "chats", msg.id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditMessage = (msg) => {
    if (msg.senderId === user.uid) {
      setEditingId(msg.id);
      setEditingText(msg.message);
      setNewMessage(msg.message);
    }
  };

  // ------------------- PROFILE MODAL -------------------
  const openProfileModal = (member) => {
    setSelectedMember(member);
    setShowProfileModal(true);
  };

  const handleDeleteStudent = async () => {
    if (!selectedMember || !window.confirm(`Delete ${selectedMember.name}?`)) return;
    try {
      await deleteDoc(doc(db, "admissions", selectedMember.uid));
      setMembers(prev => prev.filter(m => m.uid !== selectedMember.uid));
      setShowProfileModal(false);
      setSelectedMember(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------- RENDER MEMBERS -------------------
  const renderMembers = () => {
    const membersToShow = isAdmin ? members : members.filter(m => m.role === "admin");
    return membersToShow.map(m => <MemberCard key={m.uid} member={m} onClick={openProfileModal} />);
  };

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      {/* Header */}
      <div className="d-flex align-items-center p-2 bg-success text-white shadow-sm">
        <button className="btn btn-link text-white p-0 me-2" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <h5 className="flex-grow-1 m-0">Drishtee Member Chat</h5>
        <img src={photoURL || `https://ui-avatars.com/api/?name=${displayName}&background=075E54&color=fff`} alt="avatar" className="rounded-circle" style={{ width: 35, height: 35, objectFit: "cover" }} />
      </div>

      {/* Members */}
      <div className="d-flex overflow-auto p-2 bg-white border-bottom">{renderMembers()}</div>

      {/* Messages */}
      <div className="flex-grow-1 overflow-auto p-2 d-flex flex-column">
        {messages.map(msg => (
          <Message key={msg.id} msg={msg} isMe={msg.senderId === user.uid} isAdmin={isAdmin} onEdit={handleEditMessage} onDelete={handleDeleteMessage} />
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <form className="d-flex p-2 border-top bg-white" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="form-control rounded-pill me-2"
          placeholder="Type a message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          disabled={!user}
        />
        <button type="submit" className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: 45, height: 45 }}>
          <i className="bi bi-send-fill"></i>
        </button>
      </form>

      {/* Profile Modal */}
      {showProfileModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Profile</h5>
                  <button type="button" className="btn-close" onClick={() => setShowProfileModal(false)}></button>
                </div>
                <div className="modal-body text-center">
                  <img
                    src={selectedMember?.photoURL || `https://ui-avatars.com/api/?name=${selectedMember?.name}&background=007bff&color=fff`}
                    alt=""
                    className="rounded-circle mb-3"
                    style={{ width: 120, height: 120, objectFit: "cover" }}
                  />
                  <h5>{selectedMember?.name}</h5>
                  <p><strong>Role:</strong> {selectedMember?.role}</p>
                  {isAdmin && selectedMember?.role === "student" && <p><strong>Branch:</strong> {selectedMember?.branch}</p>}
                </div>
                {isAdmin && selectedMember?.role === "student" && (
                  <div className="modal-footer justify-content-center">
                    <button type="button" className="btn btn-danger" onClick={handleDeleteStudent}>
                      Delete Student
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowProfileModal(false)}></div>
        </>
      )}
    </div>
  );
}