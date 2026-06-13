import Link from "next/link";
import { notFound } from "next/navigation";
import { getAnyPostBySlug } from "../../../../lib/posts";
import { savePost } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isNew = slug === "new";
  const post = isNew ? null : await getAnyPostBySlug(slug);
  if (!isNew && !post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/admin" className="text-sm text-slate-500 hover:text-white transition-colors">
        ← Back to admin
      </Link>

      <h1 className="text-3xl font-black text-white mt-6 mb-8">
        {isNew ? "New" : "Edit"} <span className="gradient-text">post</span>
      </h1>

      <form action={savePost} className="space-y-5">
        <input type="hidden" name="id" value={post?.id ?? ""} />

        <div>
          <label className="block text-xs text-slate-500 mb-1">Title</label>
          <input
            name="title"
            required
            defaultValue={post?.title ?? ""}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500/50"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Description</label>
          <input
            name="description"
            defaultValue={post?.description ?? ""}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500/50"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Tags (comma-separated)</label>
          <input
            name="tags"
            defaultValue={post?.tags?.join(", ") ?? ""}
            placeholder="AI, Blockchain, Tutorial"
            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500/50"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Body (Markdown)</label>
          <textarea
            name="body"
            rows={20}
            defaultValue={post?.body ?? ""}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white text-sm font-mono leading-relaxed outline-none focus:border-orange-500/50"
          />
        </div>

        <label className="flex items-center gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            name="published"
            defaultChecked={post?.published ?? false}
            className="w-4 h-4 accent-orange-500"
          />
          Published (visible on the site)
        </label>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary">
            Save
          </button>
          <Link
            href="/admin"
            className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
