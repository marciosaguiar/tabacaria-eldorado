/**
 * Settings storage abstraction:
 * - Production (Vercel): uses @vercel/kv (Redis)
 * - Local development: uses data/settings.json
 */
import type { CompanySettings } from '@/types'

const KEY = 'company:settings'

export const DEFAULT_SETTINGS: CompanySettings = {
  nome: 'Tabacaria Eldorado',
  slogan: 'Produtos premium para os mais exigentes apreciadores',
  endereco: '',
  telefone: '',
  whatsapp: '',
  email: '',
  instagram: '',
  facebook: '',
  logoUrl: '/images/logo.png',
}

async function getKV() {
  const { kv } = await import('@vercel/kv')
  return kv
}

function useKV() {
  return !!process.env.KV_REST_API_URL
}

function fileGetSettings(): CompanySettings {
  const fs = require('fs') as typeof import('fs')
  const path = require('path') as typeof import('path')
  try {
    const dataPath = path.join(process.cwd(), 'data', 'settings.json')
    const raw = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    return { ...DEFAULT_SETTINGS, ...raw }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

function fileSaveSettings(settings: CompanySettings): void {
  const fs = require('fs') as typeof import('fs')
  const path = require('path') as typeof import('path')
  const dataPath = path.join(process.cwd(), 'data', 'settings.json')
  fs.writeFileSync(dataPath, JSON.stringify(settings, null, 2), 'utf-8')
}

export async function getSettings(): Promise<CompanySettings> {
  if (useKV()) {
    const kv = await getKV()
    const saved = await kv.get<CompanySettings>(KEY)
    return saved ? { ...DEFAULT_SETTINGS, ...saved } : { ...DEFAULT_SETTINGS }
  }
  return fileGetSettings()
}

export async function saveSettings(settings: CompanySettings): Promise<void> {
  if (useKV()) {
    const kv = await getKV()
    await kv.set(KEY, settings)
    return
  }
  fileSaveSettings(settings)
}
