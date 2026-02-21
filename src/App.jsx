import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css"
import { Spinner } from "react-bootstrap";

// 🔒 Security & UX
import Lock from "./Components/HomePage/LockWeb/Lock";
import UserSelectNone from "./Components/HomePage/LockWeb/UserSelectNone";
import CopyBoard from "./Components/HomePage/LockWeb/CopyBoard";

import Header from "./Components/Header/Header";
import InstallPrompt from "./Components/HomePage/LockWeb/InstallPrompt";
import NetworkStatus from "./Components/HomePage/LockWeb/NetworkStatus";
import HelmetManager from "./Components/HomePage/pages/HelmetManager";

// 🌐 Public Pages
import Home from "./Components/HomePage/Home";
import About from "./Components/HomePage/pages/About/About";
import OurCourses from "./Components/HomePage/pages/Course/OurCourses";
import Branch from "./Components/HomePage/pages/Branch/Branch";
import Gallery from "./Components/HomePage/pages/Gallery";
import AdmissionForm from "./AdminComponents/Admissions/AdmissionForm";
import Verification from "./Components/HomePage/pages/Verification/Verification";
import QueryForm from "./Components/HomePage/pages/QueryFrom";
import Certificate from "./Components/HomePage/pages/Course/Ceritificate";
import ComputerLanguage from "./Components/HomePage/pages/Course/ComputerLanguage";
import Designing from "./Components/HomePage/pages/Course/Designing";
import WebDev from "./Components/HomePage/pages/Course/WebDev";
import Nielet from "./Components/HomePage/pages/Course/Nielet";
import Banking from "./Components/HomePage/pages/Course/Banking";
import Discription from "./Components/HomePage/pages/Course/Discription";
import Library from "./Components/HomePage/pages/Library/Library";


// 🧑‍💻 Dashboards
import StudentRoutes from "./StudentComponents/StudentRoutes";

import AdminRoutes from "./AdminComponents/AdminRoutes";

// 🔒 Firebase
import { authListener, getUserRole } from "./firebase/auth";

// 🧭 Fallback
import PageNotFound from "./Components/HomePage/pages/PageNotFound";
import LocationMapCard from "./Components/HomePage/pages/Location/LocationMapCard";
import LoginForm from "./Components/Header/LoginForm";
import ChatPage from "./Components/Chats/ChatPage";
import LoadingSpinner from "./AdminComponents/Common/LoadingSpinner";

export default function App() {


  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  if (loading) {
    return (<LoadingSpinner />);
  }

  return (
    <div>
      {/* <Lock>
        <UserSelectNone>
          <CopyBoard> */}

      <NetworkStatus />
      <Header />
      <InstallPrompt />

      <Routes>
        {/* 🌐 Public Routes */}

        <Route path="/" element={<HelmetManager><Home /></HelmetManager>} />

        <Route path="/about" element={<HelmetManager><About /></HelmetManager>} />

        <Route path="/courses" element={<HelmetManager><OurCourses /></HelmetManager>} />

        <Route path="/branch/thoothibari" element={<HelmetManager><Branch /></HelmetManager>} />

        <Route path="/gallery" element={<HelmetManager><Gallery /></HelmetManager>} />

        <Route path="/new-admission" element={<HelmetManager><AdmissionForm /></HelmetManager>} />

        <Route path="/branch/nichlaul/location" element={<HelmetManager><LocationMapCard /></HelmetManager>} />
        <Route path="/branch/thoothibari/location" element={<HelmetManager><LocationMapCard /></HelmetManager>} />
        <Route path="/download-certificate" element={<HelmetManager><Verification /></HelmetManager>} />

        <Route path="/contact-us" element={<HelmetManager><QueryForm /></HelmetManager>} />

        <Route path="/login" element={<HelmetManager><LoginForm /></HelmetManager>} />

        <Route path="/certificate" element={<HelmetManager><Certificate /></HelmetManager>} />

        {/* 📚 Course Pages (Better Structure) */}
        <Route path="/courses/computer-language" element={<HelmetManager><ComputerLanguage /></HelmetManager>} />

        <Route path="/courses/designing" element={<HelmetManager><Designing /></HelmetManager>} />

        <Route path="/courses/web-development" element={<HelmetManager><WebDev /></HelmetManager>} />

        <Route path="/courses/nielit" element={<HelmetManager><Nielet /></HelmetManager>} />

        <Route path="/courses/banking" element={<HelmetManager><Banking /></HelmetManager>} />

        <Route path="/courses/description" element={<HelmetManager><Discription /></HelmetManager>} />

        <Route path="/library" element={<HelmetManager><Library /></HelmetManager>} />

        <Route path="/chat" element={<ChatPage />} />

        {/* 🔐 ADMIN BASE */}
        <Route
          path="/admin/*"
          element={
            user && role === "admin"
              ? <AdminRoutes />
              : <Navigate to="/" replace />
          }
        />

        {/* 🎓 STUDENT */}
        <Route
          path="/student/*"
          element={
            loading ? null : (
              user && role === "student"
                ? <StudentRoutes />
                : <Navigate to="/" replace />
            )
          }
        />

        {/* ❌ 404 */}
        <Route path="*" element={<HelmetManager><PageNotFound /></HelmetManager>} />

      </Routes>
      {/* </CopyBoard>
        </UserSelectNone>
      </Lock> */}
    </div>
  );
}
