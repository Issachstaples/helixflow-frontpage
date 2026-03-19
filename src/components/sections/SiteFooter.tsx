/**
 * SiteFooter
 * ─────────────────────────────────────────────────────────────
 * Static server component — no animations, no client JS.
 *
 * Layout (3-column on md+, stacked on mobile):
 *   Left   — LogoMark + "HelixFlow" wordmark + tagline + Newport attribution
 *   Center — Anchor nav links (same set as Navbar)
 *   Right  — External links + copyright
 *
 * Background: #060D1A (matches void background of every section)
 * Top border: border-t border-white/[0.06] (matches Navbar bottom border)
 */

import LogoMark from "@/components/primitives/LogoMark";

const NAV_LINKS = [
    { label: "How it works", href: "#lifecycle" },
    { label: "Modules", href: "#modules" },
    { label: "See it in action", href: "#storyboard" },
    { label: "Who it's for", href: "#audience-fit" },
    { label: "Insights", href: "#insights" },
    { label: "FAQ", href: "#faq" },
    { label: "Roadmap", href: "#roadmap-status" },
    { label: "Get started", href: "#cta" },
] as const;

const EXTERNAL_LINKS = [
    { label: "Launch App", href: "https://app.helixflow.cloud" },
    { label: "Newport E-commerce", href: "https://newportecom.com" },
] as const;

export default function SiteFooter() {
    return (
        <footer
            className={[
                "bg-[#060D1A]",
                "border-t border-white/[0.06]",
            ].join(" ")}
            role="contentinfo"
        >
            <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
                {/* Top row — 3 columns */}
                <div className="grid gap-10 md:grid-cols-[1fr_auto_1fr]">

                    {/* ── Left: brand block ───────────────────────────── */}
                    <div className="flex flex-col gap-4">
                        <a
                            href="#hero"
                            className="flex items-center gap-3 w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/60 rounded-lg"
                            aria-label="HelixFlow — back to top"
                        >
                            <LogoMark size="sm" />
                            <span className="text-sm font-semibold text-[#F7FBFF] tracking-tight">
                                HelixFlow
                            </span>
                        </a>

                        <p className="text-sm text-hx-slate leading-relaxed max-w-[260px]">
                            AI-assisted CRM for agencies. Leads to delivery — then
                            growth on autopilot.
                        </p>

                        <a
                            href="https://newportecom.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-hx-dim hover:text-hx-slate transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/60 rounded w-fit"
                        >
                            A product of Newport E-commerce →
                        </a>
                    </div>

                    {/* ── Center: page navigation ─────────────────────── */}
                    <nav aria-label="Footer navigation">
                        <p className="text-[11px] uppercase tracking-widest text-hx-dim font-semibold mb-4">
                            Navigation
                        </p>
                        <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-hx-slate hover:text-[#F7FBFF] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/60 rounded"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* ── Right: external links ───────────────────────── */}
                    <div className="md:text-right">
                        <p className="text-[11px] uppercase tracking-widest text-hx-dim font-semibold mb-4">
                            Links
                        </p>
                        <ul className="flex flex-col gap-2.5 list-none p-0 m-0 md:items-end">
                            {EXTERNAL_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-hx-slate hover:text-[#2DBBEE] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/60 rounded"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom rule + copyright */}
                <div className="mt-10 border-t border-white/[0.06] pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-hx-dim">
                        © {new Date().getFullYear()} HelixFlow · A product of Newport E-commerce
                    </p>
                    <p className="text-xs text-hx-dim">
                        All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
