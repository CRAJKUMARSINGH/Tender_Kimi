/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pwd-green': {
          DEFAULT: '#4CAF50',
          light: '#81C784',
          dark: '#388E3C',
          gradient: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 50%, #81C784 100%)',
        },
        'pwd-text': {
          DEFAULT: '#262730',
          light: '#e8f5e9',
        },
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
        },
        secondary: {
          DEFAULT: '#64748b',
          dark: '#475569',
        },
      },
      backgroundImage: {
        'pwd-header': 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 50%, #81C784 100%)',
      },
    },
  },
  plugins: [],
}
