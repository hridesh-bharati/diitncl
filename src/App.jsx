// src/App.jsx
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import {
  useEffect,
  useState,
  useRef,
  lazy,
  Suspense,
  useCallback,
} from "react";
import { AnimatePresence } from "framer-motion";

import { subscribeUser } from "./services/pushService";
import SwipeLayout from "./Components/MobileAccessories/SwipeLayout";
import "./App.css";

/* Core Components */
import Header from "./Components/Header/Header";
import NetworkStatus from "./Components/HomePage/LockWeb/NetworkStatus";
import InstallPrompt from "./Components/HomePage/LockWeb/InstallPrompt";
import HelmetManager from "./Components/HomePage/pages/HelmetManager";
import LoadingSpinner from "./AdminComponents/Common/LoadingSpinner";
import NotesDownload from "./Components/HomePage/pages/Notes/NotesDownload";
import Lock from "./Components/HomePage/LockWeb/Lock";
import { vibration } from "./Components/MobileAccessories/vibration";

/* Firebase */
import { authListener, getUserRole } from "./firebase/auth";
import { db, app } from "./firebase/firebase";
import { doc,setDoc,increment,getDoc,updateDoc,serverTimestamp,} from "firebase/firestore";
import {getMessaging,onMessage,isSupported,} from "firebase/messaging";

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
  const messagingRef = useRef(null);

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
  /* Service Worker Registration */
  /* ------------------------------------------------------ */
  useEffect(() => {
    const registerSW = async () => {
      if (!("serviceWorker" in navigator)) return;

      try {
        const reg = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );
        console.log("✅ Service Worker Registered", reg);
        if (reg.waiting) {
          reg.update();
        }
      } catch (error) {
        console.error("❌ Service Worker Error:", error);
      }
    };

    if (document.readyState === "complete") {
      registerSW();
    } else {
      window.addEventListener("load", registerSW);
    }

    return () => {
      window.removeEventListener("load", registerSW);
    };
  }, []);

  /* ------------------------------------------------------ */
  /* Foreground Notification Listener */
  /* ------------------------------------------------------ */
  useEffect(() => {
    let unsubscribe;

    const initMessaging = async () => {
      try {
        const supported = await isSupported();
        if (!supported) return;

        messagingRef.current = getMessaging(app);

        unsubscribe = onMessage(messagingRef.current, (payload) => {
          console.log("📩 Foreground Notification:", payload);

          if (Notification.permission === "granted") {
            new Notification(
              payload?.notification?.title || "Drishtee Alert",
              {
                body: payload?.notification?.body || "New notification received",
                icon: "/logo.png",
              }
            );
          }
        });
      } catch (error) {
        console.error("❌ Messaging Init Error:", error);
      }
    };

    initMessaging();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  /* ------------------------------------------------------ */
  /* Student Push Token Sync */
  /* ------------------------------------------------------ */
  const syncStudentPushToken = useCallback(async (userId) => {
    try {
      const CACHE_KEY = `student_push_sync_${userId}`;

      if (localStorage.getItem(CACHE_KEY)) {
        console.log("⚡ Student token already synced");
        return;
      }

      const studentRef = doc(db, "admissions", userId);
      const snap = await getDoc(studentRef);

      if (snap.exists() && !snap.data()?.fcmToken) {
        const token = await subscribeUser();

        if (token) {
          await updateDoc(studentRef, {
            fcmToken: token,
            tokenUpdatedAt: serverTimestamp(),
          });

          localStorage.setItem(CACHE_KEY, "true");
          console.log("✅ Student token synced");
        }
      }
    } catch (error) {
      console.error("❌ Student token sync error:", error);
    }
  }, []);

  /* ------------------------------------------------------ */
  /* Push Token Save After User Interaction */
  /* ------------------------------------------------------ */
  useEffect(() => {
    let asked = false;

    const initPush = async () => {
      if (asked || !user?.uid) return;
      asked = true;

      try {
        const TOKEN_CACHE_KEY = `fcm_token_saved_${user.uid}`;

        if (localStorage.getItem(TOKEN_CACHE_KEY)) {
          console.log("⚡ Push token already cached");
          return;
        }

        const token = await subscribeUser();

        if (token) {
          await setDoc(
            doc(db, "admissions", user.uid),
            {
              fcmToken: token,
              tokenUpdatedAt: new Date(),
            },
            { merge: true }
          );

          localStorage.setItem(TOKEN_CACHE_KEY, "true");
          console.log("✅ Push token saved");
        }
      } catch (error) {
        console.error("❌ Push token save error:", error);
      }
    };

    window.addEventListener("click", initPush, { once: true });
    window.addEventListener("scroll", initPush, { once: true });
    window.addEventListener("touchstart", initPush, { once: true });

    return () => {
      window.removeEventListener("click", initPush);
      window.removeEventListener("scroll", initPush);
      window.removeEventListener("touchstart", initPush);
    };
  }, [user]);

  /* ------------------------------------------------------ */
  /* Firebase Auth Listener */
  /* ------------------------------------------------------ */
  useEffect(() => {
    const unsubscribe = authListener(async (currentUser) => {
      if (currentUser) {
        const userData = {
          uid: currentUser.uid,
          email: currentUser.email,
        };

        setUser(userData);
        localStorage.setItem(
          "drishtee_user",
          JSON.stringify(userData)
        );

        let cachedRole = localStorage.getItem("drishtee_role");

        if (!cachedRole) {
          const fetchedRole = await getUserRole(currentUser.uid);

          setRole(fetchedRole);
          localStorage.setItem("drishtee_role", fetchedRole);

          if (fetchedRole === "student") {
            syncStudentPushToken(currentUser.uid);
          }
        } else {
          setRole(cachedRole);
        }
      } else {
        const cachedUser = JSON.parse(
          localStorage.getItem("drishtee_user")
        );

        if (cachedUser?.uid) {
          localStorage.removeItem(
            `fcm_token_saved_${cachedUser.uid}`
          );
          localStorage.removeItem(
            `student_push_sync_${cachedUser.uid}`
          );
        }

        setUser(null);
        setRole(null);

        localStorage.removeItem("drishtee_user");
        localStorage.removeItem("drishtee_role");

        console.log("✅ Safe logout cleanup completed");
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [syncStudentPushToken]);

  /* ------------------------------------------------------ */
  /* Visitor Tracking + Device Vibration */
  /* ------------------------------------------------------ */
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const LAST_VISIT_KEY = "drishtee_last_visit";
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

        const now = Date.now();
        const lastVisit = localStorage.getItem(LAST_VISIT_KEY);

        if (
          !lastVisit ||
          now - Number(lastVisit) > TWENTY_FOUR_HOURS
        ) {
          await setDoc(
            doc(db, "stats", "visitors"),
            {
              count: increment(1),
              lastUpdated: new Date(),
            },
            { merge: true }
          );

          localStorage.setItem(
            LAST_VISIT_KEY,
            now.toString()
          );

          console.log("✅ Visitor counted");
        } else {
          console.log("⚡ Already counted within 24h");
        }
      } catch (error) {
        console.error("❌ Visitor tracking error:", error);
      }
    };

    trackVisit();
    vibration();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <Lock>
      <NetworkStatus />
      <Header />
      <InstallPrompt />

      <AnimatePresence mode="wait">
        <SwipeLayout>
          <Suspense fallback={<p className="text-center text-muted  p-5 m-5">Loading...</p>}>
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

              {/* Protected */}
              <Route
                path="/admin/*"
                element={
                  user && role === "admin"
                    ? <AdminRoutes />
                    : <Navigate to="/login" replace />
                }
              />

              <Route
                path="/student/*"
                element={
                  user && role === "student"
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
    </Lock>
  );
}
