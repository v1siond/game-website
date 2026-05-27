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
      },
      fontSize: {
        // Content text utilities - WCAG compliant minimums
        // Use these for all CV/portfolio content, not text-xs or text-sm
        'content-sm': ['0.875rem', { lineHeight: '1.5' }],  // 14px - minimum allowed
        'content': ['1.125rem', { lineHeight: '1.6' }],     // 18px - standard body
        'content-lg': ['1.25rem', { lineHeight: '1.5' }],   // 20px - emphasis
        'heading-sm': ['1.25rem', { lineHeight: '1.3' }],   // 20px
        'heading': ['1.5rem', { lineHeight: '1.3' }],       // 24px
        'heading-lg': ['1.875rem', { lineHeight: '1.2' }],  // 30px
      },
    },
  },
  plugins: [],
};
export default config;
