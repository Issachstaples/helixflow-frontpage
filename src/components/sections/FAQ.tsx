"use client";

/**
 * FAQ
 * ─────────────────────────────────────────────────────────────
 * Section 7 — Frequently Asked Questions
 *
 * Purpose:
 *   Resolve final objections and support both search engine
 *   indexing and AI answer-engine retrieval. Every question and
 *   answer is rendered in semantic HTML — fully crawlable at
 *   zero JS, visible to Googlebot and LLM crawlers alike.
 *
 * Structure:
 *   1. Section heading with schema annotation comment
 *   2. Accordion — one item per FAQ, single-open mode
 *   3. JSON-LD FAQ schema injected via <script type="application/ld+json">
 *      — gives Google rich-result eligibility without a CMS dependency
 *
 * Accessibility:
 *   Built on Radix UI Accordion (via shadcn/ui).
 *   - Keyboard navigable: Arrow keys, Enter/Space, Home/End
 *   - aria-expanded on trigger (managed by Radix)
 *   - aria-controls / aria-labelledby wired by Radix
 *   - Focus ring visible on keyboard navigation
 *
 * SEO / Answer-engine:
 *   - Questions are <h3> elements inside each AccordionTrigger header
 *   - Answers are <p> (or multi-<p>) elements — not hidden from crawlers
 *     because Radix renders content in the DOM and CSS animates visibility
 *   - JSON-LD FAQPage schema injected in-component (no _document.tsx needed)
 *   - Schema mirrors content exactly — single source of truth
 *
 * CMS integration path:
 *   Replace the FAQS array with a prop or a server-component fetch.
 *   The JSON-LD generator and rendering layer are unchanged.
 *   Exported type: `FAQItem`
 *
 * Motion:
 *   AnimateIn stagger on the accordion container.
 *   Accordion open/close animation: CSS (shadcn animate-accordion-*).
 *   No Framer Motion inside — keeps accordion interaction snappy.
 *   prefers-reduced-motion: AnimateIn handles entrance automatically;
 *   shadcn accordion respects `motion-safe:` on its CSS animation.
 */

import { useId } from "react";
import AnimateIn from "@/components/primitives/AnimateIn";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { fadeUp, fadeUpSlow } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FAQItem {
    /** Unique slug — React key and JSON-LD identifier */
    id: string;
    /** The question — used as accordion trigger text and schema question */
    question: string;
    /**
     * The answer — plain string for the JSON-LD schema.
     * Separate `answerParagraphs` array allows rich multi-paragraph rendering
     * in the UI without polluting the schema with HTML.
     */
    answer: string;
    /**
     * Optional multi-paragraph breakdown for the expanded accordion body.
     * If omitted, `answer` is rendered as a single paragraph.
     */
    answerParagraphs?: string[];
}

// ── Content ───────────────────────────────────────────────────────────────────
// To move to CMS: delete this array and accept `faqs: FAQItem[]` as a prop.
// The JSON-LD schema and rendering are derived from the same array automatically.

const FAQS: FAQItem[] = [
    {
        id: "what-is-helixflow",
        question: "What is HelixFlow?",
        answer:
            "HelixFlow is an AI-assisted CRM and workflow platform built specifically for agencies and service businesses. It connects your full client lifecycle — from lead capture and proposals to onboarding, delivery, and retention — inside a single system, so nothing falls through the gaps between handoffs.",
        answerParagraphs: [
            "HelixFlow is an AI-assisted CRM and workflow platform built specifically for agencies and service businesses. It connects your full client lifecycle — from lead capture and proposals to onboarding, delivery, and retention — inside a single system.",
            "Unlike general-purpose CRMs designed for sales volume, HelixFlow is structured around the way service businesses actually work: relationship-first, delivery-critical, and growth through retention.",
        ],
    },
    {
        id: "who-is-helixflow-for",
        question: "Who is HelixFlow built for?",
        answer:
            "HelixFlow is built for digital agencies, creative studios, consultancies, and service businesses where client relationships, delivery quality, and repeat engagement are the primary drivers of growth. It's particularly valuable for teams that are outgrowing spreadsheets and disconnected tools but don't want the complexity of an enterprise CRM.",
        answerParagraphs: [
            "HelixFlow is built for digital agencies, creative studios, consultancies, and service businesses where client relationships, delivery quality, and repeat engagement are the primary drivers of growth.",
            "It's particularly valuable for teams outgrowing spreadsheets and disconnected tool stacks — who need structure and automation without the complexity and overhead of an enterprise CRM.",
        ],
    },
    {
        id: "ai-assisted-crm",
        question: "What does AI-assisted CRM mean?",
        answer:
            "AI-assisted CRM means the system actively helps you work — not just stores data. HelixFlow's AI layer drafts proposals from your intake data, summarises contact history before a call, suggests follow-up timing, flags at-risk relationships, and helps write client communications. The AI removes repetitive work so your team focuses on the judgment that actually requires a human.",
        answerParagraphs: [
            "AI-assisted CRM means the system actively helps you work — not just stores data. HelixFlow's AI layer drafts proposals from your intake data, summarises contact history before a call, suggests follow-up timing, and helps write client communications.",
            "The distinction matters: most CRMs are passive record systems. HelixFlow uses AI to flag at-risk relationships, surface next-best actions, and remove the repetitive coordination work so your team can focus on the judgment that actually requires a human.",
        ],
    },
    {
        id: "proposals-and-onboarding",
        question: "Can HelixFlow help with proposals and onboarding?",
        answer:
            "Yes. HelixFlow generates AI-drafted proposals from your scoped intake data and sends them for e-signature directly from the platform. When a proposal is signed, an onboarding sequence fires automatically — provisioning access, sending the client welcome message, creating the kickoff task, and delivering the intake form — without any manual steps from your team.",
        answerParagraphs: [
            "Yes. HelixFlow generates AI-drafted proposals from your scoped intake data and sends them for e-signature directly from the platform — typically reducing proposal creation time from several hours to under five minutes.",
            "When a proposal is signed, an onboarding sequence fires automatically: access provisioning, client welcome message, kickoff calendar link, and intake form delivery all happen without any manual steps from your team.",
        ],
    },
    {
        id: "crm-or-project-management",
        question: "Is HelixFlow a CRM or a project management tool?",
        answer:
            "HelixFlow is a CRM that covers the full client lifecycle, including the delivery phase. It is not a substitute for deep project management tools like Linear or Notion, but it handles the coordination layer between business development and delivery: proposal approval, onboarding handoff, milestone tracking, and client-facing communication. Think of it as the connective tissue between winning work and delivering it.",
        answerParagraphs: [
            "HelixFlow is a CRM that extends into the delivery and retention phases — it is not a deep project management tool. If your team relies on Linear, Notion, or Asana for sprint planning and task management, HelixFlow complements rather than replaces them.",
            "What HelixFlow owns is the layer between business development and delivery: proposal approval, onboarding handoff, milestone communication, and client-facing updates. It's the connective tissue that closes the gap between winning work and delivering it.",
        ],
    },
    {
        id: "growth-and-retention",
        question: "How does HelixFlow support growth?",
        answer:
            "HelixFlow supports growth by making retention and expansion systematic rather than reactive. After project delivery, automated check-in sequences, upsell opportunity flagging, and referral nudges keep your existing client relationships compounding without relying on someone remembering to follow up. Growth through retained clients is typically more valuable and lower-cost than acquiring new ones — HelixFlow makes that loop automatic.",
        answerParagraphs: [
            "HelixFlow supports growth by making client retention and expansion systematic rather than reactive. After project delivery, automated check-in sequences, upsell opportunity flagging, and referral nudges keep your existing relationships compounding — without relying on someone's memory or calendar.",
            "Growth through retained clients is typically more valuable and lower-cost than new client acquisition. HelixFlow closes the loop between delivery and the next engagement so that every completed project becomes the foundation for the next one.",
        ],
    },
];

const SECTION_COPY = {
    eyebrow: "FAQ",
    headline: "Common questions.",
    sub: "Straight answers about what HelixFlow is, who it's for, and what it does.",
} as const;

// ── JSON-LD FAQ schema ─────────────────────────────────────────────────────────

/**
 * Generates a FAQPage JSON-LD object from the FAQ array.
 * This is a pure function — safe to call at module level or in a server component.
 * Google uses this for FAQ rich results; LLM crawlers use it for structured Q&A.
 */
function buildFAQSchema(items: FAQItem[]): string {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
            },
        })),
    };
    return JSON.stringify(schema);
}

// ── Sub-components ─────────────────────────────────────────────────────────────

/**
 * Single FAQ accordion item.
 * Question: rendered as <h3> inside the trigger for correct heading hierarchy.
 * Answer: multi-paragraph if `answerParagraphs` is provided, single-p fallback.
 */
function FAQAccordionItem({ item, index }: { item: FAQItem; index: number }) {
    return (
        <AnimateIn variants={fadeUp} delay={index * 0.06} threshold={0.05}>
            <AccordionItem
                value={item.id}
                className={cn(
                    "overflow-hidden rounded-xl",
                    "border border-white/[0.07]",
                    "bg-[rgba(15,33,69,0.40)] backdrop-blur-xl",
                    // Remove the default border-b from shadcn — we're using card borders
                    "[&:not(:last-child)]:mb-2.5",
                    "data-[state=open]:border-white/[0.12] data-[state=open]:bg-[rgba(15,33,69,0.60)]",
                    "transition-colors duration-200"
                )}
            >
                <AccordionTrigger
                    className={cn(
                        // Override shadcn defaults
                        "px-5 py-4 text-left no-underline hover:no-underline",
                        "text-[15px] font-medium leading-snug text-hx-chrome",
                        "transition-colors duration-200",
                        "data-[state=open]:text-[#F7FBFF]",
                        // Chevron color override
                        "[&>svg]:text-hx-dim [&[data-state=open]>svg]:text-[#2DBBEE]",
                        // Kill the underline hover from shadcn base
                        "hover:text-[#F7FBFF]",
                        // Focus ring tuned to design system
                        "focus-visible:ring-[#2DBBEE]/40 focus-visible:ring-offset-0"
                    )}
                >
                    {/*
           * The question is an <h3> for heading hierarchy correctness.
           * Screen readers and crawlers both see this as a heading.
           * Radix wraps it in an <h3> via AccordionHeader, so we use
           * a styled span here to avoid a nested heading.
           */}
                    <span className="flex-1 pr-2">{item.question}</span>
                </AccordionTrigger>

                <AccordionContent
                    className={cn(
                        "px-5 pb-5 pt-0",
                        // Override shadcn text-sm default
                        "text-[13px] leading-relaxed text-hx-slate sm:text-sm"
                    )}
                >
                    {item.answerParagraphs ? (
                        <div className="space-y-3">
                            {item.answerParagraphs.map((para, i) => (
                                <p key={i} className={i === 0 ? "text-hx-chrome" : "text-hx-slate"}>
                                    {para}
                                </p>
                            ))}
                        </div>
                    ) : (
                        <p>{item.answer}</p>
                    )}
                </AccordionContent>
            </AccordionItem>
        </AnimateIn>
    );
}

// ── Section export ─────────────────────────────────────────────────────────────

export default function FAQ() {
    // Stable ID for aria-labelledby
    const headingId = useId();
    // Build schema once — stable reference, doesn't need memo
    const schemaJson = buildFAQSchema(FAQS);

    return (
        <section
            id="faq"
            aria-labelledby={headingId}
            className="relative bg-[#060D1A] py-20 sm:py-24 lg:py-28"
        >
            {/*
       * JSON-LD FAQ schema
       * ──────────────────
       * Injected inline. Next.js App Router renders <script> tags in RSC
       * and client components — Google indexes them correctly.
       * For RSC usage: move <script> to a parent server component and
       * pass schemaJson as a prop for slightly cleaner hydration.
       */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaJson }}
            />

            {/* ── Ambient backdrop ────────────────────────────────────────── */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute left-1/2 top-0 h-[440px] w-[600px] -translate-x-1/2 rounded-full bg-[#1466B8]/[0.04] blur-[120px]" />
            </div>

            <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

                {/* ── Section heading ──────────────────────────────────────── */}
                <div className="mb-10 text-center lg:mb-12">
                    <AnimateIn variants={fadeUp} threshold={0.2}>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 backdrop-blur-sm">
                            {/* Question-mark icon */}
                            <svg
                                className="h-3 w-3 text-hx-slate"
                                viewBox="0 0 12 12"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M4.5 4.5a1.5 1.5 0 0 1 3 0c0 1-1.5 1.25-1.5 2.5M6 9h.005"
                                    stroke="currentColor"
                                    strokeWidth="1.15"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="text-xs font-medium tracking-wide text-hx-chrome">
                                {SECTION_COPY.eyebrow}
                            </span>
                        </div>
                    </AnimateIn>

                    <AnimateIn variants={fadeUpSlow} delay={0.07} threshold={0.2}>
                        <h2
                            id={headingId}
                            className="text-3xl font-semibold tracking-tight text-[#F7FBFF] sm:text-4xl"
                        >
                            {SECTION_COPY.headline}
                        </h2>
                    </AnimateIn>

                    <AnimateIn variants={fadeUp} delay={0.15} threshold={0.2}>
                        <p className="mt-3 text-base leading-relaxed text-hx-slate">
                            {SECTION_COPY.sub}
                        </p>
                    </AnimateIn>
                </div>

                {/* ── Accordion ────────────────────────────────────────────── */}
                {/*
         * type="single" collapsible — only one answer open at a time.
         * Opens the first item by default to signal interactivity.
         */}
                <Accordion
                    type="single"
                    collapsible
                    defaultValue={FAQS[0].id}
                    className="w-full"
                >
                    {FAQS.map((item, index) => (
                        <FAQAccordionItem key={item.id} item={item} index={index} />
                    ))}
                </Accordion>

                {/* ── Still have questions nudge ────────────────────────────── */}
                <AnimateIn variants={fadeUp} delay={0.1} threshold={0.1}>
                    <div className="mt-8 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:gap-4">
                        <p className="text-sm text-hx-slate">Still have questions?</p>
                        <a
                            href="mailto:hello@helixflow.cloud"
                            className={cn(
                                "inline-flex items-center gap-1.5 rounded-full",
                                "border border-white/10 bg-white/[0.04] px-4 py-1.5",
                                "text-sm font-medium text-hx-chrome backdrop-blur-sm",
                                "transition-all duration-200",
                                "hover:border-white/20 hover:bg-white/[0.07] hover:text-[#F7FBFF]",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/50"
                            )}
                        >
                            Get in touch
                            <svg
                                className="h-3.5 w-3.5"
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
