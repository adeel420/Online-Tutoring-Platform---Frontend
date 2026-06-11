import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../Loader";

const currencyFormatter = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 0,
});

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

const getBookingActivity = (booking) => {
  if (booking.status === "completed") {
    return {
      icon: "Done",
      type: "Session completed",
      name: `${booking.student || "Student"} completed ${booking.subject || "a session"}`,
      date: booking.createdAt,
    };
  }

  if (booking.status === "upcoming") {
    return {
      icon: "Book",
      type: "Session booked",
      name: `${booking.student || "Student"} booked ${booking.subject || "a session"}`,
      date: booking.createdAt,
    };
  }

  return {
    icon: "Pay",
    type: booking.status?.replace("_", " ") || "Booking activity",
    name: `${booking.student || "Student"} - ${booking.subject || "Session"}`,
    date: booking.createdAt,
  };
};

const getPaymentActivity = (payment) => ({
  icon: "PKR",
  type: payment.status === "paid" ? "Payment received" : "Payment update",
  name: `${payment.student || "Student"} paid ${payment.amount || "PKR 0"}`,
  date: payment.date,
});

const getUserActivity = (user) => ({
  icon: user.role === "tutor" ? "Tutor" : "User",
  type: `New ${user.role}`,
  name: `${user.name || "User"} joined TutorHub`,
  date: user.createdAt,
});

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = import.meta.env.VITE_SERVER_API;

        const [usersRes, bookingsRes, paymentsRes] = await Promise.all([
          axios.get(`${apiUrl}/user/admin/users`, { headers }),
          axios.get(`${apiUrl}/user/admin/bookings`, { headers }),
          axios.get(`${apiUrl}/payment/admin/payments`, { headers }),
        ]);

        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
        setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
        setPayments(Array.isArray(paymentsRes.data) ? paymentsRes.data : []);
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const {
    totalStudents,
    totalTutors,
    upcomingSessions,
    completedSessions,
    paidRevenue,
    adminFee,
    recentActivity,
    platformHealth,
  } = useMemo(() => {
    const students = users.filter((item) => item.role === "student");
    const tutors = users.filter((item) => item.role === "tutor");
    const paidPayments = payments.filter((payment) => payment.status === "paid");
    const paidTotal = paidPayments.reduce(
      (total, payment) => total + Number(payment.rawAmount || 0),
      0,
    );

    const activity = [
      ...bookings.slice(0, 5).map(getBookingActivity),
      ...paidPayments.slice(0, 5).map(getPaymentActivity),
      ...users.slice(0, 5).map(getUserActivity),
    ]
      .sort(
        (a, b) =>
          new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime(),
      )
      .slice(0, 6)
      .map((item) => ({ ...item, time: formatRelativeTime(item.date) }));

    const activeUsers = users.filter((item) => item.isVerified).length;
    const health = users.length ? Math.round((activeUsers / users.length) * 100) : 100;

    return {
      totalStudents: students.length,
      totalTutors: tutors.length,
      upcomingSessions: bookings.filter((item) => item.status === "upcoming").length,
      completedSessions: bookings.filter((item) => item.status === "completed").length,
      paidRevenue: paidTotal,
      adminFee: paidTotal * 0.1,
      recentActivity: activity,
      platformHealth: health,
    };
  }, [users, bookings, payments]);

  const stats = [
    {
      label: "Total Students",
      value: totalStudents,
      icon: "Students",
      color: "from-blue-500 to-cyan-500",
      change: "Registered",
    },
    {
      label: "Total Tutors",
      value: totalTutors,
      icon: "Tutors",
      color: "from-purple-500 to-pink-500",
      change: "Registered",
    },
    {
      label: "Upcoming Sessions",
      value: upcomingSessions,
      icon: "Sessions",
      color: "from-green-500 to-emerald-500",
      change: `${completedSessions} completed`,
    },
    {
      label: "Admin Earnings",
      value: `PKR ${currencyFormatter.format(adminFee)}`,
      icon: "Fee",
      color: "from-orange-500 to-yellow-500",
      change: "10% fee",
    },
  ];

  const quickOverview = [
    {
      label: "Active Students",
      value: users.filter((item) => item.role === "student" && item.isVerified).length,
      total: Math.max(totalStudents, 1),
      color: "bg-blue-500",
    },
    {
      label: "Active Tutors",
      value: users.filter((item) => item.role === "tutor" && item.isVerified).length,
      total: Math.max(totalTutors, 1),
      color: "bg-purple-500",
    },
    {
      label: "Paid Revenue",
      value: paidRevenue,
      total: Math.max(paidRevenue + adminFee, 1),
      color: "bg-green-500",
      isCurrency: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
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
          Here's what's happening on TutorHub today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`min-w-11 h-11 px-2 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white text-xs font-bold shadow`}
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
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 text-base">
            Recent Activity
          </h3>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader size={36} />
            </div>
          ) : recentActivity.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              No recent activity
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div
                  key={`${item.name}-${i}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-[10px] font-bold text-purple-700 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 text-base">
            Quick Overview
          </h3>
          <div className="space-y-4">
            {quickOverview.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 font-medium">{item.label}</span>
                  <span className="font-bold text-gray-800">
                    {loading
                      ? "..."
                      : item.isCurrency
                        ? `PKR ${currencyFormatter.format(item.value)}`
                        : item.value}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{
                      width: `${Math.min(100, Math.round((item.value / item.total) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
            <p className="text-xs text-gray-500 mb-1">Platform Health</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {loading ? "..." : `${platformHealth}%`}
            </p>
            <p className="text-xs text-green-600 font-medium mt-0.5">
              Users verified and platform activity available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
