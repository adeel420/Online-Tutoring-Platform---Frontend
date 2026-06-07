import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../Loader";

const Manage_Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null); // tracks which row is loading

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_API}/user/admin/users`,
          { headers },
        );
        setUsers(data);
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    setActionId(user._id);
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_SERVER_API}/user/admin/users/${user._id}/toggle-status`,
        {},
        { headers },
      );
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isVerified: data.isVerified } : u,
        ),
      );
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.error || "Action failed.");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    setActionId(user._id);
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_API}/user/admin/users/${user._id}`,
        { headers },
      );
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      toast.success(`${user.name} deleted successfully.`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Delete failed.");
    } finally {
      setActionId(null);
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.role === filter;
    return matchSearch && matchFilter;
  });

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-PK", {
          year: "numeric",
          month: "short",
        })
      : "—";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header + Filters */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Manage Users</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="🔍  Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <div className="flex gap-2">
            {["all", "student", "tutor"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all cursor-pointer ${
                  filter === f
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">
                  #
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">
                  Name
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">
                  Email
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">
                  Role
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">
                  Joined
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((user, i) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-4 text-gray-400">{i + 1}</td>

                    {/* Name + Avatar */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        {user.profile ? (
                          <img
                            src={user.profile}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {user.name[0]}
                          </div>
                        )}
                        <span className="font-semibold text-gray-800">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-500">{user.email}</td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.role === "tutor"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.isVerified
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {user.isVerified ? "active" : "inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          disabled={actionId === user._id}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 ${
                            user.isVerified
                              ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                              : "bg-green-100 text-green-600 hover:bg-green-200"
                          }`}
                        >
                          {actionId === user._id
                            ? "..."
                            : user.isVerified
                              ? "Deactivate"
                              : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={actionId === user._id}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-600 hover:bg-red-200 transition-all cursor-pointer disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>
    </div>
  );
};

export default Manage_Users;
