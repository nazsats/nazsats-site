import Link from "next/link";
import { getGitHubStats, getPinnedRepos, getContributions, getRecentActivity } from "../lib/github";
import SubscribeForm from "../components/SubscribeForm";
import TypewriterText from "../components/TypewriterText";
import MouseOrb from "../components/MouseOrb";
import ScrollReveal from "../components/ScrollReveal";
import CountUp from "../components/CountUp";
import TechStack from "../components/TechStack";
import GitHubPinnedRepos from "../components/GitHubPinnedRepos";
import GitHubHeatmap from "../components/GitHubHeatmap";
import GitHubFeed from "../components/GitHubFeed";

export default async function Home() {
  const [ghStats, pinnedRepos, contributions, activity] = await Promise.all([
    getGitHubStats(),
    getPinnedRepos(),
    getContributions(),
    getRecentActivity(),
  ]);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center overflow-hidden px-4 py-24">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 bg-radial-glow" />

        {/* Static orbs */}
        <div
          className="absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full blur-[120px] animate-orb pointer-events-none"
          style={{ background: "rgba(230,80,0,0.20)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] rounded-full blur-[100px] animate-orb pointer-events-none"
          style={{ background: "rgba(200,0,85,0.14)", animationDelay: "5s" }}
        />

        {/* Mouse-tracking orb */}
        <MouseOrb />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Live badge */}
          <div className="section-badge mb-8 animate-fade-in">
            <span className="status-dot" style={{ width: 6, height: 6 }} />
            AI &amp; Blockchain Innovation Platform
          </div>

          {/* Static heading */}
          <h1 className="text-5xl md:text-8xl font-black mb-4 leading-[1.05] tracking-tight animate-fade-in-up delay-100">
            I build
          </h1>

          {/* Typewriter line */}
          <div className="text-4xl md:text-7xl font-black mb-8 leading-tight animate-fade-in-up delay-200 min-h-[1.2em]">
            <TypewriterText />
          </div>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-300">
            Nazsats delivers machine learning, data science, and blockchain solutions —
            turning complex technology into real business results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
            <Link href="/services" className="btn-primary">
              Explore Services →
            </Link>
            <Link href="/contact" className="btn-secondary">
              Get in Touch
            </Link>
          </div>

          {/* Floating terminal */}
          <div
            className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 terminal-card w-64 animate-float animate-fade-in delay-600"
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

      {/* ── GitHub Stats ─────────────────────────── */}
      <section className="py-12 border-y border-white/5 bg-dark-800/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: ghStats.publicRepos, suffix: "+", label: "Repositories" },
              { value: ghStats.totalStars,  suffix: "",  label: "Total Stars" },
              { value: ghStats.followers,   suffix: "",  label: "Followers" },
              { value: contributions.total || 300, suffix: "+", label: "Contributions" },
            ].map((s, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="text-3xl md:text-4xl font-black gradient-text mb-1">
                  <CountUp target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs text-slate-600 uppercase tracking-widest">{s.label}</div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="section-badge mb-4">Tech Stack</div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Tools I <span className="gradient-text">work with</span>
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Hover over any tech to see it light up.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <TechStack />
          </ScrollReveal>
        </div>
      </section>

      {/* ── Pinned GitHub Projects ───────────────── */}
      <section className="py-24 px-4 bg-dark-800/20">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <div className="section-badge mb-4">Open Source</div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Featured <span className="gradient-text">Projects</span>
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Selected work from my GitHub — click any card to view the repo.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <GitHubPinnedRepos repos={pinnedRepos} />
          </ScrollReveal>
          <ScrollReveal delay={250}>
            <div className="text-center mt-10">
              <a
                href={ghStats.profileUrl || "https://github.com/nazsats"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                View all on GitHub →
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Contribution Heatmap + Activity Feed ─── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <div className="section-badge mb-4">Activity</div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                GitHub <span className="gradient-text">Activity</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Heatmap — takes 2/3 width */}
            <ScrollReveal className="lg:col-span-2" delay={100}>
              <div className="glass-card h-full">
                <h3 className="text-white font-bold mb-1 text-sm">Contribution Calendar</h3>
                <p className="text-slate-600 text-xs mb-6">
                  {contributions.total > 0
                    ? `${contributions.total.toLocaleString()} contributions in the last year`
                    : "Add GITHUB_TOKEN to show real data"}
                </p>
                <div className="heatmap-root relative overflow-x-auto">
                  <GitHubHeatmap weeks={contributions.weeks} total={contributions.total} />
                </div>
              </div>
            </ScrollReveal>

            {/* Feed — takes 1/3 width */}
            <ScrollReveal delay={200}>
              <div className="glass-card h-full">
                <div className="flex items-center gap-2 mb-5">
                  <h3 className="text-white font-bold text-sm">Live Activity</h3>
                  <div className="status-dot ml-auto" style={{ width: 6, height: 6 }} />
                </div>
                <GitHubFeed events={activity} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Why Nazsats ──────────────────────────── */}
      <section className="py-24 px-4 bg-dark-800/20">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="section-badge mb-5">Why Nazsats</div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
                Technology that <span className="gradient-text">works for you</span>
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto text-lg">
                AI precision meets blockchain security — scalable, future-proof products built for real impact.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3" /></svg>,
                title: "AI-Powered", desc: "State-of-the-art ML models trained on your data for measurable business results.", color: "text-purple-400", delay: 0,
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>,
                title: "Blockchain Secure", desc: "Smart contracts and dApps built for Ethereum, Solana, and every major blockchain network.", color: "text-cyan-400", delay: 100,
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z" /></svg>,
                title: "Data Science", desc: "Advanced analytics and insights that turn raw data into strategic decisions.", color: "text-purple-400", delay: 200,
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>,
                title: "AI + Blockchain", desc: "Next-generation platforms combining AI predictions with smart contract automation.", color: "text-cyan-400", delay: 300, soon: true,
              },
            ].map((f, i) => (
              <ScrollReveal key={i} delay={f.delay}>
                <div className="glass-card h-full">
                  <div className={`w-12 h-12 rounded-xl mb-5 flex items-center justify-center ${f.color} bg-white/5 animate-float`} style={{ animationDelay: `${i * 0.5}s` }}>
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
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Subscribe ────────────────────────────── */}
      <section className="py-28 px-4">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <div className="glass-card text-center animate-glow-pulse">
              <div className="section-badge mb-5 mx-auto w-fit">Stay Updated</div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                Join the <span className="gradient-text">launch</span>
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Get exclusive updates on AI &amp; blockchain insights directly in your inbox.
              </p>
              <SubscribeForm />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}