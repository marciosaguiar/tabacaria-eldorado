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
 */

// Importa as funções edge-safe para uso local e re-exporta para consumidores
import {
  COOKIE_NAME,
  createSessionToken,
  verifySessionToken,
  buildSessionCookie,
  clearSessionCookie,
} from '@/lib/auth-edge'

export {
  COOKIE_NAME,
  createSessionToken,
  verifySessionToken,
  buildSessionCookie,
  clearSessionCookie,
}

function getSecret(): string {
  return process.env.ADMIN_SECRET ?? 'eldorado-secret-dev-MUDE-EM-PRODUCAO'
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
      const fs   = require('fs')   as typeof import('fs')
      const path = require('path') as typeof import('path')
      const p = path.join(process.cwd(), 'data', 'admin.json')
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf-8')) as AdminCredentials
      }
    }
  } catch {
    // cai no fallback abaixo
  }

  // Credenciais padrão — do env ou hardcoded
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
    const fs   = require('fs')   as typeof import('fs')
    const path = require('path') as typeof import('path')
    const p = path.join(process.cwd(), 'data', 'admin.json')
    fs.mkdirSync(path.dirname(p), { recursive: true })
    fs.writeFileSync(p, JSON.stringify(creds, null, 2), 'utf-8')
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
