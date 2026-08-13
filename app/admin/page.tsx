import Link from "next/link";
import { getAllPosts } from "../../lib/posts";
import { generateDraftAction, signOut } from "./actions";
import PostRowActions from "./PostRowActions";
import AdminNav from "./AdminNav";

export const dynamic = "force-dynamic";

function formatDate(date: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminDashboard() {
  const posts = await getAllPosts();
  const drafts = posts.filter((p) => !p.published).length;
  const live = posts.filter((p) => p.published).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <AdminNav signOut={signOut} />

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-200">
          Blog <span className="gradient-text">Admin</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {live} published · {drafts} drafts
        </p>
      </div>

      {/* AI generate */}
      <div className="glass-card mb-6">
        <h2 className="text-lg font-bold text-slate-200 mb-1">✨ Generate a draft with AI</h2>
        <p className="text-slate-500 text-sm mb-4">
          Enter a topic. The AI writes a full post, saved as a hidden draft for you to review.
        </p>
        <form action={generateDraftAction} className="flex gap-3 flex-wrap">
          <input
            name="topic"
            required
            placeholder="e.g. How zero-knowledge proofs work"
            className="flex-1 min-w-[240px] rounded-lg bg-slate-900/[0.035] border border-slate-900/[0.10] px-4 py-2.5 text-slate-200 text-sm outline-none focus:border-orange-500/50"
          />
          <button type="submit" className="btn-primary">
            Generate draft →
          </button>
        </form>
      </div>

      {/* New post (manual) */}
      <div className="flex justify-end mb-6">
        <Link
          href="/admin/edit/new"
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-900/[0.035] text-slate-300 hover:bg-slate-900/[0.06] transition-colors"
        >
          + Write a post manually
        </Link>
      </div>

      {/* Posts list */}
      <div className="space-y-3">
        {posts.length === 0 && (
          <p className="text-slate-500 text-sm text-center py-12">
            No posts yet. Generate one above to get started.
          </p>
        )}
        {posts.map((post) => (
          <div
            key={post.id}
            className="glass-card flex items-start justify-between gap-4 flex-wrap"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-600 font-mono mb-1">
                <span>{formatDate(post.updated_at)}</span>
                {post.tags.slice(0, 3).map((t) => (
                  <span key={t} className="text-slate-500">
                    #{t}
                  </span>
                ))}
              </div>
              <h3 className="text-slate-200 font-bold leading-tight">{post.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-1">{post.description}</p>
            </div>
            <PostRowActions id={post.id} slug={post.slug} published={post.published} />
          </div>
        ))}
      </div>
    </div>
  );
}
