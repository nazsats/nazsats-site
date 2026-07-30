"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../lib/supabase/server";
import { getServiceClient } from "../../../lib/supabase/service";
import { logActivity, type ActivityKind } from "../../../lib/activity";

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

const KINDS: ActivityKind[] = [
  "pr", "repo", "release", "post", "social",
  "project", "client", "coding", "learning",
];

/**
 * Quick capture. Deliberately minimal — a title, an optional link, and
 * optional notes. Everything else can be filled in at review time.
 */
export async function addEntry(formData: FormData) {
  await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const rawKind = String(formData.get("kind") ?? "project");
  const kind = (KINDS.includes(rawKind as ActivityKind) ? rawKind : "project") as ActivityKind;

  const url = String(formData.get("url") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // Optional back-date, so you can log something you did last week.
  const dateStr = String(formData.get("occurred_at") ?? "").trim();
  const occurred_at = dateStr ? new Date(dateStr).toISOString() : new Date().toISOString();

  await logActivity({
    kind,
    source: "manual",
    title,
    body,
    url: url || null,
    tags,
    occurred_at,
  });

  revalidatePath("/admin/log");
}

export async function toggleResumeWorthy(id: string, resume_worthy: boolean) {
  await requireUser();
  const supabase = getServiceClient();
  // Flagging an item also counts as reviewing it.
  const { error } = await supabase
    .from("activity")
    .update({ resume_worthy, reviewed: true })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/log");
}

export async function markReviewed(id: string) {
  await requireUser();
  const supabase = getServiceClient();
  const { error } = await supabase.from("activity").update({ reviewed: true }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/log");
}

export async function saveResumeBullet(id: string, resume_bullet: string) {
  await requireUser();
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("activity")
    .update({ resume_bullet: resume_bullet.trim() || null })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/log");
}

export async function deleteEntry(id: string) {
  await requireUser();
  const supabase = getServiceClient();
  const { error } = await supabase.from("activity").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/log");
}
