/**
 * opengraph-image.tsx
 * ─────────────────────────────────────────────────────────────
 * Auto-generated Open Graph + Twitter Card image for all HelixFlow
 * marketing pages. Served at /opengraph-image by Next.js.
 *
 * Rendered at 1200 × 630px (standard OG size).
 *
 * Visual design:
 *   - Void (#060D1A) background
 *   - Subtle radial aqua/ocean glow from top-left
 *   - Glass panel centered with navy fill + chrome border
 *   - Helix double-strand SVG mark (aqua + ocean)
 *   - "HelixFlow" wordmark in mist (#F7FBFF)
 *   - Short headline + sub-label
 *   - "by Newport E-commerce" attribution bottom-right
 */

import { ImageResponse } from "next/og";

// ── Metadata ──────────────────────────────────────────────────────────────────

export const runtime = "edge";
export const alt = "HelixFlow — AI-Assisted CRM for Agencies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ── Colors ────────────────────────────────────────────────────────────────────

const C = {
    void: "#060D1A",
    navy: "rgba(15,33,69,0.72)",
    aqua: "#2DBBEE",
    ocean: "#1466B8",
    mist: "#F7FBFF",
    chrome: "#B8C5D6",
    slate: "#7A8FA8",
    dim: "#3A4E68",
} as const;

// ── Image ─────────────────────────────────────────────────────────────────────

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: C.void,
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* ── Ambient radial glow — top-left ────────────────────── */}
                <div
                    style={{
                        position: "absolute",
                        top: -120,
                        left: -80,
                        width: 700,
                        height: 700,
                        borderRadius: "50%",
                        background:
                            "radial-gradient(ellipse at center, rgba(45,187,238,0.18) 0%, rgba(20,102,184,0.12) 40%, transparent 70%)",
                    }}
                />
                {/* ── Ambient radial glow — bottom-right ───────────────── */}
                <div
                    style={{
                        position: "absolute",
                        bottom: -100,
                        right: -60,
                        width: 500,
                        height: 500,
                        borderRadius: "50%",
                        background:
                            "radial-gradient(ellipse at center, rgba(20,102,184,0.14) 0%, transparent 65%)",
                    }}
                />

                {/* ── Grid dot overlay ──────────────────────────────────── */}
                {/* Satori doesn't support SVG patterns, so we fake a grid
            with a repeated dot approach via a subtle CSS radial */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                            "radial-gradient(rgba(184,197,214,0.08) 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />

                {/* ── Glass panel ───────────────────────────────────────── */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        background: C.navy,
                        border: "1px solid rgba(255,255,255,0.09)",
                        borderRadius: 24,
                        padding: "56px 72px",
                        width: 920,
                        boxShadow:
                            "0 1px 0 0 rgba(255,255,255,0.08) inset, 0 40px 100px rgba(2,6,23,0.70)",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Top chrome line */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 1,
                            background:
                                "linear-gradient(90deg, transparent 5%, rgba(45,187,238,0.60) 35%, rgba(129,140,248,0.45) 65%, transparent 95%)",
                        }}
                    />

                    {/* ── Logo row ──────────────────────────────────────── */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 18,
                            marginBottom: 40,
                        }}
                    >
                        {/* Helix mark container */}
                        <div
                            style={{
                                width: 52,
                                height: 52,
                                borderRadius: 14,
                                background: "rgba(15,33,69,0.90)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 1px 0 0 rgba(255,255,255,0.08) inset",
                            }}
                        >
                            {/* Helix SVG — two strands */}
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M7.2 7.4c2.6-2.2 6.9-2.2 9.6 0 2.2 1.8 1.2 4.3-1.2 5.8-1.1.7-2.4 1.3-3.8 2-1.6.8-3.1 1.6-4.1 2.6-2.2 2.1-.6 4.8 2.3 5.3 2 .4 4.2-.2 5.8-1.5"
                                    stroke={C.aqua}
                                    strokeWidth="2.1"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M16.8 16.6c-2.6 2.2-6.9 2.2-9.6 0-2.2-1.8-1.2-4.3 1.2-5.8 1.1-.7 2.4-1.3 3.8-2 1.6-.8 3.1-1.6 4.1-2.6 2.2-2.1.6-4.8-2.3-5.3-2-.4-4.2.2-5.8 1.5"
                                    stroke={C.ocean}
                                    strokeWidth="2.1"
                                    strokeLinecap="round"
                                    opacity="0.9"
                                />
                            </svg>
                        </div>

                        {/* Wordmark */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <span
                                style={{
                                    fontSize: 26,
                                    fontWeight: 700,
                                    color: C.mist,
                                    letterSpacing: "-0.5px",
                                    lineHeight: 1,
                                }}
                            >
                                HelixFlow
                            </span>
                            <span
                                style={{
                                    fontSize: 13,
                                    color: C.slate,
                                    fontWeight: 400,
                                    letterSpacing: "0.2px",
                                }}
                            >
                                by Newport E-commerce
                            </span>
                        </div>
                    </div>

                    {/* ── Headline ──────────────────────────────────────── */}
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            alignItems: "baseline",
                            gap: "0 10px",
                            fontSize: 52,
                            fontWeight: 700,
                            color: C.mist,
                            letterSpacing: "-1.5px",
                            lineHeight: 1.1,
                            textAlign: "center",
                            marginBottom: 20,
                            maxWidth: 700,
                        }}
                    >
                        <span>The CRM built for</span>
                        <span style={{ color: C.aqua }}>agency delivery.</span>
                    </div>

                    {/* ── Sub ───────────────────────────────────────────── */}
                    <div
                        style={{
                            display: "flex",
                            fontSize: 20,
                            color: C.chrome,
                            textAlign: "center",
                            lineHeight: 1.5,
                            maxWidth: 560,
                            fontWeight: 400,
                        }}
                    >
                        Leads → Proposals → Delivery → Growth. On autopilot.
                    </div>

                    {/* ── Bottom badge row ──────────────────────────────── */}
                    <div
                        style={{
                            display: "flex",
                            gap: 10,
                            marginTop: 36,
                            alignItems: "center",
                        }}
                    >
                        {["AI-Assisted", "Agency-First", "Early Access"].map((label) => (
                            <div
                                key={label}
                                style={{
                                    fontSize: 12,
                                    color: C.chrome,
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.09)",
                                    borderRadius: 999,
                                    padding: "5px 14px",
                                    fontWeight: 500,
                                    letterSpacing: "0.3px",
                                }}
                            >
                                {label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Domain — bottom-right of canvas ───────────────────── */}
                <div
                    style={{
                        display: "flex",
                        position: "absolute",
                        bottom: 28,
                        right: 40,
                        fontSize: 13,
                        color: C.dim,
                        letterSpacing: "0.3px",
                    }}
                >
                    helixflow.cloud
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
