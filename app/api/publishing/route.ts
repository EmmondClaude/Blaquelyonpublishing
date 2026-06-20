import { NextResponse } from "next/server";
import { publishingInquirySchema } from "@/lib/validation";

/**
 * Server-side handler for publishing inquiries. The client already validated with
 * the same schema, but we NEVER trust the client — re-validate here. Any real
 * delivery key (Resend, Postmark, a CRM webhook) is read from server env only and
 * must never be exposed as NEXT_PUBLIC_.
 */
export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = publishingInquirySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the form and try again.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const { honeypot, ...inquiry } = parsed.data;

  // Spam guard: a human never fills the honeypot. Pretend success, drop silently.
  if (honeypot) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // ── Delivery seam ──────────────────────────────────────────────────────────
  // Wire one of these when Emmond confirms the inbox + provider:
  //
  //   const key = process.env.RESEND_API_KEY;           // server-only, never NEXT_PUBLIC_
  //   await resend.emails.send({ to: brand.inquiryInbox, ... });
  //
  // Until then, log on the server so nothing is lost in development.
  console.info("[publishing-inquiry]", {
    name: inquiry.name,
    email: inquiry.email,
    role: inquiry.role,
    at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}

// Only POST is allowed.
export function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
