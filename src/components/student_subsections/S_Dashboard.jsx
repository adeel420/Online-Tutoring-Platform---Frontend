import React from "react";
import { studentStats, studentNotifications, studentBookings } from "../../data/Data";

const S_Dashboard = () => {
  const upcoming = studentBookings.filter((b) => b.status === "upcoming");
  const recent = studentBookings.filter((b) => b.status === "completed").slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <h2 className="text-2xl font-bold mb-1">Welcome back, Ali Hassan 👋</h2>
          <p className="text-white/70 text-sm">You have <span className="text-yellow-400 font-semibold">{upcoming.length} upcoming sessions</span> this week.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {studentStats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-xl shadow`}>
                {stat.icon}
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Upcoming Sessions</h3>
          {upcoming.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No upcoming sessions</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {s.tutor[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">{s.tutor}</p>
                    <p className="text-xs text-gray-500">{s.subject} · {s.duration}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-purple-700">{s.time}</p>
                    <p className="text-xs text-gray-400">{s.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Notifications</h3>
          <div className="space-y-3">
            {studentNotifications.map((notif) => (
              <div key={notif.id} className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${notif.unread ? "bg-purple-50" : ""}`}>
                <div className="w-9 h-9 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-base flex-shrink-0">
                  {notif.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-800 leading-snug">{notif.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{notif.time}</p>
                </div>
                {notif.unread && <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-1" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Recent Sessions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {recent.map((s) => (
            <div key={s.id} className="p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {s.tutor[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{s.tutor}</p>
                  <p className="text-xs text-gray-500">{s.subject}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">{s.date}</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">Completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default S_Dashboard;
