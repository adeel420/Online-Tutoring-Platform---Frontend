import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import toast from "react-hot-toast";
import Loader from "../Loader";

const currencyFormatter = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 0,
});

const monthLabel = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Unknown";

  return date.toLocaleDateString("en-PK", {
    month: "short",
    year: "2-digit",
  });
};

const buildMonthlyData = (users, bookings, payments) => {
  const monthMap = new Map();

  const ensureMonth = (label) => {
    if (!monthMap.has(label)) {
      monthMap.set(label, {
        month: label,
        students: 0,
        tutors: 0,
        sessions: 0,
        revenue: 0,
        adminFee: 0,
      });
    }
    return monthMap.get(label);
  };

  users.forEach((user) => {
    const row = ensureMonth(monthLabel(user.createdAt));
    if (user.role === "student") row.students += 1;
    if (user.role === "tutor") row.tutors += 1;
  });

  bookings.forEach((booking) => {
    const row = ensureMonth(monthLabel(booking.createdAt));
    row.sessions += 1;
  });

  payments
    .filter((payment) => payment.status === "paid")
    .forEach((payment) => {
      const row = ensureMonth(monthLabel(payment.date));
      const amount = Number(payment.rawAmount || 0);
      row.revenue += amount;
      row.adminFee += amount * 0.1;
    });

  return [...monthMap.values()]
    .filter((row) => row.month !== "Unknown")
    .sort((a, b) => new Date(`1 ${a.month}`) - new Date(`1 ${b.month}`))
    .slice(-6);
};

const countByStatus = (items, statuses) =>
  statuses.map((status) => items.filter((item) => item.status === status).length);

const ChartPanel = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
    <h3 className="font-bold text-gray-800 mb-4">{title}</h3>
    <div className="relative h-72">{children}</div>
  </div>
);

const ChartCanvas = ({ config }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return undefined;

    const chart = new Chart(canvasRef.current, {
      ...config,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              usePointStyle: true,
              font: { size: 11, weight: "600" },
            },
          },
          tooltip: {
            backgroundColor: "#111827",
            padding: 12,
            cornerRadius: 10,
          },
          ...(config.options?.plugins || {}),
        },
        scales: config.type === "doughnut" ? undefined : {
          x: {
            grid: { display: false },
            ticks: { color: "#6b7280", font: { size: 11 } },
          },
          y: {
            beginAtZero: true,
            grid: { color: "#f3f4f6" },
            ticks: { color: "#6b7280", font: { size: 11 } },
          },
        },
        ...(config.options || {}),
      },
    });

    return () => chart.destroy();
  }, [config]);

  return <canvas ref={canvasRef} />;
};

const Analytics = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
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
        toast.error(err.response?.data?.error || "Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const {
    monthlyData,
    totalStudents,
    totalTutors,
    totalSessions,
    paidRevenue,
    adminFee,
    sessionStatusData,
    paymentStatusData,
  } = useMemo(() => {
    const paidTotal = payments
      .filter((payment) => payment.status === "paid")
      .reduce((total, payment) => total + Number(payment.rawAmount || 0), 0);

    return {
      monthlyData: buildMonthlyData(users, bookings, payments),
      totalStudents: users.filter((user) => user.role === "student").length,
      totalTutors: users.filter((user) => user.role === "tutor").length,
      totalSessions: bookings.length,
      paidRevenue: paidTotal,
      adminFee: paidTotal * 0.1,
      sessionStatusData: countByStatus(bookings, [
        "pending_payment",
        "upcoming",
        "completed",
        "cancelled",
      ]),
      paymentStatusData: countByStatus(payments, ["paid", "pending", "failed"]),
    };
  }, [users, bookings, payments]);

  const labels = monthlyData.map((item) => item.month);

  const summaryCards = [
    {
      label: "Students",
      value: totalStudents,
      helper: "Registered learners",
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Tutors",
      value: totalTutors,
      helper: "Registered tutors",
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Sessions",
      value: totalSessions,
      helper: "All bookings",
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Admin Fee",
      value: `PKR ${currencyFormatter.format(adminFee)}`,
      helper: "10% of paid revenue",
      color: "from-orange-500 to-yellow-500",
    },
  ];

  const growthConfig = {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Students",
          data: monthlyData.map((item) => item.students),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.12)",
          tension: 0.35,
          fill: true,
        },
        {
          label: "Tutors",
          data: monthlyData.map((item) => item.tutors),
          borderColor: "#9333ea",
          backgroundColor: "rgba(147, 51, 234, 0.12)",
          tension: 0.35,
          fill: true,
        },
      ],
    },
  };

  const sessionsConfig = {
    type: "bar",
    data: {
      labels: ["Pending", "Upcoming", "Completed", "Cancelled"],
      datasets: [
        {
          label: "Sessions",
          data: sessionStatusData,
          backgroundColor: ["#fb923c", "#3b82f6", "#22c55e", "#ef4444"],
          borderRadius: 8,
        },
      ],
    },
  };

  const paymentsConfig = {
    type: "doughnut",
    data: {
      labels: ["Paid", "Pending", "Failed"],
      datasets: [
        {
          data: paymentStatusData,
          backgroundColor: ["#22c55e", "#fb923c", "#ef4444"],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      cutout: "62%",
    },
  };

  const revenueConfig = {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Paid Revenue",
          data: monthlyData.map((item) => item.revenue),
          backgroundColor: "#16a34a",
          borderRadius: 8,
        },
        {
          label: "Admin Fee",
          data: monthlyData.map((item) => item.adminFee),
          backgroundColor: "#f97316",
          borderRadius: 8,
        },
      ],
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div
              className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white text-xs font-bold shadow mb-3`}
            >
              {stat.label.slice(0, 3)}
            </div>
            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="text-xs text-green-600 font-semibold mt-1">
              {stat.helper}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartPanel title="User Growth">
          <ChartCanvas config={growthConfig} />
        </ChartPanel>

        <ChartPanel title="Session Status">
          <ChartCanvas config={sessionsConfig} />
        </ChartPanel>

        <ChartPanel title="Payment Status">
          <ChartCanvas config={paymentsConfig} />
        </ChartPanel>

        <ChartPanel title="Revenue and Admin Fee">
          <ChartCanvas config={revenueConfig} />
        </ChartPanel>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
          <h3 className="font-bold text-gray-800">Monthly Breakdown</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Paid revenue: PKR {currencyFormatter.format(paidRevenue)} | Admin fee:
            PKR {currencyFormatter.format(adminFee)}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Month</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Students</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Tutors</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Sessions</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Revenue</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Admin Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {monthlyData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    No analytics data found
                  </td>
                </tr>
              ) : (
                monthlyData.map((item) => (
                  <tr key={item.month} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-gray-800">
                      {item.month}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{item.students}</td>
                    <td className="px-5 py-3.5 text-gray-600">{item.tutors}</td>
                    <td className="px-5 py-3.5 text-gray-600">{item.sessions}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-700">
                      PKR {currencyFormatter.format(item.revenue)}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-orange-600">
                      PKR {currencyFormatter.format(item.adminFee)}
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

export default Analytics;
