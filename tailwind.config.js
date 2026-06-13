const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
    './templates/**/*.typ',
  ],
  safelist: [
    'rounded-lg',
    'border-gray-600',
    'border-gray-300',
    'max-h-[1000px]',
    'max-w-72',
    'w-auto',
    'h-auto',
    'sm:max-w-96',
    'xl:max-w-xl',
    'dark:brightness-[.8]',
    'dark:border-gray-300',
    'space-y-2',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: [
          'Times',
          'Times New Roman',
          'Noto Serif',
          'Noto Serif SC',
          '新宋体',
          '宋体',
          ...defaultTheme.fontFamily.serif,
        ],
      },
      colors: {
        primary: {
          50: '#f0fdf9',
          100: '#cef9eb',
          200: '#9ef3d8',
          300: '#5fe5c2',
          400: '#2ecfa7',
          500: '#15b38e',
          600: '#0e9074',
          700: '#10735e',
          800: '#125b4c',
          900: '#134b40',
          950: '#042f2c',
        },
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
