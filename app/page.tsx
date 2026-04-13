import Image from 'next/image'
import Link from 'next/link'
import HomeProductSection from '@/components/HomeProductSection'
import AdminHeaderLink from '@/components/AdminHeaderLink'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import { getSettings } from '@/lib/settings'
import { getProducts } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/* ── Ícone SVG — Seta direita ──────────────────────────────── */
const ArrowRight = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

/* ── Ícone WhatsApp ─────────────────────────────────────────── */
const WaIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

/* ── Ícone Instagram ────────────────────────────────────────── */
const InstagramIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

export default async function HomePage() {
  const [settings, products] = await Promise.all([getSettings(), getProducts()])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#200f0a', color: '#fedbd2' }}>
      <AnalyticsTracker page="home" />

      {/* ── NAV — glass bar ──────────────────────────────────────── */}
      <nav
        className="glass-nav"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderBottom: '1px solid rgba(233,193,118,0.08)',
        }}
      >
        {/* Logo + nome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', width: '36px', height: '36px', flexShrink: 0 }}>
            <Image
              src={settings.logoUrl || '/images/logo.png'}
              alt={settings.nome}
              fill
              sizes="36px"
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(233,193,118,0.3))' }}
              priority
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-newsreader, serif)',
              fontSize: '18px',
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#e9c176',
              letterSpacing: '-0.01em',
            }}
          >
            {settings.nome || 'Tabacaria Eldorado'}
          </span>
        </div>

        {/* Admin link */}
        <AdminHeaderLink />
      </nav>

      {/* ── HERO — dois cards grandes ─────────────────────────────── */}
      <section
        style={{
          paddingTop: '80px',   /* altura da nav */
          padding: '80px 16px 0',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: 'var(--font-inter, sans-serif)',
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            color: '#c5a059',
            textAlign: 'center',
            paddingTop: '24px',
            marginBottom: '12px',
          }}
        >
          Catálogos
        </p>

        {/* Heading editorial */}
        <h1
          style={{
            fontFamily: 'var(--font-newsreader, serif)',
            fontSize: 'clamp(28px, 6vw, 44px)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#fedbd2',
            textAlign: 'center',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            marginBottom: '32px',
          }}
        >
          {settings.slogan || 'Experiência Premium'}
        </h1>

        {/* Cards héroe */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {/* Card Varejo */}
          <Link href="/varejo" style={{ textDecoration: 'none' }}>
            <div
              className="catalog-hero-card"
              style={{
                height: '420px',
                background: `
                  radial-gradient(ellipse at 70% 20%, rgba(233,193,118,0.08) 0%, transparent 60%),
                  linear-gradient(160deg, #39251f 0%, #291712 60%, #1a0a06 100%)
                `,
              }}
            >
              {/* Decorative pattern */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.06,
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    #e9c176 0px,
                    #e9c176 1px,
                    transparent 1px,
                    transparent 28px
                  )`,
                }}
              />
              <div className="card-overlay" />
              <div className="card-content">
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.22em',
                    color: '#e9c176',
                    marginBottom: '10px',
                  }}
                >
                  Premium Experience
                </span>
                <h2
                  style={{
                    fontFamily: 'var(--font-newsreader, serif)',
                    fontSize: '36px',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    color: '#fedbd2',
                    lineHeight: 1.15,
                    marginBottom: '24px',
                  }}
                >
                  Catálogo<br />Varejo
                </h2>
                <button
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    backgroundColor: '#e9c176',
                    color: '#412d00',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    letterSpacing: '0.02em',
                  }}
                >
                  Explorar <ArrowRight />
                </button>
              </div>
            </div>
          </Link>

          {/* Card Atacado */}
          <Link href="/atacado" style={{ textDecoration: 'none' }}>
            <div
              className="catalog-hero-card"
              style={{
                height: '420px',
                background: `
                  radial-gradient(ellipse at 30% 80%, rgba(233,193,118,0.06) 0%, transparent 55%),
                  linear-gradient(200deg, #2e1b16 0%, #1a0a06 100%)
                `,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.05,
                  backgroundImage: `repeating-linear-gradient(
                    -45deg,
                    #e9c176 0px,
                    #e9c176 1px,
                    transparent 1px,
                    transparent 28px
                  )`,
                }}
              />
              <div className="card-overlay" />
              <div className="card-content">
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.22em',
                    color: '#c5a059',
                    marginBottom: '10px',
                  }}
                >
                  Business &amp; Volume
                </span>
                <h2
                  style={{
                    fontFamily: 'var(--font-newsreader, serif)',
                    fontSize: '36px',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    color: '#fedbd2',
                    lineHeight: 1.15,
                    marginBottom: '24px',
                  }}
                >
                  Catálogo<br />Atacado
                </h2>
                <button
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    backgroundColor: 'transparent',
                    color: '#fedbd2',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: '1px solid rgba(209,197,180,0.25)',
                    cursor: 'pointer',
                    letterSpacing: '0.02em',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  Consultar <ArrowRight />
                </button>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── SEPARADOR ────────────────────────────────────────────── */}
      <div
        style={{
          height: '1px',
          margin: '40px 24px 0',
          background: 'linear-gradient(90deg, transparent, rgba(233,193,118,0.2), transparent)',
        }}
      />

      {/* ── PRODUTOS ─────────────────────────────────────────────── */}
      <main>
        <HomeProductSection
          initialProducts={products}
          categorias={settings.categorias || []}
        />
      </main>

      {/* ── RODAPÉ ───────────────────────────────────────────────── */}
      <footer
        style={{
          backgroundColor: '#1a0a06',
          borderTop: '1px solid rgba(233,193,118,0.08)',
          padding: '32px 20px 28px',
        }}
      >
        {/* Logo + nome */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              position: 'relative',
              width: '48px',
              height: '48px',
              margin: '0 auto 10px',
            }}
          >
            <Image
              src={settings.logoUrl || '/images/logo.png'}
              alt={settings.nome}
              fill
              sizes="48px"
              style={{
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 12px rgba(233,193,118,0.3))',
              }}
            />
          </div>
          <p
            style={{
              fontFamily: 'var(--font-newsreader, serif)',
              fontSize: '18px',
              fontStyle: 'italic',
              color: '#e9c176',
            }}
          >
            {settings.nome || 'Tabacaria Eldorado'}
          </p>
        </div>

        {/* Contato */}
        {(settings.whatsapp || settings.instagram) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              marginBottom: '20px',
            }}
          >
            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 16px',
                  backgroundColor: 'rgba(233,193,118,0.08)',
                  border: '1px solid rgba(233,193,118,0.15)',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-inter, sans-serif)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#e9c176',
                  textDecoration: 'none',
                }}
              >
                <WaIcon /> WhatsApp
              </a>
            )}
            {settings.instagram && (
              <a
                href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 16px',
                  backgroundColor: 'rgba(233,193,118,0.08)',
                  border: '1px solid rgba(233,193,118,0.15)',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-inter, sans-serif)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#d1c5b4',
                  textDecoration: 'none',
                }}
              >
                <InstagramIcon /> {settings.instagram}
              </a>
            )}
          </div>
        )}

        {/* Endereço */}
        {settings.endereco && (
          <p
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: '12px',
              color: '#9a8f80',
              lineHeight: 1.6,
              marginBottom: '20px',
            }}
          >
            📍 {settings.endereco}
          </p>
        )}

        {/* Aviso retirada */}
        {settings.pickupNotice !== false && (
          <p
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#c5a059',
              marginBottom: '20px',
            }}
          >
            Os produtos deverão ser retirados no local
          </p>
        )}

        {/* Copyright */}
        <p
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-inter, sans-serif)',
            fontSize: '11px',
            color: 'rgba(154,143,128,0.5)',
            marginBottom: '12px',
          }}
        >
          © {new Date().getFullYear()} {settings.nome || 'Tabacaria Eldorado'}
        </p>

        {/* Admin */}
        <div style={{ textAlign: 'center' }}>
          <a
            href="/admin/login"
            style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#4e4639',
              border: '1px solid #4e4639',
              borderRadius: '4px',
              padding: '4px 10px',
              textDecoration: 'none',
            }}
            title="Acesso administrativo"
          >
            Admin
          </a>
        </div>
      </footer>
    </div>
  )
}
