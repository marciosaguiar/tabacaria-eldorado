import { NextResponse } from 'next/server'
import { isAdminRequest, hashPassword, saveAdminCreds } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { username, password } = body ?? {}

    if (typeof username !== 'string' || !username.trim()) {
      return NextResponse.json({ error: 'Usuário não pode ser vazio.' }, { status: 400 })
    }
    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'A senha deve ter no mínimo 6 caracteres.' }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)
    await saveAdminCreds(username.trim(), passwordHash)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
