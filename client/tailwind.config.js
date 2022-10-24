/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    colors: {
      primary: {
        100: '#1b8671',
        200: '#156757',
        300: '#0f4b3f',
      },
      secondary: {
        100: '#49a77b',
        200: '#3a8461',
        300: '#285c43',
      },
      tertiary: {
        100: '#ece7d4',
        200: '#d7cea6',
        300: '#c9bc86',
      },
      quaternary: {
        100: '#f5f7f0',
        200: '#eff2e7',
        300: '#dbe2c9',
      },
      white: '#efefef',
      black: '#0a0a0a',
      transparent:'transparent',
    },
    extend: {
      boxShadow: {
        'customShadow': 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
