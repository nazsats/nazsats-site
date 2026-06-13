"use client";

import Link from "next/link";
import { useTransition } from "react";
import { togglePublish, deletePost } from "./actions";

export default function PostRowActions({
  id,
  slug,
  published,
}: {
  id: string;
  slug: string;
  published: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => startTransition(() => togglePublish(id, !published))}
        disabled={pending}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
          published
            ? "bg-green-500/15 text-green-400 hover:bg-green-500/25"
            : "bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25"
        }`}
      >
        {published ? "● Published" : "○ Draft"}
      </button>

      <Link
        href={`/admin/edit/${slug}`}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
      >
        Edit
      </Link>

      {published && (
        <Link
          href={`/blog/${slug}`}
          target="_blank"
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
        >
          View ↗
        </Link>
      )}

      <button
        onClick={() => {
          if (confirm("Delete this post permanently?")) {
            startTransition(() => deletePost(id));
          }
        }}
        disabled={pending}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
