/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.js", "./screens/**/*.js", , "./components/*.js"],
  theme: {
    extend: {
      colors: {
        "neo-light-blue": "#7DF9FF",
        "neo-green": "#2FFF2F",
        "neo-light-green": "#9FFCA3",
        "neo-purple": "#FF00F5",
        "neo-dark-blue": "#3300FF",
        "neo-yellow": "#FFFF00",
        "neo-red": "#FF4911",
        "neo-bg": "#FEF992",
      },
      boxShadow: {
        neo: "4px 4px 0px rgba(0, 0, 0, 1)", // 4px offset, 0 blur, 100% opacity
        "neo-small": "2px 2px 0px rgba(0, 0, 0, 1)", // 4px offset, 0 blur, 100% opacity
      },
    },
  },
  plugins: [],
};
