"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin", label: "Blog", exact: true },
  { href: "/admin/log", label: "Track Record" },
  { href: "/admin/coding", label: "Coding Time" },
];

/**
 * Shared admin tab bar. Every admin page renders this so the sections are
 * reachable by clicking rather than by typing the URL.
 */
export default function AdminNav({ signOut }: { signOut: () => Promise<void> }) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between gap-4 flex-wrap mb-10 pb-4 border-b border-slate-900/[0.07]">
      <div className="flex items-center gap-2">
        {tabs.map((t) => {
          const active = t.exact ? pathname === t.href : pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                active
                  ? "bg-orange-500/15 text-orange-400"
                  : "text-slate-400 hover:bg-slate-900/[0.035] hover:text-slate-200"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-900/[0.035] hover:text-slate-200 transition-colors"
        >
          View site ↗
        </Link>
        <form action={signOut}>
          <button className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-900/[0.035] text-slate-300 hover:bg-slate-900/[0.06] transition-colors">
            Sign out
          </button>
        </form>
      </div>
    </nav>
  );
}
