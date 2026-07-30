import { NextRequest, NextResponse } from "next/server";
import { logActivityBatch, formatDuration, type NewActivity } from "../../../../lib/activity";

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

  // Last 7 days. Re-running overwrites the same day rows via external_id, so a
  // day that was still in progress at the last run gets corrected later.
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 6);

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
        const languages = (d.languages ?? []).slice(0, 5).map((l) => l.name);
        const projects = (d.projects ?? []).slice(0, 5).map((p) => p.name);
        const editors = (d.editors ?? []).map((e) => e.name);

        return {
          kind: "coding" as const,
          source: "wakatime" as const,
          title: `${formatDuration(seconds)} coding — ${projects.slice(0, 2).join(", ") || "misc"}`,
          body: [
            projects.length ? `Projects: ${projects.join(", ")}` : "",
            languages.length ? `Languages: ${languages.join(", ")}` : "",
            editors.length ? `Editors: ${editors.join(", ")}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
          tags: languages,
          metrics: { seconds, projects, languages, editors },
          occurred_at: new Date(`${d.range.date}T12:00:00Z`).toISOString(),
          external_id: `wakatime:${d.range.date}`,
        };
      });

    const inserted = await logActivityBatch(entries);

    return NextResponse.json({ ok: true, days: entries.length, inserted });
  } catch (err) {
    console.error("[cron/coding]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "sync failed" },
      { status: 500 }
    );
  }
}
