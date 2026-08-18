import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Nazrul Ansari — AI Engineer & Full-Stack Developer. 5+ years building production LLM applications, AI agents, distributed ML pipelines, algorithmic trading systems and Web3 platforms across HealthTech, FinTech, Real Estate and SaaS.",
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
    group: "Machine Learning & Data Engineering",
    items: [
      "Apache Spark (PySpark)", "LightGBM", "scikit-learn", "pandas", "NumPy", "MLflow",
      "statsmodels", "Parquet", "Feature engineering", "Leakage-safe temporal splits",
      "Probability calibration (isotonic)", "Cost-weighted decision thresholds",
      "Model evaluation (ROC AUC, Brier, ECE)", "Time-series forecasting (SARIMA)",
      "Drift detection (PSI)", "Matplotlib",
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
    group: "AI-Native Development",
    items: [
      "Cursor", "Claude Code", "GitHub Copilot", "Spec-driven development",
      "Agentic coding workflows", "AI code review",
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
    repo: "langchain-ai/langchain",
    title: "DeepSeek's prompt-cache savings were invisible in usage metadata",
    merged: true,
    detail:
      "ChatDeepSeek inherits usage parsing from BaseChatOpenAI, which reads cache reads from the nested prompt_tokens_details.cached_tokens. DeepSeek never populates that field — it reports context-cache usage as a top-level prompt_cache_hit_tokens — so cache_read came back absent and anyone measuring their prompt-cache savings saw a flat line that was the reporting, not the cache. Mapped the top-level count in both the streaming and non-streaming paths. The streaming mapping sits outside the choices branch because DeepSeek sends usage in a trailing chunk carrying no choices, so the obvious placement never runs — the part you only find by streaming a real response. Only hits are mapped: DeepSeek defines prompt_tokens as hits plus misses, so a miss is an ordinary uncached input token rather than a cache write, and reporting it as cache_creation would invent activity that never happened. An existing cache_read is left untouched so OpenAI-compatible gateways that report the nested form keep working. Eight unit tests; approved and merged on first review.",
    links: [
      { label: "Issue #39637", url: "https://github.com/langchain-ai/langchain/issues/39637" },
      { label: "PR #39668 (merged)", url: "https://github.com/langchain-ai/langchain/pull/39668" },
    ],
  },
  {
    repo: "chroma-core/chroma",
    title: "add() rejected None metadata that update() and upsert() both accept",
    detail:
      "None was legal everywhere it was declared — the Metadata type permits it, validate_metadata() allows it deliberately, and the error that validator raises names None as accepted — but add() alone failed underneath validation, in the storage layer, with a different error per client: TypeError on PersistentClient and a deserialisation error over HTTP, so `except TypeError` was correct locally and wrong against a server. The decisive detail was that upsert() on a brand-new id with the same input already worked, which proved transport and storage were fine and only add()'s path was not. Fixed on the add path alone: normalize_insert_record_set is shared with update and upsert, so stripping there would have broken None-deletes-key on update.",
    links: [
      { label: "PR #7581", url: "https://github.com/chroma-core/chroma/pull/7581" },
    ],
  },
  {
    repo: "qdrant/qdrant-client",
    title: "values_count filter matched points that no single value satisfied",
    merged: true,
    shipped: "v1.19.0",
    detail:
      "Found a parity bug between Qdrant's local mode and the real server: four range bounds were checked independently across all counts, so two different values could each satisfy half a range. Filed the issue, then the fix — one expression matching the server's semantics, with a congruence regression test running the same query against both clients. Merged +74 / −9 and shipped in qdrant-client v1.19.0; a second fix submitted for the same bug two days later was closed in favour of this one.",
    links: [
      { label: "Issue #1292", url: "https://github.com/qdrant/qdrant-client/issues/1292" },
      { label: "PR #1293 (merged)", url: "https://github.com/qdrant/qdrant-client/pull/1293" },
      { label: "Released in v1.19.0", url: "https://github.com/qdrant/qdrant-client/releases/tag/v1.19.0" },
    ],
  },
  {
    repo: "dottxt-ai/outlines",
    title: "Regex terms with a backreference failed to compile at all",
    detail:
      "to_regex wrapped every term in a capturing group. Groups are there to bind operators, but capturing renumbers the groups inside them — so a user pattern carrying a numbered backreference was rewritten to mean something else, and Regex(r\"(a)\\1\") raised \"cannot refer to an open group\" instead of matching. Named backreferences were unaffected, so the behaviour depended on which group syntax you happened to pick. Fixed by making every wrapper non-capturing, with a regression test using re.fullmatch as an independent oracle.",
    links: [
      { label: "PR #1993", url: "https://github.com/dottxt-ai/outlines/pull/1993" },
    ],
  },
  {
    repo: "qdrant/qdrant-client",
    title: "Two filter conditions returned the wrong points in local mode",
    merged: true,
    detail:
      "Found by running identical filters against local mode and a real Qdrant 1.19.0 server and diffing the matched ids. MatchExcept treated an explicit null as a value that differs from everything, so it matched points the server excluded — it is the only negated match condition, and the only one without a type guard. Separately, an empty `should` matched nothing rather than everything, because any([]) is False while the sibling must/must_not clauses use all() and are vacuously true. Both fixed with congruence tests that fail without the change.",
    links: [
      { label: "PR #1333 (merged)", url: "https://github.com/qdrant/qdrant-client/pull/1333" },
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

type Project = {
  name: string;
  tagline: string;
  stack: string;
  url: string;
  /** Deployed demo, where one is public. Recruiters click this before the repo. */
  live?: string;
  points: string[];
};

const projects: Project[] = [
  {
    name: "Flight Delay Intelligence",
    tagline: "Distributed ML over 1.6M flights, built for decisions rather than scores",
    stack: "PySpark · LightGBM · MLflow · scikit-learn · FastAPI · Streamlit · LangGraph · Docker",
    url: "https://github.com/nazsats/flight-delay-intelligence",
    points: [
      "Analysed 319,395 delayed US flights and found the headline result contradicts the assumption: weather causes 7% of delay minutes, while 39.8% come from an aircraft that was already late earlier in its rotation. Security, the thing passengers queue longest for, is 0.2%.",
      "Engineered features on Apache Spark in a container — window functions, broadcast joins, partitioned Parquet — with every rolling aggregate shifted one day back and a strictly chronological split, so a flight's inputs can never contain its own outcome.",
      "Trained and versioned a LightGBM classifier in MLflow, then optimised for decision quality rather than leaderboard position: isotonic calibration cut expected calibration error 2.5×, and the alert threshold is derived from the relative cost of a missed delay versus a false alarm rather than the 0.5 default, lifting recall on genuine delays to 77%.",
      "Kept the 0.672 AUC deliberately honest — the model predicts before pushback, so it never sees departure delay. Shipped PSI drift detection, SARIMA demand forecasting, and a LangGraph agent that answers questions in English with every figure returned from code and an explicit refusal when the data cannot support one.",
    ],
  },
  {
    name: "Nazsats AI Store Builder",
    tagline: "One sentence to a complete storefront, in twenty seconds",
    stack: "Next.js 15 · NestJS 11 · PostgreSQL 16 · Prisma 7 · OpenAI structured outputs · Zod",
    url: "https://github.com/nazsats/nazsats-ai-store-builder",
    live: "https://nazsats-ai-store-builder-web.vercel.app/",
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
    live: "https://blood-report-analyzer-phi.vercel.app/",
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
    name: "nazsats.com",
    note: "This site — Next.js 16 with a Supabase-auth admin CMS, one-click AI draft generation, GitHub REST + GraphQL integrations and a hardened security layer (RLS, XSS sanitisation, CSP). Includes a public dashboard tracking my coding hours, languages and streaks from real editor telemetry, synced nightly.",
  },
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
  "Delivered a guest lecture on AI to students at L. S. Raheja College, Mumbai (2026).",
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
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 border-b border-slate-900/[0.10] pb-2 mb-6">
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
        <h1 className="text-4xl md:text-6xl font-black text-slate-200 leading-tight mb-3 animate-fade-in-up delay-100">
          Mohammad Nazrul <span className="gradient-text-animated">Ansari</span>
        </h1>
        <p className="text-xl text-orange-400/90 font-semibold mb-3 animate-fade-in-up delay-200">
          AI Engineer &amp; Full-Stack Developer
        </p>
        {/* "Interview in the UAE" and "immediate joiner" contradicted each
            other; split into the two facts they were trying to say. */}
        <p className="text-sm text-slate-500 mb-6 animate-fade-in-up delay-200">
          Mumbai, India · Dubai, UAE — available for interviews now (remote/video); can relocate
          to the UAE within 15 days
        </p>

        {/* Contact: email and public profiles only. Phone number and street
            address stay off the public page — anyone who needs them can ask. */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500 mb-8 animate-fade-in-up delay-200">
          <a href="mailto:nazsats@gmail.com" className="hover:text-slate-200 transition-colors">
            nazsats@gmail.com
          </a>
          <a
            href="https://github.com/nazsats"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-200 transition-colors"
          >
            github.com/nazsats
          </a>
          <a
            href="https://www.linkedin.com/in/naz-sats-026468408/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-200 transition-colors"
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
          AI &amp; Full-Stack Engineer with <strong className="text-slate-200">5+ years</strong> of
          experience building and deploying production-grade LLM applications, AI agents,
          algorithmic trading systems and scalable web platforms. Experienced in designing
          end-to-end AI solutions using Python, FastAPI, LangChain, LangGraph, OpenAI, Claude and
          Next.js — from backend architecture to intuitive user interfaces. Also builds classical
          machine learning and data systems end to end: distributed PySpark feature pipelines over
          millions of records, gradient-boosted models tracked in MLflow, probability calibration,
          cost-weighted decision thresholds and drift monitoring. Built products across HealthTech,
          FinTech, Real Estate and SaaS, while also delivering secure Web3 applications, smart
          contracts and token standards. Contributes bug reports and fixes to the open-source AI
          libraries I build on — currently qdrant-client, LlamaIndex and Outlines.
        </p>
      </Section>

      {/* Open source first — it's third-party-verifiable, which nothing else here is. */}
      <Section title="Open Source Contributions">
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          <strong className="text-slate-200">6 bugs found, reported and patched</strong> across three
          widely-used AI libraries — each with a reproduction, a minimal fix and regression
          tests that fail without it. <strong className="text-orange-400/90">Two merged upstream into qdrant-client,
          one of them shipped in v1.19.0</strong>; the rest are open pull requests.
        </p>
        <div className="space-y-6">
          {openSource.map((c) => (
            <div key={c.title}>
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <h3 className="text-slate-200 font-bold text-sm">
                  {c.title}
                  {c.merged && (
                    <span className="ml-2 align-middle text-[10px] font-black uppercase tracking-wider text-green-400 border border-green-400/30 bg-green-400/10 px-2 py-0.5 rounded-full">
                      {c.shipped ? `Shipped ${c.shipped}` : "Merged"}
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
              <h3 className="text-slate-200 font-bold text-sm mb-3">{s.group}</h3>
              <div className="flex flex-wrap gap-1.5">
                {s.items.map((i) => (
                  <span
                    key={i}
                    className="text-xs text-slate-400 border border-slate-900/[0.07] bg-slate-900/[0.025] px-2.5 py-1 rounded-md"
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
                <h3 className="text-slate-200 font-bold">{p.name}</h3>
                <span className="flex items-center gap-3 flex-wrap">
                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-orange-400/80 border border-orange-400/20 px-2 py-1 rounded-md hover:border-orange-400/50 transition-colors"
                    >
                      Live demo ↗
                    </a>
                  )}
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-600 font-mono hover:text-orange-400 transition-colors"
                  >
                    {p.url.replace("https://", "")} ↗
                  </a>
                </span>
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
              <h3 className="text-slate-200 font-bold text-sm">{o.name}</h3>
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
                <h3 className="text-slate-200 font-bold">{e.role}</h3>
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
                <h3 className="text-slate-200 font-bold text-sm">{e.degree}</h3>
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
              className="text-xs text-slate-400 border border-slate-900/[0.07] bg-slate-900/[0.025] px-3 py-1.5 rounded-md"
            >
              {l}
            </span>
          ))}
        </div>
      </Section>

      {/* CTA — no WhatsApp CTA here on purpose: wa.me links carry the phone
          number in the markup, which defeats keeping it off this page. */}
      <div className="glass-card text-center animate-glow-pulse no-print">
        <h2 className="text-2xl font-black text-slate-200 mb-3">
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
