// app/blog/page.js
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
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">✍️ Blogs</h2>
        <Link
          href="/blog/create-new"
          className="px-4 py-2 bg-[var(--accent)] text-white rounded-full hover:opacity-90 transition"
        >
          + New Blog
        </Link>
      </div>

      {/* States */}
      {loading && <p className="text-gray-500 text-center">Loading blogs...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && !error && blogs.length === 0 && (
        <p className="text-gray-500 text-center">No blogs found.</p>
      )}

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="group border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card)] shadow hover:shadow-lg transition"
          >
            <Link href={`/blog/${blog.slug}`}>
              <div className="relative">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition"></div>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="text-lg font-semibold mb-1 line-clamp-1">
                  {blog.title}
                </h3>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                  {blog.content}
                </p>
                <p className="text-xs text-[var(--secondary)] mb-2">
                  By {blog.author}
                </p>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="text-[var(--accent)] text-sm font-medium hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
