/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '480px',
      sm: '768px',
      md: '990px',
      lg: '1200px',
    },
    extend: {
      colors: {
        eb: {
          900: '#020d1a',
          800: '#061e3a',
          700: '#0a3260',
          600: '#0f4a8a',
          500: '#1565c0',
          400: '#1e88e5',
          300: '#42a5f5',
          200: '#90caf9',
          100: '#bbdefb',
          50: '#e3f2fd',
          accent: '#29b6f6',
          error: '#e12f1d',
          offer: '#f59e0b',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        sans: ['var(--font-body)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
