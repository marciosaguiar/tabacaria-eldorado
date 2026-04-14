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
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(8, 8, 8, 0.82)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Ambient gold hint at top of header */}
      <div style={{
        position: 'absolute',
        top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '60%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(240,160,48,0.4), transparent)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '1280px',
        margin: '0 auto', padding: '0 16px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '12px',
      }}>
        {/* Logo + nome */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ position: 'relative', height: '34px', width: '34px' }}>
            <Image
              src={settings.logoUrl || '/images/logo.png'}
              alt={settings.nome} fill sizes="34px"
              style={{
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 8px rgba(240,160,48,0.4))',
              }}
              priority
            />
          </div>
          <span style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: '17px', fontWeight: 700,
            color: '#fff', letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}>
            {settings.nome || 'Tabacaria Eldorado'}
          </span>
        </Link>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {channel && (
            <span style={{
              background: 'rgba(240,160,48,0.12)',
              border: '1px solid rgba(240,160,48,0.25)',
              color: '#F0A030',
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: '10px', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              padding: '5px 13px', borderRadius: '50px',
              whiteSpace: 'nowrap',
            }}>
              {channel === 'atacado' ? 'Atacado' : 'Varejo'}
            </span>
          )}
          <AdminHeaderLink />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
