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
      <div className="relative border-b border-gold/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-card via-dark to-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.06),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <p className="text-gold/50 text-[11px] font-inter tracking-[0.3em] uppercase mb-4">
            Tabacaria Eldorado
          </p>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl mb-4 leading-tight" style={{ color: 'var(--text-primary)' }}>
            Catálogo de{' '}
            <span
              className="text-gold-shine"
              style={{ textShadow: '0 0 40px rgba(var(--gold-rgb), 0.3)' }}
            >
              Atacado
            </span>
          </h1>
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-gold/60 to-transparent mx-auto mb-4" />
          <p className="text-gray-500 font-inter text-sm">
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
