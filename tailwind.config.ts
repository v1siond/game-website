import type { Config } from "tailwindcss";
import { ATOMIC_COLORS } from "./src/components/themes/RetroAtomic/palette";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Plain modules hold class strings too (lib/cv/masonry.ts deals every world its list columns).
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Retro Atomic, fed from its palette: bg-atomic-ink, text-atomic-phosphor, border-atomic-yellow/30.
        atomic: ATOMIC_COLORS,
      },
    },
  },
  plugins: [],
};
export default config;
