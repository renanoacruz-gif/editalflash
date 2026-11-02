import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-base)",
        foreground: "var(--text-primary)",
        card: {
          DEFAULT: "var(--bg-surface)",
          foreground: "var(--text-primary)",
        },
        ring: "var(--brand)",
        bg: {
          DEFAULT: "var(--bg-base)",
          surface: "var(--bg-surface)",
          subtle: "var(--bg-subtle)",
        },
        surface: "var(--bg-surface)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        line: {
          DEFAULT: "var(--border-subtle)",
          strong: "var(--border-strong)",
        },
        brand: {
          DEFAULT: "var(--brand)",
          accent: "var(--brand-accent)",
          tint: "var(--brand-tint)",
        },
        tinta: "var(--ink)",
        papel: "var(--paper)",
        lacre: "var(--flash)",
        grafite: "var(--ink-secondary)",
        linha: "var(--rule)",
        ok: {
          DEFAULT: "var(--status-pass)",
          bg: "var(--status-pass-bg)",
          border: "var(--status-pass-border)",
          fg: "var(--status-pass)",
        },
        warn: {
          DEFAULT: "var(--status-warn)",
          bg: "var(--status-warn-bg)",
          border: "var(--status-warn-border)",
          fg: "var(--status-warn)",
        },
        bad: {
          DEFAULT: "var(--status-danger)",
          bg: "var(--status-danger-bg)",
          border: "var(--status-danger-border)",
          fg: "var(--status-danger)",
        },
        rev: {
          DEFAULT: "var(--status-review)",
          bg: "var(--status-review-bg)",
          border: "var(--status-review-border)",
          fg: "var(--status-review)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "IBM Plex Sans", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        bricolage: ["var(--font-bricolage)", "Bricolage Grotesque", "sans-serif"],
        display: ["var(--font-bricolage)", "Bricolage Grotesque", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
