import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { getServiceClient } from "./supabase/service";

// Allowlist for rendered blog HTML. marked does NOT sanitize, so we strip any
// scripts / event handlers / javascript: URLs before it reaches the page via
// dangerouslySetInnerHTML. sanitize-html is pure Node (no jsdom).
const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "ul", "ol", "li",
    "blockquote", "code", "pre", "strong", "em", "del", "hr", "br",
    "img", "span", "div", "table", "thead", "tbody", "tr", "th", "td", "input",
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    code: ["class"],
    span: ["class"],
    div: ["class"],
    input: ["type", "checked", "disabled"],
    th: ["align"],
    td: ["align"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
  },
};

export type PostRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  author: string;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Post = PostRow & {
  /** Rendered HTML body */
  html: string;
};

function toPost(row: PostRow): Post {
  const rawHtml = marked.parse(row.body, { async: false }) as string;
  const html = sanitizeHtml(rawHtml, sanitizeOptions);
  return { ...row, html };
}

/** All published posts, newest first. */
export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toPost);
}

/** A single published post by slug, or null if missing / still a draft. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data ? toPost(data as PostRow) : null;
}

/** Every post including drafts — admin only. */
export async function getAllPosts(): Promise<PostRow[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PostRow[];
}

/** A single post by slug regardless of published state — admin only. */
export async function getAnyPostBySlug(slug: string): Promise<PostRow | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as PostRow) ?? null;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}
