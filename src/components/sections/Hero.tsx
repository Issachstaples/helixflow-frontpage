"use client";

/**
 * Hero
 * ─────────────────────────────────────────────────────────────
 * Section 1 of the HelixFlow homepage.
 *
 * Layout:
 *   Mobile  — stacked: text block above, living-core visual below
 *   Desktop — two-column: text left (~55%), living core right (~45%)
 *
 * Motion:
 *   - Text column: staggered fade-up on mount (eyebrow → h1 → sub → CTAs → meta)
 *   - Living core panel: fade-in on mount (no y-movement — it's large)
 *   - HelixCore SVG: ambient breathing pulse, continuous
 *   - prefers-reduced-motion: all animation removed, full content visible
 *
 * Content:
 *   Static typed constants at top of file.
 *   To move to CMS: replace `HERO` with a prop or fetch — rendering unchanged.
 */

import { motion, useReducedMotion } from "framer-motion";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface HeroCTA {
    label: string;
    href: string;
    variant: "primary" | "secondary";
}

interface HeroMeta {
    label: string;
}

interface HeroContent {
    eyebrow: string;
    headlineTop: string;
    headlineAccent: string; // rendered in gradient
    headlineBottom: string;
    subCopy: string;
    ctas: HeroCTA[];
    meta: HeroMeta[];
    trustLine: string;
    trustStatus: "live" | "building";
}

// ── Static content ────────────────────────────────────────────────────────────
// Extract to CMS later — rendering loop below does not change.

const HERO: HeroContent = {
    eyebrow: "AI-assisted CRM for agencies",
    headlineTop: "Leads to delivery.",
    headlineAccent: "Then growth",
    headlineBottom: "on autopilot.",
    subCopy:
        "HelixFlow is a lightweight operating system for agency workflows — capturing leads, delivering work, and compounding client relationships without the admin overhead.",
    ctas: [
        { label: "Get early access", href: "#get-started", variant: "primary" },
        { label: "See how it works", href: "#lifecycle", variant: "secondary" },
    ],
    meta: [
        { label: "Pipeline" },
        { label: "Proposals" },
        { label: "AI Assist" },
        { label: "Growth Loop" },
    ],
    trustLine: "Currently in development",
    trustStatus: "building",
};

// ── Sub-components ─────────────────────────────────────────────────────────────

/** Eyebrow badge — frosted pill above the headline */
function EyebrowBadge({ text }: { text: string }) {
    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 backdrop-blur-sm">
            {/* Signal dot */}
            <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2DBBEE] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#2DBBEE]" />
            </span>
            <span className="text-xs font-medium tracking-wide text-hx-chrome">
                {text}
            </span>
        </div>
    );
}

/** Headline — multi-line with a gradient accent phrase */
function HeroHeadline({
    top,
    accent,
    bottom,
}: {
    top: string;
    accent: string;
    bottom: string;
}) {
    return (
        <h1 className="text-balance text-4xl font-semibold leading-[1.07] tracking-tight text-[#F7FBFF] sm:text-5xl lg:text-[3.75rem]">
            {top}{" "}
            <span
                className="bg-gradient-to-r from-[#F7FBFF] via-[#2DBBEE] to-[#1466B8] bg-clip-text text-transparent"
                aria-label={accent}
            >
                {accent}
            </span>{" "}
            {bottom}
        </h1>
    );
}

/** CTA button row */
function CTARow({ ctas }: { ctas: HeroCTA[] }) {
    return (
        <div className="flex flex-wrap gap-3">
            {ctas.map((cta) => (
                <a
                    key={cta.label}
                    href={cta.href}
                    className={cn(
                        "inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-150",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060D1A]",
                        cta.variant === "primary"
                            ? [
                                "bg-[#2DBBEE] text-[#060D1A]",
                                "shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset]",
                                "hover:bg-[#48c8f0]",
                                "hover:shadow-[0_0_0_1px_rgba(45,187,238,0.4),0_0_20px_rgba(45,187,238,0.15)]",
                                "motion-reduce:transition-none",
                            ]
                            : [
                                "border border-white/10 bg-white/5 text-hx-chrome backdrop-blur-sm",
                                "hover:border-white/20 hover:bg-white/8 hover:text-[#F7FBFF]",
                                "motion-reduce:transition-none",
                            ]
                    )}
                >
                    {cta.label}
                    {cta.variant === "secondary" && (
                        <svg
                            className="ml-1.5 h-3.5 w-3.5 opacity-60"
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
                    )}
                </a>
            ))}
        </div>
    );
}

/** Small module metadata tags below the CTAs */
function MetaTags({
    items,
    trustLine,
    trustStatus,
}: {
    items: HeroMeta[];
    trustLine: string;
    trustStatus: HeroContent["trustStatus"];
}) {
    return (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <div className="flex items-center gap-1.5">
                <span
                    className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        trustStatus === "live" ? "bg-emerald-400" : "bg-amber-400"
                    )}
                    aria-hidden="true"
                />
                <span className="text-xs text-hx-slate">{trustLine}</span>
            </div>
            <span className="text-hx-dim text-xs" aria-hidden="true">
                ·
            </span>
            {items.map((m, i) => (
                <span key={m.label} className="flex items-center gap-2">
                    <span className="text-xs text-hx-dim">{m.label}</span>
                    {i < items.length - 1 && (
                        <span className="text-hx-dim text-xs" aria-hidden="true">
                            /
                        </span>
                    )}
                </span>
            ))}
        </div>
    );
}

/**
 * HelixCore — the living visual on the right side of the hero.
 *
 * Composed of layered elements (back to front):
 *   1. Ambient radial glows
 *   2. Orbit rings (CSS rotation)
 *   3. Helix SVG paths (ambient breathing pulse via Framer Motion)
 *   4. Central glass orb
 *   5. Floating metric cards (depth layer)
 *
 * prefers-reduced-motion: all CSS animations and FM animations removed.
 * The static composition still reads as premium and intentional.
 */
function HelixCore({ reduced }: { reduced: boolean }) {
    return (
        <div
            className="relative flex items-center justify-center"
            aria-hidden="true"
            role="presentation"
        >
            {/* ── Outer glass panel ──────────────────────────────────────────── */}
            <div
                className={cn(
                    "relative h-[340px] w-full max-w-[480px] overflow-hidden rounded-3xl",
                    "border border-white/[0.07] border-t-white/[0.13]",
                    "bg-[rgba(15,33,69,0.55)] backdrop-blur-xl",
                    "shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_32px_80px_rgba(2,6,23,0.70)]",
                    "lg:h-[420px]"
                )}
            >
                {/* ── Background ambient glows ──────────────────────────────────── */}
                <div
                    className="pointer-events-none absolute inset-0"
                    aria-hidden="true"
                >
                    {/* Primary aqua glow — top-left */}
                    <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#2DBBEE]/10 blur-3xl" />
                    {/* Ocean depth glow — bottom-right */}
                    <div className="absolute -bottom-20 -right-12 h-72 w-72 rounded-full bg-[#1466B8]/12 blur-3xl" />
                    {/* Subtle center accent */}
                    <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2DBBEE]/05 blur-2xl" />
                </div>

                {/* ── Orbit rings ──────────────────────────────────────────────── */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    {/* Outer ring */}
                    <div
                        className={cn(
                            "absolute h-[280px] w-[280px] rounded-full",
                            "border border-white/[0.04]",
                            !reduced && "animate-[spin_32s_linear_infinite]",
                            "lg:h-[340px] lg:w-[340px]"
                        )}
                    >
                        {/* Ring dot */}
                        <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#2DBBEE]/60 shadow-[0_0_8px_rgba(45,187,238,0.6)]" />
                    </div>
                    {/* Mid ring */}
                    <div
                        className={cn(
                            "absolute h-[200px] w-[200px] rounded-full",
                            "border border-white/[0.06]",
                            !reduced && "animate-[spin_20s_linear_infinite_reverse]",
                            "lg:h-[250px] lg:w-[250px]"
                        )}
                    >
                        {/* Ring dot */}
                        <div className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#B8C5D6]/50" />
                    </div>
                </div>

                {/* ── Helix SVG core ───────────────────────────────────────────── */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={reduced ? "live" : "rest"}
                        animate="live"
                        variants={
                            reduced
                                ? {}
                                : {
                                    rest: { scale: 1, opacity: 0.85 },
                                    live: {
                                        scale: [1, 1.015, 1],
                                        opacity: [0.85, 1, 0.85],
                                        transition: {
                                            duration: 8,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        },
                                    },
                                }
                        }
                    >
                        <svg
                            width="88"
                            height="88"
                            viewBox="0 0 48 48"
                            fill="none"
                            className="drop-shadow-[0_0_16px_rgba(45,187,238,0.35)]"
                        >
                            {/* Outer helix path A */}
                            <path
                                d="M14.4 14.8c5.2-4.4 13.8-4.4 19.2 0 4.4 3.6 2.4 8.6-2.4 11.6-2.2 1.4-4.8 2.6-7.6 4-3.2 1.6-6.2 3.2-8.2 5.2-4.4 4.2-1.2 9.6 4.6 10.6 4 .8 8.4-.4 11.6-3"
                                stroke="url(#helix-grad-a)"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                            />
                            {/* Inner helix path B */}
                            <path
                                d="M33.6 33.2c-5.2 4.4-13.8 4.4-19.2 0-4.4-3.6-2.4-8.6 2.4-11.6 2.2-1.4 4.8-2.6 7.6-4 3.2-1.6 6.2-3.2 8.2-5.2 4.4-4.2 1.2-9.6-4.6-10.6-4-.8-8.4.4-11.6 3"
                                stroke="url(#helix-grad-b)"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                opacity="0.75"
                            />
                            <defs>
                                <linearGradient
                                    id="helix-grad-a"
                                    x1="12"
                                    y1="12"
                                    x2="36"
                                    y2="40"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#2DBBEE" />
                                    <stop offset="1" stopColor="#1466B8" stopOpacity="0.6" />
                                </linearGradient>
                                <linearGradient
                                    id="helix-grad-b"
                                    x1="36"
                                    y1="36"
                                    x2="12"
                                    y2="8"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#B8C5D6" stopOpacity="0.9" />
                                    <stop offset="1" stopColor="#2DBBEE" stopOpacity="0.3" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </motion.div>
                </div>

                {/* ── Central glass orb ────────────────────────────────────────── */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-[100px] w-[100px] rounded-full border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent backdrop-blur-sm lg:h-[120px] lg:w-[120px]" />
                </div>

                {/* ── Floating metric cards ─────────────────────────────────────── */}
                {/* Pipeline card — top-left */}
                <FloatingMetricCard
                    className="absolute left-5 top-7 lg:left-6 lg:top-8"
                    label="Pipeline"
                    value="12 active"
                    delta="+3 this week"
                    deltaPositive
                    delay={reduced ? 0 : 0.6}
                    reduced={reduced}
                />

                {/* AI Assist card — bottom-right */}
                <FloatingMetricCard
                    className="absolute bottom-7 right-5 lg:bottom-8 lg:right-6"
                    label="AI Assist"
                    value="Follow-up sent"
                    delta="2 min ago"
                    deltaPositive={null}
                    delay={reduced ? 0 : 0.75}
                    reduced={reduced}
                />

                {/* Proposal card — bottom-left */}
                <FloatingMetricCard
                    className="absolute bottom-20 left-4 lg:bottom-24 lg:left-5"
                    label="Proposal"
                    value="Signed ✓"
                    delta="Acme Agency"
                    deltaPositive={null}
                    delay={reduced ? 0 : 0.9}
                    reduced={reduced}
                    small
                />

                {/* ── Chrome top-edge shine ─────────────────────────────────────── */}
                <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    aria-hidden="true"
                />
            </div>
        </div>
    );
}

/** Small floating status card — composited into HelixCore */
function FloatingMetricCard({
    label,
    value,
    delta,
    deltaPositive,
    className,
    delay,
    reduced,
    small = false,
}: {
    label: string;
    value: string;
    delta: string;
    deltaPositive: boolean | null; // null = neutral
    className?: string;
    delay: number;
    reduced: boolean;
    small?: boolean;
}) {
    return (
        <motion.div
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
                reduced
                    ? { duration: 0 }
                    : { duration: duration.base, ease: ease.outSoft, delay }
            }
            className={cn(
                "rounded-xl border border-white/[0.08] border-t-white/[0.14] bg-[rgba(15,33,69,0.75)] backdrop-blur-md",
                "shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_8px_24px_rgba(2,6,23,0.45)]",
                small ? "px-2.5 py-2" : "px-3 py-2.5",
                className
            )}
        >
            <p
                className={cn(
                    "font-medium text-hx-chrome",
                    small ? "text-[10px]" : "text-[11px]"
                )}
            >
                {label}
            </p>
            <p
                className={cn(
                    "font-semibold text-[#F7FBFF]",
                    small ? "text-xs" : "text-sm"
                )}
            >
                {value}
            </p>
            {delta && (
                <p
                    className={cn(
                        small ? "text-[9px]" : "text-[10px]",
                        deltaPositive === true
                            ? "text-emerald-400"
                            : deltaPositive === false
                                ? "text-red-400"
                                : "text-hx-slate"
                    )}
                >
                    {delta}
                </p>
            )}
        </motion.div>
    );
}

// ── Section export ─────────────────────────────────────────────────────────────

export default function Hero() {
    const reduced = useReducedMotion() ?? false;

    // Timing ladder for text block entrances (seconds from mount)
    const t = {
        eyebrow: 0.05,
        headline: 0.18,
        sub: 0.32,
        ctas: 0.44,
        meta: 0.54,
    };

    return (
        <section
            id="hero"
            className={cn(
                "relative overflow-hidden",
                // Page background + hero radial gradient
                "bg-[#060D1A]"
            )}
            aria-label="HelixFlow hero"
        >
            {/* ── Page-level background radials ──────────────────────────────── */}
            <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
            >
                <div className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-[#2DBBEE]/[0.07] blur-[120px]" />
                <div className="absolute -right-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-[#1466B8]/[0.09] blur-[120px]" />
            </div>

            {/* ── Content ─────────────────────────────────────────────────────── */}
            <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
                <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">

                    {/* ── Left: text column ──────────────────────────────────────── */}
                    <div className="flex flex-col gap-6 lg:max-w-[560px]">

                        {/* Eyebrow */}
                        <motion.div
                            initial={reduced ? false : { opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={
                                reduced
                                    ? { duration: 0 }
                                    : { duration: duration.base, ease: ease.out, delay: t.eyebrow }
                            }
                        >
                            <EyebrowBadge text={HERO.eyebrow} />
                        </motion.div>

                        {/* Headline */}
                        <motion.div
                            initial={reduced ? false : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={
                                reduced
                                    ? { duration: 0 }
                                    : { duration: duration.slow, ease: ease.outSoft, delay: t.headline }
                            }
                        >
                            <HeroHeadline
                                top={HERO.headlineTop}
                                accent={HERO.headlineAccent}
                                bottom={HERO.headlineBottom}
                            />
                        </motion.div>

                        {/* Sub-copy */}
                        <motion.p
                            className="max-w-[480px] text-pretty text-base leading-relaxed text-hx-slate sm:text-lg"
                            initial={reduced ? false : { opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={
                                reduced
                                    ? { duration: 0 }
                                    : { duration: duration.base, ease: ease.out, delay: t.sub }
                            }
                        >
                            {HERO.subCopy}
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={reduced ? false : { opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={
                                reduced
                                    ? { duration: 0 }
                                    : { duration: duration.base, ease: ease.out, delay: t.ctas }
                            }
                        >
                            <CTARow ctas={HERO.ctas} />
                        </motion.div>

                        {/* Meta tags */}
                        <motion.div
                            initial={reduced ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={
                                reduced
                                    ? { duration: 0 }
                                    : { duration: duration.base, ease: ease.out, delay: t.meta }
                            }
                        >
                            <MetaTags
                                items={HERO.meta}
                                trustLine={HERO.trustLine}
                                trustStatus={HERO.trustStatus}
                            />
                        </motion.div>
                    </div>

                    {/* ── Right: living core visual ──────────────────────────────── */}
                    <motion.div
                        className="w-full lg:w-[460px] xl:w-[500px]"
                        initial={reduced ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={
                            reduced
                                ? { duration: 0 }
                                : { duration: duration.slow, ease: ease.outSoft, delay: 0.3 }
                        }
                    >
                        <HelixCore reduced={reduced} />
                    </motion.div>

                </div>
            </div>

            {/* ── Bottom fade to next section ─────────────────────────────────── */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#060D1A] to-transparent"
                aria-hidden="true"
            />
        </section>
    );
}
