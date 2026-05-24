// src/App.jsx
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";

import SwipeLayout from "./Components/MobileAccessories/SwipeLayout";
import "./App.css";

/* Core Components */
import Header from "./Components/Header/Header";
import NetworkStatus from "./Components/HomePage/LockWeb/NetworkStatus";
import InstallPrompt from "./Components/HomePage/LockWeb/InstallPrompt";
import HelmetManager from "./Components/HomePage/pages/HelmetManager";
import LoadingSpinner from "./AdminComponents/Common/LoadingSpinner";
import NotesDownload from "./Components/HomePage/pages/Notes/NotesDownload";
import { vibration } from "./Components/MobileAccessories/vibration";

/* Firebase */
import { authListener, getUserRole } from "./firebase/auth";
import { db } from "./firebase/firebase";
import { doc, setDoc, increment, serverTimestamp } from "firebase/firestore";
import ScrollUp from "./Components/HelperCmp/Scroller/ScrollUp";
import ResumeBuilder from "./Components/Resume/ResumeBuilder";

/* Lazy Pages */
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

/* Courses */
const ComputerLanguage = lazy(() => import("./Components/HomePage/pages/Course/ComputerLanguage"));
const Designing = lazy(() => import("./Components/HomePage/pages/Course/Designing"));
const WebDev = lazy(() => import("./Components/HomePage/pages/Course/WebDev"));
const Nielet = lazy(() => import("./Components/HomePage/pages/Course/Nielet"));
const Banking = lazy(() => import("./Components/HomePage/pages/Course/Banking"));
const Certificate = lazy(() => import("./Components/HomePage/pages/Course/Ceritificate"));
const PhotoEdit = lazy(() => import("./Components/HomePage/pages/PhotoEditor/PhotoEdit"));

/* Legal */
const Discription = lazy(() => import("./Components/HomePage/pages/About/Discription"));
const FAQ = lazy(() => import("./Components/HomePage/pages/About/FAQ"));
const PrivacyPolicy = lazy(() => import("./Components/HomePage/pages/About/PrivacyPolicy"));
const Term = lazy(() => import("./Components/HomePage/pages/About/Terms"));

/* Dashboards */
const AdminRoutes = lazy(() => import("./AdminComponents/AdminRoutes"));
const StudentRoutes = lazy(() => import("./StudentComponents/StudentRoutes"));
const PageNotFound = lazy(() => import("./Components/HomePage/pages/PageNotFound"));

export default function App() {
  const location = useLocation();

  /* Restore cached auth instantly */
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("drishtee_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRole] = useState(
    () => localStorage.getItem("drishtee_role") || null
  );

  const [loading, setLoading] = useState(true);

  /* ------------------------------------------------------ */
  /* Visitor Tracking + Device Vibration (10/10 Optimized)  */
  /* ------------------------------------------------------ */
  useEffect(() => {
    const trackVisit = async () => {
      // 🚀 Optimization 1: Background tabs ya prerendered visits ko track mat karo (Save Firestore Writes)
      if (document.visibilityState !== "visible") return;

      try {
        const LAST_VISIT_KEY = "drishtee_last_visit";
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

        const now = Date.now();
        const lastVisit = localStorage.getItem(LAST_VISIT_KEY);

        if (!lastVisit || now - Number(lastVisit) > TWENTY_FOUR_HOURS) {
          await setDoc(
            doc(db, "stats", "visitors"),
            {
              count: increment(1),
              lastUpdated: serverTimestamp(),
            },
            { merge: true }
          );

          localStorage.setItem(LAST_VISIT_KEY, now.toString());
          console.log("✅ Visitor counted successfully");
        } else {
          console.log("⚡ Already counted within 24h");
        }
      } catch (error) {
        console.error("❌ Visitor tracking error:", error);
      }
    };

    trackVisit();

    // 🚀 Optimization 2: Safe API check for Vibration (Prevents crashes in Safari/Desktop browsers)
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      vibration();
    }
  }, []);

  /* ------------------------------------------------------ */
  /* Safe Auth & Role Listener                              */
  /* ------------------------------------------------------ */
  useEffect(() => {
    const unsubscribe = authListener(async (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        };

        setUser(userData);
        localStorage.setItem("drishtee_user", JSON.stringify(userData));

        try {
          const userRole = await getUserRole(firebaseUser.uid);
          setRole(userRole || null);

          if (userRole) {
            localStorage.setItem("drishtee_role", userRole);
          } else {
            localStorage.removeItem("drishtee_role");
          }
        } catch (roleError) {
          console.error("❌ Failed to fetch user role safely:", roleError);
          setRole(null);
          localStorage.removeItem("drishtee_role");
        }
      } else {
        setUser(null);
        setRole(null);
        localStorage.removeItem("drishtee_user");
        localStorage.removeItem("drishtee_role");
      }

      setLoading(false);
    });

    return () => unsubscribe?.();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <NetworkStatus />
      <Header />
      <InstallPrompt />

      <AnimatePresence mode="wait">
        <SwipeLayout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes location={location}>
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

              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/photo-editor" element={<HelmetManager><PhotoEdit /></HelmetManager>} />
              <Route path="/notes-download" element={<HelmetManager><NotesDownload /></HelmetManager>} />

              {/* Course Detail */}
              <Route path="/courses/computer-language" element={<HelmetManager><ComputerLanguage /></HelmetManager>} />
              <Route path="/courses/designing" element={<HelmetManager><Designing /></HelmetManager>} />
              <Route path="/courses/web-development" element={<HelmetManager><WebDev /></HelmetManager>} />
              <Route path="/courses/nielit" element={<HelmetManager><Nielet /></HelmetManager>} />
              <Route path="/courses/banking" element={<HelmetManager><Banking /></HelmetManager>} />

              {/* Legal */}
              <Route path="/terms" element={<HelmetManager><Term /></HelmetManager>} />
              <Route path="/privacy-policy" element={<HelmetManager><PrivacyPolicy /></HelmetManager>} />
              <Route path="/faq" element={<HelmetManager><FAQ /></HelmetManager>} />
              <Route path="/disclaimer" element={<HelmetManager><Discription /></HelmetManager>} />

              <Route
                path="/admin/*"
                element={
                  Boolean(user) && role === "admin"
                    ? <AdminRoutes />
                    : <Navigate to="/login" replace />
                }
              />

              <Route
                path="/student/*"
                element={
                  Boolean(user) && role === "student"
                    ? <StudentRoutes />
                    : <Navigate to="/login" replace />
                }
              />

              <Route
                path="*"
                element={<HelmetManager><PageNotFound /></HelmetManager>}
              />
            </Routes>
          </Suspense>
        </SwipeLayout>
      </AnimatePresence>
      <ScrollUp />
    </>
  );
}