/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.js", "./screens/**/*.js"],
  theme: {
    extend: {
      width: {
        '120p': '120%',
      },
      height: {
        '120p': '120%',
      },
      borderColor: {
        'lilac': '#AE48E2',
      },
      borderWidth: {
        '0.75': 0.75,
      },
      textColor: {
        'lilac': '#AE48E2',
      },
      backgroundColor: {
        'darkblue': '#16032A',
      },
      height: {
        '0.1': 1,
      },
      width: {
        '1/10': '10%',
      }
    },
  },
  plugins: [],
}

