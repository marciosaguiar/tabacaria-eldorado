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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--el-bg-page)' }}>
      <Header channel="varejo" />
      <PromoBanner ativo={settings.bannerAtivo} texto={settings.bannerTexto} cor={settings.bannerCor} />
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
