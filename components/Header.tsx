import Image from 'next/image'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { getSettings } from '@/lib/settings'

interface HeaderProps {
  channel?: 'atacado' | 'varejo'
}

export default async function Header({ channel }: HeaderProps) {
  const settings = await getSettings()

  return (
    <header
      className="border-b border-gold/20 sticky top-0 z-40 backdrop-blur-sm"
      style={{ backgroundColor: 'var(--header-bg)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center flex-shrink-0">
          <div className="relative h-14 w-44 sm:h-16 sm:w-52">
            <Image
              src={settings.logoUrl || '/images/logo.png'}
              alt={settings.nome}
              fill
              sizes="(max-width: 640px) 176px, 208px"
              style={{ objectFit: 'contain', objectPosition: 'left center' }}
              priority
            />
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {channel && (
            <span
              className={`
                px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-inter font-medium
                tracking-[0.15em] uppercase border rounded-full transition-all duration-300
                ${channel === 'atacado'
                  ? 'border-gold text-gold bg-gold/10 shadow-[0_0_12px_rgba(212,160,23,0.2)]'
                  : 'border-gold-light text-gold-light bg-gold-light/10 shadow-[0_0_12px_rgba(255,208,96,0.15)]'
                }
              `}
            >
              {channel === 'atacado' ? '◆ Atacado' : '◆ Varejo'}
            </span>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
