import Image from 'next/image'
import Link from 'next/link'
import HomeProductSection from '@/components/HomeProductSection'
import ThemeToggle from '@/components/ThemeToggle'
import AdminHeaderLink from '@/components/AdminHeaderLink'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import { getSettings } from '@/lib/settings'
import { getProducts } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/* ── Ícones ─────────────────────────────────────────────────── */
const ArrowIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)
const WaIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)
const IgIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

export default async function HomePage() {
  const [settings, products] = await Promise.all([getSettings(), getProducts()])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#080808', color: '#fff', overflowX: 'hidden' }}>
      <AnalyticsTracker page="home" />

      {/* ── HERO SECTION ─────────────────────────────────────────
          Fundo com gradiente âmbar como Apple Music             */}
      <section style={{ position: 'relative', minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>

        {/* Ambient glow background */}
        <div className="ambient-glow" />

        {/* Grain texture overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        }} />

        {/* ── NAV PILL (iOS style) ─────────────────────────────── */}
        <nav
          className="glass"
          style={{
            position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)',
            zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 16px',
            borderRadius: '50px',
            width: 'calc(100% - 32px)',
            maxWidth: '560px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div style={{ position: 'relative', width: '30px', height: '30px' }}>
              <Image
                src={settings.logoUrl || '/images/logo.png'}
                alt={settings.nome} fill sizes="30px"
                style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(240,160,48,0.5))' }}
                priority
              />
            </div>
            <span style={{
              fontFamily: 'var(--font-playfair, serif)',
              fontSize: '15px', fontWeight: 700, color: '#fff',
              letterSpacing: '-0.02em',
            }}>
              {settings.nome || 'Tabacaria Eldorado'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AdminHeaderLink />
            <ThemeToggle />
          </div>
        </nav>

        {/* ── HERO CONTENT ──────────────────────────────────────── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', textAlign: 'center',
          padding: '100px 24px 48px', position: 'relative', zIndex: 1,
        }}>
          {/* Logo grande com glow */}
          <div style={{
            position: 'relative', width: '160px', height: '160px',
            marginBottom: '28px',
          }}>
            <Image
              src={settings.logoUrl || '/images/logo.png'}
              alt={settings.nome} fill sizes="160px"
              style={{
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 40px rgba(240,160,48,0.7)) drop-shadow(0 0 80px rgba(240,160,48,0.3))',
              }}
              priority
            />
          </div>

          {/* Nome da empresa */}
          <h1
            className="el-gold-text"
            style={{
              fontFamily: 'var(--font-playfair, serif)',
              fontSize: 'clamp(32px, 8vw, 56px)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '12px',
            }}
          >
            {settings.nome || 'Tabacaria Eldorado'}
          </h1>

          {/* Slogan */}
          {settings.slogan && (
            <p style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: '16px',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.02em',
              fontWeight: 400,
              maxWidth: '280px',
              lineHeight: 1.5,
              marginBottom: '40px',
            }}>
              {settings.slogan}
            </p>
          )}

          {/* ── DOIS CARTÕES HERO (Apple Music style) ──────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px',
            width: '100%',
            maxWidth: '580px',
          }}>

            {/* Card Varejo */}
            <Link href="/varejo" style={{ textDecoration: 'none' }}>
              <div className="catalog-hero-card" style={{
                height: '320px',
                background: `
                  radial-gradient(ellipse 80% 60% at 60% 20%, rgba(200,120,0,0.55) 0%, transparent 65%),
                  radial-gradient(ellipse 60% 40% at 10% 80%, rgba(160,80,0,0.3) 0%, transparent 55%),
                  linear-gradient(155deg, #2A1200 0%, #140800 50%, #080808 100%)
                `,
              }}>
                <div className="card-overlay" />
                <div className="card-content">
                  <span style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize: '10px', fontWeight: 800,
                    textTransform: 'uppercase', letterSpacing: '0.22em',
                    color: 'rgba(240,160,48,0.8)',
                    marginBottom: '10px',
                  }}>
                    Premium
                  </span>
                  <h2 style={{
                    fontFamily: 'var(--font-playfair, serif)',
                    fontSize: '30px', fontWeight: 900,
                    color: '#fff', lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    marginBottom: '20px',
                  }}>
                    Catálogo<br />Varejo
                  </h2>
                  <span className="btn-gold" style={{ fontSize: '13px', padding: '10px 22px', borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                    Explorar <ArrowIcon />
                  </span>
                </div>
              </div>
            </Link>

            {/* Card Atacado */}
            <Link href="/atacado" style={{ textDecoration: 'none' }}>
              <div className="catalog-hero-card" style={{
                height: '320px',
                background: `
                  radial-gradient(ellipse 70% 50% at 35% 25%, rgba(180,100,0,0.4) 0%, transparent 60%),
                  radial-gradient(ellipse 50% 35% at 80% 75%, rgba(120,60,0,0.25) 0%, transparent 50%),
                  linear-gradient(200deg, #1E0E00 0%, #0E0500 55%, #080808 100%)
                `,
              }}>
                <div className="card-overlay" />
                <div className="card-content">
                  <span style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize: '10px', fontWeight: 800,
                    textTransform: 'uppercase', letterSpacing: '0.22em',
                    color: 'rgba(200,140,60,0.7)',
                    marginBottom: '10px',
                  }}>
                    Business
                  </span>
                  <h2 style={{
                    fontFamily: 'var(--font-playfair, serif)',
                    fontSize: '30px', fontWeight: 900,
                    color: '#fff', lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    marginBottom: '20px',
                  }}>
                    Catálogo<br />Atacado
                  </h2>
                  <span className="btn-ghost" style={{ fontSize: '13px', padding: '10px 22px', borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                    Consultar <ArrowIcon />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Scroll hint */}
          <div style={{
            marginTop: '36px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            opacity: 0.35,
          }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: '#fff' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="el-divider" />

      {/* ── PRODUTOS ─────────────────────────────────────────────── */}
      <main style={{ backgroundColor: '#080808' }}>
        <HomeProductSection initialProducts={products} categorias={settings.categorias || []} />
      </main>

      {/* ── RODAPÉ ───────────────────────────────────────────────── */}
      <footer style={{
        background: 'linear-gradient(to bottom, #0a0a0a, #050505)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '40px 24px 36px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ position: 'relative', width: '52px', height: '52px', margin: '0 auto 12px' }}>
            <Image
              src={settings.logoUrl || '/images/logo.png'}
              alt={settings.nome} fill sizes="52px"
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 16px rgba(240,160,48,0.4))' }}
            />
          </div>
          <p style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: '20px', fontWeight: 700,
            background: 'linear-gradient(135deg, #C07820, #F0A030, #FFD060)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {settings.nome || 'Tabacaria Eldorado'}
          </p>
        </div>

        {/* Contato */}
        {(settings.whatsapp || settings.instagram) && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {settings.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g,'')}`}
                target="_blank" rel="noopener noreferrer"
                className="glass-gold"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '9px 18px', borderRadius: '50px',
                  fontSize: '13px', fontWeight: 600, color: '#F0A030',
                  textDecoration: 'none', fontFamily: 'var(--font-inter, sans-serif)',
                }}
              >
                <WaIcon /> WhatsApp
              </a>
            )}
            {settings.instagram && (
              <a href={`https://instagram.com/${settings.instagram.replace('@','')}`}
                target="_blank" rel="noopener noreferrer"
                className="glass"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '9px 18px', borderRadius: '50px',
                  fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none', fontFamily: 'var(--font-inter, sans-serif)',
                }}
              >
                <IgIcon /> {settings.instagram}
              </a>
            )}
          </div>
        )}

        {/* Endereço */}
        {settings.endereco && (
          <p style={{
            textAlign: 'center', fontSize: '12px',
            color: 'rgba(255,255,255,0.3)',
            fontFamily: 'var(--font-inter, sans-serif)',
            lineHeight: 1.6, marginBottom: '16px',
          }}>
            📍 {settings.endereco}
          </p>
        )}

        {/* Aviso retirada */}
        {settings.pickupNotice !== false && (
          <p style={{
            textAlign: 'center', fontSize: '11px', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            color: 'rgba(240,160,48,0.45)',
            fontFamily: 'var(--font-inter, sans-serif)',
            marginBottom: '20px',
          }}>
            Os produtos deverão ser retirados no local
          </p>
        )}

        {/* Copyright */}
        <p style={{
          textAlign: 'center', fontSize: '11px',
          color: 'rgba(255,255,255,0.18)',
          fontFamily: 'var(--font-inter, sans-serif)',
          marginBottom: '14px',
        }}>
          © {new Date().getFullYear()} {settings.nome || 'Tabacaria Eldorado'}
        </p>

        {/* Admin */}
        <div style={{ textAlign: 'center' }}>
          <a href="/admin/login" style={{
            fontFamily: 'var(--font-inter, sans-serif)',
            fontSize: '10px', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px', padding: '4px 12px',
            textDecoration: 'none',
          }}>
            Admin
          </a>
        </div>
      </footer>
    </div>
  )
}
