import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const roles = [
  {
    id: "student",
    label: "Student",
    icon: "🎓",
    color: "from-blue-500 to-cyan-500",
    desc: "I want to learn",
  },
  {
    id: "teacher",
    label: "Teacher",
    icon: "👨🏫",
    color: "from-purple-500 to-pink-500",
    desc: "I want to teach",
  },
];

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "teacher" ? "teacher" : "";
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    bankName: "",
    accountTitle: "",
    accountNumber: "",
    iban: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [nationalId, setNationalId] = useState(null);
  const [experienceLetter, setExperienceLetter] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePic(file);
    const reader = new FileReader();
    reader.onloadend = () => setProfilePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDocFile = (setter) => (e) => {
    const file = e.target.files[0];
    if (file) setter(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedRole === "teacher" && (!nationalId || !experienceLetter)) {
      toast.error("Please upload both CNIC and experience letter.");
      return;
    }

    if (
      selectedRole === "teacher" &&
      (!formData.bankName.trim() ||
        !formData.accountTitle.trim() ||
        !formData.accountNumber.trim() ||
        !formData.iban.trim())
    ) {
      toast.error("Please enter complete bank details.");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("password", formData.password);
      data.append("role", selectedRole === "teacher" ? "tutor" : "student");
      if (selectedRole === "teacher") {
        data.append("bankName", formData.bankName);
        data.append("accountTitle", formData.accountTitle);
        data.append("accountNumber", formData.accountNumber);
        data.append("iban", formData.iban);
      }
      if (profilePic) data.append("profile", profilePic);
      if (nationalId) data.append("cnic", nationalId);
      if (experienceLetter) data.append("experienceLetter", experienceLetter);

      const { data: res } = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/user/signup`,
        data,
      );
      toast.success(res.message || "Account created! Check your email.");
      if (selectedRole === "teacher") {
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setTimeout(() => navigate("/verify-email"), 2500);
      }
    } catch (err) {
      const msg =
        err.response?.data?.error || "Signup failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 1: Role Selection ──────────────────────────────────────────────────
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Join TutorHub
            </h1>
            <p className="text-gray-600">First, tell us who you are</p>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Select Your Role
          </h3>
          <div className="grid grid-cols-1 gap-3 mb-6">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className="group p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${role.color} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}
                  >
                    {role.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                      {role.label}
                    </p>
                    <p className="text-xs text-gray-500">{role.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-600 hover:text-purple-800 font-semibold"
              >
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const activeRole = roles.find((r) => r.id === selectedRole);

  // ── Step 2: Signup Form ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {loading && <Loader fullScreen />}

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Join TutorHub
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div
              className={`w-8 h-8 bg-gradient-to-r ${activeRole.color} rounded-lg flex items-center justify-center text-base`}
            >
              {activeRole.icon}
            </div>
            <span className="text-sm text-gray-600">
              Signing up as{" "}
              <span className="font-semibold text-purple-600">
                {activeRole.label}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedRole("")}
              className="text-xs text-purple-500 hover:text-purple-700 underline cursor-pointer"
            >
              Change
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture <span className="text-gray-400">(Optional)</span>
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-2xl">👤</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFile}
                className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
              />
            </div>
          </div>

          {/* Text Fields */}
          {[
            {
              label: "Full Name",
              name: "name",
              type: "text",
              placeholder: "Enter your full name",
            },
            {
              label: "Email Address",
              name: "email",
              type: "email",
              placeholder: "Enter your email",
            },
            {
              label: "Phone Number",
              name: "phone",
              type: "tel",
              placeholder: "Enter your phone number",
            },
            {
              label: "Password",
              name: "password",
              type: "password",
              placeholder: "Create a strong password",
            },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {f.label} <span className="text-red-500">*</span>
              </label>
              <input
                type={f.type}
                name={f.name}
                value={formData[f.name]}
                onChange={handleInputChange}
                placeholder={f.placeholder}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          ))}

          {/* Teacher Documents */}
          {selectedRole === "teacher" && (
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <p className="text-sm font-semibold text-purple-700">
                📋 Teacher Verification Documents
              </p>

              {[
                {
                  label: "National ID (CNIC)",
                  state: nationalId,
                  setter: setNationalId,
                  icon: "🪪",
                  hint: "Upload CNIC image or PDF",
                },
                {
                  label: "Experience Letter",
                  state: experienceLetter,
                  setter: setExperienceLetter,
                  icon: "📄",
                  hint: "Upload experience letter (PDF/image)",
                },
              ].map((doc) => (
                <div key={doc.label}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {doc.label} <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${doc.state ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"}`}
                  >
                    {doc.state ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-green-700">
                          <span>✅</span>
                          <span className="text-sm font-medium truncate max-w-[180px]">
                            {doc.state.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => doc.setter(null)}
                          className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <span className="text-2xl block mb-1">{doc.icon}</span>
                        <span className="text-sm text-gray-500">
                          {doc.hint}
                        </span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleDocFile(doc.setter)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Teacher Bank Details */}
          {selectedRole === "teacher" && (
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <p className="text-sm font-semibold text-purple-700">
                Bank Details
              </p>

              {[
                {
                  label: "Bank Name",
                  name: "bankName",
                  placeholder: "Enter bank name",
                },
                {
                  label: "Account Title",
                  name: "accountTitle",
                  placeholder: "Enter account holder name",
                },
                {
                  label: "Account Number",
                  name: "accountNumber",
                  placeholder: "Enter account number",
                },
                {
                  label: "IBAN",
                  name: "iban",
                  placeholder: "Enter IBAN",
                },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {f.label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name={f.name}
                    value={formData[f.name]}
                    onChange={handleInputChange}
                    placeholder={f.placeholder}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={20} color="#fff" /> Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-800 font-semibold"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
