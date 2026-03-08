/**
 * RoadmapStatus
 * ─────────────────────────────────────────────────────────────
 * Section 8 — Product roadmap and live system status
 *
 * Purpose:
 *   Communicate product momentum and operational credibility.
 *   Shows what is live, in progress, and coming — styled as a
 *   premium command/status console rather than a marketing table.
 *
 * Structure:
 *   1. Section heading — framed as a system status board
 *   2. System status bar — top-level "all systems operational" signal
 *   3. Roadmap items — vertical timeline with status indicators
 *   4. Phase summary — three-column phase overview (live / building / next)
 *
 * Visual language:
 *   - Status indicators: pulsing dot (live), spinner arc (in progress),
 *     diamond (planned), lock (blocked/future)
 *   - Horizontal rule timeline with gradient connector
 *   - Glass card rows rather than a flat table
 *   - Strong typographic hierarchy: status → title → description
 *
 * Status states:
 *   "live"        — green, pulsing dot, "Online"
 *   "in-progress" — aqua, animated arc, "In progress"
 *   "beta"        — indigo, solid dot, "Beta prep"
 *   "planned"     — dim, diamond, "Planned"
 *
 * Motion:
 *   AnimateIn stagger on roadmap rows.
 *   CSS animation on status dots (pulse, spin) — no Framer Motion needed
 *   for the status indicators; keeps them looping without hydration cost.
 *   prefers-reduced-motion: CSS animations paused via Tailwind motion-reduce.
 *
 * Content:
 *   Typed inline ROADMAP_ITEMS array.
 *   To move to CMS: replace array with a prop/fetch — rendering unchanged.
 *   Exported type: `RoadmapItem`
 */

import AnimateIn from "@/components/primitives/AnimateIn";
import { fadeUp, fadeUpSlow, staggerContainer, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

export type RoadmapStatus = "live" | "in-progress" | "beta" | "planned";

export interface RoadmapItem {
    /** Unique slug — React key, future CMS ID */
    id: string;
    /** Item title — displayed prominently */
    title: string;
    /** One-sentence description */
    description: string;
    /** Current status */
    status: RoadmapStatus;
    /**
     * Optional phase tag — groups items visually.
     * e.g. "Infrastructure", "Product", "Growth"
     */
    phase?: string;
    /**
     * Optional date/timeframe string.
     * Displayed as-is — no parsing. e.g. "March 2026", "Q2 2026"
     */
    timeframe?: string;
}

// ── Status config — single source of truth ────────────────────────────────────

const STATUS_CONFIG: Record<
    RoadmapStatus,
    {
        label: string;
        color: string;         // text / icon color
        dotColor: string;      // bg color for dot
        borderColor: string;   // card left accent
        bg: string;            // pill background
    }
> = {
    live: {
        label: "Online",
        color: "#34d399",
        dotColor: "#34d399",
        borderColor: "rgba(52,211,153,0.35)",
        bg: "rgba(52,211,153,0.08)",
    },
    "in-progress": {
        label: "In progress",
        color: "#2DBBEE",
        dotColor: "#2DBBEE",
        borderColor: "rgba(45,187,238,0.30)",
        bg: "rgba(45,187,238,0.08)",
    },
    beta: {
        label: "Beta prep",
        color: "#818cf8",
        dotColor: "#818cf8",
        borderColor: "rgba(129,140,248,0.28)",
        bg: "rgba(129,140,248,0.08)",
    },
    planned: {
        label: "Planned",
        color: "#3A4E68",
        dotColor: "#3A4E68",
        borderColor: "rgba(58,78,104,0.25)",
        bg: "rgba(58,78,104,0.06)",
    },
};

// ── Content ───────────────────────────────────────────────────────────────────

const SYSTEM_STATUS = {
    operational: true,
    label: "All systems operational",
    uptimeLabel: "99.9% uptime",
    lastChecked: "Live",
} as const;

const ROADMAP_ITEMS: RoadmapItem[] = [
    {
        id: "infrastructure",
        title: "Infrastructure online",
        description:
            "Core cloud infrastructure provisioned and live. Database, auth layer, and API gateway operational.",
        status: "live",
        phase: "Infrastructure",
        timeframe: "March 2026",
    },
    {
        id: "frontpage",
        title: "Frontpage live",
        description:
            "Marketing homepage deployed to helixflow.cloud. SEO foundations, sitemap, and meta structure in place.",
        status: "live",
        phase: "Product",
        timeframe: "March 2026",
    },
    {
        id: "app-shell",
        title: "App shell in progress",
        description:
            "Core application shell under active development. Pipeline, contact record, and navigation architecture being built.",
        status: "in-progress",
        phase: "Product",
        timeframe: "Q2 2026",
    },
    {
        id: "beta-prep",
        title: "Beta preparation underway",
        description:
            "Onboarding flow, early-access list, and beta invite infrastructure being prepared for first cohort.",
        status: "beta",
        phase: "Growth",
        timeframe: "Q2 2026",
    },
    {
        id: "proposal-engine",
        title: "AI proposal engine",
        description:
            "AI-assisted proposal generation from intake data. Draft, review, and send in under five minutes.",
        status: "planned",
        phase: "Product",
        timeframe: "Q3 2026",
    },
    {
        id: "onboarding-automation",
        title: "Automated onboarding sequences",
        description:
            "Signature-triggered onboarding checklists, client access provisioning, and kickoff delivery.",
        status: "planned",
        phase: "Product",
        timeframe: "Q3 2026",
    },
];

// Phase summary — the three-column overview beneath the timeline
const PHASES = [
    {
        id: "live",
        label: "Live now",
        color: "#34d399",
        items: ROADMAP_ITEMS.filter((i) => i.status === "live").map((i) => i.title),
    },
    {
        id: "building",
        label: "Building",
        color: "#2DBBEE",
        items: ROADMAP_ITEMS.filter(
            (i) => i.status === "in-progress" || i.status === "beta"
        ).map((i) => i.title),
    },
    {
        id: "next",
        label: "Up next",
        color: "#818cf8",
        items: ROADMAP_ITEMS.filter((i) => i.status === "planned").map(
            (i) => i.title
        ),
    },
] as const;

const SECTION_COPY = {
    eyebrow: "Roadmap",
    headline: "What's live. What's next.",
    sub: "Real-time status of the HelixFlow build. Updated as the product ships.",
} as const;

// ── Sub-components ─────────────────────────────────────────────────────────────

/** Animated status indicator — dot for live/beta, arc for in-progress, diamond for planned */
function StatusDot({ status }: { status: RoadmapStatus }) {
    const cfg = STATUS_CONFIG[status];

    if (status === "live") {
        return (
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0" aria-hidden="true">
                {/* Ping ring */}
                <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:animate-none"
                    style={{ backgroundColor: cfg.dotColor }}
                />
                <span
                    className="relative inline-flex h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: cfg.dotColor }}
                />
            </span>
        );
    }

    if (status === "in-progress") {
        return (
            <span
                className="flex h-2.5 w-2.5 flex-shrink-0 items-center justify-center"
                aria-hidden="true"
            >
                {/* Spinning arc SVG */}
                <svg
                    className="animate-spin motion-reduce:animate-none"
                    style={{ animationDuration: "1.4s" }}
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                >
                    <circle
                        cx="5"
                        cy="5"
                        r="4"
                        stroke={cfg.dotColor}
                        strokeWidth="1.5"
                        strokeOpacity="0.2"
                    />
                    <path
                        d="M5 1 A4 4 0 0 1 9 5"
                        stroke={cfg.dotColor}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
            </span>
        );
    }

    if (status === "beta") {
        return (
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0" aria-hidden="true">
                <span
                    className="relative inline-flex h-2.5 w-2.5 rounded-full opacity-80"
                    style={{ backgroundColor: cfg.dotColor }}
                />
            </span>
        );
    }

    // planned — diamond shape
    return (
        <span
            className="flex h-2.5 w-2.5 flex-shrink-0 items-center justify-center"
            aria-hidden="true"
        >
            <span
                className="h-2 w-2 rotate-45 rounded-[1px] opacity-50"
                style={{ backgroundColor: cfg.dotColor }}
            />
        </span>
    );
}

/** Status pill — label chip with color context */
function StatusPill({ status }: { status: RoadmapStatus }) {
    const cfg = STATUS_CONFIG[status];
    return (
        <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{
                background: cfg.bg,
                border: `1px solid ${cfg.color}22`,
                color: cfg.color,
            }}
        >
            <StatusDot status={status} />
            {cfg.label}
        </span>
    );
}

/** Individual roadmap row */
function RoadmapRow({
    item,
    index,
    isLast,
}: {
    item: RoadmapItem;
    index: number;
    isLast: boolean;
}) {
    const cfg = STATUS_CONFIG[item.status];

    return (
        <AnimateIn variants={fadeUp} delay={index * 0.07} threshold={0.05}>
            <div className="relative flex gap-4 sm:gap-6">
                {/* Timeline column */}
                <div className="relative flex flex-col items-center" aria-hidden="true">
                    {/* Node */}
                    <div
                        className={cn(
                            "relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                            "border border-white/[0.08]",
                            "bg-[rgba(15,33,69,0.70)] backdrop-blur-sm"
                        )}
                        style={{ boxShadow: `0 0 0 3px ${cfg.color}18` }}
                    >
                        <StatusDot status={item.status} />
                    </div>

                    {/* Connector line to next item */}
                    {!isLast && (
                        <div
                            className="mt-1 w-px flex-1"
                            style={{
                                background: `linear-gradient(to bottom, ${cfg.color}40, rgba(58,78,104,0.15))`,
                                minHeight: "32px",
                            }}
                        />
                    )}
                </div>

                {/* Content card */}
                <div
                    className={cn(
                        "mb-5 flex-1 overflow-hidden rounded-xl",
                        "border border-white/[0.06] border-t-white/[0.10]",
                        "bg-[rgba(15,33,69,0.40)] backdrop-blur-xl",
                        "shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]",
                        "transition-colors duration-200",
                        // Left accent border driven by status color
                        "relative"
                    )}
                >
                    {/* Left accent bar */}
                    <div
                        className="absolute inset-y-0 left-0 w-0.5 rounded-l-xl"
                        style={{ background: cfg.borderColor }}
                        aria-hidden="true"
                    />

                    <div className="px-4 py-3.5 pl-5 sm:px-5 sm:py-4 sm:pl-6">
                        {/* Top meta row */}
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <StatusPill status={item.status} />
                            {item.phase && (
                                <span className="text-[10px] font-medium uppercase tracking-widest text-[#3A4E68]">
                                    {item.phase}
                                </span>
                            )}
                            {item.timeframe && (
                                <>
                                    <span className="text-[10px] text-[#3A4E68]" aria-hidden="true">
                                        ·
                                    </span>
                                    <span className="text-[10px] text-[#3A4E68]">{item.timeframe}</span>
                                </>
                            )}
                        </div>

                        {/* Title */}
                        <h3 className="text-[15px] font-semibold leading-snug text-[#F7FBFF]">
                            {item.title}
                        </h3>

                        {/* Description */}
                        <p className="mt-1 text-[13px] leading-relaxed text-[#7A8FA8]">
                            {item.description}
                        </p>
                    </div>
                </div>
            </div>
        </AnimateIn>
    );
}

/** Top-level system status bar */
function SystemStatusBar() {
    return (
        <AnimateIn variants={fadeUp} threshold={0.2}>
            <div
                className={cn(
                    "mb-10 flex items-center justify-between gap-4 rounded-xl px-4 py-3 sm:px-5",
                    "border border-white/[0.06]",
                    "bg-[rgba(6,13,26,0.60)] backdrop-blur-xl"
                )}
            >
                {/* Left: status signal */}
                <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2 w-2 flex-shrink-0" aria-hidden="true">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34d399] opacity-50 motion-reduce:animate-none" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34d399]" />
                    </span>
                    <span className="text-[13px] font-medium text-[#B8C5D6]">
                        {SYSTEM_STATUS.label}
                    </span>
                </div>

                {/* Right: uptime + last checked */}
                <div className="flex items-center gap-3">
                    <span className="hidden text-[11px] text-[#3A4E68] sm:block">
                        {SYSTEM_STATUS.uptimeLabel}
                    </span>
                    <span
                        className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-[#34d399]"
                    >
                        {SYSTEM_STATUS.lastChecked}
                    </span>
                </div>
            </div>
        </AnimateIn>
    );
}

/** Phase summary — three columns: live, building, next */
function PhaseSummary() {
    return (
        <AnimateIn
            variants={staggerContainer(stagger.base, 0.05)}
            threshold={0.1}
        >
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {PHASES.map((phase, i) => (
                    <AnimateIn key={phase.id} variants={fadeUp} delay={i * stagger.base} threshold={0.1}>
                        <div
                            className={cn(
                                "rounded-xl px-4 py-4",
                                "border border-white/[0.06]",
                                "bg-[rgba(15,33,69,0.35)] backdrop-blur-xl"
                            )}
                        >
                            {/* Phase header */}
                            <div className="mb-3 flex items-center gap-2">
                                <span
                                    className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: phase.color }}
                                    aria-hidden="true"
                                />
                                <p
                                    className="text-[11px] font-semibold uppercase tracking-widest"
                                    style={{ color: phase.color, opacity: 0.8 }}
                                >
                                    {phase.label}
                                </p>
                            </div>

                            {/* Item list */}
                            <ul className="space-y-1.5">
                                {phase.items.map((title) => (
                                    <li key={title} className="flex items-start gap-2">
                                        <svg
                                            className="mt-1 h-2.5 w-2.5 flex-shrink-0"
                                            viewBox="0 0 10 10"
                                            fill="none"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M2 5.5L4 7.5L8 3"
                                                stroke={phase.color}
                                                strokeWidth="1.25"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeOpacity={phase.id === "next" ? "0.4" : "0.9"}
                                            />
                                        </svg>
                                        <span
                                            className={cn(
                                                "text-[12px] leading-snug",
                                                phase.id === "next" ? "text-[#3A4E68]" : "text-[#7A8FA8]"
                                            )}
                                        >
                                            {title}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AnimateIn>
                ))}
            </div>
        </AnimateIn>
    );
}

// ── Section export ─────────────────────────────────────────────────────────────

export default function RoadmapStatus() {
    return (
        <section
            id="roadmap-status"
            aria-labelledby="roadmap-heading"
            className="relative bg-[#060D1A] py-20 sm:py-24 lg:py-28"
        >
            {/* ── Ambient backdrop ────────────────────────────────────────── */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute left-0 top-1/3 h-[460px] w-[460px] rounded-full bg-[#34d399]/[0.03] blur-[110px]" />
                <div className="absolute right-0 bottom-1/4 h-[380px] w-[380px] rounded-full bg-[#2DBBEE]/[0.03] blur-[100px]" />
            </div>

            <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

                {/* ── Section heading ──────────────────────────────────────── */}
                <div className="mb-8 lg:mb-10">
                    <AnimateIn variants={fadeUp} threshold={0.2}>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 backdrop-blur-sm">
                            {/* Signal / broadcast icon */}
                            <svg
                                className="h-3 w-3 text-[#7A8FA8]"
                                viewBox="0 0 12 12"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M1.5 9.5a6 6 0 0 1 0-7M10.5 2.5a6 6 0 0 1 0 7M3.5 7.5a3 3 0 0 1 0-3M8.5 4.5a3 3 0 0 1 0 3M6 6.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z"
                                    stroke="currentColor"
                                    strokeWidth="1.1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="text-xs font-medium tracking-wide text-[#B8C5D6]">
                                {SECTION_COPY.eyebrow}
                            </span>
                        </div>
                    </AnimateIn>

                    <AnimateIn variants={fadeUpSlow} delay={0.07} threshold={0.2}>
                        <h2
                            id="roadmap-heading"
                            className="text-3xl font-semibold tracking-tight text-[#F7FBFF] sm:text-4xl"
                        >
                            {SECTION_COPY.headline}
                        </h2>
                    </AnimateIn>

                    <AnimateIn variants={fadeUp} delay={0.15} threshold={0.2}>
                        <p className="mt-3 text-base leading-relaxed text-[#7A8FA8]">
                            {SECTION_COPY.sub}
                        </p>
                    </AnimateIn>
                </div>

                {/* ── System status bar ────────────────────────────────────── */}
                <SystemStatusBar />

                {/* ── Roadmap timeline ─────────────────────────────────────── */}
                <div
                    role="list"
                    aria-label="Roadmap items"
                >
                    {ROADMAP_ITEMS.map((item, index) => (
                        <div key={item.id} role="listitem">
                            <RoadmapRow
                                item={item}
                                index={index}
                                isLast={index === ROADMAP_ITEMS.length - 1}
                            />
                        </div>
                    ))}
                </div>

                {/* ── Phase summary grid ───────────────────────────────────── */}
                <PhaseSummary />

            </div>

            {/* ── Bottom fade to next section ───────────────────────────────── */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#060D1A] to-transparent"
                aria-hidden="true"
            />
        </section>
    );
}
