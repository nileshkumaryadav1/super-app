"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function AIPage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [related, setRelated] = useState({ blogs: [], news: [] });

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setResponse("");
    setRelated({ blogs: [], news: [] });

    try {
      // AI Response
      const res = await fetch(`/api/ai?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResponse(data.answer);

      // Related Blogs + News
      const relatedRes = await fetch(`/api/related?query=${encodeURIComponent(query)}`);
      const relatedData = await relatedRes.json();
      setRelated(relatedData);
    } catch (err) {
      setResponse("❌ Error fetching AI response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      {/* Card */}
      <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-center text-blue-700">
          🚀 AI Search
        </h2>

        {/* Input + Button (stack on mobile) */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`px-6 py-3 rounded-xl text-white font-medium transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {loading ? "Thinking..." : "Search"}
          </button>
        </div>

        {/* Response */}
        <div className="mt-6 p-4 sm:p-6 bg-gray-50 rounded-xl min-h-[120px] border border-gray-200 shadow-inner prose prose-blue max-w-none text-sm sm:text-base">
          {loading ? (
            <p className="animate-pulse text-gray-500">⏳ Generating response...</p>
          ) : response ? (
            <ReactMarkdown>{response}</ReactMarkdown>
          ) : (
            <p className="text-gray-400">AI response will appear here...</p>
          )}
        </div>
      </div>

      {/* Related Section */}
      {(related.blogs.length > 0 || related.news.length > 0) && (
        <div className="mt-8 space-y-6">
          {/* Blogs */}
          {related.blogs.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">📖 Related Blogs</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.blogs.map((blog, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-100"
                  >
                    <h4 className="font-bold text-gray-800 line-clamp-2">{blog.title}</h4>
                    <p className="text-sm text-gray-500 line-clamp-3">{blog.excerpt}</p>
                    <a
                      href={`/blogs/${blog.slug}`}
                      className="text-blue-600 text-sm mt-2 inline-block hover:underline"
                    >
                      Read More →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* News */}
          {related.news.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">📰 Related News</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.news.map((article, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-100"
                  >
                    <h4 className="font-bold text-gray-800 line-clamp-2">{article.title}</h4>
                    <p className="text-sm text-gray-500 line-clamp-3">{article.description}</p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm mt-2 inline-block hover:underline"
                    >
                      Read Full →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
