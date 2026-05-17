import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const handleChange = (value, index) => {
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
      toast.error("Please enter the complete 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/user/verify-email`,
        { code },
      );
      toast.success(data.message || "Email verified successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Verification failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {loading && <Loader fullScreen />}

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">📧</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Verify Your Email
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          We sent a 6-digit verification code to your email address. Enter it
          below to activate your account.
        </p>

        <form onSubmit={handleSubmit}>
          {/* OTP Boxes */}
          <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-all ${
                  digit
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-300 focus:border-purple-400"
                }`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={20} color="#fff" /> Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>

        <p className="text-gray-500 text-sm mt-6">
          Didn't receive the code?{" "}
          <button
            onClick={() =>
              toast("Please sign up again to resend the code.", { icon: "ℹ️" })
            }
            className="text-purple-600 hover:text-purple-800 font-semibold cursor-pointer"
          >
            Resend
          </button>
        </p>

        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-sm text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
