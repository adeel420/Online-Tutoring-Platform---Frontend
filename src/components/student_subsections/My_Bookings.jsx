import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../Loader";

const statusStyle = {
  pending_payment: "bg-orange-100 text-orange-600",
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

const My_Bookings = () => {
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_API}/user/bookings`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setSessions(data);
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filtered =
    filter === "all" ? sessions : sessions.filter((s) => s.status === filter);

  const counts = {
    all: sessions.length,
    pending_payment: sessions.filter((s) => s.status === "pending_payment").length,
    upcoming: sessions.filter((s) => s.status === "upcoming").length,
    completed: sessions.filter((s) => s.status === "completed").length,
    cancelled: sessions.filter((s) => s.status === "cancelled").length,
  };

  return (
    <div className="space-y-5">
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
            {key.replace("_", " ")}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                filter === key ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">#</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Tutor</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Subject</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Date & Time</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Amount</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Payment</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12">
                    <div className="flex items-center justify-center">
                      <Loader size={36} />
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    No sessions found
                  </td>
                </tr>
              ) : (
                filtered.map((session, index) => (
                  <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-gray-400">{index + 1}</td>
                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {session.tutor}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
                        {session.subject}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      <p>{session.date}</p>
                      <p className="text-xs text-gray-400">{session.time}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {session.amount}
                    </td>
                    <td className="px-5 py-4 capitalize text-gray-600">
                      {session.paymentStatus}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          statusStyle[session.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {session.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default My_Bookings;
