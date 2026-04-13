import Image from 'next/image'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import AdminHeaderLink from './AdminHeaderLink'
import { getSettings } from '@/lib/settings'

interface HeaderProps {
  channel?: 'atacado' | 'varejo'
}

export default async function Header({ channel }: HeaderProps) {
  const settings = await getSettings()

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: 'var(--el-gradient-dark)',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ position: 'relative', height: '52px', width: '160px' }}>
            <Image
              src={settings.logoUrl || '/images/logo.png'}
              alt={settings.nome}
              fill
              sizes="160px"
              style={{ objectFit: 'contain', objectPosition: 'left center', filter: 'drop-shadow(0 0 8px rgba(201,150,42,0.25))' }}
              priority
            />
          </div>
        </Link>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Channel badge */}
          {channel && (
            <span
              style={{
                background: 'var(--el-gradient-gold)',
                color: '#3B1A08',
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '4px 12px',
                borderRadius: '12px',
                lineHeight: 1.4,
                whiteSpace: 'nowrap',
              }}
            >
              {channel === 'atacado' ? '◆ Atacado' : '◆ Varejo'}
            </span>
          )}

          {/* Admin link */}
          <AdminHeaderLink />

          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
