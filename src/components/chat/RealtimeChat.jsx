import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPaperclip } from "react-icons/fa";
import Loader from "../Loader";
import { getSocket } from "../../utils/socket";
import { getSessionWindow } from "../../utils/time";

const CHAT_SESSION_ONLY_MESSAGE = "You can only chat during the session.";

const RealtimeChat = ({
  peerId,
  peerName,
  bookingId,
  booking = null,
  classSessionId,
  compact = false,
}) => {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const apiUrl = import.meta.env.VITE_SERVER_API;

  useEffect(() => {
    if (peerId) {
      setSelected({ peerId, name: peerName, bookingId, ...(booking || {}) });
      setLoading(false);
      return;
    }

    axios
      .get(`${apiUrl}/realtime/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        setConversations(data);
        setSelected(data[0] || null);
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || "Could not load chats.");
      })
      .finally(() => setLoading(false));
  }, [apiUrl, booking, bookingId, peerId, peerName, token]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!selected?.peerId) {
      setMessages([]);
      return;
    }

    const params = new URLSearchParams();
    if (compact && selected.bookingId)
      params.set("bookingId", selected.bookingId);
    if (classSessionId) params.set("classSessionId", classSessionId);

    axios
      .get(
        `${apiUrl}/realtime/messages/${selected.peerId}?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(({ data }) => setMessages(data))
      .catch(() => setMessages([]));
  }, [apiUrl, classSessionId, compact, selected, token]);

  useEffect(() => {
    const socket = getSocket();
    const handleMessage = (message) => {
      const otherUser =
        String(message.sender?._id || message.sender) === String(user.id)
          ? message.receiver?._id || message.receiver
          : message.sender?._id || message.sender;

      if (String(otherUser) === String(selected?.peerId)) {
        setMessages((prev) =>
          prev.some((item) => item._id === message._id)
            ? prev
            : [...prev, message],
        );
      }
    };

    socket?.on("chat:message", handleMessage);
    return () => socket?.off("chat:message", handleMessage);
  }, [selected?.peerId, user.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedWindow = selected ? getSessionWindow(selected, now) : null;
  const canChat = Boolean(selected && selectedWindow?.state === "open");

  const sendMessage = () => {
    if (!input.trim() || !selected?.peerId) return;
    if (!canChat) {
      toast.error(CHAT_SESSION_ONLY_MESSAGE);
      return;
    }
    const socket = getSocket();
    if (!socket) {
      toast.error("Chat is not connected. Please login again.");
      return;
    }

    socket?.emit(
      "chat:send",
      {
        to: selected.peerId,
        text: input.trim(),
        bookingId: selected.bookingId,
        classSessionId,
      },
      (response) => {
        if (!response?.ok) toast.error(response?.error || "Message failed.");
      },
    );
    setInput("");
  };

  const uploadAttachment = async (file) => {
    if (!file || !selected?.peerId) return;
    if (!canChat) {
      toast.error(CHAT_SESSION_ONLY_MESSAGE);
      return;
    }

    const formData = new FormData();
    formData.append("attachment", file);
    formData.append("bookingId", selected.bookingId);
    if (classSessionId) formData.append("classSessionId", classSessionId);

    setUploading(true);
    try {
      await axios.post(
        `${apiUrl}/realtime/messages/${selected.peerId}/attachments`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "Attachment could not be sent.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event) => {
    uploadAttachment(event.target.files?.[0]);
  };

  const handleKey = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader size={34} />
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${
        compact ? "h-[360px]" : "h-[600px]"
      }`}
    >
      <div className="flex h-full">
        {!compact && !peerId && (
          <div className="w-64 flex-shrink-0 border-r border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-sm">Messages</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-8">
                  No chats yet
                </p>
              ) : (
                conversations.map((conversation) => (
                  <button
                    key={conversation.peerId}
                    onClick={() => setSelected(conversation)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                      selected?.peerId === conversation.peerId
                        ? "bg-gradient-to-r from-purple-50 to-blue-50 border-r-2 border-purple-500"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {conversation.name?.[0] || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {conversation.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {conversation.subject || "Session chat"}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {selected?.name?.[0] || "C"}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">
                {selected?.name || "Chat"}
              </p>
              <p
                className={`text-xs font-medium ${
                  canChat ? "text-green-500" : "text-orange-500"
                }`}
              >
                {canChat ? "Live chat" : CHAT_SESSION_ONLY_MESSAGE}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => {
              const mine =
                String(message.sender?._id || message.sender) ===
                String(user.id);
              return (
                <div
                  key={message._id}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl text-sm ${
                      mine
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    {message.attachment?.url && (
                      <div className={message.text ? "mb-2" : ""}>
                        {message.attachment.resourceType === "image" ||
                        message.attachment.mimeType?.startsWith("image/") ? (
                          <a
                            href={message.attachment.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={message.attachment.url}
                              alt={message.attachment.name || "Attachment"}
                              className="max-h-48 w-full rounded-xl object-cover"
                            />
                          </a>
                        ) : message.attachment.resourceType === "video" ||
                          message.attachment.mimeType?.startsWith("video/") ? (
                          <video
                            src={message.attachment.url}
                            controls
                            className="max-h-48 w-full rounded-xl"
                          />
                        ) : (
                          <a
                            href={message.attachment.url}
                            target="_blank"
                            rel="noreferrer"
                            className={`block rounded-xl border px-3 py-2 text-xs font-semibold ${
                              mine
                                ? "border-white/30 bg-white/10 text-white"
                                : "border-gray-200 bg-white text-purple-700"
                            }`}
                          >
                            {message.attachment.name || "Open attachment"}
                          </a>
                        )}
                      </div>
                    )}
                    {message.text && <p>{message.text}</p>}
                    <p
                      className={`text-xs mt-1 ${mine ? "text-white/60" : "text-gray-400"}`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={!canChat || uploading}
                title="Attach file"
                className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPaperclip />
              </button>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKey}
                placeholder={
                  !selected
                    ? "Select a chat..."
                    : canChat
                      ? "Type a message..."
                      : CHAT_SESSION_ONLY_MESSAGE
                }
                disabled={!canChat}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all disabled:bg-gray-50"
              />
              <button
                onClick={sendMessage}
                disabled={!canChat || uploading}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeChat;
