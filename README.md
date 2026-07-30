# Nazsats

**[nazsats.com](https://nazsats.com)** — my portfolio and blog, plus a small authenticated
CMS with AI-assisted drafting behind it.

Built with the Next.js App Router. The marketing pages are static, the blog is served from
Postgres, and `/admin` is a private editor for writing and publishing posts.

| | |
|---|---|
| **Framework** | Next.js 16 (App Router, RSC, ISR) · React 19 · TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Data & auth** | Supabase (Postgres, Auth, Row-Level Security) |
| **AI** | OpenAI — JSON-mode post drafting |
| **Integrations** | GitHub REST + GraphQL · Vercel Analytics |
| **Hosting** | Vercel |

---

## Features

**Public site** — animated hero with an interactive WebGL globe, live GitHub stats,
contribution heatmap and activity feed, portfolio with live screenshots, service packages
with WhatsApp CTAs, and a blog.

**Blog** — posts stored in Supabase, rendered from Markdown, sanitised before display.
Individual pages use ISR with a 5-minute window; publishing revalidates immediately.

**Admin** (`/admin`) — email + password login, draft/publish workflow, Markdown editor,
and one-click AI drafting: give it a topic and OpenAI returns a title, description, tags
and a full post body, saved as a draft.

**Forms** — contact and newsletter submissions are written to Supabase. If the database is
unreachable, the payload is logged server-side instead so nothing is lost.

**Track record** (`/admin/log`) — a private, append-only log of everything shipped: merged
PRs, new repos, blog posts, social links, client work and daily coding time. GitHub and
WakaTime sync nightly via cron; anything else is one-line quick capture. Flag an entry
`resume_worthy`, give it a CV-ready bullet, and the resume becomes a query over the log
rather than a document you maintain by hand.

**Resume** (`/resume`) — public CV page with a PDF download.

**SEO** — per-route metadata, canonical URLs, JSON-LD `Organization`/`WebSite` graph,
dynamic OG images, `sitemap.xml` (including every published post) and `robots.txt`.

---

## Getting started

```bash
git clone https://github.com/nazsats/nazsats-site.git
cd nazsats-site
npm install
cp .env.example .env.local     # then fill it in — see below
npm run dev                    # http://localhost:3000
```

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Public client key (auth) |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | **Server only.** Reads posts and writes form submissions. Never expose to the browser. |
| `OPENAI_API_KEY` | for AI drafting | Generates post drafts in `/admin` |
| `OPENAI_MODEL` | no | Defaults to `gpt-4o-mini` |
| `GITHUB_USERNAME` | no | Defaults to `nazsats` |
| `GITHUB_TOKEN` | recommended | Without it the homepage falls back to unauthenticated API calls (60/hour) and the contribution heatmap renders placeholder data. Needs `read:user` + `public_repo`. |
| `CRON_SECRET` | for cron | Shared secret for `/api/cron/*`. Generate with `openssl rand -hex 32`. |
| `WAKATIME_API_KEY` | for coding time | Read-only key from [wakatime.com/settings/api-key](https://wakatime.com/settings/api-key) |
| `WAKATIME_API_URL` | no | Point at a self-hosted [Wakapi](https://github.com/muety/wakapi) instead of wakatime.com |

### Database setup

Run [`supabase/schema.sql`](supabase/schema.sql) once in the Supabase SQL editor. It creates
four tables — `posts`, `contact_messages`, `subscribers`, `activity` — each with RLS enabled
and **no public policies**. The anon key cannot read or write them; all access goes through
the server-side service client.

### Track record setup

1. Run the schema above (creates `activity`).
2. Set `CRON_SECRET` in Vercel — the cron jobs 401 without it.
3. For coding time: install the [WakaTime extension](https://wakatime.com/vs-code) in VS Code
   and set `WAKATIME_API_KEY`.

[`vercel.json`](vercel.json) schedules both syncs nightly. They look back 30 days (GitHub)
and 7 days (WakaTime) on every run and upsert on `external_id`, so re-runs are idempotent
and a missed night heals itself. To trigger one by hand:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://nazsats.com/api/cron/github
```

> Vercel's Hobby plan allows **2 cron jobs, daily only** — exactly what's configured here.

### Create an admin user

Supabase dashboard → **Authentication → Users → Add user**. Any user who can sign in has
admin access, so keep that list to yourself. Then visit `/admin`.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run draft` | Generate a Markdown post draft from the command line |
| `npm run migrate` | Upsert every file in `posts/` into Supabase, keyed by filename slug |

> `npm run migrate` processes **all** files in `posts/`. It upserts by slug, so posts edited
> in `/admin` after being migrated will be overwritten by the file version. Move files you
> don't want touched out of the folder first.

---

## Project structure

```
app/
  page.tsx            home — hero, GitHub feed, tech stack, portfolio
  about · services · work · contact
  blog/               index + [slug] post pages (ISR)
  admin/              protected editor — login, list, edit, server actions
  api/                contact + subscribe route handlers
  sitemap.ts · opengraph-image.tsx · globals.css
components/           Navbar, Footer, Globe, Projects, GitHub widgets, animations
lib/
  posts.ts            Supabase queries + Markdown render & sanitise
  github.ts           REST + GraphQL stats, pinned repos, heatmap, activity
  openai.ts           AI draft generation
  site.ts             projects, pricing packages, WhatsApp link
  supabase/           browser, server (SSR) and service-role clients
posts/                Markdown sources for `npm run migrate`
public/blog/          diagrams used in blog posts
supabase/schema.sql   database schema
middleware.ts         auth guard for /admin
next.config.ts        security headers (CSP, HSTS, frame-ancestors)
```

---

## Security notes

- **RLS by default.** Every table has Row-Level Security on with no public policies.
- **Sanitised Markdown.** `marked` doesn't sanitise, so rendered HTML passes through a
  `sanitize-html` allowlist before it reaches `dangerouslySetInnerHTML` — scripts, event
  handlers and `javascript:` URLs are stripped.
- **Security headers** set in [`next.config.ts`](next.config.ts): CSP, HSTS with preload,
  `frame-ancestors 'none'`, `nosniff`, Referrer-Policy and Permissions-Policy.
- **Service-role key is server-only** — imported exclusively by server components, route
  handlers and server actions.
- **`/admin` is guarded in middleware**, so unauthenticated requests never reach the page.

---

## Deploying

Push to `main` — Vercel builds and deploys. Set the same environment variables in the
Vercel project settings; `GITHUB_TOKEN` in particular is easy to forget, and without it the
homepage heatmap shows placeholder data in production.

---

## Licence

Personal project. The code is here to read and learn from; the branding, written content and
project screenshots are not for reuse.
