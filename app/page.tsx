import Link from "next/link";
import SubscribeForm from "../components/SubscribeForm";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.703-1.352 2.703a1.25 1.25 0 01-.88-.367l-4.998-4.998m0 0a1.25 1.25 0 00-1.77 0" />
      </svg>
    ),
    title: "AI-Powered",
    desc: "State-of-the-art machine learning models trained on your data for measurable business results.",
    color: "text-purple-400",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
    title: "Blockchain Secure",
    desc: "Smart contracts and dApps built for Ethereum, Solana, and every major blockchain network.",
    color: "text-cyan-400",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "Data Science",
    desc: "Advanced analytics, visualization, and insights that turn raw data into strategic decisions.",
    color: "text-purple-400",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    title: "AI + Blockchain",
    desc: "Next-gen fusion of AI and blockchain — predictive smart contracts and automated crypto analytics.",
    color: "text-cyan-400",
    soon: true,
  },
];

const stats = [
  { value: "5+", label: "Core Services" },
  { value: "100%", label: "Custom-Built" },
  { value: "24/7", label: "Availability" },
  { value: "∞", label: "Scalability" },
];

export default function Home() {
  return (
    <div>
      {/* ── Hero ───────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center overflow-hidden px-4 py-24">
        {/* Background layers */}
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 bg-radial-glow" />

        {/* Floating orbs */}
        <div
          className="absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full blur-[120px] animate-orb pointer-events-none"
          style={{ background: "rgba(230,80,0,0.20)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] rounded-full blur-[100px] animate-orb pointer-events-none"
          style={{ background: "rgba(200,0,85,0.14)", animationDelay: "5s" }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="section-badge mb-8 animate-fade-in">
            <span className="status-dot" style={{ width: 6, height: 6 }} />
            AI &amp; Blockchain Innovation Platform
          </div>

          {/* Heading */}
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[1.05] tracking-tight animate-fade-in-up delay-100">
            Build the{" "}
            <span className="gradient-text-animated">Future</span>
            <br className="hidden sm:block" />
            {" "}with AI
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
            Nazsats delivers cutting-edge machine learning, data science, and blockchain solutions —
            turning complex technology into real business results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Link href="/services" className="btn-primary">
              Explore Services →
            </Link>
            <Link href="/contact" className="btn-secondary">
              Get in Touch
            </Link>
          </div>

          {/* Floating terminal decoration */}
          <div
            className="hidden lg:block absolute -right-8 top-1/2 -translate-y-1/2 terminal-card w-64 animate-float animate-fade-in delay-600"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs text-slate-600">nazsats.ai</span>
            </div>
            <div className="px-4 py-4 space-y-2">
              <p className="text-cyan-400 text-xs">$ nazsats init</p>
              <p className="text-slate-500 text-xs">✓ AI model loaded</p>
              <p className="text-slate-500 text-xs">✓ Blockchain connected</p>
              <p className="text-slate-500 text-xs">✓ Data pipeline ready</p>
              <p className="text-purple-400 text-xs animate-pulse">▋ Ready to build_</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────── */}
      <section className="py-12 border-y border-white/5 bg-dark-800/30">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-3xl md:text-4xl font-black gradient-text mb-1">{s.value}</div>
              <div className="text-xs text-slate-600 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────── */}
      <section className="py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-badge mb-5 animate-fade-in">Why Nazsats</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 animate-fade-in-up delay-100">
              Technology that{" "}
              <span className="gradient-text">works for you</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg animate-fade-in-up delay-200">
              We combine AI precision with blockchain security to build solutions that are fast,
              scalable, and future-proof.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className={`glass-card animate-fade-in-up ${f.soon ? "glass-card-cyan" : ""}`}
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                <div
                  className={`w-12 h-12 rounded-xl mb-5 flex items-center justify-center ${f.color} bg-white/5 animate-float`}
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  {f.icon}
                </div>
                <h3 className={`text-lg font-bold mb-2 ${f.color}`}>{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                {f.soon && (
                  <span className="inline-block mt-4 text-xs font-bold text-cyan-400 border border-cyan-400/25 bg-cyan-400/5 px-3 py-1 rounded-full">
                    Coming Soon
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────── */}
      <section className="py-24 px-4 bg-dark-800/20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="section-badge mb-5 animate-fade-in">Simple Process</div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-16 animate-fade-in-up delay-100">
            From idea to <span className="gradient-text">production</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px bg-gradient-to-r from-purple-500/30 via-cyan-500/30 to-purple-500/30" />

            {[
              { step: "01", title: "Consult", desc: "Tell us your goals. We map out the right AI or blockchain solution for your use case." },
              { step: "02", title: "Build", desc: "Our engineers design, train, and deploy your custom solution — fast and transparent." },
              { step: "03", title: "Scale", desc: "Launch with confidence. We optimize and scale your product as you grow." },
            ].map((item, i) => (
              <div
                key={i}
                className="glass-card text-left animate-fade-in-up"
                style={{ animationDelay: `${0.1 + i * 0.15}s` }}
              >
                <div className="text-4xl font-black gradient-text mb-4 opacity-60">{item.step}</div>
                <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Subscribe ──────────────────────────────── */}
      <section className="py-28 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card text-center animate-glow-pulse">
            <div className="section-badge mb-5 mx-auto w-fit">Stay Updated</div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              Join the <span className="gradient-text">launch</span>
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Get exclusive updates on our AI &amp; blockchain platform directly in your inbox.
              No spam — just insights.
            </p>
            <SubscribeForm />
          </div>
        </div>
      </section>
    </div>
  );
}