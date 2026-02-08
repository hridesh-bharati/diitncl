import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { 
  Book, Clock, Award, Calendar, 
  BellFill, CreditCard2Back, PatchCheckFill, 
  FileEarmarkArrowDown, Whatsapp, PersonFill 
} from "react-bootstrap-icons";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user?.email) return;

    const q = query(collection(db, "admissions"), where("email", "==", user.email.trim().toLowerCase()));
    const unsubData = onSnapshot(q, (snap) => {
      if (!snap.empty) setData(snap.docs[0].data());
      setLoading(false);
    });

    const nQ = query(collection(db, "notices"), orderBy("createdAt", "desc"));
    const unsubNotice = onSnapshot(nQ, (snap) => {
      setNotices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubData(); unsubNotice(); };
  }, [user]);

  if (loading) return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-white">
      <div className="spinner-grow text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="p-3" style={{ backgroundColor: "#F4F7FE", minHeight: "100vh", paddingBottom: "40px" }}>
      
      {/* 1. PREMIUM PROFILE BANNER */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden shadow" 
           style={{ background: "linear-gradient(135deg, #1e3c72, #2a5298)" }}>
        <div className="p-4 text-white">
          <div className="d-flex align-items-center mb-3">
            <img src={data?.photoUrl || `https://ui-avatars.com/api/?name=${data?.name}&background=random`} 
                 className="rounded-circle border border-3 border-white shadow-sm" 
                 style={{ width: 75, height: 75, objectFit: 'cover' }} 
                 alt="profile" />
            <div className="ms-3">
              <h5 className="fw-bold mb-0">{data?.name || "Student Name"}</h5>
              <small className="opacity-75">{data?.course || "Enrolled Course"}</small>
            </div>
          </div>
          <div className="row g-2 bg-white bg-opacity-10 rounded-4 p-3 text-center mx-0 border border-white border-opacity-10">
            <div className="col-6 border-end border-white border-opacity-25">
              <div className="small opacity-75" style={{ fontSize: '0.65rem' }}>REGISTRATION NO</div>
              <div className="fw-bold small">{data?.regNo || "N/A"}</div>
            </div>
            <div className="col-6">
              <div className="small opacity-75" style={{ fontSize: '0.65rem' }}>STATUS</div>
              <div className="fw-bold small">
                <span className="badge bg-success rounded-pill px-3">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. COLORFUL STAT CARDS GRID */}
      <div className="row g-3 mb-4">
        <StatCard 
          icon={<Book size={20}/>} 
          label="Course" 
          value={data?.course} 
          grad="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
        />
        <StatCard 
          icon={<Clock size={20}/>} 
          label="Reg No" 
          value={data?.regNo} 
          grad="linear-gradient(135deg, #02aab0 0%, #00cdac 100%)" 
        />
        <StatCard 
          icon={<Award size={20}/>} 
          label="Status" 
          value={data?.status || "Active"} 
          grad="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" 
        />
        <StatCard 
          icon={<Calendar size={20}/>} 
          label="Adm. Date" 
          value={data?.admissionDate || data?.issueDate} 
          grad="linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" 
        />
      </div>

      <div className="row g-3">
        {/* 3. FEAT CARDS */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white border-start border-5 border-primary">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="fw-bold text-muted small">PENDING FEES</h6>
                <h3 className="fw-bold text-dark mb-0">₹{data?.dueAmount || "0"}</h3>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded-4 text-primary">
                <CreditCard2Back size={26} />
              </div>
            </div>
            <button className="btn btn-primary w-100 rounded-pill fw-bold py-2 mt-3 shadow-sm">View Ledger</button>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white border-start border-5 border-success">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="fw-bold text-muted small">EXAM STATUS</h6>
                <div className="d-flex align-items-center">
                  <PatchCheckFill className="text-success me-2" size={18} />
                  <span className="fw-bold text-dark">Qualified</span>
                </div>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded-4 text-success">
                <Award size={26} />
              </div>
            </div>
            <button className="btn btn-outline-success w-100 rounded-pill fw-bold py-2 mt-3"
                    onClick={() => navigate("/student/certificate")}>
              Download Certificate
            </button>
          </div>
        </div>

        {/* 4. NOTICE BOARD */}
        <div className="col-12 mt-2">
          <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light bg-opacity-50">
              <h6 className="fw-bold mb-0 d-flex align-items-center">
                <BellFill className="text-danger me-2 animate-pulse" /> Latest Notices
              </h6>
            </div>
            <div className="p-0" style={{ maxHeight: '180px', overflowY: 'auto' }}>
              {notices.length > 0 ? notices.map((n, i) => (
                <div key={n.id} className="p-3 border-bottom border-light">
                  <div className="fw-bold small text-dark">{n.title}</div>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.75rem' }}>{n.message}</p>
                </div>
              )) : (
                <div className="p-4 text-center text-muted small">No updates yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* 5. QUICK ACTIONS */}
        <div className="col-12 mt-2 mb-5 pb-5">
          <div className="row g-2">
            <ActionItem icon={<PersonFill />} label="Profile" onClick={() => navigate("/student/profile")} />
            <ActionItem icon={<FileEarmarkArrowDown />} label="Docs" onClick={() => navigate("/student/documents")} />
            <ActionItem icon={<Whatsapp />} label="Support" onClick={() => window.open('https://wa.me/91XXXXXXXXXX')} color="#25D366" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- COLORFUL HELPER COMPONENTS ---

function StatCard({ icon, label, value, grad }) {
  return (
    <div className="col-6 col-md-3">
      <div className="card border-0 shadow-sm rounded-4 p-3 h-100 text-white" 
           style={{ background: grad, minHeight: '110px' }}>
        <div className="mb-2 bg-white bg-opacity-20 d-inline-flex p-2 rounded-3 shadow-sm" style={{ width: 'fit-content' }}>
          {icon}
        </div>
        <div className="fw-bold opacity-75 mb-1" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>{label.toUpperCase()}</div>
        <div className="fw-bold text-truncate" style={{ fontSize: '0.85rem' }}>{value || "---"}</div>
      </div>
    </div>
  );
}

function ActionItem({ icon, label, onClick, color = "#4361ee" }) {
  return (
    <div className="col-4" onClick={onClick} role="button">
      <div className="card border-0 shadow-sm p-3 rounded-4 bg-white text-center h-100">
        <div className="mb-1" style={{ color: color }}>{React.cloneElement(icon, { size: 22 })}</div>
        <div className="fw-bold text-dark" style={{ fontSize: '0.75rem' }}>{label}</div>
      </div>
    </div>
  );
}