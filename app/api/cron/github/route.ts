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
 * Pull requests *and* issues you opened on repos you don't own. This is the
 * highest-signal thing GitHub knows about you — open-source contribution beats
 * a wall of commits to your own projects on any CV.
 *
 * Issues count: a well-diagnosed bug report against a library you use is
 * evidence of the same skill as the fix, and often lands before the PR does.
 */
async function fetchExternalContributions(since: string): Promise<NewActivity[]> {
  const queries: { type: "pr" | "issue" }[] = [{ type: "pr" }, { type: "issue" }];

  const results = await Promise.all(
    queries.map(async ({ type }) => {
      const q = `type:${type} author:${USERNAME} -user:${USERNAME} created:>=${since}`;
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

      return items.map((item): NewActivity => {
        const repo = item.repository_url.replace("https://api.github.com/repos/", "");
        const merged = Boolean(item.pull_request?.merged_at);
        const label = type === "pr" ? "PR" : "Issue";
        return {
          kind: "pr",
          source: "github",
          title: `${repo} ${label} #${item.number} — ${item.title}`,
          body: (item.body ?? "").slice(0, 500),
          url: item.html_url,
          tags: ["open source", repo.split("/")[1] ?? repo],
          metrics: { type, merged, state: item.state },
          occurred_at: item.created_at,
          external_id: `github:${type}:${repo}#${item.number}`,
        };
      });
    })
  );

  return results.flat();
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

  // A token isn't strictly required — search and the public repo list work
  // unauthenticated at 60 requests/hour, which is plenty for a nightly run.
  // With a token the limit is 5,000/hour, so it's still worth setting.

  // Look back a year for contributions, 30 days for repos. Upserts are keyed
  // on external_id, so re-covering the same window is free and self-healing.
  const contribSince = new Date();
  contribSince.setFullYear(contribSince.getFullYear() - 1);

  const repoSince = new Date();
  repoSince.setDate(repoSince.getDate() - 30);

  try {
    const [contributions, repos] = await Promise.all([
      fetchExternalContributions(contribSince.toISOString().slice(0, 10)),
      fetchNewRepos(repoSince.toISOString()),
    ]);

    const inserted = await logActivityBatch([...contributions, ...repos]);

    return NextResponse.json({
      ok: true,
      authenticated: Boolean(TOKEN),
      found: { contributions: contributions.length, repos: repos.length },
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
