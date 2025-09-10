"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (!user) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">
          👋 Hey! Login first to chat.
        </h2>
        <Link href="/login" className="border rounded-md px-4 py-2">Login</Link>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-3xl font-bold mb-2">
        👋 Hey! {user.name || user.email}
      </h2>

      {/* chat section */}

    </section>
  );
}
