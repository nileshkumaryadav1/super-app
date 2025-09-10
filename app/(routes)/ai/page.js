"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function AIPage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch(`/api/ai?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResponse(data.answer);
    } catch (err) {
      setResponse("❌ Error fetching AI response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Heading */}
      <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
        🚀 AI Search
      </h2>

      {/* Input + Button */}
      <div className="flex gap-3">
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
      <div className="mt-6 p-6 bg-gray-50 rounded-xl min-h-[120px] border border-gray-200 shadow-inner prose prose-blue max-w-none">
        {loading ? (
          <p className="animate-pulse text-gray-500">⏳ Generating response...</p>
        ) : response ? (
          <ReactMarkdown>{response}</ReactMarkdown>
        ) : (
          <p className="text-gray-400">AI response will appear here...</p>
        )}
      </div>
    </div>
  );
}
