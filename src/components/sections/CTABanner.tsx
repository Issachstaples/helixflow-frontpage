"use client";

/**
 * CTABanner
 * ─────────────────────────────────────────────────────────────
 * Section 9 — Final conversion moment
 *
 * Purpose:
 *   Close the page with a premium, decisive invitation to enter
 *   the system. Primary action is early access / beta interest.
 *   Secondary action is product updates / stay informed.
 *
 * Design intent:
 *   "Entering the operating layer" — not a loud marketing shout,
 *   but a confident, quiet invitation. The visual is a centred
 *   glass panel floating above a deep radial gradient — the
 *   feeling of stepping into an active system.
 *
 * Structure:
 *   1. Ambient radial light source — the "core" beneath the panel
 *   2. Glass panel — headline, sub, dual CTA row
 *   3. Trust line — supporting reassurance beneath the buttons
 *   4. Subtle grid overlay — reinforces the command-layer aesthetic
 *
 * CTA hierarchy:
 *   Primary   — "Request early access" → opens mailto or waitlist
 *   Secondary — "Get product updates"  → lighter ghost treatment
 *
 * Motion:
 *   Single AnimateIn on the panel — fadeUpSlow, fires once.
 *   Core glow: CSS radial breathing via keyframe — imperceptible
 *   as animation, makes the page feel alive at rest.
 *   prefers-reduced-motion: AnimateIn handles entrance;
 *   glow animation paused via motion-reduce.
 *
 * Content:
 *   All copy defined in the typed COPY object at the top of this file.
 *   To connect to a real form/waitlist: swap the `href` values on the
 *   CTA_ACTIONS array items. Rendering is unchanged.
 */

import AnimateIn from "@/components/primitives/AnimateIn";
import WaitlistForm from "@/components/sections/WaitlistForm";
import { fadeUp, fadeUpSlow } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CTAAction {
    id: string;
    label: string;
    href: string;
    /** "primary" renders as the filled aqua button; "secondary" as ghost */
    variant: "primary" | "secondary";
    /** Accessible label for screen readers when label alone isn't descriptive */
    ariaLabel?: string;
    /** Opens in new tab */
    external?: boolean;
}

// ── Content ───────────────────────────────────────────────────────────────────

const COPY = {
    eyebrow: "Early access",
    headline: "HelixFlow is building.",
    headlineAccent: "Get in early.",
    sub: "We're opening access to a small first cohort of agencies and service businesses. Join the list and we'll be in touch when your spot opens.",
    trustLine: "No payment required. No spam. Unsubscribe anytime.",
} as const;

const CTA_ACTIONS: CTAAction[] = [
    {
        id: "early-access",
        label: "Request early access",
        href: "mailto:hello@helixflow.cloud?subject=Early Access Request",
        variant: "primary",
        ariaLabel: "Request early access to HelixFlow",
    },
    {
        id: "updates",
        label: "Get product updates",
        href: "mailto:hello@helixflow.cloud?subject=Product Updates",
        variant: "secondary",
        ariaLabel: "Sign up for HelixFlow product updates",
    },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

/** The grid dot overlay — reinforces command-layer aesthetic */
function GridOverlay() {
    return (
        <div
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
            aria-hidden="true"
        >
            <svg
                className="absolute inset-0 h-full w-full opacity-[0.025]"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern
                        id="cta-grid"
                        width="32"
                        height="32"
                        patternUnits="userSpaceOnUse"
                    >
                        <circle cx="0.5" cy="0.5" r="0.5" fill="#B8C5D6" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cta-grid)" />
            </svg>
        </div>
    );
}

/** Primary CTA button — aqua fill with inner shine */
function PrimaryButton({ action }: { action: CTAAction }) {
    return (
        <a
            href={action.href}
            aria-label={action.ariaLabel ?? action.label}
            {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={cn(
                "group relative inline-flex items-center justify-center gap-2 overflow-hidden",
                "rounded-full px-7 py-3",
                "text-sm font-semibold text-[#060D1A]",
                "bg-[#2DBBEE]",
                // Inner top shine
                "shadow-[0_1px_0_0_rgba(255,255,255,0.35)_inset,0_8px_32px_rgba(45,187,238,0.30)]",
                "transition-all duration-200",
                "hover:bg-[#3EC8F5] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.40)_inset,0_12px_40px_rgba(45,187,238,0.45)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060D1A]",
                "active:scale-[0.98]"
            )}
        >
            {/* Sweep shimmer on hover */}
            <span
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full"
                aria-hidden="true"
            />
            <span className="relative">{action.label}</span>
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
        </a>
    );
}

/** Secondary CTA button — ghost glass treatment */
function SecondaryButton({ action }: { action: CTAAction }) {
    return (
        <a
            href={action.href}
            aria-label={action.ariaLabel ?? action.label}
            {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={cn(
                "group inline-flex items-center justify-center gap-2",
                "rounded-full border border-white/[0.14] bg-white/[0.05] px-7 py-3",
                "text-sm font-medium text-[#B8C5D6] backdrop-blur-sm",
                "transition-all duration-200",
                "hover:border-white/[0.24] hover:bg-white/[0.09] hover:text-[#F7FBFF]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060D1A]",
                "active:scale-[0.98]"
            )}
        >
            {action.label}
        </a>
    );
}

// ── Section export ─────────────────────────────────────────────────────────────

export default function CTABanner() {
    return (
        <section
            id="cta"
            aria-labelledby="cta-heading"
            className="relative bg-[#060D1A] py-20 sm:py-28 lg:py-32"
        >
            {/* ── Deep radial light source — the "core" beneath the panel ── */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
                {/* Outer diffuse bloom */}
                <div
                    className="h-[700px] w-[700px] rounded-full motion-reduce:[animation-play-state:paused]"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, rgba(45,187,238,0.07) 0%, rgba(20,102,184,0.05) 40%, transparent 70%)",
                        animation: "cta-breathe 7s ease-in-out infinite",
                    }}
                />
            </div>

            {/* ── Keyframe for the breathing glow ─────────────────────────── */}
            <style>{`
        @keyframes cta-breathe {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.06); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cta-glow { animation: none !important; }
        }
      `}</style>

            <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <AnimateIn variants={fadeUpSlow} threshold={0.15}>
                    {/* ── Glass panel ────────────────────────────────────────── */}
                    <div
                        className={cn(
                            "relative overflow-hidden rounded-2xl px-6 py-12 text-center sm:px-12 sm:py-16",
                            "border border-white/[0.07] border-t-white/[0.14]",
                            "bg-[rgba(15,33,69,0.60)] backdrop-blur-2xl",
                            "shadow-[0_1px_0_0_rgba(255,255,255,0.07)_inset,0_32px_80px_rgba(2,6,23,0.70)]"
                        )}
                    >
                        <GridOverlay />

                        {/* Corner glints */}
                        <div
                            className="pointer-events-none absolute -left-24 -top-24 h-48 w-48 rounded-full"
                            style={{ background: "radial-gradient(circle, rgba(45,187,238,0.08), transparent 65%)" }}
                            aria-hidden="true"
                        />
                        <div
                            className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full"
                            style={{ background: "radial-gradient(circle, rgba(129,140,248,0.07), transparent 65%)" }}
                            aria-hidden="true"
                        />

                        {/* Top chrome line */}
                        <div
                            className="pointer-events-none absolute inset-x-0 top-0 h-px"
                            style={{
                                background:
                                    "linear-gradient(90deg, transparent 5%, rgba(45,187,238,0.50) 35%, rgba(129,140,248,0.35) 65%, transparent 95%)",
                            }}
                            aria-hidden="true"
                        />

                        {/* ── Content ────────────────────────────────────────────── */}
                        <div className="relative">

                            {/* Eyebrow */}
                            <AnimateIn variants={fadeUp} delay={0.08} threshold={0.1}>
                                <div className="mb-5 flex items-center justify-center">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5">
                                        {/* Pulsing online dot */}
                                        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2DBBEE] opacity-60 motion-reduce:animate-none" />
                                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#2DBBEE]" />
                                        </span>
                                        <span className="text-xs font-medium tracking-wide text-[#B8C5D6]">
                                            {COPY.eyebrow}
                                        </span>
                                    </div>
                                </div>
                            </AnimateIn>

                            {/* Headline */}
                            <AnimateIn variants={fadeUpSlow} delay={0.14} threshold={0.1}>
                                <h2
                                    id="cta-heading"
                                    className="text-balance text-3xl font-semibold tracking-tight text-[#F7FBFF] sm:text-4xl lg:text-5xl"
                                >
                                    {COPY.headline}{" "}
                                    <span
                                        className="bg-gradient-to-r from-[#2DBBEE] to-[#818cf8] bg-clip-text text-transparent"
                                    >
                                        {COPY.headlineAccent}
                                    </span>
                                </h2>
                            </AnimateIn>

                            {/* Sub copy */}
                            <AnimateIn variants={fadeUp} delay={0.22} threshold={0.1}>
                                <p className="mx-auto mt-5 max-w-[44ch] text-pretty text-base leading-relaxed text-[#7A8FA8] sm:text-lg">
                                    {COPY.sub}
                                </p>
                            </AnimateIn>

                            {/* Waitlist form — replaces mailto CTA row */}
                            <AnimateIn variants={fadeUp} delay={0.30} threshold={0.1}>
                                <div className="mt-8">
                                    <WaitlistForm />
                                </div>
                            </AnimateIn>

                        </div>
                    </div>
                </AnimateIn>
            </div>

            {/* No bottom fade — this is the last section before the footer */}
        </section>
    );
}
