import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../Loader";
import VideoClassRoom from "../video/VideoClassRoom";
import { formatTimeRange12, getSessionWindow } from "../../utils/time";

const Live_Session = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBooking, setActiveBooking] = useState(null);
  const [now, setNow] = useState(new Date());

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

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const upcoming = bookings.filter(
    (booking) =>
      booking.status === "upcoming" || booking.paymentStatus === "paid",
  );

  if (activeBooking) {
    return (
      <VideoClassRoom
        booking={activeBooking}
        role="tutor"
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
          <h3 className="text-2xl font-bold mb-2">Teaching Panel</h3>
          <p className="text-white/70 text-sm">
            Start a WebRTC live class for any paid upcoming booking.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-4">Upcoming Sessions</h3>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader size={36} />
          </div>
        ) : upcoming.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            No upcoming sessions
          </p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((session) => {
              const windowStatus = getSessionWindow(session, now);
              const canStart = windowStatus.state === "open";

              return (
                <div
                  key={session.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100"
                >
                  <div className="w-11 h-11 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    {session.student?.[0] || "S"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800">{session.student}</p>
                    <p className="text-xs text-gray-500">
                      {session.subject} | {session.date} |{" "}
                      {formatTimeRange12(session.from, session.to, session.time)}
                    </p>
                    {!canStart && (
                      <p className="text-xs font-semibold text-orange-500 mt-1">
                        {windowStatus.label}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setActiveBooking(session)}
                    disabled={!canStart}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex-shrink-0 ${
                      canStart
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-md cursor-pointer"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {canStart ? "Start Class" : windowStatus.label}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Live_Session;
