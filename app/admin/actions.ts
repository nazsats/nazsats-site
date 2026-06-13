"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser, getServerSupabase } from "../../lib/supabase/server";
import { getServiceClient } from "../../lib/supabase/service";
import { generateDraft } from "../../lib/openai";
import { slugify } from "../../lib/posts";

/** Throws (redirects to login) if no user is signed in. */
async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

function refreshViews() {
  revalidatePath("/admin");
  revalidatePath("/blog");
}

export async function togglePublish(id: string, published: boolean) {
  await requireUser();
  const supabase = getServiceClient();
  const { error } = await supabase.from("posts").update({ published }).eq("id", id);
  if (error) throw new Error(error.message);
  refreshViews();
}

export async function deletePost(id: string) {
  await requireUser();
  const supabase = getServiceClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refreshViews();
}

/** Generate a draft with AI and save it as an unpublished post. */
export async function generateDraftAction(formData: FormData) {
  await requireUser();
  const topic = String(formData.get("topic") ?? "").trim();
  if (!topic) return;

  const draft = await generateDraft(topic);
  const supabase = getServiceClient();

  // Ensure a unique slug.
  let slug = slugify(draft.title);
  const { data: existing } = await supabase.from("posts").select("slug").eq("slug", slug).maybeSingle();
  if (existing) slug = `${slug}-${Date.now().toString().slice(-5)}`;

  const { error } = await supabase.from("posts").insert({
    slug,
    title: draft.title,
    description: draft.description,
    body: draft.body,
    tags: draft.tags,
    published: false,
  });
  if (error) throw new Error(error.message);
  refreshViews();
  redirect(`/admin/edit/${slug}`);
}

/** Create or update a post from the editor form. */
export async function savePost(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const published = formData.get("published") === "on";

  if (!title) throw new Error("Title is required");

  const supabase = getServiceClient();

  if (id) {
    const { error } = await supabase
      .from("posts")
      .update({ title, description, body, tags, published })
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const slug = `${slugify(title)}-${Date.now().toString().slice(-5)}`;
    const { error } = await supabase
      .from("posts")
      .insert({ slug, title, description, body, tags, published });
    if (error) throw new Error(error.message);
  }

  refreshViews();
  redirect("/admin");
}

export async function signOut() {
  const supabase = await getServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
