/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        accent: "var(--accent-color)",
        black: "var(--black-color)",
        white: "var(--white-color)",
        border: "var(--border-color)",
      },
      fontFamily: {
        main: "var(--font-main)"
      },
    },
  },
}