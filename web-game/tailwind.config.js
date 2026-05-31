import { join } from 'path';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./web-game/src/**/*.{html,ts,scss}",
    "./libs/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      borderWidth: { '3': '3px' },
      colors: {
        synapxix: '#1b95fb',
      }
    },
  },
  plugins: [],
};