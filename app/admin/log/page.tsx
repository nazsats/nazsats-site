import Link from "next/link";
import { getActivity, getActivityStats, KIND_META, formatDuration } from "../../../lib/activity";
import { addEntry } from "./actions";
import EntryRowActions from "./EntryRowActions";
import AdminNav from "../AdminNav";
import { signOut } from "../actions";

export const dynamic = "force-dynamic";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const KIND_OPTIONS = [
  { value: "project", label: "Shipped something" },
  { value: "social", label: "Social post" },
  { value: "client", label: "Client work" },
  { value: "pr", label: "Pull request" },
  { value: "repo", label: "New repo" },
  { value: "release", label: "Release" },
  { value: "post", label: "Blog post" },
  { value: "learning", label: "Learning" },
  { value: "coding", label: "Coding session" },
];

export default async function ActivityLog({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; kind?: string }>;
}) {
  const { filter, kind } = await searchParams;
  const unreviewedOnly = filter === "review";

  const [entries, stats] = await Promise.all([
    getActivity({ limit: 200, kind, unreviewedOnly }),
    getActivityStats(),
  ]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <AdminNav signOut={signOut} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white">
          Track <span className="gradient-text">Record</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Everything you build, in one place. Flag the good ones for the CV.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Entries", value: stats.total },
          { label: "This week", value: stats.weekEntries },
          { label: "Coding (7d)", value: `${stats.weekCodingHours}h` },
          { label: "On the CV", value: stats.onResume },
        ].map((s) => (
          <div key={s.label} className="glass-card !p-4">
            <div className="text-2xl font-black gradient-text">{s.value}</div>
            <div className="text-xs text-slate-600 uppercase tracking-widest mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick capture */}
      <div className="glass-card mb-6">
        <h2 className="text-lg font-bold text-white mb-1">Log something</h2>
        <p className="text-slate-500 text-sm mb-4">
          Title and a link is enough — everything else is optional.
        </p>
        <form action={addEntry} className="space-y-3">
          <div className="flex gap-3 flex-wrap">
            <input
              name="title"
              required
              placeholder="What did you do?"
              className="flex-1 min-w-[260px] rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500/50"
            />
            <select
              name="kind"
              defaultValue="project"
              className="rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-white text-sm outline-none focus:border-orange-500/50"
            >
              {KIND_OPTIONS.map((k) => (
                <option key={k.value} value={k.value} className="bg-dark-900">
                  {k.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 flex-wrap">
            <input
              name="url"
              type="url"
              placeholder="Link (LinkedIn, X, PR, deploy…)"
              className="flex-1 min-w-[260px] rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500/50"
            />
            <input
              name="tags"
              placeholder="tags, comma, separated"
              className="flex-1 min-w-[180px] rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500/50"
            />
            <input
              name="occurred_at"
              type="date"
              defaultValue={today}
              className="rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-slate-300 text-sm outline-none focus:border-orange-500/50"
            />
          </div>

          <textarea
            name="body"
            rows={2}
            placeholder="Notes — what it was, why it mattered (optional)"
            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500/50 resize-none"
          />

          <div className="flex justify-end">
            <button type="submit" className="btn-primary">
              Log it →
            </button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        <Link
          href="/admin/log"
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            !filter && !kind
              ? "bg-orange-500/15 text-orange-400"
              : "bg-white/5 text-slate-400 hover:bg-white/10"
          }`}
        >
          All
        </Link>
        <Link
          href="/admin/log?filter=review"
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            unreviewedOnly
              ? "bg-orange-500/15 text-orange-400"
              : "bg-white/5 text-slate-400 hover:bg-white/10"
          }`}
        >
          Needs review{stats.unreviewed > 0 ? ` (${stats.unreviewed})` : ""}
        </Link>
        {Object.entries(KIND_META).map(([k, meta]) => (
          <Link
            key={k}
            href={`/admin/log?kind=${k}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              kind === k
                ? "bg-orange-500/15 text-orange-400"
                : "bg-white/5 text-slate-500 hover:bg-white/10"
            }`}
          >
            {meta.label}
          </Link>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {entries.length === 0 && (
          <p className="text-slate-500 text-sm text-center py-12">
            {unreviewedOnly
              ? "Nothing left to review. "
              : "Nothing logged yet. Add something above, or wait for the nightly sync."}
          </p>
        )}

        {entries.map((e) => {
          const meta = KIND_META[e.kind] ?? KIND_META.project;
          const seconds = typeof e.metrics?.seconds === "number" ? e.metrics.seconds : null;

          return (
            <div
              key={e.id}
              className={`glass-card flex items-start justify-between gap-4 flex-wrap ${
                e.resume_worthy ? "border-orange-500/25" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap text-xs font-mono mb-1.5">
                  <span className={`px-2 py-0.5 rounded-full border ${meta.color}`}>
                    {meta.label}
                  </span>
                  <span className="text-slate-600">{formatDate(e.occurred_at)}</span>
                  {e.source !== "manual" && (
                    <span className="text-slate-700">via {e.source}</span>
                  )}
                  {seconds !== null && (
                    <span className="text-slate-500">{formatDuration(seconds)}</span>
                  )}
                  {!e.reviewed && (
                    <span className="text-yellow-500/70">• unreviewed</span>
                  )}
                </div>

                <h3 className="text-white font-bold leading-tight">
                  {e.url ? (
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-orange-400 transition-colors"
                    >
                      {e.title} ↗
                    </a>
                  ) : (
                    e.title
                  )}
                </h3>

                {e.body && (
                  <p className="text-slate-500 text-sm mt-1 line-clamp-2">{e.body}</p>
                )}

                {e.resume_bullet && (
                  <p className="text-orange-400/80 text-xs mt-2 leading-relaxed">
                    ★ {e.resume_bullet}
                  </p>
                )}

                {e.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {e.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs text-slate-600 border border-white/5 px-2 py-0.5 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <EntryRowActions
                id={e.id}
                resumeWorthy={e.resume_worthy}
                reviewed={e.reviewed}
                bullet={e.resume_bullet}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
