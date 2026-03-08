"use server";

/**
 * Waitlist Server Action
 * ─────────────────────────────────────────────────────────────
 * Validates a waitlist submission and sends two emails via Resend:
 *
 *   1. Internal notification  → NOTIFY_EMAIL (your inbox)
 *   2. User confirmation      → the submitter's email address
 *
 * Environment variables (all required in production):
 *   RESEND_API_KEY   — Resend API key (starts with "re_")
 *   NOTIFY_EMAIL     — address to receive internal alerts
 *                      e.g. "hello@helixflow.cloud"
 *   FROM_EMAIL       — verified sender address in Resend
 *                      e.g. "HelixFlow <noreply@helixflow.cloud>"
 *
 * Returns a discriminated union so the client renders the
 * correct state without any extra try/catch:
 *   { ok: true;  message: string }
 *   { ok: false; message: string; fieldErrors?: Record<string,string[]> }
 *
 * Graceful degradation:
 *   If RESEND_API_KEY is missing (local dev without .env.local),
 *   the action logs to console and returns success so the form
 *   still works during development.
 */

import { Resend } from "resend";
import { waitlistSchema, type WaitlistInput } from "@/lib/validators/waitlist";

// ── Action result type ────────────────────────────────────────────────────────

export type WaitlistResult =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

// ── Email helpers ─────────────────────────────────────────────────────────────

/** Plain-text label for the role value */
const ROLE_LABELS: Record<string, string> = {
  "agency-owner": "Agency owner / founder",
  "account-manager": "Account manager / AM",
  "operations": "Operations lead",
  "freelancer": "Freelancer / consultant",
  "other": "Other",
};

function roleLabel(role?: string): string {
  if (!role) return "—";
  return ROLE_LABELS[role] ?? role;
}

/** Internal notification email sent to the team */
function internalEmailHtml(params: {
  name: string;
  email: string;
  company?: string;
  role?: string;
}): string {
  const { name, email, company, role } = params;
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;padding:0;background:#060D1A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060D1A;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:rgba(15,33,69,0.80);border:1px solid rgba(255,255,255,0.09);border-radius:16px;overflow:hidden;">
        <!-- Header bar -->
        <tr><td style="background:linear-gradient(90deg,#2DBBEE,#1466B8);height:3px;"></td></tr>
        <!-- Body -->
        <tr><td style="padding:32px 36px;">
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7A8FA8;">HelixFlow Waitlist</p>
          <h1 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#F7FBFF;">New signup 🎉</h1>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            ${row("Name", name)}
            ${row("Email", `<a href="mailto:${email}" style="color:#2DBBEE;">${email}</a>`)}
            ${row("Company", company || "—")}
            ${row("Role", roleLabel(role))}
          </table>
          <p style="margin:24px 0 0;font-size:12px;color:#3A4E68;">
            Submitted at ${new Date().toUTCString()}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 0;font-size:13px;font-weight:600;color:#7A8FA8;width:90px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0 8px 16px;font-size:13px;color:#B8C5D6;">${value}</td>
    </tr>`;
}

/** Confirmation email sent to the submitter */
function confirmationEmailHtml(name: string): string {
  const first = name.split(" ")[0];
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;padding:0;background:#060D1A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060D1A;padding:40px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:rgba(15,33,69,0.80);border:1px solid rgba(255,255,255,0.09);border-radius:16px;overflow:hidden;">
        <!-- Header bar -->
        <tr><td style="background:linear-gradient(90deg,#2DBBEE,#1466B8);height:3px;"></td></tr>
        <!-- Body -->
        <tr><td style="padding:36px 36px 32px;text-align:center;">
          <p style="margin:0 0 20px;font-size:28px;">⚡</p>
          <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#F7FBFF;">You&apos;re on the list, ${first}.</h1>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#7A8FA8;">
            We&apos;re opening HelixFlow to a small first cohort of agencies.<br />
            We&apos;ll be in touch when your spot opens.
          </p>
          <a href="https://helixflow.cloud" style="display:inline-block;background:#2DBBEE;color:#060D1A;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:999px;">
            Visit HelixFlow
          </a>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
          <p style="margin:0;font-size:11px;color:#3A4E68;">
            HelixFlow · A product of Newport E-commerce<br />
            <a href="https://helixflow.cloud" style="color:#3A4E68;">helixflow.cloud</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Server action ─────────────────────────────────────────────────────────────

export async function submitWaitlist(
  input: WaitlistInput
): Promise<WaitlistResult> {
  // ── 1. Validate ───────────────────────────────────────────────────────────
  const parsed = waitlistSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { name, email, company, role } = parsed.data;

  // ── 2. Graceful dev fallback ──────────────────────────────────────────────
  if (!process.env.RESEND_API_KEY) {
    console.warn("[waitlist] RESEND_API_KEY not set — logging submission only.");
    console.log("[waitlist]", { name, email, company: company || null, role: role || null });
    return {
      ok: true,
      message: "You're on the list. We'll be in touch when your spot opens.",
    };
  }

  // ── 3. Send emails via Resend ─────────────────────────────────────────────
  const resend = new Resend(process.env.RESEND_API_KEY);

  const FROM = process.env.FROM_EMAIL ?? "HelixFlow <noreply@helixflow.cloud>";
  const NOTIFY = process.env.NOTIFY_EMAIL ?? "hello@helixflow.cloud";

  try {
    // Fire both emails concurrently — internal notification + user confirmation
    const [internal, confirmation] = await Promise.all([
      resend.emails.send({
        from: FROM,
        to: NOTIFY,
        replyTo: email,
        subject: `New waitlist signup — ${name}`,
        html: internalEmailHtml({ name, email, company, role }),
      }),
      resend.emails.send({
        from: FROM,
        to: email,
        subject: "You're on the HelixFlow list.",
        html: confirmationEmailHtml(name),
      }),
    ]);

    // resend.emails.send() returns { data, error } instead of throwing —
    // check both results so API-level errors (e.g. invalid key, unverified
    // recipient in test mode) are surfaced rather than silently swallowed.
    const apiError = internal.error ?? confirmation.error;
    if (apiError) {
      console.error("[waitlist] Resend API error:", apiError);
      return {
        ok: false,
        message:
          "Something went wrong sending your request. Please try again or email hello@helixflow.cloud.",
      };
    }
  } catch (err) {
    console.error("[waitlist] Resend network error:", err);
    return {
      ok: false,
      message:
        "Something went wrong sending your request. Please try again or email hello@helixflow.cloud.",
    };
  }

  return {
    ok: true,
    message: "You're on the list. Check your inbox — a confirmation is on its way.",
  };
}
