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
        santander: {
          red: '#EC0000',
          'red-dark': '#C50000',
          'red-light': '#FF2020',
          gray: '#222222',
          'gray-medium': '#666666',
        },
        primary: {
          dark: '#222222',
          DEFAULT: '#EC0000',
          light: '#FF2020',
        },
        accent: {
          DEFAULT: '#EC0000',
          light: '#FF4444',
          dark: '#C50000',
        },
      },
    },
  },
  plugins: [],
}

