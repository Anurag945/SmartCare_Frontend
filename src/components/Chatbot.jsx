import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { IoChatbubbleEllipses, IoSend, IoClose } from "react-icons/io5";
import axios from "axios";

const Chatbot = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How may I assist you?", time: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      if (!openChat) {
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      }
    }, 5000);
    return () => clearInterval(messageInterval);
  }, [openChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (msg) => {
    const userMessage = msg || input;
    if (!userMessage.trim()) return;

    setMessages([...messages, { sender: "user", text: userMessage, time: new Date().toLocaleTimeString() }]);
    setInput("");
    setIsTyping(true);
    try {
      const response = await axios.post("https://smart-care-backend.vercel.app/chat", { message: userMessage });
      setMessages((prev) => [...prev, { sender: "bot", text: response.data.reply, time: new Date().toLocaleTimeString() }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I couldn't process your request.", time: new Date().toLocaleTimeString() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-12 right-10">
      {showMessage && !openChat && (
        <div className="bg-blue-500 text-white text-sm px-3 py-2 rounded-lg shadow-md animate-fade-in-out mb-2">
          Need help?
        </div>
      )}
      <button
        onClick={() => setOpenChat(!openChat)}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
      >
        {openChat ? <IoClose size={24} /> : <IoChatbubbleEllipses size={24} />}
      </button>
      {openChat && (
        <div className="absolute bottom-16 right-0 bg-white shadow-lg rounded-lg border border-gray-300 w-80 h-96 flex flex-col">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <span>Chat with us</span>
          </div>
          <div className="p-3 overflow-y-auto flex-1 flex flex-col gap-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-md w-fit text-sm ${msg.sender === "user" ? "bg-blue-100 self-end" : "bg-gray-200"}`}
              >
                {msg.sender === "bot" ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
                <div className="text-xs text-gray-500 mt-1 text-right">{msg.time}</div>
              </div>
            ))}
            {isTyping && <div className="text-gray-500 text-sm">Bot is typing...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex gap-2 p-2 border-t">
            {["What are your services?", "How do I contact support?"].map((text, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(text)}
                className="text-xs bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300 transition"
              >
                {text}
              </button>
            ))}
          </div>
          <div className="flex border-t p-2 bg-white">
            <input
              type="text"
              className="flex-1 p-2 border rounded-l-md focus:outline-none bg-white"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={() => handleSendMessage()}
              className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700"
            >
              <IoSend size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
