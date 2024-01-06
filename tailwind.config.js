/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EFF5FA",
          100: "#E0EBF5",
          200: "#C5D9ED",
          300: "#A5C5E3",
          400: "#86B1DA",
          500: "#6A9FD1",
          600: "#3B7FBF",
          700: "#2D6090",
          800: "#1E4161",
          900: "#0E1F2F",
          950: "#071017",
        },
      },
      boxShadow: {
        DEFAULT: "rgba(7,65,210,0.2) 0px 9px 20px",
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
};
