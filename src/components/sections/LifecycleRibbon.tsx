"use client";

/**
 * LifecycleRibbon
 * ─────────────────────────────────────────────────────────────
 * Section 2 — Leads → Delivery → Growth
 *
 * Renders the three-phase HelixFlow lifecycle as a connected
 * system rail: a horizontal flow path on desktop, vertical stack
 * on mobile, with staggered in-view entrances.
 *
 * Layout:
 *   Mobile  — vertical stack, downward connector between phases
 *   Desktop — horizontal three-column with SVG flow rail
 *
 * Motion:
 *   - Section label + sub: fadeUp on viewport entry
 *   - Phase cards: staggered fadeUp (left → right / top → bottom)
 *   - SVG connector rail: pathLength draw after cards land
 *   - Floating icon orbs on each card: subtle ambient scale pulse
 *   - prefers-reduced-motion: instant appearance, no draws, no pulses
 *
 * Content:
 *   Typed LIFECYCLE_PHASES array at top of file.
 *   To move to CMS: replace array with a prop/fetch — rendering unchanged.
 */

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PhaseCapability {
    label: string;
}

interface LifecyclePhase {
    id: "leads" | "delivery" | "growth";
    index: string;        // "01" "02" "03"
    phase: string;        // display phase label
    headline: string;     // short benefit headline
    description: string;  // 2–3 sentence body
    capabilities: PhaseCapability[];
    accent: {
        from: string;       // tailwind-compatible hex
        to: string;
        glow: string;       // rgba for box-shadow glow
    };
    icon: React.ReactNode;
}

// ── Static content ─────────────────────────────────────────────────────────────
// Extract to CMS later — rendering loop below does not change.

const LIFECYCLE_PHASES: LifecyclePhase[] = [
    {
        id: "leads",
        index: "01",
        phase: "Leads",
        headline: "Capture and qualify without the chaos.",
        description:
            "Every inbound lead enters a structured pipeline — tagged, scored, and ready for action. No spreadsheet juggling, no dropped follow-ups.",
        capabilities: [
            { label: "Pipeline board" },
            { label: "Lead scoring" },
            { label: "Auto follow-up" },
            { label: "Contact history" },
        ],
        accent: { from: "#2DBBEE", to: "#1466B8", glow: "rgba(45,187,238,0.18)" },
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                    d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
    {
        id: "delivery",
        index: "02",
        phase: "Delivery",
        headline: "Proposals, onboarding, and execution in one flow.",
        description:
            "Generate proposals from intake. Onboard clients with automated checklists. Run projects without switching tools — from signed to delivered inside HelixFlow.",
        capabilities: [
            { label: "AI proposals" },
            { label: "Client onboarding" },
            { label: "Project tracking" },
            { label: "Milestone alerts" },
        ],
        accent: { from: "#6366f1", to: "#4f46e5", glow: "rgba(99,102,241,0.18)" },
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138Z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
    {
        id: "growth",
        index: "03",
        phase: "Growth",
        headline: "Turn outcomes into compounding momentum.",
        description:
            "After delivery, HelixFlow triggers retention loops — automated check-ins, upsell prompts, and referral nudges that run without you thinking about them.",
        capabilities: [
            { label: "Retention loops" },
            { label: "Upsell triggers" },
            { label: "Referral nudges" },
            { label: "AI summaries" },
        ],
        accent: { from: "#10b981", to: "#059669", glow: "rgba(16,185,129,0.18)" },
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                    d="M13 7h8m0 0v8m0-8-8 8-4-4-6 6"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
];

// ── Section heading content ──────────────────────────────────────────────────

const SECTION_COPY = {
    eyebrow: "How it works",
    headline: "One system. Three phases. No gaps.",
    sub: "HelixFlow maps to the way service businesses actually operate — from the first inbound inquiry to a compounding client relationship.",
} as const;

// ── Sub-components ────────────────────────────────────────────────────────────

/** Phase index + icon orb */
function PhaseOrb({
    index,
    icon,
    accent,
    reduced,
}: {
    index: string;
    icon: React.ReactNode;
    accent: LifecyclePhase["accent"];
    reduced: boolean;
}) {
    return (
        <div className="relative flex-shrink-0">
            {/* Outer glow ring */}
            <div
                className="absolute inset-0 rounded-2xl"
                style={{ boxShadow: `0 0 0 1px ${accent.glow}, 0 0 24px ${accent.glow}` }}
                aria-hidden="true"
            />
            {/* Orb body */}
            <motion.div
                className={cn(
                    "relative flex h-12 w-12 items-center justify-center rounded-2xl",
                    "border border-white/10 border-t-white/[0.18]",
                    "bg-[rgba(15,33,69,0.70)] backdrop-blur-md",
                    "shadow-[0_1px_0_0_rgba(255,255,255,0.07)_inset]"
                )}
                style={{ color: accent.from }}
                animate={
                    reduced
                        ? {}
                        : {
                            scale: [1, 1.04, 1],
                            transition: {
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: Math.random() * 2,
                            },
                        }
                }
            >
                {icon}
            </motion.div>
            {/* Index label */}
            <div
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-semibold"
                style={{
                    background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
                    color: "#060D1A",
                }}
                aria-hidden="true"
            >
                {index}
            </div>
        </div>
    );
}

/** Capability pill tags below the description */
function CapabilityPill({
    label,
    accent,
}: {
    label: string;
    accent: LifecyclePhase["accent"];
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5",
                "border border-white/[0.07] bg-white/[0.04]",
                "text-[11px] font-medium tracking-wide text-hx-chrome"
            )}
        >
            <span
                className="mr-1.5 h-1 w-1 rounded-full flex-shrink-0"
                style={{ backgroundColor: accent.from, opacity: 0.8 }}
                aria-hidden="true"
            />
            {label}
        </span>
    );
}

/**
 * Desktop SVG connector rail.
 * A horizontal flow path with animated pathLength draw.
 * Sits between the three phase cards at the connector row.
 */
function DesktopConnector({
    isInView,
    reduced,
}: {
    isInView: boolean;
    reduced: boolean;
}) {
    return (
        <div
            className="pointer-events-none absolute left-0 right-0 top-6 hidden items-center lg:flex"
            aria-hidden="true"
        >
            <svg
                viewBox="0 0 900 24"
                fill="none"
                className="w-full"
                preserveAspectRatio="none"
            >
                {/* Background track */}
                <path
                    d="M 60 12 H 840"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1.5"
                />
                {/* Animated fill */}
                <motion.path
                    d="M 60 12 H 840"
                    stroke="url(#rail-gradient)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={
                        isInView
                            ? {
                                pathLength: reduced ? 1 : 1,
                                opacity: 1,
                                transition: reduced
                                    ? { duration: 0 }
                                    : {
                                        pathLength: { duration: 1.1, ease: [0.25, 1, 0.5, 1], delay: 0.5 },
                                        opacity: { duration: 0.01, delay: 0.5 },
                                    },
                            }
                            : { pathLength: 0, opacity: 0 }
                    }
                />
                {/* Arrow head at the end */}
                <motion.path
                    d="M 834 8 L 842 12 L 834 16"
                    stroke="url(#rail-gradient)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0 }}
                    animate={
                        isInView
                            ? {
                                opacity: 1,
                                transition: reduced
                                    ? { duration: 0 }
                                    : { delay: 1.55, duration: 0.2 },
                            }
                            : { opacity: 0 }
                    }
                />
                {/* Node dots at each third */}
                {[150, 450, 750].map((cx) => (
                    <motion.circle
                        key={cx}
                        cx={cx}
                        cy={12}
                        r={3.5}
                        fill="rgba(45,187,238,0.5)"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={
                            isInView
                                ? {
                                    scale: 1,
                                    opacity: 1,
                                    transition: reduced
                                        ? { duration: 0 }
                                        : { delay: 0.3, duration: 0.3, ease: ease.out },
                                }
                                : { scale: 0, opacity: 0 }
                        }
                        style={{ originX: `${cx}px`, originY: "12px" }}
                    />
                ))}
                <defs>
                    <linearGradient id="rail-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2DBBEE" stopOpacity="0.6" />
                        <stop offset="50%" stopColor="#6366f1" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.7" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

/** Mobile vertical connector between stacked phase cards */
function MobileConnector({ reduced }: { reduced: boolean }) {
    return (
        <div
            className="flex justify-center py-1 lg:hidden"
            aria-hidden="true"
        >
            <div className="relative flex flex-col items-center gap-1">
                {/* Line */}
                <div className="h-8 w-px bg-gradient-to-b from-white/10 to-white/[0.04]" />
                {/* Arrow dot */}
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path
                        d="M1 1l4 4 4-4"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    );
}

/** Single phase card */
function PhaseCard({
    phase,
    isInView,
    staggerDelay,
    reduced,
}: {
    phase: LifecyclePhase;
    isInView: boolean;
    staggerDelay: number;
    reduced: boolean;
}) {
    return (
        <motion.article
            aria-label={`Phase ${phase.index}: ${phase.phase}`}
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={
                isInView
                    ? {
                        opacity: 1,
                        y: 0,
                        transition: reduced
                            ? { duration: 0 }
                            : {
                                duration: duration.slow,
                                ease: ease.outSoft,
                                delay: staggerDelay,
                            },
                    }
                    : reduced
                        ? {}
                        : { opacity: 0, y: 24 }
            }
            className={cn(
                // Glass surface
                "relative flex flex-col gap-4 rounded-2xl p-6",
                "border border-white/[0.07] border-t-white/[0.13]",
                "bg-[rgba(15,33,69,0.55)] backdrop-blur-xl",
                "shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_16px_48px_rgba(2,6,23,0.50)]",
                // Hover lift
                "transition-[transform,box-shadow] duration-200 ease-out",
                "hover:-translate-y-1 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.07)_inset,0_24px_64px_rgba(2,6,23,0.60)]",
                "motion-reduce:transform-none motion-reduce:transition-none"
            )}
        >
            {/* Accent glow in card corner */}
            <div
                className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-3xl opacity-30"
                style={{
                    background: `radial-gradient(circle at 80% 20%, ${phase.accent.from}22, transparent 70%)`,
                }}
                aria-hidden="true"
            />

            {/* Orb row */}
            <div className="flex items-start justify-between">
                <PhaseOrb
                    index={phase.index}
                    icon={phase.icon}
                    accent={phase.accent}
                    reduced={reduced}
                />
                {/* Phase label */}
                <div
                    className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest"
                    style={{
                        background: `${phase.accent.from}14`,
                        color: phase.accent.from,
                        border: `1px solid ${phase.accent.from}28`,
                    }}
                >
                    {phase.phase}
                </div>
            </div>

            {/* Text */}
            <div className="space-y-2">
                <h3 className="text-base font-semibold leading-snug text-[#F7FBFF] sm:text-lg">
                    {phase.headline}
                </h3>
                <p className="text-sm leading-relaxed text-hx-slate">
                    {phase.description}
                </p>
            </div>

            {/* Capability pills */}
            <div className="flex flex-wrap gap-1.5" role="list" aria-label={`${phase.phase} capabilities`}>
                {phase.capabilities.map((cap) => (
                    <div key={cap.label} role="listitem">
                        <CapabilityPill label={cap.label} accent={phase.accent} />
                    </div>
                ))}
            </div>

            {/* Bottom accent line */}
            <div
                className="absolute inset-x-6 bottom-0 h-px opacity-40"
                style={{
                    background: `linear-gradient(90deg, transparent, ${phase.accent.from}60, transparent)`,
                }}
                aria-hidden="true"
            />
        </motion.article>
    );
}

// ── Section export ─────────────────────────────────────────────────────────────

export default function LifecycleRibbon() {
    const sectionRef = useRef<HTMLElement>(null);
    const reduced = useReducedMotion() ?? false;

    const isInView = useInView(sectionRef, {
        once: true,
        amount: 0.12,
    });

    return (
        <section
            ref={sectionRef}
            id="lifecycle"
            aria-label="HelixFlow lifecycle — Leads, Delivery, Growth"
            className="relative bg-[#060D1A] py-20 sm:py-24 lg:py-28"
        >
            {/* ── Section ambient backdrop ──────────────────────────────────── */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[#1466B8]/[0.05] blur-[100px]" />
            </div>

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

                {/* ── Section heading ──────────────────────────────────────────── */}
                <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-16">
                    <motion.div
                        initial={reduced ? false : { opacity: 0, y: 14 }}
                        animate={
                            isInView
                                ? { opacity: 1, y: 0, transition: reduced ? { duration: 0 } : { duration: duration.base, ease: ease.out } }
                                : reduced ? {} : { opacity: 0, y: 14 }
                        }
                        className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 backdrop-blur-sm"
                    >
                        {/* Decorative rail icon */}
                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden="true">
                            <circle cx="1.5" cy="4" r="1.5" fill="#2DBBEE" fillOpacity="0.7" />
                            <line x1="3" y1="4" x2="7" y2="4" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                            <circle cx="7" cy="4" r="1.5" fill="#6366f1" fillOpacity="0.7" />
                            <line x1="8.5" y1="4" x2="12.5" y2="4" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                            <circle cx="12.5" cy="4" r="1.5" fill="#10b981" fillOpacity="0.7" />
                        </svg>
                        <span className="text-xs font-medium tracking-wide text-hx-chrome">
                            {SECTION_COPY.eyebrow}
                        </span>
                    </motion.div>

                    <motion.h2
                        className="text-balance text-3xl font-semibold tracking-tight text-[#F7FBFF] sm:text-4xl"
                        initial={reduced ? false : { opacity: 0, y: 18 }}
                        animate={
                            isInView
                                ? { opacity: 1, y: 0, transition: reduced ? { duration: 0 } : { duration: duration.slow, ease: ease.outSoft, delay: 0.1 } }
                                : reduced ? {} : { opacity: 0, y: 18 }
                        }
                    >
                        {SECTION_COPY.headline}
                    </motion.h2>

                    <motion.p
                        className="mt-4 text-pretty text-base leading-relaxed text-hx-slate sm:text-lg"
                        initial={reduced ? false : { opacity: 0, y: 14 }}
                        animate={
                            isInView
                                ? { opacity: 1, y: 0, transition: reduced ? { duration: 0 } : { duration: duration.base, ease: ease.out, delay: 0.22 } }
                                : reduced ? {} : { opacity: 0, y: 14 }
                        }
                    >
                        {SECTION_COPY.sub}
                    </motion.p>
                </div>

                {/* ── Phase grid + connector rail ──────────────────────────────── */}
                <div className="relative">
                    {/* Desktop SVG rail — absolutely positioned behind the cards */}
                    <DesktopConnector isInView={isInView} reduced={reduced} />

                    {/* Card grid */}
                    <div className="grid gap-0 lg:grid-cols-3 lg:gap-5">
                        {LIFECYCLE_PHASES.map((phase, i) => (
                            <div key={phase.id}>
                                <PhaseCard
                                    phase={phase}
                                    isInView={isInView}
                                    staggerDelay={reduced ? 0 : i * 0.13}
                                    reduced={reduced}
                                />
                                {/* Mobile connector between cards */}
                                {i < LIFECYCLE_PHASES.length - 1 && (
                                    <MobileConnector reduced={reduced} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Bottom callout strip ─────────────────────────────────────── */}
                <motion.div
                    className={cn(
                        "mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl px-6 py-4 sm:flex-row lg:mt-12",
                        "border border-white/[0.06] border-t-white/[0.10]",
                        "bg-[rgba(15,33,69,0.40)] backdrop-blur-md"
                    )}
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={
                        isInView
                            ? { opacity: 1, y: 0, transition: reduced ? { duration: 0 } : { duration: duration.base, ease: ease.out, delay: 0.55 } }
                            : reduced ? {} : { opacity: 0, y: 12 }
                    }
                >
                    <p className="text-center text-sm text-hx-slate sm:text-left">
                        Every phase is connected.{" "}
                        <span className="text-hx-chrome">Data flows forward — nothing falls through.</span>
                    </p>
                    <a
                        href="#modules"
                        className={cn(
                            "inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg px-4 py-2",
                            "border border-white/10 bg-white/[0.04] backdrop-blur-sm",
                            "text-sm font-medium text-hx-chrome transition-all duration-150",
                            "hover:border-white/20 hover:bg-white/[0.08] hover:text-[#F7FBFF]",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/50",
                            "motion-reduce:transition-none"
                        )}
                    >
                        Explore the modules
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <path
                                d="M3 8h10M9 4l4 4-4 4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </a>
                </motion.div>
            </div>

            {/* ── Bottom fade to next section ──────────────────────────────────── */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#060D1A] to-transparent"
                aria-hidden="true"
            />
        </section>
    );
}
