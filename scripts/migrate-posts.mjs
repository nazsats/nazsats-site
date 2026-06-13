// One-time migration: move existing markdown files in posts/ into Supabase.
//
// Usage:  node scripts/migrate-posts.mjs
//
// Safe to re-run: it upserts by slug, so existing rows are updated, not duplicated.

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

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

const supabase = createClient(url, key, { auth: { persistSession: false } });
const postsDir = path.join(process.cwd(), "posts");

if (!fs.existsSync(postsDir)) {
  console.log("No posts/ folder — nothing to migrate.");
  process.exit(0);
}

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
if (files.length === 0) {
  console.log("No markdown files to migrate.");
  process.exit(0);
}

for (const file of files) {
  const slug = file.replace(/\.md$/, "");
  const { data, content } = matter(fs.readFileSync(path.join(postsDir, file), "utf8"));

  const row = {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    body: content.trim(),
    author: data.author ?? "Nazsats",
    tags: Array.isArray(data.tags) ? data.tags : [],
    published: data.published === true,
  };

  const { error } = await supabase.from("posts").upsert(row, { onConflict: "slug" });
  if (error) {
    console.error(`✗ ${slug}: ${error.message}`);
  } else {
    console.log(`✓ ${slug}  (${row.published ? "published" : "draft"})`);
  }
}

console.log("\nDone. Your markdown files are now in Supabase.");
console.log("You can keep the posts/ folder as a backup, or delete it.");
