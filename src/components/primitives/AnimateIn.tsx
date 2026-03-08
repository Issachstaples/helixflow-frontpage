"use client";

/**
 * AnimateIn
 * ─────────────────────────────────────────────────────────────
 * The single scroll-triggered entrance wrapper for the entire site.
 *
 * USAGE:
 *   // Standard fade-up
 *   <AnimateIn>
 *     <ModuleCard />
 *   </AnimateIn>
 *
 *   // Custom variant + delay
 *   <AnimateIn variants={fadeUpSlow} delay={0.15}>
 *     <HeroPanel />
 *   </AnimateIn>
 *
 *   // Stagger container wrapping children
 *   <AnimateIn variants={staggerContainer(stagger.base)} as="ul">
 *     {items.map((item, i) => (
 *       <AnimateIn key={item.id} variants={fadeUp} as="li">
 *         <Card />
 *       </AnimateIn>
 *     ))}
 *   </AnimateIn>
 *
 * REDUCED MOTION:
 *   When `prefers-reduced-motion: reduce` is set, the component skips
 *   immediately to the visible state with zero duration and zero
 *   translation. No separate code path is needed in consuming components.
 *
 * PERFORMANCE:
 *   - `once: true` — IntersectionObserver is disconnected after first
 *     trigger. No ongoing observation overhead for past-viewport content.
 *   - No layout properties (height, width, margin) are animated — only
 *     opacity and transform, which are GPU-composited.
 */

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import type { Variants, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

// The set of HTML tags AnimateIn can render as.
// Extend if needed — keep the list explicit so TS stays strict.
type AllowedTag =
    | "div"
    | "section"
    | "article"
    | "li"
    | "ul"
    | "ol"
    | "header"
    | "footer"
    | "span"
    | "p";

interface AnimateInProps {
    /** Content to animate in */
    children: React.ReactNode;
    /**
     * Framer Motion variants object.
     * Must expose `hidden` and `visible` keys.
     * @default fadeUp (from lib/motion)
     */
    variants?: Variants;
    /**
     * Delay before the visible transition fires, in seconds.
     * Use for manual stagger when not using a staggerContainer variant.
     * @default 0
     */
    delay?: number;
    /**
     * IntersectionObserver threshold — fraction of element visible before
     * the animation triggers.
     * @default 0.15
     */
    threshold?: number;
    /**
     * Animate only once (on first viewport entry).
     * Elements do not re-animate on scroll-back.
     * @default true
     */
    once?: boolean;
    /** Extra className applied to the motion wrapper */
    className?: string;
    /**
     * HTML tag to render as.
     * @default "div"
     */
    as?: AllowedTag;
}

export default function AnimateIn({
    children,
    variants = fadeUp,
    delay = 0,
    threshold = 0.15,
    once = true,
    className,
    as = "div",
}: AnimateInProps) {
    const ref = useRef<HTMLElement>(null);
    const prefersReducedMotion = useReducedMotion();

    const isInView = useInView(ref, {
        once,
        amount: threshold,
    });

    // ── Reduced motion path ────────────────────────────────────────────────────
    // Skip animation entirely. The element renders at full opacity with no
    // translation — no duration, no delay, no visual movement whatsoever.
    if (prefersReducedMotion) {
        const Tag = as;
        return (
            <Tag
                // @ts-expect-error — generic HTML element ref typing
                ref={ref}
                className={className}
            >
                {children}
            </Tag>
        );
    }

    // ── Animated path ─────────────────────────────────────────────────────────
    // Build a derived variant that injects the delay into the visible
    // transition without mutating the shared variant object from lib/motion.
    const delayedVariants: Variants =
        delay > 0
            ? {
                ...variants,
                visible: {
                    ...(typeof variants.visible === "object" ? variants.visible : {}),
                    transition: {
                        ...(typeof variants.visible === "object" &&
                            "transition" in variants.visible &&
                            typeof variants.visible.transition === "object"
                            ? (variants.visible.transition as object)
                            : {}),
                        delay,
                    },
                },
            }
            : variants;

    // Dynamically pick the correct motion element by tag name.
    // motion[as] is typed via MotionComponents — cast needed because
    // `as` is a runtime string narrowed to AllowedTag.
    const MotionTag = motion[as] as React.ComponentType<
        HTMLMotionProps<typeof as> & { ref: React.Ref<HTMLElement> }
    >;

    return (
        <MotionTag
            ref={ref}
            variants={delayedVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={cn(className)}
        >
            {children}
        </MotionTag>
    );
}
