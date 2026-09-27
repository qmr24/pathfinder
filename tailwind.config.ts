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
        sans: ["Inter", "sans-serif"],
        display: ["'DM Serif Display'", "serif"],
      },
      colors: {
        navy: {
          50:  "#eef2f9",
          100: "#d5dff0",
          200: "#aabfe1",
          300: "#7a9ace",
          400: "#4f78bb",
          500: "#2e5aa8",
          600: "#1e4080",
          700: "#163060",
          800: "#0f2247",
          900: "#091630",
        },
        gold: {
          400: "#f0c040",
          500: "#e2a800",
          600: "#c49200",
        },
      },
    },
  },
  plugins: [],
};
export default config;
