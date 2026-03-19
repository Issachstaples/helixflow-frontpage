/**
 * /blog — Blog index page
 * ─────────────────────────────────────────────────────────────
 * Lists all articles from the local data source.
 * Server component — no client JS needed.
 *
 * CMS migration path:
 *   Replace `ARTICLES` import with a fetch() call. Article type
 *   is the same; this page renders whatever the data layer returns.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES, formatDate } from "@/lib/blog/articles";
import BlogNavbar from "@/components/blog/BlogNavbar";
import BlogIndexCard from "@/components/blog/BlogIndexCard";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Insights — HelixFlow Blog",
    description:
        "Practical writing on CRM, workflow design, and AI for agencies and service businesses. From the HelixFlow team.",
    openGraph: {
        title: "Insights — HelixFlow Blog",
        description:
            "Practical writing on CRM, workflow design, and AI for agencies and service businesses.",
        type: "website",
        url: "https://helixflow.cloud/blog",
        siteName: "HelixFlow",
    },
    twitter: {
        card: "summary_large_image",
        title: "Insights — HelixFlow Blog",
        description:
            "Practical writing on CRM, workflow design, and AI for agencies and service businesses.",
    },
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function BlogIndexPage() {
    const [featured, ...rest] = ARTICLES;

    return (
        <div className="min-h-screen bg-[#060D1A]">
            {/* Ambient backdrop */}
            <div className="pointer-events-none fixed inset-0" aria-hidden="true">
                <div className="absolute right-0 top-0 h-[480px] w-[500px] rounded-full bg-[#818cf8]/[0.03] blur-[110px]" />
                <div className="absolute bottom-1/3 left-0 h-[400px] w-[450px] rounded-full bg-[#2DBBEE]/[0.03] blur-[100px]" />
            </div>

            <BlogNavbar />

            <main id="main-content" className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">

                {/* ── Page heading ─────────────────────────────────────────────────── */}
                <header className="mb-12 lg:mb-16">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 backdrop-blur-sm">
                        <svg className="h-3 w-3 text-hx-slate" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <path d="M2 10L5 7M7.5 1.5l3 3-6 6H1.5v-3l6-6Z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-xs font-medium tracking-wide text-hx-chrome">Insights</span>
                    </div>
                    <h1 className="text-balance text-4xl font-semibold tracking-tight text-[#F7FBFF] sm:text-5xl">
                        Learn the system behind the software.
                    </h1>
                    <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-hx-slate sm:text-lg">
                        Practical writing on CRM, workflow design, and AI for agencies and
                        service businesses.
                    </p>
                </header>

                {/* ── Featured article ─────────────────────────────────────────────── */}
                <section aria-label="Featured article" className="mb-10">
                    <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-hx-dim">
                        Featured
                    </p>
                    <Link
                        href={`/blog/${featured.slug}`}
                        className={cn(
                            "group relative flex flex-col gap-5 overflow-hidden rounded-2xl p-6 sm:flex-row sm:items-start sm:gap-8 sm:p-8",
                            "border border-white/[0.07] border-t-white/[0.14]",
                            "bg-[rgba(15,33,69,0.55)] backdrop-blur-xl",
                            "shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_20px_64px_rgba(2,6,23,0.55)]",
                            "transition-shadow duration-300 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_28px_72px_rgba(2,6,23,0.65)]",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/50"
                        )}
                    >
                        {/* Hover glow */}
                        <div
                            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                            style={{ background: `radial-gradient(ellipse at 10% 0%, ${featured.accent}0e, transparent 55%)` }}
                            aria-hidden="true"
                        />
                        {/* Top accent line */}
                        <div
                            className="pointer-events-none absolute inset-x-0 top-0 h-px"
                            style={{ background: `linear-gradient(90deg, ${featured.accent}60, ${featured.accent}20, transparent)` }}
                            aria-hidden="true"
                        />
                        {/* Left stripe — desktop */}
                        <div
                            className="hidden flex-shrink-0 sm:block sm:w-1 sm:self-stretch sm:rounded-full"
                            style={{ background: `linear-gradient(to bottom, ${featured.accent}80, ${featured.accent}10)` }}
                            aria-hidden="true"
                        />

                        <div className="relative min-w-0 flex-1">
                            <div className="mb-3 flex flex-wrap items-center gap-2.5">
                                <span
                                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                                    style={{
                                        background: `${featured.accent}14`,
                                        border: `1px solid ${featured.accent}28`,
                                        color: featured.accent,
                                    }}
                                >
                                    {featured.tag}
                                </span>
                                <span className="flex items-center gap-1 text-[11px] text-hx-dim">
                                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.1" />
                                        <path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {featured.readTime}
                                </span>
                                <time dateTime={featured.publishedAt} className="text-[11px] text-hx-dim">
                                    {formatDate(featured.publishedAt)}
                                </time>
                            </div>

                            <h2 className="text-balance text-xl font-semibold leading-snug tracking-tight text-[#F7FBFF] transition-colors duration-200 group-hover:text-white sm:text-2xl">
                                {featured.title}
                            </h2>
                            <p className="mt-3 max-w-prose text-base leading-relaxed text-hx-slate">
                                {featured.excerpt}
                            </p>
                            <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200" style={{ color: featured.accent }}>
                                Read article
                                <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                    <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </section>

                {/* ── Article grid ─────────────────────────────────────────────────── */}
                <section aria-label="All articles">
                    <p className="mb-6 text-[11px] font-semibold uppercase tracking-widest text-hx-dim">
                        More articles
                    </p>
                    <ul role="list" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {rest.map((article) => (
                            <li key={article.slug}>
                                <BlogIndexCard article={article} />
                            </li>
                        ))}
                    </ul>
                </section>

                {/* ── Back to site ─────────────────────────────────────────────────── */}
                <div className="mt-16 flex justify-center">
                    <Link
                        href="/"
                        className={cn(
                            "inline-flex items-center gap-2 rounded-full px-6 py-2.5",
                            "border border-white/[0.10] bg-white/[0.04]",
                            "text-sm font-medium text-hx-chrome backdrop-blur-sm",
                            "transition-all duration-200 hover:border-white/[0.18] hover:bg-white/[0.07] hover:text-[#F7FBFF]",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/50"
                        )}
                    >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                            <path d="M11.5 7h-9M5 3.5L1.5 7 5 10.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back to HelixFlow
                    </Link>
                </div>
            </main>
        </div>
    );
}
