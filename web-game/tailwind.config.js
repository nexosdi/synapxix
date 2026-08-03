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
