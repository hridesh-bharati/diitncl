import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import DefaultAvatar from "../../Components/HelperCmp/DefaultAvatar/DefaultAvatar";

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), where("role", "==", "admin"));
      const snapshot = await getDocs(q);
      setAdmins(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      toast.error("Error fetching admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Cloudinary resize (100x100)
  const getSmallImg = (url) =>
    url?.includes("cloudinary")
      ? url.replace("/upload/", "/upload/w_100,h_100,c_thumb,g_face,f_auto,q_auto/")
      : null; // null => show DefaultAvatar

  if (loading) return (
    <div className="text-center p-5">
      <div className="spinner-border text-primary spinner-border-sm"></div>
    </div>
  );

  return (
    <div className="container-fluid py-3 px-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold m-0">
          Admins <span className="badge bg-light text-dark border ms-1">{admins.length}</span>
        </h5>
        <button onClick={fetchAdmins} className="btn btn-sm btn-light border rounded-pill px-3">Refresh</button>
      </div>

      <div className="row g-2">
        {admins.map((admin) => (
          <div key={admin.id} className="col-12 col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body p-2 d-flex align-items-center">

                {/* Optimized Avatar */}
                <div style={{ width: 50, height: 50, flexShrink: 0 }}>
                  {getSmallImg(admin.photoURL) ? (
                    <img
                      src={getSmallImg(admin.photoURL)}
                      alt={admin.name || "Admin"}
                      className="rounded-circle border"
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      loading="lazy"
                    />
                  ) : (
                    <DefaultAvatar />
                  )}
                </div>

                {/* Admin Info */}
                <div className="ms-3 flex-grow-1 overflow-hidden">
                  <h6 className="mb-0 text-truncate small fw-bold">{admin.name || "Admin"}</h6>
                  <p className="text-muted text-truncate mb-0" style={{ fontSize: 11 }}>{admin.email}</p>
                  {admin.phone && (
                    <a href={`tel:${admin.phone}`} className="text-primary text-decoration-none fw-medium" style={{ fontSize: 11 }}>
                      <i className="bi bi-telephone-fill me-1"></i>{admin.phone}
                    </a>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="ms-auto ps-2">
                  <div
                    className="bg-success rounded-circle"
                    style={{ width: 8, height: 8 }}
                    title="Verified"
                  />
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {admins.length === 0 && <p className="text-center text-muted mt-5 small">No admins found</p>}
    </div>
  );
}