"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Contact goes through /contact rather than a wa.me link: those carry a
  // phone number in the page markup on every route that renders them.

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-dark-900/95 backdrop-blur-xl border-b border-slate-900/[0.07] shadow-lg shadow-black/30"
          : "bg-dark-900/70 backdrop-blur-md"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="Nazsats — home">
          <Image
            src="/nazsats-logo.png"
            alt="Nazsats"
            width={416}
            height={89}
            priority
            className="h-6 w-auto sm:h-7"
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? "text-purple-400 bg-purple-500/10"
                      : "text-slate-500 hover:text-slate-200 hover:bg-slate-900/[0.035]"
                  }`}
                >
                  {label}
                  {active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link href="/contact" className="btn-primary py-2.5 px-5 text-sm">
            Book a call →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/[0.035] transition"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-900/[0.07] bg-dark-900/98 backdrop-blur-xl">
          <ul className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    pathname === href
                      ? "text-purple-400 bg-purple-500/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/[0.035]"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full justify-center text-sm py-3"
              >
                Book a call →
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}