"use client";

/**
 * WaitlistForm
 * ─────────────────────────────────────────────────────────────
 * Waitlist signup form for the CTABanner section.
 *
 * Stack:
 *   - React Hook Form for form state + submission
 *   - Zod schema (shared with server action) for client validation
 *   - @hookform/resolvers/zod for the bridge
 *   - Server action `submitWaitlist` for persistence
 *
 * States:
 *   idle     — default form, all fields visible
 *   loading  — submit button shows spinner, fields disabled
 *   success  — form replaced with a confirmation message
 *   error    — inline field errors + a top-level error banner
 *
 * Accessibility:
 *   - All inputs have visible <label> elements
 *   - aria-describedby on inputs wired to error messages
 *   - aria-invalid on inputs with errors
 *   - Focus is moved to the success message on submission
 *   - All focus rings use ring-[#2DBBEE]
 */

import { useRef, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
    submitWaitlist,
    waitlistSchema,
    type WaitlistInput,
    type WaitlistResult,
} from "@/app/actions/waitlist";
import { useState } from "react";

// ── Role options ──────────────────────────────────────────────────────────────

const ROLE_OPTIONS = [
    { value: "", label: "Role (optional)" },
    { value: "agency-owner", label: "Agency owner / founder" },
    { value: "account-manager", label: "Account manager / AM" },
    { value: "operations", label: "Operations lead" },
    { value: "freelancer", label: "Freelancer / consultant" },
    { value: "other", label: "Other" },
] as const;

// ── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
    id,
    label,
    error,
    required,
    children,
}: {
    id: string;
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={id}
                className="text-sm font-medium text-[#B8C5D6]"
            >
                {label}
                {required && (
                    <span className="ml-1 text-[#2DBBEE]" aria-hidden="true">*</span>
                )}
            </label>
            {children}
            {error && (
                <p
                    id={`${id}-error`}
                    role="alert"
                    className="text-xs text-red-400"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

// ── Input base classes ────────────────────────────────────────────────────────

const inputBase = cn(
    "w-full rounded-xl px-4 py-3 text-sm",
    "bg-[rgba(15,33,69,0.60)] backdrop-blur-sm",
    "border border-white/[0.10] text-[#F7FBFF] placeholder:text-[#3A4E68]",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/70 focus-visible:border-[#2DBBEE]/40",
    "disabled:cursor-not-allowed disabled:opacity-50"
);

// ── Success state ─────────────────────────────────────────────────────────────

function SuccessMessage({ message }: { message: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        ref.current?.focus();
    }, []);

    return (
        <div
            ref={ref}
            tabIndex={-1}
            className="flex flex-col items-center gap-4 py-6 text-center focus-visible:outline-none"
            role="status"
            aria-live="polite"
        >
            {/* Check icon */}
            <div
                className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full",
                    "bg-[rgba(45,187,238,0.12)] border border-[#2DBBEE]/30"
                )}
            >
                <svg
                    className="h-7 w-7 text-[#2DBBEE]"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            <div>
                <p className="text-lg font-semibold text-[#F7FBFF]">You&apos;re on the list.</p>
                <p className="mt-1 text-sm text-[#7A8FA8]">{message}</p>
            </div>
        </div>
    );
}

// ── Main form ─────────────────────────────────────────────────────────────────

export default function WaitlistForm() {
    const [result, setResult] = useState<WaitlistResult | null>(null);
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<WaitlistInput>({
        resolver: zodResolver(waitlistSchema),
        defaultValues: { name: "", email: "", company: "", role: "" },
    });

    const onSubmit = (data: WaitlistInput) => {
        startTransition(async () => {
            const res = await submitWaitlist(data);
            setResult(res);
        });
    };

    // ── Success state ───────────────────────────────────────────────────────────
    if (result?.ok) {
        return <SuccessMessage message={result.message} />;
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-label="Join the HelixFlow waitlist"
            className="flex flex-col gap-4 text-left"
        >
            {/* Server-level error banner */}
            {result && !result.ok && (
                <div
                    role="alert"
                    className={cn(
                        "rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3",
                        "text-sm text-red-400"
                    )}
                >
                    {result.message}
                </div>
            )}

            {/* Name + Email — side by side on sm+ */}
            <div className="grid gap-4 sm:grid-cols-2">
                <Field id="name" label="Name" error={errors.name?.message} required>
                    <input
                        {...register("name")}
                        id="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Alex Rivera"
                        disabled={isPending}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        className={cn(inputBase, errors.name && "border-red-500/50 focus-visible:ring-red-500/50")}
                    />
                </Field>

                <Field id="email" label="Email" error={errors.email?.message} required>
                    <input
                        {...register("email")}
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="alex@agency.com"
                        disabled={isPending}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        className={cn(inputBase, errors.email && "border-red-500/50 focus-visible:ring-red-500/50")}
                    />
                </Field>
            </div>

            {/* Company + Role — side by side on sm+ */}
            <div className="grid gap-4 sm:grid-cols-2">
                <Field id="company" label="Company" error={errors.company?.message}>
                    <input
                        {...register("company")}
                        id="company"
                        type="text"
                        autoComplete="organization"
                        placeholder="Newport Agency (optional)"
                        disabled={isPending}
                        aria-invalid={!!errors.company}
                        aria-describedby={errors.company ? "company-error" : undefined}
                        className={inputBase}
                    />
                </Field>

                <Field id="role" label="Role" error={errors.role?.message}>
                    <select
                        {...register("role")}
                        id="role"
                        disabled={isPending}
                        aria-invalid={!!errors.role}
                        aria-describedby={errors.role ? "role-error" : undefined}
                        className={cn(inputBase, "cursor-pointer appearance-none")}
                    >
                        {ROLE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </Field>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isPending}
                className={cn(
                    "group relative mt-2 inline-flex w-full items-center justify-center gap-2 overflow-hidden",
                    "rounded-full px-8 py-3.5",
                    "text-sm font-semibold text-[#060D1A]",
                    "bg-[#2DBBEE]",
                    "shadow-[0_1px_0_0_rgba(255,255,255,0.35)_inset,0_8px_32px_rgba(45,187,238,0.30)]",
                    "transition-all duration-200",
                    "hover:bg-[#3EC8F5] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.40)_inset,0_12px_40px_rgba(45,187,238,0.45)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060D1A]",
                    "active:scale-[0.98]",
                    "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#2DBBEE]"
                )}
            >
                {/* Sweep shimmer */}
                <span
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full"
                    aria-hidden="true"
                />

                {isPending ? (
                    <>
                        <svg
                            className="h-4 w-4 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                        <span className="relative">Submitting…</span>
                    </>
                ) : (
                    <>
                        <span className="relative">Request early access</span>
                        <svg
                            className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                            viewBox="0 0 16 16"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M3 8h10M9 4l4 4-4 4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </>
                )}
            </button>

            <p className="text-center text-[11px] text-[#3A4E68]">
                No payment required. No spam. Unsubscribe anytime.
            </p>
        </form>
    );
}
