import type { Metadata } from "next";
import Link from "next/link";

import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Nazrul Ansari — AI Engineer & Full-Stack Developer. 4+ years building production LLM applications, AI agents and scalable web platforms across HealthTech, FinTech, Real Estate and Web3.",
  alternates: { canonical: "/resume" },
};

const skills: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["Python", "TypeScript", "JavaScript (ES6+)", "SQL", "Solidity", "C/C++", "HTML5", "CSS3"],
  },
  {
    group: "AI",
    items: ["OpenAI API", "Claude API", "LangChain", "RAG", "AI Agents", "MCP", "Vector Databases", "Prompt Engineering"],
  },
  {
    group: "Backend",
    items: ["FastAPI", "Flask", "Node.js", "PostgreSQL", "Supabase", "Firebase", "REST APIs", "WebSockets"],
  },
  {
    group: "Frontend",
    items: ["React.js", "Next.js (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion", "Streamlit"],
  },
  {
    group: "Tools",
    items: ["Git", "GitHub", "Docker", "Vercel", "Replit", "Postman", "Figma"],
  },
];

const experience = [
  {
    role: "Freelance AI Engineer & Full-Stack Developer",
    org: "Nazsats",
    when: "2021 – Present",
    points: [
      "Delivered 20+ AI-powered applications, LLM solutions and full-stack platforms from architecture to deployment.",
      "Built secure FastAPI, Flask and Node.js APIs with authentication, RBAC and scalable backend architectures.",
      "Developed AI-powered data pipelines and intelligent search systems using real-estate datasets.",
      "Delivered blockchain-based applications and smart contract solutions for Web3 clients.",
    ],
  },
  {
    role: "Sports Analyst",
    org: "Hudl, Bangalore",
    when: "Jun 2021 – Oct 2021",
    points: [
      "Analysed American football games, tagged in-game events and produced performance datasets used for team and player evaluation.",
    ],
  },
  {
    role: "Content Writer",
    org: "Strux Inc, Mumbai",
    when: "Jun 2020 – Jun 2021",
    points: [
      "Wrote 50+ SEO-optimised articles across a wide range of client industries, adapting tone and depth to each brand's audience.",
      "Drove 20,000+ page views through clear, well-researched, beginner-friendly content.",
    ],
  },
];

const projects = [
  {
    name: "Dubai AI Broker Assistant",
    tagline: "Multi-tenant AI SaaS",
    url: "https://github.com/nazsats/dubai-real-estate",
    points: [
      "Built a multi-tenant AI real-estate platform using FastAPI, LangChain, Claude API and PostgreSQL.",
      "Developed a Next.js dashboard with analytics, maps and secure role-based access.",
    ],
  },
  {
    name: "BloodAI",
    tagline: "Medical Report Analyser — HealthTech AI",
    url: "https://github.com/nazsats/blood-report-analyzer",
    points: [
      "Built an AI-powered blood report analyzer using LLMs for medical insights.",
      "Developed a secure Next.js application with intelligent document analysis.",
    ],
  },
  {
    name: "Algo Trading Dashboard",
    tagline: "Autonomous Trading Platform",
    url: "https://github.com/nazsats/auto-profit",
    points: [
      "Built an AI-powered crypto trading platform using Python, FastAPI, Bybit API and Next.js for automated trade execution.",
      "Integrated LLM-driven market analysis, real-time WebSocket data, risk management and paper/live trading modes.",
    ],
  },
];

const education = [
  {
    degree: "M.Sc. Information Technology (AI specialisation)",
    school: "SVKM's UPG College",
    when: "2020 – 2022",
    note: "CGPA 9.93",
  },
  {
    degree: "B.Sc. Information Technology",
    school: "SVKM's UPG College",
    when: "2017 – 2020",
    note: "CGPA 7.7",
  },
];

const achievements = [
  "Raised $50,000+ through NFT launches and Web3 ecosystem incentives.",
  "Grew crypto communities to 30,000+ members across Twitter, Telegram and Discord.",
  "President, Rotaract Club of UPG (2019–2020) — led 10+ events with 500+ participants.",
  "NSS Volunteer (120+ hours) — blood donation and cancer awareness campaigns.",
  "Competition wins: Best Out of Waste (1st), Science & Innovation (2nd), Street Play (3rd).",
];

const languages = [
  "English (Fluent)",
  "Hindi (Fluent)",
  "Urdu (Intermediate)",
  "Marathi (Basics)",
  "Bengali (Basics)",
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/10 pb-2 mb-6">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function Resume() {
  return (
    <div className="resume-doc max-w-4xl mx-auto px-4 py-20">
      {/* Header */}
      <header className="mb-14">
        <div className="section-badge mb-6 animate-fade-in no-print">Resume</div>
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-3 animate-fade-in-up delay-100">
          Nazrul <span className="gradient-text-animated">Ansari</span>
        </h1>
        <p className="text-xl text-orange-400/90 font-semibold mb-6 animate-fade-in-up delay-200">
          AI Engineer &amp; Full-Stack Developer
        </p>

        {/* Contact: email and public profiles only. Phone number and street
            address stay off the public page — anyone who needs them can ask. */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500 mb-8 animate-fade-in-up delay-200">
          <a href="mailto:nazsats@gmail.com" className="hover:text-white transition-colors">
            nazsats@gmail.com
          </a>
          <a
            href="https://github.com/nazsats"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            github.com/nazsats
          </a>
          <a
            href="https://www.linkedin.com/in/naz-sats-026468408/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <span>Open to remote &amp; relocation</span>
        </div>

        <div className="flex flex-wrap gap-3 animate-fade-in-up delay-300 no-print">
          <PrintButton />
          <Link href="/contact" className="btn-secondary">
            Get in touch
          </Link>
        </div>
      </header>

      <Section title="Profile">
        <p className="text-slate-400 leading-relaxed">
          AI &amp; Full-Stack Engineer with <strong className="text-white">4+ years</strong> of
          experience building and deploying production-grade LLM applications, AI agents,
          intelligent automation systems and scalable web platforms. Experienced in designing
          end-to-end AI solutions using Python, FastAPI, LangChain, OpenAI, Claude and Next.js —
          from backend architecture to intuitive user interfaces. Built AI products across
          HealthTech, FinTech, Real Estate and SaaS, while also delivering secure Web3
          applications and blockchain solutions.
        </p>
      </Section>

      <Section title="Skills">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {skills.map((s) => (
            <div key={s.group}>
              <h3 className="text-white font-bold text-sm mb-3">{s.group}</h3>
              <div className="flex flex-wrap gap-1.5">
                {s.items.map((i) => (
                  <span
                    key={i}
                    className="text-xs text-slate-400 border border-white/5 bg-white/3 px-2.5 py-1 rounded-md"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Work Experience">
        <div className="space-y-8">
          {experience.map((e) => (
            <div key={e.role}>
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <h3 className="text-white font-bold">{e.role}</h3>
                <span className="text-xs text-slate-600 font-mono">{e.when}</span>
              </div>
              <p className="text-orange-400/80 text-sm font-semibold mb-3">{e.org}</p>
              <ul className="space-y-2">
                {e.points.map((p) => (
                  <li key={p} className="flex gap-3 text-sm text-slate-400 leading-relaxed">
                    <span className="text-orange-500/60 flex-shrink-0">▸</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Key Projects">
        <div className="space-y-8">
          {projects.map((p) => (
            <div key={p.name}>
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <h3 className="text-white font-bold">{p.name}</h3>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-600 font-mono hover:text-orange-400 transition-colors"
                >
                  {p.url.replace("https://", "")} ↗
                </a>
              </div>
              <p className="text-orange-400/80 text-sm font-semibold mb-3">{p.tagline}</p>
              <ul className="space-y-2">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-sm text-slate-400 leading-relaxed">
                    <span className="text-orange-500/60 flex-shrink-0">▸</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Education">
        <div className="space-y-5">
          {education.map((e) => (
            <div key={e.degree}>
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <h3 className="text-white font-bold text-sm">{e.degree}</h3>
                <span className="text-xs text-slate-600 font-mono">{e.when}</span>
              </div>
              <p className="text-slate-500 text-sm">
                {e.school} · <span className="text-slate-400">{e.note}</span>
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Achievements & Leadership">
        <ul className="space-y-2.5">
          {achievements.map((a) => (
            <li key={a} className="flex gap-3 text-sm text-slate-400 leading-relaxed">
              <span className="text-orange-500/60 flex-shrink-0">▸</span>
              {a}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Languages">
        <div className="flex flex-wrap gap-2">
          {languages.map((l) => (
            <span
              key={l}
              className="text-xs text-slate-400 border border-white/5 bg-white/3 px-3 py-1.5 rounded-md"
            >
              {l}
            </span>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <div className="glass-card text-center animate-glow-pulse no-print">
        <h2 className="text-2xl font-black text-white mb-3">
          Let&apos;s <span className="gradient-text">work together</span>
        </h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Open to AI engineering roles and freelance projects.
        </p>
        {/* No WhatsApp CTA here on purpose — the wa.me link carries the phone
            number in the markup, which defeats keeping it off this page. */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact" className="btn-primary">
            Send a message →
          </Link>
          <a href="mailto:nazsats@gmail.com" className="btn-secondary">
            Email me
          </a>
        </div>
      </div>
    </div>
  );
}
