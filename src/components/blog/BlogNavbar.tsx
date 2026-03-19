/**
 * BlogNavbar
 * ─────────────────────────────────────────────────────────────
 * Minimal sticky top bar used on /blog and /blog/[slug] pages.
 *
 * Left  — HelixFlow logo → links back to helixflow.cloud homepage
 * Right — "Back to articles" link on post pages / "Get started" CTA
 *
 * Server component — no interactivity needed.
 */

import LogoMark from "@/components/primitives/LogoMark";

interface BlogNavbarProps {
    /** Show a "← All articles" back link — true on individual post pages */
    showBack?: boolean;
}

export default function BlogNavbar({ showBack = false }: BlogNavbarProps) {
    return (
        <header
            className={[
                "sticky top-0 z-50",
                "bg-[#060D1A]/90 backdrop-blur-xl",
                "border-b border-white/[0.06]",
                "shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]",
            ].join(" ")}
        >
            <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3.5 sm:px-6">
                {/* Brand */}
                <a
                    href="/"
                    className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/60"
                    aria-label="HelixFlow — go to homepage"
                >
                    <LogoMark size="sm" />
                    <span className="text-sm font-semibold tracking-tight text-[#F7FBFF]">
                        HelixFlow
                    </span>
                </a>

                {/* Right side */}
                <nav aria-label="Blog navigation" className="flex items-center gap-4">
                    {showBack && (
                        <a
                            href="/blog"
                            className="flex items-center gap-1.5 text-sm text-hx-slate transition-colors duration-150 hover:text-[#F7FBFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/60 rounded"
                        >
                            <svg
                                className="h-3.5 w-3.5"
                                viewBox="0 0 14 14"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M11.5 7h-9M5 3.5L1.5 7 5 10.5"
                                    stroke="currentColor"
                                    strokeWidth="1.25"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            All articles
                        </a>
                    )}
                    <a
                        href="/#cta"
                        className={[
                            "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5",
                            "border border-[#2DBBEE]/30 bg-[#2DBBEE]/10",
                            "text-sm font-medium text-[#2DBBEE]",
                            "transition-all duration-200 hover:border-[#2DBBEE]/50 hover:bg-[#2DBBEE]/15",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/60",
                        ].join(" ")}
                    >
                        Get started
                    </a>
                </nav>
            </div>
        </header>
    );
}
