/**
 * SectionWrapper
 * ─────────────────────────────────────────────────────────────
 * Shared layout shell for every top-level homepage section.
 *
 * Enforces:
 *   - Consistent vertical rhythm  (py-20 → sm:py-24 → lg:py-28)
 *   - Consistent horizontal gutter (px-4 → sm:px-6 → lg:px-8)
 *   - Max content width and centering
 *   - `relative` positioning for the child radial/glow overlays
 *   - Page background (#060D1A) on the outer shell
 *
 * Width variants:
 *   wide    — max-w-6xl (72rem) — most sections
 *   narrow  — max-w-3xl (48rem) — FAQ, CTA, RoadmapStatus
 *   full    — max-w-none         — Hero or full-bleed layouts
 *
 * Usage:
 *   <SectionWrapper id="lifecycle" aria-labelledby="lifecycle-heading">
 *     …
 *   </SectionWrapper>
 *
 *   <SectionWrapper id="faq" width="narrow">
 *     …
 *   </SectionWrapper>
 *
 * Notes:
 *   - The outer <section> background is bg-[#060D1A] by default.
 *   - Pass `outerClassName` to add decoration (radial glows, border-t, etc.)
 *     that lives on the outer shell rather than the inner container.
 *   - `innerClassName` controls the inner max-w container.
 */

import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Width = "wide" | "narrow" | "full";

const widthMap: Record<Width, string> = {
    wide: "max-w-6xl",
    narrow: "max-w-3xl",
    full: "max-w-none",
};

type SectionWrapperProps = {
    /** Section anchor id — also drives aria-labelledby if needed */
    id?: string;
    /** Controls max-width of the inner container. Default: "wide" */
    width?: Width;
    /** Extra classes on the outer <section> element (e.g. radial glow overlays) */
    outerClassName?: string;
    /** Extra classes on the inner container div */
    innerClassName?: string;
    children: React.ReactNode;
} & Omit<
    ComponentPropsWithoutRef<"section">,
    "id" | "className" | "children"
>;

// ── Component ─────────────────────────────────────────────────────────────────

export default function SectionWrapper({
    id,
    width = "wide",
    outerClassName,
    innerClassName,
    children,
    ...rest
}: SectionWrapperProps) {
    return (
        <section
            id={id}
            className={cn(
                "relative bg-[#060D1A] py-20 sm:py-24 lg:py-28",
                outerClassName
            )}
            {...rest}
        >
            <div
                className={cn(
                    "relative mx-auto px-4 sm:px-6 lg:px-8",
                    widthMap[width],
                    innerClassName
                )}
            >
                {children}
            </div>
        </section>
    );
}
