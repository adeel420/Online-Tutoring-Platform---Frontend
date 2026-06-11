import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Tutors from "./pages/Tutors";
import Admin_Dashboard from "./pages/Dashboards/Admin_Dashboard";
import Tutor_Dashboard from "./pages/Dashboards/Tutor_Dashboard";
import Student_Dashboard from "./pages/Dashboards/Student_Dashboard";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  const hidePaths = [
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/admin_dashboard",
    "/tutor_dashboard",
    "/student_dashboard",
  ];

  const publicPaths = [
    "/",
    "/about",
    "/how-it-works",
    "/privacy-policy",
    "/contact",
    "/tutors",
  ];
  const isKnownPath =
    publicPaths.includes(location.pathname) ||
    hidePaths.includes(location.pathname) ||
    /^\/subjects\/[^/]+$/.test(location.pathname);
  const hideHeaderFooter = hidePaths.includes(location.pathname) || !isKnownPath;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: "12px", fontWeight: "500", fontSize: "14px" },
          success: { style: { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" } },
          error:   { style: { background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" } },
        }}
      />
      {!hideHeaderFooter && <Header />}
      <Routes>
        {/* Public routes */}
        <Route path="/"               element={<Home />} />
        <Route path="/about"          element={<About />} />
        <Route path="/how-it-works"   element={<HowItWorks />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/contact"        element={<Contact />} />
        <Route path="/tutors"         element={<Tutors />} />
        <Route path="/subjects/:subject" element={<Tutors />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/signup"         element={<Signup />} />
        <Route path="/verify-email"   element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Private routes */}
        <Route
          path="/admin_dashboard"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Admin_Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/tutor_dashboard"
          element={
            <PrivateRoute allowedRoles={["tutor"]}>
              <Tutor_Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/student_dashboard"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <Student_Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default App;
