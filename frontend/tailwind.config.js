/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fire-red': '#dc2626',
        'fire-yellow': '#fbbf24',
        'fire-green': '#16a34a',
      }
    },
  },
  plugins: [],
}
