"use client";
import { useState, useEffect } from "react";

export default function CreateNewBlogPage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    title: "",
    imageUrl: "",
    content: "",
    author: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const data = JSON.parse(stored);
      setUser(data);
      setForm((prev) => ({ ...prev, author: data.name || data.email }));
    }
  }, []);

  if (!user) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">✍️ Create New Blog</h2>
        <p className="text-gray-500">👋 Hey! Login first to write a blog.</p>
      </section>
    );
  }

  // Handle form input changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create blog");

      const data = await res.json();
      setSuccess("✅ Blog created successfully!");
      setForm({
        title: "",
        imageUrl: "",
        content: "",
        author: user.name || user.email,
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto mt-10 p-6 bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">
        ✍️ Create New Blog
      </h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="title" className="font-semibold mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="imageUrl" className="font-semibold mb-1">
            Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="content" className="font-semibold mb-1">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={6}
            className="p-3 rounded-lg border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="author" className="font-semibold mb-1">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={form.author}
            onChange={handleChange}
            readOnly
            className="p-3 rounded-lg border border-[var(--border)] bg-gray-100 text-gray-700 cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 bg-[var(--accent)] text-white rounded-xl font-semibold hover:opacity-90 transition"
        >
          {loading ? "Creating Blog..." : "Create Blog"}
        </button>
      </form>
    </section>
  );
}
