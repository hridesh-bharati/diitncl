import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase"; 

const Team = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "admin"));
        const querySnapshot = await getDocs(q);
        const adminData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAdmins(adminData);
      } catch (error) {
        console.error("Error fetching admins:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const gradients = [
    "linear-gradient(45deg, #6366f1, #a855f7)",
    "linear-gradient(45deg, #10b981, #3b82f6)",
    "linear-gradient(45deg, #f59e0b, #ef4444)",
    "linear-gradient(45deg, #ec4899, #8b5cf6)"
  ];

  if (loading || admins.length === 0) return null;

  return (
    <section className="py-5" id="team">
      <div className="container text-center">
        <h2 className="fw-bold mb-4">Meet Our <span className="text-primary">Experts</span></h2>
        <div className="row g-3 justify-content-center">
          {admins.map((admin, i) => (
            <div className="col-12 col-md-3" key={admin.id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 t-card bg-white p-3">
                <div 
                  className="mx-auto mb-2 rounded-circle p-1" 
                  style={{ background: gradients[i % gradients.length], width: 80, height: 80 }}
                >
                  <img 
                    src={admin.photoURL || "/images/icon/default-avatar.png"} 
                    alt={admin.name} 
                    className="rounded-circle w-100 h-100 border border-2 border-white object-fit-cover" 
                  />
                </div>
                
                <h6 className="fw-bold mb-0 text-truncate small">{admin.name}</h6>
                
                {/* Caption 1: Designation */}
                <small className="text-uppercase fw-bold text-muted extra-small">
                  {admin.designation}
                </small>
                
                {/* Caption 2: Bio */}
                <p className="text-muted mt-2 mb-2 extra-small">
                  {admin.bio}
                </p>

                <div className="d-flex justify-content-center gap-2 border-top pt-2 mt-auto">
                  {admin.phone && (
                    <>
                      <a href={`tel:${admin.phone}`} className="text-secondary"><i className="bi bi-telephone"></i></a>
                      <a href={`https://wa.me/${admin.phone}`} className="text-secondary"><i className="bi bi-whatsapp"></i></a>
                    </>
                  )}
                  {admin.linkedin && (
                    <a href={admin.linkedin} target="_blank" rel="noreferrer" className="text-secondary">
                      <i className="bi bi-linkedin"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`.t-card{transition:0.3s}.t-card:hover{transform:translateY(-5px)}.extra-small{font-size:10px}.object-fit-cover{object-fit:cover}`}</style>
    </section>
  );
};

export default Team;