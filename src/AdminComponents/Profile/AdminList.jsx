import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =======================
     FETCH ALL ADMINS
  ======================= */
  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "users"), where("role", "==", "admin"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAdmins(list);
      } catch (err) {
        toast.error("Failed to fetch admins: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  if (loading) return <p>Loading admins...</p>;
  if (admins.length === 0) return <p>No admins found.</p>;

  return (
    <div className="container mt-3">
      <h4 className="mb-3">Admin List</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Photo</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, idx) => (
              <tr key={admin.id}>
                <td>{idx + 1}</td>
                <td>{admin.name || "—"}</td>
                <td>{admin.email}</td>
                <td>{admin.phone || "—"}</td>
                <td>
                  {admin.photoURL ? (
                    <img
                      src={admin.photoURL}
                      alt={admin.name || "admin"}
                      width={50}
                      height={50}
                      className="rounded-circle"
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  {admin.createdAt?.toDate
                    ? admin.createdAt.toDate().toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
