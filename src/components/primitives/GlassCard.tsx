/**
 * GlassCard
 * ─────────────────────────────────────────────────────────────
 * Shared glass-morphism surface used across all HelixFlow sections.
 *
 * Variants:
 *   default   — standard card (55% navy fill, xl blur)
 *   strong    — elevated panel (60–70% fill, heavier shadow — hero, CTA)
 *   subtle    — lighter inset (35–40% fill — nested cells, secondary cards)
 *
 * Usage:
 *   <GlassCard>…</GlassCard>
 *   <GlassCard variant="strong" className="rounded-2xl px-8 py-10">…</GlassCard>
 *   <GlassCard as="li" className="p-4">…</GlassCard>
 *
 * Notes:
 *   - Padding is intentionally NOT included — callers control spacing.
 *   - Border-radius is NOT included — callers control shape.
 *   - The `as` prop lets the card render any block element (div, li, article…)
 *     without wrapping in a meaningless extra div.
 */

import { cn } from "@/lib/utils";
import type { ElementType, ComponentPropsWithoutRef } from "react";

// ── Variant map ───────────────────────────────────────────────────────────────

const variants = {
    /** Standard section card — most common usage */
    default: [
        "bg-[rgba(15,33,69,0.55)] backdrop-blur-xl",
        "border border-white/[0.07] border-t-white/[0.13]",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_20px_60px_rgba(2,6,23,0.50)]",
    ].join(" "),

    /** Heavy panel — hero, CTA banner, feature spotlights */
    strong: [
        "bg-[rgba(15,33,69,0.65)] backdrop-blur-2xl",
        "border border-white/[0.08] border-t-white/[0.16]",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_32px_80px_rgba(2,6,23,0.65)]",
    ].join(" "),

    /** Light inset — nested cells, secondary badges, timeline steps */
    subtle: [
        "bg-[rgba(15,33,69,0.38)] backdrop-blur-md",
        "border border-white/[0.06] border-t-white/[0.10]",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_8px_24px_rgba(2,6,23,0.35)]",
    ].join(" "),
} as const;

export type GlassCardVariant = keyof typeof variants;

// ── Props ─────────────────────────────────────────────────────────────────────

type GlassCardOwnProps<E extends ElementType> = {
    /** Variant controls opacity, blur, and shadow weight. Default: "default" */
    variant?: GlassCardVariant;
    /** Render as any HTML block element. Default: "div" */
    as?: E;
    className?: string;
    children?: React.ReactNode;
};

type GlassCardProps<E extends ElementType> = GlassCardOwnProps<E> &
    Omit<ComponentPropsWithoutRef<E>, keyof GlassCardOwnProps<E>>;

// ── Component ─────────────────────────────────────────────────────────────────

export default function GlassCard<E extends ElementType = "div">({
    variant = "default",
    as,
    className,
    children,
    ...rest
}: GlassCardProps<E>) {
    const Tag = (as ?? "div") as ElementType;

    return (
        <Tag
            className={cn(
                "relative overflow-hidden",
                variants[variant],
                className
            )}
            {...rest}
        >
            {children}
        </Tag>
    );
}
