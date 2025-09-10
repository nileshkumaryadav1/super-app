// app/chat/[chatId]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ChatRoom() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!chatId) return;
    fetch(`/api/message?chatId=${chatId}`)
      .then(res => res.json())
      .then(data => setMessages(data.messages));
  }, [chatId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const res = await fetch("/api/message/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, senderId: currentUser._id, text }),
    });
    const { message } = await res.json();
    setMessages([...messages, message]);
    setText("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 flex flex-col space-y-4">
      <div className="space-y-2 overflow-y-auto max-h-96">
        {messages.map((m) => (
          <div key={m._id} className={`p-2 rounded ${m.sender === currentUser._id ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-black mr-auto"}`}>
            <p>{m.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input type="text" value={text} onChange={e => setText(e.target.value)}
               className="flex-1 p-2 border rounded" placeholder="Type a message..." />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Send</button>
      </form>
    </div>
  );
}
