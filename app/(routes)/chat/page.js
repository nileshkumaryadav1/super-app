"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ChatList() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) router.push("/login");
    else setCurrentUser(JSON.parse(stored));
  }, [router]);

  // Fetch all other users
  useEffect(() => {
    if (!currentUser) return;
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) =>
        setUsers(data.users.filter((u) => u._id !== currentUser?._id))
      );
  }, [currentUser]);

  // Start chat
  const startChat = async (userId) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds: [currentUser._id, userId] }),
    });
    const { chat } = await res.json();
    router.push(`/chat/${chat._id}`);
  };

  // Format date nicely
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString();
  };

  if (!currentUser) return null;

  return (
    <div className="h-[75vh] bg-white flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 bg-white flex items-center justify-between px-4 py-3 z-10">
        <h1 className="text-lg font-bold">{currentUser.name || "Chats"}</h1>
        <button className="text-blue-500 font-medium">New</button>
      </header>

      {/* Search Bar */}
      <div className="px-4 py-2 sticky top-14 bg-white z-10">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {users
          .filter(
            (u) =>
              u.name.toLowerCase().includes(search.toLowerCase()) ||
              u.email.toLowerCase().includes(search.toLowerCase())
          )
          .map((u) => (
            <div
              key={u._id}
              onClick={() => startChat(u._id)}
              className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition relative"
            >
              {/* Avatar */}
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                {u.name?.charAt(0).toUpperCase() || "U"}
                {/* Online indicator */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base truncate">{u.name}</p>
                <p className="text-gray-500 text-xs sm:text-sm truncate">
                  {/* Mock last message */}
                  {u.lastMessage || "Say hi 👋"}
                </p>
              </div>

              {/* Timestamp */}
              <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                {formatDate(u.lastMessageDate || new Date())}
              </span>
            </div>
          ))}

        {/* No users found */}
        {users.filter(
          (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        ).length === 0 && (
          <p className="text-center text-gray-400 mt-10">No users found.</p>
        )}
      </div>
    </div>
  );
}
