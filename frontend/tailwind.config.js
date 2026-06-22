/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand accent
        accent: '#10B981',
        accentHover: '#059669',

        // Dark theme — 3-tier elevation: bg < secondary < card
        darkBg: '#0B1120',
        darkSecondary: '#111827',
        darkCard: '#1F2937',
        darkHeading: '#F9FAFB',
        darkText: '#D1D5DB',

        // Light theme
        lightBg: '#F9FAFB',
        lightCard: '#FFFFFF',
        lightHeading: '#111827',
        lightText: '#4B5563',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      // System-wide rule: every rounded corner is exactly 7px (true circles —
      // avatars, dots, pill icon-buttons — intentionally keep `rounded-full`).
      borderRadius: {
        none: '0px',
        sm: '7px',
        DEFAULT: '7px',
        md: '7px',
        lg: '7px',
        xl: '7px',
        '2xl': '7px',
        '3xl': '7px',
        full: '9999px',
      },
    },
  },
  plugins: [],
}