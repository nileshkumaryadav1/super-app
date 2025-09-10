"use client";

import { useEffect, useState } from "react";

export default function NewsShorts() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeArticle, setActiveArticle] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        setArticles(data.articles || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-500 animate-pulse text-lg">Loading news...</p>
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">No news found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Full-page overlay */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col overflow-y-auto transition-opacity duration-300">
          <button
            onClick={() => setActiveArticle(null)}
            className="text-white p-3 text-lg self-end m-4 bg-gray-700 rounded hover:bg-gray-600 shadow-lg transition"
          >
            ✖ Close
          </button>
          <div className="max-w-4xl mx-auto p-6 text-white">
            <h1 className="text-4xl font-extrabold mb-4">{activeArticle.title}</h1>
            {activeArticle.urlToImage && (
              <img
                src={activeArticle.urlToImage}
                alt={activeArticle.title}
                className="w-full h-72 md:h-96 object-cover rounded-xl mb-6 shadow-lg"
              />
            )}
            <p className="text-gray-200 leading-relaxed text-lg mb-6">{activeArticle.description}</p>
            <a
              href={activeArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition"
            >
              Read Original Article
            </a>
          </div>
        </div>
      )}

      {/* Vertical scroll news shorts */}
      <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory">
        {articles.map((article, idx) => (
          <div
            key={idx}
            className="h-screen w-full flex flex-col justify-end snap-start bg-gray-50 relative cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
            onClick={() => setActiveArticle(article)}
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover brightness-75"
              />
            )}
            <div className="p-6 relative z-10 flex flex-col justify-end h-full bg-gradient-to-t from-black/70 to-transparent text-white rounded-t-xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{article.title}</h2>
              <p className="line-clamp-4 text-gray-100 mb-4">{article.description}</p>
              <span className="self-start bg-blue-600 px-4 py-2 rounded-lg text-white font-medium shadow hover:bg-blue-500 transition">
                Read Full
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
