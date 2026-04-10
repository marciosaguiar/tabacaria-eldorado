/**
 * Analytics storage abstraction:
 * - Production (Vercel): uses @vercel/kv (Redis)
 * - Local development: uses data/analytics.json
 */

export interface AnalyticsData {
  pages: Record<string, number>
  products: Record<string, { name: string; views: number }>
}

const KV_KEY = 'analytics:data'

function useKV() {
  return !!process.env.KV_REST_API_URL
}

async function getKV() {
  const { kv } = await import('@vercel/kv')
  return kv
}

function readFile(): AnalyticsData {
  const fs = require('fs') as typeof import('fs')
  const path = require('path') as typeof import('path')
  try {
    const dataPath = path.join(process.cwd(), 'data', 'analytics.json')
    return JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  } catch {
    return { pages: {}, products: {} }
  }
}

function writeFile(data: AnalyticsData): void {
  const fs = require('fs') as typeof import('fs')
  const path = require('path') as typeof import('path')
  const dataPath = path.join(process.cwd(), 'data', 'analytics.json')
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')
}

export async function recordPageView(page: string): Promise<void> {
  try {
    if (useKV()) {
      const kv = await getKV()
      const data = (await kv.get<AnalyticsData>(KV_KEY)) ?? { pages: {}, products: {} }
      data.pages[page] = (data.pages[page] ?? 0) + 1
      await kv.set(KV_KEY, data)
    } else {
      const data = readFile()
      data.pages[page] = (data.pages[page] ?? 0) + 1
      writeFile(data)
    }
  } catch {
    // Analytics errors never break the app
  }
}

export async function recordProductView(id: string, name: string): Promise<void> {
  try {
    if (useKV()) {
      const kv = await getKV()
      const data = (await kv.get<AnalyticsData>(KV_KEY)) ?? { pages: {}, products: {} }
      const curr = data.products[id] ?? { name, views: 0 }
      data.products[id] = { name, views: curr.views + 1 }
      await kv.set(KV_KEY, data)
    } else {
      const data = readFile()
      const curr = data.products[id] ?? { name, views: 0 }
      data.products[id] = { name, views: curr.views + 1 }
      writeFile(data)
    }
  } catch {
    // Never break the app
  }
}

export async function getAnalytics(): Promise<{
  pages: Record<string, number>
  topProducts: Array<{ id: string; name: string; views: number }>
}> {
  try {
    let data: AnalyticsData
    if (useKV()) {
      const kv = await getKV()
      data = (await kv.get<AnalyticsData>(KV_KEY)) ?? { pages: {}, products: {} }
    } else {
      data = readFile()
    }

    const topProducts = Object.entries(data.products)
      .map(([id, v]) => ({ id, name: v.name, views: v.views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    return { pages: data.pages, topProducts }
  } catch {
    return { pages: {}, topProducts: [] }
  }
}
