import Link from "next/link";
import type { Metadata } from "next";
import Tilt from "../../components/Tilt";
import { packages, whatsappLink } from "../../lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Machine learning, data science, crypto software, and dApp development services by Nazsats.",
  alternates: { canonical: "/services" },
};

const services = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
    title: "AI Assistants & Chatbots",
    desc: "Assistants that answer from your own data and take real actions — booking, lookups, escalation — instead of guessing. Deployed on your site, WhatsApp or internal tools.",
    tags: ["Customer support", "Lead capture", "WhatsApp", "Tool-calling"],
    status: "available",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 013.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75M11.25 11.25l3 3m0 0l3-3m-3 3v-6" />
      </svg>
    ),
    title: "Document & Data AI",
    desc: "Turn PDFs, forms, invoices and reports into structured data your systems can use. Extraction validated against a schema, so what reaches your database is checked, not hallucinated.",
    tags: ["Extraction", "OCR", "Validation", "RAG"],
    status: "available",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: "AI Automation",
    desc: "Quietly remove the repetitive work: triaging inbound messages, drafting replies, enriching records, summarising long threads. Wired into the tools your team already uses.",
    tags: ["Workflows", "Integrations", "Summarisation", "Enrichment"],
    status: "available",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    title: "Custom AI Applications",
    desc: "Full products, not demos. Multi-tenant SaaS, dashboards and internal tools with auth, roles, rate limiting and cost controls — built to survive real users.",
    tags: ["FastAPI", "Next.js", "Postgres", "Multi-tenant"],
    status: "available",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
    title: "Machine Learning & Data",
    desc: "Predictive models, search and analytics pipelines over your own data, with dashboards that make the output usable by people who are not data scientists.",
    tags: ["Prediction", "Search", "Pipelines", "Dashboards"],
    status: "available",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: "AI Code & Systems Review",
    desc: "An outside read of an AI system that is already running — prompt and retrieval quality, failure modes, cost, and the correctness bugs that silently return wrong answers.",
    tags: ["Audit", "RAG quality", "Cost", "Reliability"],
    status: "available",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
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
          AI systems for businesses — assistants, document processing and automation, built to run in production rather than demo well.
        </p>
      </div>

      {/* Service cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {services.map((s, i) => (
          <Tilt key={i} max={8}>
          <div
            className={`glass-card flex flex-col h-full animate-fade-in-up ${s.status === "soon" ? "glass-card-cyan" : ""}`}
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
          </Tilt>
        ))}
      </div>

      {/* Pricing / Packages */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <div className="section-badge mb-4">Packages</div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Starting points — every project gets a tailored quote. Not sure which fits? Just message me.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {packages.map((pkg) => (
            <Tilt key={pkg.name} max={6}>
              <div
                className={`glass-card flex flex-col h-full ${
                  pkg.highlight ? "border-orange-500/40 animate-glow-pulse" : ""
                }`}
              >
                {pkg.highlight && (
                  <span className="self-start text-xs font-bold text-orange-400 border border-orange-400/30 bg-orange-400/10 px-3 py-1 rounded-full mb-4">
                    Most popular
                  </span>
                )}
                <h3 className="text-xl font-black text-white">{pkg.name}</h3>
                <div className="text-3xl font-black gradient-text my-3">{pkg.price}</div>
                <p className="text-slate-500 text-sm leading-relaxed mb-5">{pkg.blurb}</p>

                <ul className="space-y-2.5 mb-7 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-400">
                      <svg className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={whatsappLink(`Hi Nazsats! I'm interested in the ${pkg.name} package.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={pkg.highlight ? "btn-primary w-full justify-center" : "btn-secondary w-full justify-center"}
                >
                  Book a call →
                </a>
              </div>
            </Tilt>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="glass-card text-center animate-glow-pulse max-w-2xl mx-auto">
        <h2 className="text-2xl font-black text-white mb-3">
          Need a custom <span className="gradient-text">solution?</span>
        </h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Every project is different. Tell me what you&apos;re building and I&apos;ll design the right approach for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Chat on WhatsApp →
          </a>
          <Link href="/contact" className="btn-secondary">
            Send a message
          </Link>
        </div>
      </div>
    </div>
  );
}