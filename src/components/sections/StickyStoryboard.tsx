"use client";

/**
 * StickyStoryboard
 * ─────────────────────────────────────────────────────────────
 * Section 4 — Scroll-driven workflow story
 *
 * A premium scroll narrative that shows how HelixFlow moves
 * work from lead capture to compounding growth. The right
 * visual panel stays sticky while the left narrative advances
 * step-by-step on scroll.
 *
 * Layout:
 *   Mobile  — stacked vertical cards, no sticky behavior
 *   Desktop — CSS sticky right panel + scrolling left narrative
 *             (sticky top-24, right panel height-bound to section)
 *
 * Motion:
 *   - Active step: Framer Motion cross-fade via AnimatePresence
 *   - Node rail: active nodes illuminate on step change
 *   - Visual panel: mock UI content fades between steps
 *   - Progress line: CSS height transition driven by activeStep
 *   - prefers-reduced-motion: instant transitions, no cross-fade
 *
 * Step tracking:
 *   IntersectionObserver on each left-column step trigger.
 *   Debounced 80ms to prevent oscillation at step boundaries.
 *
 * Content:
 *   Typed STEPS array at top of file.
 *   To move to CMS: replace array with a prop/fetch — rendering unchanged.
 */

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type StepPhase = "leads" | "delivery" | "growth";

interface StepSystemEvent {
    label: string;
    time: string;
}

interface StoryStep {
    id: string;
    index: number;                    // 1-based display number
    phase: StepPhase;
    stepLabel: string;                // "Step 01" label
    headline: string;
    body: string;
    systemNote: string;               // italic system-layer annotation
    events: StepSystemEvent[];        // activity feed for mock panel
    accent: {
        from: string;
        to: string;
        glow: string;
    };
    nodeIcon: React.ReactNode;        // icon shown on the flow node
}

// ── Phase accent map ──────────────────────────────────────────────────────────

const PHASE_ACCENTS: Record<StepPhase, StoryStep["accent"]> = {
    leads: { from: "#2DBBEE", to: "#1466B8", glow: "rgba(45,187,238,0.18)" },
    delivery: { from: "#818cf8", to: "#4f46e5", glow: "rgba(129,140,248,0.16)" },
    growth: { from: "#34d399", to: "#059669", glow: "rgba(52,211,153,0.16)" },
};

// ── Static content ─────────────────────────────────────────────────────────────

const STEPS: StoryStep[] = [
    {
        id: "lead-captured",
        index: 1,
        phase: "leads",
        stepLabel: "Step 01",
        headline: "A lead comes in.",
        body: "An inbound enquiry lands — email, form, or referral. HelixFlow captures it automatically, scores the opportunity, and surfaces it in your pipeline without you lifting a finger.",
        systemNote: "Lead auto-tagged · Source logged · Follow-up scheduled",
        events: [
            { label: "New lead created — Acme Co", time: "Just now" },
            { label: "Source: Website contact form", time: "Just now" },
            { label: "Score: 78/100 · High priority", time: "Just now" },
            { label: "Follow-up task created for tomorrow", time: "Just now" },
        ],
        accent: PHASE_ACCENTS.leads,
        nodeIcon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        id: "opportunity-organized",
        index: 2,
        phase: "leads",
        stepLabel: "Step 02",
        headline: "The opportunity organizes itself.",
        body: "Context flows into a structured contact record. Past interactions, notes, and engagement history are all in one place. You see exactly where this lead is and what's next — without searching.",
        systemNote: "Pipeline stage: Qualified · Next action: Proposal call",
        events: [
            { label: "Contact record enriched", time: "2m ago" },
            { label: "Stage moved: New → Qualified", time: "2m ago" },
            { label: "3 notes added from email thread", time: "5m ago" },
            { label: "Meeting logged — discovery call", time: "Yesterday" },
        ],
        accent: PHASE_ACCENTS.leads,
        nodeIcon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        id: "proposal-sent",
        index: 3,
        phase: "delivery",
        stepLabel: "Step 03",
        headline: "A proposal is generated and sent.",
        body: "HelixFlow's AI drafts a scoped, on-brand proposal from your intake data. You review, adjust if needed, and send — in minutes, not hours. The client signs directly inside the link.",
        systemNote: "AI drafted · Sent for signature · Viewed 3×",
        events: [
            { label: "Proposal generated by AI Assist", time: "Just now" },
            { label: "Sent to: james@acmeco.com", time: "Just now" },
            { label: "Opened by client — 3 views", time: "1h ago" },
            { label: "Proposal signed ✓", time: "3h ago" },
        ],
        accent: PHASE_ACCENTS.delivery,
        nodeIcon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        id: "onboarding-activated",
        index: 4,
        phase: "delivery",
        stepLabel: "Step 04",
        headline: "Onboarding activates automatically.",
        body: "The signature triggers an onboarding sequence — access provisioning, intake form, kickoff calendar link, and a client welcome message. Your delivery starts before you've touched a thing.",
        systemNote: "Onboarding sequence started · 4 of 6 tasks complete",
        events: [
            { label: "Onboarding checklist created", time: "Auto" },
            { label: "Client access email sent", time: "Auto" },
            { label: "Kickoff link delivered", time: "Auto" },
            { label: "Intake form completed by client", time: "2h ago" },
        ],
        accent: PHASE_ACCENTS.delivery,
        nodeIcon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        id: "growth",
        index: 5,
        phase: "growth",
        stepLabel: "Step 05",
        headline: "Delivery turns into compounding growth.",
        body: "After the project wraps, the growth loop activates. Check-ins are scheduled, upsell opportunities are flagged, and referral nudges are timed intelligently. The relationship compounds on autopilot.",
        systemNote: "Retention loop active · Upsell opportunity flagged",
        events: [
            { label: "30-day check-in email sent", time: "Auto" },
            { label: "Upsell opportunity: Retainer plan", time: "Flagged" },
            { label: "Referral nudge scheduled", time: "In 2 weeks" },
            { label: "NPS survey triggered", time: "Auto" },
        ],
        accent: PHASE_ACCENTS.growth,
        nodeIcon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
];

// ── Section heading ───────────────────────────────────────────────────────────

const SECTION_COPY = {
    eyebrow: "How HelixFlow works",
    headline: "From first contact to growing client.",
    sub: "Five steps. One system. No handoff gaps.",
} as const;

// ── Sub-components ────────────────────────────────────────────────────────────

/** Vertical node rail — shows step progress and active state */
function NodeRail({
    steps,
    activeIndex,
    reduced,
}: {
    steps: StoryStep[];
    activeIndex: number;
    reduced: boolean;
}) {
    const progressPct = ((activeIndex) / (steps.length - 1)) * 100;

    return (
        <div className="relative flex flex-col items-center" aria-hidden="true">
            {/* Background track */}
            <div className="absolute top-3 bottom-3 left-1/2 w-px -translate-x-1/2 bg-white/[0.06]" />

            {/* Animated progress fill */}
            <div
                className="absolute top-3 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-[#2DBBEE] via-[#818cf8] to-[#34d399] origin-top"
                style={{
                    height: `${progressPct}%`,
                    transition: reduced ? "none" : "height 0.5s cubic-bezier(0.25,1,0.5,1)",
                }}
            />

            {/* Nodes */}
            {steps.map((step, i) => {
                const isActive = i === activeIndex;
                const isPast = i < activeIndex;
                return (
                    <div
                        key={step.id}
                        className="relative z-10 flex items-center justify-center"
                        style={{ marginBottom: i < steps.length - 1 ? "64px" : 0 }}
                    >
                        <div
                            className={cn(
                                "flex h-7 w-7 items-center justify-center rounded-full",
                                "border transition-all",
                                reduced ? "" : "duration-300",
                                isActive
                                    ? "border-transparent scale-110"
                                    : isPast
                                        ? "border-white/20 bg-white/[0.06]"
                                        : "border-white/10 bg-transparent"
                            )}
                            style={
                                isActive
                                    ? {
                                        background: `linear-gradient(135deg, ${step.accent.from}, ${step.accent.to})`,
                                        boxShadow: `0 0 0 3px ${step.accent.glow}, 0 0 16px ${step.accent.glow}`,
                                    }
                                    : isPast
                                        ? { color: "#7A8FA8" }
                                        : {}
                            }
                        >
                            <div
                                className={cn(
                                    "transition-all",
                                    reduced ? "" : "duration-300",
                                    isActive ? "text-[#060D1A]" : isPast ? "text-[#7A8FA8]" : "text-[#3A4E68]"
                                )}
                            >
                                {isActive || isPast ? (
                                    step.nodeIcon
                                ) : (
                                    <span className="text-[9px] font-semibold">{step.index}</span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/** Activity feed inside the visual panel */
function ActivityFeed({
    events,
    accent,
    reduced,
}: {
    events: StepSystemEvent[];
    accent: StoryStep["accent"];
    reduced: boolean;
}) {
    return (
        <div className="space-y-2">
            {events.map((event, i) => (
                <motion.div
                    key={event.label}
                    initial={reduced ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={
                        reduced
                            ? { duration: 0 }
                            : { duration: 0.28, ease: ease.out, delay: i * 0.06 }
                    }
                    className="flex items-start justify-between gap-3"
                >
                    <div className="flex items-start gap-2">
                        <span
                            className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                            style={{ backgroundColor: accent.from, opacity: i === 0 ? 1 : 0.4 }}
                            aria-hidden="true"
                        />
                        <span className={cn("text-[11px] leading-tight", i === 0 ? "text-[#B8C5D6]" : "text-[#7A8FA8]")}>
                            {event.label}
                        </span>
                    </div>
                    <span className="flex-shrink-0 text-[10px] text-[#3A4E68]">{event.time}</span>
                </motion.div>
            ))}
        </div>
    );
}

/** The sticky visual panel — right column on desktop */
function VisualPanel({
    activeStep,
    reduced,
}: {
    activeStep: StoryStep;
    reduced: boolean;
}) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl",
                "border border-white/[0.07] border-t-white/[0.14]",
                "bg-[rgba(15,33,69,0.60)] backdrop-blur-xl",
                "shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_24px_72px_rgba(2,6,23,0.65)]"
            )}
        >
            {/* Background glow — morphs with active step */}
            <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-700"
                style={{
                    background: `radial-gradient(ellipse at 60% 20%, ${activeStep.accent.from}12, transparent 65%)`,
                }}
                aria-hidden="true"
            />

            {/* Chrome top-edge shine */}
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px transition-all duration-500"
                style={{
                    background: `linear-gradient(90deg, transparent, ${activeStep.accent.from}60, transparent)`,
                }}
                aria-hidden="true"
            />

            {/* Panel content */}
            <div className="relative p-6">
                {/* Window chrome */}
                <div className="mb-5 flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-white/[0.07]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white/[0.07]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white/[0.07]" />
                    <div
                        className="ml-3 flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-0.5"
                    >
                        <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: activeStep.accent.from, opacity: 0.8 }}
                            aria-hidden="true"
                        />
                        <span className="text-[10px] font-medium text-[#7A8FA8]">helixflow.cloud</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeStep.id}
                        initial={reduced ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduced ? {} : { opacity: 0, y: -10 }}
                        transition={
                            reduced
                                ? { duration: 0 }
                                : { duration: duration.base, ease: ease.inOut }
                        }
                    >
                        {/* Panel header */}
                        <div className="mb-4 flex items-start justify-between gap-3">
                            <div>
                                <p
                                    className="text-[10px] font-semibold uppercase tracking-widest"
                                    style={{ color: activeStep.accent.from, opacity: 0.7 }}
                                >
                                    {activeStep.stepLabel}
                                </p>
                                <h4 className="mt-0.5 text-base font-semibold text-[#F7FBFF]">
                                    {activeStep.headline}
                                </h4>
                            </div>
                            {/* Phase badge */}
                            <div
                                className="flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider capitalize"
                                style={{
                                    background: `${activeStep.accent.from}14`,
                                    color: activeStep.accent.from,
                                    border: `1px solid ${activeStep.accent.from}28`,
                                }}
                            >
                                {activeStep.phase}
                            </div>
                        </div>

                        {/* System note */}
                        <div className="mb-4 rounded-lg border border-white/[0.06] bg-[rgba(6,13,26,0.50)] px-3 py-2">
                            <p className="text-[11px] italic text-[#7A8FA8]">
                                <span
                                    className="not-italic font-medium"
                                    style={{ color: activeStep.accent.from, opacity: 0.8 }}
                                >
                                    System:{" "}
                                </span>
                                {activeStep.systemNote}
                            </p>
                        </div>

                        {/* Activity feed */}
                        <div>
                            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-[#3A4E68]">
                                Activity
                            </p>
                            <ActivityFeed
                                events={activeStep.events}
                                accent={activeStep.accent}
                                reduced={reduced}
                            />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom gradient fade */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[rgba(15,33,69,0.60)] to-transparent"
                aria-hidden="true"
            />
        </div>
    );
}

/** Single step in the left narrative column */
function NarrativeStep({
    step,
    isActive,
    triggerRef,
}: {
    step: StoryStep;
    isActive: boolean;
    triggerRef: React.RefObject<HTMLDivElement | null>;
}) {
    return (
        <div
            ref={triggerRef}
            className={cn(
                "relative py-10 transition-opacity duration-300",
                isActive ? "opacity-100" : "opacity-40"
            )}
        >
            {/* Step label */}
            <p
                className="mb-2 text-[10px] font-semibold uppercase tracking-widest transition-colors duration-300"
                style={{ color: isActive ? step.accent.from : "#3A4E68" }}
            >
                {step.stepLabel}
            </p>

            {/* Headline */}
            <h3
                className={cn(
                    "text-xl font-semibold leading-snug tracking-tight transition-colors duration-300 sm:text-2xl",
                    isActive ? "text-[#F7FBFF]" : "text-[#7A8FA8]"
                )}
            >
                {step.headline}
            </h3>

            {/* Body */}
            <p
                className={cn(
                    "mt-3 max-w-[44ch] text-sm leading-relaxed transition-colors duration-300 sm:text-base",
                    isActive ? "text-[#7A8FA8]" : "text-[#3A4E68]"
                )}
            >
                {step.body}
            </p>

            {/* Active indicator pill */}
            {isActive && (
                <div
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium"
                    style={{
                        background: `${step.accent.from}10`,
                        border: `1px solid ${step.accent.from}28`,
                        color: step.accent.from,
                    }}
                >
                    <span
                        className="h-1.5 w-1.5 animate-pulse rounded-full"
                        style={{ backgroundColor: step.accent.from }}
                        aria-hidden="true"
                    />
                    Active
                </div>
            )}
        </div>
    );
}

/** Mobile layout — flat stacked cards, no sticky */
function MobileStoryboard({ steps }: { steps: StoryStep[] }) {
    return (
        <div className="flex flex-col gap-4">
            {steps.map((step) => (
                <div
                    key={step.id}
                    className={cn(
                        "relative overflow-hidden rounded-2xl p-5",
                        "border border-white/[0.07] border-t-white/[0.12]",
                        "bg-[rgba(15,33,69,0.50)] backdrop-blur-xl",
                        "shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset]"
                    )}
                >
                    {/* Corner glow */}
                    <div
                        className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full"
                        style={{
                            background: `radial-gradient(circle at 80% 20%, ${step.accent.from}14, transparent 65%)`,
                        }}
                        aria-hidden="true"
                    />
                    {/* Top accent line */}
                    <div
                        className="absolute inset-x-0 top-0 h-px"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${step.accent.from}50, transparent)`,
                        }}
                        aria-hidden="true"
                    />

                    <p
                        className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest"
                        style={{ color: step.accent.from, opacity: 0.75 }}
                    >
                        {step.stepLabel}
                    </p>
                    <h3 className="text-base font-semibold leading-snug text-[#F7FBFF]">
                        {step.headline}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#7A8FA8]">{step.body}</p>

                    {/* System note */}
                    <p className="mt-3 text-[11px] italic text-[#3A4E68]">
                        <span className="not-italic font-medium" style={{ color: step.accent.from, opacity: 0.6 }}>
                            System:{" "}
                        </span>
                        {step.systemNote}
                    </p>
                </div>
            ))}
        </div>
    );
}

// ── Section export ─────────────────────────────────────────────────────────────

export default function StickyStoryboard() {
    const sectionRef = useRef<HTMLElement>(null);
    const reduced = useReducedMotion() ?? false;

    // Active step index — driven by IntersectionObserver on each trigger div
    const [activeIndex, setActiveIndex] = useState(0);

    // Refs for each step trigger element in the left column
    const stepRefs = useRef<Array<React.RefObject<HTMLDivElement | null>>>(
        STEPS.map(() => ({ current: null }))
    );

    // Debounce timer ref
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleStepVisible = useCallback((index: number) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setActiveIndex(index);
        }, 80);
    }, []);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        stepRefs.current.forEach((ref, index) => {
            if (!ref.current) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            handleStepVisible(index);
                        }
                    });
                },
                {
                    root: null,
                    rootMargin: "-35% 0px -35% 0px", // fire when step is in the middle 30% of viewport
                    threshold: 0,
                }
            );

            observer.observe(ref.current);
            observers.push(observer);
        });

        return () => {
            observers.forEach((obs) => obs.disconnect());
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [handleStepVisible]);

    const activeStep = STEPS[activeIndex];

    return (
        <section
            ref={sectionRef}
            id="storyboard"
            aria-label="HelixFlow workflow story — from lead to growth"
            className="relative bg-[#060D1A] py-20 sm:py-24 lg:py-28"
        >
            {/* ── Section ambient backdrop ──────────────────────────────────── */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-[#1466B8]/[0.05] blur-[120px]" />
                <div className="absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-[#34d399]/[0.03] blur-[120px]" />
            </div>

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

                {/* ── Section heading ──────────────────────────────────────────── */}
                <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-16">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 backdrop-blur-sm">
                        {/* Flow dots */}
                        <div className="flex items-center gap-0.5" aria-hidden="true">
                            {STEPS.map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "rounded-full transition-all duration-300",
                                        i === activeIndex ? "h-1.5 w-3" : "h-1.5 w-1.5 opacity-30"
                                    )}
                                    style={{
                                        background: i <= activeIndex
                                            ? STEPS[i].accent.from
                                            : "#3A4E68",
                                    }}
                                />
                            ))}
                        </div>
                        <span className="text-xs font-medium tracking-wide text-[#B8C5D6]">
                            {SECTION_COPY.eyebrow}
                        </span>
                    </div>

                    <h2 className="text-balance text-3xl font-semibold tracking-tight text-[#F7FBFF] sm:text-4xl">
                        {SECTION_COPY.headline}
                    </h2>
                    <p className="mt-4 text-pretty text-base leading-relaxed text-[#7A8FA8] sm:text-lg">
                        {SECTION_COPY.sub}
                    </p>
                </div>

                {/* ── Mobile layout ─────────────────────────────────────────────── */}
                <div className="lg:hidden">
                    <MobileStoryboard steps={STEPS} />
                </div>

                {/* ── Desktop sticky layout ─────────────────────────────────────── */}
                <div className="hidden lg:grid lg:grid-cols-[1fr_420px] lg:gap-12 xl:gap-16">

                    {/* Left: scrolling narrative steps + node rail */}
                    <div className="flex gap-8">
                        {/* Node rail */}
                        <div className="flex-shrink-0 pt-12">
                            <NodeRail
                                steps={STEPS}
                                activeIndex={activeIndex}
                                reduced={reduced}
                            />
                        </div>

                        {/* Step narrative blocks */}
                        <div className="flex-1">
                            {STEPS.map((step, i) => (
                                <NarrativeStep
                                    key={step.id}
                                    step={step}
                                    isActive={i === activeIndex}
                                    triggerRef={stepRefs.current[i] as React.RefObject<HTMLDivElement | null>}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right: sticky visual panel */}
                    <div className="relative">
                        <div className="sticky top-24">
                            <VisualPanel activeStep={activeStep} reduced={reduced} />

                            {/* Step counter below panel */}
                            <div className="mt-4 flex items-center justify-between px-1">
                                <div className="flex gap-1.5" role="group" aria-label="Step progress">
                                    {STEPS.map((step, i) => (
                                        <button
                                            key={step.id}
                                            onClick={() => setActiveIndex(i)}
                                            aria-label={`Go to step ${step.index}: ${step.headline}`}
                                            aria-current={i === activeIndex ? "step" : undefined}
                                            className={cn(
                                                "rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/50",
                                                reduced ? "" : "duration-300",
                                                i === activeIndex ? "h-1.5 w-5" : "h-1.5 w-1.5 opacity-30 hover:opacity-60"
                                            )}
                                            style={{
                                                background: i <= activeIndex
                                                    ? STEPS[i].accent.from
                                                    : "#3A4E68",
                                            }}
                                        />
                                    ))}
                                </div>
                                <span className="text-[11px] text-[#3A4E68]">
                                    {activeIndex + 1} / {STEPS.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* ── Bottom fade to next section ───────────────────────────────────── */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#060D1A] to-transparent"
                aria-hidden="true"
            />
        </section>
    );
}
