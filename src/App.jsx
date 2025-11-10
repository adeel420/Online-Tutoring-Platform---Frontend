import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const location = useLocation();

  const hidePaths = ["/login", "/signup"];

  const hideHeaderFooter = hidePaths.includes(location.pathname);
  return (
    <>
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default App;
