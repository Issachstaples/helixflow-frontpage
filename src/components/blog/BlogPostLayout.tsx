/**
 * BlogPostLayout
 * ─────────────────────────────────────────────────────────────
 * Reusable blog post template. Renders a full Article from the
 * local data source. Server component — no client JS.
 *
 * Structure:
 *   1. Article header — tag pill, title, meta (date + read time)
 *   2. Excerpt / intro — visually prominent lead paragraph
 *   3. Body blocks — structured content rendering
 *   4. CTA footer — join waitlist / get started
 *
 * CMS migration path:
 *   This component receives an `Article` typed object. Swap the data
 *   source in the parent page — this component needs no changes.
 */

import type { Article, ContentBlock } from "@/lib/blog/articles";
import { formatDate } from "@/lib/blog/articles";
import { cn } from "@/lib/utils";

// ── Content block renderers ────────────────────────────────────────────────────

function BlockHeading({ text }: { text: string }) {
    return (
        <h2 className="mb-4 mt-10 text-xl font-semibold leading-snug tracking-tight text-[#F7FBFF] first:mt-0 sm:text-2xl">
            {text}
        </h2>
    );
}

function BlockParagraph({ text }: { text: string }) {
    return (
        <p className="mb-5 text-base leading-relaxed text-hx-slate last:mb-0 sm:text-[17px]">
            {text}
        </p>
    );
}

function BlockList({ items }: { items: string[] }) {
    return (
        <ul className="mb-5 space-y-2.5 pl-0">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                    <span
                        className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#2DBBEE]"
                        aria-hidden="true"
                    />
                    <span className="text-base leading-relaxed text-hx-slate sm:text-[17px]">
                        {item}
                    </span>
                </li>
            ))}
        </ul>
    );
}

function BlockCallout({ text, label }: { text: string; label?: string }) {
    return (
        <div
            className={cn(
                "my-8 rounded-xl px-5 py-5",
                "border border-[#2DBBEE]/20 border-l-[3px] border-l-[#2DBBEE]/70",
                "bg-[#2DBBEE]/[0.06]"
            )}
        >
            {label && (
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#2DBBEE]/80">
                    {label}
                </p>
            )}
            <p className="text-base leading-relaxed text-hx-chrome sm:text-[17px]">{text}</p>
        </div>
    );
}

function BlockQuote({ text }: { text: string }) {
    return (
        <blockquote
            className={cn(
                "my-8 rounded-xl px-6 py-5",
                "border border-white/[0.07]",
                "bg-[rgba(15,33,69,0.40)] backdrop-blur-xl"
            )}
        >
            <p className="text-lg italic leading-relaxed text-hx-chrome sm:text-xl">
                &ldquo;{text}&rdquo;
            </p>
        </blockquote>
    );
}

function renderBlock(block: ContentBlock, index: number) {
    switch (block.type) {
        case "heading":
            return <BlockHeading key={index} text={block.text!} />;
        case "paragraph":
            return <BlockParagraph key={index} text={block.text!} />;
        case "list":
            return <BlockList key={index} items={block.items!} />;
        case "callout":
            return <BlockCallout key={index} text={block.text!} label={block.label} />;
        case "quote":
            return <BlockQuote key={index} text={block.text!} />;
        default:
            return null;
    }
}

// ── Tag pill ───────────────────────────────────────────────────────────────────

function TagPill({ label, accent }: { label: string; accent: string }) {
    return (
        <span
            className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
            style={{
                background: `${accent}18`,
                border: `1px solid ${accent}30`,
                color: accent,
            }}
        >
            {label}
        </span>
    );
}

// ── CTA block ─────────────────────────────────────────────────────────────────

function ArticleCTA() {
    return (
        <aside
            className={cn(
                "mt-14 rounded-2xl px-7 py-8",
                "border border-[#2DBBEE]/20 border-t-[#2DBBEE]/40",
                "bg-[rgba(15,33,69,0.55)] backdrop-blur-xl",
                "shadow-[0_1px_0_0_rgba(45,187,238,0.08)_inset]"
            )}
            aria-label="Get started with HelixFlow"
        >
            {/* Top accent line */}
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl"
                style={{
                    background: "linear-gradient(90deg, transparent, rgba(45,187,238,0.4), transparent)",
                }}
                aria-hidden="true"
            />

            <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-hx-dim">
                HelixFlow
            </p>
            <h3 className="mb-2 text-xl font-semibold tracking-tight text-[#F7FBFF] sm:text-2xl">
                The CRM built for how agencies actually work.
            </h3>
            <p className="mb-6 max-w-lg text-base leading-relaxed text-hx-slate">
                AI-assisted proposals, automated onboarding, and retention built in.
                Join the waitlist and be first to access HelixFlow when it launches.
            </p>
            <a
                href="/#cta"
                className={cn(
                    "inline-flex items-center gap-2 rounded-full px-6 py-2.5",
                    "bg-[#2DBBEE] text-[#060D1A]",
                    "text-sm font-semibold",
                    "transition-all duration-200 hover:bg-[#4ec9f5] hover:shadow-[0_0_24px_rgba(45,187,238,0.3)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060D1A]"
                )}
            >
                Join the waitlist
                <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M2.5 7h9M8 3.5L11.5 7 8 10.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </a>
        </aside>
    );
}

// ── Main layout export ─────────────────────────────────────────────────────────

export default function BlogPostLayout({ article }: { article: Article }) {
    return (
        <div className="min-h-screen bg-[#060D1A]">
            {/* Ambient background glow */}
            <div className="pointer-events-none fixed inset-0" aria-hidden="true">
                <div className="absolute left-1/2 top-0 h-[600px] w-[700px] -translate-x-1/2 rounded-full bg-[#1466B8]/[0.05] blur-[130px]" />
            </div>

            <main
                id="main-content"
                className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
            >
                <article aria-labelledby="article-title">
                    {/* ── Header ──────────────────────────────────────────────────────── */}
                    <header className="mb-10 border-b border-white/[0.06] pb-10">
                        {/* Tag + meta row */}
                        <div className="mb-5 flex flex-wrap items-center gap-3">
                            <TagPill label={article.tag} accent={article.accent} />
                            <span className="text-[11px] text-hx-dim" aria-hidden="true">·</span>
                            <span className="flex items-center gap-1.5 text-[12px] text-hx-dim">
                                {/* Clock icon */}
                                <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.1" />
                                    <path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {article.readTime}
                            </span>
                            <span className="text-[11px] text-hx-dim" aria-hidden="true">·</span>
                            <time
                                dateTime={article.publishedAt}
                                className="text-[12px] text-hx-dim"
                            >
                                {formatDate(article.publishedAt)}
                            </time>
                        </div>

                        {/* Title */}
                        <h1
                            id="article-title"
                            className="text-balance text-3xl font-semibold leading-tight tracking-tight text-[#F7FBFF] sm:text-4xl lg:text-[2.6rem]"
                        >
                            {article.title}
                        </h1>
                    </header>

                    {/* ── Excerpt / intro ──────────────────────────────────────────────── */}
                    <p className="mb-10 text-pretty text-lg leading-relaxed text-hx-chrome sm:text-xl">
                        {article.excerpt}
                    </p>

                    {/* ── Body ────────────────────────────────────────────────────────── */}
                    <div className="prose-none">
                        {article.body.map((block, i) => renderBlock(block, i))}
                    </div>

                    {/* ── Footer CTA ──────────────────────────────────────────────────── */}
                    <div className="relative">
                        <ArticleCTA />
                    </div>
                </article>
            </main>
        </div>
    );
}
