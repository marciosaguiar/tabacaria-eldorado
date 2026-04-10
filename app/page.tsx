import Image from 'next/image'
import Link from 'next/link'
import HomeProductSection from '@/components/HomeProductSection'
import ThemeToggle from '@/components/ThemeToggle'
import AdminHeaderLink from '@/components/AdminHeaderLink'
import { getSettings } from '@/lib/settings'
import { getProducts } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// SVG icons
const ShoppingBagIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
)
const BoxIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)
const ChevronRightIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)
const WaIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)
const InstagramIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

export default async function HomePage() {
  const [settings, products] = await Promise.all([getSettings(), getProducts()])

  const CatalogCard = ({ href, icon, title, subtitle }: { href: string; icon: React.ReactNode; title: string; subtitle: string }) => (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '20px',
        backgroundColor: 'var(--el-bg-surface)',
        border: 'var(--el-border-card)',
        borderRadius: 'var(--el-radius-md)',
        boxShadow: 'var(--el-shadow-card)',
        textDecoration: 'none',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease',
      }}
      onMouseEnter={undefined}
    >
      <span style={{ color: 'var(--el-gold-solid)', flexShrink: 0, display: 'flex' }}>
        {icon}
      </span>
      <div style={{ flex: 1 }}>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--el-text-primary)',
            lineHeight: 1.3,
          }}
        >
          {title}
        </span>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-inter, sans-serif)',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--el-text-secondary)',
            marginTop: '3px',
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </span>
      </div>
      <span style={{ color: 'var(--el-gold-solid)', flexShrink: 0, display: 'flex', opacity: 0.7 }}>
        <ChevronRightIcon />
      </span>
    </Link>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--el-bg-page)' }}>

      {/* ── HERO HEADER ─────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--el-gradient-dark)',
          minHeight: '280px',
          paddingTop: '48px',
          paddingBottom: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Utility icons top-right */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AdminHeaderLink />
          <ThemeToggle />
        </div>

        {/* Logo */}
        <div
          style={{
            position: 'relative',
            width: '120px',
            height: '120px',
            marginBottom: '20px',
            filter: 'drop-shadow(0 0 24px rgba(201,150,42,0.3))',
          }}
        >
          <Image
            src={settings.logoUrl || '/images/logo.png'}
            alt={settings.nome}
            fill
            sizes="120px"
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        {/* Company name */}
        <h1
          className="el-gold-text"
          style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: '28px',
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '8px',
          }}
        >
          {settings.nome || 'Tabacaria Eldorado'}
        </h1>

        {/* Tagline */}
        {settings.slogan && (
          <p
            style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: '14px',
              color: '#D4A84B',
              letterSpacing: '0.05em',
              lineHeight: 1.6,
              maxWidth: '300px',
              marginTop: '4px',
            }}
          >
            {settings.slogan}
          </p>
        )}
      </section>

      {/* ── SEPARADOR ORNAMENTAL ───────────────────────────────── */}
      <div
        style={{
          height: '1px',
          margin: '0 32px',
          background: 'linear-gradient(90deg, transparent, var(--el-gold-solid), transparent)',
        }}
      />

      {/* ── BOTÕES DE CATÁLOGO ──────────────────────────────────── */}
      <div
        style={{
          padding: '28px 16px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '480px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <CatalogCard
          href="/varejo"
          icon={<ShoppingBagIcon />}
          title="Catálogo Varejo"
          subtitle="Para o consumidor final"
        />
        <CatalogCard
          href="/atacado"
          icon={<BoxIcon />}
          title="Catálogo Atacado"
          subtitle="Para revendedores"
        />
      </div>

      {/* ── PRODUTOS ─────────────────────────────────────────────── */}
      <main style={{ flex: 1 }}>
        <HomeProductSection initialProducts={products} categorias={settings.categorias || []} />
      </main>

      {/* ── RODAPÉ DARK ─────────────────────────────────────────── */}
      <footer style={{ background: 'var(--el-gradient-dark)', padding: '28px 20px 24px' }}>

        {/* Contato — WhatsApp e Instagram */}
        {(settings.whatsapp || settings.instagram) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '16px',
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
                  gap: '8px',
                  padding: '8px 16px',
                  border: '0.5px solid rgba(255,255,255,0.3)',
                  borderRadius: '20px',
                  fontFamily: 'var(--font-inter, sans-serif)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#D4A84B',
                  textDecoration: 'none',
                  lineHeight: 1.4,
                  transition: 'opacity 0.2s',
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
                  gap: '8px',
                  padding: '8px 16px',
                  border: '0.5px solid rgba(255,255,255,0.3)',
                  borderRadius: '20px',
                  fontFamily: 'var(--font-inter, sans-serif)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#D4A84B',
                  textDecoration: 'none',
                  lineHeight: 1.4,
                  transition: 'opacity 0.2s',
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
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.6,
              marginBottom: '16px',
            }}
          >
            📍 {settings.endereco}
          </p>
        )}

        {/* Copyright + admin link */}
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.3)',
              lineHeight: 1.4,
              marginBottom: '12px',
            }}
          >
            © {new Date().getFullYear()} {settings.nome || 'Tabacaria Eldorado'}. Todos os direitos reservados.
          </p>
          <a
            href="/admin/login"
            style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--el-text-hint)',
              border: '0.5px solid var(--el-gold-border)',
              borderRadius: '6px',
              padding: '4px 10px',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
              opacity: 0.7,
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
