/**
 * BlogIndexCard
 * ─────────────────────────────────────────────────────────────
 * Card component for the /blog index grid. Renders a single
 * Article as a clickable card with hover animations.
 *
 * Usage:
 *   import BlogIndexCard from "@/components/blog/BlogIndexCard";
 *   <BlogIndexCard article={article} />
 */

import Link from "next/link";
import type { Article } from "@/lib/blog/articles";
import { formatDate } from "@/lib/blog/articles";
import { cn } from "@/lib/utils";

// ── Tag pill ───────────────────────────────────────────────────────────────────

function TagPill({ label, accent }: { label: string; accent: string }) {
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

// ── Component ─────────────────────────────────────────────────────────────────

interface BlogIndexCardProps {
    article: Article;
}

export default function BlogIndexCard({ article }: BlogIndexCardProps) {
    return (
        <article aria-label={article.title}>
            <Link
                href={`/blog/${article.slug}`}
                className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-2xl p-6",
                    "border border-white/[0.07] border-t-white/[0.12]",
                    "bg-[rgba(15,33,69,0.45)] backdrop-blur-xl",
                    "shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_12px_40px_rgba(2,6,23,0.45)]",
                    "transition-all duration-300",
                    "hover:border-white/[0.12] hover:border-t-white/[0.20]",
                    "hover:shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_20px_60px_rgba(2,6,23,0.60)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/50"
                )}
            >
                {/* Hover glow */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                        background: `radial-gradient(ellipse at 50% 0%, ${article.accent}0c, transparent 60%)`,
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

                <div className="relative flex h-full flex-col">
                    {/* Meta row */}
                    <div className="mb-4 flex flex-wrap items-center gap-2.5">
                        <TagPill label={article.tag} accent={article.accent} />
                        <span className="flex items-center gap-1 text-[11px] text-hx-dim">
                            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.1" />
                                <path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {article.readTime}
                        </span>
                        <span className="text-[11px] text-hx-dim" aria-hidden="true">·</span>
                        <time dateTime={article.publishedAt} className="text-[11px] text-hx-dim">
                            {formatDate(article.publishedAt)}
                        </time>
                    </div>

                    {/* Title */}
                    <h2 className="mb-3 text-balance text-[16px] font-semibold leading-snug tracking-tight text-[#F7FBFF] transition-colors duration-200 group-hover:text-white sm:text-[17px]">
                        {article.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="flex-1 text-[13px] leading-relaxed text-hx-slate">
                        {article.excerpt}
                    </p>

                    {/* Read CTA */}
                    <div
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium opacity-0 transition-all duration-200 group-hover:opacity-100"
                        style={{ color: article.accent }}
                    >
                        Read article
                        <svg
                            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
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
                    </div>
                </div>
            </Link>
        </article>
    );
}
