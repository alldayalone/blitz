/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: 'aliceblue',
        'dark-blue': '#191a23',
        darkslategray: '#1f2130',
        muted: '#848699'
      }
    },
  },
  plugins: [],
}

