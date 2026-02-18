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
import { Modal } from "react-bootstrap";
import { IoSend, IoClose } from "react-icons/io5";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

// ----------------------- MEMBER CARD -----------------------
const MemberCard = ({ member, onClick }) => (
  <div style={{ textAlign: "center", cursor: "pointer" }} onClick={() => onClick(member)}>
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: "50%",
        padding: 2,
        background: "linear-gradient(45deg, #007bff, #0056b3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
      }}
    >
      <img
        src={member.photoURL || `https://ui-avatars.com/api/?name=${member.name}&background=fff&color=007bff`}
        alt={member.name}
        style={{ width: 54, height: 54, borderRadius: "50%", objectFit: "cover" }}
      />
    </div>
    <div
      style={{
        fontSize: 12,
        maxWidth: 60,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginTop: 4,
      }}
    >
      {member.name}
    </div>
  </div>
);

// ----------------------- MESSAGE -----------------------
const Message = ({ msg, isMe, isAdmin, onEdit, onDelete }) => (
  <div style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: 8 }}>
    {!isMe && msg.senderPhoto && (
      <img
        src={msg.senderPhoto}
        alt=""
        style={{ width: 35, height: 35, borderRadius: "50%", objectFit: "cover", marginRight: 5 }}
      />
    )}
    <div style={{ maxWidth: "70%", position: "relative" }}>
      <div
        style={{
          background: isMe ? "#007bff" : "#fff",
          color: isMe ? "#fff" : "#000",
          borderRadius: 15,
          padding: "10px 12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
          <strong>{msg.senderName}</strong>
          <div style={{ display: "flex", gap: 5 }}>
            {isMe && <FiEdit2 style={{ cursor: "pointer" }} onClick={() => onEdit(msg)} />}
            {(isMe || isAdmin) && <FiTrash2 style={{ cursor: "pointer" }} onClick={() => onDelete(msg)} />}
          </div>
        </div>
        <div>{msg.message}</div>
        {msg.edited && <span style={{ fontSize: 10, color: "#555" }}> (edited) </span>}
        <div style={{ fontSize: 10, color: "#777", textAlign: "right" }}>
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
      setMembers((prev) => {
        const students = prev.filter((m) => m.role === "student");
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
      setMembers((prev) => {
        const users = prev.filter((m) => m.role !== "student");
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
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
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
      setMembers((prev) => prev.filter((m) => m.uid !== selectedMember.uid));
      setShowProfileModal(false);
      setSelectedMember(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------- RENDER MEMBERS -------------------
  const renderMembers = () => {
    // Only admins see students
    const membersToShow = isAdmin
      ? members
      : members.filter((m) => m.role === "admin");

    return membersToShow.map((m) => <MemberCard key={m.uid} member={m} onClick={openProfileModal} />);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "linear-gradient(to bottom, #f5f5f5, #e0e0e0)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: 10, backgroundColor: "#075E54", color: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#fff", fontSize: 18, marginRight: 10 }}>←</button>
        <h3 style={{ flexGrow: 1, margin: 0 }}>Global Chat</h3>
        <img src={photoURL || `https://ui-avatars.com/api/?name=${displayName}&background=075E54&color=fff`} alt="avatar" style={{ width: 35, height: 35, borderRadius: "50%", objectFit: "cover", marginLeft: 5 }} />
      </div>

      {/* Members */}
      <div style={{ display: "flex", overflowX: "auto", padding: "10px 5px", gap: 12, background: "#fff", borderBottom: "1px solid #ddd" }}>
        {renderMembers()}
      </div>

      {/* Messages */}
      <div style={{ flexGrow: 1, overflowY: "auto", padding: 10, display: "flex", flexDirection: "column" }}>
        {messages.map((msg) => (
          <Message
            key={msg.id}
            msg={msg}
            isMe={msg.senderId === user.uid}
            isAdmin={isAdmin}
            onEdit={handleEditMessage}
            onDelete={handleDeleteMessage}
          />
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} style={{ display: "flex", padding: 10, paddingBottom: window.innerWidth <= 768 ? 110 : 10, background: "#f9f9f9", borderTop: "1px solid #ddd", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ flexGrow: 1, borderRadius: 50, padding: "10px 15px", border: "1px solid #ccc", marginRight: 8, outline: "none" }}
          disabled={!user}
        />
        <button type="submit" style={{ background: "#007bff", border: "none", borderRadius: "50%", width: 45, height: 45, display: "flex", justifyContent: "center", alignItems: "center", color: "#fff", fontSize: 20 }}>
          <IoSend />
        </button>
      </form>

      {/* Profile Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
        <div style={{ padding: 20, textAlign: "center" }}>
          <IoClose style={{ position: "absolute", top: 15, right: 15, fontSize: 24, cursor: "pointer" }} onClick={() => setShowProfileModal(false)} />
          <img src={selectedMember?.photoURL || `https://ui-avatars.com/api/?name=${selectedMember?.name}&background=007bff&color=fff`} alt="" style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", marginBottom: 10 }} />
          <h3>{selectedMember?.name}</h3>
          <p><strong>Role:</strong> {selectedMember?.role}</p>
          {isAdmin && selectedMember?.role === "student" && <p><strong>Branch:</strong> {selectedMember?.branch}</p>}
          {isAdmin && selectedMember?.role === "student" && (
            <button onClick={handleDeleteStudent} style={{ background: "#ff4d4f", color: "#fff", border: "none", padding: "8px 15px", borderRadius: 8, marginTop: 10 }}>Delete Student</button>
          )}
        </div>
      </Modal>
    </div>
  );
}
