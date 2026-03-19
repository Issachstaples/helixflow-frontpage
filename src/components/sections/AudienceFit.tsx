"use client";

/**
 * AudienceFit
 * ─────────────────────────────────────────────────────────────
 * Section 5 — Why HelixFlow / Audience fit
 *
 * Purpose:
 *   Bridges the product story (StickyStoryboard) to real business
 *   value. Answers: "Is this for me?" — clearly and quickly.
 *
 * Structure:
 *   1. Section heading — who this is for + direct qualifier
 *   2. Audience tiles — 3 archetypes, each with a pain, a proof,
 *      and a concrete outcome statement
 *   3. Before / After comparison strip — the operational shift
 *      HelixFlow delivers in plain language
 *   4. Proof ribbon — 3 lightweight metric claims
 *   5. Honest qualifier — who HelixFlow is NOT for (builds trust)
 *
 * Layout:
 *   All breakpoints: single column heading, responsive card grid,
 *   full-width comparison strip, metric ribbon, qualifier callout.
 *
 * Motion:
 *   AnimateIn with stagger on audience cards.
 *   Before/after rows stagger on entry.
 *   No ambient loops — content-forward, text clarity over spectacle.
 *   prefers-reduced-motion: AnimateIn handles automatically.
 *
 * Content:
 *   Typed inline arrays. To move to CMS: replace arrays with
 *   props or fetch — rendering unchanged.
 */

import { useRef } from "react";
import { useInView } from "framer-motion";
import AnimateIn from "@/components/primitives/AnimateIn";
import { fadeUp, fadeUpSlow, staggerContainer, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AudienceArchetype {
    id: string;
    label: string;          // audience category label
    emoji: string;          // decorative icon (no img dependency)
    headline: string;       // who they are
    pain: string;           // the problem they have today
    shift: string;          // what changes with HelixFlow
    outcome: string;        // the measurable result
    accent: {
        from: string;
        glow: string;
        subtle: string;
    };
}

interface BeforeAfterRow {
    id: string;
    before: string;
    after: string;
}

interface ProofMetric {
    id: string;
    value: string;
    label: string;
    qualifier: string;      // small-print context
}

// ── Content ───────────────────────────────────────────────────────────────────

const SECTION_COPY = {
    eyebrow: "Built for",
    headline: "For agencies and service businesses that run on relationships.",
    sub: "If you're winning work through referrals, delivering on project scope, and trying to grow without hiring a full ops team — HelixFlow was built for your exact situation.",
} as const;

const AUDIENCES: AudienceArchetype[] = [
    {
        id: "agency",
        label: "Digital & Creative Agencies",
        emoji: "✦",
        headline: "You close good work, but delivery and retention are disconnected.",
        pain: "Leads live in a spreadsheet. Proposals are rebuilt from scratch every time. Onboarding is a Google Doc. Follow-up happens whenever someone remembers.",
        shift: "HelixFlow connects your pipeline directly to proposals, onboarding, and post-delivery retention. One system that covers the full client lifecycle.",
        outcome: "Less admin overhead. Fewer dropped balls. More repeat business from clients you already have.",
        accent: {
            from: "#2DBBEE",
            glow: "rgba(45,187,238,0.12)",
            subtle: "rgba(45,187,238,0.06)",
        },
    },
    {
        id: "service-biz",
        label: "Service Businesses",
        emoji: "◈",
        headline: "You're busy delivering — not building systems.",
        pain: "Every new engagement requires manual coordination. Proposals take hours. Onboarding relies on tribal knowledge. Growth feels blocked by operational friction.",
        shift: "HelixFlow gives you structured workflows without requiring you to build them from scratch. Templated proposals, automated onboarding, and retention nudges that fire without prompting.",
        outcome: "More capacity for delivery. Consistent client experience. Less time on coordination, more on the work that actually earns.",
        accent: {
            from: "#818cf8",
            glow: "rgba(129,140,248,0.12)",
            subtle: "rgba(129,140,248,0.06)",
        },
    },
    {
        id: "outgrowing",
        label: "Teams Outgrowing Their Tools",
        emoji: "◉",
        headline: "Your current stack was never designed to scale with you.",
        pain: "You've cobbled together a CRM, a proposal tool, a project tracker, and a shared inbox. Nothing talks to anything else. Critical context lives in someone's head.",
        shift: "HelixFlow replaces the patchwork. One coherent system — from first contact to retained client — that grows with the team rather than requiring constant maintenance.",
        outcome: "Visibility across every active relationship. No more context-switching between four tools to understand where a client stands.",
        accent: {
            from: "#34d399",
            glow: "rgba(52,211,153,0.12)",
            subtle: "rgba(52,211,153,0.06)",
        },
    },
];

const BEFORE_AFTER_ROWS: BeforeAfterRow[] = [
    {
        id: "leads",
        before: "Leads tracked in a spreadsheet that nobody keeps current",
        after: "Every lead captured, scored, and staged automatically",
    },
    {
        id: "proposals",
        before: "Proposals assembled manually from old files, every time",
        after: "AI-generated draft in minutes, sent with one click",
    },
    {
        id: "onboarding",
        before: "Onboarding starts when someone remembers to send the email",
        after: "Onboarding sequence fires automatically on signature",
    },
    {
        id: "followup",
        before: "Retention depends on who has the best memory",
        after: "Check-ins, upsells, and referral nudges scheduled in advance",
    },
    {
        id: "visibility",
        before: "Nobody knows the full picture without asking around",
        after: "Complete client history visible in one place, always",
    },
];

const PROOF_METRICS: ProofMetric[] = [
    {
        id: "time",
        value: "< 5 min",
        label: "Proposal to send",
        qualifier: "From signed-off scope to client inbox",
    },
    {
        id: "onboarding",
        value: "Zero",
        label: "Manual onboarding steps",
        qualifier: "Sequence fires automatically on contract signature",
    },
    {
        id: "stack",
        value: "1 system",
        label: "Replaces 4–6 tools",
        qualifier: "CRM · Proposals · Onboarding · Retention · AI Assist",
    },
];

const QUALIFIER = {
    heading: "HelixFlow isn't for everyone.",
    body: "If you're running a product business, a transactional e-commerce operation, or a sales team measured on outbound volume — there are better tools purpose-built for that model. HelixFlow is specifically designed for businesses where relationships, delivery quality, and repeat engagement are the core growth drivers.",
} as const;

// ── Sub-components ─────────────────────────────────────────────────────────────

function AudienceCard({ archetype }: { archetype: AudienceArchetype }) {
    return (
        <article
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl p-6",
                "border border-white/[0.07] border-t-white/[0.13]",
                "bg-[rgba(15,33,69,0.50)] backdrop-blur-xl",
                "shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_16px_48px_rgba(2,6,23,0.55)]",
                "transition-shadow duration-300 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.07)_inset,0_24px_64px_rgba(2,6,23,0.65)]"
            )}
        >
            {/* Corner ambient glow — only visible on hover */}
            <div
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `radial-gradient(circle, ${archetype.accent.from}18, transparent 70%)` }}
                aria-hidden="true"
            />

            {/* Top accent line */}
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60"
                style={{ background: `linear-gradient(90deg, transparent, ${archetype.accent.from}55, transparent)` }}
                aria-hidden="true"
            />

            {/* Header */}
            <div className="mb-4 flex items-start gap-3">
                <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-base font-semibold"
                    style={{
                        background: archetype.accent.subtle,
                        border: `1px solid ${archetype.accent.from}22`,
                        color: archetype.accent.from,
                    }}
                    aria-hidden="true"
                >
                    {archetype.emoji}
                </div>
                <div>
                    <p
                        className="text-[10px] font-semibold uppercase tracking-widest"
                        style={{ color: archetype.accent.from, opacity: 0.75 }}
                    >
                        {archetype.label}
                    </p>
                    <h3 className="mt-0.5 text-[15px] font-semibold leading-snug text-[#F7FBFF]">
                        {archetype.headline}
                    </h3>
                </div>
            </div>

            {/* Pain */}
            <div className="mb-4 rounded-xl border border-white/[0.05] bg-[rgba(6,13,26,0.45)] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-hx-dim">
                    The problem today
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-hx-slate">
                    {archetype.pain}
                </p>
            </div>

            {/* Shift */}
            <p className="mb-3 text-[13px] leading-relaxed text-hx-chrome">
                {archetype.shift}
            </p>

            {/* Outcome pill */}
            <div className="mt-auto pt-2">
                <div
                    className="inline-flex items-start gap-2 rounded-xl px-3.5 py-2.5 text-[12px] leading-snug"
                    style={{
                        background: archetype.accent.subtle,
                        border: `1px solid ${archetype.accent.from}20`,
                        color: archetype.accent.from,
                    }}
                >
                    <svg
                        className="mt-0.5 h-3 w-3 flex-shrink-0"
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M2 6.5L4.5 9L10 3"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    {archetype.outcome}
                </div>
            </div>
        </article>
    );
}

function BeforeAfterStrip({ rows }: { rows: BeforeAfterRow[] }) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl",
                "border border-white/[0.07] border-t-white/[0.12]",
                "bg-[rgba(15,33,69,0.45)] backdrop-blur-xl",
                "shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_20px_60px_rgba(2,6,23,0.50)]"
            )}
        >
            {/* Subtle background tint */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at 15% 50%, rgba(45,187,238,0.04), transparent 50%), radial-gradient(ellipse at 85% 50%, rgba(52,211,153,0.03), transparent 50%)",
                }}
                aria-hidden="true"
            />

            {/* Column headers */}
            <div className="relative grid grid-cols-[1fr_32px_1fr] items-center border-b border-white/[0.06] px-5 py-3 sm:px-7">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-hx-dim">
                    Before
                </p>
                <div /> {/* spacer */}
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#2DBBEE] opacity-75">
                    After HelixFlow
                </p>
            </div>

            {/* Rows */}
            <div className="relative divide-y divide-white/[0.04]">
                {rows.map((row, i) => (
                    <AnimateIn
                        key={row.id}
                        variants={fadeUp}
                        delay={i * 0.07}
                        threshold={0.05}
                    >
                        <div className="grid grid-cols-[1fr_32px_1fr] items-center gap-0 px-5 py-4 sm:px-7">
                            {/* Before */}
                            <p className="pr-3 text-[13px] leading-relaxed text-hx-slate sm:text-sm">
                                {row.before}
                            </p>

                            {/* Arrow divider */}
                            <div className="flex items-center justify-center" aria-hidden="true">
                                <svg
                                    className="h-4 w-4 text-hx-dim"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                >
                                    <path
                                        d="M3 8h10M9 4l4 4-4 4"
                                        stroke="currentColor"
                                        strokeWidth="1.25"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                            {/* After */}
                            <p className="pl-3 text-[13px] leading-relaxed text-hx-chrome sm:text-sm">
                                {row.after}
                            </p>
                        </div>
                    </AnimateIn>
                ))}
            </div>
        </div>
    );
}

function ProofRibbon({ metrics }: { metrics: ProofMetric[] }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {metrics.map((metric, i) => (
                <AnimateIn key={metric.id} variants={fadeUp} delay={i * 0.09} threshold={0.1}>
                    <div
                        className={cn(
                            "relative flex flex-col items-center rounded-2xl px-6 py-6 text-center",
                            "border border-white/[0.07] border-t-white/[0.12]",
                            "bg-[rgba(15,33,69,0.40)] backdrop-blur-xl",
                            "shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset]"
                        )}
                    >
                        <p className="text-3xl font-semibold tracking-tight text-[#F7FBFF] sm:text-4xl">
                            {metric.value}
                        </p>
                        <p className="mt-1 text-sm font-medium text-hx-chrome">{metric.label}</p>
                        <p className="mt-2 text-[11px] leading-snug text-hx-dim">
                            {metric.qualifier}
                        </p>
                    </div>
                </AnimateIn>
            ))}
        </div>
    );
}

function HonestQualifier({
    heading,
    body,
}: {
    heading: string;
    body: string;
}) {
    return (
        <div
            className={cn(
                "relative rounded-2xl px-6 py-6 sm:px-8 sm:py-7",
                "border border-white/[0.05]",
                "bg-[rgba(6,13,26,0.55)] backdrop-blur-xl"
            )}
        >
            {/* Left accent bar */}
            <div
                className="absolute inset-y-5 left-0 w-0.5 rounded-full bg-[#3A4E68]/50"
                aria-hidden="true"
            />
            <p className="mb-1.5 text-sm font-semibold text-hx-slate">{heading}</p>
            <p className="max-w-3xl text-sm leading-relaxed text-hx-dim">{body}</p>
        </div>
    );
}

// ── Section export ─────────────────────────────────────────────────────────────

export default function AudienceFit() {
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section
            ref={sectionRef}
            id="audience-fit"
            aria-label="Who HelixFlow is for"
            className="relative bg-[#060D1A] py-20 sm:py-24 lg:py-28"
        >
            {/* ── Ambient backdrop ──────────────────────────────────────────── */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute left-0 top-1/4 h-[500px] w-[500px] rounded-full bg-[#2DBBEE]/[0.03] blur-[110px]" />
                <div className="absolute right-0 bottom-1/4 h-[400px] w-[400px] rounded-full bg-[#818cf8]/[0.04] blur-[100px]" />
            </div>

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

                {/* ── 1. Section heading ───────────────────────────────────────── */}
                <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-14">
                    <AnimateIn variants={fadeUp} threshold={0.2}>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 backdrop-blur-sm">
                            {/* Three-audience dots */}
                            <div className="flex items-center gap-1" aria-hidden="true">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#2DBBEE] opacity-90" />
                                <span className="h-1.5 w-1.5 rounded-full bg-[#818cf8] opacity-90" />
                                <span className="h-1.5 w-1.5 rounded-full bg-[#34d399] opacity-90" />
                            </div>
                            <span className="text-xs font-medium tracking-wide text-hx-chrome">
                                {SECTION_COPY.eyebrow}
                            </span>
                        </div>
                    </AnimateIn>

                    <AnimateIn variants={fadeUpSlow} delay={0.08} threshold={0.2}>
                        <h2 className="text-balance text-3xl font-semibold tracking-tight text-[#F7FBFF] sm:text-4xl">
                            {SECTION_COPY.headline}
                        </h2>
                    </AnimateIn>

                    <AnimateIn variants={fadeUp} delay={0.18} threshold={0.2}>
                        <p className="mt-4 text-pretty text-base leading-relaxed text-hx-slate sm:text-lg">
                            {SECTION_COPY.sub}
                        </p>
                    </AnimateIn>
                </div>

                {/* ── 2. Audience archetype cards ──────────────────────────────── */}
                <AnimateIn
                    variants={staggerContainer(stagger.base, 0.05)}
                    threshold={0.05}
                >
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {AUDIENCES.map((archetype, i) => (
                            <AnimateIn key={archetype.id} variants={fadeUp} delay={i * stagger.base} threshold={0.05}>
                                <AudienceCard archetype={archetype} />
                            </AnimateIn>
                        ))}
                    </div>
                </AnimateIn>

                {/* ── 3. Before / After comparison strip ──────────────────────── */}
                <div className="mt-12 lg:mt-14">
                    <AnimateIn variants={fadeUp} threshold={0.1}>
                        <div className="mb-5 flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-[#F7FBFF] sm:text-xl">
                                The operational shift.
                            </h3>
                            <p className="text-sm text-hx-slate">
                                What changes when everything is connected.
                            </p>
                        </div>
                    </AnimateIn>
                    <BeforeAfterStrip rows={BEFORE_AFTER_ROWS} />
                </div>

                {/* ── 4. Proof metrics ribbon ──────────────────────────────────── */}
                <div className="mt-10 lg:mt-12">
                    <ProofRibbon metrics={PROOF_METRICS} />
                </div>

                {/* ── 5. Honest qualifier ──────────────────────────────────────── */}
                <div className="mt-8 lg:mt-10">
                    <AnimateIn variants={fadeUp} threshold={0.1}>
                        <HonestQualifier
                            heading={QUALIFIER.heading}
                            body={QUALIFIER.body}
                        />
                    </AnimateIn>
                </div>

            </div>

            {/* ── Bottom fade to next section ───────────────────────────────── */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#060D1A] to-transparent"
                aria-hidden="true"
            />
        </section>
    );
}
