/**
 * ArticlePreviews
 * ─────────────────────────────────────────────────────────────
 * Section 6 — SEO article preview grid
 *
 * Purpose:
 *   Surface educational content that supports SEO and answer-engine
 *   visibility. Positions HelixFlow as a knowledgeable authority on
 *   the topics its audience is actively searching.
 *
 * Structure:
 *   1. Section heading — framed as "From the HelixFlow blog"
 *   2. Featured article — first item, full-width editorial card
 *   3. Secondary grid — remaining 5 items in a responsive 2–3 col grid
 *   4. Browse CTA — link to the full blog/resource center
 *
 * Semantic HTML:
 *   <section> → <header> → <article> (× N) inside <ul role="list">
 *   Each article has <h3>, <p>, and <a> — fully crawlable without JS.
 *
 * CMS integration path:
 *   Replace the ARTICLES array with a prop or a fetch() call in a
 *   parent server component. The rendering layer is unchanged.
 *   Suggested API shape: `ArticlePreview[]` (type exported at bottom).
 *
 * Motion:
 *   Staggered AnimateIn on the featured card and each grid card.
 *   No ambient loops. prefers-reduced-motion handled by AnimateIn.
 *
 * Content topics:
 *   - AI-assisted CRM for agencies
 *   - Lead-to-delivery workflow design
 *   - CRM vs spreadsheets for service businesses
 *   - Proposal and onboarding automation
 *   - AI summaries and follow-up sequencing
 *   - What to look for in a CRM for service businesses
 */

import AnimateIn from "@/components/primitives/AnimateIn";
import { fadeUp, fadeUpSlow, staggerContainer, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ArticlePreview {
    /** Unique slug — used as React key and future CMS ID */
    id: string;
    /** SEO-optimised article title */
    title: string;
    /** 1–2 sentence editorial description shown in the card */
    description: string;
    /** Primary topic tag — displayed as a category pill */
    tag: string;
    /** Estimated read time */
    readTime: string;
    /**
     * Canonical article URL.
     * Update to real paths when blog is live.
     * Using hash anchors as safe no-op placeholders.
     */
    href: string;
    /** Accent color applied to the tag pill and hover line */
    accent: string;
}

// ── Content ───────────────────────────────────────────────────────────────────
// To move to CMS: delete this array and pass ArticlePreview[] as a prop.

const ARTICLES: ArticlePreview[] = [
    {
        id: "ai-crm-agencies",
        title: "What AI-Assisted CRM Actually Means for Agencies",
        description:
            "Most CRMs were built for sales teams, not service delivery. We break down what it means to have an AI layer that works across your full client lifecycle — from first enquiry to retained relationship.",
        tag: "AI & CRM",
        readTime: "6 min read",
        href: "/blog/ai-crm-for-agencies",
        accent: "#2DBBEE",
    },
    {
        id: "lead-to-delivery",
        title: "Designing a Lead-to-Delivery Workflow That Doesn't Break Under Load",
        description:
            "When you're busy, the gaps in your process become expensive. Here's how structured lead-to-delivery workflows eliminate the coordination tax that grows with every new client.",
        tag: "Workflow Design",
        readTime: "5 min read",
        href: "/blog/lead-to-delivery-workflow",
        accent: "#818cf8",
    },
    {
        id: "crm-vs-spreadsheets",
        title: "CRM vs Spreadsheets: The Real Cost of Staying in Sheets",
        description:
            "Spreadsheets are flexible — until they aren't. We calculated the actual time and revenue cost of managing client relationships in a spreadsheet versus a purpose-built system.",
        tag: "Operations",
        readTime: "7 min read",
        href: "/blog/crm-vs-spreadsheets-service-business",
        accent: "#34d399",
    },
    {
        id: "proposal-automation",
        title: "How Proposal Automation Cuts Proposal-to-Signature Time by 80%",
        description:
            "The average agency spends 3–5 hours building a proposal from scratch. Automation doesn't replace the thinking — it removes the rebuilding. Here's what that looks like in practice.",
        tag: "Proposals",
        readTime: "4 min read",
        href: "/blog/proposal-automation-agencies",
        accent: "#f59e0b",
    },
    {
        id: "ai-followups",
        title: "AI Summaries and Follow-Ups: What Gets Automated and What Shouldn't",
        description:
            "The right line between automation and human judgment in client communication. Which follow-ups should fire automatically, and where a real message matters more than a fast one.",
        tag: "AI & Automation",
        readTime: "5 min read",
        href: "/blog/ai-summaries-followups",
        accent: "#2DBBEE",
    },
    {
        id: "crm-buying-guide",
        title: "What to Look For in a CRM if You Run a Service Business",
        description:
            "Product and e-commerce CRMs weren't built for the complexity of service delivery. Here are the eight capabilities that separate a useful CRM from one that becomes shelfware.",
        tag: "Buying Guide",
        readTime: "8 min read",
        href: "/blog/crm-buying-guide-service-business",
        accent: "#818cf8",
    },
];

const SECTION_COPY = {
    eyebrow: "Insights",
    headline: "Learn the system behind the software.",
    sub: "Practical writing on CRM, workflow design, and AI for agencies and service businesses.",
    cta: "Browse all articles",
    ctaHref: "/blog",
} as const;

// ── Sub-components ─────────────────────────────────────────────────────────────

/** Small category pill */
function TagPill({
    label,
    accent,
}: {
    label: string;
    accent: string;
}) {
    return (
        <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{
                background: `${accent}14`,
                border: `1px solid ${accent}28`,
                color: accent,
            }}
        >
            {label}
        </span>
    );
}

/** Clock icon + read time */
function ReadTime({ time }: { time: string }) {
    return (
        <span className="flex items-center gap-1 text-[11px] text-[#3A4E68]">
            <svg
                className="h-3 w-3"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
            >
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.1" />
                <path
                    d="M6 3.5V6l1.5 1.5"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            {time}
        </span>
    );
}

/** Arrow icon for the article read link */
function ArrowIcon({ className }: { className?: string }) {
    return (
        <svg
            className={cn("h-3.5 w-3.5", className)}
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M2.5 7h9M8 3.5L11.5 7 8 10.5"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/**
 * Featured article — first item, full-width, more editorial presence.
 * Larger headline, longer description, prominent CTA.
 */
function FeaturedArticleCard({ article }: { article: ArticlePreview }) {
    return (
        <article aria-label={article.title}>
            <a
                href={article.href}
                className={cn(
                    "group relative flex flex-col gap-5 overflow-hidden rounded-2xl p-6 sm:flex-row sm:items-start sm:gap-8 sm:p-8",
                    "border border-white/[0.07] border-t-white/[0.13]",
                    "bg-[rgba(15,33,69,0.55)] backdrop-blur-xl",
                    "shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_20px_64px_rgba(2,6,23,0.55)]",
                    "transition-shadow duration-300 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_28px_72px_rgba(2,6,23,0.65)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/50"
                )}
            >
                {/* Ambient glow on hover */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                        background: `radial-gradient(ellipse at 10% 0%, ${article.accent}0d, transparent 55%)`,
                    }}
                    aria-hidden="true"
                />

                {/* Top accent line */}
                <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px"
                    style={{
                        background: `linear-gradient(90deg, ${article.accent}60, ${article.accent}20, transparent)`,
                    }}
                    aria-hidden="true"
                />

                {/* Left editorial stripe — desktop only */}
                <div
                    className="hidden flex-shrink-0 sm:block sm:w-1 sm:self-stretch sm:rounded-full"
                    style={{
                        background: `linear-gradient(to bottom, ${article.accent}80, ${article.accent}10)`,
                    }}
                    aria-hidden="true"
                />

                {/* Content */}
                <div className="relative min-w-0 flex-1">
                    {/* Meta row */}
                    <div className="mb-3 flex flex-wrap items-center gap-2.5">
                        <TagPill label={article.tag} accent={article.accent} />
                        <ReadTime time={article.readTime} />
                        <span
                            className="hidden text-[11px] text-[#3A4E68] sm:block"
                            aria-hidden="true"
                        >
                            ·
                        </span>
                        <span className="hidden text-[10px] font-medium uppercase tracking-widest text-[#3A4E68] sm:block">
                            Featured
                        </span>
                    </div>

                    <h3 className="text-balance text-xl font-semibold leading-snug tracking-tight text-[#F7FBFF] transition-colors duration-200 group-hover:text-white sm:text-2xl">
                        {article.title}
                    </h3>

                    <p className="mt-3 max-w-prose text-sm leading-relaxed text-[#7A8FA8] sm:text-base">
                        {article.description}
                    </p>

                    {/* Read CTA */}
                    <div
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200"
                        style={{ color: article.accent }}
                    >
                        Read article
                        <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                </div>
            </a>
        </article>
    );
}

/**
 * Secondary article card — compact, grid layout.
 * Used for items 2–6.
 */
function ArticleCard({ article }: { article: ArticlePreview }) {
    return (
        <article aria-label={article.title}>
            <a
                href={article.href}
                className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-2xl p-5",
                    "border border-white/[0.06] border-t-white/[0.11]",
                    "bg-[rgba(15,33,69,0.40)] backdrop-blur-xl",
                    "shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_8px_32px_rgba(2,6,23,0.40)]",
                    "transition-all duration-300",
                    "hover:border-white/[0.10] hover:border-t-white/[0.18]",
                    "hover:shadow-[0_1px_0_0_rgba(255,255,255,0.07)_inset,0_16px_48px_rgba(2,6,23,0.55)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/50"
                )}
            >
                {/* Hover glow */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                    style={{
                        background: `radial-gradient(ellipse at 50% 0%, ${article.accent}0a, transparent 60%)`,
                    }}
                    aria-hidden="true"
                />

                {/* Top accent line — reveals on hover */}
                <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-70"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${article.accent}55, transparent)`,
                    }}
                    aria-hidden="true"
                />

                {/* Content */}
                <div className="relative flex h-full flex-col">
                    {/* Meta */}
                    <div className="mb-3 flex items-center gap-2">
                        <TagPill label={article.tag} accent={article.accent} />
                        <ReadTime time={article.readTime} />
                    </div>

                    {/* Title */}
                    <h3 className="text-balance text-[15px] font-semibold leading-snug tracking-tight text-[#F7FBFF] transition-colors duration-200 group-hover:text-white">
                        {article.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-[#7A8FA8]">
                        {article.description}
                    </p>

                    {/* Footer CTA */}
                    <div
                        className="mt-4 flex items-center gap-1 text-[12px] font-medium opacity-0 transition-all duration-200 group-hover:opacity-100"
                        style={{ color: article.accent }}
                    >
                        Read article
                        <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                </div>
            </a>
        </article>
    );
}

// ── Section export ─────────────────────────────────────────────────────────────

export default function ArticlePreviews() {
    const [featured, ...secondary] = ARTICLES;

    return (
        <section
            id="insights"
            aria-labelledby="insights-heading"
            className="relative bg-[#060D1A] py-20 sm:py-24 lg:py-28"
        >
            {/* ── Ambient backdrop ────────────────────────────────────────── */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute right-0 top-0 h-[480px] w-[480px] rounded-full bg-[#818cf8]/[0.03] blur-[110px]" />
                <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-[#2DBBEE]/[0.03] blur-[100px]" />
            </div>

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

                {/* ── Section heading ──────────────────────────────────────── */}
                <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
                    <div className="max-w-xl">
                        <AnimateIn variants={fadeUp} threshold={0.2}>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 backdrop-blur-sm">
                                {/* Pen nib icon */}
                                <svg
                                    className="h-3 w-3 text-[#7A8FA8]"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M2 10L5 7M7.5 1.5l3 3-6 6H1.5v-3l6-6Z"
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
                                id="insights-heading"
                                className="text-balance text-3xl font-semibold tracking-tight text-[#F7FBFF] sm:text-4xl"
                            >
                                {SECTION_COPY.headline}
                            </h2>
                        </AnimateIn>

                        <AnimateIn variants={fadeUp} delay={0.16} threshold={0.2}>
                            <p className="mt-3 text-pretty text-base leading-relaxed text-[#7A8FA8]">
                                {SECTION_COPY.sub}
                            </p>
                        </AnimateIn>
                    </div>

                    {/* Desktop browse CTA — aligned to heading baseline */}
                    <AnimateIn variants={fadeUp} delay={0.2} threshold={0.2}>
                        <a
                            href={SECTION_COPY.ctaHref}
                            className={cn(
                                "hidden sm:inline-flex items-center gap-1.5 self-end",
                                "rounded-full border border-white/10 bg-white/[0.04] px-4 py-2",
                                "text-sm font-medium text-[#B8C5D6] backdrop-blur-sm",
                                "transition-all duration-200 hover:border-white/20 hover:bg-white/[0.07] hover:text-[#F7FBFF]",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/50"
                            )}
                        >
                            {SECTION_COPY.cta}
                            <ArrowIcon />
                        </a>
                    </AnimateIn>
                </header>

                {/* ── Featured article ──────────────────────────────────────── */}
                <AnimateIn variants={fadeUpSlow} threshold={0.08}>
                    <FeaturedArticleCard article={featured} />
                </AnimateIn>

                {/* ── Secondary article grid ────────────────────────────────── */}
                <AnimateIn
                    as="ul"
                    variants={staggerContainer(stagger.base, 0.05)}
                    threshold={0.05}
                    className="mt-5 grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {secondary.map((article, i) => (
                        <AnimateIn
                            key={article.id}
                            as="li"
                            variants={fadeUp}
                            delay={i * stagger.base}
                            threshold={0.05}
                        >
                            <ArticleCard article={article} />
                        </AnimateIn>
                    ))}
                </AnimateIn>                {/* ── Mobile browse CTA ─────────────────────────────────────── */}
                <AnimateIn variants={fadeUp} threshold={0.1}>
                    <div className="mt-8 flex justify-center sm:hidden">
                        <a
                            href={SECTION_COPY.ctaHref}
                            className={cn(
                                "inline-flex items-center gap-1.5",
                                "rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5",
                                "text-sm font-medium text-[#B8C5D6] backdrop-blur-sm",
                                "transition-all duration-200 hover:border-white/20 hover:text-[#F7FBFF]",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/50"
                            )}
                        >
                            {SECTION_COPY.cta}
                            <ArrowIcon />
                        </a>
                    </div>
                </AnimateIn>

            </div>

            {/* ── Bottom fade to next section ───────────────────────────────── */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#060D1A] to-transparent"
                aria-hidden="true"
            />
        </section>
    );
}
