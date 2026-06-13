"use client";

import { createBrowserClient } from "@supabase/ssr";

/** Supabase client for use in client components (login form). */
export function getBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
