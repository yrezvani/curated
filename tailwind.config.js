const heading = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {},
    fontFamily: {
      heading: ['Sixtyfour', heading]
    }
  },
  plugins: [],
}

