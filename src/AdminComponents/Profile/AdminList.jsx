import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), where("role", "==", "admin"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdmins(list);
    } catch (err) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Remove this admin access?")) {
      try {
        await deleteDoc(doc(db, "users", id));
        setAdmins(admins.filter(a => a.id !== id));
        toast.success("Admin removed");
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center p-5">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="container py-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 px-2">
        <h3 className="fw-bold m-0">Administrators</h3>
        <button onClick={fetchAdmins} className="btn btn-sm btn-outline-secondary rounded-pill px-3">
          Refresh
        </button>
      </div>

      <div className="row g-3">
        {admins.map((admin) => (
          <div key={admin.id} className="col-12 col-md-6 col-xl-4">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-3">
                <div className="d-flex align-items-center">
                  
                  {/* Avatar Section */}
                  <div className="flex-shrink-0">
                    {admin.photoURL ? (
                      <img
                        src={admin.photoURL}
                        alt=""
                        className="rounded-circle border"
                        style={{ width: "55px", height: "55px", objectFit: "cover" }}
                      />
                    ) : (
                      <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" 
                           style={{ width: "55px", height: "55px", fontSize: "1.1rem" }}>
                        {admin.name?.charAt(0).toUpperCase() || "A"}
                      </div>
                    )}
                  </div>

                  {/* Info Section */}
                  <div className="ms-3 flex-grow-1 overflow-hidden">
                    <h6 className="mb-0 fw-bold text-dark text-truncate">{admin.name || "N/A"}</h6>
                    <small className="text-muted d-block text-truncate mb-1">{admin.email}</small>
                    
                    {/* Phone Number with Click-to-Call */}
                    {admin.phone ? (
                      <a href={`tel:${admin.phone}`} className="text-decoration-none d-flex align-items-center">
                         <small className="fw-medium text-primary">
                           <i className="bi bi-telephone-fill me-1" style={{fontSize: '0.8rem'}}></i>
                           {admin.phone}
                         </small>
                      </a>
                    ) : (
                      <small className="text-muted italic small text-opacity-50">No phone number</small>
                    )}
                  </div>

                  {/* Action Section */}
                  {/* <div className="ms-2">
                    <button 
                      onClick={() => handleDelete(admin.id)}
                      className="btn btn-light btn-sm rounded-circle text-danger p-2"
                      title="Delete Admin"
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  </div> */}

                </div>

                {/* Bottom Join Date */}
                <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
                  <span className="badge bg-success bg-opacity-10 text-success small fw-normal">Verified Admin</span>
                  <small className="text-muted" style={{fontSize: '0.7rem'}}>
                    Since: {admin.createdAt?.toDate ? admin.createdAt.toDate().toLocaleDateString() : 'New'}
                  </small>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {admins.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted fw-light italic">Database is empty</p>
        </div>
      )}
    </div>
  );
}