"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function BlogPage() {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/blog");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setBlogs(data.blogs || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">✍️ Blogs</h2>
        <Link
          href="/blog/create-new"
          className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition"
        >
          + Create New Blog
        </Link>
      </div>

      {loading && <p className="text-gray-500 text-center">Loading blogs...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && blogs.length === 0 && (
        <p className="text-gray-500 text-center">No blogs found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="border border-[var(--border)] rounded-2xl p-4 shadow hover:shadow-md transition bg-[var(--card)]"
          >
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
            <p className="text-gray-400 mb-2 line-clamp-3">{blog.content}</p>
            <p className="text-sm text-[var(--secondary)]">By {blog.author}</p>
            <Link
              href={`/blog/${blog._id}`}
              className="text-[var(--accent)] text-sm mt-2 inline-block hover:underline"
            >
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
