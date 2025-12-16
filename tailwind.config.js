/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        near: {
          primary: '#00EC97',
          dark: '#13172B',
          darker: '#0B0D1A',
        }
      }
    },
  },
  plugins: [],
}

