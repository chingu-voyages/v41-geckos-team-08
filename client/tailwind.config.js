/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    colors: {
      primary:'#156757',
      secondary:'#3a8461',
      tertiary:'#d7cea6',
      quaternary:' #eff2e7',
      white: '#efefef',
      black: '#0a0a0a'
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
