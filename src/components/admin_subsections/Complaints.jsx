import React, { useState } from "react";
import { adminComplaints } from "../../data/Data";

const Complaints = () => {
  const [complaints, setComplaints] = useState(adminComplaints);
  const [action, setAction] = useState(null); // { id, type }

  const updateStatus = (id, status) =>
    setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));

  const pending = complaints.filter((c) => c.status === "pending").length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Complaints", value: complaints.length, icon: "🚨", color: "from-red-500 to-rose-500" },
          { label: "Pending", value: pending, icon: "⏳", color: "from-orange-500 to-yellow-500" },
          { label: "Resolved", value: resolved, icon: "✅", color: "from-green-500 to-emerald-500" },
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

      {/* Complaints List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
          <h3 className="font-bold text-gray-800">All Complaints</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {complaints.map((c) => (
            <div key={c.id} className="p-5 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-800">{c.from}</span>
                    <span className="text-gray-400 text-xs">complained against</span>
                    <span className="font-semibold text-purple-700">{c.against}</span>
                    <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-semibold ${
                      c.status === "pending" ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-700"
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2">"{c.issue}"</p>
                  <p className="text-xs text-gray-400">{c.date}</p>
                </div>

                {c.status === "pending" && (
                  <div className="flex flex-wrap gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateStatus(c.id, "resolved")}
                      className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition-all cursor-pointer"
                    >
                      ✅ Resolve
                    </button>
                    <button
                      onClick={() => setAction({ id: c.id, type: "warn" })}
                      className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-semibold hover:bg-yellow-200 transition-all cursor-pointer"
                    >
                      ⚠️ Warn
                    </button>
                    <button
                      onClick={() => setAction({ id: c.id, type: "ban" })}
                      className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200 transition-all cursor-pointer"
                    >
                      🚫 Ban
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Confirm Modal */}
      {action && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
            <div className="text-4xl mb-3">{action.type === "ban" ? "🚫" : "⚠️"}</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 capitalize">
              {action.type} User
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to {action.type} this user? This action will be logged.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { updateStatus(action.id, "resolved"); setAction(null); }}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-white transition-all cursor-pointer ${
                  action.type === "ban"
                    ? "bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-lg"
                    : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-lg"
                }`}
              >
                Confirm
              </button>
              <button
                onClick={() => setAction(null)}
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

export default Complaints;
