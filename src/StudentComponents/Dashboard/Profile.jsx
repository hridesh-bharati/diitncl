import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Profile() {

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {

    const fetchProfile = async () => {

      if (!user?.email) return;

      try {

        const q = query(
          collection(db, "admissions"),
          where("email", "==", user.email.trim().toLowerCase())
        );

        const snap = await getDocs(q);

        if (!snap.empty) {
          setStudent(snap.docs[0].data());
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

    };

    fetchProfile();

  }, [user]);

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (!student) {
    return <div className="text-center p-5">No student data found</div>;
  }

  return (
    <div className="container p-3">

      <div className="card">

        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Student Profile</h5>
        </div>

        <div className="card-body">

          <div className="text-center mb-4">

            <img
              src={student.photoUrl || "https://via.placeholder.com/100"}
              className="rounded-circle"
              width="100"
              height="100"
              alt={student.name}
            />

            <h4 className="mt-2">{student.name}</h4>
            <p className="text-muted">{student.email}</p>

          </div>

          <table className="table">

            <tbody>

              <tr><th>Course</th><td>{student.course}</td></tr>
              <tr><th>Registration No</th><td>{student.regNo}</td></tr>
              <tr><th>Father's Name</th><td>{student.fatherName}</td></tr>
              <tr><th>Mother's Name</th><td>{student.motherName}</td></tr>
              <tr><th>Date of Birth</th><td>{student.dob}</td></tr>
              <tr><th>Mobile</th><td>{student.mobile}</td></tr>
              <tr><th>Address</th><td>{student.address}</td></tr>
              <tr><th>Admission Date</th><td>{student.admissionDate}</td></tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}