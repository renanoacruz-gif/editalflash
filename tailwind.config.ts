import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        ink: {
          DEFAULT: "var(--ink)",
          2: "var(--ink-2)",
        },
        line: "var(--line)",
        brand: {
          DEFAULT: "var(--brand)",
          solid: "var(--brand-solid)",
          tint: "var(--brand-tint)",
        },
        ok: {
          DEFAULT: "var(--ok)",
          bg: "var(--ok-bg)",
          fg: "var(--ok-fg)",
        },
        warn: {
          DEFAULT: "var(--warn)",
          bg: "var(--warn-bg)",
          fg: "var(--warn-fg)",
        },
        bad: {
          DEFAULT: "var(--bad)",
          bg: "var(--bad-bg)",
          fg: "var(--bad-fg)",
        },
        rev: {
          DEFAULT: "var(--rev)",
          bg: "var(--rev-bg)",
          fg: "var(--rev-fg)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", '"Bricolage Grotesque"', "sans-serif"],
        body: ["var(--font-body)", '"IBM Plex Sans"', "sans-serif"],
        mono: ["var(--font-mono)", '"IBM Plex Mono"', "monospace"],
      },
      fontSize: {
        "proof-mono": ["13px", { lineHeight: "1.65", letterSpacing: "0.04em" }],
      },
    },
  },
  plugins: [],
};

export default config;
