import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CatalogGrid from '@/components/CatalogGrid'
import PromoBanner from '@/components/PromoBanner'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import { getProducts } from '@/lib/db'
import { getSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Catálogo Atacado — Tabacaria Eldorado',
  description: 'Catálogo de produtos para atacado da Tabacaria Eldorado. Preços especiais para revendedores.',
}

export default async function AtacadoPage() {
  const [allProducts, settings] = await Promise.all([getProducts(), getSettings()])
  const products = allProducts.filter(p => p.visivelAtacado)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--el-bg-page)' }}>
      <AnalyticsTracker page="atacado" />
      <Header channel="atacado" />
      <PromoBanner ativo={settings.bannerAtivo} texto={settings.bannerTexto} cor={settings.bannerCor} />
      <CatalogGrid
        initialProducts={products}
        categorias={settings.categorias || []}
        channel="atacado"
        whatsapp={settings.whatsapp || ''}
      />
      <Footer />
    </div>
  )
}
