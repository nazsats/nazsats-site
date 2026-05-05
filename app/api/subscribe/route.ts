import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // TODO: Plug in a mailing list service here, e.g. Resend Audiences / Mailchimp:
    // import { Resend } from "resend";
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.contacts.create({
    //   email,
    //   audienceId: process.env.RESEND_AUDIENCE_ID!,
    // });

    console.log("New subscriber:", email);

    return NextResponse.json({ success: true, message: "You're subscribed! We'll keep you updated." });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 });
  }
}