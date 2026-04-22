import React, { useState } from "react";
import { pendingTutors } from "../../data/Data";

const Tutor_Verification = () => {
  const [tutors, setTutors] = useState(
    pendingTutors.map((t) => ({ ...t, status: "pending" }))
  );
  const [selected, setSelected] = useState(null);

  const updateStatus = (id, status) =>
    setTutors((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));

  const pending = tutors.filter((t) => t.status === "pending");
  const approved = tutors.filter((t) => t.status === "approved");
  const rejected = tutors.filter((t) => t.status === "rejected");

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending", count: pending.length, color: "from-orange-500 to-yellow-500", icon: "⏳" },
          { label: "Approved", count: approved.length, color: "from-green-500 to-emerald-500", icon: "✅" },
          { label: "Rejected", count: rejected.length, color: "from-red-500 to-rose-500", icon: "❌" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${s.color} rounded-xl flex items-center justify-center text-lg shadow`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{s.count}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tutor Cards */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
          <h3 className="font-bold text-gray-800">Tutor Applications</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {tutors.map((tutor) => (
            <div key={tutor.id} className="p-5 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Avatar + Info */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-11 h-11 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    {tutor.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{tutor.name}</p>
                    <p className="text-xs text-gray-500">{tutor.email}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-2 flex-1">
                  <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">📚 {tutor.subject}</span>
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">🎓 {tutor.qualification}</span>
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">⏱ {tutor.experience}</span>
                </div>

                {/* Status + Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    tutor.status === "pending" ? "bg-orange-100 text-orange-600"
                    : tutor.status === "approved" ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                  }`}>
                    {tutor.status}
                  </span>
                  <button
                    onClick={() => setSelected(tutor)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-all cursor-pointer"
                  >
                    View
                  </button>
                  {tutor.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(tutor.id, "approved")}
                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition-all cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(tutor.id, "rejected")}
                        className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200 transition-all cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow">
                {selected.name[0]}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{selected.name}</h3>
                <p className="text-sm text-gray-500">{selected.email}</p>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              {[
                { label: "Subject", value: selected.subject, icon: "📚" },
                { label: "Qualification", value: selected.qualification, icon: "🎓" },
                { label: "Experience", value: selected.experience, icon: "⏱" },
                { label: "Status", value: selected.status, icon: "📋" },
              ].map((d, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-lg">{d.icon}</span>
                  <div>
                    <p className="text-xs text-gray-500">{d.label}</p>
                    <p className="text-sm font-semibold text-gray-800 capitalize">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelected(null)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutor_Verification;
