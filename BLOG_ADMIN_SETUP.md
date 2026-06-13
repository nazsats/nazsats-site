# Blog Admin Setup

Your blog is now database-backed with a protected admin panel at `/admin`.
Follow these steps once to wire it up.

## 1. Create a Supabase project

1. Go to https://supabase.com → sign up (free) → **New project**.
2. Pick a name, set a database password, choose a region near you.
3. Wait ~2 minutes for it to provision.

## 2. Create the posts table

1. In Supabase: **SQL Editor → New query**.
2. Paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.

## 3. Get your API keys

In Supabase: **Project Settings → API**. Copy these three values into `.env.local`:

| .env.local variable              | Where to find it in Supabase           |
| -------------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | Project URL                            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Project API keys → `anon` `public`     |
| `SUPABASE_SERVICE_ROLE_KEY`      | Project API keys → `service_role` (secret!) |

> ⚠️ The `service_role` key is a full-access secret. It only lives in `.env.local`
> (gitignored) and on the server — never commit it or expose it in the browser.

## 4. Create your admin login

In Supabase: **Authentication → Users → Add user → Create new user**.
Enter your email + a password and tick "Auto confirm". This is your `/admin` login.

> Optional: turn off public sign-ups under **Authentication → Providers → Email**
> so only users you create can log in.

## 5. Migrate your existing posts (optional)

If you want the two markdown posts already in `posts/` moved into the database:

```bash
npm run migrate
```

After this you can delete the `posts/` folder — it's no longer used by the site.

## 6. Run it

```bash
npm run dev
```

- Public blog: http://localhost:3000/blog
- Admin panel: http://localhost:3000/admin  (redirects to login)

## Daily workflow

1. Go to `/admin` and log in.
2. **Generate a draft with AI** — type a topic, click Generate. A hidden draft is created.
3. Click **Edit** to review/tweak it.
4. Toggle **Draft ⇄ Published** to make it live (or tick "Published" in the editor).
5. Changes appear on the site instantly — no rebuild needed.

You can also generate a draft from the command line: `npm run draft "Your topic"`.

## Deploying (control from the internet)

Add the same four env vars (`OPENAI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) in your Vercel
project: **Settings → Environment Variables**, then redeploy. Your admin panel
will then be live at `https://nazsats.com/admin`, usable from anywhere.
