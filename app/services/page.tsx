import Link from "next/link";

const services = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.703-1.352 2.703a1.25 1.25 0 01-.88-.367l-4.998-4.998m0 0a1.25 1.25 0 00-1.77 0" />
      </svg>
    ),
    title: "Machine Learning & AI",
    desc: "Custom ML models, predictive analytics, NLP, and intelligent automation solutions tailored for your industry.",
    tags: ["Prediction", "NLP", "Automation", "Computer Vision"],
    status: "available",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "Data Science",
    desc: "Advanced data pipelines, visualization dashboards, and actionable insights that drive smarter business decisions.",
    tags: ["Analytics", "Visualization", "Pipelines", "BI"],
    status: "available",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
    title: "Crypto & Bitcoin Software",
    desc: "Secure wallets, trading tools, and custom software for Bitcoin, Ethereum, Solana, and any crypto network.",
    tags: ["Wallets", "Trading", "Bitcoin", "Ethereum"],
    status: "available",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
    title: "dApp Development",
    desc: "Full-stack decentralized applications with smart contracts, token integrations, and seamless Web3 UX.",
    tags: ["Smart Contracts", "Web3", "Solana", "NFT"],
    status: "available",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    title: "AI + Blockchain Fusion",
    desc: "Next-generation platforms combining AI predictions with smart contract automation for DeFi and beyond.",
    tags: ["DeFi", "AI Agents", "Predictive", "Automated"],
    status: "soon",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
];

export default function Services() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="text-center mb-20">
        <div className="section-badge mb-6 animate-fade-in">What We Build</div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 animate-fade-in-up delay-100 leading-tight">
          Our <span className="gradient-text-animated">Services</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed animate-fade-in-up delay-200">
          From machine learning to smart contracts — we build the technology that powers the next generation of products.
        </p>
      </div>

      {/* Service cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {services.map((s, i) => (
          <div
            key={i}
            className={`glass-card flex flex-col animate-fade-in-up ${s.status === "soon" ? "glass-card-cyan" : ""}`}
            style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            aria-label={`Service: ${s.title}`}
          >
            <div className={`w-14 h-14 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-5 animate-float`} style={{ animationDelay: `${i * 0.4}s` }}>
              {s.icon}
            </div>

            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className={`text-xl font-bold ${s.color}`}>{s.title}</h2>
              {s.status === "soon" ? (
                <span className="flex-shrink-0 text-xs font-bold text-cyan-400 border border-cyan-400/25 bg-cyan-400/5 px-2.5 py-1 rounded-full">
                  Soon
                </span>
              ) : (
                <span className="flex-shrink-0 text-xs font-bold text-green-400 border border-green-400/20 bg-green-400/5 px-2.5 py-1 rounded-full">
                  Live
                </span>
              )}
            </div>

            <p className="text-slate-500 text-sm leading-relaxed mb-5 flex-1">{s.desc}</p>

            <div className="flex flex-wrap gap-2">
              {s.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-slate-600 border border-white/5 bg-white/3 px-2 py-1 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="glass-card text-center animate-glow-pulse max-w-2xl mx-auto">
        <h2 className="text-2xl font-black text-white mb-3">
          Need a custom <span className="gradient-text">solution?</span>
        </h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Every project is different. Tell us what you&apos;re building and we&apos;ll design the right approach for you.
        </p>
        <Link href="/contact" className="btn-primary">
          Start a Conversation →
        </Link>
      </div>
    </div>
  );
}