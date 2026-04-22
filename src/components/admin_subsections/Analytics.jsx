import React, { useState } from "react";
import { analyticsData, adminStats } from "../../data/Data";

const Bar = ({ value, max, color, label }) => (
  <div className="flex flex-col items-center gap-1.5 flex-1">
    <span className="text-xs font-semibold text-gray-700">{value.toLocaleString()}</span>
    <div className="w-full bg-gray-100 rounded-full flex flex-col justify-end" style={{ height: "120px" }}>
      <div
        className={`w-full ${color} rounded-full transition-all duration-700`}
        style={{ height: `${Math.round((value / max) * 100)}%` }}
      />
    </div>
    <span className="text-xs text-gray-500">{label}</span>
  </div>
);

const Analytics = () => {
  const [metric, setMetric] = useState("students");

  const metricConfig = {
    students: { label: "Student Growth", color: "bg-blue-500", max: Math.max(...analyticsData.map((d) => d.students)) },
    sessions: { label: "Session Stats", color: "bg-purple-500", max: Math.max(...analyticsData.map((d) => d.sessions)) },
    revenue: { label: "Revenue (PKR)", color: "bg-green-500", max: Math.max(...analyticsData.map((d) => d.revenue)) },
  };

  const current = metricConfig[metric];

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {adminStats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-lg shadow mb-3`}>
              {stat.icon}
            </div>
            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="text-xs text-green-600 font-semibold mt-1">{stat.change} this month</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h3 className="font-bold text-gray-800">Platform Growth</h3>
          <div className="flex gap-2">
            {Object.entries(metricConfig).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setMetric(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                  metric === key
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-end gap-3 px-2">
          {analyticsData.map((d, i) => (
            <Bar
              key={i}
              value={d[metric]}
              max={current.max}
              color={current.color}
              label={d.month}
            />
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">{current.label} — Jan to May 2025</p>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
          <h3 className="font-bold text-gray-800">Monthly Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Month</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">New Students</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Sessions</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {analyticsData.map((d, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-gray-800">{d.month}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">{d.students}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">{d.sessions}</span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-gray-700">PKR {d.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
