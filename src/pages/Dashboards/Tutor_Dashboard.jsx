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
import useNotifications from "../../hooks/useNotifications";

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
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}"),
  );

  const ActiveComponent = tabs[activeBtn];
  const { badges, markSeen } = useNotifications();
  const tabKeys = {
    3: "bookings",
    4: "sessions",
    5: "messages",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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
                markSeen(tabKeys[tab.id]);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeBtn === tab.id
                  ? "bg-white text-purple-700 shadow-lg"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="flex-1 text-left">{tab.title}</span>
              {badges[tabKeys[tab.id]] > 0 && (
                <span className="min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {badges[tabKeys[tab.id]]}
                </span>
              )}
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
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="ml-10 md:ml-0">
            <h2 className="text-xl font-bold text-gray-800">
              {tutorTabs[activeBtn]?.icon} {tutorTabs[activeBtn]?.title}
            </h2>
            <p className="text-xs text-gray-500">TutorHub Tutor Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-200 transition-all cursor-pointer whitespace-nowrap"
            >
              <span className="sm:hidden">Home</span>
              <span className="hidden sm:inline">Back to Homepage</span>
            </button>
            {user?.profile ? (
              <div>
                <img
                  src={user?.profile}
                  className="h-[45px] w-[45px] rounded-full "
                  alt=""
                />
              </div>
            ) : (
              <div className="w-9 h-9 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8 min-w-0">
          <ActiveComponent onProfileUpdate={setUser} />
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
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
              >
                Logout
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Back to Homepage
                </button>
                <button
                  onClick={() => setShowLogout(false)}
                  className="w-full border border-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutor_Dashboard;
