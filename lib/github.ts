const USERNAME = process.env.GITHUB_USERNAME || "nazsats";
const TOKEN = process.env.GITHUB_TOKEN;

function ghHeaders(): HeadersInit {
  return {
    Accept: "application/vnd.github.v3+json",
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
  };
}

// ── User stats ─────────────────────────────────
export async function getGitHubStats() {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`, {
        headers: ghHeaders(),
        next: { revalidate: 3600 },
      }),
      fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100`, {
        headers: ghHeaders(),
        next: { revalidate: 3600 },
      }),
    ]);

    const user = await userRes.json();
    const repos = await reposRes.json();

    const totalStars = Array.isArray(repos)
      ? repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
      : 0;

    return {
      name: user.name || USERNAME,
      bio: user.bio || "",
      followers: user.followers || 0,
      following: user.following || 0,
      publicRepos: user.public_repos || 0,
      totalStars,
      avatarUrl: user.avatar_url || "",
      profileUrl: user.html_url || `https://github.com/${USERNAME}`,
    };
  } catch {
    return { name: USERNAME, bio: "", followers: 0, following: 0, publicRepos: 0, totalStars: 0, avatarUrl: "", profileUrl: "" };
  }
}

// ── Pinned / top repos ─────────────────────────
export async function getPinnedRepos() {
  if (TOKEN) {
    const query = `{
      user(login: "${USERNAME}") {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name description url stargazerCount forkCount
              primaryLanguage { name color }
              repositoryTopics(first: 4) { nodes { topic { name } } }
            }
          }
        }
      }
    }`;
    try {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        next: { revalidate: 3600 },
      });
      const data = await res.json();
      const nodes: { name: string; description: string; url: string; stargazerCount: number; forkCount: number; primaryLanguage: { name: string; color: string } | null; repositoryTopics: { nodes: { topic: { name: string } }[] } }[] = data?.data?.user?.pinnedItems?.nodes || [];
      if (nodes.length) {
        return nodes.map((r) => ({
          name: r.name,
          description: r.description || "",
          url: r.url,
          stars: r.stargazerCount,
          forks: r.forkCount,
          language: r.primaryLanguage?.name || null,
          languageColor: r.primaryLanguage?.color || "#888",
          topics: r.repositoryTopics?.nodes?.map((n) => n.topic.name) || [],
        }));
      }
    } catch { /* fall through */ }
  }

  // Fallback: top-starred public repos
  try {
    const res = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?sort=stars&per_page=6&type=public`,
      { headers: ghHeaders(), next: { revalidate: 3600 } }
    );
    const repos = await res.json();
    if (!Array.isArray(repos)) return [];
    return repos.map((r) => ({
      name: r.name,
      description: r.description || "",
      url: r.html_url,
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
      language: r.language || null,
      languageColor: "#888",
      topics: r.topics || [],
    }));
  } catch {
    return [];
  }
}

// ── Contribution calendar ──────────────────────
export interface ContributionDay { contributionCount: number; date: string; }
export interface ContributionWeek { contributionDays: ContributionDay[]; }

export async function getContributions(): Promise<{ weeks: ContributionWeek[]; total: number }> {
  if (TOKEN) {
    const query = `{
      user(login: "${USERNAME}") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks { contributionDays { contributionCount date } }
          }
        }
      }
    }`;
    try {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        next: { revalidate: 3600 },
      });
      const data = await res.json();
      const cal = data?.data?.user?.contributionsCollection?.contributionCalendar;
      if (cal) return { weeks: cal.weeks, total: cal.totalContributions };
    } catch { /* fall through */ }
  }

  // Generate plausible mock data so the heatmap still renders
  return { weeks: generateMockWeeks(), total: 0 };
}

function generateMockWeeks(): ContributionWeek[] {
  const weeks: ContributionWeek[] = [];
  const now = new Date();
  for (let w = 52; w >= 0; w--) {
    const days: ContributionDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (w * 7 + d));
      days.push({
        contributionCount: Math.random() > 0.45 ? Math.floor(Math.random() * 9) : 0,
        date: date.toISOString().split("T")[0],
      });
    }
    weeks.push({ contributionDays: days });
  }
  return weeks;
}

// ── Recent public activity / commit feed ───────
export interface GitHubEvent {
  id: string;
  type: string;
  repo: string;
  repoFull: string;
  repoUrl: string;
  createdAt: string;
  message: string;
  commits: number;
}

export async function getRecentActivity(): Promise<GitHubEvent[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${USERNAME}/events/public?per_page=30`,
      { headers: ghHeaders(), next: { revalidate: 300 } }
    );
    const events = await res.json();
    if (!Array.isArray(events)) return [];

    interface RawEvent { id: string; type: string; repo: { name: string }; created_at: string; payload: { commits?: { message: string }[]; ref_type?: string; ref?: string; action?: string; pull_request?: { title: string } } }
    return (events as RawEvent[])
      .filter((e) =>
        ["PushEvent", "CreateEvent", "WatchEvent", "ForkEvent", "PullRequestEvent"].includes(e.type)
      )
      .slice(0, 10)
      .map((e) => ({
        id: e.id,
        type: e.type,
        repo: (e.repo?.name || "").split("/")[1] || e.repo?.name || "",
        repoFull: e.repo?.name || "",
        repoUrl: `https://github.com/${e.repo?.name}`,
        createdAt: e.created_at,
        message: eventMessage(e),
        commits: e.payload?.commits?.length || 0,
      }));
  } catch {
    return [];
  }
}

function eventMessage(e: { type: string; payload: { commits?: { message: string }[]; ref_type?: string; ref?: string; action?: string; pull_request?: { title: string } } }): string {
  switch (e.type) {
    case "PushEvent":
      return e.payload?.commits?.[0]?.message?.split("\n")[0] || "pushed commits";
    case "CreateEvent":
      return `created ${e.payload?.ref_type} ${e.payload?.ref || ""}`.trim();
    case "WatchEvent":
      return "starred";
    case "ForkEvent":
      return "forked";
    case "PullRequestEvent":
      return `${e.payload?.action} PR: ${(e.payload?.pull_request?.title || "").slice(0, 50)}`;
    default:
      return e.type;
  }
}