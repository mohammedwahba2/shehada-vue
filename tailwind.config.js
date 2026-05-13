/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
    "./error.vue",
    "./app/**/*.{js,vue,ts}",
  ],
  darkMode: "class",

  theme: {
    extend: {
       fontFamily: {
        sans: ['Tajawal', 'sans-serif'],
        },
      colors: {
        ink: "#1B1C1E",
        white: "#F7F7F7",
      },
    },
  },

  plugins: [],
};