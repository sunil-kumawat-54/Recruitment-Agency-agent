/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#030712',      // Deep premium dark bg
          card: '#0f172a',      // Slate card
          border: '#1e293b',    // Slate border
          purple: '#6366f1',    // Indigo primary
          emerald: '#10b981',   // Emerald secondary
          rose: '#f43f5e',      // Rose error
          amber: '#f59e0b',     // Amber warning
          gray: '#94a3b8'       // Text gray
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 0 50px -12px rgba(99, 102, 241, 0.12)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
}
