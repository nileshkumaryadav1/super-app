"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("user")) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.trim() });
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = form.email.toLowerCase().trim();

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "register" }),
      });

      const data = res.headers.get("content-type")?.includes("application/json")
        ? await res.json()
        : {};

      if (res.ok) {
        alert(`📩 OTP sent to ${email}`);
        setStep(2);
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Registration successful!");
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        alert(data.message || "OTP verification failed");
        if (data.message === "Email already registered") router.push("/login");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full p-3 rounded-lg bg-transparent border border-[var(--border)] placeholder:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition";

  const buttonClasses =
    "w-full py-3 rounded-lg font-semibold text-white transition hover:opacity-90";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--background)] text-[var(--foreground)]">
      {step === 1 && (
        <form
          onSubmit={sendOtp}
          className="w-full max-w-sm sm:max-w-md p-6 space-y-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-lg animate-fadeIn"
        >
          <h2 className="text-2xl font-bold text-center">
            📝 User Registration
          </h2>

          {[
            { name: "name", type: "text", placeholder: "Full Name" },
            { name: "email", type: "email", placeholder: "Email Address" },
            { name: "password", type: "password", placeholder: "Password" },
          ].map(({ name, type, placeholder }) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={form[name]}
              onChange={handleChange}
              required
              className={inputClasses}
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`${buttonClasses} bg-[var(--accent)]`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={verifyOtp}
          className="w-full max-w-sm sm:max-w-md p-6 space-y-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-lg animate-fadeIn"
        >
          <h2 className="text-xl font-bold text-center">🔐 Verify OTP</h2>
          <p className="text-sm text-center text-gray-500">
            Enter the OTP sent to <b>{form.email}</b>
          </p>

          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.trim())}
            required
            className={inputClasses}
          />

          <button
            type="submit"
            disabled={loading}
            className={`${buttonClasses} bg-green-600 hover:bg-green-700`}
          >
            {loading ? "Verifying..." : "Verify & Register"}
          </button>
        </form>
      )}

      <div className="mt-4 flex flex-col items-center space-y-2 text-sm text-[var(--secondary)]">
        <Link
          href="/login"
          className="hover:underline active:text-[var(--accent)]"
        >
          Already registered? Login here →
        </Link>
        <Link
          href="/reset-password"
          className="hover:underline active:text-[var(--accent)]"
        >
          Forgot password?
        </Link>
      </div>
    </main>
  );
}
