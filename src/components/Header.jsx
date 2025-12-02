import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                TutorHub
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                Contact
              </Link>
              <Link
                to="/services"
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                Services
              </Link>
            </div>

            {/* Right Buttons (Desktop) */}
            <div className="hidden md:flex items-center space-x-4">
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
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
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

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
            <div className="px-4 py-3 space-y-3">
              <Link
                to="/"
                className="block text-gray-700 hover:text-purple-600 font-medium"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block text-gray-700 hover:text-purple-600 font-medium"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block text-gray-700 hover:text-purple-600 font-medium"
              >
                Contact
              </Link>
              <Link
                to="/services"
                className="block text-gray-700 hover:text-purple-600 font-medium"
              >
                Services
              </Link>

              <div className="pt-3 border-t border-gray-100 flex flex-col gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full text-left text-gray-700 hover:text-purple-600 font-medium cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-full font-medium hover:shadow-lg transition-all cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;
