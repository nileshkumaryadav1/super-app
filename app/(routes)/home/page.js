// // app/home/page.js
// import { redirect } from "next/navigation";

// export default function HomeRedirect() {
//   // Immediately redirect to "/"
//   redirect("/");
// }


"use client";

import Link from "next/link";

const services = [
  {
    href: "/ai",
    icon: "🤖",
    title: "AI Search",
    desc: "Smart answers powered by AI. Search anything and get instant results.",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    href: "/chat",
    icon: "💬",
    title: "Chat",
    desc: "Stay connected with friends, manage conversations, and collaborate.",
    color: "from-green-400 to-green-600",
  },
  {
    href: "/news",
    icon: "📰",
    title: "News",
    desc: "Get the latest updates, trending stories, and save favorites.",
    color: "from-blue-400 to-blue-600",
  },
  {
    href: "/blog",
    icon: "✍️",
    title: "Blog",
    desc: "Write, share, and explore community blogs with a modern interface.",
    color: "from-pink-400 to-pink-600",
  },
];

export default function Home() {
  return (
    <main className="flex flex-col items-center bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero Section */}
      <section className="text-center pb-6 md:py-8 px-4 sm:px-6">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--highlight)] mb-4 leading-tight">
          Welcome to Super App 🌟
        </h1>
        <p className="text-[var(--secondary)] max-w-2xl mx-auto text-base sm:text-lg px-2">
          Your all-in-one platform for AI-powered search, seamless chatting,
          real-time news, and creative blogging.
        </p>
        <div className="mt-6 sm:mt-8">
          <Link
            href="/dashboard"
            className="px-5 py-3 sm:px-6 sm:py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition active:scale-95"
          >
            Go to Dashboard →
          </Link>
        </div>
      </section>

      {/* Services Cards */}
      <section className="w-full max-w-5xl px-4 sm:px-6 pb-16 sm:pb-20 flex flex-col sm:flex-row gap-5">
        {services.map((s, idx) => (
          <Link
            key={s.href}
            href={s.href}
            className="group relative flex flex-row sm:flex-col items-center sm:items-start gap-4 p-5 sm:p-6 rounded-2xl bg-white shadow hover:shadow-lg border border-gray-100 transition active:scale-[0.98]"
          >
            {/* Icon */}
            <div
              className={`flex-shrink-0 w-16 h-16 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white text-3xl sm:text-2xl`}
            >
              {s.icon}
            </div>

            {/* Text */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-base font-bold text-gray-800 mb-2 sm:mb-1 group-hover:text-blue-600">
                {s.title}
              </h3>
              <p className="text-gray-600 text-base sm:text-sm">{s.desc}</p>
            </div>

            {/* Arrow */}
            <div className="flex sm:hidden items-center justify-center text-[var(--highlight)] text-xl group-hover:translate-x-1 transition">
              →
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
