"use client";

/**
 * ModuleGrid
 * ─────────────────────────────────────────────────────────────
 * Section 3 — Three-module capability overview
 *
 * Presents the three core HelixFlow modules in an editorial
 * 2-up grid (desktop) with a featured primary module and two
 * supporting modules. Each card carries a mock UI preview panel
 * to make the capability tangible.
 *
 * Layout:
 *   Mobile  — single column stack
 *   Tablet  — 2-column grid (primary spans full, two below)
 *   Desktop — asymmetric: primary card full-width top row,
 *             two supporting cards in a 2-col row below
 *             OR: primary left (large), two stacked right
 *
 * Motion:
 *   - Section heading: fadeUp on viewport entry
 *   - Primary card: fadeUpSlow, delay 0.1
 *   - Supporting cards: stagger fadeUp, delay 0.2 / 0.3
 *   - Card hover: spring lift + border brightening (CSS)
 *   - Mock UI elements: subtle ambient float on primary card
 *   - prefers-reduced-motion: instant appearance, no float
 *
 * Content:
 *   Typed MODULES array at top of file.
 *   To move to CMS: replace array with a prop/fetch — rendering unchanged.
 */

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type ModuleStatus = "live" | "beta" | "coming-soon";

interface ModuleFeature {
    label: string;
}

interface Module {
    id: string;
    phase: "leads" | "delivery" | "ai";    // maps to lifecycle phase
    title: string;
    tagline: string;                        // one-line benefit statement
    description: string;                   // 2–3 sentence body
    status: ModuleStatus;
    features: ModuleFeature[];
    accent: {
        from: string;
        to: string;
        glow: string;
        subtle: string;                      // very low-opacity background tint
    };
    icon: React.ReactNode;
    mockUI: React.ReactNode;               // static mock interface panel
    primary?: boolean;                     // true = featured / larger card
}

// ── Static content ─────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<ModuleStatus, string> = {
    live: "Live",
    beta: "Beta",
    "coming-soon": "Coming soon",
};

const STATUS_COLORS: Record<ModuleStatus, { dot: string; text: string; border: string; bg: string }> = {
    live: { dot: "#34d399", text: "#34d399", border: "rgba(52,211,153,0.20)", bg: "rgba(52,211,153,0.06)" },
    beta: { dot: "#fbbf24", text: "#fbbf24", border: "rgba(251,191,36,0.20)", bg: "rgba(251,191,36,0.06)" },
    "coming-soon": { dot: "#94a3b8", text: "#94a3b8", border: "rgba(148,163,184,0.18)", bg: "rgba(148,163,184,0.05)" },
};

// ── Mock UI components (inlined — no external data) ───────────────────────────

/** Pipeline Kanban-style mock */
const PipelineMockUI = (
    <div className="select-none space-y-2" aria-hidden="true">
        {/* Column header row */}
        <div className="flex gap-2 text-[9px] font-semibold uppercase tracking-widest text-[#3A4E68]">
            <span className="w-[72px]">Leads</span>
            <span className="w-[72px]">Qualified</span>
            <span className="w-[72px]">Proposal</span>
        </div>
        {/* Cards per column */}
        <div className="flex gap-2">
            {/* Leads col */}
            <div className="flex w-[72px] flex-col gap-1.5">
                {["Acme Co", "Tide Media"].map((name) => (
                    <div
                        key={name}
                        className="rounded-md border border-white/[0.07] bg-[rgba(15,33,69,0.80)] px-2 py-1.5"
                    >
                        <div className="mb-0.5 h-1.5 w-8 rounded-full bg-[#2DBBEE]/40" />
                        <p className="text-[9px] font-medium text-[#B8C5D6]">{name}</p>
                    </div>
                ))}
            </div>
            {/* Qualified col */}
            <div className="flex w-[72px] flex-col gap-1.5">
                {["Northstar", "Flux Labs"].map((name) => (
                    <div
                        key={name}
                        className="rounded-md border border-white/[0.07] bg-[rgba(15,33,69,0.80)] px-2 py-1.5"
                    >
                        <div className="mb-0.5 h-1.5 w-6 rounded-full bg-[#6366f1]/40" />
                        <p className="text-[9px] font-medium text-[#B8C5D6]">{name}</p>
                    </div>
                ))}
            </div>
            {/* Proposal col */}
            <div className="flex w-[72px] flex-col gap-1.5">
                {["Vega Studio"].map((name) => (
                    <div
                        key={name}
                        className="rounded-md border border-[#2DBBEE]/20 bg-[rgba(45,187,238,0.06)] px-2 py-1.5"
                    >
                        <div className="mb-0.5 h-1.5 w-10 rounded-full bg-[#2DBBEE]/60" />
                        <p className="text-[9px] font-medium text-[#2DBBEE]">{name}</p>
                    </div>
                ))}
            </div>
        </div>
        {/* Score row */}
        <div className="flex items-center gap-1.5 border-t border-white/[0.05] pt-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[9px] text-[#7A8FA8]">3 follow-ups due today</span>
        </div>
    </div>
);

/** Proposal / Onboarding flow mock */
const ProposalMockUI = (
    <div className="select-none space-y-2.5" aria-hidden="true">
        {/* Doc header */}
        <div className="rounded-lg border border-white/[0.07] bg-[rgba(15,33,69,0.80)] p-2.5">
            <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <div className="h-4 w-4 rounded-md border border-[#6366f1]/30 bg-[#6366f1]/10 grid place-items-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#6366f1]/70" />
                    </div>
                    <span className="text-[9px] font-semibold text-[#B8C5D6]">Proposal_AcmeCo.pdf</span>
                </div>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-1.5 text-[8px] font-medium text-emerald-400">
                    Signed
                </span>
            </div>
            {/* Faux text lines */}
            <div className="space-y-1">
                <div className="h-1 w-full rounded-full bg-white/[0.06]" />
                <div className="h-1 w-4/5 rounded-full bg-white/[0.06]" />
                <div className="h-1 w-2/3 rounded-full bg-white/[0.06]" />
            </div>
        </div>
        {/* Onboarding checklist */}
        <div className="space-y-1">
            <p className="text-[8px] font-semibold uppercase tracking-widest text-[#3A4E68]">Onboarding checklist</p>
            {[
                { label: "Intake form sent", done: true },
                { label: "Access granted", done: true },
                { label: "Kick-off scheduled", done: false },
            ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                    <div className={cn(
                        "flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-full",
                        item.done
                            ? "border-[0.5px] border-emerald-400/40 bg-emerald-400/15"
                            : "border-[0.5px] border-white/10 bg-white/[0.03]"
                    )}>
                        {item.done && (
                            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                                <path d="M1 3l1.5 1.5L5 1.5" stroke="#34d399" strokeWidth="1" strokeLinecap="round" />
                            </svg>
                        )}
                    </div>
                    <span className={cn("text-[9px]", item.done ? "text-[#7A8FA8]" : "text-[#B8C5D6]")}>
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

/** AI Assist output mock */
const AIAssistMockUI = (
    <div className="select-none space-y-2" aria-hidden="true">
        {/* Prompt chip */}
        <div className="flex items-center gap-1.5">
            <div className="h-3.5 w-3.5 rounded-full border border-[#2DBBEE]/30 bg-[#2DBBEE]/10 grid place-items-center flex-shrink-0">
                <div className="h-1 w-1 rounded-full bg-[#2DBBEE]" />
            </div>
            <span className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2 py-0.5 text-[9px] text-[#7A8FA8]">
                Summarize last 3 client meetings
            </span>
        </div>
        {/* Response block */}
        <div className="rounded-lg border border-[#2DBBEE]/10 bg-[rgba(45,187,238,0.04)] p-2.5">
            <div className="mb-1 flex items-center gap-1">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2DBBEE]" />
                <span className="text-[8px] font-medium text-[#2DBBEE]/70">AI Assist</span>
            </div>
            <div className="space-y-1">
                <div className="h-1 w-full rounded-full bg-[#2DBBEE]/15" />
                <div className="h-1 w-5/6 rounded-full bg-[#2DBBEE]/10" />
                <div className="h-1 w-4/5 rounded-full bg-[#2DBBEE]/10" />
                <div className="h-1 w-2/3 rounded-full bg-[#2DBBEE]/08" />
            </div>
        </div>
        {/* Suggested actions */}
        <div className="flex flex-wrap gap-1">
            {["Draft follow-up", "Create task", "Send update"].map((action) => (
                <span
                    key={action}
                    className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-[9px] text-[#7A8FA8]"
                >
                    {action}
                </span>
            ))}
        </div>
    </div>
);

// ── Module data ───────────────────────────────────────────────────────────────

const MODULES: Module[] = [
    {
        id: "pipeline",
        phase: "leads",
        title: "Pipeline",
        tagline: "Your entire lead flow in one structured board.",
        description:
            "Track every inbound opportunity from first contact to signed proposal. Stages, tasks, notes, and follow-up reminders — all in one view that actually reflects how you work.",
        status: "coming-soon",
        primary: true,
        features: [
            { label: "Kanban pipeline" },
            { label: "Lead scoring" },
            { label: "Automated follow-ups" },
            { label: "Contact timeline" },
            { label: "Stage automations" },
        ],
        accent: {
            from: "#2DBBEE",
            to: "#1466B8",
            glow: "rgba(45,187,238,0.12)",
            subtle: "rgba(45,187,238,0.03)",
        },
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                    d="M9 17H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3m-6 14H17a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H11a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2Z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
        mockUI: PipelineMockUI,
    },
    {
        id: "proposals-onboarding",
        phase: "delivery",
        title: "Proposals → Onboarding",
        tagline: "Signed to started — without the back-and-forth.",
        description:
            "Generate scoped proposals from your intake data. Once signed, automated onboarding sequences kick in: access provisioning, kickoff scheduling, and project setup — all without manual steps.",
        status: "coming-soon",
        features: [
            { label: "AI proposal generation" },
            { label: "E-signature ready" },
            { label: "Onboarding automations" },
            { label: "Intake forms" },
        ],
        accent: {
            from: "#818cf8",
            to: "#4f46e5",
            glow: "rgba(129,140,248,0.12)",
            subtle: "rgba(129,140,248,0.03)",
        },
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                    d="M9 12h3.75M9 15h3.75M9 18h3.75M14.25 18.75h1.5a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 9 4.5h6a2.25 2.25 0 0 1 2.122 1.5m-5.8 0L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
        mockUI: ProposalMockUI,
    },
    {
        id: "ai-assist",
        phase: "ai",
        title: "AI Assist",
        tagline: "Meeting notes, follow-ups, and updates — written for you.",
        description:
            "HelixFlow's AI layer surfaces context from your pipeline and writes consistently on-brand: client summaries, follow-up drafts, meeting recaps, and progress updates ready to send.",
        status: "coming-soon",
        features: [
            { label: "Client summaries" },
            { label: "Follow-up drafting" },
            { label: "Meeting recaps" },
            { label: "On-brand voice" },
        ],
        accent: {
            from: "#2DBBEE",
            to: "#0ea5e9",
            glow: "rgba(45,187,238,0.14)",
            subtle: "rgba(45,187,238,0.03)",
        },
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
        mockUI: AIAssistMockUI,
    },
];

// ── Section heading content ───────────────────────────────────────────────────

const SECTION_COPY = {
    eyebrow: "Capabilities",
    headline: "The tools inside the system.",
    sub: "Three modules. Each one maps to a phase of your delivery lifecycle — and all three share data, context, and automation logic.",
} as const;

// ── Sub-components ────────────────────────────────────────────────────────────

/** Status badge */
function StatusBadge({ status }: { status: ModuleStatus }) {
    const s = STATUS_COLORS[status];
    return (
        <div
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
            style={{ border: `1px solid ${s.border}`, background: s.bg }}
        >
            <span
                className={cn("h-1.5 w-1.5 rounded-full", status === "live" && "animate-pulse")}
                style={{ backgroundColor: s.dot }}
                aria-hidden="true"
            />
            <span className="text-[10px] font-medium tracking-wide" style={{ color: s.text }}>
                {STATUS_LABELS[status]}
            </span>
        </div>
    );
}

/** Phase connection label — shows which lifecycle phase this module belongs to */
function PhasePip({ phase }: { phase: Module["phase"] }) {
    const labels: Record<Module["phase"], { label: string; color: string }> = {
        leads: { label: "Leads phase", color: "#2DBBEE" },
        delivery: { label: "Delivery phase", color: "#818cf8" },
        ai: { label: "AI layer", color: "#2DBBEE" },
    };
    const { label, color } = labels[phase];
    return (
        <div className="flex items-center gap-1.5" aria-label={label}>
            <div
                className="h-1.5 w-4 rounded-full opacity-60"
                style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
                aria-hidden="true"
            />
            <span className="text-[10px] text-[#3A4E68]" aria-hidden="true">{label}</span>
        </div>
    );
}

/** Feature tag pills */
function FeaturePill({ label, accent }: { label: string; accent: Module["accent"] }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-[#B8C5D6]">
            <span
                className="h-1 w-1 flex-shrink-0 rounded-full"
                style={{ backgroundColor: accent.from, opacity: 0.7 }}
                aria-hidden="true"
            />
            {label}
        </span>
    );
}

/** Mock UI container — frosted inner panel */
function MockUIPanel({
    children,
    accent,
    reduced,
    isPrimary,
}: {
    children: React.ReactNode;
    accent: Module["accent"];
    reduced: boolean;
    isPrimary: boolean;
}) {
    return (
        <motion.div
            className={cn(
                "overflow-hidden rounded-xl p-4",
                "border border-white/[0.06] border-t-white/[0.10]",
                "bg-[rgba(6,13,26,0.60)] backdrop-blur-sm",
                "shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]"
            )}
            animate={
                !reduced && isPrimary
                    ? {
                        y: [0, -3, 0],
                        transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                    }
                    : {}
            }
        >
            {/* Top chrome bar */}
            <div className="mb-3 flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-white/[0.08]" />
                <div className="h-2 w-2 rounded-full bg-white/[0.08]" />
                <div className="h-2 w-2 rounded-full bg-white/[0.08]" />
                <div
                    className="ml-2 h-1 flex-1 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${accent.from}30, transparent)` }}
                />
            </div>
            {children}
        </motion.div>
    );
}

/**
 * Primary (featured) module card — larger, horizontal layout on desktop
 */
function PrimaryModuleCard({
    module,
    isInView,
    reduced,
}: {
    module: Module;
    isInView: boolean;
    reduced: boolean;
}) {
    return (
        <motion.article
            aria-label={`Module: ${module.title}`}
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={
                isInView
                    ? {
                        opacity: 1,
                        y: 0,
                        transition: reduced
                            ? { duration: 0 }
                            : { duration: duration.slow, ease: ease.outSoft, delay: 0.1 },
                    }
                    : reduced
                        ? {}
                        : { opacity: 0, y: 28 }
            }
            className={cn(
                "group relative overflow-hidden rounded-2xl p-6 sm:p-8",
                "border border-white/[0.07] border-t-white/[0.14]",
                "bg-[rgba(15,33,69,0.55)] backdrop-blur-xl",
                "shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_20px_60px_rgba(2,6,23,0.55)]",
                "transition-[transform,box-shadow] duration-200 ease-out",
                "hover:-translate-y-1 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_28px_72px_rgba(2,6,23,0.65)]",
                "motion-reduce:transform-none motion-reduce:transition-none"
            )}
        >
            {/* Background glow */}
            <div
                className="pointer-events-none absolute -left-12 -top-12 h-64 w-64 rounded-full opacity-60"
                style={{ background: `radial-gradient(circle, ${module.accent.from}18, transparent 70%)` }}
                aria-hidden="true"
            />
            {/* Chrome top-edge shine */}
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${module.accent.from}50, transparent)` }}
                aria-hidden="true"
            />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto]">
                {/* Left: text content */}
                <div className="flex flex-col gap-5">
                    {/* Top row: icon + status + phase */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Icon orb */}
                        <div
                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 border-t-white/[0.18] bg-[rgba(15,33,69,0.80)] shadow-[0_1px_0_0_rgba(255,255,255,0.07)_inset]"
                            style={{ color: module.accent.from }}
                        >
                            {module.icon}
                        </div>
                        <StatusBadge status={module.status} />
                        <PhasePip phase={module.phase} />
                    </div>

                    {/* Title + tagline */}
                    <div>
                        <h3 className="text-xl font-semibold text-[#F7FBFF] sm:text-2xl">{module.title}</h3>
                        <p
                            className="mt-0.5 text-sm font-medium sm:text-base"
                            style={{ color: module.accent.from }}
                        >
                            {module.tagline}
                        </p>
                    </div>

                    {/* Description */}
                    <p className="max-w-prose text-sm leading-relaxed text-[#7A8FA8] sm:text-base">
                        {module.description}
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-1.5" role="list" aria-label={`${module.title} features`}>
                        {module.features.map((f) => (
                            <div key={f.label} role="listitem">
                                <FeaturePill label={f.label} accent={module.accent} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: mock UI panel */}
                <div className="flex items-center lg:w-[240px]">
                    <MockUIPanel accent={module.accent} reduced={reduced} isPrimary>
                        {module.mockUI}
                    </MockUIPanel>
                </div>
            </div>
        </motion.article>
    );
}

/**
 * Supporting module card — compact, vertical layout
 */
function SupportingModuleCard({
    module,
    isInView,
    staggerDelay,
    reduced,
}: {
    module: Module;
    isInView: boolean;
    staggerDelay: number;
    reduced: boolean;
}) {
    return (
        <motion.article
            aria-label={`Module: ${module.title}`}
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={
                isInView
                    ? {
                        opacity: 1,
                        y: 0,
                        transition: reduced
                            ? { duration: 0 }
                            : { duration: duration.slow, ease: ease.outSoft, delay: staggerDelay },
                    }
                    : reduced
                        ? {}
                        : { opacity: 0, y: 24 }
            }
            className={cn(
                "group relative flex flex-col gap-5 overflow-hidden rounded-2xl p-6",
                "border border-white/[0.07] border-t-white/[0.12]",
                "bg-[rgba(15,33,69,0.50)] backdrop-blur-xl",
                "shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_12px_40px_rgba(2,6,23,0.45)]",
                "transition-[transform,box-shadow] duration-200 ease-out",
                "hover:-translate-y-1.5 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.07)_inset,0_20px_56px_rgba(2,6,23,0.58)]",
                "motion-reduce:transform-none motion-reduce:transition-none"
            )}
        >
            {/* Background corner glow */}
            <div
                className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full"
                style={{ background: `radial-gradient(circle, ${module.accent.from}14, transparent 70%)` }}
                aria-hidden="true"
            />

            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
                <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 border-t-white/[0.16] bg-[rgba(15,33,69,0.80)] shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset]"
                    style={{ color: module.accent.from }}
                >
                    {module.icon}
                </div>
                <StatusBadge status={module.status} />
            </div>

            {/* Title + tagline */}
            <div>
                <PhasePip phase={module.phase} />
                <h3 className="mt-1.5 text-lg font-semibold leading-snug text-[#F7FBFF]">
                    {module.title}
                </h3>
                <p className="mt-0.5 text-xs font-medium" style={{ color: module.accent.from }}>
                    {module.tagline}
                </p>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-[#7A8FA8]">{module.description}</p>

            {/* Mock UI */}
            <MockUIPanel accent={module.accent} reduced={reduced} isPrimary={false}>
                {module.mockUI}
            </MockUIPanel>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-1.5" role="list" aria-label={`${module.title} features`}>
                {module.features.map((f) => (
                    <div key={f.label} role="listitem">
                        <FeaturePill label={f.label} accent={module.accent} />
                    </div>
                ))}
            </div>

            {/* Bottom accent line */}
            <div
                className="absolute inset-x-6 bottom-0 h-px opacity-40"
                style={{ background: `linear-gradient(90deg, transparent, ${module.accent.from}60, transparent)` }}
                aria-hidden="true"
            />
        </motion.article>
    );
}

// ── Section export ─────────────────────────────────────────────────────────────

export default function ModuleGrid() {
    const sectionRef = useRef<HTMLElement>(null);
    const reduced = useReducedMotion() ?? false;

    const isInView = useInView(sectionRef, {
        once: true,
        amount: 0.1,
    });

    const primaryModule = MODULES.find((m) => m.primary)!;
    const supportingModules = MODULES.filter((m) => !m.primary);

    return (
        <section
            ref={sectionRef}
            id="modules"
            aria-label="HelixFlow modules — Pipeline, Proposals and Onboarding, AI Assist"
            className="relative bg-[#060D1A] py-20 sm:py-24 lg:py-28"
        >
            {/* ── Section ambient backdrop ──────────────────────────────────── */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute left-0 top-1/4 h-[500px] w-[500px] rounded-full bg-[#2DBBEE]/[0.04] blur-[120px]" />
                <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-[#818cf8]/[0.04] blur-[120px]" />
            </div>

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

                {/* ── Section heading ──────────────────────────────────────────── */}
                <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-14">
                    <motion.div
                        initial={reduced ? false : { opacity: 0, y: 14 }}
                        animate={
                            isInView
                                ? {
                                    opacity: 1,
                                    y: 0,
                                    transition: reduced ? { duration: 0 } : { duration: duration.base, ease: ease.out },
                                }
                                : reduced
                                    ? {}
                                    : { opacity: 0, y: 14 }
                        }
                        className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 backdrop-blur-sm"
                    >
                        {/* Decorative tri-dot representing the 3 modules */}
                        <div className="flex items-center gap-1" aria-hidden="true">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#2DBBEE]/70" />
                            <div className="h-1.5 w-1.5 rounded-full bg-[#818cf8]/70" />
                            <div className="h-1.5 w-1.5 rounded-full bg-[#2DBBEE]/50" />
                        </div>
                        <span className="text-xs font-medium tracking-wide text-[#B8C5D6]">
                            {SECTION_COPY.eyebrow}
                        </span>
                    </motion.div>

                    <motion.h2
                        className="text-balance text-3xl font-semibold tracking-tight text-[#F7FBFF] sm:text-4xl"
                        initial={reduced ? false : { opacity: 0, y: 18 }}
                        animate={
                            isInView
                                ? {
                                    opacity: 1,
                                    y: 0,
                                    transition: reduced ? { duration: 0 } : { duration: duration.slow, ease: ease.outSoft, delay: 0.1 },
                                }
                                : reduced
                                    ? {}
                                    : { opacity: 0, y: 18 }
                        }
                    >
                        {SECTION_COPY.headline}
                    </motion.h2>

                    <motion.p
                        className="mt-4 text-pretty text-base leading-relaxed text-[#7A8FA8] sm:text-lg"
                        initial={reduced ? false : { opacity: 0, y: 14 }}
                        animate={
                            isInView
                                ? {
                                    opacity: 1,
                                    y: 0,
                                    transition: reduced ? { duration: 0 } : { duration: duration.base, ease: ease.out, delay: 0.2 },
                                }
                                : reduced
                                    ? {}
                                    : { opacity: 0, y: 14 }
                        }
                    >
                        {SECTION_COPY.sub}
                    </motion.p>
                </div>

                {/* ── Module grid ──────────────────────────────────────────────── */}
                <div className="flex flex-col gap-5">
                    {/* Primary featured module — full width */}
                    <PrimaryModuleCard
                        module={primaryModule}
                        isInView={isInView}
                        reduced={reduced}
                    />

                    {/* Supporting modules — 2-col on md+ */}
                    <div className="grid gap-5 md:grid-cols-2">
                        {supportingModules.map((module, i) => (
                            <SupportingModuleCard
                                key={module.id}
                                module={module}
                                isInView={isInView}
                                staggerDelay={reduced ? 0 : 0.22 + i * 0.12}
                                reduced={reduced}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Bottom bridge — connecting to sticky storyboard ──────────── */}
                <motion.div
                    className={cn(
                        "mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl px-6 py-4 sm:flex-row lg:mt-12",
                        "border border-white/[0.06] border-t-white/[0.10]",
                        "bg-[rgba(15,33,69,0.35)] backdrop-blur-md"
                    )}
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={
                        isInView
                            ? {
                                opacity: 1,
                                y: 0,
                                transition: reduced ? { duration: 0 } : { duration: duration.base, ease: ease.out, delay: 0.48 },
                            }
                            : reduced
                                ? {}
                                : { opacity: 0, y: 12 }
                    }
                >
                    <p className="text-center text-sm text-[#7A8FA8] sm:text-left">
                        All three modules share one context layer.{" "}
                        <span className="text-[#B8C5D6]">What you capture in Pipeline flows into Proposals. AI Assist reads all of it.</span>
                    </p>
                    <a
                        href="#storyboard"
                        className={cn(
                            "inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg px-4 py-2",
                            "border border-white/10 bg-white/[0.04] backdrop-blur-sm",
                            "text-sm font-medium text-[#B8C5D6] transition-all duration-150",
                            "hover:border-white/20 hover:bg-white/[0.08] hover:text-[#F7FBFF]",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/50",
                            "motion-reduce:transition-none"
                        )}
                    >
                        See it in action
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

            {/* ── Bottom fade ───────────────────────────────────────────────── */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#060D1A] to-transparent"
                aria-hidden="true"
            />
        </section>
    );
}
