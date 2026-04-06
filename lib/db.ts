/**
 * Database abstraction:
 * - Production (Vercel): uses @vercel/kv (Redis)
 * - Local development: uses data/products.json
 */
import { Product } from '@/types'

const KEY = 'products'

async function getKV() {
  const { kv } = await import('@vercel/kv')
  return kv
}

function useKV() {
  return !!process.env.KV_REST_API_URL
}

// ─── File-based fallback (local dev) ─────────────────────────────────────────
function fileGetProducts(): Product[] {
  const fs = require('fs') as typeof import('fs')
  const path = require('path') as typeof import('path')
  try {
    const dataPath = path.join(process.cwd(), 'data', 'products.json')
    return JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  } catch {
    return []
  }
}

function fileSaveProducts(products: Product[]): void {
  const fs = require('fs') as typeof import('fs')
  const path = require('path') as typeof import('path')
  const dataPath = path.join(process.cwd(), 'data', 'products.json')
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2), 'utf-8')
}

// ─── Public API ───────────────────────────────────────────────────────────────
export async function getProducts(): Promise<Product[]> {
  if (useKV()) {
    const kv = await getKV()
    return (await kv.get<Product[]>(KEY)) ?? []
  }
  return fileGetProducts()
}

export async function saveProducts(products: Product[]): Promise<void> {
  if (useKV()) {
    const kv = await getKV()
    await kv.set(KEY, products)
    return
  }
  fileSaveProducts(products)
}
