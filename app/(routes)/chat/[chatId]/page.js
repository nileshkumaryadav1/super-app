// app/chat/[chatId]/page.js
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";

export default function ChatRoom() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [chatUser, setChatUser] = useState(null); // for header display
  const bottomRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      const res = await fetch(`/api/message?chatId=${chatId}`);
      const data = await res.json();
      setMessages(data.messages);
      if (data.chatUser) setChatUser(data.chatUser);
    };

    fetchMessages();

    const interval = setInterval(fetchMessages, 3000); // every 3s
    return () => clearInterval(interval);
  }, [chatId]);

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

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="max-w-md h-screen flex flex-col border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 sticky top-0 bg-white z-10">
        <ArrowLeft className="w-5 h-5 cursor-pointer text-gray-600" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300" />
          <span className="font-semibold text-sm">
            {chatUser?.name || "Chat"}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {messages.map((m) => {
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
              <div
                className={`px-4 py-2 text-sm max-w-[75%] break-words shadow-sm ${
                  isCurrentUser
                    ? "bg-blue-500 text-white rounded-2xl rounded-br-sm"
                    : "bg-gray-200 text-black rounded-2xl rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-gray-400 mt-1">
                {formatTime(m.createdAt)}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={sendMessage}
        className="flex items-center gap-2 p-3 border-t border-gray-200 bg-white mb-15"
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
