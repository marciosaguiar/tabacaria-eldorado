import Image from 'next/image'
import Link from 'next/link'

interface HeaderProps {
  channel?: 'atacado' | 'varejo'
}

export default function Header({ channel }: HeaderProps) {
  return (
    <header className="border-b border-gold/20 bg-dark sticky top-0 z-40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="relative h-14 w-44 sm:h-16 sm:w-52">
            <Image
              src="/images/logo.png"
              alt="Tabacaria Eldorado"
              fill
              sizes="(max-width: 640px) 176px, 208px"
              style={{ objectFit: 'contain', objectPosition: 'left center' }}
              priority
            />
          </div>
        </Link>

        {channel && (
          <span
            className={`
              px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-inter font-medium
              tracking-[0.15em] uppercase border rounded-full transition-all duration-300
              ${channel === 'atacado'
                ? 'border-gold text-gold bg-gold/10 shadow-[0_0_12px_rgba(201,168,76,0.2)]'
                : 'border-gold-light text-gold-light bg-gold-light/10 shadow-[0_0_12px_rgba(240,208,128,0.15)]'
              }
            `}
          >
            {channel === 'atacado' ? '◆ Atacado' : '◆ Varejo'}
          </span>
        )}
      </div>
    </header>
  )
}
