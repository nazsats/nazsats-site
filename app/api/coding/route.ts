import { NextRequest, NextResponse } from "next/server";
import { getCodingStats } from "../../../lib/coding";

/**
 * Public coding-time stats — the source the homepage chart polls to stay live.
 *
 * Read-only and non-identifying: totals, per-day seconds, language and project
 * names. No session notes, no editor paths.
 */
export const revalidate = 300;

export async function GET(request: NextRequest) {
  const requested = Number(request.nextUrl.searchParams.get("days"));
  const days = Number.isFinite(requested) ? requested : 90;

  try {
    const stats = await getCodingStats(days);

    // The running session's note is a private scratchpad ("debugging the auth
    // race"). Publish only that something is running, and since when.
    const payload = {
      ...stats,
      running: stats.running
        ? { startedAt: stats.running.startedAt, note: "", project: stats.running.project }
        : null,
    };

    return NextResponse.json(payload, {
      headers: {
        // Serve instantly from cache, refresh behind the reader's back.
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
      },
    });
  } catch (err) {
    console.error("[api/coding]", err);
    return NextResponse.json({ error: "Failed to load coding stats" }, { status: 500 });
  }
}
