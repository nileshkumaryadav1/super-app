"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ChatList() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) router.push("/login");
    else setCurrentUser(JSON.parse(stored));
  }, [router]);

  useEffect(() => {
    if (!currentUser) return;
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) =>
        setUsers(data.users.filter((u) => u._id !== currentUser?._id))
      );
  }, [currentUser]);

  const startChat = async (userId) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds: [currentUser._id, userId] }),
    });
    const { chat } = await res.json();
    router.push(`/chat/${chat._id}`);
  };

  if (!currentUser) {
    return null; // loading handled by redirect
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Header (Instagram style) */}
      <header className="sticky top-0 bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold">{currentUser.name || "Chats"}</h1>
        <button className="text-blue-500 font-medium">New</button>
      </header>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {users.map((u) => (
          <div
            key={u._id}
            onClick={() => startChat(u._id)}
            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition"
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 flex items-center justify-center text-white font-bold mr-3">
              {u.name?.charAt(0).toUpperCase() || "U"}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{u.name}</p>
              <p className="text-gray-500 text-xs truncate">{u.email}</p>
            </div>

            {/* Timestamp placeholder (you can replace with lastMessage time) */}
            <span className="text-xs text-gray-400">Now</span>
          </div>
        ))}
      </div>
    </div>
  );
}
