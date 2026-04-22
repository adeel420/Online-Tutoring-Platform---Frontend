import React, { useState } from "react";

const S_Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: "Ali Hassan",
    email: "ali@gmail.com",
    phone: "+92 300 9876543",
    grade: "Intermediate (FSc)",
    city: "Lahore",
    bio: "Passionate student looking to improve in Mathematics and Computer Science.",
  });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");

  const handleProfileChange = (e) =>
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setPwMsg("❌ All fields are required");
    } else if (passwords.newPass !== passwords.confirm) {
      setPwMsg("❌ Passwords do not match");
    } else if (passwords.newPass.length < 6) {
      setPwMsg("❌ Password must be at least 6 characters");
    } else {
      setPwMsg("✅ Password changed successfully!");
      setPasswords({ current: "", newPass: "", confirm: "" });
    }
    setTimeout(() => setPwMsg(""), 3000);
  };

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Tabs */}
      <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 flex gap-1 w-fit">
        {["profile", "password"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all cursor-pointer ${
              activeTab === t
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t === "profile" ? "👤 Profile" : "🔒 Password"}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <>
          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold">
              ✅ Profile updated successfully!
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900" />
            <div className="px-6 pb-6">
              <div className="flex items-end justify-between -mt-10 mb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white">
                  {profile.name[0]}
                </div>
                <button
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow ${
                    editing
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {editing ? "💾 Save" : "✏️ Edit"}
                </button>
              </div>
              {!editing && (
                <>
                  <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
                  <p className="text-purple-600 font-semibold text-sm">{profile.grade}</p>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">{profile.bio}</p>
                </>
              )}
            </div>
          </div>

          {/* Info Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-5">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", name: "name", icon: "👤" },
                { label: "Email", name: "email", icon: "📧" },
                { label: "Phone", name: "phone", icon: "📞" },
                { label: "Grade / Level", name: "grade", icon: "🎓" },
                { label: "City", name: "city", icon: "📍" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    {field.icon} {field.label}
                  </label>
                  {editing ? (
                    <input
                      name={field.name}
                      value={profile[field.name]}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  ) : (
                    <p className="px-3 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-800 font-medium">{profile[field.name]}</p>
                  )}
                </div>
              ))}

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">📝 Bio</label>
                {editing ? (
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleProfileChange}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                  />
                ) : (
                  <p className="px-3 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-800 leading-relaxed">{profile.bio}</p>
                )}
              </div>
            </div>

            {editing && (
              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all cursor-pointer"
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
          <h3 className="font-bold text-gray-800 mb-5">🔒 Change Password</h3>
          {pwMsg && (
            <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-semibold ${
              pwMsg.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"
            }`}>
              {pwMsg}
            </div>
          )}
          <div className="space-y-4">
            {[
              { label: "Current Password", key: "current", placeholder: "Enter current password" },
              { label: "New Password", key: "newPass", placeholder: "Enter new password" },
              { label: "Confirm New Password", key: "confirm", placeholder: "Confirm new password" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">{f.label}</label>
                <input
                  type="password"
                  value={passwords[f.key]}
                  onChange={(e) => setPasswords((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
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
