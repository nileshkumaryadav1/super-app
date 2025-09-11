"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/ai", label: "AI", icon: "🤖" },
    { href: "/chat", label: "Chat", icon: "💬" },
    { href: "/news", label: "News", icon: "📰" },
    { href: "/blog", label: "Blog", icon: "✍️" },
    { href: "/dashboard", label: "Me", icon: "👤" },
  ];

  const isActive = (href) =>
    pathname === href || pathname?.startsWith(href + "/");

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-white shadow sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between px-6">
          <h1 className="text-xl font-bold text-blue-600 py-4">
            <Link href="/">Super App</Link>
          </h1>
          <ul className="flex space-x-8 font-medium">
            {links.map((link) => (
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

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t border-gray-200 flex justify-around md:hidden z-50">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center w-full py-2 text-sm transition relative ${
              isActive(link.href)
                ? "text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            <span className="text-xl">{link.icon}</span>
            <span className="text-[10px]">{link.label}</span>
            {isActive(link.href) && (
              <span className="absolute top-0 left-0 right-0 h-1 bg-blue-600 rounded-t-md" />
            )}
          </Link>
        ))}
      </div>
    </>
  );
}
