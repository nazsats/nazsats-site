import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Nazrul Ansari — AI Engineer & Full-Stack Developer. 4+ years building production LLM applications, AI agents, algorithmic trading systems and Web3 platforms across HealthTech, FinTech, Real Estate and SaaS.",
  alternates: { canonical: "/resume" },
};

const skills: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["Python", "TypeScript", "JavaScript (ES6+)", "SQL", "Solidity", "C/C++", "HTML5", "CSS3"],
  },
  {
    group: "AI & LLMs",
    items: [
      "OpenAI API (GPT-4o, GPT-4o Vision)", "Claude API", "LangChain", "LangGraph", "RAG",
      "AI Agents", "MCP", "Vector Databases", "Tool-calling", "NL→SQL agents", "LLM guardrails",
      "Prompt engineering", "Document & image analysis", "Synthetic data generation",
    ],
  },
  {
    group: "Blockchain & Web3",
    items: [
      "Solidity", "Hardhat", "EIP authoring", "ERC-20/721/1155", "EVM (Ethereum, Polygon, Monad, Bera)",
      "Solana", "Aptos", "Sui", "Injective", "Bitcoin Ordinals", "Tokenomics", "DAO governance",
      "Wallet integration (MetaMask, Phantom)", "DeFi",
    ],
  },
  {
    group: "Algorithmic Trading",
    items: [
      "Bybit API", "ccxt", "Automated strategy execution", "Take-profit ladders & stop-loss",
      "Sentiment-driven signals", "Real-time WebSocket market data", "Risk & position sizing",
      "Paper/live trading",
    ],
  },
  {
    group: "Frontend & Mobile",
    items: [
      "React.js", "Next.js (App Router)", "TypeScript", "React Native (Expo)", "Tailwind CSS",
      "Framer Motion", "Recharts / Chart.js", "Streamlit", "Responsive & mobile-first",
    ],
  },
  {
    group: "Backend & APIs",
    items: [
      "FastAPI (REST + WebSocket)", "NestJS", "Flask", "Node.js", "Express.js",
      "Firebase (Auth, Firestore, Admin SDK)", "Supabase", "REST API design", "RBAC & JWT",
      "Rate limiting", "Input sanitisation", "Monorepo architecture",
    ],
  },
  {
    group: "Databases & Data",
    items: [
      "PostgreSQL", "Prisma", "SQLAlchemy", "Firestore", "MongoDB", "MySQL",
      "Schema design & indexing", "Zod validation", "Web scraping (BeautifulSoup)", "Pandas",
    ],
  },
  {
    group: "Tools",
    items: ["Git", "GitHub", "Docker", "Vercel", "Replit", "Postman", "Figma", "OpenCV", "Agile"],
  },
];

/** Filed against libraries I use in production — every item public and linkable. */
const openSource = [
  {
    repo: "qdrant/qdrant-client",
    title: "values_count filter matched points that no single value satisfied",
    merged: true,
    detail:
      "Found a parity bug between Qdrant's local mode and the real server: four range bounds were checked independently across all counts, so two different values could each satisfy half a range. Filed the issue, then the fix — one expression matching the server's semantics, with a congruence regression test running the same query against both clients. Merged +74 / −9; a second fix submitted for the same bug two days later was closed in favour of this one.",
    links: [
      { label: "Issue #1292", url: "https://github.com/qdrant/qdrant-client/issues/1292" },
      { label: "PR #1293 (merged)", url: "https://github.com/qdrant/qdrant-client/pull/1293" },
    ],
  },
  {
    repo: "run-llama/llama_index",
    title: "similarity_top_k=0 returned every embedding instead of none",
    detail:
      "Two retrieval functions tested the limit for truthiness, so an explicit 0 was indistinguishable from \"no limit\" and returned the entire index — the opposite of the request. A sibling function in the same file handled 0 correctly, so the three disagreed on one contract. Fixed both call sites with regression tests that fail on main and pin the default behaviour.",
    links: [
      { label: "Issue #22508", url: "https://github.com/run-llama/llama_index/issues/22508" },
      { label: "PR #22519", url: "https://github.com/run-llama/llama_index/pull/22519" },
    ],
  },
  {
    repo: "run-llama/llama_index",
    title: "run_async_tasks swallowed task exceptions when show_progress=True",
    detail:
      "A try/except intended as a compatibility check also wrapped task execution, so real failures were swallowed and replaced by an unrelated error that sent users debugging their event loop. Toggling a progress bar changed error semantics. Fixed with a parametrised regression test across both code paths.",
    links: [
      { label: "Issue #22493", url: "https://github.com/run-llama/llama_index/issues/22493" },
      { label: "PR #22520", url: "https://github.com/run-llama/llama_index/pull/22520" },
    ],
  },
];

const experience = [
  {
    role: "Lead AI Engineer & Full-Stack Developer",
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
    name: "Nazsats AI Builder",
    tagline: "One sentence to a complete storefront, in twenty seconds",
    stack: "Next.js 15 · NestJS 11 · PostgreSQL 16 · Prisma 7 · OpenAI structured outputs · Zod",
    url: "https://github.com/nazsats/dukkanify-ai-store-builder",
    points: [
      "Built an AI store builder that turns a one-sentence brief into a full storefront — brand, palette, typography, hero, categories, an eight-product catalogue in AED, and About/Contact pages — with live preview and inline editing.",
      "Designed the pipeline so the model returns a schema-validated blueprint rather than code: prompt → LLM → StoreBlueprint (Zod) → assembler → deterministic React renderer. Model output is data, never executable, so prompt injection cannot yield XSS.",
      "That boundary bought inline field-level editing, relational persistence, undo/redo as JSON snapshots, provider portability behind one adapter, and a test suite that runs with no API key — 83 tests passing.",
      "Shipped as a monorepo with shared domain packages, Google sign-in, a REST surface, and automated screenshot capture driving headless Chrome so the docs never drift from the product.",
    ],
  },
  {
    name: "BloodAI",
    tagline: "AI blood report analyser — web & mobile",
    stack: "Next.js 16 · TypeScript · GPT-4o Vision · React Native (Expo) · Firebase",
    url: "https://github.com/nazsats/blood-report-analyzer",
    points: [
      "Built a health platform that analyses PDF and image blood reports with GPT-4o Vision in under 30 seconds, extracting biomarkers and flagging out-of-range values.",
      "Generated personalised wellness protocols — meal plans, supplement stacks and lifestyle recommendations — from each user's blood chemistry, with health-score trend tracking across reports.",
      "Added an AI meal analyser giving photo-based calorie, macro and micronutrient breakdowns with per-user daily logs.",
      "Shipped a React Native companion app for scanning reports by camera, gallery or PDF, with marker-by-marker action plans and six health calculators.",
      "Secured the platform with Firebase Auth and granular Firestore security rules.",
    ],
  },
  {
    name: "Dubai AI Broker Assistant",
    tagline: "Multi-tenant AI SaaS for real-estate agencies",
    stack: "Python · FastAPI · SQLAlchemy · PostgreSQL · Claude API · LangChain · Next.js",
    url: "https://github.com/nazsats/dubai-real-estate",
    points: [
      "Built an agentic Claude backend with tool-calling: natural-language property search, lead-to-listing matching with reasoning, and ready-to-send pitches written in the client's own language.",
      "Designed an async FastAPI + SQLAlchemy backend on PostgreSQL with true multi-tenancy, JWT auth and role-based access.",
      "Developed a Next.js dashboard with a kanban pipeline, an interactive UAE market map and nine analytics chart types, fed by live listing ingestion and scraping pipelines.",
    ],
  },
  {
    name: "Copy for LLM",
    tagline: "VS Code extension",
    stack: "TypeScript · VS Code Extension API",
    url: "https://github.com/nazsats/copy-for-llm",
    points: [
      "Built a VS Code extension that copies a selection together with its file path and line range, formatted for pasting into an AI chat — removing a small friction repeated dozens of times a day.",
      "Handles multi-cursor selections as ordered blocks, falls back to the whole file when nothing is selected, and can dump every open tab as a single context block with a size warning.",
      "Zero runtime dependencies, an 11 KB package, and a tagged release workflow targeting both the VS Code Marketplace and Open VSX.",
    ],
  },
];

const otherWork = [
  {
    name: "CatCents",
    note: "GameFi & DAO platform on Monad testnet (Founder, 2023–present). Solidity contracts for minting, burning and reward boosting; React/Next.js dashboard for wallet connection, quests and governance. 30,000+ member community.",
  },
  {
    name: "Froggy Folios",
    note: "Bitcoin Ordinals NFT collection with a competitive mini-game platform, leaderboards and whitelist checker.",
  },
  {
    name: "Bao Bao · Skellies Lab · Test Tube · Smith NFT",
    note: "NFT mint dashboards and wallet integrations across Aptos, Bera and Injective, including utility NFTs with staking rewards.",
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
  "Grew and managed online communities of 200,000+ members across Telegram, Twitter and Discord.",
  "Drove 500,000+ weekly visits to a project website through community and marketing efforts.",
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
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
          Mohammad Nazrul <span className="gradient-text-animated">Ansari</span>
        </h1>
        <p className="text-xl text-orange-400/90 font-semibold mb-3 animate-fade-in-up delay-200">
          AI Engineer &amp; Full-Stack Developer
        </p>
        <p className="text-sm text-slate-500 mb-6 animate-fade-in-up delay-200">
          Mumbai, India · Dubai, UAE — available to interview in the UAE, immediate joiner
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
          algorithmic trading systems and scalable web platforms. Experienced in designing
          end-to-end AI solutions using Python, FastAPI, LangChain, OpenAI, Claude and Next.js —
          from backend architecture to intuitive user interfaces. Built products across HealthTech,
          FinTech, Real Estate and SaaS, while also delivering secure Web3 applications, smart
          contracts and token standards. Contributes bug reports and fixes to the open-source AI
          libraries I build on — currently qdrant-client and LlamaIndex.
        </p>
      </Section>

      {/* Open source first — it's third-party-verifiable, which nothing else here is. */}
      <Section title="Open Source Contributions">
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          <strong className="text-white">3 bugs found, reported and patched</strong> across two
          widely-used AI libraries — each with a reproduction, a minimal fix and regression
          tests that fail without it. <strong className="text-orange-400/90">One merged
          upstream into qdrant-client.</strong>
        </p>
        <div className="space-y-6">
          {openSource.map((c) => (
            <div key={c.title}>
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <h3 className="text-white font-bold text-sm">
                  {c.title}
                  {c.merged && (
                    <span className="ml-2 align-middle text-[10px] font-black uppercase tracking-wider text-green-400 border border-green-400/30 bg-green-400/10 px-2 py-0.5 rounded-full">
                      Merged
                    </span>
                  )}
                </h3>
                <span className="text-xs text-slate-600 font-mono">{c.repo}</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mt-1.5">{c.detail}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {c.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-orange-400/80 border border-orange-400/20 px-2 py-1 rounded-md hover:border-orange-400/50 transition-colors"
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-slate-600 text-xs mt-5 no-print">
          Write-up of the qdrant-client fix:{" "}
          <Link
            href="/blog/finding-a-filter-bug-in-qdrant-client"
            className="text-orange-400/80 hover:text-orange-400"
          >
            Two Values, Half a Range Each →
          </Link>
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
              <p className="text-orange-400/80 text-sm font-semibold">{p.tagline}</p>
              <p className="text-slate-600 text-xs font-mono mb-3">{p.stack}</p>
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

      <Section title="Other Work">
        <div className="space-y-4">
          {otherWork.map((o) => (
            <div key={o.name}>
              <h3 className="text-white font-bold text-sm">{o.name}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{o.note}</p>
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

      {/* CTA — no WhatsApp CTA here on purpose: wa.me links carry the phone
          number in the markup, which defeats keeping it off this page. */}
      <div className="glass-card text-center animate-glow-pulse no-print">
        <h2 className="text-2xl font-black text-white mb-3">
          Let&apos;s <span className="gradient-text">work together</span>
        </h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Open to AI engineering roles and freelance projects.
        </p>
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
