import React, { useState } from "react";
import { studentBookings } from "../../data/Data";

const statusStyle = {
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

const My_Bookings = () => {
  const [sessions, setSessions] = useState(studentBookings);
  const [filter, setFilter] = useState("all");

  const cancelSession = (id) =>
    setSessions((p) => p.map((s) => s.id === id ? { ...s, status: "cancelled" } : s));

  const filtered = filter === "all" ? sessions : sessions.filter((s) => s.status === filter);

  const counts = {
    all: sessions.length,
    upcoming: sessions.filter((s) => s.status === "upcoming").length,
    completed: sessions.filter((s) => s.status === "completed").length,
    cancelled: sessions.filter((s) => s.status === "cancelled").length,
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: counts.all, icon: "📋", color: "from-purple-500 to-blue-500" },
          { label: "Upcoming", value: counts.upcoming, icon: "⏰", color: "from-blue-500 to-cyan-500" },
          { label: "Completed", value: counts.completed, icon: "✅", color: "from-green-500 to-emerald-500" },
          { label: "Cancelled", value: counts.cancelled, icon: "❌", color: "from-red-500 to-rose-500" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${s.color} rounded-xl flex items-center justify-center text-lg shadow`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-2">
        {Object.entries(counts).map(([key, count]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all cursor-pointer flex items-center gap-2 ${
              filter === key
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {key}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              filter === key ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">#</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Tutor</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Subject</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Date & Time</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Duration</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Amount</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Status</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">No sessions found</td>
                </tr>
              ) : (
                filtered.map((s, i) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-gray-400">{i + 1}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {s.tutor[0]}
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">{s.tutor}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">{s.subject}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      <p className="text-sm">{s.date}</p>
                      <p className="text-xs text-gray-400">{s.time}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-sm">{s.duration}</td>
                    <td className="px-5 py-4 font-semibold text-gray-800 text-sm">{s.amount}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[s.status]}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {s.status === "upcoming" ? (
                        <button
                          onClick={() => cancelSession(s.id)}
                          className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200 transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
          Showing {filtered.length} of {sessions.length} bookings
        </div>
      </div>
    </div>
  );
};

export default My_Bookings;
