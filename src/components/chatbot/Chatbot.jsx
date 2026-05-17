import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyA6EZOzo2GLCcAa9aOv2KjgCelLahuTKeI");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = { text: inputMessage, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    const prompt = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      const result = await model.generateContent(prompt);
      const botReply = await result.response.text();
      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, something went wrong.", sender: "bot" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center cursor-pointer"
      >
        {isOpen ? <span className="text-2xl">✕</span> : <span className="text-2xl">💬</span>}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold">TutorBot</h3>
              <p className="text-xs opacity-90 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span>
                Online now
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm mt-8">
                <div className="text-3xl mb-2">👋</div>
                Hi! How can I help you today?
              </div>
            )}

            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "bot" && (
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-2 flex-shrink-0 mt-1">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                  🤖
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping}
                className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                <span className="text-sm">➤</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
