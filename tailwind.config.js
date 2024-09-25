/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        greenishBlue:{
          DEFAULT: "#1E555C",
          200: "#13353A"
        },
        white:"#FFFFFF",
      }
    },
  },
  plugins: [],
}

