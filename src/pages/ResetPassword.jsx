import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillEmail = location.state?.email || "";

  const [email, setEmail] = useState(prefillEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length < 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_SERVER_API}/user/reset-password`,
        {
          email,
          otp: code,
          newPassword,
        },
      );
      toast.success(data.message || "Password reset successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || "Reset failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {loading && <Loader fullScreen />}

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-500 text-sm">
            Enter the OTP sent to your email and set a new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email — editable if not prefilled */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* OTP Boxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              6-Digit OTP
            </label>
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-all ${
                    digit
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-300 focus:border-purple-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-lg"
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                confirmPassword && confirmPassword !== newPassword
                  ? "border-red-400 focus:border-red-400"
                  : confirmPassword && confirmPassword === newPassword
                    ? "border-green-400 focus:border-green-400"
                    : "border-gray-300 focus:border-purple-400"
              }`}
            />
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-red-500 text-xs mt-1">
                Passwords do not match
              </p>
            )}
            {confirmPassword && confirmPassword === newPassword && (
              <p className="text-green-600 text-xs mt-1">✓ Passwords match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={20} color="#fff" /> Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <button
          onClick={() => navigate("/forgot-password")}
          className="w-full mt-5 text-sm text-gray-500 hover:text-purple-600 transition-colors cursor-pointer text-center"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
