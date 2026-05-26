import React, { useState, useMemo, useEffect } from 'react';
import AdmissionProvider from '../../AdminComponents/Admissions/AdmissionProvider';
import { db } from '../../firebase/firebase';
import { authListener, getCurrentUserProfile } from '../../firebase/auth';
import { collection, addDoc, query, onSnapshot, orderBy, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';

const BirthdayCard = ({ student, isToday, currentUser }) => {
  const photo = student.photoUrl || student.photoURL || student.image || student.avatar;
  const name = student.name || student.studentName || "Student";
  const [wishText, setWishText] = useState('');
  const [guestName, setGuestName] = useState('');
  const [wishes, setWishes] = useState([]);
  const [myGuestWishes, setMyGuestWishes] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('my_bday_wishes') || '[]');
    setMyGuestWishes(saved);
  }, []);

  useEffect(() => {
    const targetId = student.id || name;
    const q = query(collection(db, "birthdayWishes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach(docSnap => {
        if (docSnap.data().studentId === targetId) {
          list.push({ id: docSnap.id, ...docSnap.data() });
        }
      });
      setWishes(list);
    });
    return () => unsubscribe();
  }, [student.id, name]);

  const submitWish = async (e) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    let senderName = "Guest";
    if (currentUser) {
      senderName = currentUser.name || currentUser.displayName || currentUser.email.split('@')[0];
    } else if (guestName.trim()) {
      senderName = guestName.trim();
    } else {
      senderName = `Guest_${Math.floor(100 + Math.random() * 900)}`;
    }

    try {
      const docRef = await addDoc(collection(db, "birthdayWishes"), {
        studentId: student.id || name,
        name: senderName,
        message: wishText,
        senderUid: currentUser?.uid || null,
        createdAt: serverTimestamp()
      });

      if (!currentUser) {
        const updatedWishes = [...myGuestWishes, docRef.id];
        setMyGuestWishes(updatedWishes);
        localStorage.setItem('my_bday_wishes', JSON.stringify(updatedWishes));
      }

      setWishText('');
      setGuestName('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (wishId) => {
    if (window.confirm("Delete this wish?")) {
      try {
        await deleteDoc(doc(db, "birthdayWishes", wishId));
        const updatedWishes = myGuestWishes.filter(id => id !== wishId);
        setMyGuestWishes(updatedWishes);
        localStorage.setItem('my_bday_wishes', JSON.stringify(updatedWishes));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="card bg-white border border-light-subtle rounded-3 p-3 mb-2">
      <div className="row g-3 align-items-center">

        {/* Left Side: Student Info */}
        <div className="col-12 col-md-5 d-flex align-items-center justify-content-between border-end-md">
          <div className="d-flex align-items-center gap-3 min-w-0">
            <div className="position-relative flex-shrink-0" style={{ width: '48px', height: '48px' }}>
              {photo ? (
                <img
                  src={photo}
                  alt={name}
                  className="rounded-circle w-100 h-100 object-fit-cover border"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="rounded-circle bg-secondary-subtle text-secondary fw-bold d-flex align-items-center justify-content-center w-100 h-100 small text-uppercase">
                  {name.charAt(0)}
                </div>
              )}
              {isToday && (
                <span className="position-absolute bottom-0 end-0 bg-white rounded-circle shadow-sm p-0.5 lh-1" style={{ fontSize: '10px' }}>
                  🎂
                </span>
              )}
            </div>

            <div className="min-w-0">
              <h6 className="fw-bold mb-0 text-dark text-truncate small">
                {name}
              </h6>
              <p className="text-muted mb-0 text-truncate" style={{ fontSize: '11px' }}>
                {student.course || 'DCA'} • {student.branch || 'DIIT124'}
              </p>
            </div>
          </div>

          <div className="ms-2 flex-shrink-0">
            <span className={`badge rounded-1 ${isToday ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-light text-secondary border'} px-2 py-1`} style={{ fontSize: '10px' }}>
              {isToday ? '🎯 TODAY' : student.dob?.substring(0, 5)}
            </span>
          </div>
        </div>

        {/* Right Side: Action Input & Live Wishes List */}
        <div className="col-12 col-md-7 d-flex flex-column gap-2">
          {isToday && (
            <form onSubmit={submitWish}>
              <div className="input-group input-group-sm">
                {!currentUser && (
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="form-control bg-light border-end-0"
                    style={{ fontSize: '11px', maxWidth: '100px' }}
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                  />
                )}
                <input
                  type="text"
                  placeholder={currentUser ? `Write a wish as ${currentUser.name || currentUser.email.split('@')[0]}...` : "Write a birthday wish..."}
                  className="form-control bg-light"
                  style={{ fontSize: '11px' }}
                  value={wishText}
                  onChange={e => setWishText(e.target.value)}
                  required
                />
                <button className="btn btn-primary px-3 fw-medium" type="submit" style={{ fontSize: '11px' }}>Send</button>
              </div>
            </form>
          )}

          {/* Dynamic Wishes Stream */}
          <div className="overflow-y-auto px-1" style={{ maxHeight: '68px' }}>
            {wishes.length === 0 ? (
              <div className="text-muted small py-1" style={{ fontSize: '11px' }}>No wishes posted yet.</div>
            ) : (
              wishes.map(w => {
                const isAdmin = currentUser?.role === 'admin';
                const isSender = currentUser && w.senderUid === currentUser.uid;
                const isMyGuestWish = !currentUser && myGuestWishes.includes(w.id);

                return (
                  <div key={w.id} className="d-flex justify-content-between align-items-center py-0.5 border-bottom border-light-subtle last-border-0 gap-2">
                    <div className="small text-dark text-wrap text-break" style={{ fontSize: '11.5px' }}>
                      <span className="fw-semibold text-secondary me-1">@{w.name.toLowerCase().replace(/\s+/g, '')}:</span>
                      <span>{w.message}</span>
                    </div>
                    {(isAdmin || isSender || isMyGuestWish) && (
                      <button
                        onClick={() => handleDelete(w.id)}
                        className="btn btn-link text-danger p-0 border-0 m-0 lh-1 text-decoration-none flex-shrink-0"
                        style={{ fontSize: '10px' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default function BdaySection() {
  const [viewTab, setViewTab] = useState('today');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = authListener(async (user) => {
      if (user) {
        const profile = await getCurrentUserProfile();
        setCurrentUser(profile || user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AdmissionProvider>
      {({ admissions = [], loading }) => {
        const filtered = useMemo(() => {
          const today = new Date();
          const curM = today.getMonth() + 1, curD = today.getDate();
          const tArr = [], uArr = [];

          admissions.forEach((s) => {
            if (!s?.dob || s.status === "canceled") return;
            const p = s.dob.includes('/') ? s.dob.split('/') : s.dob.split('-');
            if (p.length !== 3) return;
            const d = parseInt(s.dob.includes('/') ? p[0] : p[2], 10);
            const m = parseInt(p[1], 10);

            if (m === curM && d === curD) tArr.push(s);
            else {
              let bDate = new Date(today.getFullYear(), m - 1, d);
              if (bDate < today) bDate.setFullYear(today.getFullYear() + 1);
              const diff = Math.ceil((bDate - today) / 86400000);
              if (diff > 0 && diff <= 7) uArr.push({ ...s, diffDays: diff });
            }
          });
          return { today: tArr, upcoming: uArr.sort((a, b) => a.diffDays - b.diffDays) };
        }, [admissions]);

        if (loading) return <div className="text-center py-4 small text-muted">Loading...</div>;
        const list = viewTab === 'today' ? filtered.today : filtered.upcoming;

        return (
          <div className="w-100 bg-white border border-light-subtle rounded-3 p-3">

            {/* Minimal Sub-Tab Navigation Header */}
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <span className="fw-bold text-dark text-uppercase small" style={{ letterSpacing: '0.5px' }}>
                🎉 Celebrations
              </span>
              <div className="nav nav-pills gap-1">
                <button
                  className={`btn btn-sm px-2 py-0.5 fw-semibold rounded-1 ${viewTab === 'today' ? 'btn-secondary text-white' : 'btn-light text-muted border'}`}
                  style={{ fontSize: '11px' }}
                  onClick={() => setViewTab('today')}
                >
                  Today ({filtered.today.length})
                </button>
                <button
                  className={`btn btn-sm px-2 py-0.5 fw-semibold rounded-1 ${viewTab === 'upcoming' ? 'btn-secondary text-white' : 'btn-light text-muted border'}`}
                  style={{ fontSize: '11px' }}
                  onClick={() => setViewTab('upcoming')}
                >
                  Next 7 Days ({filtered.upcoming.length})
                </button>
              </div>
            </div>

            {list.length === 0 ? (
              <div className="text-center py-4 border border-dashed rounded bg-light-subtle text-muted small">
                No record found for this layout.
              </div>
            ) : (
              <div className="d-flex flex-column gap-1">
                {list.map((student, idx) => (
                  <BirthdayCard
                    key={student.id || idx}
                    student={student}
                    isToday={viewTab === 'today'}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            )}
          </div>
        );
      }}
    </AdmissionProvider>
  );
}