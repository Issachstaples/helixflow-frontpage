import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── HelixFlow design tokens ──────────────────────────────────────
        // Use these instead of raw hex values in components:
        //   text-hx-mist      bg-hx-void      border-hx-aqua/30
        //   text-hx-chrome    bg-hx-navy      ring-hx-aqua
        hx: {
          void: "#060D1A",   // page background
          navy: "#0F2145",   // glass card fill base (use with opacity)
          ocean: "#1466B8",   // secondary accent / helix strand B
          aqua: "#2DBBEE",   // primary accent / helix strand A / CTA
          mist: "#F7FBFF",   // headings, primary text
          chrome: "#B8C5D6",   // secondary text, card labels
          slate: "#B7C6D8",   // body text, descriptions (lightened for improved contrast)
          dim: "#3A4E68",   // tertiary labels, muted hints
          indigo: "#818cf8",   // delivery phase tag
          emerald: "#34d399",   // growth / success state
        },
        // Legacy helix.* aliases kept for back-compat
        helix: {
          ink: "#0B1B3A",
          ocean: "#1466B8",
          aqua: "#2DBBEE",
          mist: "#F7FBFF",
        },
      },
      boxShadow: {
        glass: "0 10px 30px rgba(2, 6, 23, 0.08)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(1200px circle at 20% 10%, rgba(45,187,238,0.20), transparent 60%), radial-gradient(900px circle at 80% 30%, rgba(20,102,184,0.18), transparent 55%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
