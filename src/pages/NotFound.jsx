import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center p-4">
      <div className="max-w-xl w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl font-extrabold">
          404
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Page Not Found
        </h1>
        <p className="text-white/75 text-lg mb-8">
          The page you are looking for does not exist or may have been moved.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-3 rounded-full font-bold hover:shadow-2xl transition-all cursor-pointer"
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default NotFound;
