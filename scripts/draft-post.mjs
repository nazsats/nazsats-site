// Generate a blog post DRAFT with the OpenAI API.
//
// Usage:
//   node scripts/draft-post.mjs "Your topic or working title here"
//
// Requires OPENAI_API_KEY in your environment (see .env.local).
// The draft is saved to posts/<slug>.md with `published: false`, so it stays
// hidden on the site until you review it and flip the flag to `true`.

import fs from "fs";
import path from "path";

// ── Load OPENAI_API_KEY from .env.local if not already in the environment ──
const envPath = path.join(process.cwd(), ".env.local");
if (!process.env.OPENAI_API_KEY && fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
  }
}

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

const topic = process.argv.slice(2).join(" ").trim();

if (!apiKey) {
  console.error("✗ Missing OPENAI_API_KEY. Add it to .env.local or your environment.");
  process.exit(1);
}
if (!topic) {
  console.error('✗ Give me a topic, e.g.  node scripts/draft-post.mjs "Smart contracts explained simply"');
  process.exit(1);
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

const systemPrompt = `You are a senior technical writer for Nazsats, a blog about AI,
machine learning, data science, blockchain, and Web3. Write a clear, accurate,
engaging blog post for a technically curious audience. Use a confident, practical
tone — no fluff, no hype. Prefer concrete examples over vague claims.

Return ONLY valid JSON (no markdown fences) with this exact shape:
{
  "title": "string, punchy, under 70 chars",
  "description": "string, 1-2 sentence summary under 160 chars",
  "tags": ["2 to 4 short topic tags"],
  "body": "the full article in GitHub-flavored Markdown, using ## and ### headings, lists, and **bold** where helpful. Do NOT include the title as an H1 — start with an intro paragraph."
}`;

console.log(`✍️  Drafting a post about: "${topic}" (model: ${model})…`);

const res = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Write a blog post about: ${topic}` },
    ],
  }),
});

if (!res.ok) {
  console.error(`✗ OpenAI API error ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const data = await res.json();
let post;
try {
  post = JSON.parse(data.choices[0].message.content);
} catch {
  console.error("✗ Could not parse the model's response as JSON.");
  console.error(data.choices?.[0]?.message?.content);
  process.exit(1);
}

const title = post.title || topic;
const slug = slugify(title);
const date = new Date().toISOString().slice(0, 10);
const tags = Array.isArray(post.tags) ? post.tags : [];

const frontmatter = `---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(post.description || "")}
date: "${date}"
author: "Nazsats"
tags: ${JSON.stringify(tags)}
published: false
---

`;

const postsDir = path.join(process.cwd(), "posts");
fs.mkdirSync(postsDir, { recursive: true });
const outPath = path.join(postsDir, `${slug}.md`);

if (fs.existsSync(outPath)) {
  console.error(`✗ ${outPath} already exists. Rename it or pick a different topic.`);
  process.exit(1);
}

fs.writeFileSync(outPath, frontmatter + (post.body || "").trim() + "\n", "utf8");

console.log(`\n✓ Draft saved: posts/${slug}.md`);
console.log("  It is set to  published: false  (hidden on the site).");
console.log("  Review it, edit anything, then change to  published: true  to go live.");
