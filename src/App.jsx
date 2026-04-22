import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Tutors from "./pages/Tutors";
import Admin_Dashboard from "./pages/Dashboards/Admin_Dashboard";
import Tutor_Dashboard from "./pages/Dashboards/Tutor_Dashboard";
import Student_Dashboard from "./pages/Dashboards/Student_Dashboard";

function App() {
  const location = useLocation();

  const hidePaths = [
    "/login",
    "/signup",
    "/admin_dashboard",
    "/tutor_dashboard",
    "/student_dashboard",
  ];

  const hideHeaderFooter = hidePaths.includes(location.pathname);
  return (
    <>
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tutors" element={<Tutors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin_dashboard" element={<Admin_Dashboard />} />
        <Route path="/tutor_dashboard" element={<Tutor_Dashboard />} />
        <Route path="/student_dashboard" element={<Student_Dashboard />} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default App;
