import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import Loader from "../Loader";
import { formatTimeRange12 } from "../../utils/time";

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
  const [reviewing, setReviewing] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, review: "" });
  const [savingReview, setSavingReview] = useState(false);
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

  const openReview = (session) => {
    setReviewing(session);
    setReviewForm({
      rating: session.review?.rating || 5,
      review: session.review?.review || "",
    });
  };

  const submitReview = async () => {
    if (!reviewing?.tutorId) return;
    setSavingReview(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/reviews/tutors/${reviewing.tutorId}`,
        reviewForm,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSessions((prev) =>
        prev.map((session) =>
          session.tutorId === reviewing.tutorId
            ? {
                ...session,
                review: {
                  id: data.review.id,
                  rating: data.review.rating,
                  review: data.review.review,
                },
              }
            : session,
        ),
      );
      toast.success(data.message || "Review saved.");
      setReviewing(null);
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not save review.");
    } finally {
      setSavingReview(false);
    }
  };

  const openComplaint = (session) => {
    setComplaint(session);
    setComplaintForm({
      subject: `Complaint about ${session.subject || "session"}`,
      message: "",
    });
  };

  const submitComplaint = async () => {
    if (!complaint?.tutorId) return;
    setSubmittingComplaint(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/complaints`,
        {
          bookingId: complaint.id,
          againstId: complaint.tutorId,
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
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Tutor</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Subject</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Date & Time</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Amount</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Payment</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Status</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Review</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Complaint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12">
                    <div className="flex items-center justify-center">
                      <Loader size={36} />
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-400">
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
                      <p className="text-xs text-gray-400">
                        {formatTimeRange12(session.from, session.to, session.time)}
                      </p>
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
                    <td className="px-5 py-4">
                      {session.status === "completed" &&
                      session.paymentStatus === "paid" ? (
                        <button
                          onClick={() => openReview(session)}
                          className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-semibold hover:bg-yellow-200 transition-all cursor-pointer"
                        >
                          {session.review ? "Edit Review" : "Review"}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">After session</span>
                      )}
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

      {reviewing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              Review {reviewing.tutor}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{reviewing.subject}</p>

            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                  className="text-2xl cursor-pointer"
                >
                  <FaStar
                    className={
                      star <= reviewForm.rating ? "text-yellow-400" : "text-gray-200"
                    }
                  />
                </button>
              ))}
            </div>

            <textarea
              value={reviewForm.review}
              onChange={(event) =>
                setReviewForm((prev) => ({ ...prev, review: event.target.value }))
              }
              rows={4}
              placeholder="Write your feedback..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={submitReview}
                disabled={savingReview}
                className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
              >
                {savingReview ? "Saving..." : "Save Review"}
              </button>
              <button
                onClick={() => setReviewing(null)}
                disabled={savingReview}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all cursor-pointer disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {complaint && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              File Complaint
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Against {complaint.tutor} for {complaint.subject}
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

export default My_Bookings;
