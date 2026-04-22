import React from "react";
import { adminStats, adminRecentActivity, adminUsers, adminSessions } from "../../data/Data";

const Dashboard = () => {
  const totalStudents = adminUsers.filter((u) => u.role === "student").length;
  const totalTutors = adminUsers.filter((u) => u.role === "tutor").length;
  const activeSessions = adminSessions.filter((s) => s.status === "upcoming").length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <h2 className="text-2xl font-bold mb-1">Welcome back, Admin 👋</h2>
        <p className="text-white/70 text-sm">Here's what's happening on TutorHub today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {adminStats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-xl shadow`}>
                {stat.icon}
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 text-base">Recent Activity</h3>
          <div className="space-y-3">
            {adminRecentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.type}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Overview */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 text-base">Quick Overview</h3>
          <div className="space-y-4">
            {[
              { label: "Active Students", value: totalStudents, total: adminUsers.length, color: "bg-blue-500" },
              { label: "Active Tutors", value: totalTutors, total: adminUsers.length, color: "bg-purple-500" },
              { label: "Live Sessions", value: activeSessions, total: adminSessions.length, color: "bg-green-500" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 font-medium">{item.label}</span>
                  <span className="font-bold text-gray-800">{item.value}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.round((item.value / item.total) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
            <p className="text-xs text-gray-500 mb-1">Platform Health</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">98%</p>
            <p className="text-xs text-green-600 font-medium mt-0.5">✅ All systems operational</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
