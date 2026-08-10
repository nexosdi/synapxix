/**
 * Paleta y formas derivadas del Manual de Marca (ver BRAND.md).
 *
 * Los valores viven en libs/brand/src/tokens.css; acá se exponen como
 * utilidades de Tailwind. Si cambia un token, cambiá también este archivo.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  content: [
    "./web-game/src/**/*.{html,ts,scss}",
    "./libs/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      borderWidth: { '3': '3px' },
      fontFamily: {
        sans: ['Nunito', 'ui-rounded', 'Segoe UI Rounded', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Paleta oficial
        synapxix: '#1e90ff',
        'blue-deep': '#0a4fbf',
        sky: '#eaf3ff',

        // Escala derivada del azul de marca
        brand: {
          50: '#f5f9ff',
          100: '#eaf3ff',
          200: '#c9e0ff',
          300: '#93c6ff',
          400: '#52a8ff',
          500: '#1e90ff',
          600: '#1573d6',
          700: '#0a4fbf',
          800: '#073a8c',
          900: '#052a66',
        },

        // Estado: solo para feedback, nunca decorativo
        success: '#1e9e6a',
        warning: '#c77700',
        danger: '#d64545',

        /**
         * Los neutros de Tailwind se reescriben con neutros teñidos de azul.
         * Los juegos usan mucho `slate-*` y `gray-*`; en vez de reescribir cada
         * clase, se reencauzan acá para que respeten "tecnología humana" del
         * manual: nada de grises fríos neutros.
         */
        slate: {
          50: '#f5f9ff', 100: '#eaf3ff', 200: '#c9e0ff', 300: '#a9cdf3',
          400: '#8fb8e0', 500: '#6f97c2', 600: '#4c6c9a', 700: '#2f5382',
          800: '#0a4fbf', 900: '#052a66',
        },
        gray: {
          50: '#f5f9ff', 100: '#eaf3ff', 200: '#c9e0ff', 300: '#a9cdf3',
          400: '#8fb8e0', 500: '#6f97c2', 600: '#4c6c9a', 700: '#2f5382',
          800: '#0a4fbf', 900: '#052a66',
        },
        neutral: {
          50: '#f5f9ff', 100: '#eaf3ff', 200: '#c9e0ff', 300: '#a9cdf3',
          400: '#8fb8e0', 500: '#6f97c2', 600: '#4c6c9a', 700: '#2f5382',
          800: '#0a4fbf', 900: '#052a66',
        },

        /**
         * Feedback de los juegos: acierto y error necesitan leerse como tales,
         * así que se conservan como familia, calibrados a los tokens de estado.
         */
        emerald: {
          50: '#e3f7ef', 100: '#c7efdf', 300: '#7fd7b6', 400: '#4cc094',
          500: '#1e9e6a', 600: '#188457', 700: '#136945', 800: '#0d4e33',
          900: '#083321',
        },
        green: {
          50: '#e3f7ef', 100: '#c7efdf', 300: '#7fd7b6', 400: '#4cc094',
          500: '#1e9e6a', 600: '#188457', 700: '#136945', 800: '#0d4e33',
          900: '#083321',
        },
        red: {
          50: '#fdeaea', 100: '#f7d4d4', 300: '#eda0a0', 400: '#e06060',
          500: '#d64545', 600: '#b03636', 700: '#8c2b2b', 800: '#6b2020',
          900: '#4a1616',
        },
      },
      borderRadius: {
        'sx-sm': '8px',
        'sx-md': '14px',
        'sx-lg': '22px',
        'sx-xl': '32px',
        'sx-pill': '999px',
      },
      boxShadow: {
        'sx-sm': '0 2px 6px rgba(10, 79, 191, 0.08)',
        'sx-md': '0 6px 18px rgba(10, 79, 191, 0.12)',
        'sx-lg': '0 14px 38px rgba(10, 79, 191, 0.16)',
      },
    },
  },
  plugins: [],
};
