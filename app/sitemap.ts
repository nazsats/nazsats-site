import type { MetadataRoute } from "next";
import { getPublishedPosts } from "../lib/posts";

const BASE_URL = "https://nazsats.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/work`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.6 },
  ];

  // Blog posts — wrapped so a DB hiccup never breaks the sitemap build.
  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPublishedPosts();
    postRoutes = posts.map((p) => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
    // Supabase not configured yet — ship the static routes only.
  }

  return [...staticRoutes, ...postRoutes];
}
