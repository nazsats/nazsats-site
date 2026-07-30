import { NextRequest, NextResponse } from "next/server";
import { logActivityBatch, type NewActivity } from "../../../../lib/activity";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const USERNAME = process.env.GITHUB_USERNAME || "nazsats";
const TOKEN = process.env.GITHUB_TOKEN;

/**
 * Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. Reject anything else
 * so the endpoint can't be hammered from outside.
 */
function authorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

type SearchItem = {
  title: string;
  html_url: string;
  number: number;
  state: string;
  created_at: string;
  closed_at: string | null;
  pull_request?: { merged_at: string | null };
  repository_url: string;
  body: string | null;
};

/**
 * Pull requests you opened on repos you don't own. This is the highest-signal
 * thing GitHub knows about you — open-source contribution beats a wall of
 * commits to your own projects on any CV.
 */
async function fetchExternalPRs(since: string): Promise<NewActivity[]> {
  const q = `type:pr author:${USERNAME} -user:${USERNAME} created:>=${since}`;
  const res = await fetch(
    `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&per_page=50&sort=created&order=desc`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
      cache: "no-store",
    }
  );
  if (!res.ok) return [];

  const data = await res.json();
  const items: SearchItem[] = data.items ?? [];

  return items.map((pr) => {
    const repo = pr.repository_url.replace("https://api.github.com/repos/", "");
    const merged = Boolean(pr.pull_request?.merged_at);
    return {
      kind: "pr" as const,
      source: "github" as const,
      title: `${repo}#${pr.number} — ${pr.title}`,
      body: (pr.body ?? "").slice(0, 500),
      url: pr.html_url,
      tags: ["open source", repo.split("/")[0]],
      metrics: { merged, state: pr.state },
      occurred_at: pr.created_at,
      external_id: `github:pr:${repo}#${pr.number}`,
    };
  });
}

type RepoItem = {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  created_at: string;
  pushed_at: string;
  language: string | null;
  topics?: string[];
  fork: boolean;
  stargazers_count: number;
};

/** Repos you created recently — a new repo usually means a new project. */
async function fetchNewRepos(sinceIso: string): Promise<NewActivity[]> {
  const res = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?sort=created&direction=desc&per_page=30`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
      cache: "no-store",
    }
  );
  if (!res.ok) return [];

  const repos: RepoItem[] = await res.json();
  if (!Array.isArray(repos)) return [];

  return repos
    .filter((r) => !r.fork && r.created_at >= sinceIso)
    .map((r) => ({
      kind: "repo" as const,
      source: "github" as const,
      title: `New repo: ${r.name}`,
      body: r.description ?? "",
      url: r.html_url,
      tags: [r.language, ...(r.topics ?? [])].filter(Boolean) as string[],
      metrics: { stars: r.stargazers_count },
      occurred_at: r.created_at,
      external_id: `github:repo:${r.full_name}`,
    }));
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!TOKEN) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN is not set — search and repo listing need it" },
      { status: 500 }
    );
  }

  // Look back 30 days each run. Upserts are keyed on external_id, so
  // re-covering the same window is free and self-healing after downtime.
  const lookback = new Date();
  lookback.setDate(lookback.getDate() - 30);
  const sinceDate = lookback.toISOString().slice(0, 10);
  const sinceIso = lookback.toISOString();

  try {
    const [prs, repos] = await Promise.all([
      fetchExternalPRs(sinceDate),
      fetchNewRepos(sinceIso),
    ]);

    const inserted = await logActivityBatch([...prs, ...repos]);

    return NextResponse.json({
      ok: true,
      found: { prs: prs.length, repos: repos.length },
      inserted,
    });
  } catch (err) {
    console.error("[cron/github]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "sync failed" },
      { status: 500 }
    );
  }
}
