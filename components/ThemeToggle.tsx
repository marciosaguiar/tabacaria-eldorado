'use client'

import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      className={`
        relative w-9 h-9 rounded-full flex items-center justify-center
        border transition-all duration-300 flex-shrink-0
        ${theme === 'dark'
          ? 'border-gold/30 text-gold hover:border-gold/70 hover:bg-gold/10 hover:shadow-[0_0_12px_rgba(212,160,23,0.25)]'
          : 'border-[var(--gold)]/40 hover:border-[var(--gold)] hover:bg-[var(--gold)]/10'
        }
      `}
      style={{ color: 'var(--gold)' }}
    >
      {theme === 'dark' ? (
        /* Ícone Sol — modo claro */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2"  x2="12" y2="4"  strokeLinecap="round" />
          <line x1="12" y1="20" x2="12" y2="22" strokeLinecap="round" />
          <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"   strokeLinecap="round" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeLinecap="round" />
          <line x1="2"  y1="12" x2="4"  y2="12" strokeLinecap="round" />
          <line x1="20" y1="12" x2="22" y2="12" strokeLinecap="round" />
          <line x1="4.22" y1="19.78"  x2="5.64" y2="18.36"  strokeLinecap="round" />
          <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  strokeLinecap="round" />
        </svg>
      ) : (
        /* Ícone Lua — modo escuro */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
          />
        </svg>
      )}
    </button>
  )
}
