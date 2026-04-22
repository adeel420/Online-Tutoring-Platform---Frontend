import React, { useState } from "react";
import { adminReviews } from "../../data/Data";

const Reviews_Ratings = () => {
  const [reviews, setReviews] = useState(adminReviews);
  const [filter, setFilter] = useState("all");

  const removeReview = (id) => setReviews((prev) => prev.filter((r) => r.id !== id));
  const toggleFlag = (id) =>
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, flagged: !r.flagged } : r));

  const filtered = filter === "flagged" ? reviews.filter((r) => r.flagged) : reviews;

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Reviews", value: reviews.length, icon: "⭐", color: "from-yellow-500 to-orange-500" },
          { label: "Avg Rating", value: avgRating, icon: "📊", color: "from-purple-500 to-pink-500" },
          { label: "Flagged", value: reviews.filter((r) => r.flagged).length, icon: "🚩", color: "from-red-500 to-rose-500" },
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

      {/* Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-2">
        {["all", "flagged"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all cursor-pointer ${
              filter === f
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f === "flagged" ? "🚩 Flagged Only" : "All Reviews"}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
          <h3 className="font-bold text-gray-800">Reviews & Feedback</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <p className="text-center py-10 text-gray-400">No reviews found</p>
          ) : (
            filtered.map((r) => (
              <div key={r.id} className={`p-5 hover:bg-gray-50 transition-colors ${r.flagged ? "border-l-4 border-red-400" : ""}`}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {r.student[0]}
                      </div>
                      <span className="font-semibold text-gray-800">{r.student}</span>
                      <span className="text-gray-400 text-xs">→</span>
                      <span className="text-purple-700 font-medium text-sm">{r.tutor}</span>
                      {r.flagged && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-semibold">🚩 Flagged</span>
                      )}
                    </div>

                    {/* Stars */}
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-sm ${star <= r.rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">({r.rating}/5)</span>
                    </div>

                    <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2">"{r.review}"</p>
                    <p className="text-xs text-gray-400">{r.date}</p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleFlag(r.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        r.flagged
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                      }`}
                    >
                      {r.flagged ? "Unflag" : "🚩 Flag"}
                    </button>
                    <button
                      onClick={() => removeReview(r.id)}
                      className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200 transition-all cursor-pointer"
                    >
                      Remove
                    </button>
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
