import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { formatTimeRange12 } from "../../utils/time";

const getActivityDetails = (booking) => {
  if (booking.status === "completed") {
    return {
      icon: "✅",
      name: `${booking.student || "Student"} completed ${booking.subject || "a session"}`,
    };
  }

  if (booking.status === "cancelled") {
    return {
      icon: "✕",
      name: `${booking.student || "Student"} cancelled ${booking.subject || "a session"}`,
    };
  }

  if (booking.status === "upcoming") {
    return {
      icon: "📅",
      name: `${booking.student || "Student"} booked ${booking.subject || "a session"}`,
    };
  }

  return {
    icon: "💳",
    name: `${booking.student || "Student"} has a pending payment`,
  };
};

const formatRelativeTime = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Recently";

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_API}/user/bookings`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const { completed, upcoming, studentsTaught, netEarnings, recentActivity } =
    useMemo(() => {
    const completedSessions = bookings.filter(
      (booking) =>
        booking.status === "completed" && booking.paymentStatus === "paid",
    );

    const uniqueCompletedStudents = new Set(
      completedSessions
        .map((booking) => booking.studentId || booking.student)
        .filter(Boolean),
    );

    const grossEarnings = completedSessions.reduce(
      (sum, booking) => sum + Number(booking.rawAmount || 0),
      0,
    );

    return {
      completed: completedSessions,
      upcoming: bookings.filter((booking) => booking.status === "upcoming"),
      studentsTaught: uniqueCompletedStudents.size,
      netEarnings: grossEarnings * 0.9,
      recentActivity: [...bookings]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        )
        .slice(0, 5)
        .map((booking) => ({
          ...getActivityDetails(booking),
          time: formatRelativeTime(booking.createdAt),
        })),
    };
  }, [bookings]);

  const currencyFormatter = new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  });

  const tutorStats = [
    {
      label: "Total Sessions",
      value: completed.length,
      icon: "📅",
      color: "from-blue-500 to-cyan-500",
      change: "Completed",
    },
    {
      label: "Upcoming",
      value: upcoming.length,
      icon: "⏰",
      color: "from-purple-500 to-pink-500",
      change: "Booked",
    },
    {
      label: "Students",
      value: studentsTaught,
      icon: "🎓",
      color: "from-green-500 to-emerald-500",
      change: "Taught",
    },
    {
      label: "Earnings",
      value: `PKR ${currencyFormatter.format(netEarnings)}`,
      icon: "💰",
      color: "from-orange-500 to-yellow-500",
      change: "After 10% fee",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <h2 className="text-2xl font-bold mb-1">
            Welcome back,{" "}
            {user?.name
              ?.split(" ")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
              )
              .join(" ")}{" "}
            👋
          </h2>
          <p className="text-white/70 text-sm">
            You have{" "}
            <span className="text-yellow-400 font-semibold">
              {loading ? "..." : upcoming.length} upcoming sessions
            </span>{" "}
            booked.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {tutorStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-11 h-11 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-xl shadow`}
              >
                {stat.icon}
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {loading ? "..." : stat.value}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Upcoming Sessions</h3>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader size={36} />
            </div>
          ) : upcoming.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">
              No upcoming sessions
            </p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {s.student?.[0] || "S"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">
                      {s.student}
                    </p>
                    <p className="text-xs text-gray-500">
                      {s.subject} - {s.duration}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-purple-700">
                      {formatTimeRange12(s.from, s.to, s.time)}
                    </p>
                    <p className="text-xs text-gray-400">{s.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader size={32} />
            </div>
          ) : recentActivity.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">
              No recent activity
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={`${item.name}-${i}`} className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-base flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 leading-snug">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
