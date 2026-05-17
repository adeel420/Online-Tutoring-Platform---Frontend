import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const roles = [
  {
    id: "student",
    label: "Student",
    icon: "🎓",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "tutor",
    label: "Teacher",
    icon: "👨🏫",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "admin",
    label: "Admin",
    icon: "⚙️",
    color: "from-green-500 to-emerald-500",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/user/login`,
        {
          ...formData,
          role: selectedRole,
        },
      );
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      setTimeout(() => {
        if (data.user.role === "admin") navigate("/admin_dashboard");
        else if (data.user.role === "tutor") navigate("/tutor_dashboard");
        else navigate("/student_dashboard");
      }, 1000);
    } catch (err) {
      const msg =
        err.response?.data?.error || "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const activeRole = roles.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {loading && <Loader fullScreen />}

      <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your TutorHub account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!selectedRole ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Select Your Role
              </h3>
              <div className="grid grid-cols-1 gap-3">
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
                      <span className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                        {role.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${activeRole?.color} rounded-2xl flex items-center justify-center mx-auto mb-2 text-2xl`}
                >
                  {activeRole?.icon}
                </div>
                <p className="text-gray-600">
                  Signing in as{" "}
                  <span className="font-semibold text-purple-600">
                    {activeRole?.label}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedRole("")}
                  className="text-sm text-purple-600 hover:text-purple-800 underline mt-1 cursor-pointer"
                >
                  Change Role
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  Forget your password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={20} color="#fff" /> Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-purple-600 hover:text-purple-800 font-semibold"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
