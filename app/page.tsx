import Image from 'next/image'
import Link from 'next/link'
import HomeProductSection from '@/components/HomeProductSection'
import AdminHeaderLink from '@/components/AdminHeaderLink'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import { getSettings } from '@/lib/settings'
import { getProducts } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const ArrowIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)
const WaIcon = () => (
  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)
const IgIcon = () => (
  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

export default async function HomePage() {
  const [settings, products] = await Promise.all([getSettings(), getProducts()])

  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <AnalyticsTracker page="home" />

      {/* ── NAV GLASS PILL ──────────────────────────────────────── */}
      <nav
        className="lg-nav"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', height: '60px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', width: '32px', height: '32px' }}>
            <Image
              src={settings.logoUrl || '/images/logo.png'}
              alt={settings.nome} fill sizes="32px"
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(200,137,26,0.3))' }}
              priority
            />
          </div>
          <span style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: '17px', fontWeight: 700,
            color: 'var(--text)', letterSpacing: '-0.02em',
          }}>
            {settings.nome || 'Tabacaria Eldorado'}
          </span>
        </div>
        <AdminHeaderLink />
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section style={{
        paddingTop: '60px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Ambient radial glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: `
            radial-gradient(ellipse 100% 60% at 50% 0%, rgba(200,137,26,0.18) 0%, transparent 65%),
            radial-gradient(ellipse 60% 40% at 15% 80%, rgba(200,137,26,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 85% 70%, rgba(232,168,50,0.06) 0%, transparent 50%)
          `,
        }} />

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', padding: '40px 24px 56px',
          width: '100%', maxWidth: '600px',
        }}>
          {/* Logo com aura */}
          <div style={{
            position: 'relative', width: '120px', height: '120px',
            marginBottom: '24px',
          }}>
            {/* Aura ring */}
            <div style={{
              position: 'absolute', inset: '-12px',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(200,137,26,0.2) 0%, transparent 70%)',
              animation: 'pulse 3s ease-in-out infinite',
            }} />
            <Image
              src={settings.logoUrl || '/images/logo.png'}
              alt={settings.nome} fill sizes="120px"
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 4px 20px rgba(200,137,26,0.45)) drop-shadow(0 0 40px rgba(200,137,26,0.2))' }}
              priority
            />
          </div>

          {/* Nome */}
          <h1 style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: 'clamp(30px, 7vw, 48px)',
            fontWeight: 900, lineHeight: 1.1,
            letterSpacing: '-0.03em', marginBottom: '10px',
          }}>
            <span className="gold-text">{settings.nome || 'Tabacaria Eldorado'}</span>
          </h1>

          {/* Slogan */}
          {settings.slogan && (
            <p style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: '15px', color: 'var(--text-2)',
              lineHeight: 1.6, maxWidth: '300px',
              marginBottom: '40px', fontWeight: 400,
            }}>
              {settings.slogan}
            </p>
          )}
          {!settings.slogan && <div style={{ marginBottom: '36px' }} />}

          {/* ── CATÁLOGO CARDS (glass) ─────────────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '14px', width: '100%',
          }}>
            {/* Varejo */}
            <Link href="/varejo" style={{ textDecoration: 'none' }}>
              <div className="catalog-hero-card" style={{
                height: '300px',
                background: `
                  linear-gradient(155deg,
                    rgba(255,248,236,0.95) 0%,
                    rgba(253,240,210,0.88) 50%,
                    rgba(248,228,185,0.80) 100%
                  )
                `,
              }}>
                {/* Decorative gold orb */}
                <div style={{
                  position: 'absolute', top: '-40px', right: '-40px',
                  width: '180px', height: '180px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(200,137,26,0.22) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />
                {/* Subtle grain */}
                <div style={{
                  position: 'absolute', inset: 0, opacity: 0.025,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  pointerEvents: 'none',
                }} />

                <div className="card-content">
                  <span style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize: '9px', fontWeight: 800,
                    textTransform: 'uppercase', letterSpacing: '0.22em',
                    color: 'rgba(160,104,16,0.7)',
                    marginBottom: '8px',
                  }}>
                    Para o consumidor
                  </span>
                  <h2 style={{
                    fontFamily: 'var(--font-playfair, serif)',
                    fontSize: '28px', fontWeight: 900,
                    color: 'var(--text)', lineHeight: 1.15,
                    letterSpacing: '-0.02em', marginBottom: '20px',
                  }}>
                    Catálogo<br />Varejo
                  </h2>
                  <button className="btn-primary" style={{ fontSize: '13px', padding: '10px 22px', borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                    Explorar <ArrowIcon />
                  </button>
                </div>
              </div>
            </Link>

            {/* Atacado */}
            <Link href="/atacado" style={{ textDecoration: 'none' }}>
              <div className="catalog-hero-card" style={{
                height: '300px',
                background: `
                  linear-gradient(200deg,
                    rgba(255,252,246,0.9) 0%,
                    rgba(250,240,220,0.85) 50%,
                    rgba(242,228,200,0.78) 100%
                  )
                `,
              }}>
                <div style={{
                  position: 'absolute', bottom: '-30px', left: '-30px',
                  width: '160px', height: '160px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(200,137,26,0.16) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute', inset: 0, opacity: 0.025,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  pointerEvents: 'none',
                }} />

                <div className="card-content">
                  <span style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize: '9px', fontWeight: 800,
                    textTransform: 'uppercase', letterSpacing: '0.22em',
                    color: 'rgba(160,104,16,0.6)',
                    marginBottom: '8px',
                  }}>
                    Para revendedores
                  </span>
                  <h2 style={{
                    fontFamily: 'var(--font-playfair, serif)',
                    fontSize: '28px', fontWeight: 900,
                    color: 'var(--text)', lineHeight: 1.15,
                    letterSpacing: '-0.02em', marginBottom: '20px',
                  }}>
                    Catálogo<br />Atacado
                  </h2>
                  <button className="btn-glass" style={{ fontSize: '13px', padding: '10px 22px', borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                    Consultar <ArrowIcon />
                  </button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="el-divider" />

      {/* ── PRODUTOS ─────────────────────────────────────────── */}
      <main>
        <HomeProductSection initialProducts={products} categorias={settings.categorias || []} />
      </main>

      {/* ── RODAPÉ ───────────────────────────────────────────── */}
      <footer style={{
        background: 'linear-gradient(to bottom, transparent, rgba(200,137,26,0.04))',
        borderTop: '1px solid rgba(200,137,26,0.1)',
        padding: '40px 24px 36px',
        marginTop: '24px',
      }}>
        {/* Logo + nome */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ position: 'relative', width: '44px', height: '44px', margin: '0 auto 10px' }}>
            <Image
              src={settings.logoUrl || '/images/logo.png'}
              alt={settings.nome} fill sizes="44px"
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 2px 10px rgba(200,137,26,0.3))' }}
            />
          </div>
          <p style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: '18px', fontWeight: 700,
          }} className="gold-text">
            {settings.nome || 'Tabacaria Eldorado'}
          </p>
        </div>

        {/* Contato */}
        {(settings.whatsapp || settings.instagram) && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '18px' }}>
            {settings.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g,'')}`}
                target="_blank" rel="noopener noreferrer"
                className="lg-gold"
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '8px 16px', borderRadius: '50px',
                  fontSize: '13px', fontWeight: 600, color: 'var(--gold-deep)',
                  textDecoration: 'none', fontFamily: 'var(--font-inter, sans-serif)',
                }}>
                <WaIcon /> WhatsApp
              </a>
            )}
            {settings.instagram && (
              <a href={`https://instagram.com/${settings.instagram.replace('@','')}`}
                target="_blank" rel="noopener noreferrer"
                className="lg"
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '8px 16px', borderRadius: '50px',
                  fontSize: '13px', fontWeight: 600, color: 'var(--text-2)',
                  textDecoration: 'none', fontFamily: 'var(--font-inter, sans-serif)',
                }}>
                <IgIcon /> {settings.instagram}
              </a>
            )}
          </div>
        )}

        {/* Endereço */}
        {settings.endereco && (
          <p style={{
            textAlign: 'center', fontSize: '12px',
            color: 'var(--text-3)',
            fontFamily: 'var(--font-inter, sans-serif)',
            lineHeight: 1.6, marginBottom: '14px',
          }}>
            📍 {settings.endereco}
          </p>
        )}

        {/* Aviso retirada */}
        {settings.pickupNotice !== false && (
          <p style={{
            textAlign: 'center', fontSize: '10px', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            color: 'rgba(160,104,16,0.55)',
            fontFamily: 'var(--font-inter, sans-serif)',
            marginBottom: '18px',
          }}>
            Os produtos deverão ser retirados no local
          </p>
        )}

        {/* Copyright + admin */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <p style={{
            fontSize: '11px', color: 'var(--text-4)',
            fontFamily: 'var(--font-inter, sans-serif)',
          }}>
            © {new Date().getFullYear()} {settings.nome || 'Tabacaria Eldorado'}
          </p>
          <a href="/admin/login" style={{
            fontSize: '10px', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            color: 'var(--text-4)', opacity: 0.55,
            border: '1px solid var(--stroke-light)',
            borderRadius: '6px', padding: '3px 10px',
            textDecoration: 'none',
            fontFamily: 'var(--font-inter, sans-serif)',
          }}>
            Admin
          </a>
        </div>
      </footer>
    </div>
  )
}
