// Publish ONE post from posts/<slug>.md into Supabase.
//
// Usage:  npm run publish -- <slug>
//         node scripts/publish-post.mjs rag-cant-count
//
// Why this exists alongside migrate-posts.mjs: that script upserts *every* file
// in posts/, which silently overwrites anything edited through /admin since it
// was last synced from disk. Once the database is the source of truth, a bulk
// re-run is a destructive operation. This touches exactly one row and prints
// what it replaced, so publishing a new post can't clobber an old one.

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

const slug = process.argv[2];
if (!slug) {
  console.error("✗ Usage: node scripts/publish-post.mjs <slug>");
  process.exit(1);
}

// Load env from .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("✗ Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first.");
  process.exit(1);
}

const file = path.join(process.cwd(), "posts", `${slug}.md`);
if (!fs.existsSync(file)) {
  console.error(`✗ No such file: posts/${slug}.md`);
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const { data, content } = matter(fs.readFileSync(file, "utf8"));

const row = {
  slug,
  title: data.title ?? slug,
  description: data.description ?? "",
  body: content.trim(),
  author: data.author ?? "Nazsats",
  tags: Array.isArray(data.tags) ? data.tags : [],
  published: data.published === true,
};

const { data: existing } = await supabase
  .from("posts")
  .select("slug, title, updated_at")
  .eq("slug", slug)
  .maybeSingle();

console.log(
  existing
    ? `↻ Replacing existing row "${existing.title}" (last updated ${existing.updated_at})`
    : "＋ Inserting a new row"
);

const { error } = await supabase.from("posts").upsert(row, { onConflict: "slug" });
if (error) {
  console.error(`✗ ${slug}: ${error.message}`);
  process.exit(1);
}

console.log(`✓ ${row.title}`);
console.log(`  slug=${row.slug}  ${row.published ? "PUBLISHED" : "draft"}  ${row.body.length} chars`);
console.log(`  tags: ${row.tags.join(", ")}`);

const { data: all } = await supabase
  .from("posts")
  .select("slug, published, created_at")
  .order("created_at", { ascending: false });

console.log(`\nPosts in the database (${all?.length ?? 0}):`);
for (const p of all ?? []) console.log(`  ${p.published ? "live " : "draft"}  ${p.slug}`);
