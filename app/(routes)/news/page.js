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
        <p className="text-gray-500 animate-pulse text-base sm:text-lg">Loading news...</p>
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-500 text-base sm:text-lg">No news found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Full-page overlay */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col overflow-y-auto">
          <button
            onClick={() => setActiveArticle(null)}
            className="text-white p-2 text-sm sm:text-base self-end m-3 bg-gray-700 rounded-full hover:bg-gray-600"
          >
            ✖
          </button>
          <div className="max-w-2xl w-full mx-auto px-4 pb-10 text-white">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">{activeArticle.title}</h1>
            {activeArticle.urlToImage && (
              <img
                src={activeArticle.urlToImage}
                alt={activeArticle.title}
                className="w-full h-56 sm:h-80 object-cover rounded-lg mb-4"
              />
            )}
            <p className="text-gray-200 leading-relaxed text-sm sm:text-base mb-4">
              {activeArticle.description}
            </p>
            <a
              href={activeArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium text-sm sm:text-base"
            >
              Read Original
            </a>
          </div>
        </div>
      )}

      {/* Vertical scroll news shorts */}
      <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory">
        {articles.map((article, idx) => (
          <div
            key={idx}
            className="h-[85vh] w-full flex flex-col justify-end snap-start relative cursor-pointer"
            onClick={() => setActiveArticle(article)}
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage || "/news.jpg"}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover brightness-75"
              />
            )}
            {/* Overlay content */}
            <div className="p-4 sm:p-6 relative z-10 bg-gradient-to-t from-black/70 to-transparent text-white">
              <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">
                {article.title}
              </h2>
              <p className="line-clamp-3 sm:line-clamp-4 text-gray-100 mb-2 sm:mb-4 text-sm sm:text-base">
                {article.description}
              </p>
              <span className="inline-block bg-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium">
                Read Full
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
