import React, { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";

export default function AttendanceCard() {
  const [stats, setStats] = useState({ present: 0, absent: 0, half: 0 });
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // एडमिन समरी के अनुसार कोर्सेज की कुल अवधि
  const courseDurations = { "ADCA": 450, "DCA": 180, "CCC": 90, "N/A": 365 };

  useEffect(() => {
    const user = auth.currentUser;
    const userEmail = user?.email || localStorage.getItem("user_email");

    if (!userEmail) {
      setLoading(false);
      return;
    }

    const emailId = userEmail.trim().toLowerCase();
    // Profile.jsx की तरह "admissions" कलेक्शन से स्टूडेंट डेटा का रेफरेंस लें
    const studentDocRef = doc(db, "admissions", emailId);

    // 1. रीयल-टाइम स्टूडेंट प्रोफाइल डेटा सुनें (ब्रांच, कोर्स और रियल स्टूडेंट ID के लिए)
    const unsubscribeProfile = onSnapshot(studentDocRef, async (snap) => {
      if (snap.exists()) {
        const studentData = snap.data();
        
        // स्टूडेंट की एक्चुअल ID निकालें (डॉक्यूमेंट के अंदर से या फिर रजिस्ट्रेशन नंबर)
        const actualStudentId = studentData.id || studentData.regNo;
        const branch = studentData.branch || studentData.centerCode || "DIIT124";
        const course = studentData.course || "N/A";

        setStudentDetails({ id: actualStudentId, branch, course });

        if (!actualStudentId) {
          setLoading(false);
          return;
        }

        try {
          // 2. चेक करें कि क्या एडमिन ने 'manual_attendance_stats' में कोई डेटा डाला है
          const manualDocRef = doc(db, "manual_attendance_stats", actualStudentId);
          const manualSnap = await getDoc(manualDocRef);

          if (manualSnap.exists()) {
            setStats(manualSnap.data());
          } else {
            // 3. अगर मैन्युअल डेटा नहीं है, तो डेली 'attendance' रिकॉर्ड्स से रीयल-टाइम कैलकुलेट करें
            const q = query(
              collection(db, "attendance"),
              where("branch", "==", branch)
            );
            const attendanceSnap = await getDocs(q);

            let finalStats = { present: 0, absent: 0, half: 0 };

            attendanceSnap.docs.forEach((docSnap) => {
              const day = docSnap.data();
              if (day.records) {
                // स्टूडेंट की आईडी से मैच करें
                const studentRecord = day.records.find((r) => r.id === actualStudentId);
                if (studentRecord) {
                  const status = studentRecord.status?.toLowerCase();
                  if (status === "present") finalStats.present++;
                  else if (status === "absent") finalStats.absent++;
                  else if (status === "half") finalStats.half++;
                }
              }
            });

            setStats(finalStats);
          }
        } catch (err) {
          console.error("Error calculating attendance details:", err);
        }
      } else {
        console.warn("No admission data found for email:", emailId);
      }
      setLoading(false);
    }, (error) => {
      console.error("Profile snapshot error in AttendanceCard:", error);
      setLoading(false);
    });

    return () => unsubscribeProfile();
  }, []);

  // प्रोग्रेस बार और ग्रेडिएंट कलर्स कैलकुलेशन
  const currentCourse = studentDetails?.course || "N/A";
  const totalDays = courseDurations[currentCourse] || 450;
  const attendedDays = stats.present + stats.half * 0.5;
  const percentage = Math.min(Math.round((attendedDays / totalDays) * 100), 100);

  const getGradient = (p) => {
    return p >= 75 ? "linear-gradient(90deg, #10b981, #34d399)" :
           p >= 50 ? "linear-gradient(90deg, #f59e0b, #fbbf24)" :
                     "linear-gradient(90deg, #ef4444, #f87171)";
  };

  if (loading) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white">
        <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
        <span className="text-muted small">Syncing attendance matrix...</span>
      </div>
    );
  }

  if (!studentDetails) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-3 text-center bg-white text-muted small">
        <i className="bi bi-exclamation-circle text-warning d-block fs-4 mb-1"></i>
        Attendance unavailable (Profile Sync Required)
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-3">
      {/* ऊपरी हिस्सा */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold text-dark mb-0">
          <i className="bi bi-calendar-check-fill text-primary me-2"></i> Attendance Status
        </h6>
        <span className="badge bg-light text-dark border px-2 py-1 small">{currentCourse} Tracker</span>
      </div>

      {/* प्रोग्रेस बार */}
      <div className="bg-light p-3 rounded-3 mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-muted small fw-semibold">Attendance Score</span>
          <span className="fs-5 fw-bold" style={{ color: percentage >= 75 ? "#10b981" : percentage >= 50 ? "#f59e0b" : "#ef4444" }}>
            {percentage}%
          </span>
        </div>
        <div className="progress rounded-pill" style={{ height: "10px" }}>
          <div
            className="progress-bar rounded-pill"
            style={{
              width: `${percentage}%`,
              background: getGradient(percentage),
              transition: "width 0.6s ease"
            }}
          ></div>
        </div>
        <div className="text-muted text-end" style={{ fontSize: "11px", marginTop: "5px" }}>
          Required Course Days: {totalDays} Classes
        </div>
      </div>

      {/* स्टेटस ग्रिड */}
      <div className="row g-2 text-center">
        <div className="col-4">
          <div className="bg-success-subtle text-success border border-success-subtle rounded-3 py-2">
            <div className="fs-5 fw-bold">{stats.present}</div>
            <div className="text-uppercase fw-bold text-muted" style={{ fontSize: "9px" }}>Present</div>
          </div>
        </div>

        <div className="col-4">
          <div className="bg-warning-subtle text-warning border border-warning-subtle rounded-3 py-2" style={{ color: "#b45309" }}>
            <div className="fs-5 fw-bold">{stats.half}</div>
            <div className="text-uppercase fw-bold text-muted" style={{ fontSize: "9px" }}>Half Day</div>
          </div>
        </div>

        <div className="col-4">
          <div className="bg-danger-subtle text-danger border border-danger-subtle rounded-3 py-2">
            <div className="fs-5 fw-bold">{stats.absent}</div>
            <div className="text-uppercase fw-bold text-muted" style={{ fontSize: "9px" }}>Absent</div>
          </div>
        </div>
      </div>
    </div>
  );
}