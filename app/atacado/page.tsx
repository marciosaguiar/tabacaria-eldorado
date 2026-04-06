import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { getProducts } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Catálogo Atacado — Tabacaria Eldorado',
  description: 'Catálogo de produtos para atacado da Tabacaria Eldorado. Preços especiais para revendedores.',
  openGraph: {
    title: 'Catálogo Atacado — Tabacaria Eldorado',
    description: 'Produtos premium com preços de atacado.',
  },
}

export default async function AtacadoPage() {
  const allProducts = await getProducts()
  const products = allProducts.filter((p) => p.visivelAtacado)

  return (
    <div className="min-h-screen flex flex-col bg-dark">
      <Header channel="atacado" />

      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ borderBottom: '1px solid rgba(var(--gold-rgb), 0.12)' }}>
        <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
        <div className="absolute inset-0" style={{ background: 'var(--hero-glow)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <p
            className="text-[11px] font-inter tracking-[0.3em] uppercase mb-4"
            style={{ color: 'rgba(var(--gold-rgb), 0.55)' }}
          >
            Tabacaria Eldorado
          </p>
          <h1
            className="font-playfair text-3xl sm:text-4xl md:text-5xl mb-4 leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Catálogo de{' '}
            <span className="text-gold-shine">
              Atacado
            </span>
          </h1>
          <div
            className="h-px w-20 mx-auto mb-4"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--gold-rgb),0.6), transparent)' }}
          />
          <p className="font-inter text-sm" style={{ color: 'var(--text-secondary)' }}>
            Preços especiais para nossos parceiros atacadistas
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 w-full">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-16 h-16 border border-gold/20 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-7 h-7 text-gold/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <p className="text-gray-500 font-inter text-base mb-2">
              Nenhum produto disponível no momento.
            </p>
            <p className="text-gray-700 font-inter text-sm">
              Em breve novos produtos serão adicionados ao catálogo.
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 text-xs font-inter mb-6 tracking-wide">
              {products.length} {products.length === 1 ? 'produto disponível' : 'produtos disponíveis'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} channel="atacado" />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
