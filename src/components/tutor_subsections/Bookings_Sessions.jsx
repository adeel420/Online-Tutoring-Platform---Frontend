import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { formatTimeRange12 } from "../../utils/time";
import Loader from "../Loader";

const statusStyle = {
  pending_payment: "bg-orange-100 text-orange-600",
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

const currencyFormatter = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 0,
});

const PaymentBreakdown = ({ amount = 0 }) => {
  const total = Number(amount || 0);
  const adminFee = total * 0.1;
  const tutorPayout = total * 0.9;

  return (
    <div className="min-w-44 space-y-1">
      <p className="font-bold text-gray-800">
        Total: PKR {currencyFormatter.format(total)}
      </p>
      <p className="text-xs text-red-500">
        Admin 10%: -PKR {currencyFormatter.format(adminFee)}
      </p>
      <p className="text-xs font-semibold text-green-600">
        You get 90%: PKR {currencyFormatter.format(tutorPayout)}
      </p>
    </div>
  );
};

const Bookings_Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [complaint, setComplaint] = useState(null);
  const [complaintForm, setComplaintForm] = useState({ subject: "", message: "" });
  const [submittingComplaint, setSubmittingComplaint] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_API}/user/bookings`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setSessions(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to load sessions.");
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

  const openComplaint = (session) => {
    setComplaint(session);
    setComplaintForm({
      subject: `Complaint about ${session.subject || "session"}`,
      message: "",
    });
  };

  const submitComplaint = async () => {
    if (!complaint?.studentId) return;
    setSubmittingComplaint(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/complaints`,
        {
          bookingId: complaint.id,
          againstId: complaint.studentId,
          subject: complaintForm.subject,
          message: complaintForm.message,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(data.message || "Complaint submitted.");
      setComplaint(null);
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not submit complaint.");
    } finally {
      setSubmittingComplaint(false);
    }
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
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Student</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Subject</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Date & Time</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Amount</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Payment</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Status</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-10">
                    <div className="flex items-center justify-center">
                      <Loader size={36} />
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">
                    No sessions found
                  </td>
                </tr>
              ) : (
                filtered.map((session, index) => (
                  <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-gray-400">{index + 1}</td>
                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {session.student}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
                        {session.subject}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      <p>{session.date}</p>
                      <p className="text-xs text-gray-400">
                        {formatTimeRange12(session.from, session.to, session.time)}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <PaymentBreakdown amount={session.rawAmount} />
                    </td>
                    <td className="px-5 py-4 text-gray-600 capitalize">
                      {session.paymentStatus === "paid"
                        ? "Paid to admin"
                        : session.paymentStatus}
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
                    <td className="px-5 py-4">
                      <button
                        onClick={() => openComplaint(session)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-all cursor-pointer"
                      >
                        Complaint
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {complaint && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              File Complaint
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Against {complaint.student} for {complaint.subject}
            </p>
            <input
              value={complaintForm.subject}
              onChange={(event) =>
                setComplaintForm((prev) => ({ ...prev, subject: event.target.value }))
              }
              placeholder="Complaint subject"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 mb-3"
            />
            <textarea
              value={complaintForm.message}
              onChange={(event) =>
                setComplaintForm((prev) => ({ ...prev, message: event.target.value }))
              }
              rows={4}
              placeholder="Write complaint details..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={submitComplaint}
                disabled={submittingComplaint || !complaintForm.subject.trim() || !complaintForm.message.trim()}
                className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
              >
                {submittingComplaint ? "Submitting..." : "Submit Complaint"}
              </button>
              <button
                onClick={() => setComplaint(null)}
                disabled={submittingComplaint}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all cursor-pointer disabled:opacity-60"
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

export default Bookings_Sessions;
