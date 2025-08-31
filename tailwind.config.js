/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  darkMode: 'class', // ✅ Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: '#a3c4f3',
        'primary-dark': '#82a3d7',
        whisperGray: '#f8f9fa',
        whisperDark: '#1f2937',
        whisperPink: '#fbb6ce',
      },
    },
  },
  plugins: [],
}
