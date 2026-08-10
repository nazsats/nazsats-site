import { getServiceClient } from "./supabase/service";

export type ActivityKind =
  | "pr"
  | "repo"
  | "release"
  | "post"
  | "social"
  | "project"
  | "client"
  | "coding"
  | "learning";

export type ActivitySource = "github" | "wakatime" | "blog" | "manual";

export type Activity = {
  id: string;
  kind: ActivityKind;
  source: ActivitySource;
  title: string;
  body: string;
  url: string | null;
  tags: string[];
  metrics: Record<string, unknown>;
  occurred_at: string;
  resume_worthy: boolean;
  resume_bullet: string | null;
  reviewed: boolean;
  external_id: string | null;
  created_at: string;
};

export type NewActivity = {
  kind: ActivityKind;
  source?: ActivitySource;
  title: string;
  body?: string;
  url?: string | null;
  tags?: string[];
  metrics?: Record<string, unknown>;
  occurred_at?: string;
  external_id?: string | null;
};

/** Human labels + accent colour per kind, used by the admin timeline. */
export const KIND_META: Record<ActivityKind, { label: string; color: string }> = {
  pr:       { label: "Pull request", color: "text-purple-400 border-purple-400/25 bg-purple-400/5" },
  repo:     { label: "Repository",   color: "text-cyan-400 border-cyan-400/25 bg-cyan-400/5" },
  release:  { label: "Release",      color: "text-cyan-400 border-cyan-400/25 bg-cyan-400/5" },
  post:     { label: "Blog post",    color: "text-orange-400 border-orange-400/25 bg-orange-400/5" },
  social:   { label: "Social",       color: "text-blue-400 border-blue-400/25 bg-blue-400/5" },
  project:  { label: "Project",      color: "text-green-400 border-green-400/20 bg-green-400/5" },
  client:   { label: "Client work",  color: "text-green-400 border-green-400/20 bg-green-400/5" },
  coding:   { label: "Coding time",  color: "text-slate-400 border-white/10 bg-white/5" },
  learning: { label: "Learning",     color: "text-yellow-400 border-yellow-400/25 bg-yellow-400/5" },
};

/**
 * Insert one entry. Rows carrying an external_id are upserted so a cron job can
 * re-run over the same window without creating duplicates.
 */
export async function logActivity(entry: NewActivity) {
  const supabase = getServiceClient();
  const row = {
    kind: entry.kind,
    source: entry.source ?? "manual",
    title: entry.title,
    body: entry.body ?? "",
    url: entry.url ?? null,
    tags: entry.tags ?? [],
    metrics: entry.metrics ?? {},
    occurred_at: entry.occurred_at ?? new Date().toISOString(),
    external_id: entry.external_id ?? null,
  };

  if (row.external_id) {
    const { error } = await supabase
      .from("activity")
      .upsert(row, { onConflict: "external_id" });
    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await supabase.from("activity").insert(row);
  if (error) throw new Error(error.message);
}

function toRow(e: NewActivity) {
  return {
    kind: e.kind,
    source: e.source ?? "manual",
    title: e.title,
    body: e.body ?? "",
    url: e.url ?? null,
    tags: e.tags ?? [],
    metrics: e.metrics ?? {},
    occurred_at: e.occurred_at ?? new Date().toISOString(),
    external_id: e.external_id ?? null,
  };
}

/** Insert many at once, skipping any external_id already stored. */
export async function logActivityBatch(entries: NewActivity[]): Promise<number> {
  if (entries.length === 0) return 0;
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("activity")
    .upsert(entries.map(toRow), { onConflict: "external_id", ignoreDuplicates: true })
    .select("id");
  if (error) throw new Error(error.message);
  return data?.length ?? 0;
}

/**
 * Like logActivityBatch, but existing rows are overwritten rather than kept.
 *
 * Use this for sources that re-report a *changing* value for the same key —
 * coding time for today grows all day, so the row written at 02:30 is stale by
 * evening. logActivityBatch would keep the stale row forever.
 */
export async function upsertActivityBatch(entries: NewActivity[]): Promise<number> {
  if (entries.length === 0) return 0;
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("activity")
    .upsert(entries.map(toRow), { onConflict: "external_id" })
    .select("id");
  if (error) throw new Error(error.message);
  return data?.length ?? 0;
}

/** Newest first. `kind` and `unreviewedOnly` narrow the timeline. */
export async function getActivity(opts: {
  limit?: number;
  kind?: string;
  unreviewedOnly?: boolean;
} = {}): Promise<Activity[]> {
  const supabase = getServiceClient();
  let query = supabase
    .from("activity")
    .select("*")
    .order("occurred_at", { ascending: false })
    .limit(opts.limit ?? 100);

  if (opts.kind) query = query.eq("kind", opts.kind);
  if (opts.unreviewedOnly) query = query.eq("reviewed", false);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Activity[];
}

/** Counts for the dashboard header. */
export async function getActivityStats() {
  const supabase = getServiceClient();

  const since = new Date();
  since.setDate(since.getDate() - 7);

  const [total, unreviewed, onResume, week] = await Promise.all([
    supabase.from("activity").select("id", { count: "exact", head: true }),
    supabase.from("activity").select("id", { count: "exact", head: true }).eq("reviewed", false),
    supabase.from("activity").select("id", { count: "exact", head: true }).eq("resume_worthy", true),
    supabase
      .from("activity")
      .select("metrics", { count: "exact" })
      .gte("occurred_at", since.toISOString()),
  ]);

  // Sum tracked coding seconds over the last 7 days.
  const codingSeconds = (week.data ?? []).reduce((sum, r) => {
    const s = (r.metrics as Record<string, unknown>)?.seconds;
    return sum + (typeof s === "number" ? s : 0);
  }, 0);

  return {
    total: total.count ?? 0,
    unreviewed: unreviewed.count ?? 0,
    onResume: onResume.count ?? 0,
    weekEntries: week.count ?? 0,
    weekCodingHours: Math.round((codingSeconds / 3600) * 10) / 10,
  };
}

/** Everything flagged for the CV, newest first — the resume generator's input. */
export async function getResumeItems(): Promise<Activity[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("activity")
    .select("*")
    .eq("resume_worthy", true)
    .order("occurred_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Activity[];
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
