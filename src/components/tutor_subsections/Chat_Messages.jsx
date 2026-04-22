import React, { useState, useRef, useEffect } from "react";
import { tutorMessages } from "../../data/Data";

const initialChats = {
  1: [
    { from: "student", text: "Can we reschedule tomorrow's session?", time: "10:02 AM" },
    { from: "tutor", text: "Sure! What time works for you?", time: "10:05 AM" },
  ],
  2: [
    { from: "student", text: "Thank you for the notes!", time: "9:30 AM" },
    { from: "tutor", text: "You're welcome! Let me know if you have questions.", time: "9:32 AM" },
  ],
  3: [
    { from: "student", text: "What topics will we cover next?", time: "8:00 AM" },
  ],
  4: [
    { from: "student", text: "I have a question about the assignment.", time: "Yesterday" },
  ],
};

const Chat_Messages = () => {
  const [selected, setSelected] = useState(tutorMessages[0]);
  const [chats, setChats] = useState(initialChats);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, selected]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChats((p) => ({
      ...p,
      [selected.id]: [...(p[selected.id] || []), { from: "tutor", text: input.trim(), time: now }],
    }));
    setInput("");
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: "600px" }}>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm">Messages</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {tutorMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelected(msg)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                  selected?.id === msg.id ? "bg-gradient-to-r from-purple-50 to-blue-50 border-r-2 border-purple-500" : "hover:bg-gray-50"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {msg.avatar}
                  </div>
                  {msg.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {msg.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{msg.student}</p>
                  <p className="text-xs text-gray-400 truncate">{msg.lastMsg}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{msg.time}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {selected?.avatar}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{selected?.student}</p>
              <p className="text-xs text-green-500 font-medium">● Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {(chats[selected?.id] || []).map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "tutor" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl text-sm ${
                  msg.from === "tutor"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.from === "tutor" ? "text-white/60" : "text-gray-400"}`}>{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all cursor-pointer"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat_Messages;
