/**
 * Types and formatters shared by the server aggregator and the browser chart.
 *
 * This module must stay free of server imports. `lib/coding.ts` pulls in the
 * service-role Supabase client, so a client component importing from it would
 * drag the service key into the bundle — hence this split.
 */

export type CodingDay = {
  /** YYYY-MM-DD in the site timezone. */
  date: string;
  /** editorSeconds + manualSeconds. */
  seconds: number;
  editorSeconds: number;
  manualSeconds: number;
};

export type CodingSlice = { name: string; seconds: number };

export type RunningSession = {
  startedAt: string;
  note: string;
  project: string;
};

export type CodingStats = {
  days: CodingDay[];
  languages: CodingSlice[];
  projects: CodingSlice[];
  totals: {
    today: number;
    week: number;
    month: number;
    window: number;
    dailyAverage: number;
    bestDay: CodingDay | null;
    currentStreak: number;
    longestStreak: number;
    activeDays: number;
  };
  running: RunningSession | null;
  /**
   * How many days in the window actually carry a language breakdown. Rows
   * archived before per-language timings were stored have none, so the
   * breakdown can describe a shorter span than the chart — the UI says so
   * rather than implying the two cover the same period.
   */
  languageDays: number;
  timezone: string;
  generatedAt: string;
  degraded: boolean;
};

const pad = (n: number) => String(n).padStart(2, "0");

/** 9045 → "2h 31m". Compact, for tiles and tooltips. */
export function formatHours(seconds: number): string {
  if (seconds <= 0) return "0m";
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** 9045 → "02:30:45". For the ticking stopwatch, where digits must not jump. */
export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
    .map(pad)
    .join(":");
}

/** "2026-08-09" → "Sat, Aug 9". Parsed as a plain date, never shifted by zone. */
export function formatDayLabel(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
