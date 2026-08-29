/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Paleta oficial de marca ContactGo (2026-08-19) — reemplaza la
        // escala verde que se usaba antes, que no coincidía con el logo
        // real (azul marino #002455 + turquesa #01B2B7). primary-600
        // queda anclado exacto al azul de marca porque es el tono que
        // usan la mayoría de botones y CTAs en todo el sitio.
        primary: {
          50:  '#EEF2F8',
          100: '#D8E1EE',
          200: '#B1C3DD',
          300: '#8AA5CC',
          400: '#4D74A8',
          500: '#1A4A83',
          600: '#002455',  // ← Azul ContactGo oficial, exacto del logo
          700: '#001C42',
          800: '#00142F',
          900: '#000C1C',
          950: '#00060E',
        },
        teal: {
          50:  '#E6FBFB',
          100: '#CCF7F8',
          200: '#99EFF0',
          300: '#66E6E8',
          400: '#33DDDF',
          500: '#01B2B7',  // ← Turquesa ContactGo oficial, exacto del logo
          600: '#018E92',
          700: '#016A6D',
          800: '#014749',
          900: '#002324',
          950: '#001213',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)',
        'card': '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
