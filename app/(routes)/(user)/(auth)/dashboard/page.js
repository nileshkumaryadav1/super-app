"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Pencil, Trash2 } from "lucide-react";
import UserInfo from "@/components/dashboard/UserInfo";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }

    const data = JSON.parse(stored);
    setUser(data);
  }, [router]);

  // Logout handler
  const handleLogout = () => {
    if (!confirm("🔒 Are you sure you want to logout?")) return;
    localStorage.removeItem("user");
    router.replace("/login");
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    if (!confirm("⚠️ This will permanently delete your account. Continue?")) return;
    if (!user?._id) return;

    try {
      const res = await fetch(`/api/user/${user._id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Account deleted successfully.");
        localStorage.removeItem("user");
        router.push("/register");
      } else {
        alert("Failed to delete account.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("An error occurred. Please try again.");
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center text-[var(--foreground)] bg-[var(--background)]">
        <p className="text-sm animate-pulse">Loading your dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 md:px-12 bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold break-words">
            Welcome, {user.name || user.email}
          </h1>
          <div className="flex flex-wrap w-full md:w-auto gap-2 sm:gap-3 text-sm">
            <button
              onClick={() => router.push("/edit-profile")}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg w-full sm:w-auto bg-cyan-500/20 text-[var(--secondary)] hover:bg-cyan-500/30 transition"
            >
              <Pencil size={16} /> Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg w-full sm:w-auto bg-red-500/20 text-red-600 hover:bg-red-500/30 transition"
            >
              <LogOut size={16} /> Logout
            </button>
            <button
              onClick={handleDeleteAccount}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg w-full sm:w-auto bg-red-600/20 text-red-400 hover:bg-red-600/30 transition"
            >
              <Trash2 size={16} /> Delete Account
            </button>
          </div>
        </div>

        {/* Student Info Section */}
        <section>
          <UserInfo user={user} />
        </section>
      </div>
    </main>
  );
}
