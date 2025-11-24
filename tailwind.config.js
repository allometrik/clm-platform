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
          blue: '#0F4C81',
          'blue-dark': '#0A3A5F',
          'blue-light': '#2E7DAF',
          gray: '#222222',
          'gray-medium': '#666666',
        },
        primary: {
          dark: '#222222',
          DEFAULT: '#0F4C81',
          light: '#2E7DAF',
        },
        accent: {
          DEFAULT: '#0F4C81',
          light: '#2E7DAF',
          dark: '#0A3A5F',
        },
      },
    },
  },
  plugins: [],
}

