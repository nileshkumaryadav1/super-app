"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function ChatRoom() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false); // Typing indicator
  const bottomRef = useRef(null);

  // Load current user
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  // Fetch messages
  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      const res = await fetch(`/api/message?chatId=${chatId}`);
      const data = await res.json();
      setMessages(data.messages || []);
      if (data.chatUser) setChatUser(data.chatUser);
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // refresh every 3s
    return () => clearInterval(interval);
  }, [chatId]);

  // Scroll to bottom on messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const res = await fetch("/api/message/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, senderId: currentUser._id, text }),
    });
    const { message } = await res.json();
    setMessages((prev) => [...prev, message]);
    setText("");
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toDateString();
  };

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = formatDate(msg.createdAt);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {});

  return (
    <div className="max-w-md h-[72vh] flex flex-col border border-gray-200 bg-white shadow-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 sticky top-0 bg-white z-10">
        <Link href="/chat">
          <ArrowLeft className="w-5 h-5 cursor-pointer text-gray-600" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
            {chatUser?.name?.charAt(0).toUpperCase() || "C"}
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 border-1 border-white rounded-full"></span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">
              {chatUser?.name || "Chat"}
            </span>
            <span className="text-xs text-gray-400">
              {chatUser?.isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            <div className="text-center text-xs text-gray-400 mb-2">{date}</div>
            {groupedMessages[date].map((m) => {
              const isCurrentUser =
                m.senderId === currentUser?._id ||
                m.sender?._id === currentUser?._id;

              return (
                <div
                  key={m._id}
                  className={`flex flex-col ${
                    isCurrentUser ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-end gap-2 sm:gap-3 max-w-full">
                    {/* Avatar for other user */}
                    {!isCurrentUser && (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-400 flex items-center justify-center text-white font-semibold shadow-md text-sm sm:text-base flex-shrink-0">
                        {m.sender?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={`px-4 py-2 sm:px-5 sm:py-3 text-sm sm:text-base break-words max-w-[75%] sm:max-w-[70%] ${
                        isCurrentUser
                          ? "bg-blue-500 text-white rounded-2xl"
                          : "bg-gray-100 text-gray-800 rounded-2xl"
                      } shadow-sm`}
                    >
                      {m.text.length > 200
                        ? m.text.slice(0, 200) + "..."
                        : m.text}

                      {/* Optional: Message status */}
                      {isCurrentUser && (
                        <span className="ml-1 text-[9px] sm:text-[10px] text-gray-200 font-medium float-right">
                          ✓✓
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <span
                    className={`text-[9px] sm:text-[10px] text-gray-400 mt-1 ml-1 ${
                      isCurrentUser ? "text-right" : "text-left"
                    }`}
                  >
                    {formatTime(m.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
        {isTyping && <p className="text-gray-400 text-xs italic">Typing...</p>}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={sendMessage}
        className="flex items-center gap-2 p-3 border-t border-gray-200 bg-white"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="Message..."
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
