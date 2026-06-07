import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../Loader";

// Checks if a Cloudinary URL is a PDF (raw resource) or an image
const isPdfUrl = (url) =>
  url?.includes("/raw/upload/") || url?.toLowerCase().includes(".pdf");

const DocViewer = ({ url, label }) => {
  if (!url) {
    return (
      <p className="text-sm text-gray-400 bg-gray-50 rounded-xl p-3">
        Not uploaded
      </p>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {isPdfUrl(url) ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 p-3 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors text-sm font-semibold"
        >
          📄 View {label} (PDF)
        </a>
      ) : (
        <img
          src={url}
          alt={label}
          className="w-full max-h-52 object-contain bg-gray-50 p-2"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      )}
      <div
        style={{ display: "none" }}
        className="items-center justify-center p-4 bg-gray-50 text-gray-400 text-sm"
      >
        ⚠️ Could not load image.{" "}
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-purple-600 underline ml-1"
        >
          Open directly
        </a>
      </div>
    </div>
  );
};

const Tutor_Verification = () => {
  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [actionId, setActionId] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_API}/user/admin/tutors`,
          { headers },
        );
        setTutors(data);
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to load tutors.");
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  const handleApprove = async (tutor) => {
    setActionId(tutor._id);
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_API}/user/approve-teacher/${tutor._id}`,
        {},
        { headers },
      );
      setTutors((prev) =>
        prev.map((t) => (t._id === tutor._id ? { ...t, isApproved: true } : t)),
      );
      setSelected((prev) => (prev ? { ...prev, isApproved: true } : null));
      toast.success(`${tutor.name} approved! Approval email sent. ✅`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Approval failed.");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (tutor) => {
    if (
      !window.confirm(
        `Reject ${tutor.name}? This will delete their account and notify them by email.`,
      )
    )
      return;
    setActionId(tutor._id);
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_API}/user/reject-teacher/${tutor._id}`,
        { headers },
      );
      setTutors((prev) => prev.filter((t) => t._id !== tutor._id));
      setSelected(null);
      toast.success(`${tutor.name} rejected and notified by email.`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Rejection failed.");
    } finally {
      setActionId(null);
    }
  };

  const pending = tutors.filter((t) => !t.isApproved);
  const approved = tutors.filter((t) => t.isApproved);
  const filteredTutors = tutors.filter((tutor) => {
    const query = search.toLowerCase();
    const matchesSearch =
      tutor.name?.toLowerCase().includes(query) ||
      tutor.email?.toLowerCase().includes(query) ||
      tutor.phone?.toLowerCase().includes(query);
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && !tutor.isApproved) ||
      (filter === "approved" && tutor.isApproved);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total",
            count: tutors.length,
            color: "from-purple-500 to-blue-500",
            icon: "👨🏫",
          },
          {
            label: "Pending",
            count: pending.length,
            color: "from-orange-500 to-yellow-500",
            icon: "⏳",
          },
          {
            label: "Approved",
            count: approved.length,
            color: "from-green-500 to-emerald-500",
            icon: "✅",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3"
          >
            <div
              className={`w-10 h-10 bg-gradient-to-r ${s.color} rounded-xl flex items-center justify-center text-lg shadow`}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{s.count}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tutor List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
          <h3 className="font-bold text-gray-800">All Tutors</h3>
          <p className="text-xs text-gray-500 mt-1">
            Search all registered tutors and review their verification status.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            />
            <div className="flex gap-2">
              {["all", "pending", "approved"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all cursor-pointer ${
                    filter === item
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredTutors.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">👨🏫</div>
            <p>No tutors found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredTutors.map((tutor) => (
              <div
                key={tutor._id}
                className="p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Avatar + Info */}
                  <div className="flex items-center gap-3 flex-1">
                    {tutor.profile ? (
                      <img
                        src={tutor.profile}
                        alt=""
                        className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                        {tutor.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-800">
                        {tutor.name}
                      </p>
                      <p className="text-xs text-gray-500">{tutor.email}</p>
                      <p className="text-xs text-gray-400">{tutor.phone}</p>
                    </div>
                  </div>

                  {/* Status + Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        tutor.isApproved
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {tutor.isApproved ? "Approved" : "Pending"}
                    </span>

                    <button
                      onClick={() => setSelected(tutor)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-all cursor-pointer"
                    >
                      View Docs
                    </button>

                    {!tutor.isApproved && (
                      <>
                        <button
                          onClick={() => handleApprove(tutor)}
                          disabled={actionId === tutor._id}
                          className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {actionId === tutor._id ? "..." : "Approve"}
                        </button>
                        <button
                          onClick={() => handleReject(tutor)}
                          disabled={actionId === tutor._id}
                          className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {actionId === tutor._id ? "..." : "Reject"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
          Showing {filteredTutors.length} of {tutors.length} tutors
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-t-2xl p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selected.profile ? (
                    <img
                      src={selected.profile}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
                      {selected.name[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-base">{selected.name}</h3>
                    <p className="text-white/70 text-xs">{selected.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Phone", value: selected.phone, icon: "📞" },
                  {
                    label: "Status",
                    value: selected.isApproved ? "Approved" : "Pending",
                    icon: "📋",
                  },
                  {
                    label: "Verified",
                    value: selected.isVerified ? "Yes" : "No",
                    icon: "✉️",
                  },
                  {
                    label: "Joined",
                    value: new Date(selected.createdAt).toLocaleDateString(
                      "en-PK",
                      { year: "numeric", month: "short", day: "numeric" },
                    ),
                    icon: "📅",
                  },
                ].map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl"
                  >
                    <span>{d.icon}</span>
                    <div>
                      <p className="text-xs text-gray-500">{d.label}</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {d.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bank Details */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Bank Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: "Bank", value: selected.bankDetails?.bankName },
                    {
                      label: "Account Title",
                      value: selected.bankDetails?.accountTitle,
                    },
                    {
                      label: "Account Number",
                      value: selected.bankDetails?.accountNumber,
                    },
                    { label: "IBAN", value: selected.bankDetails?.iban },
                  ].map((d) => (
                    <div key={d.label} className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500">{d.label}</p>
                      <p className="text-sm font-semibold text-gray-800 break-words">
                        {d.value || "Not provided"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CNIC */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  🪪 National ID (CNIC)
                </p>
                <DocViewer url={selected.cnic} label="CNIC" />
              </div>

              {/* Experience Letter */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  📄 Experience Letter
                </p>
                <DocViewer
                  url={selected.experienceLetter}
                  label="Experience Letter"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-1">
                {!selected.isApproved ? (
                  <>
                    <button
                      onClick={() => handleApprove(selected)}
                      disabled={actionId === selected._id}
                      className="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      {actionId === selected._id
                        ? "Processing..."
                        : "✅ Approve"}
                    </button>
                    <button
                      onClick={() => handleReject(selected)}
                      disabled={actionId === selected._id}
                      className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      {actionId === selected._id
                        ? "Processing..."
                        : "❌ Reject"}
                    </button>
                  </>
                ) : (
                  <div className="flex-1 py-2.5 bg-green-50 text-green-700 rounded-xl font-semibold text-sm text-center border border-green-200">
                    ✅ Already Approved
                  </div>
                )}
                <button
                  onClick={() => setSelected(null)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutor_Verification;
