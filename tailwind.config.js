/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#10b981',
          'green-dark': '#059669',
          'green-light': '#34d399',
          gray: '#222222',
          'gray-medium': '#666666',
        },
        primary: {
          dark: '#222222',
          DEFAULT: '#10b981',
          light: '#34d399',
        },
        accent: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
      },
    },
  },
  plugins: [],
}

