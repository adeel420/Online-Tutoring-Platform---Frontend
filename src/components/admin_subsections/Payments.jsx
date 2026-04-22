import React, { useState } from "react";
import { adminPayments } from "../../data/Data";

const statusStyle = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-orange-100 text-orange-600",
  failed: "bg-red-100 text-red-600",
};

const Payments = () => {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? adminPayments : adminPayments.filter((p) => p.status === filter);

  const totalPaid = adminPayments.filter((p) => p.status === "paid").length;
  const totalPending = adminPayments.filter((p) => p.status === "pending").length;
  const totalFailed = adminPayments.filter((p) => p.status === "failed").length;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Transactions", value: adminPayments.length, icon: "💳", color: "from-purple-500 to-blue-500" },
          { label: "Paid", value: totalPaid, icon: "✅", color: "from-green-500 to-emerald-500" },
          { label: "Pending", value: totalPending, icon: "⏳", color: "from-orange-500 to-yellow-500" },
          { label: "Failed", value: totalFailed, icon: "❌", color: "from-red-500 to-rose-500" },
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

      {/* Earnings Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-white/70 text-sm mb-1">Total Earnings (May 2025)</p>
          <p className="text-3xl font-bold">PKR 5,200</p>
        </div>
        <div className="flex gap-4 text-center">
          <div className="bg-white/10 rounded-xl px-4 py-2">
            <p className="text-lg font-bold">PKR 4,000</p>
            <p className="text-xs text-white/70">Collected</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2">
            <p className="text-lg font-bold">PKR 800</p>
            <p className="text-xs text-white/70">Pending</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2">
            <p className="text-lg font-bold">PKR 1,200</p>
            <p className="text-xs text-white/70">Failed</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-2">
        {["all", "paid", "pending", "failed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all cursor-pointer ${
              filter === f
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">#</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Student</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Tutor</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Amount</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Date</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">No payments found</td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-gray-400">{i + 1}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {p.student[0]}
                        </div>
                        <span className="font-semibold text-gray-800">{p.student}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{p.tutor}</td>
                    <td className="px-5 py-4 font-bold text-gray-800">{p.amount}</td>
                    <td className="px-5 py-4 text-gray-500">{p.date}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
          Showing {filtered.length} of {adminPayments.length} transactions
        </div>
      </div>
    </div>
  );
};

export default Payments;
