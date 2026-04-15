import { NextResponse } from 'next/server'
import { verifyCredentials, createSessionToken, buildSessionCookie } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body ?? {}

    if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
      return NextResponse.json({ error: 'Usuário e senha são obrigatórios' }, { status: 400 })
    }

    const ok = await verifyCredentials(username, password)
    if (!ok) {
      // Delay genérico para mitigar brute-force
      await new Promise(r => setTimeout(r, 400))
      return NextResponse.json({ error: 'Usuário ou senha incorretos.' }, { status: 401 })
    }

    const token = await createSessionToken()
    const cookie = buildSessionCookie(token)

    return NextResponse.json(
      { ok: true },
      { headers: { 'Set-Cookie': cookie } },
    )
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
