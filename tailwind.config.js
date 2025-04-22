/* eslint-disable @typescript-eslint/no-require-imports */
// @ts-check
/** @type {import('tailwindcss').Config } */
module.exports = {
  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: 'var(--color-gray-700)',
            '--tw-prose-body': 'var(--color-gray-700)',
            '--tw-prose-headings': 'var(--color-gray-800)',
            a: {
              color: theme('--color-primary-700'),
              '&:hover': {
                color: theme('--color-primary-500'),
              },
              code: { color: theme('--color-primary-600') },
            },
            'h1,h2': {
              fontWeight: '700',
              letterSpacing: theme('--tracking-tight'),
            },
            h3: {
              fontWeight: '600',
            },
            code: {
              color: theme('--color-indigo-500'),
            },
          },
        },
        invert: {
          css: {
            color: 'var(--color-gray-400)',
            '--tw-prose-headings': 'var(--color-gray-400)',
            '--tw-prose-body': 'var(--color-gray-400)',
            a: {
              color: theme('--color-primary-500'),
              '&:hover': {
                color: theme('--color-primary-400'),
              },
              code: { color: theme('--color-primary-400') },
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('--color-gray-100'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
