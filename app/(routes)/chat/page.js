// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function ChatPage() {
//   const [user, setUser] = useState(null);

//   // Load user from localStorage
//   useEffect(() => {
//     const stored = localStorage.getItem("user");
//     if (stored) setUser(JSON.parse(stored));
//   }, []);

//   if (!user) {
//     return (
//       <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
//         <h2 className="text-3xl font-bold mb-2">
//           👋 Hey! Login first to chat.
//         </h2>
//         <Link href="/login" className="border rounded-md px-4 py-2">Login</Link>
//       </section>
//     );
//   }

//   return (
//     <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
//       <h2 className="text-3xl font-bold mb-2">
//         👋 Hey! {user.name || user.email}
//       </h2>

//       {/* chat section */}

//     </section>
//   );
// }



// app/chat/page.js
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
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users.filter(u => u._id !== currentUser?._id)));
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

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold">Select a user to chat</h2>
      {users.map(u => (
        <div key={u._id} className="p-4 border rounded cursor-pointer hover:bg-gray-100"
             onClick={() => startChat(u._id)}>
          {u.name} ({u.email})
        </div>
      ))}
    </div>
  );
}
