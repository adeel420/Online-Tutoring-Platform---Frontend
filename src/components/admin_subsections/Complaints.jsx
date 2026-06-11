import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../Loader";

const statusStyle = {
  pending: "bg-orange-100 text-orange-600",
  resolved: "bg-green-100 text-green-700",
  warned: "bg-yellow-100 text-yellow-700",
  banned: "bg-red-100 text-red-600",
};

const formatDate = (dateValue) =>
  dateValue
    ? new Date(dateValue).toLocaleString("en-PK", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Recently";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_API}/complaints`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const openAction = (complaint, type) => {
    setAction({ complaint, type });
    setAdminNote("");
  };

  const submitAction = async () => {
    if (!action?.complaint?.id) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${import.meta.env.VITE_SERVER_API}/complaints/${action.complaint.id}/action`,
        { status: action.type, adminNote },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setComplaints((prev) =>
        prev.map((item) =>
          item.id === action.complaint.id ? data.complaint : item,
        ),
      );
      toast.success(data.message || "Complaint updated.");
      setAction(null);
    } catch (err) {
      toast.error(err.response?.data?.error || "Action failed.");
    } finally {
      setSaving(false);
    }
  };

  const pending = complaints.filter((c) => c.status === "pending").length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;
  const warned = complaints.filter((c) => c.status === "warned").length;
  const banned = complaints.filter((c) => c.status === "banned").length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: complaints.length, color: "from-red-500 to-rose-500" },
          { label: "Pending", value: pending, color: "from-orange-500 to-yellow-500" },
          { label: "Resolved", value: resolved, color: "from-green-500 to-emerald-500" },
          { label: "Warned/Banned", value: warned + banned, color: "from-purple-500 to-blue-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`min-w-10 h-10 px-2 bg-gradient-to-r ${s.color} rounded-xl flex items-center justify-center text-white text-xs font-bold shadow`}>
              {s.label.slice(0, 3)}
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{loading ? "..." : s.value}</p>
              <p className="text-xs text-gray-500">{s.label} Complaints</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
          <h3 className="font-bold text-gray-800">All Complaints</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader size={40} />
          </div>
        ) : complaints.length === 0 ? (
          <p className="text-center py-12 text-gray-400 text-sm">
            No complaints found
          </p>
        ) : (
          <div className="divide-y divide-gray-50">
            {complaints.map((c) => (
              <div key={c.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col xl:flex-row xl:items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-800">{c.complainant}</span>
                      <span className="text-gray-400 text-xs">complained against</span>
                      <span className="font-semibold text-purple-700">{c.against}</span>
                      <span className={`xl:ml-auto px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[c.status] || "bg-gray-100 text-gray-600"}`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg">
                        From: {c.complainantRole}
                      </span>
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg">
                        Against: {c.againstRole}
                      </span>
                      <span>{formatDate(c.createdAt)}</span>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-3 py-2">
                      <p className="text-sm font-semibold text-gray-800">{c.subject}</p>
                      <p className="text-sm text-gray-600 mt-1">{c.message}</p>
                    </div>
                    {c.adminNote && (
                      <p className="text-xs text-gray-500">
                        Admin note: {c.adminNote}
                      </p>
                    )}
                  </div>

                  {c.status === "pending" && (
                    <div className="flex flex-wrap gap-2 flex-shrink-0">
                      <button
                        onClick={() => openAction(c, "resolved")}
                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition-all cursor-pointer"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => openAction(c, "warned")}
                        className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-semibold hover:bg-yellow-200 transition-all cursor-pointer"
                      >
                        Warn
                      </button>
                      <button
                        onClick={() => openAction(c, "banned")}
                        className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200 transition-all cursor-pointer"
                      >
                        Ban
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {action && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2 capitalize">
              {action.type} Complaint
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              This action will be saved against {action.complaint.against}.
            </p>
            <textarea
              value={adminNote}
              onChange={(event) => setAdminNote(event.target.value)}
              rows={3}
              placeholder="Optional admin note..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={submitAction}
                disabled={saving}
                className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
              >
                {saving ? "Saving..." : "Confirm"}
              </button>
              <button
                onClick={() => setAction(null)}
                disabled={saving}
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

export default Complaints;
