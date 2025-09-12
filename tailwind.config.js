/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'songti': ['Songti SC', 'SimSun', 'Noto Serif CJK SC', 'serif'],
      },
    },
  },
  plugins: [],
}