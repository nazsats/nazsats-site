import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "../../../lib/supabase/service";

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Caps so a bot can't push a multi-megabyte row into the table.
const LIMITS = { name: 120, email: 200, message: 5000 };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    if (
      name.length > LIMITS.name ||
      email.length > LIMITS.email ||
      message.length > LIMITS.message
    ) {
      return NextResponse.json({ error: "That message is too long." }, { status: 400 });
    }

    // Persist the lead. Read them in the Supabase dashboard under
    // Table Editor → contact_messages (newest first).
    try {
      const supabase = getServiceClient();
      const { error } = await supabase
        .from("contact_messages")
        .insert({ name, email, message });
      if (error) throw new Error(error.message);
    } catch (err) {
      // Never drop a lead silently. If the table is missing or Supabase is
      // down, put the whole submission in the server log so it is at least
      // recoverable from Vercel's logs, and still thank the sender.
      console.error(
        "[contact] could not save submission — falling back to log:",
        err instanceof Error ? err.message : err,
        JSON.stringify({ name, email, message })
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message received! We'll get back to you soon.",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
