"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-purple-800 to-purple-500 text-white py-6 shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-3xl font-extrabold tracking-tight">
          <Link href="/" className="hover:text-lavender-100 transition duration-300">
            Nazsats
          </Link>
        </h1>
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>
        <ul
          className={`md:flex md:space-x-8 text-lg ${
            isOpen ? "block" : "hidden"
          } md:block absolute md:static top-16 left-0 right-0 bg-purple-800 md:bg-transparent p-4 md:p-0 transition-all duration-300`}
        >
          {[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/services", label: "Services" },
            { href: "/contact", label: "Contact" },
            { href: "/blog", label: "Blog" },
          ].map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="block py-2 md:py-0 hover:text-lavender-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-lavender-300 rounded px-2"
                aria-label={`Navigate to ${label}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}