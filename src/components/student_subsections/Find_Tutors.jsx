import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../Loader";

const normalizeTutor = (tutor, index = 0) => ({
  id: tutor._id || tutor.id || index,
  name: tutor.name || "Tutor",
  subject: tutor.subject || "Subject not added",
  rating: tutor.rating || 4.5,
  students: tutor.students || 0,
  experience: tutor.experience || "Experience not added",
  rate: tutor.rate || "Rate not added",
  available: tutor.available ?? true,
  qualification: tutor.qualification || "Qualification not added",
  location: tutor.location || "Location not added",
  bio: tutor.bio || "This tutor has not added a bio yet.",
  tags:
    Array.isArray(tutor.tags) && tutor.tags.length
      ? tutor.tags
      : [tutor.subject || "Tutoring"],
  reviews: Array.isArray(tutor.reviews) ? tutor.reviews : [],
  profile: tutor.profile || tutor.image || "",
});

const Find_Tutors = () => {
  const [search, setSearch] = useState("");
  const [filterAvail, setFilterAvail] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [selected, setSelected] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_API}/user/tutors`,
        );
        setTutors((Array.isArray(data) ? data : []).map(normalizeTutor));
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to load tutors.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  const filtered = useMemo(() => {
    return tutors
      .filter((t) => {
        const query = search.toLowerCase();
        const matchSearch =
          t.name.toLowerCase().includes(query) ||
          t.subject.toLowerCase().includes(query) ||
          t.location.toLowerCase().includes(query) ||
          t.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchAvail =
          filterAvail === "all" ||
          (filterAvail === "available" && t.available) ||
          (filterAvail === "busy" && !t.available);
        return matchSearch && matchAvail;
      })
      .sort((a, b) =>
        sortBy === "rating"
          ? b.rating - a.rating
          : a.rate.localeCompare(b.rate),
      );
  }, [filterAvail, search, sortBy, tutors]);

  return (
    <div className="space-y-5">
      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="🔍  Search by name, subject or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <div className="flex gap-2 flex-wrap">
            {["all", "available", "busy"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterAvail(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all cursor-pointer ${
                  filterAvail === f
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            >
              <option value="rating">Sort: Rating</option>
              <option value="price">Sort: Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tutor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <div className="sm:col-span-2 xl:col-span-3 flex items-center justify-center py-16">
            <Loader size={40} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="sm:col-span-2 xl:col-span-3 text-center py-12 text-gray-400">
            No tutors found
          </div>
        ) : (
          filtered.map((tutor) => (
            <div
              key={tutor.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow">
                  {tutor.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 truncate">
                    {tutor.name}
                  </p>
                  <p className="text-xs text-purple-600 font-medium">
                    {tutor.subject}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                    tutor.available
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tutor.available ? "● Available" : "● Busy"}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  ⭐ <strong>{tutor.rating}</strong>
                </span>
                <span>·</span>
                <span>👥 {tutor.students} students</span>
                <span>·</span>
                <span>⏱ {tutor.experience}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tutor.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Rate + Actions */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800 text-sm">
                  {tutor.rate} / hour
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelected(tutor)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-all cursor-pointer"
                  >
                    View
                  </button>
                  <button
                    disabled={!tutor.available}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      tutor.available
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-md cursor-pointer"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Profile Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow">
                {selected.name[0]}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {selected.name}
                </h3>
                <p className="text-sm text-purple-600 font-medium">
                  {selected.subject}
                </p>
                <span
                  className={`text-xs font-semibold ${selected.available ? "text-green-600" : "text-gray-400"}`}
                >
                  {selected.available ? "● Available" : "● Busy"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                {
                  label: "Rating",
                  value: `⭐ ${selected.rating}`,
                  bg: "bg-yellow-50",
                },
                {
                  label: "Students",
                  value: `👥 ${selected.students}`,
                  bg: "bg-blue-50",
                },
                {
                  label: "Experience",
                  value: `⏱ ${selected.experience}`,
                  bg: "bg-purple-50",
                },
                { label: "Rate", value: selected.rate, bg: "bg-green-50" },
              ].map((d, i) => (
                <div key={i} className={`${d.bg} rounded-xl p-3`}>
                  <p className="text-xs text-gray-500">{d.label}</p>
                  <p className="font-bold text-gray-800 text-sm mt-0.5">
                    {d.value} {d.label === "Rate" && "/ hour"}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {selected.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                disabled={!selected.available}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  selected.available
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg cursor-pointer"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Book Session
              </button>
              <button
                onClick={() => setSelected(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Find_Tutors;
