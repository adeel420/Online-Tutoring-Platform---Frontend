import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";
import { MdDashboard, MdLogout } from "react-icons/md";
import { FaShieldAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const roleConfig = {
  admin: {
    label: "Admin",
    color: "from-green-500 to-emerald-500",
    path: "/admin_dashboard",
  },
  tutor: {
    label: "Tutor",
    color: "from-purple-500 to-pink-500",
    path: "/tutor_dashboard",
  },
  student: {
    label: "Student",
    color: "from-blue-500 to-cyan-500",
    path: "/student_dashboard",
  },
};

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/tutors", label: "Tutors" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropRef = useRef(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = roleConfig[user?.role] || roleConfig.student;
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  useEffect(() => {
    const closeDropdown = (event) => {
      if (dropRef.current && !dropRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    setMenuOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    setTimeout(() => navigate("/login"), 800);
  };

  const goToDashboard = () => {
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate(role.path);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              TutorHub
            </h1>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropdownOpen((open) => !open)}
                  className="flex items-center gap-2 focus:outline-none group"
                >
                  {user?.profile ? (
                    <img
                      src={user.profile}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border-2 border-purple-200 hover:border-purple-500 transition-all shadow"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow hover:shadow-lg transition-all">
                      {userInitial}
                    </div>
                  )}
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 px-4 py-4">
                      <div className="flex items-center gap-3">
                        {user?.profile ? (
                          <img
                            src={user.profile}
                            alt=""
                            className="w-11 h-11 rounded-full object-cover border-2 border-white/30"
                          />
                        ) : (
                          <div className="w-11 h-11 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-lg">
                            {userInitial}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm truncate">
                            {user?.name || "User"}
                          </p>
                          <p className="text-white/60 text-xs truncate">
                            {user?.email || ""}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r ${role.color} rounded-full text-white text-xs font-semibold`}
                      >
                        {role.label}
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={goToDashboard}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700 transition-all cursor-pointer group"
                      >
                        <span className="w-8 h-8 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center transition-colors">
                          <MdDashboard className="text-purple-600 text-base" />
                        </span>
                        Dashboard
                      </button>

                      {user?.role === "admin" && (
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate("/admin_dashboard");
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 transition-all cursor-pointer group"
                        >
                          <span className="w-8 h-8 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors">
                            <FaShieldAlt className="text-green-600 text-sm" />
                          </span>
                          Admin Panel
                        </button>
                      )}

                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all cursor-pointer group"
                        >
                          <span className="w-8 h-8 bg-red-100 group-hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors">
                            <MdLogout className="text-red-600 text-base" />
                          </span>
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="md:hidden text-gray-700 hover:text-purple-600 focus:outline-none"
          >
            {menuOpen ? (
              <RxCross1 className="w-7 h-7" />
            ) : (
              <RxHamburgerMenu className="w-7 h-7" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="px-4 py-3 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 hover:text-purple-600 font-medium"
              >
                {link.label}
              </Link>
            ))}

            {token ? (
              <div className="pt-3 border-t border-gray-100 space-y-1">
                <div className="flex items-center gap-3 px-2 py-2 mb-2">
                  {user?.profile ? (
                    <img
                      src={user.profile}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {userInitial}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {user?.name}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r ${role.color} rounded-full text-white text-xs font-semibold`}
                    >
                      {role.label}
                    </span>
                  </div>
                </div>

                <button
                  onClick={goToDashboard}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all cursor-pointer"
                >
                  <MdDashboard /> Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                >
                  <MdLogout /> Logout
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-gray-100 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/login");
                  }}
                  className="w-full text-left text-gray-700 hover:text-purple-600 font-medium cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/signup");
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-full font-medium hover:shadow-lg transition-all cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
