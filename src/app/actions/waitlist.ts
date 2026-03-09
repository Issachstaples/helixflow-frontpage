"use server";

/**
 * Waitlist Server Action
 * ─────────────────────────────────────────────────────────────
 * Validates a waitlist submission with Zod, then forwards the
 * data to an n8n webhook which handles all downstream logic
 * (email notifications, CRM writes, etc.).
 *
 * Environment variables:
 *   N8N_WAITLIST_WEBHOOK_URL — full URL of the n8n webhook trigger
 *                              e.g. https://n8n.helixflow.cloud/webhook/abc123
 *
 * Returns a discriminated union so the client renders the
 * correct state without any extra try/catch:
 *   { ok: true;  message: string }
 *   { ok: false; message: string; fieldErrors?: Record<string,string[]> }
 *
 * Error handling:
 *   - Missing webhook URL  → typed error (do not silently succeed)
 *   - Non-2xx response     → typed error with status code logged
 *   - Non-JSON / missing ok:true body → typed error
 *   - Network failure      → typed error
 */

import { waitlistSchema, type WaitlistInput } from "@/lib/validators/waitlist";

// ── Action result type ────────────────────────────────────────────────────────

export type WaitlistResult =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

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

  // ── 2. Require webhook URL ────────────────────────────────────────────────
  const webhookUrl = process.env.N8N_WAITLIST_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[waitlist] N8N_WAITLIST_WEBHOOK_URL is not set.");
    return {
      ok: false,
      message:
        "Waitlist submissions are not configured. Please contact hello@helixflow.cloud.",
    };
  }

  // ── 3. POST to n8n webhook ────────────────────────────────────────────────
  const payload = {
    name,
    email,
    company: company || null,
    role: role || null,
    submittedAt: new Date().toISOString(),
    source: "helixflow-marketing-site",
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error(`[waitlist] Webhook returned non-OK status ${res.status} ${res.statusText}`);
      return {
        ok: false,
        message:
          "Something went wrong submitting your request. Please try again or email hello@helixflow.cloud.",
      };
    }

    // Parse and validate the response body — n8n must respond with { ok: true }
    const rawBody = await res.text();
    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      console.error("[waitlist] Webhook response was not valid JSON:", rawBody);
      return {
        ok: false,
        message:
          "Something went wrong submitting your request. Please try again or email hello@helixflow.cloud.",
      };
    }

    if (
      typeof body !== "object" ||
      body === null ||
      (body as Record<string, unknown>).ok !== true
    ) {
      console.error("[waitlist] Webhook response missing ok:true. Received:", body);
      return {
        ok: false,
        message:
          "Something went wrong submitting your request. Please try again or email hello@helixflow.cloud.",
      };
    }
  } catch (err) {
    console.error("[waitlist] Webhook network error:", err);
    return {
      ok: false,
      message:
        "Something went wrong submitting your request. Please try again or email hello@helixflow.cloud.",
    };
  }

  return {
    ok: true,
    message: "You're on the list. We'll be in touch when your spot opens.",
  };
}
