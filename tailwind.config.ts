
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Light theme - soft and pale colors
        primary: "#7C9CBF", // Soft blue
        secondary: "#F8B195", // Soft coral
        accent: "#B8E1D4", // Soft mint
        background: "#F8F9FA", // Off-white
        foreground: "#45545E", // Muted navy
        muted: {
          DEFAULT: "#E9EDF2", // Light grayish blue
          foreground: "#637381", // Slate gray
        },
        "text-primary": "#2C3E50",
        "border-color": "#D9E2EC",
        
        // Dark theme - softer dark palette
        "dark-bg": "#2E3440", 
        "dark-text": "#ECEFF4",
        "dark-card": "#3B4252",
        "dark-accent": "#88C0D0",
        "dark-muted": "#4C566A",
        
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        destructive: {
          DEFAULT: "#E57373", // Soft red
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "#FFFFFF", // Pure white for cards
          foreground: "#2C3E50",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        sans: ["'Inter'", ...fontFamily.sans],
        display: ["'Nunito'", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
