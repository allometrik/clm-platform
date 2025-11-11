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
        primary: {
          dark: '#2C3E50',
          DEFAULT: '#34495E',
          light: '#5D6D7E',
        },
        accent: {
          DEFAULT: '#E67E22',
          light: '#F39C12',
          dark: '#D35400',
        },
      },
    },
  },
  plugins: [],
}

