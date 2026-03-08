/**
 * LogoMark
 * ─────────────────────────────────────────────────────────────
 * The HelixFlow helix logo mark — used in Navbar and Footer.
 *
 * Renders a square rounded container with the double-helix SVG.
 * Dark-mode variant is baked in via the design token background.
 * aria-hidden by default — always paired with a visible text label.
 */

import { cn } from "@/lib/utils";

interface LogoMarkProps {
    className?: string;
    /** Size variant — controls the container and SVG dimensions */
    size?: "sm" | "md";
}

export default function LogoMark({ className = "", size = "md" }: LogoMarkProps) {
    const containerSize = size === "sm" ? "h-7 w-7" : "h-9 w-9";
    const svgSize = size === "sm" ? 14 : 18;

    return (
        <div
            className={cn(
                "relative grid flex-shrink-0 place-items-center overflow-hidden rounded-xl",
                "border border-white/[0.10]",
                "bg-[rgba(15,33,69,0.70)] backdrop-blur-sm",
                "shadow-[0_1px_0_0_rgba(255,255,255,0.07)_inset]",
                containerSize,
                className
            )}
            aria-hidden="true"
        >
            {/* Gradient wash behind the mark */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at 40% 30%, rgba(45,187,238,0.15), transparent 65%)",
                }}
            />

            <svg
                width={svgSize}
                height={svgSize}
                viewBox="0 0 24 24"
                fill="none"
                className="relative"
                aria-hidden="true"
            >
                {/* Helix strand A */}
                <path
                    d="M7.2 7.4c2.6-2.2 6.9-2.2 9.6 0 2.2 1.8 1.2 4.3-1.2 5.8-1.1.7-2.4 1.3-3.8 2-1.6.8-3.1 1.6-4.1 2.6-2.2 2.1-.6 4.8 2.3 5.3 2 .4 4.2-.2 5.8-1.5"
                    stroke="#2DBBEE"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                />
                {/* Helix strand B */}
                <path
                    d="M16.8 16.6c-2.6 2.2-6.9 2.2-9.6 0-2.2-1.8-1.2-4.3 1.2-5.8 1.1-.7 2.4-1.3 3.8-2 1.6-.8 3.1-1.6 4.1-2.6 2.2-2.1.6-4.8-2.3-5.3-2-.4-4.2.2-5.8 1.5"
                    stroke="#1466B8"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    opacity="0.85"
                />
            </svg>
        </div>
    );
}
