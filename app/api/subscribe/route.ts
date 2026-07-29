import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "../../../lib/supabase/service";

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!EMAIL_RE.test(email) || email.length > 200) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Store the subscriber. `email` is unique, so a repeat signup is ignored
    // rather than erroring — the visitor sees the same friendly confirmation.
    try {
      const supabase = getServiceClient();
      const { error } = await supabase
        .from("subscribers")
        .upsert({ email, source: "homepage" }, { onConflict: "email" });
      if (error) throw new Error(error.message);
    } catch (err) {
      console.error(
        "[subscribe] could not save subscriber — falling back to log:",
        err instanceof Error ? err.message : err,
        email
      );
    }

    return NextResponse.json({
      success: true,
      message: "You're subscribed! We'll keep you updated.",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
