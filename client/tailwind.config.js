/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0A0A0D',
          900: '#101014',
          800: '#15151B',
          700: '#1E1E26',
          600: '#2A2A33',
        },
        marquee: {
          gold: '#D4A03C',
          goldDim: '#8A6B2A',
        },
        reel: {
          crimson: '#9B2C3C',
        },
        bone: {
          100: '#EDEAE3',
          400: '#8B8D98',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      letterSpacing: {
        marquee: '0.08em',
      },
      boxShadow: {
        card: '0 20px 60px -20px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};
