# Nazsats

Hi. This is my corner of the internet — **[nazsats.com](https://nazsats.com)**.

It started as "I should probably have a portfolio" and quietly turned into a whole thing:
a blog, a spinning 3D globe, a live feed of whatever I pushed to GitHub this week, and a
private back room where I keep score of everything I build.

---

## What's on it

**A spinning Earth.** No reason. It's just nice.

**My work** — the stuff I've actually shipped, with screenshots that update themselves.
AI tools, trading bots, Web3 things, a health app that reads your blood test and explains it
in human words.

**A blog** where I write about what I broke and how I fixed it. Bug hunts, mostly.

**A resume page** that prints straight to PDF. No "download CV" button pointing at a file I
forgot to update three months ago.

**Live GitHub stats** — repos, stars, contribution heatmap, and a feed of recent commits.
The heatmap is real, which was surprisingly hard to make true.

---

## The back room

There's a `/admin` area that only I can get into. Two things live there:

**The blog editor.** Write a post, publish it, done. There's also a button where I type a
topic and the AI writes a first draft for me. It's usually 70% there, which is 70% more than
a blank page.

**The track record.** This is the one I'm actually proud of. Everything I build gets logged:
merged pull requests, bug reports I filed on other people's libraries, blog posts, LinkedIn
and X posts, client work, and even how many hours I spent in my editor each day.

Most of it logs itself overnight while I'm asleep. The rest is a one-line form — a title and
a link, that's it.

Then when something turns out to be genuinely good, I star it, write one sentence about why
it mattered, and it goes in the pile that becomes my CV. So the resume writes itself over
time instead of being a panicked Sunday-night rewrite every time someone asks for it.

That's the whole idea: **write it down once, when it's fresh, and never try to remember what
you did last March.**

---

## Built with

Next.js, TypeScript, Tailwind, Supabase, and a slightly unreasonable number of hand-rolled
CSS animations. Hosted on Vercel. The AI bits use OpenAI and Claude.

No UI library. Every card tilt, glow and fade in here was written by hand, which was either
a great use of a weekend or a terrible one — jury's still out.

---

## Want to run it?

```bash
git clone https://github.com/nazsats/nazsats-site.git
cd nazsats-site
npm install
cp .env.example .env.local     # fill this in
npm run dev
```

Then open http://localhost:3000 and you're off.

You'll need a free Supabase project for the blog and the track record — paste
[`supabase/schema.sql`](supabase/schema.sql) into its SQL editor once and it sets up all the
tables. Everything else you might need is explained inside
[`.env.example`](.env.example), which I wrote for future-me at 2am and it shows.

A few handy commands:

| | |
|---|---|
| `npm run dev` | run it locally |
| `npm run build` | check nothing's broken |
| `npm run draft` | make a blog post draft from the terminal |
| `npm run migrate` | push my markdown posts into the database |

---

## A note on the private bits

The admin area is locked, the database refuses to talk to anyone who isn't the server, and
anything anyone types into a blog post gets scrubbed before it ever hits a page. My phone
number is deliberately nowhere near the resume page.

I've been bitten before. Now I'm careful.

---

## Licence

It's a personal site, so: read it, learn from it, steal a nice animation if you like one.
Just don't take my name, my writing, or my project screenshots and pass them off as yours.

Say hi → [nazsats.com/contact](https://nazsats.com/contact)
