import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Dark Fantasy (Hollow Knight) palette — single source of truth for utilities
        // like bg-df-void / text-df-ethereal / border-df-stone-dark.
        df: {
          void: "#0f0a1a",
          "void-deep": "#1a1025",
          "void-purple": "#150f25",
          panel: "#15102b",
          ethereal: "#41c8e8",
          "ethereal-dark": "#5ecfef",
          "spirit-gold": "#e8c841",
          "spirit-gold-dark": "#d4af37",
          brass: "#b08d57",
          copper: "#8b6914",
          stone: "#4a4a4a",
          "stone-dark": "#333333",
          bone: "#e8e4dc",
          silver: "#a0a0a0",
          lavender: "#b7a9d9",
        },
      },
    },
  },
  plugins: [],
};
export default config;
