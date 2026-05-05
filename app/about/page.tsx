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
    title: "Security by Design",
    desc: "We build on blockchain to ensure your data and transactions are transparent, immutable, and secure.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Speed to Value",
    desc: "We move fast. From idea to deployed product — without sacrificing quality or reliability.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: "Client-Centric",
    desc: "Your success is our metric. We listen, adapt, and deliver solutions tailored to your specific needs.",
  },
];

const comingSoon = [
  "AI-Powered Blockchain Analytics Dashboard",
  "Custom dApp Templates & Starter Kits",
  "Real-Time Data Science Pipelines",
  "Expanded Crypto Network Integrations",
  "Automated Smart Contract Auditing (AI)",
];

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="text-center mb-20">
        <div className="section-badge mb-6 animate-fade-in">Our Story</div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 animate-fade-in-up delay-100 leading-tight">
          About <span className="gradient-text-animated">Nazsats</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed animate-fade-in-up delay-200">
          We are builders at the intersection of artificial intelligence and blockchain technology —
          on a mission to make advanced technology accessible and practical for every business.
        </p>
      </div>

      {/* Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-center">
        <div className="animate-fade-in-up delay-200">
          <h2 className="text-3xl font-black text-white mb-5">
            What we <span className="gradient-text">do</span>
          </h2>
          <div className="space-y-5 text-slate-400 leading-relaxed">
            <p>
              Nazsats is an AI-driven platform that helps businesses build smarter solutions on top
              of artificial intelligence. We specialize in machine learning, data science, and
              advanced analytics — turning raw data into competitive advantages.
            </p>
            <p>
              Our core expertise spans the entire blockchain ecosystem. We design and develop
              software for crypto networks, build decentralized applications across multiple
              platforms, and provide AI solutions tuned for the fast-moving digital economy.
            </p>
            <p>
              At Nazsats, we believe the most powerful products emerge at the intersection of AI and
              blockchain — and that's exactly where we build.
            </p>
          </div>
        </div>

        {/* Terminal decoration */}
        <div className="terminal-card scan-container animate-fade-in-up delay-300">
          <div className="flex items-center gap-1.5 px-5 py-3.5 border-b border-white/5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            <span className="ml-2 text-xs text-slate-600">about nazsats</span>
          </div>
          <div className="px-5 py-6 space-y-3 font-mono text-xs">
            <p className="text-slate-600"># Company profile</p>
            <p><span className="text-cyan-400">focus</span><span className="text-slate-600">:</span> <span className="text-slate-300">AI + Blockchain</span></p>
            <p><span className="text-cyan-400">mission</span><span className="text-slate-600">:</span> <span className="text-slate-300">Make tech accessible</span></p>
            <p><span className="text-cyan-400">services</span><span className="text-slate-600">:</span> <span className="text-slate-300">[ML, DataSci, dApps, ...]</span></p>
            <p><span className="text-cyan-400">status</span><span className="text-slate-600">:</span> <span className="text-green-400">actively building</span></p>
            <p className="text-purple-400 animate-pulse">▋</p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <div className="section-badge mb-4 animate-fade-in">Our Values</div>
          <h2 className="text-4xl font-black text-white animate-fade-in-up delay-100">
            How we <span className="gradient-text">think</span>
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
              <h3 className="text-white font-bold mb-2">{v.title}</h3>
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
            <h2 className="text-3xl font-black text-white mb-3">
              What&apos;s <span className="text-cyan-400">next</span>
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              We&apos;re actively building the next generation of AI + blockchain tools. Here&apos;s a preview
              of what&apos;s on our roadmap.
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