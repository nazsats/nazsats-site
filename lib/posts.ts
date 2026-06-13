import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const postsDir = path.join(process.cwd(), "posts");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  published: boolean;
};

export type Post = PostMeta & {
  /** Rendered HTML body */
  html: string;
};

function readPostFile(fileName: string): Post | null {
  const slug = fileName.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(postsDir, fileName), "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "",
    author: data.author ?? "Nazsats",
    tags: Array.isArray(data.tags) ? data.tags : [],
    published: data.published === true,
    html: marked.parse(content, { async: false }) as string,
  };
}

/** All published posts, newest first. Drafts (published: false) are hidden. */
export function getPublishedPosts(): Post[] {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map(readPostFile)
    .filter((p): p is Post => p !== null && p.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** A single published post by slug, or null if missing / still a draft. */
export function getPostBySlug(slug: string): Post | null {
  const file = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const post = readPostFile(`${slug}.md`);
  return post && post.published ? post : null;
}

export function getAllSlugs(): string[] {
  return getPublishedPosts().map((p) => p.slug);
}
