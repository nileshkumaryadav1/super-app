"use client";

import { useEffect, useState, useRef } from "react";

export default function NewsShorts() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeArticle, setActiveArticle] = useState(null);

  const containerRef = useRef(null);

  const fetchNews = async (p = 1) => {
    try {
      const res = await fetch(`/api/news?page=${p}&limit=10`);
      const data = await res.json();
      setArticles((prev) => [...prev, ...(data.articles || [])]);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Infinite scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!hasMore || loading) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setLoading(true);
        setPage((prev) => prev + 1);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  useEffect(() => {
    if (page === 1) return;
    fetchNews(page);
  }, [page]);

  if (!articles.length && loading) {
    return (
      <div className="flex items-center justify-center h-[75vh]">
        <p className="animate-pulse text-gray-500 text-lg">Loading news...</p>
      </div>
    );
  }

  const truncateText = (text, max) =>
    text.length > max ? text.slice(0, max).trim() + "..." : text;

  return (
    <section className="relative">
      {/* Expanded Article Overlay */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/95 overflow-y-auto py-10 px-4 sm:px-6">
          <button
            onClick={() => setActiveArticle(null)}
            className="absolute top-4 right-4 p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition"
          >
            ✖
          </button>
          <div className="max-w-3xl mx-auto text-white">
            <h1 className="text-2xl sm:text-4xl font-bold mb-4">
              {activeArticle.title}
            </h1>
            {activeArticle.urlToImage && (
              <img
                src={activeArticle.urlToImage}
                alt={activeArticle.title}
                className="w-full sm:h-96 object-cover rounded-lg mb-6 shadow-lg"
              />
            )}
            <p className="text-gray-200 mb-6 text-lg">
              {activeArticle.description}
            </p>
            <a
              href={activeArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition"
            >
              Read Original
            </a>
          </div>
        </div>
      )}

      {/* Vertical Scroll “Shorts” */}
      <div
        ref={containerRef}
        className="h-[75vh] w-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
      >
        {articles.map((article, idx) => (
          <div
            key={idx}
            className="w-full h-full flex flex-col justify-end relative snap-start cursor-pointer group"
            onClick={() => setActiveArticle(article)}
          >
            <img
              src={article.urlToImage || "/news.jpg"}
              alt={article.title}
              className="w-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="p-6 relative z-10 bg-white/80 backdrop-blur-md rounded-b-xl -mt-6 sm:-mt-10 shadow-lg">
              <h2 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">
                {truncateText(article.title, 95)}
              </h2>
              <p className="text-gray-700 mb-4 text-sm sm:text-base">
                {truncateText(article.description, 120)}
              </p>
              <span className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                Read Full
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center justify-center py-6">
            <p className="animate-pulse text-gray-500 text-lg">Loading more...</p>
          </div>
        )}
        {!hasMore && (
          <div className="flex items-center justify-center py-6">
            <p className="text-gray-400 text-lg">No more news.</p>
          </div>
        )}
      </div>
    </section>
  );
}
