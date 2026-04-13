import Image from 'next/image'
import Link from 'next/link'
import AdminHeaderLink from './AdminHeaderLink'
import { getSettings } from '@/lib/settings'

interface HeaderProps {
  channel?: 'atacado' | 'varejo'
}

export default async function Header({ channel }: HeaderProps) {
  const settings = await getSettings()

  return (
    <header
      className="glass-nav"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid rgba(233,193,118,0.08)',
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
        {/* Logo + nome */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <div style={{ position: 'relative', height: '36px', width: '36px', flexShrink: 0 }}>
            <Image
              src={settings.logoUrl || '/images/logo.png'}
              alt={settings.nome}
              fill
              sizes="36px"
              style={{
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 6px rgba(233,193,118,0.25))',
              }}
              priority
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-newsreader, serif)',
              fontSize: '17px',
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#e9c176',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            {settings.nome || 'Tabacaria Eldorado'}
          </span>
        </Link>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Channel badge — tonal pill (The "Humidor Toggle" style) */}
          {channel && (
            <span
              style={{
                backgroundColor: 'rgba(233,193,118,0.12)',
                border: '1px solid rgba(233,193,118,0.2)',
                color: '#e9c176',
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '4px 12px',
                borderRadius: '6px',
                lineHeight: 1.4,
                whiteSpace: 'nowrap',
              }}
            >
              {channel === 'atacado' ? 'Atacado' : 'Varejo'}
            </span>
          )}

          {/* Admin link */}
          <AdminHeaderLink />
        </div>
      </div>
    </header>
  )
}
