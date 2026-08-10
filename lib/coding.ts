import { getServiceClient } from "./supabase/service";
import type {
  CodingDay,
  CodingSlice,
  CodingStats,
  RunningSession,
} from "./coding-shared";

export type { CodingDay, CodingSlice, CodingStats, RunningSession };
export { formatHours, formatClock, formatDayLabel } from "./coding-shared";

/**
 * Coding-time aggregation.
 *
 * Two sources feed one number per day:
 *
 *   1. WakaTime — real editor time, collected nightly by /api/cron/coding into
 *      the `activity` table (kind='coding'). WakaTime's free plan only keeps
 *      ~14 days of history, so that table IS the long-term archive; we never
 *      ask WakaTime for anything older.
 *   2. Manual stopwatch sessions in `coding_sessions` — whiteboarding, reading
 *      docs, debugging away from the editor. Started/stopped from /admin/coding.
 *
 * On top of the archive we do one *live* WakaTime call covering the last few
 * days. Without it, "today" would show whatever the 02:30 cron last wrote —
 * i.e. yesterday. Live data wins for any day it covers, so a day is never
 * counted twice.
 */

/** Days are bucketed in this zone, so "today" means the user's today. */
export const SITE_TZ = process.env.SITE_TIMEZONE || "Asia/Kolkata";

/** Below this, a day is a stray editor ping rather than a working day. */
const STREAK_MIN_SECONDS = 15 * 60;

/** How many recent days the live WakaTime top-up covers. */
const LIVE_WINDOW_DAYS = 7;

const WAKATIME_API_URL = process.env.WAKATIME_API_URL || "https://wakatime.com/api/v1";

// ── Date helpers ────────────────────────────────────────────────────────────
// All bucketing happens on YYYY-MM-DD strings in SITE_TZ. Arithmetic anchors at
// UTC noon so a ±12h zone shift can never roll the key onto the wrong day.

const pad = (n: number) => String(n).padStart(2, "0");

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: SITE_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** The YYYY-MM-DD that this instant falls on, in SITE_TZ. */
export function dayKey(date: Date): string {
  return dayFormatter.format(date);
}

/** Shift a day key by whole days. */
function addDays(key: string, delta: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const shifted = new Date(Date.UTC(y, m - 1, d, 12) + delta * 86_400_000);
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(
    shifted.getUTCDate()
  )}`;
}

/** How far SITE_TZ's wall clock sits ahead of UTC at this instant, in ms. */
function tzOffsetMs(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SITE_TZ,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);

  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  // Intl can report hour 24 for midnight; normalise so Date.UTC stays in range.
  const hour = get("hour") % 24;

  const asUTC = Date.UTC(get("year"), get("month") - 1, get("day"), hour, get("minute"), get("second"));
  return asUTC - date.getTime();
}

/** The instant local midnight begins for a day key. */
function localDayStart(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  const guess = Date.UTC(y, m - 1, d);
  return new Date(guess - tzOffsetMs(new Date(guess)));
}

// ── Per-day accumulator ─────────────────────────────────────────────────────

type Bucket = {
  editorSeconds: number;
  manualSeconds: number;
  languages: Map<string, number>;
  projects: Map<string, number>;
};

const emptyBucket = (): Bucket => ({
  editorSeconds: 0,
  manualSeconds: 0,
  languages: new Map(),
  projects: new Map(),
});

function bucketFor(map: Map<string, Bucket>, key: string): Bucket {
  let b = map.get(key);
  if (!b) {
    b = emptyBucket();
    map.set(key, b);
  }
  return b;
}

/**
 * Read a `metrics.languages` / `metrics.projects` array.
 *
 * Two shapes exist in the wild: rows written before this feature stored plain
 * name strings with no timings, newer rows store {name, seconds}. Name-only
 * rows contribute to no breakdown — there is no honest number to plot — so
 * they are skipped rather than counted as zero.
 */
function readSlices(raw: unknown): CodingSlice[] {
  if (!Array.isArray(raw)) return [];
  const out: CodingSlice[] = [];
  for (const item of raw) {
    if (item && typeof item === "object" && "name" in item) {
      const name = String((item as { name: unknown }).name ?? "").trim();
      const seconds = Number((item as { seconds?: unknown }).seconds ?? 0);
      if (name && Number.isFinite(seconds) && seconds > 0) {
        out.push({ name, seconds: Math.round(seconds) });
      }
    }
  }
  return out;
}

function addSlices(target: Map<string, number>, slices: CodingSlice[]) {
  for (const s of slices) {
    target.set(s.name, (target.get(s.name) ?? 0) + s.seconds);
  }
}

// ── Sources ─────────────────────────────────────────────────────────────────

type WakaSummary = {
  range?: { date?: string };
  grand_total?: { total_seconds?: number };
  languages?: { name: string; total_seconds: number }[];
  projects?: { name: string; total_seconds: number }[];
};

/**
 * Live WakaTime summaries for the last few days. Returns null on any failure —
 * a missing key, a rate limit, an outage. The archive still renders; the page
 * just flags itself degraded rather than blowing up the whole homepage.
 */
async function fetchLiveWakaTime(): Promise<Map<string, Bucket> | null> {
  const key = process.env.WAKATIME_API_KEY;
  if (!key) return null;

  const today = dayKey(new Date());
  const params = new URLSearchParams({
    start: addDays(today, -(LIVE_WINDOW_DAYS - 1)),
    end: today,
  });

  try {
    const res = await fetch(`${WAKATIME_API_URL}/users/current/summaries?${params}`, {
      headers: { Authorization: `Basic ${Buffer.from(key).toString("base64")}` },
      // Fresh enough to feel live, cheap enough not to hammer WakaTime.
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;

    const json = (await res.json()) as { data?: WakaSummary[] };
    const out = new Map<string, Bucket>();

    for (const day of json.data ?? []) {
      const date = day.range?.date;
      if (!date) continue;
      const bucket = bucketFor(out, date);
      bucket.editorSeconds = Math.round(day.grand_total?.total_seconds ?? 0);
      addSlices(
        bucket.languages,
        (day.languages ?? []).map((l) => ({ name: l.name, seconds: Math.round(l.total_seconds) }))
      );
      addSlices(
        bucket.projects,
        (day.projects ?? []).map((p) => ({ name: p.name, seconds: Math.round(p.total_seconds) }))
      );
    }
    return out;
  } catch {
    return null;
  }
}

/** Archived editor time from the nightly cron. */
async function fetchArchive(sinceKey: string): Promise<Map<string, Bucket>> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("activity")
    .select("occurred_at, external_id, metrics")
    .eq("kind", "coding")
    // occurred_at is stored at noon UTC for the day in question, so reaching a
    // day back is enough slack for any timezone to resolve correctly.
    .gte("occurred_at", localDayStart(addDays(sinceKey, -1)).toISOString())
    .order("occurred_at", { ascending: true });

  if (error) throw new Error(error.message);

  const out = new Map<string, Bucket>();
  for (const row of data ?? []) {
    // The external_id carries the day WakaTime itself assigned; trust it over
    // re-deriving one from a timestamp we normalised on the way in.
    const fromId = row.external_id?.startsWith("wakatime:")
      ? row.external_id.slice("wakatime:".length)
      : null;
    const date = fromId ?? dayKey(new Date(row.occurred_at));

    const metrics = (row.metrics ?? {}) as Record<string, unknown>;
    const seconds = Number(metrics.seconds ?? 0);
    if (!Number.isFinite(seconds) || seconds <= 0) continue;

    const bucket = bucketFor(out, date);
    bucket.editorSeconds += Math.round(seconds);
    addSlices(bucket.languages, readSlices(metrics.languages));
    addSlices(bucket.projects, readSlices(metrics.projects));
  }
  return out;
}

/**
 * True when the table simply isn't there yet — i.e. the coding_sessions
 * migration in supabase/schema.sql has not been run. Editor time still works
 * without it, so callers degrade instead of failing.
 *
 * Two codes, because the error surfaces differently depending on how far the
 * request gets: PostgREST answers PGRST205 from its own schema cache, while a
 * direct query returns Postgres' 42P01. Matching only one silently misses the
 * common case.
 */
function isMissingTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === "42P01" || error.code === "PGRST205") return true;
  return /could not find the table/i.test(error.message ?? "");
}

export const MIGRATION_HINT =
  "The coding_sessions table is missing — run supabase/schema.sql in the Supabase SQL editor.";

/**
 * Manual stopwatch sessions, split across local midnight so a session running
 * 23:00→01:00 lands two hours on two days rather than two hours on one.
 * The open session (ended_at null) is counted up to now.
 */
async function fetchManualSessions(
  sinceKey: string
): Promise<{ byDay: Map<string, number>; running: RunningSession | null }> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("coding_sessions")
    .select("started_at, ended_at, note, project")
    .gte("started_at", localDayStart(addDays(sinceKey, -1)).toISOString())
    .order("started_at", { ascending: true });

  if (error) {
    if (isMissingTable(error)) return { byDay: new Map(), running: null };
    throw new Error(error.message);
  }

  const byDay = new Map<string, number>();
  let running: RunningSession | null = null;
  const now = Date.now();

  for (const row of data ?? []) {
    const start = new Date(row.started_at).getTime();
    if (!Number.isFinite(start)) continue;

    const open = !row.ended_at;
    const end = open ? now : new Date(row.ended_at).getTime();
    if (!Number.isFinite(end) || end <= start) continue;

    if (open) {
      running = {
        startedAt: row.started_at,
        note: row.note ?? "",
        project: row.project ?? "",
      };
    }

    // Walk day by day so a session crossing midnight is attributed correctly.
    let cursor = start;
    let guard = 0;
    while (cursor < end && guard++ < 400) {
      const key = dayKey(new Date(cursor));
      const nextMidnight = localDayStart(addDays(key, 1)).getTime();
      const slice = Math.min(end, nextMidnight) - cursor;
      byDay.set(key, (byDay.get(key) ?? 0) + Math.round(slice / 1000));
      cursor = Math.min(end, nextMidnight);
    }
  }

  return { byDay, running };
}

// ── Streaks ─────────────────────────────────────────────────────────────────

function computeStreaks(days: CodingDay[]): { current: number; longest: number } {
  let longest = 0;
  let run = 0;
  for (const day of days) {
    if (day.seconds >= STREAK_MIN_SECONDS) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
  }

  // Count back from the end. Today is skipped if it is still empty — the day
  // is not over yet, so a quiet morning should not read as a broken streak.
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const active = days[i].seconds >= STREAK_MIN_SECONDS;
    if (active) current += 1;
    else if (i === days.length - 1) continue;
    else break;
  }

  return { current, longest };
}

// ── Public entry point ──────────────────────────────────────────────────────

/**
 * Everything the Coding Time section renders, for a trailing window of `days`
 * ending today. Falls back to archive-only data if WakaTime is unreachable.
 */
export async function getCodingStats(windowDays = 90): Promise<CodingStats> {
  const span = Math.min(Math.max(Math.trunc(windowDays), 7), 365);
  const today = dayKey(new Date());
  const startKey = addDays(today, -(span - 1));

  const [archive, live, manual] = await Promise.all([
    fetchArchive(startKey),
    fetchLiveWakaTime(),
    fetchManualSessions(startKey),
  ]);

  // Live wins outright for any day it covers — it is the same measurement,
  // only fresher. Merging the two would double-count the day.
  const merged = new Map<string, Bucket>(archive);
  if (live) for (const [date, bucket] of live) merged.set(date, bucket);

  for (const [date, seconds] of manual.byDay) {
    bucketFor(merged, date).manualSeconds += seconds;
  }

  // Emit every day in the window, including the zeros — gaps in a time axis
  // must be visible as gaps, not silently closed up.
  const days: CodingDay[] = [];
  const languages = new Map<string, number>();
  const projects = new Map<string, number>();
  let languageDays = 0;

  for (let i = 0; i < span; i++) {
    const date = addDays(startKey, i);
    const bucket = merged.get(date) ?? emptyBucket();
    days.push({
      date,
      editorSeconds: bucket.editorSeconds,
      manualSeconds: bucket.manualSeconds,
      seconds: bucket.editorSeconds + bucket.manualSeconds,
    });
    if (bucket.languages.size > 0) languageDays += 1;
    addSlices(languages, [...bucket.languages].map(([name, seconds]) => ({ name, seconds })));
    addSlices(projects, [...bucket.projects].map(([name, seconds]) => ({ name, seconds })));
  }

  const rank = (m: Map<string, number>): CodingSlice[] =>
    [...m]
      .map(([name, seconds]) => ({ name, seconds }))
      .filter((s) => s.seconds > 0)
      .sort((a, b) => b.seconds - a.seconds);

  const sumLast = (n: number) =>
    days.slice(-n).reduce((total, d) => total + d.seconds, 0);

  const activeDays = days.filter((d) => d.seconds >= STREAK_MIN_SECONDS).length;
  const windowTotal = days.reduce((total, d) => total + d.seconds, 0);
  const bestDay = days.reduce<CodingDay | null>(
    (best, d) => (d.seconds > 0 && (!best || d.seconds > best.seconds) ? d : best),
    null
  );
  const streaks = computeStreaks(days);

  return {
    days,
    languages: rank(languages),
    projects: rank(projects),
    totals: {
      today: days[days.length - 1]?.seconds ?? 0,
      week: sumLast(7),
      month: sumLast(30),
      window: windowTotal,
      // Averaged over days actually worked, not calendar days — otherwise a
      // long window quietly drags the number toward zero.
      dailyAverage: activeDays ? Math.round(windowTotal / activeDays) : 0,
      bestDay,
      currentStreak: streaks.current,
      longestStreak: streaks.longest,
      activeDays,
    },
    running: manual.running,
    languageDays,
    timezone: SITE_TZ,
    generatedAt: new Date().toISOString(),
    degraded: live === null,
  };
}

// ── Stopwatch control (admin) ───────────────────────────────────────────────

/** The open session, or null. */
export async function getRunningSession(): Promise<RunningSession | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("coding_sessions")
    .select("started_at, note, project")
    .is("ended_at", null)
    .order("started_at", { ascending: false })
    .limit(1);

  if (error) {
    if (isMissingTable(error)) return null;
    throw new Error(error.message);
  }
  const row = data?.[0];
  return row
    ? { startedAt: row.started_at, note: row.note ?? "", project: row.project ?? "" }
    : null;
}

export type LoggedSession = {
  id: string;
  startedAt: string;
  endedAt: string | null;
  seconds: number;
  note: string;
  project: string;
};

/** Recent stopwatch sessions, newest first — the admin review list. */
export async function getRecentSessions(limit = 20): Promise<LoggedSession[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("coding_sessions")
    .select("id, started_at, ended_at, note, project")
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) {
    if (isMissingTable(error)) return [];
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => {
    const start = new Date(row.started_at).getTime();
    const end = row.ended_at ? new Date(row.ended_at).getTime() : Date.now();
    return {
      id: row.id,
      startedAt: row.started_at,
      endedAt: row.ended_at,
      seconds: Math.max(0, Math.round((end - start) / 1000)),
      note: row.note ?? "",
      project: row.project ?? "",
    };
  });
}

/** Remove a session — for a stopwatch left running overnight by mistake. */
export async function deleteSession(id: string) {
  const supabase = getServiceClient();
  const { error } = await supabase.from("coding_sessions").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/**
 * Open a session. The partial unique index on `coding_sessions` rejects a
 * second open row, so a double-click surfaces as "already running" instead of
 * quietly creating overlapping sessions that both bill the same minutes.
 */
export async function startSession(input: { note?: string; project?: string } = {}) {
  const supabase = getServiceClient();
  const { error } = await supabase.from("coding_sessions").insert({
    started_at: new Date().toISOString(),
    note: input.note?.slice(0, 200) ?? "",
    project: input.project?.slice(0, 120) ?? "",
  });

  if (error) {
    if (error.code === "23505") throw new Error("A session is already running.");
    if (isMissingTable(error)) throw new Error(MIGRATION_HINT);
    throw new Error(error.message);
  }
}

/** Close the open session. Returns its length in seconds. */
export async function stopSession(): Promise<number> {
  const supabase = getServiceClient();
  const { data: open, error: readError } = await supabase
    .from("coding_sessions")
    .select("id, started_at")
    .is("ended_at", null)
    .order("started_at", { ascending: false })
    .limit(1);

  if (readError) throw new Error(readError.message);
  const session = open?.[0];
  if (!session) throw new Error("No session is running.");

  const endedAt = new Date();
  const { error } = await supabase
    .from("coding_sessions")
    .update({ ended_at: endedAt.toISOString() })
    .eq("id", session.id);

  if (error) throw new Error(error.message);
  return Math.max(
    0,
    Math.round((endedAt.getTime() - new Date(session.started_at).getTime()) / 1000)
  );
}
