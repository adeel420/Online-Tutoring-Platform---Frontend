import React, { useState } from "react";
import { allTutors } from "../data/Data";
import Chatbot from "../components/chatbot/Chatbot";

const Tutors = () => {
  const [search, setSearch] = useState("");
  const [filterAvail, setFilterAvail] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [selected, setSelected] = useState(null);

  const filtered = allTutors
    .filter((t) => {
      const q = search.toLowerCase();
      const matchSearch =
        t.name.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        t.location.toLowerCase().includes(q);
      const matchAvail =
        filterAvail === "all" ||
        (filterAvail === "available" && t.available) ||
        (filterAvail === "busy" && !t.available);
      return matchSearch && matchAvail;
    })
    .sort((a, b) =>
      sortBy === "rating"
        ? b.rating - a.rating
        : sortBy === "students"
          ? b.students - a.students
          : a.rate.localeCompare(b.rate),
    );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              Tutor
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-10">
            Browse Pakistan's top-rated tutors across all subjects. Filter by
            availability, rating, and more.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              🔍
            </span>
            <div className="p-[2px] rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500">
              <input
                type="text"
                placeholder="Search by name, subject, topic or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-[#2a2f8a] text-white text-base focus:outline-none focus:ring-4 focus:ring-purple-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100 py-5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {[
              { value: `${allTutors.length}+`, label: "Expert Tutors" },
              {
                value: `${allTutors.filter((t) => t.available).length}`,
                label: "Available Now",
              },
              { value: "10+", label: "Subjects" },
              { value: "4.7★", label: "Avg Rating" },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {s.value}
                </p>
                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All Tutors" },
                { key: "available", label: "✅ Available" },
                { key: "busy", label: "🔴 Busy" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilterAvail(f.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    filterAvail === f.key
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-500 mb-6">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filtered.length}
            </span>{" "}
            tutors
            {search && (
              <span>
                {" "}
                for "
                <span className="text-purple-600 font-semibold">{search}</span>"
              </span>
            )}
          </p>

          {/* Tutor Cards Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl font-semibold text-gray-600">
                No tutors found
              </p>
              <p className="text-gray-400 mt-2">
                Try a different search or filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((tutor) => (
                <div
                  key={tutor.id}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="p-8 flex flex-col flex-1 text-center">
                    {/* Avatar */}
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-6">
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg group-hover:scale-105 transition-transform duration-300">
                        {tutor.name[0]}
                      </div>
                      {/* availability dot */}
                      <span
                        className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${
                          tutor.available ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </div>

                    {/* Name & Subject */}
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 text-gray-900">
                      {tutor.name}
                    </h3>
                    <p className="text-purple-600 font-semibold mb-1 text-sm sm:text-base">
                      {tutor.subject}
                    </p>
                    <p className="text-gray-400 text-xs mb-4">
                      📍 {tutor.location}
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center items-center gap-3 mb-4 text-xs sm:text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-semibold">{tutor.rating}</span>
                      </div>
                      <div>{tutor.students}+ students</div>
                      <div>{tutor.experience}</div>
                    </div>

                    {/* Rate */}
                    <p className="text-purple-700 font-bold text-sm mb-5">
                      {tutor.rate}
                    </p>

                    {/* Button */}
                    <button
                      onClick={() => setSelected(tutor)}
                      className="w-full mt-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-sm sm:text-base cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Can't find the right tutor?
          </h2>
          <p className="text-gray-200 text-lg mb-8">
            Tell us what you need and we'll match you with the perfect tutor.
          </p>
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer">
            Request a Tutor 🎓
          </button>
        </div>
      </section>

      {/* Profile Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-t-3xl p-6 text-white text-center relative">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all cursor-pointer text-lg"
              >
                ✕
              </button>
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-black text-3xl font-bold mx-auto mb-3 shadow-lg">
                {selected.name[0]}
              </div>
              <h3 className="text-xl font-bold">{selected.name}</h3>
              <p className="text-white/80 text-sm mt-0.5">{selected.subject}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                  selected.available
                    ? "bg-green-400/20 text-green-300"
                    : "bg-gray-400/20 text-gray-300"
                }`}
              >
                {selected.available
                  ? "● Available for Booking"
                  : "● Currently Busy"}
              </span>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: "Rating",
                    value: `⭐ ${selected.rating}`,
                    bg: "bg-yellow-50 border-yellow-100",
                  },
                  {
                    label: "Students",
                    value: `👥 ${selected.students}`,
                    bg: "bg-blue-50 border-blue-100",
                  },
                  {
                    label: "Experience",
                    value: selected.experience,
                    bg: "bg-purple-50 border-purple-100",
                  },
                  {
                    label: "Rate",
                    value: selected.rate,
                    bg: "bg-green-50 border-green-100",
                  },
                ].map((d, i) => (
                  <div
                    key={i}
                    className={`${d.bg} border rounded-xl p-3 text-center`}
                  >
                    <p className="text-xs text-gray-500 mb-1">{d.label}</p>
                    <p className="font-bold text-gray-800 text-sm">{d.value}</p>
                  </div>
                ))}
              </div>

              {/* Details */}
              <div className="space-y-3">
                {[
                  {
                    icon: "🎓",
                    label: "Qualification",
                    value: selected.qualification,
                  },
                  { icon: "📍", label: "Location", value: selected.location },
                ].map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <span className="text-xl">{d.icon}</span>
                    <div>
                      <p className="text-xs text-gray-500">{d.label}</p>
                      <p className="font-semibold text-gray-800 text-sm">
                        {d.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bio */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  About
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selected.bio}
                </p>
              </div>

              {/* Tags */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Specializations
                </p>
                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Student Reviews
                </p>
                <div className="space-y-2">
                  {selected.reviews.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {r.student[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-gray-800">
                            {r.student}
                          </p>
                          <span className="text-xs text-yellow-500">
                            {"★".repeat(r.rating)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          "{r.text}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  disabled={!selected.available}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                    selected.available
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg cursor-pointer"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {selected.available
                    ? "📅 Book a Session"
                    : "Currently Unavailable"}
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Chatbot />
    </div>
  );
};

export default Tutors;
