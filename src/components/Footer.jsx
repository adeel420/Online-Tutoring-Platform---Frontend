import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                TutorHub
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Empowering students across Pakistan with world-class online
              tutoring.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-lg">Landing Pages</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="/"
                  className="hover:text-purple-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/tutors"
                  className="hover:text-purple-400 transition-colors"
                >
                  Tutors
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-purple-400 transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-lg">Support Pages</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="/how-it-works"
                  className="hover:text-purple-400 transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-purple-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-purple-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-lg">Contact Info</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-300 flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt />
                </span>
                <p>Lahore, Pakistan</p>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-300 flex items-center justify-center flex-shrink-0">
                  <FaPhoneAlt />
                </span>
                <a
                  href="tel:+923209430934"
                  className="hover:text-purple-400 transition-colors"
                >
                  +92 320 9430934
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-300 flex items-center justify-center flex-shrink-0">
                  <FaEnvelope />
                </span>
                <a
                  href="mailto:tutorhub@gmail.com"
                  className="hover:text-purple-400 transition-colors break-all"
                >
                  tutorhub@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 py-8 text-center text-gray-400">
          <p>&copy; copyright by tutorhub 2026</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
