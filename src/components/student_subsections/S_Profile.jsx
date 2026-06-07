import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../Loader";

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  grade: "",
  city: "",
  bio: "",
  profile: "",
};

const normalizeProfile = (data = {}) => ({
  ...emptyProfile,
  ...data,
  grade: data.qualification || data.grade || "",
  city: data.location || data.city || "",
});

const S_Profile = ({ onProfileUpdate }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(emptyProfile);
  const [draft, setDraft] = useState(emptyProfile);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [pwMsg, setPwMsg] = useState("");

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_SERVER_API;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/user/login-detail`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const nextProfile = normalizeProfile(data);
        setProfile(nextProfile);
        setDraft(nextProfile);
        setProfilePreview(nextProfile.profile || "");
      } catch (err) {
        toast.error(err.response?.data?.error || "Could not load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [apiUrl, token]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setDraft((previous) => ({ ...previous, [name]: value }));
  };

  const handleImageFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setProfilePic(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleEdit = () => {
    setDraft(profile);
    setProfilePic(null);
    setProfilePreview(profile.profile || "");
    setEditing(true);
  };

  const handleCancel = () => {
    setDraft(profile);
    setProfilePic(null);
    setProfilePreview(profile.profile || "");
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", draft.name || "");
      formData.append("phone", draft.phone || "");
      formData.append("qualification", draft.grade || "");
      formData.append("location", draft.city || "");
      formData.append("bio", draft.bio || "");
      if (profilePic) formData.append("profile", profilePic);

      const { data } = await axios.put(`${apiUrl}/user/student/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = normalizeProfile(data.user);
      setProfile(updated);
      setDraft(updated);
      setProfilePic(null);
      setProfilePreview(updated.profile || "");
      setEditing(false);

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const nextStoredUser = {
        ...storedUser,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        profile: updated.profile,
      };
      localStorage.setItem("user", JSON.stringify(nextStoredUser));
      onProfileUpdate?.(nextStoredUser);
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Profile update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setPwMsg("All fields are required.");
    } else if (passwords.newPass !== passwords.confirm) {
      setPwMsg("Passwords do not match.");
    } else if (passwords.newPass.length < 6) {
      setPwMsg("Password must be at least 6 characters.");
    } else {
      setPwMsg("Password API is not connected yet.");
      setPasswords({ current: "", newPass: "", confirm: "" });
    }
    setTimeout(() => setPwMsg(""), 3000);
  };

  const displayProfile = editing ? draft : profile;
  const avatarSrc = editing ? profilePreview : profile.profile;

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <Loader size={42} />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 flex gap-1 w-fit">
        {["profile", "password"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab === "profile" ? "Profile" : "Password"}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900" />
            <div className="px-6 pb-6">
              <div className="flex items-end justify-between -mt-10 mb-4 gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white overflow-hidden">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt={displayProfile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      displayProfile.name?.[0] || "S"
                    )}
                  </div>
                  {editing && (
                    <label className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center cursor-pointer text-sm">
                      +
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFile}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <button
                  onClick={editing ? handleSave : handleEdit}
                  disabled={saving}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow disabled:opacity-60 ${
                    editing
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {saving ? "Saving..." : editing ? "Save Changes" : "Edit Profile"}
                </button>
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {displayProfile.name || "Student Name"}
              </h2>
              <p className="text-purple-600 font-semibold text-sm">
                {displayProfile.grade || "Add your grade / level"}
              </p>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                {displayProfile.bio || "Add a short bio about your learning goals."}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-5">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", name: "name" },
                { label: "Email", name: "email", readOnly: true },
                { label: "Phone", name: "phone" },
                { label: "Grade / Level", name: "grade" },
                { label: "City", name: "city" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    {field.label}
                  </label>
                  {editing && !field.readOnly ? (
                    <input
                      name={field.name}
                      value={draft[field.name] || ""}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  ) : (
                    <p className="px-3 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-800 font-medium min-h-[42px]">
                      {displayProfile[field.name] || "Not added yet"}
                    </p>
                  )}
                </div>
              ))}

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Bio
                </label>
                {editing ? (
                  <textarea
                    name="bio"
                    value={draft.bio || ""}
                    onChange={handleProfileChange}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                  />
                ) : (
                  <p className="px-3 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-800 leading-relaxed min-h-[86px]">
                    {displayProfile.bio || "Not added yet"}
                  </p>
                )}
              </div>
            </div>

            {editing && (
              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all cursor-pointer disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "password" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-md">
          <h3 className="font-bold text-gray-800 mb-5">Change Password</h3>
          {pwMsg && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm font-semibold bg-orange-50 text-orange-700 border border-orange-200">
              {pwMsg}
            </div>
          )}
          <div className="space-y-4">
            {[
              { label: "Current Password", key: "current", placeholder: "Enter current password" },
              { label: "New Password", key: "newPass", placeholder: "Enter new password" },
              { label: "Confirm New Password", key: "confirm", placeholder: "Confirm new password" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  {field.label}
                </label>
                <input
                  type="password"
                  value={passwords[field.key]}
                  onChange={(event) =>
                    setPasswords((previous) => ({
                      ...previous,
                      [field.key]: event.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            ))}
            <button
              onClick={handlePasswordChange}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all cursor-pointer mt-2"
            >
              Update Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default S_Profile;
