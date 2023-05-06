/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
   content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
   theme: {
      extend: {
         fontFamily: {
            sans: ['"Poppins"', ...defaultTheme.fontFamily.sans],
            japan: ['"Noto Sans JP"', ...defaultTheme.fontFamily.sans],
         },
      },
   },
   plugins: [],
}
