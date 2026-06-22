/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: '#8B5CF6',
        accentHover: '#7C3AED',
        darkBg: '#111827',
        darkCard: '#1F2937',
        darkText: '#D1D5DB',
        lightBg: '#FAFAFA',
        lightCard: '#FFFFFF',
        lightText: '#4B5563',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
