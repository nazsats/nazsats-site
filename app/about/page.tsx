import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Nazsats — building AI, machine learning, data science, and blockchain solutions.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082" />
      </svg>
    ),
    title: "AI-First Thinking",
    desc: "Every solution starts with the question: how can AI make this smarter, faster, and more impactful?",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Built to run, not to demo",
    desc: "Auth, roles, rate limits and token cost caps from day one. The unglamorous parts are what decide whether a thing survives real users.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Something working, early",
    desc: "You see a working version on your own data in the first couple of weeks, not a deck. Easier to judge, and easier to change your mind about.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: "No lock-in",
    desc: "You get the repository, the schema and the deployment. If you want to take it in-house or hand it to someone else, nothing stops you.",
  },
];

const comingSoon = [
  "WhatsApp assistants that answer from a company's own catalogue",
  "Document pipelines for invoices, contracts and forms",
  "White-label storefront generation for agencies",
  "Reviews of AI systems already in production",
  "Arabic and RTL support across the tools above",
];

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="text-center mb-20">
        <div className="section-badge mb-6 animate-fade-in">About</div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-200 mb-6 animate-fade-in-up delay-100 leading-tight">
          About <span className="gradient-text-animated">Nazsats</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed animate-fade-in-up delay-200">
          I&apos;m Nazrul, an AI engineer in Mumbai. I build the kind of AI a business can actually
          keep running — assistants that answer from your own data, systems that read documents,
          and the plumbing that stops either from falling over in month three.
        </p>
      </div>

      {/* Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-center">
        <div className="animate-fade-in-up delay-200">
          <h2 className="text-3xl font-black text-slate-200 mb-5">
            What I <span className="gradient-text">do</span>
          </h2>
          <div className="space-y-5 text-slate-400 leading-relaxed">
            <p>
              Most of my work is one of three things: an assistant that answers questions from a
              company&apos;s own data and can act on it, a pipeline that turns PDFs and forms into
              records a system can use, or the automation that removes a job somebody is doing by
              hand every morning.
            </p>
            <p>
              I&apos;ve shipped a multi-tenant assistant for Dubai property agents that searches live
              listings and drafts client pitches, a tool that reads a blood test and explains every
              marker in plain English, and a builder that turns one sentence into a working
              storefront. Python and FastAPI on the back, Next.js on the front, Postgres underneath.
            </p>
            <p>
              I also read the source of the libraries I build on. Six bugs found and fixed upstream
              so far across Qdrant, LlamaIndex and Outlines — two of them merged, one shipped in a
              release. It is the same habit that keeps client systems from failing quietly.
            </p>
          </div>
        </div>

        {/* Terminal decoration */}
        <div className="terminal-card scan-container animate-fade-in-up delay-300">
          <div className="flex items-center gap-1.5 px-5 py-3.5 border-b border-slate-900/[0.07]">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            <span className="ml-2 text-xs text-slate-400">whoami</span>
          </div>
          <div className="px-5 py-6 space-y-3 font-mono text-xs">
            <p className="text-slate-400"># nazrul ansari</p>
            <p><span className="text-cyan-400">focus</span><span className="text-slate-600">:</span> <span className="text-slate-300">AI systems for businesses</span></p>
            <p><span className="text-cyan-400">based</span><span className="text-slate-600">:</span> <span className="text-slate-300">Mumbai &#183; open to Dubai</span></p>
            <p><span className="text-cyan-400">services</span><span className="text-slate-600">:</span> <span className="text-slate-300">[assistants, document AI, automation]</span></p>
            <p><span className="text-cyan-400">status</span><span className="text-slate-600">:</span> <span className="text-green-400">available for work</span></p>
            <p className="text-purple-400 animate-pulse">▋</p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <div className="section-badge mb-4 animate-fade-in">How I work</div>
          <h2 className="text-4xl font-black text-slate-200 animate-fade-in-up delay-100">
            What you get <span className="gradient-text">working with me</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div
              key={i}
              className="glass-card animate-fade-in-up"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                {v.icon}
              </div>
              <h3 className="text-slate-200 font-bold mb-2">{v.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Coming soon */}
      <div className="glass-card border-cyan-500/15 animate-fade-in-up delay-300">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1">
            <span className="inline-block text-xs font-bold text-cyan-400 border border-cyan-400/25 bg-cyan-400/5 px-3 py-1 rounded-full mb-4">
              Coming Soon
            </span>
            <h2 className="text-3xl font-black text-slate-200 mb-3">
              What&apos;s <span className="text-cyan-400">next</span>
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              A few things I&apos;m building or would take on next. If one of them is a problem you
              actually have, that is a good reason to get in touch early.
            </p>
          </div>
          <ul className="flex-1 space-y-3">
            {comingSoon.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-sm text-slate-400 animate-fade-in-up"
                style={{ animationDelay: `${0.4 + i * 0.08}s` }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}