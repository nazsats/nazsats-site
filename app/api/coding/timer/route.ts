import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/supabase/server";
import {
  getRunningSession,
  startSession,
  stopSession,
  formatHours,
} from "../../../../lib/coding";

/**
 * Stopwatch control. Writes to the public chart, so it is owner-only.
 *
 * The middleware guard only covers /admin/*, which this path is deliberately
 * outside of — so the auth check has to happen here. Without it, anyone could
 * POST and inflate the numbers on the homepage.
 */
export const dynamic = "force-dynamic";

async function requireOwner() {
  const user = await getCurrentUser();
  return user ? null : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  const denied = await requireOwner();
  if (denied) return denied;

  try {
    return NextResponse.json({ running: await getRunningSession() });
  } catch (err) {
    console.error("[api/coding/timer] read", err);
    return NextResponse.json({ error: "Failed to read timer" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireOwner();
  if (denied) return denied;

  let body: { action?: string; note?: string; project?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body" }, { status: 400 });
  }

  try {
    if (body.action === "start") {
      await startSession({ note: body.note, project: body.project });
      return NextResponse.json({ ok: true, running: await getRunningSession() });
    }

    if (body.action === "stop") {
      const seconds = await stopSession();
      return NextResponse.json({
        ok: true,
        running: null,
        seconds,
        logged: formatHours(seconds),
      });
    }

    return NextResponse.json(
      { error: 'action must be "start" or "stop"' },
      { status: 400 }
    );
  } catch (err) {
    // "already running" / "no session running" are the caller's mistake, not a
    // server fault — 409 so the UI can just show the message and re-sync.
    const message = err instanceof Error ? err.message : "Timer action failed";
    const conflict = /already running|no session/i.test(message);
    if (!conflict) console.error("[api/coding/timer]", err);
    return NextResponse.json({ error: message }, { status: conflict ? 409 : 500 });
  }
}
