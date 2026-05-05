/**
 * POST /api/admin/migrate-images
 *
 * Comprime e re-faz upload de UMA imagem de produto por chamada.
 * Converte PNG/JPG grandes para WebP ≤ 300 KB no Vercel Blob.
 *
 * Body: { productId: string }   — ou omita para pegar o próximo pendente
 * Response:
 *   { done: true }                        — nenhum produto pendente
 *   { converted: Product, remaining: n }  — convertido com sucesso
 *   { skipped: Product, remaining: n }    — já é WebP, pulado
 *   { error: string }                     — falha
 */

import { NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/auth'
import { getProducts, saveProducts } from '@/lib/db'
import { Product } from '@/types'

export const dynamic = 'force-dynamic'
// Aumenta o tempo limite para 60s (disponível no plano Pro; Hobby usa 10s)
export const maxDuration = 60

async function compressToWebP(imageUrl: string): Promise<Buffer> {
  // Download da imagem original
  const res = await fetch(imageUrl)
  if (!res.ok) throw new Error(`HTTP ${res.status} ao buscar imagem`)
  const rawBuffer = Buffer.from(await res.arrayBuffer())

  const sharp = (await import('sharp')).default
  const MAX = 300 * 1024 // 300 KB

  for (const quality of [82, 72, 60, 48, 36]) {
    const out = await sharp(rawBuffer)
      .rotate()
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality })
      .toBuffer()
    if (out.length <= MAX || quality === 36) return out
  }
  return sharp(rawBuffer).webp({ quality: 36 }).toBuffer()
}

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const products = await getProducts()
  const pending = products.filter(p => p.imagem && !p.imagem.endsWith('.webp'))
  return NextResponse.json({ pending: pending.length, total: products.length })
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const products = await getProducts()

  // Seleciona o produto: por ID ou o próximo não-WebP
  let product: Product | undefined
  if (body.productId) {
    product = products.find(p => p.id === body.productId)
  } else {
    product = products.find(p => p.imagem && !p.imagem.endsWith('.webp'))
  }

  if (!product) {
    return NextResponse.json({ done: true })
  }

  // Já é WebP — pula
  if (!product.imagem || product.imagem.endsWith('.webp')) {
    const remaining = products.filter(p => p.imagem && !p.imagem.endsWith('.webp')).length
    return NextResponse.json({ skipped: product, remaining })
  }

  try {
    const webpBuffer = await compressToWebP(product.imagem)

    // Upload para Vercel Blob
    const { put } = await import('@vercel/blob')
    const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`
    const blob = await put(filename, webpBuffer, {
      access: 'public',
      contentType: 'image/webp',
    })

    // Atualiza produto no banco
    const idx = products.findIndex(p => p.id === product!.id)
    products[idx] = { ...products[idx], imagem: blob.url }
    await saveProducts(products)

    const remaining = products.filter(p => p.imagem && !p.imagem.endsWith('.webp')).length
    return NextResponse.json({ converted: products[idx], remaining })
  } catch (err) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Erro desconhecido',
      productId: product.id,
      productName: product.nome,
    }, { status: 500 })
  }
}
