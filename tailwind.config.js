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
          dark: '#24272A',
          darker: '#1A1D20',
        }
      }
    },
  },
  plugins: [],
}

