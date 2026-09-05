import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ivory: "var(--color-ivory)",
        "coffee-light": "var(--color-coffee-light)",
        "coffee-dark": "var(--color-coffee-dark)",
        beige: "var(--color-beige)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
};

export default config;
