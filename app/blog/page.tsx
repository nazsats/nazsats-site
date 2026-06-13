import Link from "next/link";
import { getPublishedPosts } from "../../lib/posts";
import Tilt from "../../components/Tilt";

export const dynamic = "force-dynamic";

const topics = [
  {
    icon: "🤖",
    title: "AI & Machine Learning",
    desc: "Practical breakdowns of ML models, real-world use cases, and how to apply AI in your business.",
  },
  {
    icon: "⛓️",
    title: "Blockchain & Web3",
    desc: "Deep dives into smart contracts, DeFi protocols, NFT technology, and decentralized infrastructure.",
  },
  {
    icon: "📊",
    title: "Data Science",
    desc: "Tutorials, insights, and techniques for turning messy data into clear, actionable intelligence.",
  },
  {
    icon: "🔮",
    title: "AI + Crypto Fusion",
    desc: "Exploring the emerging space where AI meets blockchain — predictive markets, AI agents in DeFi, and more.",
  },
];

function formatDate(date: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function Blog() {
  const posts = await getPublishedPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="text-center mb-20">
        <div className="section-badge mb-6 animate-fade-in">Knowledge Hub</div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 animate-fade-in-up delay-100 leading-tight">
          Nazsats <span className="gradient-text-animated">Blog</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed animate-fade-in-up delay-200">
          Insights, tutorials, and deep dives on AI, blockchain, data science, and the technologies shaping tomorrow.
        </p>
      </div>

      {posts.length > 0 ? (
        /* Published posts */
        <div className="max-w-4xl mx-auto mb-20 grid grid-cols-1 gap-6">
          {posts.map((post, i) => (
            <Tilt key={post.slug} max={6}>
            <Link
              href={`/blog/${post.slug}`}
              className="glass-card block h-full animate-fade-in-up"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-slate-600 font-mono">
                <span className="text-purple-400">{formatDate(post.created_at)}</span>
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-2xl font-black text-white mb-2 leading-tight">{post.title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{post.description}</p>
              <span className="text-sm font-semibold gradient-text">Read article →</span>
            </Link>
            </Tilt>
          ))}
        </div>
      ) : (
        /* Coming soon card (shown when no posts are published yet) */
        <div className="max-w-3xl mx-auto mb-20">
          <div className="terminal-card scan-container animate-fade-in-up delay-200">
            <div className="flex items-center gap-1.5 px-5 py-3.5 border-b border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              <span className="ml-2 text-xs text-slate-600">blog.nazsats.com</span>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="status-dot" style={{ width: 6, height: 6 }} />
                <span className="text-xs text-slate-600">writing...</span>
              </div>
            </div>
            <div className="px-6 py-8 text-center">
              <p className="text-4xl mb-4">✍️</p>
              <h2 className="text-2xl font-black text-white mb-3">
                Coming <span className="gradient-text">Soon</span>
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
                Our writers are crafting the first batch of articles. Expect in-depth content on AI trends,
                blockchain innovation, and practical tech guides.
              </p>
              <div className="mt-6 font-mono text-xs text-slate-600 space-y-1">
                <p><span className="text-purple-400">drafting</span> — &ldquo;Building Your First ML Model in 2025&rdquo;</p>
                <p><span className="text-cyan-400">drafting</span> — &ldquo;Smart Contracts Explained Simply&rdquo;</p>
                <p><span className="text-slate-600">queued  </span> — &ldquo;AI Agents in DeFi: What You Need to Know&rdquo;</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Topics preview */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white animate-fade-in-up">
            Topics we&apos;ll <span className="gradient-text">cover</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {topics.map((t, i) => (
            <div
              key={i}
              className="glass-card flex gap-5 items-start animate-fade-in-up"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              <div className="text-3xl animate-float flex-shrink-0" style={{ animationDelay: `${i * 0.5}s` }}>
                {t.icon}
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">{t.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="glass-card text-center animate-glow-pulse max-w-2xl mx-auto">
        <h2 className="text-2xl font-black text-white mb-3">
          Get notified <span className="gradient-text">first</span>
        </h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Subscribe to get our first articles straight to your inbox — before anyone else.
        </p>
        <Link href="/#subscribe" className="btn-primary">
          Subscribe for Updates →
        </Link>
      </div>
    </div>
  );
}
