// // src/AdminComponents/Users/AllUsers.jsx
// import React, { useState, useEffect } from 'react';
// import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import { db } from '../../firebase/firebase';
// import { toast } from 'react-toastify';

// export default function AllUsers() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('all'); // all, student, incomplete
//   const [deletingId, setDeletingId] = useState(null);

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
      
//       // 1. Fetch from 'users' collection (139 records)
//       const usersSnapshot = await getDocs(collection(db, 'users'));
//       const rawUsers = usersSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

//       // 2. Fetch from 'admissions' collection (107 records)
//       const admissionsSnapshot = await getDocs(collection(db, 'admissions'));
//       const rawAdmissions = admissionsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

//       // 3. Map admissions by email for fast lookup
//       const admissionMap = new Map();
//       rawAdmissions.forEach(adm => {
//         if (adm.email) {
//           admissionMap.set(adm.email.toLowerCase().trim(), adm);
//         }
//       });

//       // 4. Merge Data to find incomplete entries and patch exact profile photos
//       const mergedUsers = rawUsers.map(user => {
//         const userEmail = user.email ? user.email.toLowerCase().trim() : '';
//         const matchingAdmission = admissionMap.get(userEmail);

//         // Best available picture selection logic
//         const dynamicPhoto = user.photoURL || user.photoUrl || matchingAdmission?.photoUrl || matchingAdmission?.photoURL || null;

//         return {
//           ...user,
//           name: user.name || matchingAdmission?.name || 'Unnamed User',
//           photoUrl: dynamicPhoto, // Clean photo mapping
//           course: matchingAdmission?.course || null,
//           regNo: matchingAdmission?.regNo || null,
//           status: matchingAdmission?.status || null,
//           branch: matchingAdmission?.branch || null,
//           isAdmissionDone: !!matchingAdmission // True if present in admissions
//         };
//       });

//       setUsers(mergedUsers);
//     } catch (error) {
//       console.error('Error syncing user collections:', error);
//       toast.error('Data sync failed!');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteUser = async (user) => {
//     const displayName = user.name || user.email || 'this account';
//     if (!window.confirm(`Are you sure you want to delete ${displayName}? This cannot be undone.`)) {
//       return;
//     }

//     setDeletingId(user.id);

//     try {
//       // 1. Delete from main users collection
//       await deleteDoc(doc(db, 'users', user.id));

//       // 2. If it also has an admission record, delete that too to keep DB clean
//       if (user.isAdmissionDone) {
//         await deleteDoc(doc(db, 'admissions', user.id)).catch(() => {
//           if(user.email) deleteDoc(doc(db, 'admissions', user.email));
//         });
//       }
      
//       toast.success('User and associated data permanently removed');
//       setUsers(prev => prev.filter(u => u.id !== user.id));
//     } catch (error) {
//       console.error('Error deleting user:', error);
//       toast.error('Failed to complete deletion');
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // Filtering Logic
//   const filteredUsers = users.filter(user => {
//     const search = searchTerm.toLowerCase().trim();
//     const matchesSearch = !search || 
//       user.name?.toLowerCase().includes(search) ||
//       user.email?.toLowerCase().includes(search) ||
//       user.regNo?.toLowerCase().includes(search);

//     if (!matchesSearch) return false;

//     if (filterType === 'student') return user.isAdmissionDone;
//     if (filterType === 'incomplete') return !user.isAdmissionDone && user.role !== 'admin';
    
//     return true;
//   });

//   // Accurate fallback dynamic avatar constructor
//   const getAvatarUrl = (user) => {
//     if (user.photoUrl) return user.photoUrl;
    
//     // Fallback if avatar source is missing: creates text initials using dynamic seed
//     const seedName = user.name !== 'Unnamed User' ? user.name : (user.email || 'User');
//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(seedName)}&background=random&length=2&bold=true`;
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <p className="mt-2 text-muted">Analyzing & Syncing Database Directories...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid py-4 px-3">
//       {/* Header */}
//       <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
//         <div>
//           <h5 className="fw-bold mb-1">
//             <i className="bi bi-shield-lock-fill me-2 text-primary"></i>
//             Master User Control Panel
//           </h5>
//           <small className="text-muted">Total Auth Accounts: {users.length} | Shown: {filteredUsers.length}</small>
//         </div>

//         {/* Quick Filter Tabs */}
//         <div className="btn-group shadow-sm text-xs">
//           <button className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilterType('all')}>All ({users.length})</button>
//           <button className={`btn btn-sm ${filterType === 'student' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setFilterType('student')}>Verified Students</button>
//           <button className={`btn btn-sm ${filterType === 'incomplete' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setFilterType('incomplete')}>Incomplete Accounts</button>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="bg-white rounded-3 shadow-sm p-3 mb-4">
//         <div className="position-relative">
//           <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
//           <input
//             type="text"
//             className="form-control ps-5 rounded-pill"
//             placeholder="Search users by name, email, registration number..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Users Layout Grid */}
//       {filteredUsers.length === 0 ? (
//         <div className="text-center py-5 bg-white rounded-3 shadow-sm">
//           <i className="bi bi-person-x display-3 text-muted"></i>
//           <p className="mt-3 text-muted fw-bold">No accounts found for selected filter</p>
//         </div>
//       ) : (
//         <div className="row g-3">
//           {filteredUsers.map((user) => (
//             <div key={user.id} className="col-12 col-md-6 col-lg-4">
//               <div className="card border-0 shadow-sm h-100 rounded-3 overflow-hidden position-relative">
                
//                 {/* Border Indication Status line */}
//                 <div style={{ 
//                   height: '4px', 
//                   backgroundColor: user.role === 'admin' ? '#dc3545' : (user.isAdmissionDone ? '#198754' : '#ffc107') 
//                 }} />

//                 <div className="card-body p-3">
//                   <div className="d-flex align-items-center gap-3">
                    
//                     {/* Profile Icon avatar setup */}
//                     <div className="flex-shrink-0">
//                       <img
//                         src={getAvatarUrl(user)}
//                         alt="User Avatar"
//                         className="rounded-circle border"
//                         style={{ width: '48px', height: '48px', objectFit: 'cover' }}
//                         onError={(e) => { 
//                           e.target.onerror = null; // Infinite loop breaker
//                           e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; 
//                         }}
//                       />
//                     </div>

//                     {/* Meta User Specs */}
//                     <div className="flex-grow-1 min-width-0">
//                       <h6 className="mb-0.5 text-truncate fw-bold text-dark">
//                         {user.name}
//                       </h6>
//                       <p className="mb-1 text-muted small text-truncate" style={{ fontSize: '11px' }}>
//                         <i className="bi bi-envelope me-1"></i>{user.email || 'No email profile'}
//                       </p>

//                       {/* Display Status Flags */}
//                       <div className="d-flex flex-wrap gap-1 align-items-center">
//                         {user.role === 'admin' ? (
//                           <span className="badge bg-danger" style={{ fontSize: '9px' }}>ADMIN SYSTEM</span>
//                         ) : user.isAdmissionDone ? (
//                           <>
//                             <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '9px' }}>STUDENT</span>
//                             {user.course && <span className="text-muted text-truncate px-1 text-uppercase" style={{ fontSize: '10px', maxWidth: '80px' }}>• {user.course}</span>}
//                           </>
//                         ) : (
//                           <span className="badge bg-warning text-dark border border-warning-subtle" style={{ fontSize: '9px' }}>INCOMPLETE FORM</span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Trash Execution Endpoint */}
//                     <div className="flex-shrink-0">
//                       <button
//                         className="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
//                         style={{ width: '32px', height: '32px' }}
//                         onClick={() => handleDeleteUser(user)}
//                         disabled={deletingId === user.id}
//                         title="Remove Document"
//                       >
//                         {deletingId === user.id ? (
//                           <span className="spinner-border spinner-border-sm" role="status"></span>
//                         ) : (
//                           <i className="bi bi-trash"></i>
//                         )}
//                       </button>
//                     </div>

//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }