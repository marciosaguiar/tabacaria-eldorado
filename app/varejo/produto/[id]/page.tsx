import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProducts } from '@/lib/db'
import { getSettings } from '@/lib/settings'
import ProductPageClient from '@/components/ProductPageClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const products = await getProducts()
  const product = products.find(p => p.id === params.id)
  if (!product) return { title: 'Produto nao encontrado' }
  return {
    title: `${product.nome} — Varejo | Tabacaria Eldorado`,
    description: product.descricao || `${product.nome} disponivel no catalogo varejo da Tabacaria Eldorado.`,
  }
}

export default async function VarejoProductPage({ params }: Props) {
  const [products, settings] = await Promise.all([getProducts(), getSettings()])
  const product = products.find(p => p.id === params.id && p.visivelVarejo)

  if (!product) notFound()

  return (
    <ProductPageClient
      product={product}
      channel="varejo"
      whatsapp={settings.whatsapp || ''}
    />
  )
}
