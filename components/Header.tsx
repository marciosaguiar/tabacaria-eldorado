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
    <header className="lg-nav" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      height: '60px',
      display: 'flex',
      alignItems: 'center',
    }}>
      {/* Subtle gold shimmer line at top */}
      <div style={{
        position: 'absolute',
        top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '50%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(200,137,26,0.35), transparent)',
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
          <div style={{ position: 'relative', height: '32px', width: '32px' }}>
            <Image
              src={settings.logoUrl || '/images/logo.png'}
              alt={settings.nome} fill sizes="32px"
              style={{
                objectFit: 'contain',
                filter: 'drop-shadow(0 1px 8px rgba(200,137,26,0.32))',
              }}
              priority
            />
          </div>
          <span style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: '17px', fontWeight: 700,
            color: 'var(--text)', letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}>
            {settings.nome || 'Tabacaria Eldorado'}
          </span>
        </Link>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {channel && (
            <span style={{
              background: 'rgba(200,137,26,0.10)',
              border: '1px solid rgba(200,137,26,0.22)',
              color: 'var(--gold-deep)',
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: '10px', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              padding: '5px 13px', borderRadius: '50px',
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(8px)',
            }}>
              {channel === 'atacado' ? 'Atacado' : 'Varejo'}
            </span>
          )}
          <AdminHeaderLink />
        </div>
      </div>
    </header>
  )
}
