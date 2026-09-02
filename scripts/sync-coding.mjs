// Pull the last 14 days of WakaTime into the coding archive, from this machine.
//
// Usage:  npm run sync:coding
//         node scripts/sync-coding.mjs
//
// Why this exists alongside the Vercel cron: on the Hobby plan that cron is
// best-effort, and it stopped firing for most of August without any error to
// notice. Twenty-four days of a forty-day window came back empty, and about ten
// of those are gone for good, because WakaTime's free plan keeps ~14 days and
// the archive is the only long-term copy.
//
// This is deliberately not a daily job. The endpoint backfills fourteen days
// and WakaTime holds fourteen days, so any run inside a fortnight loses
// nothing. Running it at logon is therefore more reliable here than a nightly
// schedule on a laptop that gets shut down at night — the machine is in use
// most days, and a fortnight of grace absorbs the rest.
//
// It calls the same endpoint Vercel does, so the cron can stay enabled as a
// free second chance. Rows upsert on external_id; running both cannot
// duplicate anything.

import fs from "fs";
import path from "path";

// Load env from .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
  }
}

const secret = process.env.CRON_SECRET;
if (!secret) {
  console.error("✗ CRON_SECRET is not set in .env.local");
  process.exit(1);
}

// The apex domain 307s to www, and fetch drops the Authorization header across
// that hop because it counts as cross-origin — which produces a 401 that looks
// exactly like a wrong secret. Point at the canonical host so there is no
// redirect to survive.
const site = process.env.SITE_URL || "https://www.nazsats.com";
const url = `${site}/api/cron/coding?days=14`;

const stamp = new Date().toISOString().replace("T", " ").slice(0, 19);

try {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${secret}` },
    // The route allows itself 60s; give it room rather than retrying a job
    // that may already be halfway through writing.
    signal: AbortSignal.timeout(90_000),
  });

  const body = await res.text();

  if (!res.ok) {
    // 401 means production's CRON_SECRET differs from the local one; 500 means
    // WAKATIME_API_KEY is missing there. Both are worth saying out loud rather
    // than failing silently the way the nightly job did.
    console.error(`✗ ${stamp}  HTTP ${res.status}  ${body.slice(0, 200)}`);
    process.exit(1);
  }

  let summary = body.slice(0, 200);
  try {
    const json = JSON.parse(body);
    summary = `${json.written ?? "?"} day(s) written`;
  } catch {
    // Keep the raw body; a non-JSON 200 is still worth seeing.
  }
  console.log(`✓ ${stamp}  ${summary}`);
} catch (err) {
  console.error(`✗ ${stamp}  ${err.message}`);
  process.exit(1);
}
