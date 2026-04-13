import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dourado brilhante/metálico
        gold: {
          DEFAULT: '#D4A017',
          light:   '#FFD060',
          bright:  '#FFE080',
          dark:    '#A07808',
          shine:   '#FFD700',
        },
        // Dark — tons marrom-escuro (preto quente → marrom profundo)
        dark: {
          DEFAULT: '#0c0806',
          card:    '#150d08',
          hover:   '#201408',
          border:  '#2e1a0c',
        },
        // Light — creme/marfim para o modo claro
        light: {
          DEFAULT: '#FAF5EE',
          card:    '#FFFAF4',
          hover:   '#EDE3D5',
          border:  '#DDD0BC',
        },
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        inter:    ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'gold-metallic': 'linear-gradient(90deg, #7A5A00 0%, #D4A017 20%, #FFD700 40%, #FFF4B0 50%, #FFD700 60%, #D4A017 80%, #7A5A00 100%)',
      },
      animation: {
        'fade-in':      'fadeIn 0.3s ease-in-out',
        'slide-up':     'slideUp 0.3s ease-out',
        'gold-shimmer': 'goldShimmer 4s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        goldShimmer: {
          '0%':   { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}

export default config
