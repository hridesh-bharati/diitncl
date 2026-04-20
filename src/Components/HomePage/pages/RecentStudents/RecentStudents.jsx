import React, { useEffect, useState } from "react";
import { db, auth } from "../../../../firebase/firebase";
import { collection, query, orderBy, onSnapshot, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { sendFriendRequest, cancelRequest } from "./socialActions";

export default function RecentStudents() {
  const [students, setStudents] = useState([]);
  const [socialDataMap, setSocialDataMap] = useState({}); 
  const myEmail = auth.currentUser?.email;

  useEffect(() => {
    if (!myEmail) return;
    const q = query(collection(db, "admissions"), orderBy("createdAt", "desc"));
    const unsubStudents = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(list.filter(s => s.id !== myEmail));
      
      snapshot.docs.forEach(sDoc => {
        onSnapshot(doc(db, "socialProfiles", sDoc.id), (sSnap) => {
          if (sSnap.exists()) setSocialDataMap(prev => ({ ...prev, [sDoc.id]: sSnap.data() }));
        });
      });
    });
    return () => unsubStudents();
  }, [myEmail]);

  return (
    <div className="container-fluid px-3 py-4">
      <h6 className="fw-bold mb-3 text-secondary" style={{fontSize: '13px'}}>People you may know</h6>
      <div className="d-flex gap-2 overflow-auto pb-3 custom-scrollbar">
        {students.map((s) => {
          const sSocial = socialDataMap[s.id];
          const isFriend = sSocial?.followers?.includes(myEmail);
          const iRequested = sSocial?.pendingRequests?.includes(myEmail);

          return (
            <div key={s.id} className="bg-white rounded-3 border shadow-sm" style={{ minWidth: "150px" }}>
              <Link to={`/profile/${s.id}`} className="text-decoration-none">
                <img src={s.photoUrl} className="w-100 object-fit-cover rounded-top" style={{ height: "130px" }} />
                <div className="p-2 text-dark">
                    <h6 className="fw-bold mb-0 text-truncate small">{s.name}</h6>
                    <p className="text-muted small mb-2">{s.course}</p>
                </div>
              </Link>
              <div className="p-2 pt-0">
                <button 
                  onClick={() => iRequested ? cancelRequest(myEmail, s.id) : sendFriendRequest(myEmail, s.id)}
                  disabled={isFriend}
                  className={`btn btn-sm w-100 fw-bold ${isFriend ? 'btn-light border' : iRequested ? 'btn-secondary text-white' : 'btn-primary'}`}
                >
                  {isFriend ? "Friends" : iRequested ? "Cancel" : "Add Friend"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}