// app/chat/[chatId]/page.js
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

export default function ChatRoom() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!chatId) return;
    fetch(`/api/message?chatId=${chatId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data.messages));
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
    <div className="max-w-md h-screen flex flex-col border border-gray-200">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-white">
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
                className={`px-4 py-2 rounded-2xl text-sm max-w-xs break-words ${
                  isCurrentUser
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
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
        className="flex items-center gap-2 p-3 border-t border-gray-200 bg-white"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="Message..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-full"
        >
          Send
        </button>
      </form>
    </div>
  );
}
