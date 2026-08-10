"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../lib/supabase/server";
import { deleteSession } from "../../../lib/coding";

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** Drop a mis-logged session — e.g. a stopwatch left running overnight. */
export async function removeSession(id: string) {
  await requireUser();
  await deleteSession(id);

  revalidatePath("/admin/coding");
  // The homepage chart counts these minutes too.
  revalidatePath("/");
}
