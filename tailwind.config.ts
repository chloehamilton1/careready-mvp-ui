import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        careBlue: {
          50: "#f2f8fd",
          100: "#dceefb",
          200: "#b9def7",
          300: "#89c5ef",
          400: "#54a9e5",
          500: "#2c90d7",
          600: "#1d73b2",
          700: "#195c8f",
          800: "#184f76",
          900: "#194363"
        },
        careGreen: {
          50: "#f1faf6",
          100: "#dbf3e8",
          200: "#bae7d3",
          300: "#8dd8b9",
          400: "#5fc39b",
          500: "#3ea67f",
          600: "#2e8565",
          700: "#266b54",
          800: "#235645",
          900: "#1f473a"
        }
      },
      boxShadow: {
        care: "0 12px 30px -16px rgba(25, 92, 143, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
