/**
 * Shared Zod schema for waitlist submissions.
 *
 * Imported by:
 *   - src/components/sections/WaitlistForm.tsx  (client, zodResolver)
 *   - src/app/actions/waitlist.ts               (server action, safeParse)
 *
 * This file must stay a plain module with no "use server" / "use client"
 * directive so it is safe to import on both sides of the boundary.
 */

import { z } from "zod";

export const waitlistSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(80, "Name is too long"),
    email: z
        .string()
        .email("Enter a valid email address"),
    company: z
        .string()
        .max(100, "Company name is too long")
        .optional()
        .or(z.literal("")),
    role: z
        .string()
        .max(80, "Role is too long")
        .optional()
        .or(z.literal("")),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
