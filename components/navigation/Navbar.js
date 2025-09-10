"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/ai", label: "AI Search" },
    { href: "/chat", label: "Chat" },
    { href: "/news", label: "News" },
    { href: "/blog", label: "Blog" },
    { href: "/dashboard", label: "👤" },
  ];

  const isActive = (href) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-blue-600">
          <Link href="/">Super App</Link>
        </h1>
        <ul className="flex space-x-6 font-medium">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`transition-colors duration-200 ${
                  isActive(link.href)
                    ? "text-blue-600 font-semibold"
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
  );
}
