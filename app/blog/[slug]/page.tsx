import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug } from "../../../lib/posts";

// ISR: each post is generated on first request, then cached and refreshed at
// most every 5 minutes. Edits/unpublish trigger revalidatePath in admin actions.
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found — Nazsats Blog" };
  return {
    title: `${post.title} — Nazsats Blog`,
    description: post.description,
    openGraph: { title: post.title, description: post.description },
  };
}

function formatDate(date: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 py-20">
      <Link href="/blog" className="text-sm text-slate-500 hover:text-slate-200 transition-colors">
        ← Back to blog
      </Link>

      <header className="mt-8 mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-slate-600 font-mono">
          <span className="text-purple-400">{formatDate(post.created_at)}</span>
          <span>·</span>
          <span>{post.author}</span>
          {post.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-900/[0.035] text-slate-400">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-200 leading-tight mb-4">
          {post.title}
        </h1>
        <p className="text-slate-500 text-lg leading-relaxed">{post.description}</p>
      </header>

      <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.html }} />

      <div className="mt-16 pt-8 border-t border-slate-900/[0.07] text-center">
        <Link href="/blog" className="btn-primary">
          ← More articles
        </Link>
      </div>
    </article>
  );
}
