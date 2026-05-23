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

  // लाइव विशेज लोड करना
  useEffect(() => {
    const q = query(collection(db, "birthdayWishes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach(doc => {
        if(doc.data().studentId === (student.id || name)) {
          list.push({ id: doc.id, ...doc.data() });
        }
      });
      setWishes(list);
    });
    return () => unsubscribe();
  }, [student, name]);

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
      alert("Error!");
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
        alert("Failed to delete!");
      }
    }
  };

  return (
    <div className="card border-0 shadow-sm p-2 p-md-3 mb-2 mb-md-3 bg-white rounded-3">
      <div className="row g-2 g-md-3 align-items-stretch">
        <div className="col-12 col-md-5 border-bottom border-end-md pb-2 pb-md-0 d-flex flex-column justify-content-between">
          <div className="d-flex align-items-center gap-2 gap-md-3 mb-2 mb-md-3">
            <div className="position-relative flex-shrink-0" style={{ width: '48px', height: '48px' }}>
              {photo ? (
                <img src={photo} alt={name} className="rounded-circle w-100 h-100 object-fit-cover shadow-sm" onError={(e) => e.target.style.display = 'none'} />
              ) : (
                <div className="rounded-circle bg-secondary text-white fw-bold d-flex align-items-center justify-content-center w-100 h-100 small">{name.charAt(0)}</div>
              )}
              {isToday && <span className="position-absolute top-0 start-0" style={{ fontSize: '11px', transform: 'translate(-15%, -15%)' }}>🎂</span>}
            </div>

            <div className="flex-grow-1 min-w-0">
              <div className="d-flex justify-content-between align-items-center gap-1">
                <h6 className="fw-bold mb-0 text-truncate text-dark small-md" style={{ fontSize: '13px' }}>{name}</h6>
                <span className={`badge ${isToday ? 'bg-success-subtle text-success' : 'bg-light text-secondary border'} px-1.5 py-1`} style={{ fontSize: '9px' }}>
                  {isToday ? '🎯 Today' : student.dob?.substring(0, 5)}
                </span>
              </div>
              <p className="text-muted mb-0 text-truncate" style={{ fontSize: '10.5px' }}>{student.course || 'DCA'} • {student.branch || 'DIIT124'}</p>
            </div>
          </div>

          {/* विश इनपुट फ़ील्ड्स */}
          {isToday && (
            <form onSubmit={submitWish} className="d-flex flex-column gap-1">
              {!currentUser && (
                <input 
                  type="text" 
                  placeholder="Your Name (Optional)" 
                  className="form-control form-control-sm bg-light border-0 py-1" 
                  style={{ fontSize: '10.5px' }}
                  value={guestName} 
                  onChange={e => setGuestName(e.target.value)} 
                />
              )}
              <div className="input-group input-group-sm">
                <input 
                  type="text" 
                  placeholder={currentUser ? `Wish as ${currentUser.name || currentUser.email.split('@')[0]}...` : "Write a wish..."} 
                  className="form-control bg-light border-0 py-1" 
                  style={{ fontSize: '11px' }}
                  value={wishText} 
                  onChange={e => setWishText(e.target.value)} 
                  required 
                />
                <button className="btn btn-primary btn-sm px-2.5 fw-bold" type="submit" style={{ fontSize: '11px' }}>Send 🚀</button>
              </div>
            </form>
          )}
        </div>

        {/* दायाँ हिस्सा: लाइव विशेज बोर्ड */}
        <div className="col-12 col-md-7 d-flex flex-column pt-1 pt-md-0">
          <span className="text-muted fw-bold mb-1.5 d-block" style={{ fontSize: '10.5px' }}>✨ SENDER WISHES ({wishes.length})</span>
          
          {/* मोबाइल पर कम्फर्टेबल स्क्रॉलिंग के लिए min-height को एडजस्ट किया गया है */}
          <div className="bg-light rounded p-2 flex-grow-1 overflow-y-auto border border-light" style={{ minHeight: '80px', maxHeight: '120px', fontSize: '11px' }}>
            {wishes.length === 0 ? (
              <div className="text-center text-muted py-3 animate-fade" style={{ fontSize: '10.5px' }}>Be the first to wish! 🎉</div>
            ) : (
              wishes.map(w => {
                const isAdmin = currentUser?.role === 'admin';
                const isSender = currentUser && w.senderUid === currentUser.uid;
                const isMyGuestWish = !currentUser && myGuestWishes.includes(w.id);
                const showDelete = isAdmin || isSender || isMyGuestWish;

                return (
                  <div key={w.id} className="bg-white rounded p-1 mb-1 shadow-0 d-flex justify-content-between align-items-center gap-2 border-start border-primary border-3">
                    <div className="text-wrap text-break" style={{ fontSize: '10.5px' }}>
                      <strong className="text-primary" style={{ fontSize: '10px' }}>@{w.name}:</strong> <span className="text-dark ms-1">{w.message}</span>
                    </div>
                    {showDelete && (
                      <button onClick={() => handleDelete(w.id)} className="btn btn-link text-danger p-0 border-0 fw-bold me-1 flex-shrink-0" style={{ fontSize: '11px', textDecoration: 'none', lineHeight: 1 }}>
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
          // मोबाइल पर फुल-विड्थ के लिए px-1 या px-2 बेस्ट रहता है
          <div className="container-fluid mt-1 py-2 bg-light px-2 rounded-2">
            {/* हेडर बार: मोबाइल पर बटन्स छोटे और टाइट रहें */}
            <div className="d-flex justify-content-between align-items-center mb-2.5 border-bottom pb-2">
              <h6 className="fw-bold mb-0 text-secondary" style={{ fontSize: '14px' }}>🎉 Celebrations</h6>
              <div className="btn-group rounded-2 shadow-sm">
                <button className={`btn btn-sm px-2 py-1 fw-bold ${viewTab === 'today' ? 'btn-dark' : 'btn-light text-muted'}`} style={{ fontSize: '11px' }} onClick={() => setViewTab('today')}>
                  Today ({filtered.today.length})
                </button>
                <button className={`btn btn-sm px-2 py-1 fw-bold ${viewTab === 'upcoming' ? 'btn-dark' : 'btn-light text-muted'}`} style={{ fontSize: '11px' }} onClick={() => setViewTab('upcoming')}>
                  Next 7 Days ({filtered.upcoming.length})
                </button>
              </div>
            </div>

            {list.length === 0 ? (
              <div className="text-center py-4 border rounded bg-white text-muted small shadow-sm">No birthdays found!</div>
            ) : (
              // मोबाइल पर एक्स्ट्रा पैडिंग हटाने के लिए px-0 और px-md-5 किया गया है
              <div className="container px-0 px-md-5 d-flex flex-column gap-2">
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