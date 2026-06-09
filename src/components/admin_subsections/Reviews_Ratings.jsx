import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../Loader";

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

const Reviews_Ratings = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_SERVER_API}/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => setReviews(Array.isArray(data) ? data : []))
      .catch((err) => {
        toast.error(err.response?.data?.error || "Could not load reviews.");
      })
      .finally(() => setLoading(false));
  }, []);

  const avgRating = useMemo(() => {
    if (!reviews.length) return "0.0";
    return (
      reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
      reviews.length
    ).toFixed(1);
  }, [reviews]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Reviews", value: reviews.length, icon: "★", color: "from-yellow-500 to-orange-500" },
          { label: "Avg Rating", value: avgRating, icon: "↗", color: "from-purple-500 to-pink-500" },
          { label: "5 Star", value: reviews.filter((r) => r.rating === 5).length, icon: "5", color: "from-green-500 to-emerald-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white font-bold shadow`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
          <h3 className="font-bold text-gray-800">Reviews & Feedback</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader size={36} />
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-center py-10 text-gray-400">No reviews found</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {review.student?.[0] || "S"}
                      </div>
                      <span className="font-semibold text-gray-800">{review.student}</span>
                      <span className="text-gray-400 text-xs">to</span>
                      <span className="text-purple-700 font-medium text-sm">{review.tutor}</span>
                    </div>

                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-sm ${star <= review.rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">({review.rating}/5)</span>
                    </div>

                    <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2">
                      "{review.review || "No written feedback."}"
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(review.date)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews_Ratings;
