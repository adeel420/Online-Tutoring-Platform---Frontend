import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/user/forget-password`,
        { email },
      );
      toast.success(data.message || "OTP sent to your email!");
      setSent(true);
      setTimeout(() => navigate("/reset-password", { state: { email } }), 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to send OTP. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {loading && <Loader fullScreen />}

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Icon */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🔑</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-500 text-sm">
            No worries! Enter your email and we'll send you a reset OTP.
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={20} color="#fff" /> Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">✅</span>
            </div>
            <p className="text-green-700 font-semibold">
              OTP sent successfully!
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Redirecting to reset password...
            </p>
          </div>
        )}

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-5 text-sm text-gray-500 hover:text-purple-600 transition-colors cursor-pointer text-center"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
