import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";



import "./App.css";

// 🚀 Core Components (Turant load honge bina loading ke)
import Lock from "./Components/HomePage/LockWeb/Lock";
import Header from "./Components/Header/Header";
import NetworkStatus from "./Components/HomePage/LockWeb/NetworkStatus";
import InstallPrompt from "./Components/HomePage/LockWeb/InstallPrompt";
import HelmetManager from "./Components/HomePage/pages/HelmetManager";
import LoadingSpinner from "./AdminComponents/Common/LoadingSpinner";

// 🔥 Firebase Auth Logic
import { authListener, getUserRole } from "./firebase/auth";
import { db } from "./firebase/firebase";
import { doc, setDoc, increment } from "firebase/firestore";

// 🌐 Dynamic Lazy Loading (Optimized for Vite/Webpack)
const Home = lazy(() => import("./Components/HomePage/Home"));
const About = lazy(() => import("./Components/HomePage/pages/About/About"));
const OurCourses = lazy(() => import("./Components/HomePage/pages/Course/OurCourses"));
const Branch = lazy(() => import("./Components/HomePage/pages/Branch/Branch"));
const Gallery = lazy(() => import("./Components/HomePage/pages/Gallery"));
const AdmissionForm = lazy(() => import("./AdminComponents/Admissions/AdmissionForm"));
const Verification = lazy(() => import("./Components/HomePage/pages/Verification/Verification"));
const QuickSupport = lazy(() => import("./Components/HomePage/pages/About/QuickSupport"));
const LocationMapCard = lazy(() => import("./Components/HomePage/pages/Location/LocationMapCard"));
const LoginForm = lazy(() => import("./Components/Header/LoginForm"));
const Library = lazy(() => import("./Components/HomePage/pages/Library/Library"));
const ChatPage = lazy(() => import("./Components/Chats/ChatPage"));

// 📚 Course Sections
const ComputerLanguage = lazy(() => import("./Components/HomePage/pages/Course/ComputerLanguage"));
const Designing = lazy(() => import("./Components/HomePage/pages/Course/Designing"));
const WebDev = lazy(() => import("./Components/HomePage/pages/Course/WebDev"));
const Nielet = lazy(() => import("./Components/HomePage/pages/Course/Nielet"));
const Banking = lazy(() => import("./Components/HomePage/pages/Course/Banking"));
const Certificate = lazy(() => import("./Components/HomePage/pages/Course/Ceritificate"));

// ⚖️ Legal & Info Pages
const Discription = lazy(() => import("./Components/HomePage/pages/About/Discription"));
const FAQ = lazy(() => import("./Components/HomePage/pages/About/FAQ"));
const PrivacyPolicy = lazy(() => import("./Components/HomePage/pages/About/PrivacyPolicy"));
const Term = lazy(() => import("./Components/HomePage/pages/About/Terms"));

// 🧑‍💻 Protected Dashboards
const AdminRoutes = lazy(() => import("./AdminComponents/AdminRoutes"));
const StudentRoutes = lazy(() => import("./StudentComponents/StudentRoutes"));
const PageNotFound = lazy(() => import("./Components/HomePage/pages/PageNotFound"));

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🛡️ Single Listener for better performance
    const unsubscribe = authListener(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const r = await getUserRole(currentUser.uid);
        setRole(r);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const trackVisit = async () => {
      // 1. Check karo ki kya isi session mein count ho chuka hai?
      const hasVisited = sessionStorage.getItem("drishtee_visitor");  // ✅ Smart session check

      if (!hasVisited) {
        const ref = doc(db, "stats", "visitors");
        try {
          // 2. Sirf 'count' field bhejna hai (Rules allow only this)  // ✅ Rules compliant
          await setDoc(ref, {
            count: increment(1)
          }, { merge: true });

          // 3. Session set karein taki page refresh par count na badhe  // ✅ Duplicate prevention
          sessionStorage.setItem("drishtee_visitor", "true");
          console.log("🚀 New visitor tracked successfully!");
        } catch (error) {
          // Agar permission error aaye toh check karein rules mein visitors allow hai ya nahi  // ✅ Debug ready
          console.error("Firebase Tracking Error:", error);
        }
      }
    };

    trackVisit();
  }, []);


  if (loading) return <LoadingSpinner />;

  return (
    <>
      {/* <Lock> */}
      <NetworkStatus />
      <Header />
      <InstallPrompt />

      <Suspense fallback={<p className="my-5 ms-auto p-5 text-center  w-100 text-muted">Loading...</p>}>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<HelmetManager><Home /></HelmetManager>} />
          <Route path="/about" element={<HelmetManager><About /></HelmetManager>} />
          <Route path="/courses" element={<HelmetManager><OurCourses /></HelmetManager>} />
          <Route path="/branch/thoothibari" element={<HelmetManager><Branch /></HelmetManager>} />
          <Route path="/gallery" element={<HelmetManager><Gallery /></HelmetManager>} />
          <Route path="/new-admission" element={<HelmetManager><AdmissionForm /></HelmetManager>} />
          <Route path="/branch/nichlaul/location" element={<HelmetManager><LocationMapCard /></HelmetManager>} />
          <Route path="/branch/thoothibari/location" element={<HelmetManager><LocationMapCard /></HelmetManager>} />
          <Route path="/download-certificate" element={<HelmetManager><Verification /></HelmetManager>} />
          <Route path="/contact-us" element={<HelmetManager><QuickSupport /></HelmetManager>} />
          <Route path="/login" element={<HelmetManager><LoginForm /></HelmetManager>} />
          <Route path="/certificate" element={<HelmetManager><Certificate /></HelmetManager>} />
          <Route path="/library" element={<HelmetManager><Library /></HelmetManager>} />
          <Route path="/chat" element={<ChatPage />} />

          {/* --- COURSE ROUTES --- */}
          <Route path="/courses/computer-language" element={<HelmetManager><ComputerLanguage /></HelmetManager>} />
          <Route path="/courses/designing" element={<HelmetManager><Designing /></HelmetManager>} />
          <Route path="/courses/web-development" element={<HelmetManager><WebDev /></HelmetManager>} />
          <Route path="/courses/nielit" element={<HelmetManager><Nielet /></HelmetManager>} />
          <Route path="/courses/banking" element={<HelmetManager><Banking /></HelmetManager>} />

          {/* --- LEGAL ROUTES (Sitemap Sync) --- */}
          <Route path="/terms" element={<HelmetManager><Term /></HelmetManager>} />
          <Route path="/privacy-policy" element={<HelmetManager><PrivacyPolicy /></HelmetManager>} />
          <Route path="/faq" element={<HelmetManager><FAQ /></HelmetManager>} />
          <Route path="/disclaimer" element={<HelmetManager><Discription /></HelmetManager>} />

          {/* --- DASHBOARDS (Protected) --- */}
          <Route
            path="/admin/*"
            element={user && role === "admin" ? <AdminRoutes /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/student/*"
            element={user && role === "student" ? <StudentRoutes /> : <Navigate to="/login" replace />}
          />

          <Route path="*" element={<HelmetManager><PageNotFound /></HelmetManager>} />
        </Routes>
      </Suspense>
      {/* </Lock> */}
    </>
  );
}