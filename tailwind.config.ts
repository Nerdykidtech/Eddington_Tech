import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9ebff",
          200: "#bcdcff",
          300: "#8ec7ff",
          400: "#59a8ff",
          500: "#2f86ff",
          600: "#1a66f5",
          700: "#1550e1",
          800: "#1842b6",
          900: "#1a3c8f",
        },
        // Autheris launch accent — used sparingly for "live" signals
        volt: {
          300: "#dcff7a",
          400: "#c6ff3d",
          500: "#a8e61a",
        },
        surface: {
          900: "#07080c",
          800: "#0e1016",
          700: "#161922",
          600: "#222632",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

export default config;
