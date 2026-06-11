import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ReadyToStart = () => {
  const navigate = useNavigate();

  const handleJoinTeacher = () => {
    if (localStorage.getItem("token")) {
      toast.error("You are already logged in");
      return;
    }

    navigate("/signup?role=teacher");
  };

  return (
    <section className="py-16 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
          Ready to Start?
        </h2>
        <p className="text-gray-200 text-lg mb-8">
          Students can book tutors right away, while teachers can create an
          account and wait for admin approval.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/tutors")}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-3 rounded-full font-bold hover:shadow-2xl transition-all cursor-pointer"
          >
            Browse Tutors
          </button>
          <button
            onClick={handleJoinTeacher}
            className="bg-white/10 text-white border border-white/20 px-8 py-3 rounded-full font-bold hover:bg-white/20 transition-all cursor-pointer"
          >
            Join as Teacher
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReadyToStart;
