import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: "#15171B",
        steel: {
          DEFAULT: "#1E2228",
          hover: "#262C34",
          deep: "#181B20",
        },
        line: "#2C313A",
        paper: "#ECEAE4",
        "paper-dim": "#9BA1A8",
        safety: {
          DEFAULT: "#FF6B35",
          hover: "#FF824F",
        },
        flux: "#3ECF8E",
        amber: "#FFB020",
        alert: "#FF5A5F",
        steelblue: "#7C93C4",
      },
      fontFamily: {
        display: ["var(--font-archivo)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
    },
  },
  plugins: [],
};

export default config;
