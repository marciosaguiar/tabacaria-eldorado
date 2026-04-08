import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CatalogGrid from '@/components/CatalogGrid'
import PromoBanner from '@/components/PromoBanner'
import { getProducts } from '@/lib/db'
import { getSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Catálogo Varejo — Tabacaria Eldorado',
  description: 'Catálogo de produtos varejo da Tabacaria Eldorado. Produtos premium selecionados.',
}

export default async function VarejoPage() {
  const [allProducts, settings] = await Promise.all([getProducts(), getSettings()])
  const products = allProducts.filter(p => p.visivelVarejo)

  return (
    <div className="min-h-screen flex flex-col bg-dark">
      <Header channel="varejo" />
      <PromoBanner ativo={settings.bannerAtivo} texto={settings.bannerTexto} cor={settings.bannerCor} />

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ borderBottom: '1px solid rgba(var(--gold-rgb),0.12)' }}>
        <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
        <div className="absolute inset-0" style={{ background: 'var(--hero-glow)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <p className="text-[11px] font-inter tracking-[0.3em] uppercase mb-3" style={{ color: 'rgba(var(--gold-rgb),0.55)' }}>
            Tabacaria Eldorado
          </p>
          <h1 className="font-playfair font-bold text-3xl sm:text-4xl md:text-5xl mb-4 leading-tight" style={{ color: 'var(--text-primary)' }}>
            Catálogo de <span className="text-gold-shine">Varejo</span>
          </h1>
          <div className="h-px w-20 mx-auto mb-4"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--gold-rgb),0.6), transparent)' }} />
          <p className="font-inter text-sm" style={{ color: 'var(--text-secondary)' }}>
            Produtos premium selecionados para você
          </p>
        </div>
      </div>

      <CatalogGrid
        initialProducts={products}
        categorias={settings.categorias || []}
        channel="varejo"
        whatsapp={settings.whatsapp || ''}
      />

      <Footer />
    </div>
  )
}
