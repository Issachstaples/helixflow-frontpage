/**
 * HelixFlow Motion System
 * ─────────────────────────────────────────────────────────────
 * Single source of truth for all animation configuration.
 *
 * IMPORT RULES:
 *   - Every animated component imports variants from here — never inline.
 *   - `AnimateIn` is the only component that touches `motion.*` directly
 *     in most cases. Complex components (StickyStoryboard) may import
 *     `AnimatePresence` and `stepFade` directly.
 *
 * MOTION LAWS:
 *   1. Motion clarifies hierarchy — it never decorates.
 *   2. Nothing exceeds 600ms except ambient loops.
 *   3. Entrance only — elements do not re-animate on scroll-back.
 *   4. prefers-reduced-motion is first-class, not a fallback.
 *   5. One primary motion gesture per section.
 */

import type { Variants, Transition } from "framer-motion";

// ── Durations (seconds) ─────────────────────────────────────────────────────

export const duration = {
    fast: 0.18,    // micro-interactions, hover state changes
    base: 0.35,    // standard entrance, card reveal
    slow: 0.55,    // hero elements, large panel entrance
    ambient: 8.0,  // helix breathing loop — imperceptible as animation
} as const;

// ── Easings ──────────────────────────────────────────────────────────────────

export const ease = {
    /** Snappy deceleration — primary ease for entrances */
    out: [0.16, 1, 0.3, 1] as [number, number, number, number],
    /** Gentler arc — for large panels and slow elements */
    outSoft: [0.25, 1, 0.5, 1] as [number, number, number, number],
    /** Symmetric — for cross-fades and storyboard transitions */
    inOut: [0.45, 0, 0.55, 1] as [number, number, number, number],
} as const;

/** Spring config — card hover lifts only. Physical, weighted feel. */
export const springTransition: Transition = {
    type: "spring",
    stiffness: 260,
    damping: 28,
};

// ── Stagger timing (seconds) ─────────────────────────────────────────────────

export const stagger = {
    fast: 0.06,   // tight card grids (module grid)
    base: 0.10,   // standard section stagger
    slow: 0.16,   // lifecycle steps — deliberate, unhurried reveal
} as const;

// ── Variants ─────────────────────────────────────────────────────────────────

/**
 * Standard section content reveal.
 * Use for: most section content blocks, card grids, text blocks.
 */
export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: duration.base, ease: ease.out },
    },
};

/**
 * Large panel / hero element reveal.
 * Less vertical travel — appropriate for large visual anchors.
 * Use for: Hero text block, CTA banner, section-spanning panels.
 */
export const fadeUpSlow: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: duration.slow, ease: ease.outSoft },
    },
};

/**
 * Pure opacity fade — element does not move.
 * Use for: HelixCore panel, large background panels, right-side
 * mock UI in the storyboard (too large to slide).
 */
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: duration.base, ease: ease.out },
    },
};

/**
 * Container variant — staggers direct children automatically.
 * Pair with `fadeUp` or `fadeUpSlow` on each child.
 *
 * @param staggerChildren  Delay between each child (seconds). Default: stagger.base
 * @param delayChildren    Initial delay before first child (seconds). Default: 0
 *
 * @example
 * <AnimateIn variants={staggerContainer()}>
 *   {items.map(item => (
 *     <AnimateIn key={item.id} variants={fadeUp}>
 *       <Card />
 *     </AnimateIn>
 *   ))}
 * </AnimateIn>
 */
export const staggerContainer = (
    staggerChildren: number = stagger.base,
    delayChildren: number = 0
): Variants => ({
    hidden: {},
    visible: {
        transition: { staggerChildren, delayChildren },
    },
});

/**
 * Storyboard step cross-fade.
 * Enters from slightly below, exits upward.
 * Use with AnimatePresence mode="wait" in StickyStoryboard.
 */
export const stepFade: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: duration.base, ease: ease.inOut },
    },
    exit: {
        opacity: 0,
        y: -8,
        transition: { duration: duration.fast, ease: ease.inOut },
    },
};

/**
 * SVG path draw — lifecycle connector line.
 * Apply to an SVG `<motion.path>` element.
 * Desktop only — connector is hidden on mobile.
 */
export const lineDraw: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: ease.outSoft,
            delay: 0.4, // fires after all three lifecycle cards have landed
        },
    },
};

/**
 * Hero ambient breathing pulse — HelixCore SVG.
 * Very subtle scale variation over 8 seconds, repeating.
 * Imperceptible as "animation" but makes the page feel alive.
 * prefers-reduced-motion: AnimateIn skips this automatically.
 */
export const helixPulse: Variants = {
    rest: {
        scale: 1,
        opacity: 0.85,
    },
    live: {
        scale: [1, 1.015, 1],
        opacity: [0.85, 1, 0.85],
        transition: {
            duration: duration.ambient,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

/**
 * Card hover lift — used on GlassCard / floating-card hover states.
 * Use as `whileHover` on a `<motion.div>` wrapping the card.
 * The spring gives physical weight rather than a CSS ease.
 *
 * @example
 * <motion.div
 *   variants={cardLift}
 *   initial="rest"
 *   whileHover="hover"
 *   animate="rest"
 * >
 *   <GlassCard>…</GlassCard>
 * </motion.div>
 */
export const cardLift: Variants = {
    rest: {
        y: 0,
        boxShadow:
            "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 8px 32px rgba(2,6,23,0.35)",
        transition: springTransition,
    },
    hover: {
        y: -3,
        boxShadow:
            "0 1px 0 0 rgba(255,255,255,0.08) inset, 0 16px 48px rgba(2,6,23,0.55)",
        transition: springTransition,
    },
};

// ── Convenience re-exports ────────────────────────────────────────────────────
// Import from here rather than from framer-motion directly, so the
// abstraction boundary is clean and swappable.

export { AnimatePresence } from "framer-motion";
export type { Variants, Transition } from "framer-motion";

// ── staggerChild helper ───────────────────────────────────────────────────────
/**
 * Returns a `transition.delay` override for a child at index `i`.
 * Replaces the hand-rolled `delay: index * 0.07` pattern in section files.
 *
 * @param i       Zero-based child index
 * @param step    Seconds between each child. Default: stagger.fast (0.06s)
 * @param base    Additional base delay before the stagger begins. Default: 0
 *
 * @example — AnimateIn with per-card delay
 *   {items.map((item, i) => (
 *     <AnimateIn key={item.id} variants={fadeUp} delay={staggerChild(i)}>
 *       …
 *     </AnimateIn>
 *   ))}
 *
 * @example — tighter grid, starting after a 0.1s base offset
 *   <AnimateIn variants={fadeUp} delay={staggerChild(i, stagger.fast, 0.1)}>
 */
export function staggerChild(
    i: number,
    step: number = stagger.fast,
    base: number = 0
): number {
    return base + i * step;
}
