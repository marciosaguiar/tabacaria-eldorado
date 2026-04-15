/**
 * auth-edge.ts — subset of auth utilities safe to run on Edge Runtime.
 * Only uses Web Crypto API — no Node.js APIs, no file system, no @vercel/kv.
 * Imported by middleware.ts which runs on Edge.
 */

export const COOKIE_NAME = 'eldorado_session'
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 dias

function getSecret(): string {
  return process.env.ADMIN_SECRET ?? 'eldorado-secret-dev-MUDE-EM-PRODUCAO'
}

// ─── HMAC session token ───────────────────────────────────────────────────────

export async function createSessionToken(): Promise<string> {
  const timestamp = Date.now().toString()
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(timestamp))
  const hex = Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  return `${timestamp}.${hex}`
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const dot = token.indexOf('.')
    if (dot === -1) return false
    const timestamp = token.slice(0, dot)
    const hex = token.slice(dot + 1)
    const age = Date.now() - parseInt(timestamp, 10)
    if (age > SESSION_MAX_AGE_MS || age < 0) return false

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(getSecret()),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    )
    const sigBytes = new Uint8Array(
      (hex.match(/.{2}/g) ?? []).map(b => parseInt(b, 16)),
    )
    return await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(timestamp))
  } catch {
    return false
  }
}

/** Cookie Set-Cookie header value */
export function buildSessionCookie(token: string): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  const maxAge = Math.floor(SESSION_MAX_AGE_MS / 1000)
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`
}

/** Cookie para limpar a sessão */
export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
}
