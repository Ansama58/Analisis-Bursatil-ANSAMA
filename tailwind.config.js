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
        ansama: {
          navy: '#0b132b',
          dark: '#1c2541',
          slate: '#3a506b',
          accent: '#0066ff',
          teal: '#48cae4',
          green: '#10b981',
          red: '#ef4444',
          amber: '#f59e0b',
          surface: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          lightBg: '#f8fafc',
          lightCard: '#ffffff',
          lightBorder: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
