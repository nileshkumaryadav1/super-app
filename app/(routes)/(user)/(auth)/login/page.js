"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) router.push("/dashboard");
  }, [router]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value.trim() });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-4 py-10 md:py-20">
      {/* Login Card */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-2xl p-8 space-y-6 transition-all"
      >
        <h2 className="text-2xl font-bold text-center">🔑 Login</h2>

        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center animate-pulse">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-3 bg-[var(--accent)] text-white font-semibold rounded-xl hover:opacity-90 transition"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* Links */}
      <div className="mt-6 flex flex-col items-center gap-2 text-sm text-[var(--secondary)]">
        <Link href="/register" className="hover:underline active:text-[var(--accent)]">
          Don&apos;t have an account? Register
        </Link>
        <Link href="/reset-password" className="hover:underline active:text-[var(--accent)]">
          Forgot Password?
        </Link>
      </div>
    </main>
  );
}
