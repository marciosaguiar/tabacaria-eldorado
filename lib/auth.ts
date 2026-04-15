/**
 * Admin authentication utilities (Node.js runtime — API routes only).
 *
 * Sessions: HMAC-SHA256 signed timestamp cookie (httpOnly, SameSite=Strict, Secure em prod)
 * Credentials: armazenadas no KV (Vercel) ou data/admin.json (dev local)
 *
 * Para configurar em produção, adicione as variáveis de ambiente:
 *   ADMIN_SECRET   — segredo para assinar tokens (obrigatório alterar do padrão)
 *   ADMIN_USERNAME — usuário padrão inicial (padrão: 'admin')
 *   ADMIN_PASSWORD — senha padrão inicial (padrão: 'eldorado2024')
 *
 * Para uso no middleware (Edge Runtime), importe de @/lib/auth-edge.
 *
 * IMPORTANTE: este arquivo NÃO importa de @/lib/auth-edge para evitar que o
 * bundler do Edge Runtime inclua código Node.js no bundle do middleware.
 * As funções de sessão são duplicadas intencionalmente aqui.
 */

// ─── Constantes (duplicadas de auth-edge — manter em sincronia) ──────────────

export const COOKIE_NAME = 'eldorado_session'
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 dias

function getSecret(): string {
  return process.env.ADMIN_SECRET ?? 'eldorado-secret-dev-MUDE-EM-PRODUCAO'
}

// ─── HMAC session token (duplicado de auth-edge) ─────────────────────────────

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

export function buildSessionCookie(token: string): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  const maxAge = Math.floor(SESSION_MAX_AGE_MS / 1000)
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
}

// ─── Password hashing (SHA-256 + segredo como salt) ──────────────────────────

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(getSecret() + ':' + password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// ─── Credential storage ───────────────────────────────────────────────────────

interface AdminCredentials {
  username: string
  passwordHash: string
}

async function getAdminCreds(): Promise<AdminCredentials> {
  try {
    if (process.env.KV_REST_API_URL) {
      const { kv } = await import('@vercel/kv')
      const stored = await kv.get<AdminCredentials>('admin:credentials')
      if (stored) return stored
    } else {
      const { existsSync, readFileSync } = await import('fs')
      const { join } = await import('path')
      const p = join(process.cwd(), 'data', 'admin.json')
      if (existsSync(p)) {
        return JSON.parse(readFileSync(p, 'utf-8')) as AdminCredentials
      }
    }
  } catch {
    // cai no fallback abaixo
  }
  const defaultUser = process.env.ADMIN_USERNAME ?? 'admin'
  const defaultPass = process.env.ADMIN_PASSWORD ?? 'eldorado2024'
  return {
    username: defaultUser,
    passwordHash: await hashPassword(defaultPass),
  }
}

export async function saveAdminCreds(username: string, passwordHash: string): Promise<void> {
  const creds: AdminCredentials = { username, passwordHash }
  if (process.env.KV_REST_API_URL) {
    const { kv } = await import('@vercel/kv')
    await kv.set('admin:credentials', creds)
  } else {
    const { mkdirSync, writeFileSync } = await import('fs')
    const { join, dirname } = await import('path')
    const p = join(process.cwd(), 'data', 'admin.json')
    mkdirSync(dirname(p), { recursive: true })
    writeFileSync(p, JSON.stringify(creds, null, 2), 'utf-8')
  }
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const creds = await getAdminCreds()
  const hash = await hashPassword(password)
  return creds.username === username && creds.passwordHash === hash
}

// ─── Request authentication ───────────────────────────────────────────────────

/** Verifica se a request tem cookie de sessão admin válido */
export async function isAdminRequest(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get('cookie') ?? ''
  const re = new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`)
  const match = cookieHeader.match(re)
  if (!match) return false
  return verifySessionToken(decodeURIComponent(match[1]))
}
