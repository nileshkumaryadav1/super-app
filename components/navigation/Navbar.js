"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const serviceBottomNavs = {
  home: [
    { href: "/home", label: "Home", icon: "🏠" },
    { href: "/ai", label: "AI", icon: "🤖" },
    { href: "/chat", label: "Chat", icon: "💬" },
    { href: "/news", label: "News", icon: "📰" },
    { href: "/blog", label: "Blog", icon: "✍️" },
    { href: "/dashboard", label: "Dashboard", icon: "👤" },
  ],
  ai: [
    { href: "/ai", label: "Search", icon: "🔍" },
    { href: "/ai/history", label: "History", icon: "📜" },
    { href: "/ai/saved", label: "Saved", icon: "⭐" },
  ],
  chat: [
    { href: "/chat", label: "All Chats", icon: "💬" },
    { href: "/chat/friends", label: "Friends", icon: "👥" },
    { href: "/chat/suggestions", label: "Suggestions", icon: "👀" },
    { href: "/chat/settings", label: "Settings", icon: "⚙️" },
  ],
  news: [
    { href: "/news", label: "Latest", icon: "📰" },
    { href: "/news/trending", label: "Trending", icon: "🔥" },
    { href: "/news/saved", label: "Saved", icon: "⭐" },
  ],
  blog: [
    { href: "/blog", label: "All Blogs", icon: "✍️" },
    { href: "/blog/my", label: "My Blogs", icon: "📓" },
    { href: "/blog/settings", label: "Settings", icon: "⚙️" },
  ],
  dashboard: [
    { href: "/dashboard", label: "Profile", icon: "👤" },
    { href: "/dashboard/friends", label: "Friends", icon: "👥" },
    { href: "/dashboard/chats", label: "Chats", icon: "💬" },
    { href: "/dashboard/blogs", label: "Blogs", icon: "✍️" },
    { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
  ],
};

export default function Navbar() {
  const pathname = usePathname();

  const topLinks = [
    { href: "/home", label: "Home", icon: "🏠" },
    { href: "/ai", label: "AI", icon: "🤖" },
    { href: "/chat", label: "Chat", icon: "💬" },
    { href: "/news", label: "News", icon: "📰" },
    { href: "/blog", label: "Blog", icon: "✍️" },
    { href: "/dashboard", label: "Dashboard", icon: "👤" },
  ];

  const isActive = (href) =>
    pathname === href || pathname?.startsWith(href + "/");

  // Determine current service for bottom nav
  const currentService = topLinks
    .find((l) => pathname.startsWith(l.href))
    ?.label.toLowerCase();

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-10">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-blue-600 py-4"
          >
            SuperApp
          </Link>
          <ul className="flex space-x-8 font-medium items-center">
            {topLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`pb-4 flex items-center gap-1 transition-all ${
                    isActive(link.href)
                      ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                      : "text-gray-700 hover:text-blue-500"
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="flex justify-center items-center px-5 py-3">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight text-blue-600"
          >
            SuperApp
          </Link>
        </div>

        {/* Top Tabs */}
        <div className="grid grid-cols-6 gap-1 p-1 border-t border-gray-100">
          {topLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center h-14 rounded-lg text-xs font-medium transition ${
                isActive(link.href)
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
      {/* Mobile Bottom Service Nav */}
      {currentService && serviceBottomNavs[currentService] && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-gray-200 shadow-lg flex justify-around">
          {serviceBottomNavs[currentService].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center w-full py-2 text-xs transition ${
                isActive(link.href)
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      )}
      {/* Spacers */}
      <div className="h-20 md:hidden" /> {/* Top Spacer for mobile */}
      <div className="h-9 md:hidden" /> {/* Bottom Spacer for bottom nav */}
    </>
  );
}
