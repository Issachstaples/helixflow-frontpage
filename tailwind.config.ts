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
