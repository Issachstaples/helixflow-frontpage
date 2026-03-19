"use client";

/**
 * Navbar
 * ─────────────────────────────────────────────────────────────
 * Sticky glass navigation bar.
 *
 * Layout:
 *   Left  — LogoMark + "HelixFlow" wordmark + "by Newport E-commerce" sub-label
 *   Center — desktop anchor links (hidden on mobile)
 *   Right  — "Launch App" CTA button + mobile Sheet trigger
 *
 * Mobile: hamburger opens a Sheet drawer from the left with all links + CTA.
 * Desktop (md+): inline nav links + "Launch App" button.
 *
 * Uses shadcn Sheet, Button. No Framer Motion — native CSS backdrop-blur only.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import LogoMark from "@/components/primitives/LogoMark";

const NAV_LINKS = [
    { label: "How it works", href: "#lifecycle" },
    { label: "Modules", href: "#modules" },
    { label: "See it in action", href: "#storyboard" },
    { label: "Who it's for", href: "#audience-fit" },
    { label: "FAQ", href: "#faq" },
    { label: "Roadmap", href: "#roadmap-status" },
] as const;

const LAUNCH_APP_URL = "https://app.helixflow.cloud";

// ─── Hamburger icon ──────────────────────────────────────────────────────────
function HamburgerIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M4 7h16M4 12h10M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

// ─── Brand cluster ────────────────────────────────────────────────────────────
function Brand() {
    return (
        <a
            href="#hero"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/60 rounded-lg"
            aria-label="HelixFlow — go to top"
        >
            <LogoMark size="sm" />
            <div className="leading-tight select-none">
                <p className="text-sm font-semibold text-[#F7FBFF] tracking-tight group-hover:text-[#2DBBEE] transition-colors duration-200">
                    HelixFlow
                </p>
                <p className="text-[10px] font-normal text-hx-slate">
                    by Newport E-commerce
                </p>
            </div>
        </a>
    );
}

// ─── Desktop nav links ────────────────────────────────────────────────────────
function DesktopLinks() {
    return (
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
                <a
                    key={link.href}
                    href={link.href}
                    className="px-3 py-1.5 text-sm text-hx-slate hover:text-[#F7FBFF] transition-colors duration-150 rounded-md hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/60"
                >
                    {link.label}
                </a>
            ))}
        </nav>
    );
}

// ─── Mobile sheet drawer ──────────────────────────────────────────────────────
function MobileMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open navigation menu"
                    className="md:hidden text-hx-slate hover:text-[#F7FBFF] hover:bg-white/[0.05]"
                >
                    <HamburgerIcon />
                </Button>
            </SheetTrigger>

            <SheetContent
                side="left"
                className="w-[300px] bg-[rgba(6,13,26,0.97)] backdrop-blur-xl border-r border-white/[0.06] flex flex-col"
            >
                <SheetHeader className="border-b border-white/[0.06] pb-4">
                    <SheetTitle asChild>
                        <Brand />
                    </SheetTitle>
                </SheetHeader>

                <nav
                    aria-label="Mobile navigation"
                    className="flex flex-col gap-1 mt-4 flex-1"
                >
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => onOpenChange(false)}
                            className="px-3 py-2.5 text-sm text-hx-slate hover:text-[#F7FBFF] rounded-lg hover:bg-white/[0.05] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DBBEE]/60"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="border-t border-white/[0.06] pt-4 mt-4">
                    <Button
                        asChild
                        className="w-full bg-[#2DBBEE] hover:bg-[#1FA8D8] text-[#060D1A] font-semibold rounded-xl"
                    >
                        <a
                            href={LAUNCH_APP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Launch App
                        </a>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}

// ─── Navbar (exported) ────────────────────────────────────────────────────────
export default function Navbar() {
    const [sheetOpen, setSheetOpen] = useState(false);

    return (
        <>
            {/* Skip to content — first focusable element on page */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#2DBBEE] focus:text-[#060D1A] focus:rounded-lg focus:text-sm focus:font-semibold"
            >
                Skip to content
            </a>

            <header
                className={[
                    "sticky top-0 z-50",
                    "bg-[rgba(6,13,26,0.80)] backdrop-blur-xl",
                    "border-b border-white/[0.06]",
                    "shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]",
                ].join(" ")}
                role="banner"
            >
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
                    {/* Left — brand */}
                    <Brand />

                    {/* Center — desktop links */}
                    <DesktopLinks />

                    {/* Right — CTA + mobile hamburger */}
                    <div className="flex items-center gap-2">
                        <Button
                            asChild
                            className="hidden md:inline-flex bg-[#2DBBEE] hover:bg-[#1FA8D8] text-[#060D1A] font-semibold rounded-xl h-9 px-4 text-sm"
                        >
                            <a
                                href={LAUNCH_APP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Launch App
                            </a>
                        </Button>

                        <MobileMenu open={sheetOpen} onOpenChange={setSheetOpen} />
                    </div>
                </div>
            </header>
        </>
    );
}
