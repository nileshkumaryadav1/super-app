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
      const res = await fetch(`/api/news?page=${p}&limit=5`);
      const data = await res.json();
      setArticles((prev) => [...prev, ...(data.articles || [])]);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
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

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, loading]);

  // Fetch new page when page state changes
  useEffect(() => {
    if (page === 1) return;
    fetchNews(page);
  }, [page]);

  if (!articles.length && loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="animate-pulse text-gray-500 text-lg">Loading news...</p>
      </div>
    );
  }

  return (
    <>
      {/* Overlay for expanded article */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/90 overflow-y-auto">
          <button
            onClick={() => setActiveArticle(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600"
          >
            ✖
          </button>
          <div className="max-w-2xl mx-auto mt-20 px-4 text-white">
            <h1 className="text-2xl font-bold mb-3">{activeArticle.title}</h1>
            {activeArticle.urlToImage && (
              <img
                src={activeArticle.urlToImage}
                alt={activeArticle.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}
            <p className="text-gray-200 mb-4">{activeArticle.description}</p>
            <a
              href={activeArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium"
            >
              Read Original
            </a>
          </div>
        </div>
      )}

      {/* Vertical scroll “shorts” */}
      <div
        ref={containerRef}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory"
      >
        {articles.map((article, idx) => (
          <div
            key={idx}
            className="h-screen w-full flex flex-col justify-end relative snap-start cursor-pointer"
            onClick={() => setActiveArticle(article)}
          >
            <img
              src={article.urlToImage || "/news.jpg"}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover brightness-75"
            />
            <div className="p-6 relative z-10 bg-gradient-to-t from-black/70 to-transparent text-white">
              <h2 className="text-2xl font-bold mb-2 line-clamp-3">{article.title}</h2>
              <p className="text-gray-200 mb-4 line-clamp-5">{article.description}</p>
              <span className="inline-block bg-blue-600 px-4 py-2 rounded-md text-sm font-medium">
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
    </>
  );
}
