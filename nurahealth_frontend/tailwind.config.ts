import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          900: "#1f4a43",
          700: "#2f6f64",
          600: "#3c8478",
          500: "#4ca596",
        },
        mint: { 200: "#cfeee7", 100: "#e6f5f1" },
        cream: "#f5f3ec",
        ink: "#1b332e",
        muted: "#8aa39d",
        line: "#e7e2d6",
        brand: { green: "#2ecc71", amber: "#f0a330", red: "#e6604f" },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "SF Pro Display",
          "Helvetica Neue",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
