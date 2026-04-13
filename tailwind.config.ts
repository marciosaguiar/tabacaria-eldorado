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
        // ── Stitch "The Sommelier's Study" palette ──────────────
        surface: {
          DEFAULT:  '#200f0a',
          lowest:   '#1a0a06',
          low:      '#291712',
          mid:      '#2e1b16',
          high:     '#39251f',
          highest:  '#45302a',
          bright:   '#4a342e',
          variant:  '#45302a',
        },
        primary: {
          DEFAULT:    '#e9c176',
          container:  '#c5a059',
          fixed:      '#ffdea5',
        },
        'on-surface':         '#fedbd2',
        'on-surface-variant': '#d1c5b4',
        'on-primary':         '#412d00',
        'outline':            '#9a8f80',
        'outline-variant':    '#4e4639',
        secondary: {
          DEFAULT:   '#d9c4a0',
          container: '#534529',
        },

        // ── Legado (compatibilidade admin) ──────────────────────
        gold: {
          DEFAULT: '#e9c176',
          light:   '#ffdea5',
          bright:  '#fff3d6',
          dark:    '#c5a059',
          shine:   '#e9c176',
        },
        dark: {
          DEFAULT: '#200f0a',
          card:    '#2e1b16',
          hover:   '#39251f',
          border:  '#45302a',
        },
      },
      fontFamily: {
        newsreader: ['var(--font-newsreader)', 'Newsreader', 'Georgia', 'serif'],
        playfair:   ['var(--font-newsreader)', 'Newsreader', 'Georgia', 'serif'], // alias
        inter:      ['var(--font-inter)', 'Inter', 'sans-serif'],
        headline:   ['var(--font-newsreader)', 'Newsreader', 'Georgia', 'serif'],
        body:       ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        sm:  '0.25rem',
        md:  '0.5rem',
        lg:  '0.75rem',
        xl:  '1rem',
        '2xl': '1.25rem',
        full: '9999px',
      },
      backgroundImage: {
        'gold-metallic':   'linear-gradient(90deg, #c5a059 0%, #e9c176 40%, #ffdea5 50%, #e9c176 60%, #c5a059 100%)',
        'espresso-radial': 'radial-gradient(ellipse at top, rgba(233,193,118,0.07), transparent 60%)',
      },
      animation: {
        'fade-in':      'fadeIn 0.4s ease-in-out',
        'slide-up':     'slideUp 0.4s ease-out',
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
