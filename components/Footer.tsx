import Link from "next/link";

const pages = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-950 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-black text-base">
                N
              </div>
              <span className="text-lg font-black gradient-text">Nazsats</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
              AI-driven platform for machine learning, data science, and blockchain. Building the future, one innovation at a time.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <div className="status-dot" />
              <span className="text-xs text-slate-600">Full launch coming soon</span>
            </div>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest text-slate-500">
              Pages
            </h4>
            <ul className="space-y-3">
              {pages.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-600 text-sm hover:text-purple-400 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest text-slate-500">
              Connect
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://twitter.com/nazsats"
                  className="text-slate-600 text-sm hover:text-purple-400 transition-colors duration-200 flex items-center gap-2"
                  aria-label="Twitter"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/company/nazsats"
                  className="text-slate-600 text-sm hover:text-purple-400 transition-colors duration-200 flex items-center gap-2"
                  aria-label="LinkedIn"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@nazsats.com"
                  className="text-slate-600 text-sm hover:text-purple-400 transition-colors duration-200 flex items-center gap-2"
                  aria-label="Email"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  contact@nazsats.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="divider mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-700 text-sm">© 2025 Nazsats. All rights reserved.</p>
          <p className="text-slate-700 text-sm">
            Powered by{" "}
            <span className="gradient-text font-semibold">AI & Blockchain</span>
          </p>
        </div>
      </div>
    </footer>
  );
}