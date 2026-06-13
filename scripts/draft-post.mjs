// Generate a blog post DRAFT with the OpenAI API and save it to Supabase.
//
// Usage:
//   node scripts/draft-post.mjs "Your topic or working title here"
//
// The draft is inserted with published = false, so it stays hidden until you
// review it in the /admin panel and publish it. (You can also generate drafts
// directly from the admin panel — this script is just a convenience.)

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// ── Load env from .env.local ──
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
  }
}

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const topic = process.argv.slice(2).join(" ").trim();

if (!apiKey) {
  console.error("✗ Missing OPENAI_API_KEY in .env.local");
  process.exit(1);
}
if (!supabaseUrl || !serviceKey) {
  console.error("✗ Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}
if (!topic) {
  console.error('✗ Give me a topic, e.g.  node scripts/draft-post.mjs "Smart contracts explained"');
  process.exit(1);
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 60);
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
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
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
  process.exit(1);
}

const title = post.title || topic;
let slug = slugify(title);

const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

const { data: existing } = await supabase.from("posts").select("slug").eq("slug", slug).maybeSingle();
if (existing) slug = `${slug}-${Date.now().toString().slice(-5)}`;

const { error } = await supabase.from("posts").insert({
  slug,
  title,
  description: post.description || "",
  body: (post.body || "").trim(),
  tags: Array.isArray(post.tags) ? post.tags : [],
  published: false,
});

if (error) {
  console.error(`✗ Could not save to Supabase: ${error.message}`);
  process.exit(1);
}

console.log(`\n✓ Draft saved to Supabase as "${title}" (published: false).`);
console.log("  Review and publish it from the /admin panel.");
