/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg) translateY(10%)' },
          '50%': { transform: 'rotate(6deg) translateY(0)' },
        },
        updown: {
          '0%, 100%': { transform: 'translateY(1%)' },
          '50%': { transform: 'translateY(-1%)' },
        }
      }
    },
  },
  plugins: [],
}

