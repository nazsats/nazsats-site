import { NextRequest, NextResponse } from "next/server";
import { upsertActivityBatch, formatDuration, type NewActivity } from "../../../../lib/activity";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Coding-time sync.
 *
 * Editor time comes from WakaTime — install the WakaTime extension in VS Code
 * (and any VS Code-based editor, which covers most agentic forks), then put a
 * read-only API key in WAKATIME_API_KEY.
 *
 * WAKATIME_API_URL lets you point this at a self-hosted Wakapi instead; Wakapi
 * is API-compatible, so only the base URL changes.
 */
const API_URL = process.env.WAKATIME_API_URL || "https://wakatime.com/api/v1";
const API_KEY = process.env.WAKATIME_API_KEY;

function authorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

type Summary = {
  range: { date: string };
  grand_total: { total_seconds: number };
  languages: { name: string; total_seconds: number }[];
  projects: { name: string; total_seconds: number }[];
  editors?: { name: string; total_seconds: number }[];
};

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!API_KEY) {
    return NextResponse.json(
      { error: "WAKATIME_API_KEY is not set" },
      { status: 500 }
    );
  }

  // Last 7 days by default. Re-running overwrites the same day rows via
  // external_id, so a day that was still in progress at the last run gets
  // corrected later.
  //
  // ?days=N widens the window for a one-off backfill — capped at 14 because
  // WakaTime's free plan keeps no more history than that, so a larger number
  // would only return empty days.
  const requested = Number(request.nextUrl.searchParams.get("days"));
  const days = Number.isFinite(requested) ? Math.min(Math.max(requested, 1), 14) : 7;

  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));

  const params = new URLSearchParams({
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  });

  try {
    const res = await fetch(`${API_URL}/users/current/summaries?${params}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(API_KEY).toString("base64")}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `WakaTime API ${res.status}` },
        { status: 502 }
      );
    }

    const json = await res.json();
    const days: Summary[] = json.data ?? [];

    const entries: NewActivity[] = days
      // Skip days with under 10 minutes — noise, not a working day.
      .filter((d) => (d.grand_total?.total_seconds ?? 0) >= 600)
      .map((d) => {
        const seconds = Math.round(d.grand_total.total_seconds);

        // Keep the per-slice timings, not just the names — the public chart
        // breaks the day down by language, and a bare name carries no number
        // to plot. WakaTime only keeps ~14 days, so whatever is dropped here
        // is unrecoverable later.
        const toSlices = (rows: { name: string; total_seconds: number }[] = []) =>
          rows
            .filter((r) => r.total_seconds > 0)
            .map((r) => ({ name: r.name, seconds: Math.round(r.total_seconds) }));

        const languages = toSlices(d.languages);
        const projects = toSlices(d.projects);
        const editors = (d.editors ?? []).map((e) => e.name);

        const languageNames = languages.map((l) => l.name);
        const projectNames = projects.map((p) => p.name);

        return {
          kind: "coding" as const,
          source: "wakatime" as const,
          title: `${formatDuration(seconds)} coding — ${projectNames.slice(0, 2).join(", ") || "misc"}`,
          body: [
            projectNames.length ? `Projects: ${projectNames.join(", ")}` : "",
            languageNames.length ? `Languages: ${languageNames.join(", ")}` : "",
            editors.length ? `Editors: ${editors.join(", ")}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
          tags: languageNames.slice(0, 5),
          metrics: { seconds, projects, languages, editors },
          occurred_at: new Date(`${d.range.date}T12:00:00Z`).toISOString(),
          external_id: `wakatime:${d.range.date}`,
        };
      });

    const written = await upsertActivityBatch(entries);

    return NextResponse.json({ ok: true, days: entries.length, written });
  } catch (err) {
    console.error("[cron/coding]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "sync failed" },
      { status: 500 }
    );
  }
}
