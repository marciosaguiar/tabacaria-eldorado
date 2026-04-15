import { NextResponse } from 'next/server'
import { getSettings, saveSettings } from '@/lib/settings'
import { isAdminRequest } from '@/lib/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const SettingsSchema = z.object({
  nome:                 z.string().max(100).optional().default(''),
  slogan:               z.string().max(200).optional().default(''),
  footerPhrase:         z.string().max(300).optional().default(''),
  endereco:             z.string().max(200).optional().default(''),
  telefone:             z.string().max(30).optional().default(''),
  whatsapp:             z.string().max(20).optional().default(''),
  email:                z.string().email().or(z.literal('')).optional().default(''),
  instagram:            z.string().max(100).optional().default(''),
  facebook:             z.string().max(100).optional().default(''),
  logoUrl:              z.string().max(500).optional().default(''),
  mapsUrl:              z.string().max(500).optional().default(''),
  categorias:           z.array(z.string().max(50)).optional().default([]),
  catalogOrdem:         z.enum(['cadastro', 'nome', 'preco-asc', 'preco-desc']).optional().default('cadastro'),
  mostrarPrecoSemValor: z.boolean().optional().default(true),
  bannerAtivo:          z.boolean().optional().default(false),
  bannerTexto:          z.string().max(300).optional().default(''),
  bannerCor:            z.string().max(20).optional().default('#C9A84C'),
})

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
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  try {
    const raw = await request.json()
    const parsed = SettingsSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten() },
        { status: 400 },
      )
    }
    await saveSettings(parsed.data)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Settings PUT error:', err)
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 })
  }
}
