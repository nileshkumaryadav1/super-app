import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 text-center h-[75vh]">
      <img
        src="/favicon.ico"
        alt="404"
        className="w-20 h-20 mb-6 rounded-full"
      />
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
        SuperApp | 404
      </h1>
      <p className="text-xl text-gray-600 mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-500 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
