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

  const truncateText = (text, max) =>
    text.length > max ? text.slice(0, max).trim() + "..." : text;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 md:py-12 py-4 pb-16 bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 sm:gap-0">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-2">
          ✍️ Blogs
        </h2>
        <Link
          href="/blog/create-new"
          className="px-4 py-2 bg-[var(--accent)] text-white rounded-full hover:opacity-90 transition"
        >
          + New Blog
        </Link>
      </div>

      {/* States */}
      {loading && (
        <p className="text-gray-500 text-center text-lg py-6 animate-pulse">
          Loading blogs...
        </p>
      )}
      {error && (
        <p className="text-red-500 text-center text-lg py-6">{error}</p>
      )}
      {!loading && !error && blogs.length === 0 && (
        <p className="text-gray-500 text-center text-lg py-6">
          No blogs found.
        </p>
      )}

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="group border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card)] shadow hover:shadow-xl transition hover:-translate-y-1"
          >
            <Link href={`/blog/${blog.slug}`}>
              <div className="relative">
                <img
                  src={blog.imageUrl || "/blog-placeholder.jpg"}
                  alt={blog.title}
                  className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-20 transition"></div>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="text-md sm:text-base font-semibold mb-1 line-clamp-1">
                  {truncateText(blog.title, 60)}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-2 line-clamp-2">
                  {truncateText(blog.content, 100)}
                </p>
                <div className="flex justify-between items-center text-[var(--secondary)] text-xs sm:text-sm mb-2">
                  <span>By {truncateText(blog.author, 15)}</span>
                  {blog.createdAt && (
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  )}
                </div>
                <span className="text-[var(--accent)] text-sm font-medium hover:underline">
                  Read More →
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
