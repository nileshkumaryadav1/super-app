"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Service-specific bottom nav items
const serviceBottomNavs = {
  ai: [
    { href: "/ai/search", label: "Search", icon: "🔍" },
    { href: "/ai/history", label: "History", icon: "📜" },
    { href: "/ai/saved", label: "Saved", icon: "⭐" },
  ],
  chat: [
    { href: "/chat", label: "All Chats", icon: "💬" },
    { href: "/chat/friends", label: "Friends", icon: "👥" },
    { href: "/chat/settings", label: "Settings", icon: "⚙️" },
  ],
  news: [
    { href: "/news/latest", label: "Latest", icon: "📰" },
    { href: "/news/trending", label: "Trending", icon: "🔥" },
    { href: "/news/saved", label: "Saved", icon: "⭐" },
  ],
  blog: [
    { href: "/blog", label: "All Blogs", icon: "✍️" },
    { href: "/blog/my", label: "My Blogs", icon: "📓" },
    { href: "/blog/settings", label: "Settings", icon: "⚙️" },
  ],
};

export default function Navbar() {
  const pathname = usePathname();

  const topLinks = [
    {
      href: "/ai",
      label: "AI",
      icon: "🤖",
      bg: "bg-yellow-100",
      activeBg: "bg-yellow-400",
    },
    {
      href: "/chat",
      label: "Chat",
      icon: "💬",
      bg: "bg-green-100",
      activeBg: "bg-green-400",
    },
    {
      href: "/news",
      label: "News",
      icon: "📰",
      bg: "bg-blue-100",
      activeBg: "bg-blue-400",
    },
    {
      href: "/blog",
      label: "Blog",
      icon: "✍️",
      bg: "bg-pink-100",
      activeBg: "bg-pink-400",
    },
  ];

  const isActive = (href) =>
    pathname === href || pathname?.startsWith(href + "/");

  // Determine current service (ai, chat, news, blog)
  const currentService =
    topLinks.find((l) => pathname.startsWith(l.href))?.label.toLowerCase() ||
    null;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-white shadow sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between px-6">
          <h1 className="text-xl font-bold text-blue-600 py-4">
            <Link href="/">Super App</Link>
          </h1>
          <ul className="flex space-x-8 font-medium">
            {topLinks.map((link) => (
              <li key={link.href} className="relative">
                <Link
                  href={link.href}
                  className={`pb-4 transition-colors duration-200 ${
                    isActive(link.href)
                      ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                      : "text-gray-700 hover:text-blue-500"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Top Nav (Amazon-style 4 service boxes) */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-50">
        <div className="grid grid-cols-4 gap-1 p-1">
          {topLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center h-16 rounded-md text-xs font-medium transition ${
                isActive(link.href)
                  ? link.activeBg + " text-white"
                  : link.bg + " text-gray-700"
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Service-Specific Nav */}
      {currentService && serviceBottomNavs[currentService] && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-inner flex justify-around z-50">
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

      {/* Spacers so content doesn't overlap navbars */}
      {/* top spacer */}
      {/* <div className="h-20 md:hidden" /> */}
      {/* bottom spacer */}
      <div className="h-14 md:hidden" />
    </>
  );
}
