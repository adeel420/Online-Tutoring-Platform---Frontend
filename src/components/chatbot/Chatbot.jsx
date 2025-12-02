import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const genAI = new GoogleGenerativeAI(
    "AIzaSyA6EZOzo2GLCcAa9aOv2KjgCelLahuTKeI"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = {
      text: inputMessage,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMsg]);
    const prompt = inputMessage;
    setInputMessage("");

    try {
      const result = await model.generateContent(prompt);
      const botReply = await result.response.text();

      const botMsg = {
        text: botReply,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("API Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, something went wrong.",
        },
      ]);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center cursor-pointer"
      >
        {isOpen ? (
          <span className="text-2xl">✕</span>
        ) : (
          <span className="text-2xl">💬</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold">TutorBot</h3>
              <p className="text-xs opacity-90">Online now</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all cursor-pointer"
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
