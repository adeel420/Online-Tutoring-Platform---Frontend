import React, { useState, useEffect } from "react";
import { tutorBookings } from "../../data/Data";

const Live_Session = () => {
  const [sessionActive, setSessionActive] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const upcoming = tutorBookings.filter((b) => b.status === "upcoming");

  useEffect(() => {
    let timer;
    if (sessionActive) {
      timer = setInterval(() => setElapsed((p) => p + 1), 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(timer);
  }, [sessionActive]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="space-y-5">
      {!sessionActive ? (
        <>
          {/* Pre-session */}
          <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-6 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                🎥
              </div>
              <h3 className="text-2xl font-bold mb-2">Teaching Panel</h3>
              <p className="text-white/70 text-sm mb-6">Start a live session with your students</p>
              <button
                onClick={() => setSessionActive(true)}
                className="px-8 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-bold text-base hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer shadow-lg"
              >
                🚀 Start Live Session
              </button>
            </div>
          </div>

          {/* Upcoming sessions to start */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-800 mb-4">Upcoming Sessions</h3>
            {upcoming.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No upcoming sessions</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {s.student[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{s.student}</p>
                      <p className="text-xs text-gray-500">{s.subject} · {s.time}</p>
                    </div>
                    <button
                      onClick={() => setSessionActive(true)}
                      className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-xs font-semibold hover:shadow-md transition-all cursor-pointer"
                    >
                      Start
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Active Session */
        <div className="space-y-4">
          {/* Live indicator */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm font-bold text-red-600">LIVE</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="font-mono text-lg font-bold text-gray-800">{formatTime(elapsed)}</span>
            </div>
            <button
              onClick={() => { setSessionActive(false); setScreenSharing(false); setMicOn(true); setCamOn(true); }}
              className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all cursor-pointer shadow"
            >
              End Session
            </button>
          </div>

          {/* Video Area */}
          <div className="bg-gray-900 rounded-2xl overflow-hidden aspect-video flex items-center justify-center relative">
            {screenSharing ? (
              <div className="text-center text-white">
                <div className="text-5xl mb-3">🖥️</div>
                <p className="font-semibold">Screen Sharing Active</p>
                <p className="text-white/50 text-sm">Your screen is visible to students</p>
              </div>
            ) : camOn ? (
              <div className="text-center text-white">
                <div className="text-5xl mb-3">📹</div>
                <p className="font-semibold text-white/80">Camera On</p>
              </div>
            ) : (
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-3">
                  A
                </div>
                <p className="text-white/60 text-sm">Camera Off</p>
              </div>
            )}

            {/* Student tile */}
            <div className="absolute bottom-3 right-3 w-28 h-20 bg-gray-800 rounded-xl flex items-center justify-center border-2 border-white/20">
              <div className="text-center text-white">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-1">S</div>
                <p className="text-xs text-white/70">Student</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: micOn ? "Mute" : "Unmute", icon: micOn ? "🎙️" : "🔇", action: () => setMicOn(!micOn), active: micOn, color: "blue" },
                { label: camOn ? "Stop Cam" : "Start Cam", icon: camOn ? "📹" : "📷", action: () => setCamOn(!camOn), active: camOn, color: "purple" },
                { label: screenSharing ? "Stop Share" : "Share Screen", icon: "🖥️", action: () => setScreenSharing(!screenSharing), active: screenSharing, color: "green" },
              ].map((ctrl, i) => (
                <button
                  key={i}
                  onClick={ctrl.action}
                  className={`flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    ctrl.active
                      ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200"
                      : "bg-gray-100 text-gray-500 border border-gray-200"
                  }`}
                >
                  <span className="text-xl">{ctrl.icon}</span>
                  {ctrl.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Live_Session;
