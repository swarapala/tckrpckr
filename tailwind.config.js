/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#0f1419',
          900: '#0a0e14',
          950: '#050810',
        },
      },
    },
  },
  plugins: [],
}