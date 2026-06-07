import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../Loader";
import VideoClassRoom from "../video/VideoClassRoom";

const Join_Session = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBooking, setActiveBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_API}/user/bookings`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to load sessions.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const upcoming = bookings.filter(
    (booking) =>
      booking.status === "upcoming" || booking.paymentStatus === "paid",
  );

  if (activeBooking) {
    return (
      <VideoClassRoom
        booking={activeBooking}
        role="student"
        onLeave={() => setActiveBooking(null)}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-6 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
            VC
          </div>
          <h3 className="text-2xl font-bold mb-2">Join Live Class</h3>
          <p className="text-white/70 text-sm">
            Select a paid upcoming session below to join with WebRTC video call.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-4">Your Upcoming Sessions</h3>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader size={36} />
          </div>
        ) : upcoming.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">
            No upcoming sessions to join
          </p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((session) => (
              <div
                key={session.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100"
              >
                <div className="w-11 h-11 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                  {session.tutor?.[0] || "T"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{session.tutor}</p>
                  <p className="text-xs text-gray-500">
                    {session.subject} | {session.date} | {session.time}
                  </p>
                </div>
                <button
                  onClick={() => setActiveBooking(session)}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-sm font-bold hover:shadow-md transition-all cursor-pointer flex-shrink-0"
                >
                  Join Class
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Join_Session;
