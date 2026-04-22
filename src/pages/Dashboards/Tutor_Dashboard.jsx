import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { tutorTabs } from "../../data/Data";
import { FiMenu, FiX } from "react-icons/fi";
import Dashboard from "../../components/tutor_subsections/Dashboard";
import My_Profile from "../../components/tutor_subsections/My_Profile";
import Availability_Schedule from "../../components/tutor_subsections/Availability_Schedule";
import Bookings_Sessions from "../../components/tutor_subsections/Bookings_Sessions";
import Live_Session from "../../components/tutor_subsections/Live_Session";
import Learning_Materials from "../../components/tutor_subsections/Learning_Materials";

import Chat_Messages from "../../components/tutor_subsections/Chat_Messages";

const tabs = [
  Dashboard,
  My_Profile,
  Availability_Schedule,
  Bookings_Sessions,
  Live_Session,
  Chat_Messages,
  Learning_Materials,
];

const Tutor_Dashboard = () => {
  const [activeBtn, setActiveBtn] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  const ActiveComponent = tabs[activeBtn];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 w-11 h-11 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center shadow-lg"
      >
        {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky md:top-0 w-64 h-screen flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white shadow-2xl z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center font-bold text-black text-lg shadow-lg">
              T
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">TutorHub</p>
              <p className="text-white/60 text-xs">Tutor Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tutorTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveBtn(tab.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeBtn === tab.id
                  ? "bg-white text-purple-700 shadow-lg"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.title}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setShowLogout(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            <span className="text-base">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="ml-10 md:ml-0">
            <h2 className="text-xl font-bold text-gray-800">
              {tutorTabs[activeBtn]?.icon} {tutorTabs[activeBtn]?.title}
            </h2>
            <p className="text-xs text-gray-500">TutorHub Tutor Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow">
              A
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <ActiveComponent />
        </div>
      </main>

      {/* Logout Modal */}
      {showLogout && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              🚪
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Confirm Logout
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              Are you sure you want to logout from the tutor panel?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
              >
                Logout
              </button>
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutor_Dashboard;
