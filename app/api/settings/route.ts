import { NextResponse } from 'next/server'
import { getSettings, saveSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settings = await getSettings()
    return NextResponse.json(settings)
  } catch (err) {
    console.error('Settings GET error:', err)
    return NextResponse.json({ error: 'Erro ao carregar configurações' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    await saveSettings(body)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Settings PUT error:', err)
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 })
  }
}
